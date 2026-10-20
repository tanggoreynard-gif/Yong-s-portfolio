import { useState } from 'react'
import { Kanban, ArrowsClockwise, FileText } from '@/components/slab'
import type { Icon } from '@/components/slab'

type ScenarioDoc = {
  id: string
  index: string
  poster: string
  label: string
  kicker: string
  sub: string
}

const SCENARIOS: ScenarioDoc[] = [
  {
    id: 'sc-1',
    index: '01',
    poster: '/proof/sales-process-map.png',
    label: 'Sales Process Architecture',
    kicker: 'Scenario 01 · Full-Funnel Lead Conversion',
    sub: 'Intake Form → Conditional Qualification → Discovery Booking → Automated Reminders',
  },
  {
    id: 'sc-2',
    index: '02',
    poster: '/proof/crm-opportunities-pipeline.png',
    label: '8-Stage Opportunity Pipeline',
    kicker: 'Scenario 02 · Pipeline Stage Organization',
    sub: 'Stage Tracking · Automated Stage Migration · Opportunity Value Calculation',
  },
  {
    id: 'sc-3',
    index: '03',
    poster: '/proof/02-call-booked-stage.png',
    label: 'Lead Nurture & Retention Logic',
    kicker: 'Scenario 03 · Appointment Show-Rate Protection',
    sub: '24h & 20m SMS Cadence · Calendar Sync · Reschedule Recovery',
  },
]

type ScenarioItem = {
  index: string
  name: string
  role: string
  problem: string
  solution: string
  tags: string[]
  Icon: Icon
}

const SCENARIO_ITEMS: ScenarioItem[] = [
  {
    index: '01',
    name: 'Slow Response Times & Lost Leads',
    role: 'Scenario · Service Business & Agency Intake',
    problem: 'Challenge: Prospects submit forms after business hours and wait hours for a reply, resulting in lost deals.',
    solution: 'Solution: Configured instant 5-minute automated SMS/Email response with direct calendar booking link and lead tagging.',
    tags: ['Instant Response', 'SMS Automation', 'Calendar Booking', 'GoHighLevel'],
    Icon: ArrowsClockwise,
  },
  {
    index: '02',
    name: 'Disorganized Deals & Missing Follow-Ups',
    role: 'Scenario · High-Volume Sales Pipeline',
    problem: 'Challenge: Opportunities get lost in messy inboxes with no clear deal stage or next steps.',
    solution: 'Solution: Structured an 8-stage visual Kanban board with 12 custom qualification fields and automated stage progression.',
    tags: ['Kanban Board', 'Custom Fields', 'Data Hygiene', 'Smart Lists'],
    Icon: Kanban,
  },
  {
    index: '03',
    name: 'Administrative Overload & Scheduling Friction',
    role: 'Scenario · Executive & Remote Operations',
    problem: 'Challenge: Hours spent on manual back-and-forth email scheduling, messy spreadsheets, and unorganized docs.',
    solution: 'Solution: Established automated Google Calendar routing, inbox triage filters, and structured Excel/Sheets tracking.',
    tags: ['Calendar Routing', 'Inbox Triage', 'Google Workspace', 'Excel / Sheets'],
    Icon: FileText,
  },
]

export default function TestimonialsGrid() {
  const [active, setActive] = useState(0)
  const current = SCENARIOS[active]

  return (
    <section className="pgrid tgrid" aria-labelledby="scenarios-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Practice Case Studies</span>
        <h1 className="pgrid__title" id="scenarios-title">
          Practice Scenarios &amp; CRM Implementation Models
        </h1>
        <p className="pgrid__lede">
          Detailed breakdowns of real-world business bottlenecks and the practical GoHighLevel CRM workflows built to resolve them.
        </p>
      </header>

      <div className="home__glass tgrid__glass">
        {/* Left: Diagram walkthrough viewer */}
        <div className="tgrid__reel">
          <div className="tgrid__stage">
            <div className="tgrid__cover" style={{ cursor: 'default' }}>
              <img
                key={current.id}
                className="tgrid__cover-img"
                src={current.poster}
                alt={current.label}
                decoding="async"
              />
              <span className="tgrid__cover-shade" aria-hidden="true" />
              <span className="tgrid__cover-meta" aria-hidden="true">
                <span className="tgrid__cover-kicker">
                  {current.kicker}
                </span>
                <span className="tgrid__cover-sub">
                  {current.sub}
                </span>
              </span>
            </div>
          </div>

          {/* Scenario selector */}
          <div className="tgrid__picker" role="group" aria-label="Choose a practice scenario">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`tgrid__pick${i === active ? ' is-active' : ''}`}
                onClick={() => setActive(i)}
                aria-pressed={i === active}
              >
                <span className="tgrid__pick-thumb" aria-hidden="true">
                  <img src={s.poster} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="tgrid__pick-copy">
                  <span className="tgrid__pick-kicker">Scenario {s.index}</span>
                  <span className="tgrid__pick-meta">{s.label}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: The scenario ledger */}
        <div className="tgrid__ledger">
          <div className="tgrid__ledger-head">
            <h2 className="tgrid__ledger-title">Operational Challenges Solved</h2>
            <p className="tgrid__ledger-sub">How structured CRM architecture resolves daily workflow friction.</p>
          </div>

          <ul className="tgrid__clients" role="list">
            {SCENARIO_ITEMS.map((item) => {
              const ItemIcon = item.Icon
              return (
                <li key={item.index} className="tgrid__client">
                  <span className="tgrid__client-ghost" aria-hidden="true">{item.index}</span>
                  <span className="tgrid__client-mark" aria-hidden="true">
                    <ItemIcon size={22} weight="duotone" />
                  </span>

                  <span className="tgrid__client-body">
                    <span className="tgrid__client-head">
                      <span className="tgrid__client-name">{item.name}</span>
                      <span className="tgrid__client-role">{item.role}</span>
                    </span>
                    <span className="tgrid__client-daily" style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}>{item.problem}</span>
                      <span style={{ color: 'var(--navy)', fontWeight: 500, fontSize: '11.5px' }}>{item.solution}</span>
                    </span>
                    <ul className="tgrid__client-tags" role="list">
                      {item.tags.map((t, idx) => (
                        <li key={`${t}-${idx}`} className="tgrid__client-tag">
                          {t}
                        </li>
                      ))}
                    </ul>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
