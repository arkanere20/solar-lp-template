import { useState, type ComponentType, type SVGProps } from 'react'
import { client } from '../client.config'
import { site, t } from '../data/site'
import {
  benefits,
  faqs,
  projects,
  steps,
  subsidySlabs,
  testimonials,
  whyUs,
} from '../data/content'
import { LeadForm } from './LeadForm'
import { SavingsCalculator } from './SavingsCalculator'
import { ContactLink, Footer, Header, MobileActionBar } from './SiteChrome'
import {
  CheckIcon,
  ChevronIcon,
  FileIcon,
  GaugeIcon,
  HomeIcon,
  LeafIcon,
  MapPinIcon,
  PhoneIcon,
  ShieldIcon,
  SunIcon,
  WalletIcon,
  WhatsAppIcon,
  WrenchIcon,
} from './icons'

const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  wallet: WalletIcon,
  file: FileIcon,
  gauge: GaugeIcon,
  leaf: LeafIcon,
  home: HomeIcon,
  shield: ShieldIcon,
}

export const img = (src: string, w: number) =>
  `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp&q=72`

export function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Calculator />
        <Subsidy />
        <WhyUs />
        <Projects />
        <Testimonials />
        <Process />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}

function SectionHead({
  eyebrow,
  title,
  intro,
  center = true,
}: {
  eyebrow: string
  title: string
  intro?: string
  center?: boolean
}) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <p className="eyebrow">
        <span className="h-0.5 w-5 rounded bg-sun-400" /> {eyebrow}
      </p>
      <h2 className="section-title mt-3">{title}</h2>
      {intro && (
        <p className="mt-4 text-lg leading-relaxed text-gray-600">{intro}</p>
      )}
    </div>
  )
}

function Hero() {
  return (
    <section
      id="get-quote"
      className="relative scroll-mt-16 overflow-hidden bg-forest-950"
    >
      <img
        src={img(site.images.hero, 1600)}
        srcSet={`${img(site.images.hero, 800)} 800w, ${img(site.images.hero, 1600)} 1600w`}
        sizes="100vw"
        alt={`Home in ${site.location.city} with rooftop solar panels`}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/85 to-forest-950/30" />
      <div className="container-x relative grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div className="text-white">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-sun-300 ring-1 ring-white/15">
            <MapPinIcon className="size-4" /> {t(client.copy.heroBadge)}
          </p>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
            {t(client.copy.heroTitle)}{' '}
            <span className="text-sun-400">
              {t(client.copy.heroTitleHighlight)}
            </span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
            {t(client.copy.heroIntro)}
          </p>
          <ul className="mt-7 grid gap-3 text-[15px] text-white/90 sm:grid-cols-2">
            {client.copy.heroBullets.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-sun-400" />{' '}
                {t(b)}
              </li>
            ))}
          </ul>
          <HeroStats />
          <div className="mt-8 hidden flex-wrap gap-3 sm:flex">
            <ContactLink
              kind="call"
              placement="hero"
              className="btn bg-white text-forest-950 hover:bg-sun-50"
            >
              <PhoneIcon className="size-5" /> {site.contact.phoneDisplay}
            </ContactLink>
            <ContactLink
              kind="whatsapp"
              placement="hero"
              className="btn-whatsapp"
            >
              <WhatsAppIcon className="size-5" /> WhatsApp us
            </ContactLink>
          </div>
        </div>
        <div id="enquiry" className="lg:pl-6">
          <LeadForm />
        </div>
      </div>
    </section>
  )
}

/** Trust numbers — shown only for values the client has supplied. */
function HeroStats() {
  const b = client.business
  const year = Number(b.yearEstablished)
  const stats = [
    b.installsCompleted && {
      value: b.installsCompleted,
      label: 'Homes solarised',
    },
    b.capacityInstalled && {
      value: b.capacityInstalled,
      label: 'Capacity installed',
    },
    year > 1900 && {
      value: `${new Date().getFullYear() - year}+ yrs`,
      label: `In business since ${year}`,
    },
  ].filter(Boolean) as Array<{ value: string; label: string }>
  if (!stats.length) return null
  return (
    <dl className="mt-7 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-6">
      {stats.map((s) => (
        <div key={s.label}>
          <dt className="sr-only">{s.label}</dt>
          <dd className="text-2xl font-extrabold text-white">{s.value}</dd>
          <dd className="text-xs font-medium text-white/65">{s.label}</dd>
        </div>
      ))}
    </dl>
  )
}

function Benefits() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Why rooftop solar"
          title="Make your roof pay you back"
          intro="On-grid rooftop solar is one of the simplest ways for a household to reduce monthly electricity costs."
        />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b) => {
            const Icon = icons[b.icon]
            return (
              <div
                key={b.title}
                className="rounded-2xl border border-gray-100 bg-white p-6 transition hover:border-forest-100 hover:shadow-[0_20px_50px_-30px_rgba(4,36,27,0.4)]"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-sun-100 text-forest-800">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-forest-950">
                  {b.title}
                </h3>
                <p className="mt-2 leading-relaxed text-gray-600">{b.body}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Calculator() {
  return (
    <section id="calculator" className="bg-forest-50 py-20 sm:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Savings calculator"
          title="How much could you save every month?"
          intro="Move the slider to your average monthly bill to see an indicative system size, savings and subsidy."
        />
        <div className="mt-12">
          <SavingsCalculator />
        </div>
      </div>
    </section>
  )
}

function Subsidy() {
  return (
    <section id="subsidy" className="py-20 sm:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHead
            center={false}
            eyebrow="PM Surya Ghar: Muft Bijli Yojana"
            title="Up to ₹78,000 subsidy for your home"
            intro="The Government of India's rooftop solar scheme provides central financial assistance to eligible residential households, credited directly to the applicant's bank account."
          />
          <ul className="mt-7 space-y-3 text-gray-700">
            {[
              'For residential electricity consumers with a suitable roof',
              'System must be installed by a registered vendor and use eligible components',
              `Requires a net meter from your DISCOM (${site.discom} in ${site.location.state})`,
              'Apply on the national portal — we help with every step',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-forest-600" />{' '}
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-gray-500">
            Amounts as per published scheme guidelines; subject to change.
            Verify current terms at{' '}
            <a
              href="https://pmsuryaghar.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-forest-800 underline underline-offset-2"
            >
              pmsuryaghar.gov.in
            </a>
            .
          </p>
        </div>
        <div className="overflow-hidden rounded-3xl ring-1 ring-forest-900/10">
          <div className="bg-forest-900 px-6 py-5 text-white">
            <p className="text-sm font-semibold text-sun-300">
              Central Financial Assistance
            </p>
            <p className="text-xl font-extrabold">
              Individual residential homes
            </p>
          </div>
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-forest-50 text-forest-900">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold">
                  System size
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Subsidy
                </th>
                <th
                  scope="col"
                  className="hidden px-5 py-3 font-bold sm:table-cell"
                >
                  Example
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subsidySlabs.map((s) => (
                <tr key={s.size}>
                  <td className="px-5 py-4 font-semibold text-forest-950">
                    {s.size}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {s.amount}
                    <span className="mt-0.5 block text-xs text-gray-500 sm:hidden">
                      {s.example}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 font-semibold text-forest-700 sm:table-cell">
                    {s.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex flex-col gap-3 border-t border-gray-100 bg-sun-50 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-semibold text-forest-950">
              Check your eligibility for free
            </p>
            <a href="#get-quote" className="btn-forest py-2.5 text-sm">
              Check eligibility
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function WhyUs() {
  return (
    <section className="bg-forest-950 py-20 text-white sm:py-24">
      <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow text-sun-300">
            <span className="h-0.5 w-5 rounded bg-sun-400" /> Why choose us
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t(client.copy.whyUsTitle)}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            {t(client.copy.whyUsIntro)}
          </p>
          <div className="relative mt-8 overflow-hidden rounded-2xl">
            <img
              src={img(site.images.team, 900)}
              alt={`${site.name} team installing solar panels on a residential terrace`}
              loading="lazy"
              width={900}
              height={491}
              className="aspect-[16/10] w-full object-cover"
            />
            {site.images.illustrative && (
              <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] text-white/85">
                Illustrative image
              </span>
            )}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {whyUs.map((w) => (
            <div
              key={w.title}
              className="rounded-2xl bg-white/[0.04] p-6 ring-1 ring-white/10"
            >
              <span className="grid size-10 place-items-center rounded-lg bg-sun-400 text-forest-950">
                <CheckIcon className="size-5" />
              </span>
              <h3 className="mt-4 font-bold">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {w.body}
              </p>
            </div>
          ))}
          <Credentials />
        </div>
      </div>
    </section>
  )
}

function Credentials() {
  const c = site.credentials
  const badges = [
    ...(c.vendorRegistration
      ? [`PM Surya Ghar registered vendor · ${c.vendorRegistration}`]
      : []),
    ...c.badges,
  ]
  if (!badges.length && !c.warrantySummary)
    return (
      <div className="rounded-2xl border border-dashed border-sun-300/40 p-6 sm:col-span-2">
        <p className="text-sm text-white/70">
          <span className="placeholder-note">PLACEHOLDER</span> Add verified
          certifications, registrations (e.g. PM Surya Ghar empanelled vendor
          ID) and warranty terms here once confirmed.
        </p>
      </div>
    )
  return (
    <div className="rounded-2xl bg-sun-400/10 p-6 ring-1 ring-sun-300/30 sm:col-span-2">
      {badges.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {badges.map((b) => (
            <li
              key={b}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-sun-300"
            >
              <ShieldIcon className="size-3.5" /> {b}
            </li>
          ))}
        </ul>
      )}
      {c.warrantySummary && (
        <p className={`text-sm text-white/80 ${badges.length ? 'mt-4' : ''}`}>
          <span className="font-bold text-white">Warranty: </span>
          {c.warrantySummary}
        </p>
      )}
    </div>
  )
}

function Projects() {
  return (
    <section id="projects" className="py-20 sm:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Completed projects"
          title="Recent rooftop installations"
          intro={
            projects[0]?.placeholder
              ? 'Project photos and details from homes we have completed will appear here.'
              : t('A few of the homes we have solarised in and around {city}.')
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {projects.map((p, i) => (
            <article
              key={i}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white"
            >
              <div className="relative">
                <img
                  src={img(p.image, 640)}
                  alt={
                    p.placeholder
                      ? 'Illustrative rooftop solar installation'
                      : `${p.capacity} rooftop solar installation in ${p.location}`
                  }
                  loading="lazy"
                  width={640}
                  height={480}
                  className="aspect-[4/3] w-full object-cover"
                />
                {p.placeholder && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-forest-900">
                    Illustrative image
                  </span>
                )}
              </div>
              <div className="space-y-2 p-5">
                <p className="font-bold text-forest-950">{p.location}</p>
                <dl className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-xs text-gray-500">Capacity</dt>
                    <dd className="font-semibold">{p.capacity}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Property</dt>
                    <dd className="font-semibold">{p.propertyType}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500">Completed</dt>
                    <dd className="font-semibold">{p.completed}</dd>
                  </div>
                </dl>
                {p.placeholder && (
                  <p className="pt-1">
                    <span className="placeholder-note">
                      PLACEHOLDER — add real project
                    </span>
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="bg-sun-50 py-20 sm:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="Customer reviews"
          title="What homeowners say"
          intro={
            testimonials[0]?.placeholder
              ? 'Genuine reviews from our customers will be published here.'
              : 'Reviews shared by homeowners we have worked with.'
          }
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((r, i) => (
            <figure
              key={i}
              className={`flex flex-col rounded-2xl bg-white p-6 ${r.placeholder ? 'border border-dashed border-forest-900/20' : 'shadow-[0_20px_50px_-35px_rgba(4,36,27,0.5)] ring-1 ring-forest-900/5'}`}
            >
              <div
                className="flex gap-1"
                role={r.placeholder ? undefined : 'img'}
                aria-label={r.placeholder ? undefined : `${r.rating} out of 5`}
                aria-hidden={r.placeholder || undefined}
              >
                {[1, 2, 3, 4, 5].map((s) => (
                  <SunIcon
                    key={s}
                    className={`size-4 ${s <= r.rating ? 'text-sun-500' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <blockquote
                className={`mt-4 flex-1 ${r.placeholder ? 'italic text-gray-500' : 'leading-relaxed text-gray-700'}`}
              >
                “{r.quote}”
              </blockquote>
              <figcaption className="mt-5 border-t border-gray-100 pt-4 text-sm">
                <p className="font-bold text-forest-950">{r.name}</p>
                <p className="text-gray-500">
                  {[r.area, r.systemSize].filter(Boolean).join(' · ')}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
        <GoogleReviewsLink />
      </div>
    </section>
  )
}

function GoogleReviewsLink() {
  if (!client.contact.googleBusinessUrl) return null
  return (
    <p className="mt-8 text-center">
      <a
        href={client.contact.googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-forest-800 underline underline-offset-4"
      >
        Read all our reviews on Google
      </a>
    </p>
  )
}

function Process() {
  return (
    <section id="process" className="py-20 sm:py-24">
      <div className="container-x">
        <SectionHead
          eyebrow="How it works"
          title="Solar on your roof in four simple steps"
        />
        <ol className="relative mt-14 grid gap-6 md:grid-cols-4">
          <span
            aria-hidden
            className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-sun-400 via-forest-600 to-sun-400 md:block"
          />
          {steps.map((s, i) => (
            <li key={s.title} className="relative">
              <span className="relative grid size-12 place-items-center rounded-full bg-forest-900 text-lg font-extrabold text-sun-400 ring-8 ring-white">
                {i + 1}
              </span>
              <h3 className="mt-5 text-lg font-bold text-forest-950">
                {s.title}
              </h3>
              <p className="mt-2 leading-relaxed text-gray-600">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 flex justify-center">
          <a href="#get-quote" className="btn-sun">
            <WrenchIcon className="size-5" /> Book a free site survey
          </a>
        </div>
      </div>
    </section>
  )
}

function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="bg-forest-50 py-20 sm:py-24">
      <div className="container-x max-w-3xl">
        <SectionHead eyebrow="FAQs" title="Questions homeowners ask us" />
        <div className="mt-10 divide-y divide-forest-900/10 rounded-2xl bg-white ring-1 ring-forest-900/5">
          {faqs.map((f, i) => {
            const isOpen = open === i
            return (
              <div key={f.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-bold text-forest-950 sm:px-6"
                  >
                    {f.q}
                    <ChevronIcon
                      className={`size-5 shrink-0 text-forest-700 transition ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={`faq-${i}`}
                  hidden={!isOpen}
                  className="px-5 pb-5 leading-relaxed text-gray-600 sm:px-6"
                >
                  {f.a}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-forest-900 px-6 py-14 text-center text-white sm:px-12">
          <img
            src={img(site.images.cta, 1200)}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t(client.copy.finalCtaTitle)}
            </h2>
            <p className="mt-4 text-lg text-white/80">
              {t(client.copy.finalCtaBody)}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a href="#get-quote" className="btn-sun px-7 py-4 text-base">
                Calculate My Solar Savings
              </a>
              <ContactLink
                kind="call"
                placement="final-cta"
                className="btn bg-white px-7 py-4 text-base text-forest-950 hover:bg-sun-50"
              >
                <PhoneIcon className="size-5" /> Call{' '}
                {site.contact.phoneDisplay}
              </ContactLink>
              <ContactLink
                kind="whatsapp"
                placement="final-cta"
                className="btn-whatsapp px-7 py-4 text-base"
              >
                <WhatsAppIcon className="size-5" /> WhatsApp
              </ContactLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
