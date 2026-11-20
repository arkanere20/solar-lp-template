/**
 * Section content. Standard solar copy lives here; anything client-specific
 * comes from src/client.config.ts. For a new client you normally don't touch
 * this file.
 */
import { client } from '../client.config'
import { t } from './site'
import { parseYouTube } from '../lib/youtube'

export const benefits = [
  {
    icon: 'wallet',
    title: 'Cut your electricity bill',
    body: 'A correctly sized rooftop system can offset most of the units you use each month, so you pay mainly fixed charges.',
  },
  {
    icon: 'file',
    title: 'Government subsidy support',
    body: 'Eligible homes can receive up to ₹78,000 central financial assistance under PM Surya Ghar: Muft Bijli Yojana.',
  },
  {
    icon: 'gauge',
    title: t('Net metering with {discom}'),
    body: 'Extra power you generate during the day is exported to the grid and adjusted against your bill.',
  },
  {
    icon: 'leaf',
    title: 'Clean energy for 25 years',
    body: 'Solar panels typically carry long performance warranties and need little upkeep beyond regular cleaning.',
  },
  {
    icon: 'home',
    title: 'Uses idle roof space',
    body: 'Roughly 100 sq ft of shade-free terrace per kW turns unused space into a long-term asset for your home.',
  },
  {
    icon: 'shield',
    title: 'Protection from tariff hikes',
    body: 'Producing your own power reduces how much future electricity price increases affect your household budget.',
  },
] as const

export const subsidySlabs = [
  { size: 'Up to 2 kW', amount: '₹30,000 per kW', example: '₹60,000 for 2 kW' },
  {
    size: '2 kW to 3 kW',
    amount: '₹18,000 for the additional kW',
    example: '₹78,000 for 3 kW',
  },
  {
    size: 'Above 3 kW',
    amount: 'Capped at ₹78,000',
    example: '₹78,000 maximum',
  },
]

export const whyUs = client.whyUs.map((w) => ({
  title: t(w.title),
  body: t(w.body),
}))

/** Real projects from config, or three placeholder cards. */
export const projects = client.projects.length
  ? client.projects.slice(0, 6).map((p) => ({ ...p, placeholder: false }))
  : [client.images.hero, client.images.team, client.images.cta].map(
      (image) => ({
        image,
        location: '[Project location]',
        capacity: '[__ kW]',
        propertyType: '[Type]',
        completed: '[Month YYYY]',
        placeholder: true,
      }),
    )

/** Verified reviews from config, or three placeholder cards. */
export const testimonials = client.testimonials.length
  ? client.testimonials.slice(0, 6).map((r) => ({ ...r, placeholder: false }))
  : [1, 2, 3].map(() => ({
      quote:
        '[Add a verified customer review — e.g. copied with permission from your Google Business Profile.]',
      name: '[Customer name]',
      area: '[Area]',
      systemSize: '[System size]',
      rating: 0,
      placeholder: true,
    }))

/** Valid YouTube videos from config (invalid links are skipped). */
export const videos = client.videos.slice(0, 6).flatMap((v) => {
  const parsed = parseYouTube(v.url)
  return parsed ? [{ ...parsed, title: t(v.title) }] : []
})

export const steps = [
  {
    title: 'Free consultation & site survey',
    body: 'Share your bill. We visit your home to check roof area, shading and electrical load, then suggest the right system size.',
  },
  {
    title: 'Design, quote & subsidy registration',
    body: 'You receive a clear quotation. Once approved, we help register your application on the PM Surya Ghar national portal.',
  },
  {
    title: 'Installation & net-meter application',
    body: t(
      'Our team installs the structure, panels and inverter, and we help file the net-metering application with {discom}.',
    ),
  },
  {
    title: 'Commissioning & subsidy release',
    body: 'After inspection and net-meter installation, the system goes live and the subsidy is credited to your bank account per scheme process.',
  },
]

export const faqs = [
  {
    q: 'What is an on-grid rooftop solar system?',
    a: t(
      'An on-grid system is connected to the {discom} grid through a net meter. Your home uses solar power first; extra energy is exported to the grid and units you import at night are adjusted against what you exported.',
    ),
  },
  {
    q: 'Will an on-grid system work during a power cut?',
    a: 'No. For safety, on-grid inverters switch off when the grid is down so no power flows into lines being repaired. If you need backup during outages, ask us about hybrid systems with batteries.',
  },
  {
    q: 'How much subsidy can I get under PM Surya Ghar?',
    a: 'For individual residential homes, central financial assistance is ₹30,000 per kW up to 2 kW and ₹18,000 for the additional kW up to 3 kW, with a maximum of ₹78,000. Scheme rules can change, so always confirm the current amount on the official portal pmsuryaghar.gov.in.',
  },
  {
    q: 'What size system does my home need?',
    a: `It depends on your monthly units, not just your bill amount. As a rough guide, 1 kW produces about ${client.calculator.unitsPerKwPerMonth - 10}–${client.calculator.unitsPerKwPerMonth + 10} units a month in our region. Our calculator above gives an estimate; a site survey confirms it.`,
  },
  {
    q: 'How much roof space is required?',
    a: 'Plan for roughly 100 sq ft of shade-free roof per kW. A 3 kW system needs about 300 sq ft. Elevated structures can be used so the terrace remains usable.',
  },
  {
    q: 'Can I install solar in an apartment or housing society?',
    a: 'Individual flats usually do not have their own roof rights. Housing societies and RWAs can install systems for common facilities, which have a separate subsidy category under the scheme. Contact us to discuss your building.',
  },
  {
    q: 'How long does installation take?',
    a: t(
      'Physical installation of a typical home system usually takes one to two days. The complete process including approvals, net-meter installation and subsidy release depends on {discom} and portal timelines.',
    ),
  },
  {
    q: 'What maintenance is needed?',
    a: 'Mainly periodic cleaning of panels with plain water to remove dust, and a quick check of the inverter display. We explain everything at handover.',
  },
  {
    q: 'Do you offer loans or EMI options?',
    a: 'Many banks offer rooftop solar loans linked to the PM Surya Ghar scheme. We can guide you on the documents usually required.',
  },
  ...client.extraFaqs.map((f) => ({ q: t(f.q), a: t(f.a) })),
]
