import { Container } from "@/components/container";
import { ButtonLink } from "@/components/button-link";
import { site } from "@/lib/site";

export function AccountSetup() {
  return <Container className="py-20 sm:py-28"><div className="mx-auto max-w-2xl"><p className="font-mono text-xs uppercase tracking-widest text-mist">Client accounts</p><h1 className="font-display mt-5 text-4xl font-semibold sm:text-5xl">Your website.<br />Your account.</h1><p className="mt-6 leading-relaxed text-mist">Sign in to review your proposal, see your monthly retainer, and manage or cancel your subscription.</p><div className="mt-8 rounded-3xl border border-line bg-steel p-6"><h2 className="text-lg font-semibold">Account access is being set up</h2><p className="mt-3 text-sm leading-relaxed text-mist">Registration and payments are not available yet. Contact us for help with your project or billing.</p><ButtonLink className="mt-5" href={`mailto:${site.email}`}>Contact Fram Forge</ButtonLink></div></div></Container>;
}
