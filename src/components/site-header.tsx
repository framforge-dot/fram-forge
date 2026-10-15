"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandMark } from "@/components/brand";
import { ButtonLink } from "@/components/button-link";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuId = useId();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-obsidian/80 backdrop-blur-xl"
          : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-[4.25rem]">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg text-paper"
          aria-label={`${site.name} home`}
          onClick={() => setOpen(false)}
        >
          <BrandMark priority className="h-7 w-auto sm:h-8" />
          <span className="font-display text-[1.05rem] font-semibold tracking-tight">
            {site.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-mist transition-colors hover:text-paper"
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/#contact" className="px-4 py-2 text-[0.8rem]">
            Start a project
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-paper md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        </button>
      </Container>

      <div
        id={menuId}
        hidden={!open}
        className="border-t border-line bg-obsidian/95 backdrop-blur-xl md:hidden"
      >
        <Container className="flex flex-col gap-1 py-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-lg text-paper"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <ButtonLink href="/#contact" className="mt-3" onClick={() => setOpen(false)}>
            Start a project
          </ButtonLink>
        </Container>
      </div>
    </header>
  );
}
