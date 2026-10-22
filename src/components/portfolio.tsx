import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/lib/site";

export function Portfolio() {
  return <section id="portfolio" aria-labelledby="portfolio-heading" className="border-t border-line bg-ink py-20 sm:py-28">
    <Container>
      <SectionHeading id="portfolio-heading" eyebrow="Selected work" title="Real businesses. Their own identity." description="A look at the websites we’ve designed and built. Each one starts with the people and business behind it." />
      <div className="mt-12 space-y-8">{projects.map((project, index) => <article key={project.href} className="overflow-hidden rounded-3xl border border-line bg-steel/40">
        <a href={project.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${project.name} website (opens in a new tab)`} className="group block border-b border-line bg-[#181818] p-5 sm:p-10">
          <div className="overflow-hidden rounded-xl border border-white/15 shadow-2xl transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center gap-1.5 bg-steel px-4 py-3"><span className="h-2 w-2 rounded-full bg-ash"/><span className="h-2 w-2 rounded-full bg-ash"/><span className="h-2 w-2 rounded-full bg-ash"/><span className="ml-4 truncate font-mono text-[10px] text-mist">{new URL(project.href).hostname}</span></div>
            <div className="relative aspect-[16/9] overflow-hidden"><Image src={project.image} alt={`${project.name} website homepage`} fill sizes="(max-width: 768px) 100vw, 1100px" className="object-cover object-top" /></div>
          </div>
        </a>
        <div className="grid gap-6 p-6 sm:p-9 md:grid-cols-[1fr_1.1fr]">
          <div><p className="font-mono text-xs uppercase tracking-widest text-mist">0{index+1} / {project.category}</p><h3 className="font-display mt-3 text-3xl font-semibold sm:text-4xl">{project.name}</h3><a href={project.href} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 border-b border-paper/40 pb-1 text-sm">Visit website <ArrowUpRight className="h-4 w-4" aria-hidden/><span className="sr-only"> (opens in a new tab)</span></a></div>
          <div><p className="leading-relaxed text-mist">{project.description}</p><ul className="mt-5 flex flex-wrap gap-2">{project.tags.map(tag=><li key={tag} className="rounded-full border border-line px-3 py-1.5 text-xs text-mist">{tag}</li>)}</ul></div>
        </div>
      </article>)}</div>
    </Container>
  </section>;
}
