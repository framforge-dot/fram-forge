import test from "node:test";
import assert from "node:assert/strict";
import { parseOffers, money, exampleOffer } from "../src/lib/offer-config.ts";
import { accountReturnPath, ownsOffer, sameOrigin } from "../src/lib/account-config.ts";
import { accountCustomer, checkoutParameters, startCheckout, openPortal } from "../src/lib/billing-service.ts";

const offer = { ...exampleOffer, code: "test_offer_01234567890123456789", clientEmail: "client@example.com" };
const identity = { userId: "user_A", email: "client@example.com", customerId: "cus_A", saveCustomerId: async () => {} };
const origin = "https://framforge.com";

function provider({ owner = "user_A", sessions = [], subscriptionOwner = "cus_A", canCancel = true } = {}) {
  const calls = { checkout: [], portal: [], customer: [], updates: [] };
  const customer = { id: "cus_A", metadata: { clerkUserId: owner } };
  const stripe = {
    customers: {
      retrieve: async () => customer,
      create: async (...args) => { calls.customer.push(args); return customer; },
      update: async (...args) => { calls.updates.push(args); return customer; },
    },
    checkout: { sessions: {
      list: () => (async function* () { yield* sessions; })(),
      create: async (...args) => { calls.checkout.push(args); return { id: "cs_new", status: "open", url: "https://checkout.stripe.com/c/pay/new" }; },
    } },
    subscriptions: { retrieve: async () => ({ id: "sub_A", customer: subscriptionOwner, status: "active" }) },
    billingPortal: {
      configurations: { retrieve: async () => ({ active: true, features: { subscription_cancel: { enabled: canCancel } } }) },
      sessions: { create: async (...args) => { calls.portal.push(args); return { url: "https://billing.stripe.com/p/session/example" }; } },
    },
  };
  return { stripe, calls };
}

test("server-built checkout charges website once and retainer monthly, using the authenticated customer", () => {
  const [parsed] = parseOffers(JSON.stringify([offer]));
  const params = checkoutParameters(parsed, "cus_A", "user_A", origin);
  assert.equal(money(parsed.websiteCents + parsed.monthlyCents), "$1,050");
  assert.equal(params.customer, "cus_A");
  assert.equal(params.mode, "subscription");
  assert.equal(params.payment_method_types, undefined);
  assert.equal(params.allowed_payment_method_types, undefined);
  assert.equal(params.line_items[0].price_data.unit_amount, 100000);
  assert.equal(params.line_items[0].price_data.recurring, undefined);
  assert.equal(params.line_items[1].price_data.unit_amount, 5000);
  assert.deepEqual(params.line_items[1].price_data.recurring, { interval: "month" });
  assert.equal(params.subscription_data.metadata.clerkUserId, "user_A");
  assert.equal(params.success_url, `${origin}/billing`);
});

test("invalid or incomplete offers fail closed", () => {
  assert.deepEqual(parseOffers(undefined), []);
  for (const changes of [{ websiteCents: -1 }, { monthlyCents: 0 }, { monthlyCents: 10.5 }, { websiteCents: "1000" }, { code: "example" }, { terms: "" }, { care: [] }, { scope: [""] }, { clientEmail: "" }, { clientEmail: "wrong" }]) assert.throws(() => parseOffers(JSON.stringify([{ ...offer, ...changes }])));
  assert.throws(() => parseOffers(JSON.stringify([offer, offer])));
  assert.throws(() => parseOffers("{}"));
});

test("only the assigned verified email can access an offer", () => {
  assert.equal(ownsOffer(offer.clientEmail, ["CLIENT@example.com"]), true);
  assert.equal(ownsOffer(offer.clientEmail, ["other@example.com"]), false);
  assert.equal(ownsOffer(offer.clientEmail, []), false);
});

test("reject external redirect destinations and cross-origin billing requests", () => {
  assert.equal(accountReturnPath(`/offers/${offer.code}`), `/offers/${offer.code}`);
  for (const value of ["//evil.test", "https://evil.test", "/\\evil.test", "/offers/abc?next=https://evil.test", ["/billing"]]) assert.equal(accountReturnPath(value), "/billing");
  assert.equal(sameOrigin(`${origin}/api/billing/checkout`, origin, origin), true);
  assert.equal(sameOrigin(`${origin}/api/billing/checkout`, "https://evil.test", origin), false);
  assert.equal(sameOrigin(`${origin}/api/billing/checkout`, null, origin), false);
});

test("an account cannot open another client's billing customer", async () => {
  const { stripe, calls } = provider({ owner: "user_B" });
  await assert.rejects(() => startCheckout(stripe, identity, offer, origin), { status: 403 });
  await assert.rejects(() => openPortal(stripe, identity, "bpc_config", origin), { status: 403 });
  assert.equal(calls.checkout.length + calls.portal.length, 0);
});

test("customer mapping must be saved before any money can be collected", async () => {
  const { stripe, calls } = provider();
  await assert.rejects(() => startCheckout(stripe, { ...identity, customerId: null, saveCustomerId: async () => { throw new Error("storage unavailable"); } }, offer, origin));
  assert.equal(calls.checkout.length, 0);
  assert.equal(calls.customer[0][1].idempotencyKey, "framforge-customer-user_A");
  assert.equal(await accountCustomer(stripe, { ...identity, customerId: null }), null);
});

test("repeated checkout clicks reuse the open session", async () => {
  const params = checkoutParameters(offer, "cus_A", "user_A", origin);
  const { stripe, calls } = provider({ sessions: [{ id: "cs_open", status: "open", metadata: params.metadata, url: "https://checkout.stripe.com/c/pay/open" }] });
  assert.equal(await startCheckout(stripe, identity, offer, origin), "https://checkout.stripe.com/c/pay/open");
  assert.equal(calls.checkout.length, 0);
  await assert.rejects(() => startCheckout(stripe, identity, { ...offer, monthlyCents: 9000 }, origin), { status: 409 });
});

test("completed checkout cannot charge the same website again", async () => {
  const { stripe, calls } = provider({ sessions: [{ id: "cs_done", status: "complete", metadata: { offerCode: offer.code } }] });
  await assert.rejects(() => startCheckout(stripe, identity, offer, origin), { status: 409 });
  assert.equal(calls.checkout.length, 0);
});

test("concurrent new checkouts share an idempotency key; expiration permits a new attempt", async () => {
  const { stripe, calls } = provider();
  await Promise.all([startCheckout(stripe, identity, offer, origin), startCheckout(stripe, identity, offer, origin)]);
  assert.deepEqual(calls.checkout[0], calls.checkout[1]);
  const retry = provider({ sessions: [{ id: "cs_old", status: "expired", metadata: { offerCode: offer.code } }] });
  await startCheckout(retry.stripe, identity, offer, origin);
  assert.notEqual(retry.calls.checkout[0][1].idempotencyKey, calls.checkout[0][1].idempotencyKey);
});

test("cancellation opens a confirmation flow for the owned subscription only", async () => {
  const { stripe, calls } = provider();
  await openPortal(stripe, identity, "bpc_config", origin, "sub_A");
  assert.equal(calls.portal[0][0].customer, "cus_A");
  assert.deepEqual(calls.portal[0][0].flow_data.subscription_cancel, { subscription: "sub_A" });
  assert.equal(calls.portal[0][0].flow_data.after_completion.redirect.return_url, `${origin}/billing`);
  const other = provider({ subscriptionOwner: "cus_B" });
  await assert.rejects(() => openPortal(other.stripe, identity, "bpc_config", origin, "sub_B"), { status: 404 });
  assert.equal(other.calls.portal.length, 0);
});

test("subscription management fails safely if cancellation is disabled in Stripe", async () => {
  const { stripe, calls } = provider({ canCancel: false });
  await assert.rejects(() => openPortal(stripe, identity, "bpc_config", origin), { status: 503 });
  assert.equal(calls.portal.length, 0);
});
