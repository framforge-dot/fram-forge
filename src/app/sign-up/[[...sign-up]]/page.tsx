import type { Metadata } from "next";
import { AccountAuth } from "@/components/account-auth";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Create an account", robots: { index: false, follow: false } };
export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <AccountAuth mode="sign-up" next={(await searchParams).next} />;
}
