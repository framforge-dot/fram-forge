import { ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { HeroVisual } from "@/components/hero-visual";
import { site } from "@/lib/site";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-white/[0.04] blur-3xl animate-glow" />
      <div className="pointer-events-none absolute -right-16 top-0 h-[28rem] w-[28rem] rounded-full bg-white/[0.06] blur-3xl animate-glow" />

      <Container className="relative grid min-h-[calc(100vh-4.25rem)] items-center gap-14 py-20 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-8">
        <div>
          <p className="animate-fade-up font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-mist">
            Web design & ongoing support
          </p>
          <h1
            id="hero-heading"
            className="font-display animate-fade-up delay-1 mt-5 max-w-[14ch] text-4xl font-semibold tracking-tight text-paper sm:text-6xl lg:text-[4.25rem] lg:leading-[1.05]"
          >
            {site.tagline}
          </h1>
          <p className="animate-fade-up delay-2 mt-6 max-w-xl text-base leading-relaxed text-mist sm:text-lg">
            {site.description}
          </p>
          <div className="animate-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="/#contact">
              Let’s build your website
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ButtonLink>
            <ButtonLink href="/#portfolio" variant="secondary">
              Explore our work
            </ButtonLink>
          </div>
        </div>
        <HeroVisual />
      </Container>
    </section>
  );
}
