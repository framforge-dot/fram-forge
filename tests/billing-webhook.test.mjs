import test from "node:test";
import assert from "node:assert/strict";
import Stripe from "stripe";
import { receiveBillingWebhook, billingEvents } from "../src/lib/billing-webhook.ts";

const secret = "whsec_local_signature_test_only";
const sdk = new Stripe("sk_test_local_signature_test_only");

function fixture({ owner = "cus_A", fail = false, live = false } = {}) {
  const calls = { reads: 0, refreshes: 0 };
  return { calls, deps: {
    live,
    stripe: {
      webhooks: sdk.webhooks,
      customers: { retrieve: async () => {
        calls.reads++;
        if (fail) throw new Error("Provider unavailable");
        return { id: "cus_A", metadata: { clerkUserId: "user_A" } };
      } },
    },
    customerForUser: async () => owner,
    refresh: () => { calls.refreshes++; },
  } };
}

function signedRequest(type, { timestamp, changed = false, live = false, created = 123 } = {}) {
  const payload = JSON.stringify({ id: "evt_test", object: "event", type, livemode: live, created, data: { object: { id: "sub_A", customer: "cus_A", payment_status: "unpaid" } } });
  const signature = sdk.webhooks.generateTestHeaderString({ payload, secret, ...(timestamp ? { timestamp } : {}) });
  return new Request("https://www.framforge.com/api/stripe/webhook", { method: "POST", body: changed ? payload + " " : payload, headers: { "stripe-signature": signature } });
}

test("missing, forged, altered, and stale webhook signatures cannot access billing", async () => {
  const { calls, deps } = fixture();
  const requests = [
    new Request("https://www.framforge.com/api/stripe/webhook", { method: "POST", body: "{}" }),
    new Request("https://www.framforge.com/api/stripe/webhook", { method: "POST", body: "{}", headers: { "stripe-signature": "invalid" } }),
    signedRequest("invoice.paid", { changed: true }),
    signedRequest("invoice.paid", { timestamp: 123 }),
  ];
  for (const request of requests) assert.equal((await receiveBillingWebhook(request, secret, deps)).status, 400);
  assert.deepEqual(calls, { reads: 0, refreshes: 0 });
});

test("all configured payment and subscription events refresh authoritative billing", async () => {
  const { calls, deps } = fixture();
  for (const type of billingEvents) assert.equal((await receiveBillingWebhook(signedRequest(type), secret, deps)).status, 200);
  assert.equal(calls.refreshes, billingEvents.length);
});

test("duplicate and out-of-order events only invalidate; unpaid completion does not fulfill orders", async () => {
  const { calls, deps } = fixture();
  for (const created of [300, 300, 100]) {
    assert.equal((await receiveBillingWebhook(signedRequest("checkout.session.completed", { created }), secret, deps)).status, 200);
  }
  assert.equal(calls.refreshes, 3);
  // No payment-status snapshots, charges, emails, or fulfillment side effects.
  assert.deepEqual(Object.keys(calls), ["reads", "refreshes"]);
});

test("unknown signed events are acknowledged without touching accounts", async () => {
  const { calls, deps } = fixture();
  const response = await receiveBillingWebhook(signedRequest("product.created"), secret, deps);
  assert.deepEqual(await response.json(), { received: true, result: "ignored" });
  assert.deepEqual(calls, { reads: 0, refreshes: 0 });
});

test("provider failures, mismatched ownership, and mode mismatch request Stripe retries", async () => {
  for (const options of [{ fail: true }, { owner: "cus_other" }, { live: true }]) {
    const { calls, deps } = fixture(options);
    assert.equal((await receiveBillingWebhook(signedRequest("invoice.paid"), secret, deps)).status, 503);
    assert.equal(calls.refreshes, 0);
  }
});
