# Fram Forge LLC

A public landing page for the web design studio: services, selected work, about/process, and email contact. No authentication, checkout, subscriptions, or client dashboard runs on this site. Payments are handled separately through Stripe links.

## Development

Use Node.js 22.18 or later. Run `npm install`, `npm run dev`, `npm run build`, and `npm run lint`. No environment variables are required.

## Update the portfolio

Edit `projects` in `src/lib/site.ts`. Each project has a name, category, description, live URL, screenshot path, and tags. Put screenshots in `public/portfolio/`. The portfolio automatically renders each entry. Bound by Blood is the first featured project.

## Content

Services, navigation, contact email and metadata live in `src/lib/site.ts`. Confirm the contact inbox before changing it. The contact button opens the visitor’s email app.

## Deployment

Push main to deploy on Vercel. Former /billing, /sign-in, /sign-up and /offers URLs redirect to the contact section. The old billing API routes are removed. Existing Stripe and Clerk account records are not deleted by this change. Historical integration details are preserved in Git history.
