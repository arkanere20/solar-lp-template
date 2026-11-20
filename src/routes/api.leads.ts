import { createFileRoute } from '@tanstack/react-router'

/**
 * Optional Google Sheets destination for leads.
 *
 * Switches on by itself when GOOGLE_SHEETS_WEBHOOK_URL is set in Netlify
 * (Site configuration → Environment variables) to the Apps Script web app URL
 * from integrations/google-sheets/Code.gs. GOOGLE_SHEETS_TOKEN is optional and
 * must match the script's TOKEN property. Neither value reaches the browser.
 * Without the URL this route is a harmless 204 no-op.
 */
const fields = [
  'client',
  'name',
  'mobile',
  'location',
  'monthlyBill',
  'propertyType',
  'consent',
  'estimatedSystemKw',
  'landingPage',
  'submittedAt',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'gclid',
] as const

export const Route = createFileRoute('/api/leads')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: Record<string, unknown>
        try {
          body = await request.json()
        } catch {
          return Response.json({ error: 'Invalid JSON' }, { status: 400 })
        }
        const lead = Object.fromEntries(
          fields.map((f) => [f, String(body?.[f] ?? '').slice(0, 500)]),
        )
        if (!/^[6-9]\d{9}$/.test(lead.mobile) || lead.name.length < 2)
          return Response.json({ error: 'Invalid lead' }, { status: 400 })

        const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
        if (!webhook) return new Response(null, { status: 204 })
        // Apps Script web apps answer with a 302 to the result; fetch follows it.

        try {
          const upstream = await fetch(webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Optional shared secret, checked by the Apps Script.
            body: JSON.stringify({
              ...lead,
              token: process.env.GOOGLE_SHEETS_TOKEN ?? '',
            }),
            signal: AbortSignal.timeout(10000),
          })
          if (!upstream.ok) throw new Error(String(upstream.status))
        } catch {
          return Response.json(
            { error: 'Could not save lead' },
            { status: 502 },
          )
        }
        return Response.json({ ok: true })
      },
    },
  },
})
