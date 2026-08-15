import Image from "next/image";
import { cn } from "@/lib/cn";

type BrandProps = {
  className?: string;
  priority?: boolean;
};

export function BrandMark({ className, priority = false }: BrandProps) {
  return (
    <Image
      src="/brand/mark.png"
      alt=""
      width={429}
      height={370}
      priority={priority}
      className={cn("h-8 w-auto", className)}
    />
  );
}

export function BrandLockup({ className, priority = false }: BrandProps) {
  return (
    <Image
      src="/brand/lockup.png"
      alt="Fram Forge LLC"
      width={704}
      height={451}
      priority={priority}
      className={cn("h-auto w-full", className)}
    />
  );
}
