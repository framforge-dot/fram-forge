import { Compass, Layers, PenTool, RefreshCw } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { capabilities } from "@/lib/site";

const icons = [Compass, PenTool, Layers, RefreshCw];

export function WhatWeDo() {
  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative border-t border-line py-20 sm:py-28"
    >
      <Container>
        <SectionHeading
          id="work-heading"
          eyebrow="What we do"
          title="Your business. Built for the web."
          description="From a first website to a fresh start, we bring design, development, and ongoing care together."
        />

        <ul className="mt-14 grid gap-4 sm:grid-cols-2">
          {capabilities.map((item, index) => {
            const Icon = icons[index];
            return (
              <li
                key={item.title}
                className="group rounded-3xl border border-line bg-steel/40 p-6 transition-colors duration-200 hover:border-paper/25 hover:bg-steel/70 sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-line bg-ink text-paper">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-ash">{item.number}</span>
                </div>
                <h3 className="font-display mt-6 text-xl font-semibold tracking-tight text-paper">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-mist sm:text-[0.95rem]">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
