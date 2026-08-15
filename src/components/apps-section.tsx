import { AppCard } from "@/components/app-card";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { apps } from "@/lib/site";

export function AppsSection() {
  return (
    <section
      id="apps"
      aria-labelledby="apps-heading"
      className="relative border-t border-line py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_60%)]" />
      <Container className="relative">
        <SectionHeading
          id="apps-heading"
          eyebrow="Apps"
          title="Products in the fire."
          description="A few of the things we are building and shipping. Names and links here are placeholders—swap them as products go live."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {apps.map((app) => (
            <AppCard key={app.name} app={app} />
          ))}
        </div>
      </Container>
    </section>
  );
}
