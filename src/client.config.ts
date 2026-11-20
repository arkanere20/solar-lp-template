/**
 * ============================================================================
 *  CLIENT CONFIG — the ONLY file you edit for a new client.
 * ============================================================================
 *
 *  Everything client-specific lives here: business details, contact numbers,
 *  brand colours, logo, images, page copy, projects, reviews, FAQs, calculator
 *  assumptions and Google Ads tracking IDs. Components never hard-code these.
 *
 *  Rules (see PLAYBOOK.md):
 *   - Images go in /public/img/ and are referenced as '/img/<file>'.
 *   - Leave a value as '' (or an empty list) when the client has not supplied
 *     it. The page then shows a neutral fallback or hides that element.
 *   - Never invent reviews, project numbers or registrations.
 *   - Text may use these tokens, filled in automatically:
 *       {name} {city} {state} {discom}
 *       {areas}  = all service areas  ("Sangli, Miraj, Kupwad and Madhavnagar")
 *       {areas2} = first two areas    ("Sangli, Miraj")
 *   - Run `node scripts/launch-check.ts` to list anything still missing.
 *
 *  Current values: Sunrise Solar Energy (agency demo).
 */

export type ClientConfig = typeof client

export const client = {
  /** Short id, used for the Google Sheet tab name and storage keys. */
  id: 'sunrise-demo',

  business: {
    name: 'Sunrise Solar Energy',
    /** Logo text, line 1 and line 2 (used only when no logo image is set). */
    logoLine1: 'Sunrise Solar',
    logoLine2: 'Energy · Sangli',
    /** Optional. If blank, Netlify's site URL is used automatically. */
    url: '',
    yearEstablished: '',
    /** Only real, verifiable numbers, e.g. '350+' homes, '1.2 MW'. */
    installsCompleted: '',
    capacityInstalled: '',
  },

  location: {
    city: 'Sangli',
    state: 'Maharashtra',
    address: '[Office address], Sangli, Maharashtra [PIN]',
    /** Google Maps share link of the office (optional). */
    mapsUrl: '',
  },

  /** First two are used in headlines; the full list in the footer. */
  serviceAreas: ['Sangli', 'Miraj', 'Kupwad', 'Madhavnagar'],

  /** Electricity distribution company, e.g. MSEDCL, BESCOM, TANGEDCO, PGVCL. */
  discom: 'MSEDCL',

  contact: {
    /** 10-digit Indian mobile/landline, digits only. */
    phone: '9000000000',
    /** 10-digit WhatsApp number, digits only. */
    whatsapp: '9000000000',
    whatsappMessage:
      'Hello {name}, I would like a free rooftop solar quote for my home.',
    email: '[email@example.com]',
    hours: 'Mon–Sat, 9:30 AM – 7:00 PM',
    googleBusinessUrl: '',
  },

  credentials: {
    /** PM Surya Ghar / DISCOM empanelled vendor registration number. */
    vendorRegistration: '',
    gstin: '',
    /** Short badges, e.g. 'MNRE-approved panels', 'ISO 9001:2015'. */
    badges: [] as string[],
    /** e.g. 'Panels: 25-year performance · Inverter: 5–8 years · Workmanship: 5 years' */
    warrantySummary: '',
  },

  brand: {
    /** Dark brand colour (backgrounds, headings). Any hex works; it is
     *  darkened automatically if too light. */
    primary: '#073527',
    /** Bright accent colour (main buttons, highlights). */
    accent: '#ffc629',
    /** '/img/logo.png' (transparent PNG/SVG, works on white AND dark). Blank = text logo. */
    logo: '',
    /** Optional separate logo for dark backgrounds (footer). */
    logoOnDark: '',
  },

  images: {
    hero: '/img/hero.png',
    /** Photo beside "Why choose us" — ideally the client's real team at work. */
    team: '/img/install.png',
    /** Faded background of the final call-to-action. */
    cta: '/img/panels.png',
    /** Set true for AI/stock images so they are labelled "Illustrative image". */
    illustrative: true,
  },

  /** Page copy. Keep headings short. Tokens like {city} are allowed. */
  copy: {
    metaTitle: '{name} | Rooftop On-Grid Solar for Homes in {city}',
    metaDescription:
      '{name} designs and installs rooftop on-grid solar systems for homes in {areas}. Get a free savings estimate and PM Surya Ghar subsidy guidance.',
    heroBadge: 'Serving {areas2} & nearby areas',
    heroTitle: 'Rooftop solar for your home.',
    heroTitleHighlight: 'Lower bills from day one.',
    heroIntro:
      '{name} designs and installs on-grid rooftop solar systems for homeowners — with complete help for PM Surya Ghar subsidy of up to ₹78,000 and {discom} net metering.',
    heroBullets: [
      'Free site survey & savings estimate',
      'Subsidy & net-meter paperwork handled',
      'Itemised, transparent quotation',
      'Local installation & service team',
    ],
    formTitle: 'See how much you can save',
    formNote:
      'Get your estimate instantly. Our {city} team calls you to confirm.',
    whyUsTitle: 'One local partner, from survey to subsidy',
    whyUsIntro:
      'We take care of design, installation, approvals and service so you deal with one accountable team.',
    finalCtaTitle: 'Start saving on your electricity bill',
    finalCtaBody:
      'Get a free site survey, savings estimate and PM Surya Ghar subsidy guidance for your home in {areas2} or nearby.',
    footerAbout:
      'Rooftop on-grid solar design, installation and subsidy assistance for homes in {areas}.',
  },

  whyUs: [
    {
      title: 'Local team in {city}',
      body: 'Site visits, installation and service from people who work in {areas2} and the surrounding areas.',
    },
    {
      title: 'End-to-end paperwork',
      body: 'We help with PM Surya Ghar portal registration, {discom} net-meter application and subsidy documentation.',
    },
    {
      title: 'Transparent quotation',
      body: 'An itemised quote listing panel and inverter make, structure, cabling and warranty terms — before you commit.',
    },
    {
      title: 'Designed for your roof',
      body: 'System sizing based on your actual bills, roof area and shading — not a one-size-fits-all package.',
    },
    {
      title: 'Clean, safe installation',
      body: 'Properly anchored structures, earthing and lightning protection as per applicable standards.',
    },
    {
      title: 'After-sales support',
      body: 'A single point of contact for service requests, generation questions and warranty claims.',
    },
  ],

  /** Real completed projects (up to 6). Empty list = placeholder cards. */
  projects: [] as Array<{
    image: string
    location: string
    capacity: string
    propertyType: string
    completed: string
  }>,

  /** Verified reviews only, with the customer's permission. Empty = placeholders. */
  testimonials: [] as Array<{
    quote: string
    name: string
    area: string
    systemSize: string
    rating: number
  }>,

  /** Extra client-specific FAQs, shown after the standard ones. */
  extraFaqs: [] as Array<{ q: string; a: string }>,

  calculator: {
    /** Average effective residential tariff (₹ per unit) incl. charges. */
    tariffPerUnit: 9,
    /** Typical generation per kW per month in the client's region (100–135). */
    unitsPerKwPerMonth: 120,
  },

  tracking: {
    /** Google Tag Manager container, e.g. 'GTM-ABC1234'. */
    gtmId: '',
    /** Google Ads account tag, e.g. 'AW-123456789'. */
    googleAdsId: '',
    /** Conversion labels from Google Ads → Goals → Conversions. */
    leadConversionLabel: '',
    callConversionLabel: '',
    whatsappConversionLabel: '',
  },

  privacyPolicyUpdated: '',
}
