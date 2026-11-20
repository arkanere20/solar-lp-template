# AGENTS.md — Solar EPC landing page template

Single-page lead-generation site for residential rooftop solar installers in India. It is used as an agency template: **one repo per client, and all client data lives in `src/client.config.ts`.** Read PLAYBOOK.md before changing anything.

## When asked to set up or update a client

1. Edit only `src/client.config.ts` and files in `public/img/`, unless the request explicitly needs a code change.
2. Map intake-form fields to the config using the table in PLAYBOOK.md §3.
3. Run `node scripts/launch-check.ts` and fix every ✗ item that the supplied data allows.
4. Report anything still missing as a short list for the account manager.

## Layout

- `src/client.config.ts` — every client-specific value. Text supports the tokens `{name} {city} {state} {discom} {areas} {areas2}`.
- `src/data/site.ts` — derives `site` (formatted phone, WhatsApp link, URL) and the `t()` token filler from the config. Lead destinations: Netlify Forms (primary) + Google Sheets (auto when the env var is set).
- `src/data/content.ts` — standard solar copy. Uses config for DISCOM/city, and projects/testimonials (falls back to placeholder cards).
- `src/lib/theme.ts` — OKLCH palette from `brand.primary` / `brand.accent`. Emitted as CSS variables on `<html>`, which override the `forest-*` / `sun-*` tokens in `styles.css`.
- `src/lib/solar.ts` — savings + PM Surya Ghar subsidy maths (tariff and generation from config).
- `src/lib/leads.ts` — `buildLead` → `submitLead`; UTM/gclid capture; dataLayer events + Google Ads conversions from config labels.
- `src/routes/api.leads.ts` — server route that forwards to `GOOGLE_SHEETS_WEBHOOK_URL` (+ `GOOGLE_SHEETS_TOKEN`). Returns 204 no-op when unset.
- `src/routes/__root.tsx` — meta, schema, palette, GTM / gtag injection.
- `public/__forms.html` — static Netlify Forms registration. **Field names must match `toNetlifyFields()` in `leads.ts`.**
- `integrations/google-sheets/Code.gs` — Apps Script web app, one tab per `client.id`.
- `scripts/launch-check.ts` — dependency-free pre-launch report. `LAUNCH_STRICT=1` makes it fail the build.

## Rules

- Never invent testimonials, project stats, certifications or registrations. Leave them empty and the page shows clearly marked placeholders.
- Subsidy figures follow published PM Surya Ghar residential CFA (₹30k/kW up to 2 kW, ₹18k for the 3rd kW, cap ₹78k). Keep the "verify on pmsuryaghar.gov.in" disclaimer.
- No secrets in client code. Destinations that need credentials go through a server route.
- Conversion events contain no personal data.
- Keep components free of client-specific text. If something needs to vary per client, add a config field.
