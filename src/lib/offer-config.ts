export type Offer = {
  code: string;
  title: string;
  websiteCents: number;
  monthlyCents: number;
  scope: string[];
  care: string[];
  terms: string;
  clientEmail: string;
};

export function parseOffers(raw: string | undefined): Offer[] {
  if (!raw?.trim()) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) throw new Error("Offers must be an array.");
  const codes = new Set<string>();
  return data.map((item: unknown) => {
    if (!item || typeof item !== "object") throw new Error("Invalid offer.");
    const o = item as Record<string, unknown>;
    if (typeof o.code !== "string" || !/^[a-zA-Z0-9_-]{20,80}$/.test(o.code) || codes.has(o.code)) throw new Error("Offer codes must be unique and at least 20 characters.");
    codes.add(o.code);
    for (const key of ["title", "terms"] as const) {
      if (typeof o[key] !== "string" || !o[key].trim()) throw new Error(`Missing offer ${key}.`);
    }
    for (const key of ["websiteCents", "monthlyCents"] as const) {
      if (typeof o[key] !== "number" || !Number.isSafeInteger(o[key]) || o[key] <= 0 || o[key] > 99999999) throw new Error("Prices must be positive integer cents.");
    }
    for (const key of ["scope", "care"] as const) {
      if (!Array.isArray(o[key]) || !o[key].length || !o[key].every((v: unknown) => typeof v === "string" && v.trim())) throw new Error(`Missing offer ${key}.`);
    }
    if (typeof o.clientEmail !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.clientEmail)) throw new Error("An intended client email is required.");
    return { code: o.code, title: o.title as string, websiteCents: o.websiteCents as number, monthlyCents: o.monthlyCents as number, scope: o.scope as string[], care: o.care as string[], terms: o.terms as string, clientEmail: o.clientEmail.trim().toLowerCase() };
  });
}

export function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: cents % 100 === 0 ? 0 : 2 }).format(cents / 100);
}

export const exampleOffer: Offer = {
  code: "example",
  title: "Your business website",
  websiteCents: 100000,
  monthlyCents: 5000,
  scope: ["A custom website shaped around your business", "Responsive layouts for mobile and desktop", "Launch support"],
  care: ["Website maintenance within your agreed scope", "Content updates as defined in your proposal", "A direct contact for website support"],
  terms: "This is an illustrative proposal. A real proposal will include the agreed deliverables, support limits, timeline, cancellation terms, and refund terms before payment is enabled.",
  clientEmail: "example@example.com",
};
