import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { processSteps } from "@/lib/site";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative border-t border-line py-20 sm:py-28"
    >
      <Container className="grid items-start gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <SectionHeading
          id="about-heading"
          eyebrow="About"
          title="Built to make useful things."
          description="Fram Forge LLC is an independent app studio. We take products from a spark of an idea through design, engineering, and launch—then stay with them. Shipping is not the end of the work. We keep shaping, measuring, and improving so our apps remain worth opening."
        />

        <ol className="relative overflow-hidden rounded-3xl border border-line bg-steel/40 p-6 sm:p-8">
          <span
            className="absolute bottom-10 left-[3.35rem] top-10 w-px bg-gradient-to-b from-paper/50 via-line to-paper/10"
            aria-hidden="true"
          />
          {processSteps.map((step, index) => (
            <li key={step} className="relative flex items-center gap-4 py-3.5">
              <span className="font-mono w-8 text-xs text-ash">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="relative z-10 flex h-2.5 w-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full rounded-full bg-paper/25" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-paper" />
              </span>
              <span className="font-display text-lg font-semibold tracking-tight text-paper">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
