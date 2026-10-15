import type Stripe from "stripe";

export const billingEvents = [
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "invoice.paid",
  "invoice.payment_failed",
  "invoice.payment_action_required",
] as const;

type Dependencies = {
  stripe: Stripe;
  live: boolean;
  customerForUser: (userId: string, mode: "live" | "test") => Promise<string | null>;
  refresh: () => void;
};

// Stripe remains the authoritative, durable billing record. Revalidation is
// idempotent: duplicate or out-of-order events never write stale subscription
// snapshots, send duplicate mail, or activate a service before payment settles.
export async function handleBillingEvent(event: Stripe.Event, deps: Dependencies) {
  if (event.livemode !== deps.live) throw new Error("Webhook mode mismatch.");
  if (!billingEvents.some(type => type === event.type)) return "ignored";
  const object = event.data.object as Stripe.Checkout.Session | Stripe.Subscription | Stripe.Invoice;
  const customerId = typeof object.customer === "string" ? object.customer : object.customer?.id;
  if (!customerId) return "ignored";
  const customer = await deps.stripe.customers.retrieve(customerId);
  if (customer.deleted) return "ignored";
  // Clerk stores the owner mapping. Customer metadata locates that record, but
  // the private, server-written reverse mapping must agree before processing.
  const userId = customer.metadata.clerkUserId;
  if (!userId) return "ignored"; // Other Stripe integrations may share the account.
  if (await deps.customerForUser(userId, event.livemode ? "live" : "test") !== customerId) {
    throw new Error("Billing owner mapping unavailable.");
  }
  deps.refresh();
  return "refreshed";
}

export async function receiveBillingWebhook(request: Request, secret: string, deps: Dependencies) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return Response.json({ error: "Missing signature." }, { status: 400 });
  // Preserve the raw body for Stripe's timestamp and HMAC verification.
  let event: Stripe.Event;
  try {
    event = deps.stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return Response.json({ error: "Invalid signature." }, { status: 400 });
  }
  try {
    const result = await handleBillingEvent(event, deps);
    return Response.json({ received: true, result });
  } catch {
    // A non-2xx response asks Stripe to retry provider or mapping failures.
    // Never log the signed payload, email addresses, or private credentials.
    console.error("Stripe billing event processing failed.");
    return Response.json({ error: "Please retry delivery." }, { status: 503 });
  }
}
