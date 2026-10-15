import { createHash } from "node:crypto";
import type Stripe from "stripe";
import type { Offer } from "./offer-config.ts";

export class BillingError extends Error {
  status: number;
  constructor(message: string, status = 400) { super(message); this.status = status; }
}

export type BillingIdentity = {
  userId: string;
  email: string;
  customerId: string | null;
  saveCustomerId: (id: string) => Promise<void>;
};

export async function accountCustomer(stripe: Stripe, identity: BillingIdentity, create = false) {
  if (identity.customerId) {
    const customer = await stripe.customers.retrieve(identity.customerId);
    if (customer.deleted || customer.metadata.clerkUserId !== identity.userId) {
      throw new BillingError("We couldn’t verify your billing account. Please contact us.", 403);
    }
    return customer;
  }
  if (!create) return null;
  // Stable parameters and key make concurrent first checkouts use one customer.
  // Save the mapping before any checkout can collect money.
  const customer = await stripe.customers.create(
    { metadata: { clerkUserId: identity.userId } },
    { idempotencyKey: `framforge-customer-${identity.userId}` },
  );
  await identity.saveCustomerId(customer.id);
  return customer;
}

export function checkoutParameters(offer: Offer, customerId: string, userId: string, appUrl: string): Stripe.Checkout.SessionCreateParams {
  return {
    mode: "subscription",
    customer: customerId,
    client_reference_id: userId,
    integration_identifier: "framforge_custom_offers_qmxkrvpa",
    line_items: [
      { quantity: 1, price_data: { currency: "usd", unit_amount: offer.websiteCents, product_data: { name: `${offer.title} — website` } } },
      { quantity: 1, price_data: { currency: "usd", unit_amount: offer.monthlyCents, recurring: { interval: "month" }, product_data: { name: `${offer.title} — monthly retainer` } } },
    ],
    metadata: { offerCode: offer.code, clerkUserId: userId, offerRevision: offerRevision(offer) },
    subscription_data: { metadata: { offerCode: offer.code, clerkUserId: userId, projectTitle: offer.title } },
    success_url: `${appUrl}/billing`,
    cancel_url: `${appUrl}/offers/${offer.code}`,
    custom_text: { submit: { message: "Your first payment includes the website and first month of support. Your retainer renews monthly. Manage or cancel it from My account." } },
  };
}

function offerRevision(offer: Offer) {
  return createHash("sha256").update(JSON.stringify(offer)).digest("hex").slice(0, 24);
}

export async function startCheckout(stripe: Stripe, identity: BillingIdentity, offer: Offer, appUrl: string) {
  const customer = await accountCustomer(stripe, identity, true);
  if (!customer) throw new BillingError("Billing account unavailable.", 503);
  let open: Stripe.Checkout.Session | undefined;
  let lastExpiredId = "initial";
  for await (const session of stripe.checkout.sessions.list({ customer: customer.id, limit: 100 })) {
    if (session.metadata?.offerCode !== offer.code) continue;
    if (session.status === "complete") {
      throw new BillingError("Checkout has already been completed for this proposal. Visit My account to check payment and subscription status.", 409);
    }
    if (session.status === "open") open ??= session;
    if (session.status === "expired" && lastExpiredId === "initial") lastExpiredId = session.id;
  }
  if (open?.url) {
    if (open.metadata?.offerRevision !== offerRevision(offer)) {
      throw new BillingError("This proposal has changed since checkout began. Please contact us for an updated proposal.", 409);
    }
    return open.url;
  }
  await stripe.customers.update(customer.id, { email: identity.email });
  const session = await stripe.checkout.sessions.create(
    checkoutParameters(offer, customer.id, identity.userId, appUrl),
    { idempotencyKey: `framforge-checkout-${customer.id}-${offer.code}-${lastExpiredId}` },
  );
  if (!session.url || session.status !== "open") throw new BillingError("Please refresh your account before trying checkout again.", 409);
  return session.url;
}

export async function verifyPortal(stripe: Stripe, configuration: string) {
  const portal = await stripe.billingPortal.configurations.retrieve(configuration);
  if (!portal.active || !portal.features.subscription_cancel.enabled) {
    throw new BillingError("Subscription management is temporarily unavailable. Please contact us for billing help.", 503);
  }
}

export async function openPortal(stripe: Stripe, identity: BillingIdentity, configuration: string, appUrl: string, subscriptionId?: string) {
  const customer = await accountCustomer(stripe, identity);
  if (!customer) throw new BillingError("You don’t have a billing account yet.", 404);
  await verifyPortal(stripe, configuration);
  if (subscriptionId) {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const owner = typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;
    if (owner !== customer.id) throw new BillingError("Subscription not found.", 404);
    if (["canceled", "incomplete_expired"].includes(subscription.status)) throw new BillingError("This subscription has already ended. Refresh your account.", 409);
  }
  const session = await stripe.billingPortal.sessions.create({
    customer: customer.id,
    configuration,
    return_url: `${appUrl}/billing`,
    ...(subscriptionId ? { flow_data: {
      type: "subscription_cancel" as const,
      subscription_cancel: { subscription: subscriptionId },
      after_completion: { type: "redirect" as const, redirect: { return_url: `${appUrl}/billing` } },
    } } : {}),
  });
  return session.url;
}
