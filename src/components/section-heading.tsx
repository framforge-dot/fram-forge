import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  id?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
      )}
    >
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.22em] text-ember-bright">
        {eyebrow}
      </p>
      <h2
        id={id}
        className="font-display mt-3 text-3xl font-semibold tracking-tight text-paper sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
      >
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-mist sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
