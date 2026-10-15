import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { parseOffers, money } from "../src/lib/offer-config.ts";

const filename = new URL("../.env.local", import.meta.url);
if (existsSync(filename)) process.loadEnvFile(filename);
const offers = parseOffers(process.env.FRAM_FORGE_OFFERS);
const rl = createInterface({ input: stdin, output: stdout });
const ask = async (label) => (await rl.question(`${label}: `)).trim();
const cents = (value) => {
  if (!/^\d+(\.\d{1,2})?$/.test(value)) throw new Error("Enter a positive dollar amount, e.g. 1000 or 50.00.");
  return Math.round(Number(value) * 100);
};

try {
  console.log("Create an account-linked website proposal. The client must sign in with the email you assign. Checkout uses these prices automatically and starts the monthly retainer immediately.");
  const offer = {
    code: randomBytes(24).toString("base64url"),
    title: await ask("Project title"),
    websiteCents: cents(await ask("One-time website price in USD")),
    monthlyCents: cents(await ask("Monthly retainer in USD")),
    clientEmail: await ask("Client email (they must verify this address when signing up)"),
    scope: (await ask("Website deliverables (separate items with |)")).split("|").map(s => s.trim()),
    care: (await ask("Retainer inclusions and limits (separate items with |)")).split("|").map(s => s.trim()),
    terms: await ask("Agreed timeline, cancellation, and refund terms"),
  };
  const updated = parseOffers(JSON.stringify([...offers, offer]));
  console.log(`\nProposal total: ${money(offer.websiteCents + offer.monthlyCents)} today, then ${money(offer.monthlyCents)}/month.`);
  const confirm = await ask("Are these the agreed prices and terms for this client? Type yes to save");
  if (confirm.toLowerCase() !== "yes") throw new Error("Not saved. Review the offer before sharing.");
  let env = existsSync(filename) ? readFileSync(filename, "utf8") : "";
  for (const [key, value] of Object.entries({ FRAM_FORGE_OFFERS: JSON.stringify(updated).replaceAll("'", "\\u0027") })) {
    const line = `${key}='${value}'`;
    const pattern = new RegExp(`^${key}=.*$`, "m");
    env = pattern.test(env) ? env.replace(pattern, () => line) : `${env.trimEnd()}\n${line}\n`;
  }
  writeFileSync(filename, env.trimStart(), { mode: 0o600 });
  console.log(`\nSaved to .env.local. Preview: http://localhost:3000/offers/${offer.code}`);
  console.log(`To publish, copy FRAM_FORGE_OFFERS from .env.local to your hosting environment and redeploy. Share /offers/${offer.code} on your live domain afterward.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  rl.close();
}
