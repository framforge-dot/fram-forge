# Billing activation status

Checked October 15, 2026.

Production Clerk keys and the restricted Stripe website key are saved in Vercel. All five Clerk authentication/email DNS records are verified. Client email verification is required, email-code sign-in is enabled, and self-service account deletion is disabled for new accounts.

The live Stripe webhook is `we_1UQwkw2KsxIEf3x1YrytYJfZ`, targeting `https://www.framforge.com/api/stripe/webhook` with API version `2026-09-30.endive` and the eleven billing events in the source. Its signing secret is saved in Vercel.

Restricted key permissions: Customers, Checkout Sessions, Customer Portal write; Invoices, Subscriptions, Webhook Endpoints read; no Connect permissions. Owner email and authenticator verification completed.

## Completed

- Custom, email-assigned proposals; verified client login; one-time website payment plus monthly retainer starting at checkout.
- Account dashboard with subscription status, renewal/cancellation date, latest invoice payment status, and secure billing management.
- Vercel production configuration saved and verified for the transferred `fram3/fram-forge` project: application origin, portal configuration ID, Clerk keys and route settings, and an empty custom-offer list. Clerk and Stripe production credentials are saved.
- Live Stripe portal configured and verified: end-of-period cancellation, invoices, payment-method updates; no plan switching.
- Signed payment/subscription webhook handler with owner verification, retry responses, and safe duplicate/out-of-order handling. Stripe remains the durable billing record; website fulfillment is manual.
- 16 automated tests passed. Production build, TypeScript, lint, and HTTP configuration-gate checks passed.
- Read-only tax review: active Stripe Tax settings and Pennsylvania registration. Tax collection behavior has not been changed or calculation-tested.

## Production verification and remaining testing

1. **Resolved:** the project is now available at `https://vercel.com/fram3/fram-forge`. Its production domain is `www.framforge.com`, and its connected repository is `framforge-dot/fram-forge`. The transfer was verified in the Vercel dashboard.
2. **Verified:** Vercel deployed commit `c4148b1` with Ready status at www.framforge.com. Live sign-in renders as Fram Forge; signed-out /billing redirects to sign-in. Clerk reports all DNS records verified and SSL certificates issued.
3. Validate the restricted Stripe key against the deployed billing flow.
4. Sandbox `acct_1U6BfjRz80GGH3JN` is accessible in the Stripe dashboard. Existing sandbox key saved in ignored local .env.local with user approval. Service-layer checkout and portal functions passed real sandbox API/browser testing: declined card; $1,050 initial payment; $50 renewal; reused open checkout; completed checkout rejected; portal cancellation at paid-through date; subscription ended with no additional invoice. Local portal ID now belongs to this sandbox.
5. Production webhook and signing secret configured. Live endpoint correctly returns 400 for an unsigned request; signed delivery testing remains.
6. Review product tax classification and inclusive/exclusive pricing before activating automatic tax.

Keep keys in local `.env.local` or Vercel's environment-variable fields, not chat or git. Run `npm run billing:check` after configuration; it reports names and status without printing secrets. Production deployment and public login verification passed. Stripe checkout, renewal, and cancellation testing passed. Full authenticated website account testing remains: user reports trouble signing in. No real payment has been made. No client offers have been activated.

## Automatic provisioning blocker

Stripe Directory returned: `Invalid user agent. This endpoint can only be used by the Stripe CLI tool.` This occurred using the official CLI's Directory plugin.

Stripe Projects preflight returned `BROWSER_AUTH_REQUIRED`. Its message and remedy, verbatim:

> No Stripe session with a live-mode account is signed in. Rerun this same `stripe projects init` command without `--preflight`, keeping every other argument (such as `--from` or a project name) and including `--json --yes`. It returns `BROWSER_AUTH_REQUIRED` with `details.reason` `handoff_prepared`, an `onboarding_url`, a `browser_url` and a `verification_code`. Ask the user to open `onboarding_url` to create or choose their Stripe Projects account, then approve the sign-in at `browser_url` with the code. Once they have, run that command again. Do not run `stripe login` yourself.

The [Stripe Projects skill](/Users/chaseframeli/.codex/plugins/cache/openai-curated-remote/stripe/8.0.0/skills/stripe-projects/SKILL.md) says: “If any check fails with `BROWSER_AUTH_REQUIRED`, `PROJECTS_SESSION_UNUSABLE`, or `ACCOUNT_NOT_ELIGIBLE`, stop here.” This prevents the agent from continuing that automatic provisioning route until the user completes the required sign-in. It does not block local implementation or working with an existing Clerk application.

The CLI downloaded and verified for this session is `/tmp/framforge-stripe-cli/stripe` (v1.53.1). To use the automatic provisioning route, run this yourself and complete its sign-in instructions:

```bash
/tmp/framforge-stripe-cli/stripe projects init --json --yes
```

Projects sign-in is separate from the connected Stripe agent plugin. No Projects service has been provisioned.

## Sandbox verification evidence

- Subscription: `sub_1UR1WuRz80GGH3JN2hiF8I5p` in sandbox `acct_1U6BfjRz80GGH3JN`.
- Initial invoice paid: 105000 cents. Renewal invoice paid: 5000 cents. Test clock advanced through cancellation; two invoices total.
- Real sandbox cancellation event passed the webhook handler with a locally generated test signature, including duplicate delivery; altered payload rejected with 400. This does not verify production webhook delivery or Clerk reverse-mapping integration.
- No real payments were made. Production still has no client offers.

## Login correction — October 16, 2026

Google OAuth was enabled in production without a client ID or secret. Clicking it reproduced Google Error 400 (missing client_id). Disabled this incomplete connection in Clerk; the live sign-up form now offers email and password with email verification. User account creation and authenticated dashboard verification remain pending.
