import { Container } from "@/components/container";
import { legalUpdated } from "@/lib/site";

export function LegalDocument({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="border-b border-line py-20 sm:py-28">
      <Container className="max-w-3xl">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-mist">
          {eyebrow}
        </p>
        <h1 className="font-display mt-4 text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-sm text-ash">Last updated {legalUpdated}</p>
        <div className="mt-12 space-y-10">{children}</div>
      </Container>
    </article>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-xl font-semibold tracking-tight text-paper">
        {title}
      </h2>
      <div className="space-y-3 text-[0.95rem] leading-relaxed text-mist [&_a]:text-paper [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}
