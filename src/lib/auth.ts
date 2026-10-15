import "server-only";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { accountReturnPath } from "@/lib/account-config";

export function accountsConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY);
}

export async function getAccount() {
  if (!accountsConfigured()) return null;
  const user = await currentUser();
  if (!user) return null;
  return {
    id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? "",
    verifiedEmails: user.emailAddresses.filter(email => email.verification?.status === "verified").map(email => email.emailAddress),
    privateMetadata: user.privateMetadata,
  };
}

export async function requireAccount(returnPath = "/billing") {
  const account = await getAccount();
  if (!account) redirect(`/sign-in?next=${encodeURIComponent(accountReturnPath(returnPath))}`);
  return account;
}
