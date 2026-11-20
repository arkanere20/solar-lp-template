# New Solar Client — Landing Page Playbook

The same steps for every client. Most of the work is copying the client's
answers into **one file**: `src/client.config.ts`. The design, lead form,
calculator, subsidy section, tracking and Google Sheets sync are already built.

```
Intake form ──► client.config.ts + photos ──► push to GitHub ──► Netlify builds ──► QA ──► go live
   (client)         (Claude, ~15 min)          (automatic)        (automatic)     (you)
```

---

## 0. One-time setup (already done once, reuse forever)

| What | Where | Notes |
| --- | --- | --- |
| Intake form site | Netlify → `client-intake-form` folder (drag & drop) | Forms → enable form detection, then email notifications to you |
| Lead sheet web app | `integrations/google-sheets/Code.gs` | One deployment for all clients — each client gets its own tab |
| Template repo | GitHub `solar-lp-template` | Mark as *Template repository* in GitHub settings |

---

## 1. Collect details (client)

1. Send the client the intake form link.
2. They fill it in. Their progress saves automatically on their device.
3. You get an email from Netlify when they submit. Photos arrive through a Drive link or on WhatsApp.

**Get the submission:** Netlify → intake site → **Forms → solar-client-intake** → open the submission → copy all the text (or **Download as CSV**). Download the logo attachment.

## 2. Create the client's project (2 min)

1. GitHub → `solar-lp-template` → **Use this template** → new repo, e.g. `lp-sunrise-solar`.
2. Netlify → **Add new site → Import from Git** → pick the repo → Deploy. You don't need to change any settings, because `netlify.toml` already holds the build settings.
   Then go to **Forms → Enable form detection** and **Deploys → Trigger deploy**. Without this, the lead form can't receive submissions.
3. Netlify → the new site → **Site configuration → Environment variables**:
   - `GOOGLE_SHEETS_WEBHOOK_URL` = your Apps Script `/exec` URL
   - `GOOGLE_SHEETS_TOKEN` = your token (if you set one)
4. In the Apps Script → Script Properties, add `NOTIFY_<client-id>` = the client's lead-alert emails (from the intake form).

## 3. Fill the config (Claude does this)

Paste the intake submission into Claude along with this prompt:

> New solar client. Here is the intake submission and photos. Update
> `src/client.config.ts` following PLAYBOOK.md section 3, add the images to
> `public/img/`, run the launch check, and push.

What Claude does, field by field:

| Intake field | Config field |
| --- | --- |
| business_name | `business.name`, `business.logoLine1/2` |
| year_established, installs_completed, capacity_installed | `business.*` (shown as hero stats only if filled) |
| vendor_registration, gstin, certifications, warranty | `credentials.*` (certifications → `badges`) |
| call_number, whatsapp_number, public_email, working_hours, google_business_link | `contact.*` |
| office_address, maps_link | `location.address`, `location.mapsUrl` |
| main_city, state, discom, service_areas | `location.city/state`, `discom`, `serviceAreas` |
| avg_tariff | `calculator.tariffPerUnit` (default 9). Set `unitsPerKwPerMonth` by region: ~125–130 for Rajasthan/Gujarat, ~120 for Maharashtra/Karnataka/Telangana/AP/MP, ~115 for TN/UP, ~105–110 for Kerala/East/North-East |
| primary_color, accent_color | `brand.primary`, `brand.accent` (pick from the logo if "not sure") |
| logo upload | `public/img/logo.png` → `brand.logo` |
| usp, current_offer, segments, offers_hybrid | Rewrite `copy.heroIntro`, `copy.heroBullets`, `whyUs` in the client's voice |
| project1–3_* + photos | `projects[]` with `/img/project1.jpg` … |
| review1–3_* (+ permission ticked) | `testimonials[]` — **only if permission = yes** |
| customer_questions | `extraFaqs[]` |
| YouTube links (testimonials, installation videos) | `videos[]` — `{ url, title }`; any YouTube/Shorts link. Section hidden when empty |
| id | short slug of the business name, e.g. `shree-ganesh-solar` |
| privacyPolicyUpdated | today's date, e.g. `20 November 2026` |

**Photos** → `public/img/`, as JPG, about 1600 px wide and under 500 KB each. Name them `hero.jpg`, `team.jpg`, `cta.jpg`, `project1.jpg`… Set `images.illustrative: false` when they are the client's real photos. If the client has no good photos, keep the bundled AI images with `illustrative: true`.

**Copy rules:**
- Never invent numbers, reviews, awards or registrations.
- Keep headlines short. `heroTitle` + `heroTitleHighlight` together should be under 10 words.
- Use the city name in the headline or badge. This helps both Ads Quality Score and trust.
- Don't promise "free electricity", "zero bill" or guaranteed savings.
- The subsidy figures are national rules and already handled in the code. Don't change them in copy.

## 4. Launch check (automatic)

Every Netlify build starts with the launch check. Open the deploy log to see:

```
── Launch check: Shree Ganesh Solar (shree-ganesh-solar) ──
  ✗ contact.phone is still the dummy number
  ! testimonials is empty — placeholder review cards are shown
```

- **✗ = must fix** before going live. **! = review** (it can be fine).
- When the client is approved for launch, set `LAUNCH_STRICT=1` in that site's environment variables. Any later deploy that still has ✗ items will then fail instead of going live.

## 5. QA on the Netlify preview (10 min, you)

- [ ] Opens fast on mobile (test on your phone over 4G)
- [ ] Logo, colours and photos look right on mobile and desktop
- [ ] Header, hero, sticky bar and footer Call buttons dial the right number
- [ ] WhatsApp buttons open a chat with the right number and message
- [ ] Submit a test lead (name "TEST", your own mobile):
  - [ ] Success panel shows the estimate
  - [ ] Netlify → Forms → **solar-lead** shows it
  - [ ] Google Sheet → client's tab shows it
  - [ ] Client alert email arrives
- [ ] Calculator numbers look sensible for the region
- [ ] FAQ, privacy page and footer have the right business name, city and DISCOM
- [ ] Delete the test rows afterwards

## 6. Go live

1. Netlify → **Domain management** → add the client's domain (or a sub-domain like `solar.clientsite.in`).
2. Google Ads → create the conversion action(s) → copy the `AW-…` ID and labels into `tracking` in the config. Or add `gtmId` if you use GTM. Push.
3. Use Google Tag Assistant to check that the `conversion` event fires on a test lead.
4. Set `LAUNCH_STRICT=1`. Send the client the link and the Sheet tab.

## Changing things later

| Change | How |
| --- | --- |
| New phone number, offer or review | Edit `src/client.config.ts` → push |
| New photos | Replace the file in `public/img/` with the same name → push |
| Improve the template for **all future** clients | Change `solar-lp-template`. Existing clients stay as they are, which is deliberate so live campaigns never change unexpectedly. |
| A section only one client needs | Ask Claude to add it in that client's repo only |

## Where things live

| File | Purpose |
| --- | --- |
| `src/client.config.ts` | **Everything client-specific** |
| `public/img/` | Client images and logo |
| `scripts/launch-check.ts` | Pre-launch checklist (runs on every build) |
| `integrations/google-sheets/Code.gs` | Lead → Sheet web app (shared by all clients) |
| `src/data/content.ts` | Standard solar copy (benefits, subsidy slabs, steps, FAQs) |
| `src/lib/solar.ts` | Savings and subsidy maths |
| `src/lib/theme.ts` | Turns two brand colours into the full palette |
| `src/components/*` | Page sections — no client data in here |
