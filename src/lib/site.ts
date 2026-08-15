/**
 * Site content and placeholders.
 *
 * Replace the values marked REPLACE before launch:
 * - app names, descriptions, and store / web links
 * - contact email
 * - social profile URLs
 */

export const site = {
  name: "Fram Forge",
  legalName: "Fram Forge LLC",
  tagline: "We forge apps worth using.",
  description:
    "Fram Forge LLC is an independent app studio that designs, builds, and brings thoughtful digital products to life.",
  /** REPLACE: public contact email */
  email: "hello@framforge.com",
  /** REPLACE: production site URL used for metadata */
  url: "https://framforge.com",
  year: 2026,
};

export const nav = [
  { label: "Home", href: "#home" },
  { label: "Apps", href: "#apps" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;

export const capabilities = [
  {
    number: "01",
    title: "Product Strategy",
    description:
      "Every product starts with a sharp problem and a point of view. We decide who it is for, what it will refuse to do, and why it deserves to exist before a single screen is drawn.",
  },
  {
    number: "02",
    title: "App Design",
    description:
      "Interfaces that feel inevitable. We design for clarity, rhythm, and a little delight so each product looks considered and works the way people expect.",
  },
  {
    number: "03",
    title: "Development & Launch",
    description:
      "We build the real thing: native-quality web and mobile experiences, then ship them. Launch is a milestone in the life of a product, not the finish line.",
  },
  {
    number: "04",
    title: "Ongoing Product Improvement",
    description:
      "After release we stay close. We watch how people actually use what we made, tighten the edges, and keep forging the next version.",
  },
] as const;

export type AppTone = "high" | "mid" | "low";

export type AppProduct = {
  /** REPLACE: public product name */
  name: string;
  /** REPLACE: short category label */
  category: string;
  /** REPLACE: marketing description */
  description: string;
  /** REPLACE: App Store, Play Store, or product URL. Leave undefined if unreleased. */
  href?: string;
  comingSoon?: boolean;
  tone: AppTone;
};

export const apps: AppProduct[] = [
  {
    name: "Keel",
    category: "Daily navigation",
    description:
      "A calm companion for the day’s work. Keel keeps the next right thing in view so the rest of the noise can wait.",
    href: "#contact",
    tone: "high",
  },
  {
    name: "Lumen",
    category: "Notes & capture",
    description:
      "Catch thoughts at the speed they arrive. Lumen is a lightweight space for notes that actually get revisited.",
    href: "#contact",
    tone: "mid",
  },
  {
    name: "Rivermill",
    category: "New product",
    description:
      "A new Fram Forge product currently in the fire. Shape still forming. Details when it is ready to share.",
    comingSoon: true,
    tone: "low",
  },
];

export const processSteps = [
  "Idea",
  "Design",
  "Build",
  "Launch",
  "Improve",
] as const;

/** REPLACE: social profile URLs */
export const social = [
  { label: "X", href: "https://x.com/yourhandle" },
  { label: "Instagram", href: "https://instagram.com/yourhandle" },
  { label: "GitHub", href: "https://github.com/yourhandle" },
] as const;
