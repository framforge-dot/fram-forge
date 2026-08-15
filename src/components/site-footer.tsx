import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/container";
import { ForgeMark } from "@/components/forge-mark";
import { legal, site, social } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <Container className="flex flex-col gap-8 py-10">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <ForgeMark className="h-7 w-7" />
            <p className="text-sm text-ash">
              © {site.year} {site.legalName}. All rights reserved.
            </p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {social.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="inline-flex items-center gap-1 text-sm text-mist transition-colors hover:text-paper"
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
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
