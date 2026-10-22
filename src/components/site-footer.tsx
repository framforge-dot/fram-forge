import Link from "next/link";
import { BrandMark } from "@/components/brand";
import { Container } from "@/components/container";
import { legal, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="flex flex-col gap-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="h-6 w-auto" />
          <p className="text-sm text-ash">
            © {site.year} {site.legalName}. All rights reserved.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {legal.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-sm text-ash transition-colors hover:text-paper"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
