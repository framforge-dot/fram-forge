import { ArrowRight, Check, CreditCard, Repeat2 } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="border-t border-line bg-ink py-20 sm:py-28">
      <Container>
        <SectionHeading id="pricing-heading" eyebrow="Simple from the start" title="One project. A plan to keep it growing." description="Every business needs something different. Your proposal spells out the website cost, the monthly retainer, and exactly what each includes." />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <article className="rounded-3xl border border-line bg-steel/60 p-7 sm:p-9">
            <CreditCard className="h-6 w-6 text-mist" aria-hidden />
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-mist">01 / Your website</p>
            <h3 className="font-display mt-3 text-3xl font-semibold">Built around your business.</h3>
            <p className="mt-4 leading-relaxed text-mist">A custom project price, agreed before we begin. Review your proposal and pay securely online when you’re ready.</p>
            <ul className="mt-7 space-y-3 text-sm">
              {["A clear scope and project price", "Design, development, and launch", "Your own proposal and payment page"].map(item => <li key={item} className="flex gap-3"><Check className="h-4 w-4 shrink-0" aria-hidden />{item}</li>)}
            </ul>
          </article>
          <article className="rounded-3xl border border-paper/25 bg-obsidian p-7 sm:p-9">
            <Repeat2 className="h-6 w-6 text-mist" aria-hidden />
            <p className="mt-8 font-mono text-xs uppercase tracking-widest text-mist">02 / Your monthly retainer</p>
            <h3 className="font-display mt-3 text-3xl font-semibold">Support that stays with you.</h3>
            <p className="mt-4 leading-relaxed text-mist">An agreed monthly amount for ongoing care. Once you subscribe, payments renew automatically so support stays simple.</p>
            <ul className="mt-7 space-y-3 text-sm">
              {["Maintenance and updates defined in your scope", "Clear monthly pricing and start terms", "Access to invoices and subscription management"].map(item => <li key={item} className="flex gap-3"><Check className="h-4 w-4 shrink-0" aria-hidden />{item}</li>)}
            </ul>
          </article>
        </div>
        <div className="mt-8 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-mist">No one-size-fits-all packages. We’ll put together a website and support plan that fits your project.</p>
          <ButtonLink href="/#contact">Get a custom quote <ArrowRight className="h-4 w-4" aria-hidden /></ButtonLink>
        </div>
      </Container>
    </section>
  );
}
