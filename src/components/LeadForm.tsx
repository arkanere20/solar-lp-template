import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { buildLead, captureAttribution, submitLead } from '../lib/leads'
import {
  propertyTypes,
  validateLead,
  type LeadErrors,
  type LeadInput,
} from '../lib/validation'
import { estimateSavings, formatINR, type SavingsEstimate } from '../lib/solar'
import { client } from '../client.config'
import { site, t } from '../data/site'
import {
  ArrowIcon,
  CheckIcon,
  ChevronIcon,
  PhoneIcon,
  ShieldIcon,
  WhatsAppIcon,
} from './icons'
import { ContactLink } from './SiteChrome'

const empty: LeadInput = {
  name: '',
  mobile: '',
  location: '',
  monthlyBill: '',
  propertyType: '',
  consent: false,
}

type Status =
  | { state: 'idle' | 'pending' | 'error' }
  | { state: 'success'; estimate: SavingsEstimate; name: string }

export function LeadForm() {
  const [values, setValues] = useState<LeadInput>(empty)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>({ state: 'idle' })
  const pending = useRef(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => captureAttribution(), [])

  function update<K extends keyof LeadInput>(key: K, value: LeadInput[K]) {
    const next = { ...values, [key]: value }
    setValues(next)
    if (touched) setErrors(validateLead(next))
    if (status.state === 'error') setStatus({ state: 'idle' })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending.current) return
    setTouched(true)
    const found = validateLead(values)
    setErrors(found)
    const firstInvalid = Object.keys(found)[0]
    if (firstInvalid) {
      formRef.current
        ?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)
        ?.focus()
      return
    }
    const lead = buildLead(values)
    pending.current = true
    setStatus({ state: 'pending' })
    try {
      await submitLead(lead)
      setStatus({
        state: 'success',
        estimate: estimateSavings(lead.monthlyBill),
        name: lead.name.split(' ')[0],
      })
    } catch {
      setStatus({ state: 'error' })
    } finally {
      pending.current = false
    }
  }

  if (status.state === 'success') {
    return (
      <SuccessPanel
        estimate={status.estimate}
        name={status.name}
        onReset={() => {
          setValues(empty)
          setErrors({})
          setTouched(false)
          setStatus({ state: 'idle' })
        }}
      />
    )
  }

  const err = (k: keyof LeadInput) => (touched ? errors[k] : undefined)
  const fieldProps = (k: keyof LeadInput) => ({
    'data-field': k,
    'aria-invalid': Boolean(err(k)),
    'aria-describedby': err(k) ? `lead-${k}-error` : undefined,
  })

  return (
    <form
      ref={formRef}
      name="solar-lead"
      method="POST"
      action="/__forms.html"
      data-netlify="true"
      netlify-honeypot="bot-field"
      noValidate
      onSubmit={onSubmit}
      aria-busy={status.state === 'pending'}
      className="rounded-3xl bg-white p-5 shadow-[0_30px_80px_-30px_rgba(4,36,27,0.45)] ring-1 ring-forest-900/5 sm:p-7"
    >
      <div className="mb-5">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-forest-700">
          Free · No obligation
        </p>
        <h2 className="mt-1 text-xl font-extrabold text-forest-950 sm:text-2xl">
          {t(client.copy.formTitle)}
        </h2>
        <p className="mt-1 text-sm text-gray-600">{t(client.copy.formNote)}</p>
      </div>

      <fieldset
        disabled={status.state === 'pending'}
        className="grid gap-4 sm:grid-cols-2"
      >
        <legend className="sr-only">Your details</legend>
        <p hidden>
          <label>
            Leave this empty
            <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <div className="sm:col-span-2">
          <label htmlFor="lead-name" className="field-label">
            Full name
          </label>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            maxLength={80}
            placeholder="e.g. Rahul Patil"
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            className="field"
            {...fieldProps('name')}
          />
          <FieldError id="lead-name-error" message={err('name')} />
        </div>

        <div>
          <label htmlFor="lead-mobile" className="field-label">
            Mobile number
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500">
              +91
            </span>
            <input
              id="lead-mobile"
              name="mobile"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={14}
              placeholder="98XXXXXXXX"
              value={values.mobile}
              onChange={(e) => update('mobile', e.target.value)}
              className="field pl-14"
              {...fieldProps('mobile')}
            />
          </div>
          <FieldError id="lead-mobile-error" message={err('mobile')} />
        </div>

        <div>
          <label htmlFor="lead-location" className="field-label">
            City / PIN code
          </label>
          <input
            id="lead-location"
            name="location"
            autoComplete="address-level2"
            maxLength={60}
            placeholder={`${site.location.city} or PIN code`}
            value={values.location}
            onChange={(e) => update('location', e.target.value)}
            className="field"
            {...fieldProps('location')}
          />
          <FieldError id="lead-location-error" message={err('location')} />
        </div>

        <div>
          <label htmlFor="lead-bill" className="field-label">
            Avg. monthly electricity bill
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center font-semibold text-gray-500">
              ₹
            </span>
            <input
              id="lead-bill"
              name="monthly-bill"
              type="number"
              inputMode="numeric"
              min={300}
              max={200000}
              step={50}
              placeholder="2500"
              value={values.monthlyBill}
              onChange={(e) => update('monthlyBill', e.target.value)}
              className="field pl-9"
              {...fieldProps('monthlyBill')}
            />
          </div>
          <FieldError
            id="lead-monthlyBill-error"
            message={err('monthlyBill')}
          />
        </div>

        <div>
          <label htmlFor="lead-property" className="field-label">
            Property type
          </label>
          <div className="relative">
            <select
              id="lead-property"
              name="property-type"
              value={values.propertyType}
              onChange={(e) => update('propertyType', e.target.value)}
              className="field appearance-none pr-10"
              {...fieldProps('propertyType')}
            >
              <option value="" disabled>
                Select…
              </option>
              {propertyTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronIcon className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-gray-500" />
          </div>
          <FieldError
            id="lead-propertyType-error"
            message={err('propertyType')}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="flex items-start gap-3 text-sm leading-snug text-gray-700">
            <input
              type="checkbox"
              name="consent"
              value="yes"
              checked={values.consent}
              onChange={(e) => update('consent', e.target.checked)}
              className="mt-0.5 size-5 shrink-0 rounded accent-forest-700"
              {...fieldProps('consent')}
            />
            <span>
              I agree to be contacted by {site.name} by call, SMS or WhatsApp
              about my enquiry, and I accept the{' '}
              <Link
                to="/privacy"
                className="font-semibold text-forest-800 underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </label>
          <FieldError id="lead-consent-error" message={err('consent')} />
        </div>

        <div className="sm:col-span-2">
          <button type="submit" className="btn-sun w-full py-4 text-base">
            {status.state === 'pending' ? (
              'Calculating…'
            ) : (
              <>
                Calculate My Solar Savings <ArrowIcon className="size-5" />
              </>
            )}
          </button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-gray-500">
            <ShieldIcon className="size-4 text-forest-600" /> Your details are
            only used to respond to this enquiry.
          </p>
        </div>
      </fieldset>

      <p role="status" className="sr-only">
        {status.state === 'pending' ? 'Submitting your details…' : ''}
      </p>
      {status.state === 'error' && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          We couldn’t send your details just now. Your answers are still here —
          please try again, or reach us directly on{' '}
          <ContactLink
            kind="call"
            placement="form-error"
            className="font-semibold underline"
          >
            {site.contact.phoneDisplay}
          </ContactLink>
          .
        </div>
      )}
    </form>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  )
}

function SuccessPanel({
  estimate,
  name,
  onReset,
}: {
  estimate: SavingsEstimate
  name: string
  onReset: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => ref.current?.focus(), [])
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role="status"
      className="rounded-3xl bg-white p-6 shadow-[0_30px_80px_-30px_rgba(4,36,27,0.45)] ring-1 ring-forest-900/5 outline-none sm:p-7"
    >
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-forest-100 text-forest-700">
          <CheckIcon className="size-5" />
        </span>
        <div>
          <p className="text-lg font-extrabold text-forest-950">
            Thank you, {name}!
          </p>
          <p className="text-sm text-gray-600">
            Our team will call you shortly to confirm the details.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-2xl bg-forest-900 p-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-sun-300">
          Your indicative estimate
        </p>
        <dl className="mt-3 grid grid-cols-2 gap-4">
          <Stat label="Suggested system" value={`${estimate.systemKw} kW`} />
          <Stat
            label="Monthly savings"
            value={formatINR(estimate.monthlySavings)}
          />
          <Stat
            label="Yearly savings"
            value={formatINR(estimate.annualSavings)}
          />
          <Stat
            label="Est. PM Surya Ghar subsidy"
            value={formatINR(estimate.subsidy)}
          />
        </dl>
      </div>
      <p className="mt-3 text-xs text-gray-500">
        Estimate based on typical tariffs and generation in {site.location.city}
        . Your final system size and subsidy are confirmed after a site survey.
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <ContactLink
          kind="whatsapp"
          placement="form-success"
          className="btn-whatsapp"
        >
          <WhatsAppIcon className="size-5" /> Chat on WhatsApp
        </ContactLink>
        <ContactLink
          kind="call"
          placement="form-success"
          className="btn-outline"
        >
          <PhoneIcon className="size-5" /> Call now
        </ContactLink>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 w-full text-sm font-semibold text-forest-800 underline underline-offset-2"
      >
        Submit another enquiry
      </button>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-white/70">{label}</dt>
      <dd className="text-xl font-extrabold">{value}</dd>
    </div>
  )
}
