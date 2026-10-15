import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="relative border-t border-line py-20 sm:py-28"
    >
      <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Let’s talk about your website."
            description="Tell us about your business, what you need, and when you would like to launch. We’ll follow up with next steps and a quote tailored to your project."
          />
          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-line bg-steel/50 px-4 py-3 text-sm text-paper transition-colors hover:border-paper/40"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper">
              <Mail className="h-4 w-4" aria-hidden />
            </span>
            {/* REPLACE: contact email in src/lib/site.ts */}
            {site.email}
          </a>
        </div>
        <ContactForm />
      </Container>
    </section>
  );
}
