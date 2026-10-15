import type { Metadata } from "next";
import type Stripe from "stripe";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowUpRight, CreditCard, FileText, Repeat2 } from "lucide-react";
import { Container } from "@/components/container";
import { BillingAction } from "@/components/billing-action";
import { AccountSetup } from "@/components/account-setup";
import { accountsConfigured, requireAccount } from "@/lib/auth";
import { getOffers } from "@/lib/billing";
import { ownsOffer } from "@/lib/account-config";
import { accountCustomer } from "@/lib/billing-service";
import { billingIdentity, getStripe, paymentsConfigured } from "@/lib/stripe";
import { money } from "@/lib/offer-config";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My account", description: "Your website projects and monthly retainers.", robots: { index: false, follow: false } };

export default async function BillingPage() {
  if (!accountsConfigured()) return <AccountSetup />;
  const account = await requireAccount();
  const configured = paymentsConfigured();
  let subscriptions: Stripe.Subscription[] = [];
  let hasCustomer = false;
  let unavailable = false;
  let offers: ReturnType<typeof getOffers> = [];
  let offersUnavailable = false;
  try { offers = getOffers().filter(offer => ownsOffer(offer.clientEmail, account.verifiedEmails)); }
  catch { offersUnavailable = true; }
  if (configured) {
    try {
      const stripe = getStripe();
      const customer = await accountCustomer(stripe, billingIdentity(account));
      hasCustomer = Boolean(customer);
      if (customer) subscriptions = await stripe.subscriptions.list({ customer: customer.id, status: "all", limit: 100, expand: ["data.latest_invoice"] }).autoPagingToArray({ limit: 1000 });
    } catch { unavailable = true; }
  }
  const purchasedCodes = new Set(subscriptions.map(subscription => subscription.metadata.offerCode));
  const proposals = offers.filter(offer => !purchasedCodes.has(offer.code));

  return (
    <Container className="py-16 sm:py-24">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div><p className="font-mono text-xs uppercase tracking-widest text-mist">Your client account</p><h1 className="font-display mt-4 text-4xl font-semibold sm:text-6xl">Welcome back.</h1><p className="mt-4 break-all text-sm text-mist">{account.email}</p></div>
        <div className="flex items-center gap-3 rounded-full border border-line px-4 py-3"><span className="text-sm text-mist">Account & sign out</span><UserButton /></div>
      </div>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">{[{ icon: Repeat2, title: "Your retainer", description: "See your status and upcoming renewal." }, { icon: CreditCard, title: "Payment details", description: "Update your saved payment method." }, { icon: FileText, title: "Invoices", description: "Find your billing history in the secure portal." }].map(({ icon: Icon, title, description }) => <div key={title} className="rounded-2xl border border-line bg-steel/50 p-5"><Icon className="h-5 w-5 text-mist" aria-hidden /><h2 className="mt-5 font-medium">{title}</h2><p className="mt-2 text-sm leading-relaxed text-mist">{description}</p></div>)}</div>
      <section className="mt-12" aria-labelledby="retainers-heading">
        <div className="flex flex-wrap items-center justify-between gap-5"><h2 id="retainers-heading" className="font-display text-2xl font-semibold">Your subscriptions</h2>{hasCustomer && !unavailable && <BillingAction action="portal">Manage billing & invoices <ArrowUpRight className="ml-2 inline h-4 w-4" aria-hidden /></BillingAction>}</div>
        {!configured ? <Notice>Payments are being set up. Your account is ready; contact us for help with your proposal.</Notice> : unavailable ? <Notice>We couldn’t load your current billing details. Refresh the page or contact us. This does not mean your subscription has ended.</Notice> : subscriptions.length === 0 ? <Notice>No subscriptions yet. Once you pay for your proposal, your monthly retainer will appear here. If you just paid, refresh this page in a moment.</Notice> : <div className="mt-6 grid gap-5 lg:grid-cols-2">{subscriptions.map(subscription => <SubscriptionCard key={subscription.id} subscription={subscription} />)}</div>}
      </section>
      <section className="mt-12" aria-labelledby="proposals-heading"><h2 id="proposals-heading" className="font-display text-2xl font-semibold">Your proposals</h2>{offersUnavailable ? <Notice>We couldn’t load your proposals. Please contact us.</Notice> : proposals.length ? <div className="mt-6 grid gap-4 lg:grid-cols-2">{proposals.map(offer => <Link key={offer.code} href={`/offers/${offer.code}`} className="rounded-2xl border border-line bg-ink p-6 transition-colors hover:border-paper/40"><h3 className="font-display text-xl font-semibold">{offer.title}</h3><p className="mt-3 text-sm text-mist">{money(offer.websiteCents)} website + {money(offer.monthlyCents)}/month</p><p className="mt-5 text-sm">Review your proposal <ArrowUpRight className="ml-1 inline h-4 w-4" aria-hidden /></p></Link>)}</div> : <Notice>No new proposals are waiting. If you expected one, check that you’re using the email it was sent to.</Notice>}</section>
      <p className="mt-10 text-sm text-mist">Questions about your website or billing? <a className="text-paper underline underline-offset-4" href={`mailto:${site.email}`}>Contact Fram Forge</a>.</p>
    </Container>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 rounded-2xl border border-line bg-steel/40 p-6 text-sm leading-relaxed text-mist">{children}</p>;
}

function SubscriptionCard({ subscription: sub }: { subscription: Stripe.Subscription }) {
  const ended = ["canceled", "incomplete_expired"].includes(sub.status);
  const ending = !ended && (sub.cancel_at_period_end || Boolean(sub.cancel_at));
  const status = ending ? "Cancellation scheduled" : (({ active: "Active", trialing: "Trial", past_due: "Payment overdue", unpaid: "Unpaid", canceled: "Canceled", incomplete: "Payment incomplete", incomplete_expired: "Expired", paused: "Paused" } as Record<string, string>)[sub.status] ?? sub.status);
  const date = ended ? sub.ended_at : sub.cancel_at || sub.items.data[0]?.current_period_end;
  const dateLabel = ended ? "Ended" : ending ? "Ends" : ["active", "trialing"].includes(sub.status) ? "Next renewal" : "Current period ends";
  return <article className="rounded-3xl border border-line bg-steel/40 p-6 sm:p-8"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-display text-xl font-semibold">{sub.metadata.projectTitle || "Website retainer"}</h3><span className="rounded-full border border-line px-3 py-1 text-xs">{status}</span></div><div className="mt-6 space-y-2">{sub.items.data.map(item => <p key={item.id} className="text-2xl font-semibold">{item.price.unit_amount !== null ? new Intl.NumberFormat("en-US", { style: "currency", currency: item.price.currency }).format(item.price.unit_amount * (item.quantity ?? 1) / 100) : "See invoice"}<span className="text-sm font-normal text-mist">{item.price.recurring ? ` / ${item.price.recurring.interval_count > 1 ? `${item.price.recurring.interval_count} ` : ""}${item.price.recurring.interval}${item.price.recurring.interval_count > 1 ? "s" : ""}` : ""}</span></p>)}</div>{date && <p className="mt-3 text-sm text-mist">{dateLabel}: {new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(date * 1000))}</p>}{sub.latest_invoice && typeof sub.latest_invoice !== "string" && <InvoiceStatus invoice={sub.latest_invoice} />}{ending && <p className="mt-4 text-sm leading-relaxed text-mist">Cancellation is scheduled. Open billing to review the details.</p>}{!ended && !ending && <div className="mt-6"><BillingAction action="portal" subscriptionId={sub.id} secondary>Cancel retainer</BillingAction><p className="mt-3 text-xs leading-relaxed text-mist">You’ll review and confirm cancellation securely with Stripe.</p></div>}</article>;
}

function InvoiceStatus({ invoice }: { invoice: Stripe.Invoice }) {
  const paid = invoice.status === "paid";
  const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency }).format((paid ? invoice.amount_paid : invoice.amount_remaining) / 100);
  const label = paid ? `Latest invoice paid: ${amount}` : invoice.status === "open" ? `Payment outstanding: ${amount}` : invoice.status === "uncollectible" ? "Latest invoice: payment unresolved" : invoice.status === "void" ? "Latest invoice: voided" : "Latest invoice: being prepared";
  return <p className="mt-4 rounded-xl border border-line p-3 text-sm text-mist">{label}{invoice.status === "open" && " — open billing to review or pay your invoice."}</p>;
}
