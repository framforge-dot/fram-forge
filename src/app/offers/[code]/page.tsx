import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, LockKeyhole } from "lucide-react";
import { Container } from "@/components/container";
import { BillingAction } from "@/components/billing-action";
import { AccountSetup } from "@/components/account-setup";
import { accountsConfigured, requireAccount } from "@/lib/auth";
import { ownsOffer } from "@/lib/account-config";
import { paymentsConfigured } from "@/lib/stripe";
import { getOffer } from "@/lib/billing";
import { exampleOffer, money } from "@/lib/offer-config";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Your website proposal",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function OfferPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const isExample = code === "example";
  const offer = isExample ? exampleOffer : getOffer(code);
  if (!offer) notFound();
  if (!isExample) {
    if (!accountsConfigured()) return <AccountSetup />;
    const account = await requireAccount(`/offers/${code}`);
    if (!ownsOffer(offer.clientEmail, account.verifiedEmails)) notFound();
  }

  return (
    <Container className="py-16 sm:py-24">
      {isExample && <p className="mb-10 rounded-2xl border border-line bg-steel px-5 py-4 text-sm text-mist"><strong className="text-paper">Example proposal.</strong> This shows how your custom offer will look. Payments are disabled.</p>}
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-mist">Prepared by Fram Forge</p>
      <h1 className="font-display mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">{offer.title}</h1>
      <p className="mt-5 max-w-2xl leading-relaxed text-mist">Your website, your ongoing support, and a clear plan for both. Review the details below before continuing to secure checkout.</p>
      <div className="mt-12 grid items-start gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <Scope title="Your website" items={offer.scope} />
          <Scope title="Your monthly retainer" items={offer.care} />
          <section className="rounded-3xl border border-line p-6 sm:p-8"><h2 className="font-display text-xl font-semibold">Project & support terms</h2><p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-mist">{offer.terms}</p></section>
        </div>
        <aside aria-label="Payment summary" className="rounded-3xl border border-paper/25 bg-steel/60 p-6 sm:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-mist">Your investment · USD</p>
          <dl className="mt-7 space-y-5 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-mist">Website · one time</dt><dd>{money(offer.websiteCents)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-mist">First month of support</dt><dd>{money(offer.monthlyCents)}</dd></div>
            <div className="border-t border-line pt-6"><dt className="text-mist">Due today</dt><dd className="font-display mt-2 text-5xl font-semibold">{money(offer.websiteCents + offer.monthlyCents)}</dd></div>
            <div className="flex justify-between gap-4 border-t border-line pt-5"><dt className="text-mist">Then every month</dt><dd className="font-semibold">{money(offer.monthlyCents)}/month</dd></div>
          </dl>
          <p className="mt-5 text-xs leading-relaxed text-mist">The retainer starts with your website payment and renews monthly until canceled under your proposal terms.</p>
          {isExample ? <button disabled className="mt-7 w-full rounded-full border border-line bg-paper/10 px-5 py-3 text-sm text-mist">Example only · checkout disabled</button> : paymentsConfigured() ? <div className="mt-7"><BillingAction action="checkout" code={offer.code}>Pay & start monthly retainer</BillingAction></div> : <p className="mt-7 rounded-2xl border border-line p-4 text-sm text-mist">Payments are being set up. Contact us before paying.</p>}
          <p className="mt-4 flex items-center justify-center gap-2 text-xs text-mist"><LockKeyhole className="h-3.5 w-3.5" aria-hidden />Secure checkout hosted by Stripe</p>
          <p className="mt-6 text-xs leading-relaxed text-mist">Review your proposal, our <a className="underline underline-offset-4" href="/terms">terms</a>, and <a className="underline underline-offset-4" href="/privacy">privacy policy</a> before paying. Already subscribed? <a className="text-paper underline underline-offset-4" href="/billing">My account</a>.</p>
        </aside>
      </div>
      <p className="mt-10 text-sm text-mist">Need to adjust something? <a href={`mailto:${site.email}`} className="text-paper underline underline-offset-4">Let’s talk before you pay.</a></p>
    </Container>
  );
}

function Scope({ title, items }: { title: string; items: string[] }) {
  return <section className="rounded-3xl border border-line p-6 sm:p-8"><h2 className="font-display text-2xl font-semibold">{title}</h2><ul className="mt-5 space-y-4">{items.map((item, i) => <li key={i} className="flex gap-3 text-sm leading-relaxed text-mist"><Check className="mt-0.5 h-4 w-4 shrink-0 text-paper" aria-hidden />{item}</li>)}</ul></section>;
}
