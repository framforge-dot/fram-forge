import "server-only";
import { getAccount, accountsConfigured } from "@/lib/auth";
import { paymentsConfigured, appOrigin } from "@/lib/stripe";
import { sameOrigin } from "@/lib/account-config";
import { BillingError } from "@/lib/billing-service";

export async function billingRequest(request: Request) {
  if (!accountsConfigured()) throw new BillingError("Client accounts are not available yet.", 503);
  if (!paymentsConfigured()) throw new BillingError("Payments are being set up. Please contact us.", 503);
  const origin = appOrigin();
  if (!sameOrigin(request.url, request.headers.get("origin"), origin)) throw new BillingError("Invalid request origin.", 403);
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new BillingError("Expected JSON.", 415);
  const account = await getAccount();
  if (!account) throw new BillingError("Please sign in to your account first.", 401);
  if (!account.verifiedEmails.length || !account.verifiedEmails.includes(account.email)) throw new BillingError("Verify your primary email address before managing billing.", 403);
  // Bound request data before parsing; no client-supplied price/customer IDs are used.
  const text = await request.text();
  if (text.length > 2048) throw new BillingError("Request too large.", 413);
  let body;
  try { body = JSON.parse(text); } catch { throw new BillingError("Invalid request."); }
  if (!body || typeof body !== "object" || Array.isArray(body)) throw new BillingError("Invalid request.");
  return { account, body, origin };
}

export function billingErrorResponse(error: unknown) {
  if (error instanceof BillingError) return Response.json({ error: error.message }, { status: error.status });
  // Avoid logging provider payloads, session URLs, or private account details.
  console.error("Billing provider request failed.");
  return Response.json({ error: "Billing is temporarily unavailable. Please try again or contact us." }, { status: 503 });
}
