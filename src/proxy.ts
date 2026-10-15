import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

const withClerk = clerkMiddleware({
  // Accept session tokens issued for this site, rather than sibling subdomains.
  authorizedParties: process.env.APP_URL ? [new URL(process.env.APP_URL).origin] : undefined,
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  // Stripe authenticates delivery with its signature, independently of cookies.
  if (request.nextUrl.pathname === "/api/stripe/webhook") return NextResponse.next();
  // Local preview works without provider credentials. Protected resources also
  // check configuration and identity themselves; this never grants access.
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || !process.env.CLERK_SECRET_KEY) {
    return NextResponse.next();
  }
  return withClerk(request, event);
}

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)", "/__clerk/(.*)"],
};
