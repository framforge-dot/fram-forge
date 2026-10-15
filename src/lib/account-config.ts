/** Only allow known local return destinations after sign-in. */
export function accountReturnPath(value: unknown): string {
  return typeof value === "string" && /^\/offers\/[a-zA-Z0-9_-]{20,80}$/.test(value)
    ? value
    : "/billing";
}

export function ownsOffer(clientEmail: string, verifiedEmails: string[]): boolean {
  return verifiedEmails.some(email => email.toLowerCase() === clientEmail.toLowerCase());
}

export function sameOrigin(requestUrl: string, origin: string | null, appUrl: string): boolean {
  try {
    return Boolean(origin) && new URL(origin!).origin === new URL(appUrl).origin && new URL(requestUrl).origin === new URL(appUrl).origin;
  } catch { return false; }
}
