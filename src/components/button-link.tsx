import { cn } from "@/lib/cn";

type ButtonLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
  onClick?: () => void;
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  onClick,
}: ButtonLinkProps) {
  const styles = {
    primary:
      "bg-ember text-obsidian hover:bg-ember-bright shadow-[0_0_32px_-8px_rgba(232,160,106,0.7)]",
    secondary:
      "border border-line bg-transparent text-paper hover:border-ember/50 hover:bg-white/[0.03]",
    ghost: "text-mist hover:text-paper",
  } as const;

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium tracking-wide transition-colors duration-200",
        styles[variant],
        className,
      )}
    >
      {children}
    </a>
  );
}
