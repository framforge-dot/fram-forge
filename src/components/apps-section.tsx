import { BrandLockup } from "@/components/brand";
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
        {apps.length > 0 ? (
          <>
            <SectionHeading
              id="apps-heading"
              eyebrow="Apps"
              title="What we’re making."
              description="Independent products designed, built, and operated by Fram Forge."
            />
            <div className="mt-14 grid gap-4 md:grid-cols-3">
              {apps.map((app) => (
                <AppCard key={app.name} app={app} />
              ))}
            </div>
          </>
        ) : (
          <ComingSoon />
        )}
      </Container>
    </section>
  );
}

function ComingSoon() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-line bg-ink px-6 py-20 text-center sm:px-12 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-60" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-3xl" />
      <div className="relative mx-auto max-w-sm">
        <BrandLockup className="mx-auto w-[min(100%,18rem)]" />
        <h2
          id="apps-heading"
          className="font-display mt-10 text-3xl font-semibold tracking-tight text-paper sm:text-4xl"
        >
          Coming soon
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-mist">
          The first Fram Forge apps are in the fire. This space will hold them
          when they are ready to share.
        </p>
      </div>
    </div>
  );
}
