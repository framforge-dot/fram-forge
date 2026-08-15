# Fram Forge LLC

Marketing site for Fram Forge, an independent app studio.

## Run locally

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## File structure

```
src/
  app/                # Next.js App Router
    layout.tsx        # Fonts, metadata, dark shell
    page.tsx          # Homepage composition
    globals.css       # Theme, motion, accessibility
    icon.svg          # Favicon
  components/         # Reusable UI
  lib/
    site.ts           # Names, copy, apps, email, social URLs
    cn.ts             # Class name helper
```

## What to replace

Edit `src/lib/site.ts`:

- App names, descriptions, and links
- Contact email (`hello@framforge.com`)
- Social profile URLs
- Company copy as it evolves

The contact form currently opens a `mailto:` draft. Wire it to an API route or email provider when you are ready.
