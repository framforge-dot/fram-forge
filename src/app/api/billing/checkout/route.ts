import { billingRequest, billingErrorResponse } from "@/lib/billing-request";
import { getOffer } from "@/lib/billing";
import { ownsOffer } from "@/lib/account-config";
import { BillingError, startCheckout, verifyPortal } from "@/lib/billing-service";
import { billingIdentity, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { account, body, origin } = await billingRequest(request);
    if (typeof body.code !== "string" || !/^[a-zA-Z0-9_-]{20,80}$/.test(body.code)) throw new BillingError("Proposal not found.", 404);
    const offer = getOffer(body.code);
    if (!offer || !ownsOffer(offer.clientEmail, account.verifiedEmails)) throw new BillingError("Proposal not found for this account.", 404);
    const stripe = getStripe();
    await verifyPortal(stripe, process.env.STRIPE_PORTAL_CONFIGURATION_ID!);
    const url = await startCheckout(stripe, billingIdentity(account), offer, origin);
    return Response.json({ url });
  } catch (error) { return billingErrorResponse(error); }
}
