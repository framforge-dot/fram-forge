import { About } from "@/components/about";
import { Portfolio } from "@/components/portfolio";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { WhatWeDo } from "@/components/what-we-do";

export default function Home() {
  return (
    <>
      <Hero />
      <WhatWeDo />
      <Portfolio />
      <About />
      <Contact />
    </>
  );
}
