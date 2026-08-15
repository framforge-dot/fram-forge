import { About } from "@/components/about";
import { AppsSection } from "@/components/apps-section";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { WhatWeDo } from "@/components/what-we-do";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <AppsSection />
      <About />
      <Contact />
    </>
  );
}
