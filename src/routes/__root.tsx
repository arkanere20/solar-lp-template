import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { site } from '../data/site'
import { buildPalette } from '../lib/theme'
import { NotFoundPage } from '../components/NotFoundPage'

import '../styles.css'

const siteName = site.metaTitle
const siteDescription = site.description
const palette = buildPalette(site.brand.primary, site.brand.accent)
const { gtmId, googleAdsId } = site.tracking

/** Google Tag Manager and/or Google Ads tag — only when IDs are configured. */
const trackingScripts = [
  ...(gtmId
    ? [
        {
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});`,
        },
      ]
    : []),
  ...(googleAdsId
    ? [
        {
          src: `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`,
          async: true,
        },
        {
          children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config',${JSON.stringify(googleAdsId)});`,
        },
      ]
    : []),
]

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:image',
        content: `${site.url}/.netlify/images?url=${encodeURIComponent(site.images.hero)}&w=1200&fm=jpg`,
      },
      { property: 'og:locale', content: 'en_IN' },
      { name: 'theme-color', content: palette['--color-forest-900'] },
      { name: 'format-detection', content: 'telephone=yes' },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    ],
    links: site.url ? [{ rel: 'canonical', href: site.url }] : [],
    scripts: [
      ...trackingScripts,
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: site.name,
          description: site.description,
          url: site.url,
          telephone: site.contact.phoneHref.replace('tel:', ''),
          ...(site.location.mapsUrl && { hasMap: site.location.mapsUrl }),
          address: {
            '@type': 'PostalAddress',
            addressLocality: site.location.city,
            addressRegion: site.location.state,
            addressCountry: 'IN',
          },
          areaServed: site.serviceAreas,
        }),
      },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" style={palette as CSSProperties}>
      <head>
        <HeadContent />
      </head>
      <body>
        {gtmId && (
          <noscript>
            <iframe
              title="Google Tag Manager"
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        {children}
        <Scripts />
      </body>
    </html>
  )
}
