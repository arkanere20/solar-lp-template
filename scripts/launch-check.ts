/**
 * Launch check — lists everything in src/client.config.ts that still needs
 * attention before a client's page goes live.
 *
 *   node scripts/launch-check.ts            → report only (never fails)
 *   LAUNCH_STRICT=1 node scripts/launch-check.ts → exits 1 on any ✗ item
 *
 * Runs automatically at the start of every Netlify build, so the report is
 * visible in the deploy log. Set LAUNCH_STRICT=1 on a client's production
 * site in Netlify to block a deploy that still has placeholders.
 *
 * Needs no dependencies (Node 22.18+ runs TypeScript directly).
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { client } from '../src/client.config.ts'
import { parseYouTube } from '../src/lib/youtube.ts'

const root = join(import.meta.dirname, '..')
const errors: string[] = []
const warnings: string[] = []

/** Walk every string in the config looking for [bracketed] placeholders. */
function walk(value: unknown, path: string) {
  if (typeof value === 'string') {
    if (/\[[^\]]+\]/.test(value))
      errors.push(`${path} has a placeholder: "${value}"`)
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`))
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value))
      walk(v, path ? `${path}.${k}` : k)
  }
}
walk(client, '')

const digits = (s: string) => s.replace(/\D/g, '')
for (const key of ['phone', 'whatsapp'] as const) {
  const n = digits(client.contact[key]).slice(-10)
  if (!/^[6-9]\d{9}$/.test(n) && !(key === 'phone' && /^\d{10}$/.test(n)))
    errors.push(`contact.${key} must be a 10-digit number`)
  if (/^(\d)\1{3}0{5,}$|^9000000000$/.test(n))
    errors.push(`contact.${key} is still the dummy number`)
}
if (!/^\S+@\S+\.\S+$/.test(client.contact.email))
  warnings.push('contact.email is missing or invalid (shown in footer)')

for (const key of ['primary', 'accent'] as const)
  if (!/^#[0-9a-f]{6}$/i.test(client.brand[key]))
    errors.push(`brand.${key} must be a 6-digit hex colour like #0b4633`)

const files: Array<[string, string]> = [
  ['images.hero', client.images.hero],
  ['images.team', client.images.team],
  ['images.cta', client.images.cta],
  ['brand.logo', client.brand.logo],
  ['brand.logoOnDark', client.brand.logoOnDark],
  ...client.projects.map((p, i): [string, string] => [
    `projects[${i}].image`,
    p.image,
  ]),
]
for (const [path, file] of files) {
  if (!file) continue
  if (!file.startsWith('/'))
    errors.push(`${path} must start with "/" (e.g. /img/hero.jpg)`)
  else if (!existsSync(join(root, 'public', file)))
    errors.push(`${path} → public${file} does not exist`)
}

if (!client.business.name) errors.push('business.name is empty')
if (
  client.id === 'sunrise-demo' &&
  client.business.name !== 'Sunrise Solar Energy'
)
  warnings.push(
    'id is still "sunrise-demo" — set a unique client id (used as the Google Sheet tab)',
  )
if (!client.discom)
  warnings.push('discom is empty — copy will say "your DISCOM"')
if (!client.serviceAreas.length) warnings.push('serviceAreas is empty')
if (client.images.illustrative)
  warnings.push(
    'images.illustrative is true — images are labelled "Illustrative image"',
  )
if (!client.brand.logo)
  warnings.push('brand.logo not set — using the text logo')
if (!client.projects.length)
  warnings.push('projects is empty — placeholder project cards are shown')
if (!client.testimonials.length)
  warnings.push('testimonials is empty — placeholder review cards are shown')
if (
  !client.credentials.vendorRegistration &&
  !client.credentials.badges.length &&
  !client.credentials.warrantySummary
)
  warnings.push(
    'credentials are empty — a placeholder box is shown in "Why choose us"',
  )
client.videos.forEach((v, i) => {
  if (!parseYouTube(v.url))
    errors.push(`videos[${i}].url is not a valid YouTube link: "${v.url}"`)
})
if (client.videos.length > 6) warnings.push('only the first 6 videos are shown')

if (!client.privacyPolicyUpdated)
  warnings.push(
    'privacyPolicyUpdated is empty — privacy page shows a placeholder date',
  )

const tr = client.tracking
if (!tr.gtmId && !tr.googleAdsId)
  warnings.push(
    'tracking: no GTM or Google Ads ID — conversions will NOT be recorded',
  )
if (tr.googleAdsId && !/^AW-\d+$/.test(tr.googleAdsId))
  errors.push('tracking.googleAdsId should look like AW-123456789')
if (tr.gtmId && !/^GTM-[A-Z0-9]+$/.test(tr.gtmId))
  errors.push('tracking.gtmId should look like GTM-ABC1234')
if (tr.googleAdsId && !tr.leadConversionLabel)
  warnings.push(
    'tracking.leadConversionLabel is empty — form leads won’t count as Ads conversions',
  )

const env = process.env
if (env.NETLIFY && !env.GOOGLE_SHEETS_WEBHOOK_URL)
  warnings.push(
    'GOOGLE_SHEETS_WEBHOOK_URL not set on this Netlify site — leads go to Netlify Forms only',
  )

console.log(`\n── Launch check: ${client.business.name} (${client.id}) ──`)
for (const e of errors) console.log(`  ✗ ${e}`)
for (const w of warnings) console.log(`  ! ${w}`)
if (!errors.length && !warnings.length) console.log('  ✓ Ready to launch')
console.log(`  ${errors.length} to fix · ${warnings.length} to review\n`)

if (errors.length && env.LAUNCH_STRICT === '1') {
  console.log('LAUNCH_STRICT=1 is set, so the build stops here.\n')
  process.exit(1)
}
