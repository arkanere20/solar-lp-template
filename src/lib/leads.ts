/**
 * Modular lead submission.
 *
 * A lead is built once (`buildLead`) and handed to every destination listed in
 * `leadDestinations` (src/data/site.ts). The first destination is the primary
 * one: the form only shows success if it accepts the lead. Others are
 * best-effort so a secondary outage never loses the customer's enquiry.
 *
 * To add a destination, implement `LeadDestination` and register it in
 * `destinations` below. Secrets (e.g. a Google Sheets webhook URL) must stay on
 * the server — the browser only ever calls same-origin endpoints.
 */
import { leadDestinations, leadForm, site } from '../data/site'
import { normaliseMobile, type LeadInput } from './validation'
import { estimateSavings } from './solar'

export const attributionKeys = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
] as const

export type Lead = {
  client: string
  name: string
  mobile: string
  location: string
  monthlyBill: number
  propertyType: string
  consent: 'yes'
  estimatedSystemKw: number
  landingPage: string
  submittedAt: string
} & Partial<Record<(typeof attributionKeys)[number], string>>

export type LeadDestination = (lead: Lead) => Promise<void>

const ATTRIBUTION_STORAGE = `${site.id}-attribution`

/** Remembers UTM / gclid params from the landing URL for the session. */
export function captureAttribution() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const key of attributionKeys) {
    const value = params.get(key)
    if (value) found[key] = value.slice(0, 200)
  }
  if (Object.keys(found).length)
    sessionStorage.setItem(ATTRIBUTION_STORAGE, JSON.stringify(found))
}

function readAttribution(): Partial<
  Record<(typeof attributionKeys)[number], string>
> {
  try {
    const stored = JSON.parse(
      sessionStorage.getItem(ATTRIBUTION_STORAGE) ?? '{}',
    )
    return Object.fromEntries(
      attributionKeys
        .filter((k) => typeof stored[k] === 'string')
        .map((k) => [k, stored[k]]),
    )
  } catch {
    return {}
  }
}

export function buildLead(input: LeadInput): Lead {
  return {
    client: site.id,
    name: input.name.trim(),
    mobile: normaliseMobile(input.mobile),
    location: input.location.trim(),
    monthlyBill: Math.round(Number(input.monthlyBill)),
    propertyType: input.propertyType,
    consent: 'yes',
    estimatedSystemKw: estimateSavings(Number(input.monthlyBill)).systemKw,
    landingPage: typeof window === 'undefined' ? '' : window.location.href,
    submittedAt: new Date().toISOString(),
    ...readAttribution(),
  }
}

/** Netlify Forms field names — keep in sync with public/__forms.html. */
export function toNetlifyFields(lead: Lead): Record<string, string> {
  return {
    'form-name': leadForm.name,
    subject: `New solar lead: ${lead.name} (${lead.location})`,
    name: lead.name,
    mobile: lead.mobile,
    location: lead.location,
    'monthly-bill': String(lead.monthlyBill),
    'property-type': lead.propertyType,
    consent: lead.consent,
    'estimated-system-kw': String(lead.estimatedSystemKw),
    'landing-page': lead.landingPage,
    'submitted-at': lead.submittedAt,
    ...Object.fromEntries(attributionKeys.map((k) => [k, lead[k] ?? ''])),
    'bot-field': '',
  }
}

async function postOk(url: string, init: RequestInit) {
  const response = await fetch(url, {
    ...init,
    method: 'POST',
    signal: AbortSignal.timeout(15000),
  })
  if (!response.ok) throw new Error(`Lead rejected (${response.status})`)
  return response
}

const netlifyForms: LeadDestination = async (lead) => {
  const response = await postOk(leadForm.endpoint, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(toNetlifyFields(lead)).toString(),
  })
  // A plain local preview returns the static registration file with 200.
  if (/\bdata-netlify\s*=/i.test(await response.text()))
    throw new Error('Form handling is unavailable in this environment')
}

/** Sends the lead to our own server route, which forwards it to Google Sheets. */
const googleSheets: LeadDestination = async (lead) => {
  await postOk('/api/leads', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead),
  })
}

const destinations: Record<(typeof leadDestinations)[number], LeadDestination> =
  {
    'netlify-forms': netlifyForms,
    'google-sheets': googleSheets,
  }

export async function submitLead(lead: Lead) {
  const [primary, ...secondary] = leadDestinations
  await destinations[primary](lead)
  await Promise.allSettled(secondary.map((d) => destinations[d](lead)))
  trackConversion(lead)
}

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * Pushes a `generate_lead` event for Google Tag Manager / Google Ads.
 * No personal data is sent — only the estimate and attribution source.
 */
export function trackConversion(lead: Lead) {
  if (typeof window === 'undefined') return
  const event = {
    event: 'generate_lead',
    lead_form: leadForm.name,
    estimated_system_kw: lead.estimatedSystemKw,
    property_type: lead.propertyType,
    utm_source: lead.utm_source,
  }
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push(event)
  window.gtag?.('event', 'generate_lead', event)
  adsConversion(site.tracking.leadConversionLabel)
}

/** Fires a Google Ads conversion when the account tag and label are set. */
function adsConversion(label: string) {
  const id = site.tracking.googleAdsId
  if (id && label)
    window.gtag?.('event', 'conversion', { send_to: `${id}/${label}` })
}

export function trackClick(kind: 'call' | 'whatsapp', placement: string) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer ?? []
  window.dataLayer.push({ event: `${kind}_click`, placement })
  window.gtag?.('event', `${kind}_click`, { placement })
  adsConversion(
    kind === 'call'
      ? site.tracking.callConversionLabel
      : site.tracking.whatsappConversionLabel,
  )
}
