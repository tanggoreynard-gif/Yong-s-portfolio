import type { CSSProperties } from 'react'
import { MagnetStraight, Timer, Trophy, CheckCircle } from '@/components/slab'
import type { Icon } from '@/components/slab'
import Autopilot, { TOOLS } from '@/components/Autopilot'

/**
 * ServicesGrid - the Services view on one glass sheet.
 *
 * Three bands, top to bottom: your three-step method (on a dark plate so it
 * is the first thing the eye lands on), the five services as cards that carry
 * the marks of what each one is built with, and the live automation demo
 * scaled into whatever height is left. Same object language as Home and
 * Projects: the glass, the bento card, plated marks, orange for the index
 * and the accent.
 *
 * Every string below is a PLACEHOLDER. Replace it, or hand this file to your
 * AI assistant and tell it what to put in each spot.
 */

/* ---------- The method ---------- */

type Stage = {
  index: string
  label: string
  body: string
  Icon: Icon
  chips: string[]
}

const STAGES: Stage[] = [
  {
    index: '01',
    label: 'Audit & Blueprint',
    body: 'Analyze your customer journey, map sales pipeline stages, and design custom fields and tags.',
    Icon: MagnetStraight,
    chips: ['Pipelines', 'Custom Fields', 'Lead Routing', 'Opportunity Stages'],
  },
  {
    index: '02',
    label: 'Build & Automate',
    body: 'Construct automated follow-ups, SMS triggers, calendar booking systems, and lead capture funnels.',
    Icon: Timer,
    chips: ['Missed-Call Text', 'SMS Nurture', 'Calendar Setup', 'GHL Funnels'],
  },
  {
    index: '03',
    label: 'Maintain & Scale',
    body: 'Maintain pristine CRM hygiene, handle contact deduplication, and support daily administrative operations.',
    Icon: Trophy,
    chips: ['Data Hygiene', 'Deduplication', 'Admin VA', 'Reporting'],
  },
]

/* ---------- The services ---------- */

// Tool marks from /public/icons
const GHL = '/icons/gohighlevel.png'
const GWS = '/icons/googleworkspace.svg'
const OPENAI = '/icons/openai.svg'
const SLACK = '/icons/slack.svg'

type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const SERVICES: Service[] = [
  {
    index: '01',
    title: 'GHL Pipeline Setup & Management',
    description: 'Custom end-to-end sales pipelines from initial lead capture through Closed Won.',
    chip: 'Core CRM',
    logos: [GHL],
    bullets: ['Pipeline stage structuring & automation', 'Opportunity & lead status tracking', 'Automated stage migration triggers'],
  },
  {
    index: '02',
    title: 'Automated Lead Nurturing & Follow-Ups',
    description: 'Multi-channel automated workflows ensuring no prospect falls through the cracks.',
    chip: 'Automation',
    logos: [GHL, OPENAI],
    bullets: ['Instant missed-call text-back workflows', 'Appointment confirmation & SMS reminders', 'Proposal & invoice follow-up sequences'],
  },
  {
    index: '03',
    title: 'Funnels & Booking Calendars',
    description: 'High-converting landing pages, qualification surveys, and embedded booking calendars.',
    chip: 'Lead Capture',
    logos: [GHL],
    bullets: ['Landing, booking, and thank-you funnels', 'Custom round-robin calendar configuration', 'Automated post-booking notifications'],
  },
  {
    index: '04',
    title: 'CRM Data Hygiene & Segmentation',
    description: 'Structured database cleanup, contact deduplication, and precision tagging.',
    chip: 'Data Management',
    logos: [GHL, GWS],
    bullets: ['Custom field creation & data standardization', 'Duplicate contact merging & list cleanup', 'Segmented smart lists for targeted outreach'],
  },
  {
    index: '05',
    title: 'Administrative & Remote Support',
    description: 'Detail-oriented executive virtual assistant support and operations coordination.',
    chip: 'Virtual Assistant',
    logos: [GWS, SLACK, OPENAI],
    bullets: ['Google Workspace file & calendar management', 'Technical documentation & report verification', 'Inbox coordination & task management'],
  },
]

/** The tool marks, stacked horizontally on white tiles (same as Projects). */
function Marks({ logos }: { logos: string[] }) {
  return (
    <span className="bento__logos" aria-hidden="true">
      {logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- The page ---------- */

export default function ServicesGrid() {
  return (
    <section className="pgrid sgrid" aria-labelledby="services-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Services</span>
        <h1 className="pgrid__title" id="services-title">
          GoHighLevel CRM & Administrative Virtual Assistant Services
        </h1>
        <p className="pgrid__lede">
          From first touch to closed deal: structured pipelines, responsive lead follow-up, and organized remote operations.
        </p>
      </header>

      <div className="home__glass sgrid__glass">
        {/* One dark plate, the headline on the left, the three stages wired
            in order on the right with a signal running them. */}
        <div className="sgrid__method" aria-labelledby="method-title">
          <div className="sgrid__method-copy">
            <span className="sgrid__method-eyebrow">The System</span>
            <h2 className="sgrid__method-title" id="method-title">
              Audit. Build. Scale.
              <br />
              <span>A reliable process for every client.</span>
            </h2>
            <p className="sgrid__method-sub">
              Engineering discipline applied to your sales pipeline and day-to-day administrative workflow.
            </p>
          </div>

          <ol className="sgrid__stages" role="list">
            {STAGES.map((s, i) => {
              const StageIcon = s.Icon
              return (
                <li key={s.index} className="sgrid__stage" style={{ '--i': i } as CSSProperties}>
                  <span className="sgrid__stage-ghost" aria-hidden="true">{s.index}</span>
                  <span className="sgrid__stage-icon" aria-hidden="true">
                    <StageIcon size={22} weight="duotone" />
                  </span>
                  <h3 className="sgrid__stage-label">{s.label}.</h3>
                  <p className="sgrid__stage-body">{s.body}</p>
                  <ul className="sgrid__stage-chips" role="list" aria-label={`${s.label} touches`}>
                    {s.chips.map((c) => (
                      <li key={c} className="sgrid__stage-chip">{c}</li>
                    ))}
                  </ul>
                </li>
              )
            })}
          </ol>
        </div>

        {/* Five cards, each carrying the marks of what it is built with. */}
        <div className="sgrid__offers">
          <div className="sgrid__offers-head">
            <h2 className="sgrid__offers-title">Core Service Offerings</h2>
            <p className="sgrid__offers-sub">
              Hands-on GoHighLevel configuration and organized administrative support ready for deployment.
            </p>
          </div>
          <ul className="bento sgrid__services" role="list">
            {SERVICES.map((s) => (
              <li key={s.title} className="bento__card sgrid__service">
                <span className="bento__head">
                  <span className="sgrid__service-top">
                    <Marks logos={s.logos} />
                    <span className="sgrid__service-index" aria-hidden="true">{s.index} / 05</span>
                  </span>
                  <span className="bento__title">{s.title}</span>
                  <span className="bento__desc">{s.description}</span>
                </span>
                <span className="sgrid__chip" aria-hidden="true">{s.chip}</span>
                <ul className="sgrid__bullets" role="list">
                  {s.bullets.map((b) => (
                    <li key={b} className="sgrid__bullet">
                      <CheckCircle size={15} weight="duotone" aria-hidden="true" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>

        {/* The live workflow. Its caption and the tool chips sit in a header
            above the window, so the canvas gets the whole glass width. */}
        <div className="sgrid__flow">
          <header className="sgrid__flow-head">
            <div className="sgrid__flow-copy">
              <span className="sgrid__flow-eyebrow">Live Automation</span>
              <h2 className="sgrid__flow-title">Inbound Lead to Confirmed Appointment</h2>
              <p className="sgrid__flow-sub">
                An automated conversion sequence configured in GoHighLevel with immediate notification, wait delays, staged SMS reminders, and conditional show-rate routing.
              </p>
            </div>
            <ul className="sgrid__flow-tools" role="list" aria-label="Tools that power this flow">
              {TOOLS.map(({ Icon: ToolIcon, label }) => (
                <li key={label} className="sgrid__flow-tool">
                  <ToolIcon size={14} weight="duotone" aria-hidden="true" />
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </header>
          <div className="sgrid__flow-main">
            <Autopilot compact maxScale={1.08} />
          </div>
        </div>
      </div>
    </section>
  )
}
