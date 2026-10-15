import type { Metadata } from "next";
import { AccountAuth } from "@/components/account-auth";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };
export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <AccountAuth mode="sign-in" next={(await searchParams).next} />;
}
