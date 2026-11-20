# Solar EPC Landing Page — Agency Template

A Google Ads landing page for residential rooftop solar installers in India. It includes a lead form with an instant savings estimate, a savings calculator, a PM Surya Ghar subsidy section, projects, reviews, FAQs, and tap-to-call and WhatsApp buttons everywhere.

**For each new client you edit one file: `src/client.config.ts`.**
Follow **[PLAYBOOK.md](PLAYBOOK.md)** step by step.

## What's built in

- **Config-driven.** Business details, copy, colours (two hex codes generate the full palette), logo, images, projects, reviews, FAQs, calculator assumptions and tracking IDs all live in one file.
- **Leads.** Every lead goes to Netlify Forms (`solar-lead`). It also goes to Google Sheets automatically once `GOOGLE_SHEETS_WEBHOOK_URL` is set on the Netlify site; see `integrations/google-sheets/Code.gs`.
- **Google Ads.** Set `tracking.googleAdsId` plus conversion labels, or `tracking.gtmId`. `generate_lead`, `call_click` and `whatsapp_click` events are pushed to `dataLayer`. UTM and `gclid` values are stored with each lead.
- **Launch check.** `node scripts/launch-check.ts` runs before every build and lists placeholders and missing items.
- **SEO.** Title, description, OG image, canonical URL (automatic from Netlify) and LocalBusiness schema all come from the config.

## Tech

TanStack Start + React 19, Tailwind CSS v4, Netlify (SSR function + Forms + Image CDN).
Build: `node scripts/launch-check.ts && vite build`. Tests: `pnpm test`.

Local `netlify dev` is optional. Every push to GitHub builds a preview on Netlify, which is the recommended way to test.
