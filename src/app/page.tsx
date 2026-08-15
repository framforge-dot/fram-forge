import { About } from "@/components/about";
import { AppsSection } from "@/components/apps-section";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { WhatWeDo } from "@/components/what-we-do";

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <WhatWeDo />
        <AppsSection />
        <About />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
