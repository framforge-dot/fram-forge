import "server-only";
import Stripe from "stripe";
import { clerkClient } from "@clerk/nextjs/server";
import type { getAccount } from "@/lib/auth";
import type { BillingIdentity } from "@/lib/billing-service";

export function paymentsConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PORTAL_CONFIGURATION_ID && process.env.STRIPE_WEBHOOK_SECRET && process.env.APP_URL);
}

export function stripeMode() {
  return /^(sk|rk)_live_/.test(process.env.STRIPE_SECRET_KEY ?? "") ? "live" : "test";
}

export function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Stripe is not configured.");
  return new Stripe(process.env.STRIPE_SECRET_KEY, { maxNetworkRetries: 2, timeout: 20000 });
}

export function appOrigin() {
  const url = new URL(process.env.APP_URL!);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) throw new Error("APP_URL must use HTTPS outside local development.");
  return url.origin;
}

export function billingIdentity(account: NonNullable<Awaited<ReturnType<typeof getAccount>>>): BillingIdentity {
  // Test and live customer IDs must never be mixed when activating live billing.
  const mode = stripeMode();
  const ids = account.privateMetadata.stripeCustomerIds as Record<string, unknown> | undefined;
  const id = ids?.[mode];
  return {
    userId: account.id,
    email: account.email,
    customerId: typeof id === "string" && /^cus_[a-zA-Z0-9]+$/.test(id) ? id : null,
    async saveCustomerId(customerId) {
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(account.id, { privateMetadata: { stripeCustomerIds: { [mode]: customerId } } });
    },
  };
}
