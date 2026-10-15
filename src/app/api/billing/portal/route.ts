import { billingRequest, billingErrorResponse } from "@/lib/billing-request";
import { BillingError, openPortal } from "@/lib/billing-service";
import { billingIdentity, getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const { account, body, origin } = await billingRequest(request);
    if (body.subscriptionId !== undefined && (typeof body.subscriptionId !== "string" || !/^sub_[a-zA-Z0-9]+$/.test(body.subscriptionId))) throw new BillingError("Invalid subscription.");
    const url = await openPortal(getStripe(), billingIdentity(account), process.env.STRIPE_PORTAL_CONFIGURATION_ID!, origin, body.subscriptionId);
    return Response.json({ url });
  } catch (error) { return billingErrorResponse(error); }
}
