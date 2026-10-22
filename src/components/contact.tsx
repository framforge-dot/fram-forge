import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { site } from "@/lib/site";

export function Contact() {
  return <section id="contact" aria-labelledby="contact-heading" className="border-t border-line bg-paper py-20 text-obsidian sm:py-28">
    <Container className="flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
      <div><p className="font-mono text-xs uppercase tracking-[0.2em] text-black/60">Let’s build something</p><h2 id="contact-heading" className="font-display mt-5 max-w-[16ch] text-4xl font-semibold tracking-tight sm:text-6xl">Your next website starts with a conversation.</h2><p className="mt-6 max-w-xl leading-relaxed text-black/65">Tell us about your business and what you have in mind. We’ll take it from there.</p></div>
      <a href={`mailto:${site.email}`} className="inline-flex shrink-0 items-center gap-4 rounded-full bg-obsidian px-6 py-4 text-sm text-paper transition-colors hover:bg-black/80">{site.email}<ArrowUpRight className="h-5 w-5" aria-hidden/></a>
    </Container>
  </section>;
}
