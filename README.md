# Fram Forge LLC

Custom website services with account-protected client proposals and recurring Stripe billing.

## Client flow

1. You create an offer for a client's email, with their one-time website price and monthly retainer.
2. They open the proposal link, create a Clerk account, and verify the assigned email.
3. Checkout collects the website fee plus the first month, then the retainer renews monthly. Prices come from your server configuration, not the browser.
4. **My account** (`/billing`) shows their proposals and live Stripe subscription status, amount, and renewal/end date.
5. **Cancel retainer** opens Stripe's cancellation confirmation for that subscription. **Manage billing & invoices** opens their authenticated Stripe portal. On return, the account page reads the latest state from Stripe.

Example: $1,000 website + $50/month → $1,050 initially, then $50/month. No trial or delayed retainer start.

## Run locally

Node.js 22.18+ is required for the offer wizard/tests.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Without credentials the public website and `/offers/example` work, while account pages show an honest setup notice and payment endpoints return 503. There is no fake local sign-in or live checkout fallback.

## Activate client accounts

1. Create a [Clerk application](https://dashboard.clerk.com/). Enable email sign-up/sign-in, require email verification, and enable email/password recovery or email-code sign-in according to your preferred login method. Configure the app's production domain before deploying live keys.
2. Set `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `.env.local` and your hosting environment. Keep the secret key server-only. The sign-in and sign-up paths are `/sign-in` and `/sign-up`, with `/billing` as the default return destination.
3. Disable self-service account deletion while you handle billing-account deletion manually; deleting an identity does not cancel Stripe subscriptions. Coordinate deletion requests with active retainers first. Keep the account's Stripe mapping in **privateMetadata**, never public or unsafe metadata.
4. Create/activate your [Stripe account](https://dashboard.stripe.com/register) and set `STRIPE_SECRET_KEY`, starting with a test key.
5. In Stripe, create an active **billing portal configuration**, enable subscription cancellation, invoice history, and payment-method updates. Choose cancellation at the end of the paid period (or the agreed timing), and disable plan switching and customer email updates. Set its `bpc_...` ID as `STRIPE_PORTAL_CONFIGURATION_ID`. Checkout refuses to start if cancellation is disabled. Clients see Stripe's confirmation and actual cancellation timing before committing.
6. Configure the signed webhook as described below and set `STRIPE_WEBHOOK_SECRET`. Payments stay disabled until it is present.
7. Set `APP_URL` to the exact site origin: `http://localhost:3000` locally and `https://www.framforge.com` in Vercel production. This drives return URLs and same-origin checks; do not use a path or a temporary preview domain for live billing.
8. Restart locally or redeploy after changing configuration.

This version replaces the previous public Payment Link approach. `STRIPE_CUSTOMER_PORTAL_URL` and per-offer `checkoutUrl` are no longer used. No Payment Links need to be created: the server builds account-linked Checkout sessions with the agreed amounts. Existing external subscriptions, if any, require an owner-verified migration to the correct Clerk user/customer mapping; never attach a Stripe customer solely because an email supplied by a browser matches.

## Stripe webhook and Vercel setup

Production hosting: Vercel. Canonical origin: `https://www.framforge.com` (include `www`; same-origin checks are exact).

1. Use a separate Stripe sandbox for development. The connected agent currently has access only to the live account; do not run test payments in live mode.
2. In Stripe Workbench, add a snapshot event destination for **your account** at `https://www.framforge.com/api/stripe/webhook`. Match the API version used by the installed Stripe SDK. Subscribe to the events listed in `src/lib/billing-webhook.ts`: Checkout completion and asynchronous success/failure, subscription created/updated/deleted/paused/resumed, and invoice paid/payment failed/payment action required.
3. Save that destination's signing secret as `STRIPE_WEBHOOK_SECRET` in the matching Vercel environment. It is different from the API key and from any CLI forwarding secret. Configure all other variables from `.env.example` there, using production Clerk and Stripe credentials only for Production. Never put secrets in `NEXT_PUBLIC_` variables, chat, or git.
4. Use a restricted Stripe key with only the permissions needed for customers, Checkout, subscriptions, invoices, portal configuration/session access, and read-only webhook inspection. The code never needs payouts or transfers.
5. Deploy after setting secrets. Verify that the webhook receives a valid signed event successfully. Until configured it intentionally returns 503 so Stripe retries. Invalid/missing signatures return 400; GET returns 405. No Clerk session is required at this route.
6. Run `npm run billing:check` with the matching environment. It prints variable names and pass/fail only, reads portal/webhook configuration, and does not create payments. A passing check does not replace the sandbox flow tests below.

For local webhook testing, use `stripe listen --forward-to localhost:3000/api/stripe/webhook` against the sandbox and save its printed signing secret locally. Keep development and production credentials separate.

The live portal already created for this integration is `bpc_1UQZtd2KsxIEf3x1NKkr8mxk`, on the Fram Forge LLC account. It enables invoice history, payment-method changes, and end-of-period cancellation. It disables plan switching and unauthenticated portal login. Do not use that live ID in a sandbox.

## Create a client offer

```bash
npm run offer
```

Enter the project title, website price, retainer price, intended email, scope, support limits, and agreed timeline/cancellation/refund terms. The wizard generates a random code and saves the offer to ignored `.env.local`, preserving existing offers. Copy the full `FRAM_FORGE_OFFERS` value to your hosting environment and redeploy, then share `/offers/<code>` on your live domain.

There is no owner dashboard yet. Offers are still managed through the local wizard/environment configuration. After a client starts checkout, treat that offer as immutable. If terms/prices need to change, expire its open Checkout session in Stripe and issue a new offer code. Before replacing any paid proposal, resolve the existing subscription in Stripe; a new offer represents a new purchase.

An offer is a server-only JSON entry in the array:

```json
{
  "code": "generate-a-random-code-with-the-wizard",
  "title": "Business website project",
  "clientEmail": "client@example.com",
  "websiteCents": 100000,
  "monthlyCents": 5000,
  "scope": ["Agreed website deliverables"],
  "care": ["Agreed monthly support limits"],
  "terms": "The actual agreed timeline, cancellation, and refund terms."
}
```

All amounts are integer USD cents. Stripe Tax is not enabled in Checkout yet. The connected live account has active tax settings and an active Pennsylvania registration as checked on October 14, 2026. Confirm the correct product tax classification and inclusive/exclusive pricing, then verify a calculation before enabling automatic tax. Existing tax settings were not changed. The example route is a public demonstration with payment disabled. Real proposals require an assigned verified email, are marked noindex, and do not disclose client details to signed-out or unrelated accounts.

## Billing implementation

- `src/lib/auth.ts`: Clerk identity and verified email access.
- `src/proxy.ts`: Clerk session middleware; authorization also happens at every protected resource.
- `src/lib/billing-service.ts`: customer ownership checks, Checkout session reuse/idempotency, completed-purchase protection, and cancellation/portal flows.
- `src/lib/stripe.ts`: server-only Stripe client and account mapping in Clerk private metadata. Test/live customer IDs are separate.
- `src/app/api/billing/*`: authenticated POST-only endpoints with same-origin checks. Prices/customer IDs are never accepted from the browser. Cancellation subscription IDs are verified against the authenticated customer.

The Stripe customer ID is persisted before checkout is created. A customer belongs to a stable Clerk user ID, not a browser-supplied email. Stripe subscriptions carry the offer code and user ID. The account page reads Stripe directly and does not trust a success URL as evidence of payment. Signed lifecycle webhooks verify the Stripe customer against the private Clerk mapping, then invalidate the billing page. The page reads current Stripe records, including the latest invoice, on every visit. Duplicate or out-of-order events cannot overwrite billing state because event snapshots are never stored as current status. Repeated invalidation is safe; provider or owner-mapping failures return 503 for Stripe retries. This is manual website fulfillment: no event automatically starts work, sends email, or suspends a website. Check a settled paid invoice in Stripe before starting work; a completed Checkout session alone can still have an asynchronous payment pending.

The contact form still opens an email draft; it does not automatically send email. Verify branding, domain, and contact address in `src/lib/site.ts` before publishing.

## Verification

```bash
npm run billing:check
npm test
npm run lint
npm run build
```

Automated tests use simulated provider responses to verify owner isolation, proposal access, server-controlled amounts, repeat/concurrent checkout behavior, failed customer-mapping persistence, origin checks, cancellation ownership, real webhook signature validation, duplicate/out-of-order deliveries, and retry behavior. They do not replace provider testing.

Before launch, with real Clerk development credentials and Stripe test mode:

- Create two accounts, verify emails, sign out/back in, and test account recovery.
- Verify client B cannot access client A's proposal, customer, or cancellation endpoint.
- Complete test checkout; check $1,050 first invoice and $50/month subscription for the example prices.
- Refresh/back/repeat checkout and confirm it cannot charge the same proposal twice.
- Test a declined payment, checkout abandonment, and retry after expiration.
- Open invoices, update a card, cancel from the retainer card, and return to see the scheduled end date.
- Verify renewal and payment failure states using Stripe testing tools.
- Replace development/test credentials with production keys and repeat configuration checks before publishing.

No live Clerk registration, Stripe payment, or cancellation has been tested without your provider credentials.

References: [Clerk Next.js](https://clerk.com/docs/nextjs/getting-started/quickstart), [Stripe Checkout](https://docs.stripe.com/api/checkout/sessions/create), [Stripe portal sessions](https://docs.stripe.com/api/customer_portal/sessions/create).

Dependency check for this change: production dependencies pass `npm audit --omit=dev`. The full audit still reports the upstream `braces` issue through ESLint's development-only globbing dependencies (five reported entries). The suggested forced fix downgrades the Next.js lint configuration to v14, so that breaking downgrade was not applied.
