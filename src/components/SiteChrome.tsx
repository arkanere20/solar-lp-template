import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { client } from '../client.config'
import { site, t, whatsappLink } from '../data/site'
import { trackClick } from '../lib/leads'
import { PhoneIcon, SunIcon, WhatsAppIcon } from './icons'

/** Clickable call / WhatsApp link with click tracking for Google Ads. */
export function ContactLink({
  kind,
  placement,
  className,
  children,
}: {
  kind: 'call' | 'whatsapp'
  placement: string
  className?: string
  children: ReactNode
}) {
  const isWa = kind === 'whatsapp'
  return (
    <a
      href={isWa ? whatsappLink() : site.contact.phoneHref}
      target={isWa ? '_blank' : undefined}
      rel={isWa ? 'noopener noreferrer' : undefined}
      onClick={() => trackClick(kind, placement)}
      className={className}
      aria-label={
        isWa
          ? `Chat with ${site.name} on WhatsApp`
          : `Call ${site.name} on ${site.contact.phoneDisplay}`
      }
    >
      {children}
    </a>
  )
}

export function Logo({ light = false }: { light?: boolean }) {
  const logo = (light && site.brand.logoOnDark) || site.brand.logo
  if (logo)
    return (
      <Link
        to="/"
        className="flex items-center"
        aria-label={`${site.name} home`}
      >
        <img
          src={logo}
          alt={site.name}
          className={`h-10 w-auto max-w-[180px] object-contain ${light && !site.brand.logoOnDark ? 'rounded-lg bg-white p-1.5' : ''}`}
        />
      </Link>
    )
  return (
    <Link
      to="/"
      className="flex items-center gap-2.5"
      aria-label={`${site.name} home`}
    >
      <span className="grid size-9 place-items-center rounded-xl bg-sun-400 text-forest-950">
        <SunIcon className="size-5" />
      </span>
      <span className="leading-none">
        <span
          className={`block text-[17px] font-extrabold tracking-tight ${light ? 'text-white' : 'text-forest-950'}`}
        >
          {client.business.logoLine1}
        </span>
        <span
          className={`block text-[11px] font-semibold uppercase tracking-[0.18em] ${light ? 'text-sun-300' : 'text-forest-700'}`}
        >
          {client.business.logoLine2}
        </span>
      </span>
    </Link>
  )
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-forest-900/5 bg-white/90 backdrop-blur">
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Primary" className="flex items-center gap-2 sm:gap-3">
          <ContactLink
            kind="call"
            placement="header"
            className="hidden items-center gap-2 text-sm font-bold text-forest-900 hover:text-forest-700 md:inline-flex"
          >
            <PhoneIcon className="size-4" /> {site.contact.phoneDisplay}
          </ContactLink>
          <ContactLink
            kind="whatsapp"
            placement="header"
            className="hidden size-10 place-items-center rounded-xl bg-[#1f9d55] text-white sm:grid"
          >
            <WhatsAppIcon className="size-5" />
          </ContactLink>
          <a href="/#get-quote" className="btn-sun px-4 py-2.5 text-sm">
            Free Quote
          </a>
        </nav>
      </div>
    </header>
  )
}

export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-forest-900/10 bg-white/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <ContactLink
        kind="call"
        placement="mobile-bar"
        className="btn-outline px-2 py-3 text-sm"
      >
        <PhoneIcon className="size-4" /> Call
      </ContactLink>
      <ContactLink
        kind="whatsapp"
        placement="mobile-bar"
        className="btn-whatsapp px-2 py-3 text-sm"
      >
        <WhatsAppIcon className="size-4" /> WhatsApp
      </ContactLink>
      <a href="/#get-quote" className="btn-sun px-2 py-3 text-sm">
        Get Quote
      </a>
    </div>
  )
}

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-forest-950 pb-24 pt-14 text-white/80 md:pb-10">
      <div className="container-x grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
            {t(client.copy.footerAbout)}
          </p>
          {(site.credentials.vendorRegistration || site.credentials.gstin) && (
            <p className="mt-3 text-xs text-white/60">
              {site.credentials.vendorRegistration &&
                `Registration: ${site.credentials.vendorRegistration}`}
              {site.credentials.gstin && ` · GSTIN: ${site.credentials.gstin}`}
            </p>
          )}
        </div>
        <div>
          <p className="text-sm font-bold text-white">Contact</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <ContactLink
                kind="call"
                placement="footer"
                className="hover:text-sun-300"
              >
                {site.contact.phoneDisplay}
              </ContactLink>
            </li>
            <li>
              <ContactLink
                kind="whatsapp"
                placement="footer"
                className="hover:text-sun-300"
              >
                WhatsApp us
              </ContactLink>
            </li>
            <li>{site.contact.email}</li>
            <li className="text-white/60">{site.contact.hours}</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-white">Office</p>
          <p className="mt-3 text-sm">{site.location.address}</p>
          {site.location.mapsUrl && (
            <p className="mt-2 text-sm">
              <a
                href={site.location.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-sun-300"
              >
                Get directions
              </a>
            </p>
          )}
          <p className="mt-4 text-sm">
            <Link
              to="/privacy"
              className="underline underline-offset-2 hover:text-sun-300"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
      <div className="container-x mt-10 border-t border-white/10 pt-6 text-xs text-white/50">
        © {year} {site.name}. Savings and subsidy figures on this page are
        indicative estimates. PM Surya Ghar is a Government of India scheme;{' '}
        {site.name} is an independent installer.
      </div>
    </footer>
  )
}
