import { ClerkProvider } from "@clerk/nextjs";
import { accountsConfigured } from "@/lib/auth";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SkipLink } from "@/components/skip-link";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
};

export const metadata: Metadata = {
  title: {
    default: `${site.legalName} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    title: `${site.legalName} — ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "en_US",
    siteName: site.legalName,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const document = (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden bg-obsidian text-paper">
        <div className="grain" aria-hidden="true" />
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
  return accountsConfigured() ? (
    <ClerkProvider signInUrl="/sign-in" signUpUrl="/sign-up" signInFallbackRedirectUrl="/billing" signUpFallbackRedirectUrl="/billing" afterSignOutUrl="/" appearance={{ variables: { colorPrimary: "#ffffff", colorPrimaryForeground: "#000000", colorBackground: "#111111", colorForeground: "#ffffff", colorMutedForeground: "#a3a3a3", borderRadius: "1rem" } }}>
      {document}
    </ClerkProvider>
  ) : document;
}
