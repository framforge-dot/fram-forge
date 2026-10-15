import nextEnv from "@next/env";
import Stripe from "stripe";
import { billingEvents } from "../src/lib/billing-webhook.ts";
import { parseOffers } from "../src/lib/offer-config.ts";

nextEnv.loadEnvConfig(process.cwd());
let failures = 0;
function check(ok, label) {
  console.log(`${ok ? "PASS" : "NEEDS SETUP"}: ${label}`);
  if (!ok) failures++;
}
const required = ["APP_URL", "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY", "CLERK_SECRET_KEY", "STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET", "STRIPE_PORTAL_CONFIGURATION_ID"];
for (const name of required) check(Boolean(process.env[name]?.trim()), name);
let origin;
try {
  const url = new URL(process.env.APP_URL);
  const local = ["localhost", "127.0.0.1"].includes(url.hostname);
  check(url.protocol === "https:" || (local && url.protocol === "http:"), "HTTPS outside localhost");
  check(url.pathname === "/" && !url.search && !url.hash, "APP_URL is an origin without a path");
  origin = url.origin;
} catch { check(false, "APP_URL is a valid URL"); }
try { parseOffers(process.env.FRAM_FORGE_OFFERS); check(true, "Proposal configuration"); }
catch { check(false, "Proposal configuration (values withheld)"); }

const key = process.env.STRIPE_SECRET_KEY ?? "";
const publishable = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkSecret = process.env.CLERK_SECRET_KEY ?? "";
if (key) check(/^(sk|rk)_(test|live)_/.test(key), "Stripe secret/restricted key format");
if (publishable && clerkSecret) {
  check((publishable.startsWith("pk_live_") && clerkSecret.startsWith("sk_live_")) || (publishable.startsWith("pk_test_") && clerkSecret.startsWith("sk_test_")), "Clerk keys belong to the same environment");
}

// Only read configuration. Never create a customer, payment, or subscription.
if (!failures) {
  const stripe = new Stripe(key, { timeout: 15000, maxNetworkRetries: 1 });
  try {
    const config = await stripe.billingPortal.configurations.retrieve(process.env.STRIPE_PORTAL_CONFIGURATION_ID);
    check(config.active && config.features.subscription_cancel.enabled && config.features.subscription_cancel.mode === "at_period_end", "Portal cancellation at end of paid period");
    check(config.features.invoice_history.enabled && config.features.payment_method_update.enabled, "Invoices and payment-method management enabled");
    check(!config.features.subscription_update.enabled, "Custom prices cannot be switched in the portal");
    check(config.livemode === /^(sk|rk)_live_/.test(key), "Portal matches Stripe environment");
    let endpoint;
    for await (const candidate of stripe.webhookEndpoints.list({ limit: 100 })) {
      if (candidate.url === `${origin}/api/stripe/webhook` && candidate.status === "enabled") { endpoint = candidate; break; }
    }
    check(Boolean(endpoint), "Enabled webhook at APP_URL/api/stripe/webhook");
    if (endpoint) check(billingEvents.every(event => endpoint.enabled_events.includes(event) || endpoint.enabled_events.includes("*")), "Webhook includes all required billing events");
  } catch { check(false, "Stripe configuration accessible (check key permissions and environment)"); }
}
if (failures) process.exitCode = 1;
else console.log("Configuration checks passed. Complete sandbox sign-in, checkout, renewal, and cancellation testing before accepting clients.");
