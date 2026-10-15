import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { accountsConfigured } from "@/lib/auth";
import { getStripe, stripeMode } from "@/lib/stripe";
import { receiveBillingWebhook } from "@/lib/billing-webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !process.env.STRIPE_SECRET_KEY || !accountsConfigured()) {
    return Response.json({ error: "Webhook is not configured." }, { status: 503 });
  }
  return receiveBillingWebhook(request, secret, {
    stripe: getStripe(),
    live: stripeMode() === "live",
    async customerForUser(userId, mode) {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);
      const ids = user.privateMetadata.stripeCustomerIds as Record<string, unknown> | undefined;
      return typeof ids?.[mode] === "string" ? ids[mode] : null;
    },
    refresh() { revalidatePath("/billing"); },
  });
}
