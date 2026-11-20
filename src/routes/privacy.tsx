import { createFileRoute } from '@tanstack/react-router'
import { client } from '../client.config'
import { site } from '../data/site'
import { Footer, Header, MobileActionBar } from '../components/SiteChrome'

export const Route = createFileRoute('/privacy')({
  head: () => ({
    meta: [
      { title: `Privacy Policy | ${site.name}` },
      {
        name: 'description',
        content: `How ${site.name} collects and uses enquiry information.`,
      },
    ],
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="container-x max-w-3xl py-14 sm:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="section-title mt-3">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">
          Last updated: {client.privacyPolicyUpdated || '[DD Month YYYY]'}
          {!client.privacyPolicyUpdated && (
            <>
              {' '}
              ·{' '}
              <span className="placeholder-note">
                PLACEHOLDER — have this reviewed before publishing
              </span>
            </>
          )}
        </p>
        <div className="mt-10 space-y-8 leading-relaxed text-gray-700 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-forest-950 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6">
          <section>
            <h2>Who we are</h2>
            <p className="mt-3">
              {site.name} is a rooftop solar installation business based in{' '}
              {site.location.city}, {site.location.state}. Address:{' '}
              {site.location.address}. Contact: {site.contact.phoneDisplay},{' '}
              {site.contact.email}.
            </p>
          </section>
          <section>
            <h2>Information we collect</h2>
            <p className="mt-3">When you submit our enquiry form we collect:</p>
            <ul>
              <li>Your name and mobile number</li>
              <li>Your city or PIN code</li>
              <li>Your average monthly electricity bill and property type</li>
              <li>
                Basic campaign information (such as the advertisement or link
                that brought you to this page) and the page address
              </li>
            </ul>
          </section>
          <section>
            <h2>How we use it</h2>
            <ul>
              <li>
                To contact you by call, SMS or WhatsApp about your solar enquiry
              </li>
              <li>To prepare a savings estimate, site survey and quotation</li>
              <li>
                To assist with subsidy and net-metering applications if you
                proceed
              </li>
              <li>To understand which advertising brings genuine enquiries</li>
            </ul>
            <p className="mt-3">
              We do not sell your personal information. We share it only with
              service providers that help us store enquiries (for example our
              website host and spreadsheet tools), and with government or DISCOM
              portals when you ask us to apply on your behalf.
            </p>
          </section>
          <section>
            <h2>Cookies and advertising</h2>
            <p className="mt-3">
              This website may use analytics and advertising tags (such as
              Google Ads conversion tracking) to measure enquiries. These tools
              may set cookies in your browser. Your name and number are not sent
              to these tools.
            </p>
          </section>
          <section>
            <h2>Retention and your choices</h2>
            <p className="mt-3">
              We keep enquiry details only as long as needed to respond to you
              and meet legal obligations. You can ask us to access, correct or
              delete your information, or stop contacting you, at any time by
              calling or messaging {site.contact.phoneDisplay}.
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  )
}
