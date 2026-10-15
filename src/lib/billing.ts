import "server-only";
import { parseOffers } from "@/lib/offer-config";

export function getOffer(code: string) {
  try {
    return parseOffers(process.env.FRAM_FORGE_OFFERS).find(offer => offer.code === code);
  } catch {
    // Never log proposal contents or client information.
    console.error("Invalid FRAM_FORGE_OFFERS configuration; checkout is unavailable.");
    return undefined;
  }
}

export function getOffers() {
  return parseOffers(process.env.FRAM_FORGE_OFFERS);
}
