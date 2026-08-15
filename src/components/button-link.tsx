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
    primary: "bg-paper text-obsidian hover:bg-mist",
    secondary:
      "border border-line bg-transparent text-paper hover:border-paper/40 hover:bg-white/[0.04]",
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
