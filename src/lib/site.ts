/**
 * Site content and placeholders.
 *
 * Replace the values marked REPLACE before launch:
 * - contact email
 */

export const site = {
  name: "Fram Forge",
  legalName: "Fram Forge LLC",
  tagline: "Websites built for your next chapter.",
  description:
    "Custom websites for businesses ready to grow. We design, build, and launch your site, then keep it moving with ongoing support.",
  /** REPLACE: public contact email */
  email: "hello@framforge.com",
  /** REPLACE: production site URL used for metadata */
  url: "https://framforge.com",
  year: 2026,
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#work" },
  { label: "How it works", href: "/#pricing" },
  { label: "About", href: "/#about" },
  { label: "My account", href: "/billing" },
] as const;

export const legal = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
] as const;

/** Last updated date shown on legal pages. */
export const legalUpdated = "October 14, 2026";

export const capabilities = [
  {
    number: "01", title: "A plan for your business",
    description: "We start with what you do, who you serve, and what your website needs to achieve. You get a clear scope and a custom quote before work begins.",
  },
  {
    number: "02", title: "Design that feels like you",
    description: "A thoughtful, mobile-friendly website shaped around your brand, with clear navigation and a straightforward path for visitors to get in touch.",
  },
  {
    number: "03", title: "Built and ready to launch",
    description: "We bring the design to life, check it across screen sizes, and help get your business online. One point of contact from the first conversation to launch.",
  },
  {
    number: "04", title: "Support beyond launch",
    description: "Keep a developer in your corner. A monthly retainer covers the maintenance and updates agreed in your proposal, with predictable recurring billing.",
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

/** Add products here when they are ready to show on the homepage. */
export const apps: AppProduct[] = [];

export const processSteps = [
  "Tell us about your business",
  "Review your custom proposal",
  "Design & build",
  "Launch your website",
  "Ongoing care & support",
] as const;

/** Add social profile URLs here when they are ready to show. */
export const social: { label: string; href: string }[] = [];
