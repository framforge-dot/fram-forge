import { SignIn, SignUp } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { accountsConfigured, getAccount } from "@/lib/auth";
import { accountReturnPath } from "@/lib/account-config";
import { AccountSetup } from "@/components/account-setup";
import { Container } from "@/components/container";

export async function AccountAuth({ mode, next }: { mode: "sign-in" | "sign-up"; next: unknown }) {
  if (!accountsConfigured()) return <AccountSetup />;
  const destination = accountReturnPath(next);
  if (await getAccount()) redirect(destination);
  return <Container className="py-16 sm:py-24"><div className="mx-auto flex max-w-lg flex-col items-center"><h1 className="font-display text-center text-3xl font-semibold">{mode === "sign-up" ? "Create your client account" : "Welcome back"}</h1><p className="mb-8 mt-4 text-center text-sm leading-relaxed text-mist">Use the email address your proposal was sent to. Your account keeps your website payments and monthly retainer together.</p>{mode === "sign-up" ? <SignUp path="/sign-up" routing="path" signInUrl={`/sign-in?next=${encodeURIComponent(destination)}`} forceRedirectUrl={destination} signInForceRedirectUrl={destination} /> : <SignIn path="/sign-in" routing="path" signUpUrl={`/sign-up?next=${encodeURIComponent(destination)}`} forceRedirectUrl={destination} signUpForceRedirectUrl={destination} />}</div></Container>;
}
