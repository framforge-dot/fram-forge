# Billing moved off the website

October 16, 2026: the site is now an informational landing page and portfolio. Client accounts, proposals, checkout, portal routes, and the Stripe webhook handler have been removed from the application. Stripe payment links can be created and shared separately from the Stripe Dashboard.

No Stripe subscriptions, customers, or Clerk account records were deleted. Former website integration setup and sandbox test evidence remain in Git history. Existing provider credentials are no longer used by the application.
