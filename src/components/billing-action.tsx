"use client";

import { useState } from "react";
import Link from "next/link";

export function BillingAction({ action, code, subscriptionId, children, secondary = false }: { action: "checkout" | "portal"; code?: string; subscriptionId?: string; children: React.ReactNode; secondary?: boolean }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function onClick() {
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const response = await fetch(`/api/billing/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action === "checkout" ? { code } : { subscriptionId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Please try again in a moment.");
      const url = new URL(result.url);
      if (url.protocol !== "https:" || !["checkout.stripe.com", "billing.stripe.com"].includes(url.hostname)) throw new Error("Unable to open secure billing.");
      window.location.assign(url.toString());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Please try again in a moment.");
      setPending(false);
    }
  }
  return <div><button type="button" onClick={onClick} disabled={pending} className={`inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-colors disabled:cursor-wait disabled:opacity-60 ${secondary ? "border border-line text-paper hover:bg-steel" : "bg-paper text-obsidian hover:bg-mist"}`}>{pending ? "Opening secure billing…" : children}</button>{error && <p role="alert" className="mt-3 text-sm leading-relaxed text-mist">{error} <Link href="/billing" className="text-paper underline">My account</Link></p>}</div>;
}
