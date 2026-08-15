import { ArrowUpRight } from "lucide-react";
import type { AppProduct } from "@/lib/site";
import { cn } from "@/lib/cn";

const accents = {
  ember: {
    glow: "from-ember/20",
    chip: "text-ember-bright",
    shape: "#e8a06a",
  },
  moss: {
    glow: "from-moss/20",
    chip: "text-moss",
    shape: "#7dcaa8",
  },
  violet: {
    glow: "from-violet/20",
    chip: "text-violet",
    shape: "#b7a4e8",
  },
} as const;

function CardArt({ accent }: { accent: AppProduct["accent"] }) {
  const color = accents[accent].shape;
  return (
    <svg viewBox="0 0 320 140" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="140" fill="transparent" />
      <circle cx="250" cy="30" r="54" fill={color} opacity="0.16" />
      <rect
        x="28"
        y="34"
        width="92"
        height="72"
        rx="14"
        fill="none"
        stroke={color}
        strokeWidth="1.4"
      />
      <rect x="42" y="48" width="40" height="8" rx="4" fill={color} opacity="0.85" />
      <rect x="42" y="64" width="64" height="6" rx="3" fill={color} opacity="0.35" />
      <rect x="42" y="78" width="52" height="6" rx="3" fill={color} opacity="0.22" />
    </svg>
  );
}

export function AppCard({ app }: { app: AppProduct }) {
  const palette = accents[app.accent];
  const inner = (
    <>
      <div
        className={cn(
          "relative h-36 overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br to-transparent",
          palette.glow,
        )}
      >
        <CardArt accent={app.accent} />
        {app.comingSoon ? (
          <span className="absolute right-3 top-3 rounded-full border border-violet/40 bg-obsidian/80 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-violet">
            Coming Soon
          </span>
        ) : null}
      </div>
      <p className={cn("mt-5 font-mono text-[0.68rem] uppercase tracking-[0.18em]", palette.chip)}>
        {app.category}
      </p>
      <div className="mt-2 flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl font-semibold tracking-tight text-paper">
          {app.name}
        </h3>
        {app.href && !app.comingSoon ? (
          <ArrowUpRight
            className="mt-1 h-4 w-4 text-ash transition-colors group-hover:text-paper"
            aria-hidden
          />
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-mist">{app.description}</p>
    </>
  );

  const className = cn(
    "group flex h-full flex-col rounded-3xl border border-line bg-ink/80 p-4 transition-colors duration-200 hover:border-ember/35 hover:bg-steel/60 sm:p-5",
    !app.comingSoon && "motion-safe:transition-transform motion-safe:hover:-translate-y-1",
  );

  if (app.href && !app.comingSoon) {
    return (
      <a href={app.href} className={className}>
        {inner}
      </a>
    );
  }

  return (
    <article className={className} aria-label={`${app.name}, coming soon`}>
      {inner}
    </article>
  );
}
