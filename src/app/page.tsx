import { About } from "@/components/about";
import { Pricing } from "@/components/pricing";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { WhatWeDo } from "@/components/what-we-do";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Pricing />
      <About />
      <Contact />
    </>
  );
}
