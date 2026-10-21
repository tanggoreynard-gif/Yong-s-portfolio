import type React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  FolderOpen,
  User,
  Medal,
  Stack,
  Quotes,
  FunnelSimple,
  Gear,
  AddressBook,
  Globe,
  AppWindow,
  SealCheck,
} from '@/components/slab'
import { aiStack, type StackNode } from '@/data/ai-stack'
import { profile } from '@/data/profile'

/**
 * Home's showcase: one card per rail view, each an index of what that view
 * holds, each built from content the portfolio already ships.
 */

const GHL_SHOTS = [
  '/proof/sales-process-map.png',
  '/proof/crm-opportunities-pipeline.png',
  '/proof/live-client-conversation.png',
  '/proof/ghl-workflows-directory.png',
  '/proof/01-new-lead-stage.png',
  '/proof/02-call-booked-stage.png',
]

const OFFERS = [
  { Icon: FunnelSimple, title: 'CRM Pipelines', note: 'Lead capture to Closed Won' },
  { Icon: Gear, title: 'Lead Workflows', note: 'SMS, email & missed-call text-back' },
  { Icon: AddressBook, title: 'Funnels & Booking', note: 'Landing pages & calendar setups' },
  { Icon: Globe, title: 'Data Hygiene', note: 'Tags, custom fields & cleanup' },
  { Icon: AppWindow, title: 'Admin VA Support', note: 'Google Workspace & operations' },
] as const

type ScenarioSummary = { name: string; type: string; work: string; Icon: typeof FunnelSimple }

const SCENARIOS: ScenarioSummary[] = [
  { name: 'Lead Intake Automation', type: 'Intake & Booking', work: 'Instant SMS response, calendar routing, automated reminders', Icon: Gear },
  { name: '8-Stage Sales Pipeline', type: 'Pipeline Organization', work: 'Kanban board, 12 custom fields, automated stage progression', Icon: FunnelSimple },
  { name: 'Executive Admin & SOPs', type: 'Operations & Tracking', work: 'Google Workspace, Excel tracking, inbox triage SOPs', Icon: AppWindow },
]

// Three photos of you, fanned. Small copies are fine - the fan shows them under 100px.
const PHOTOS = [profile.avatarSrc, '/avatar.jpg?2', '/avatar.jpg?3']

/** The AI systems as a flat list: every leaf of the Projects tree, in order. */
const leaves = (n: StackNode): StackNode[] =>
  n.children?.length ? n.children.flatMap(leaves) : [n]
const AI_BUILDS = leaves(aiStack)

function CardHead({
  Icon,
  title,
  desc,
}: {
  Icon: typeof FolderOpen
  title: string
  desc: string
}) {
  return (
    <header className="bento__head">
      <span className="bento__label">
        <span className="bento__icon">
          <Icon size={20} weight="fill" aria-hidden="true" />
        </span>
        <h3 className="bento__title">{title}</h3>
      </span>
      <p className="bento__desc">{desc}</p>
      <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
    </header>
  )
}

export default function HomeBento() {
  const half = Math.ceil(AI_BUILDS.length / 2)
  const toolRows = [AI_BUILDS.slice(0, half), AI_BUILDS.slice(half)]

  return (
    <nav className="bento" aria-label="Explore the portfolio">
      {/* Projects: real GoHighLevel workflow screenshots drift upward on a looped track. */}
      <Link to="/projects" className="bento__card bento__card--projects">
        <CardHead Icon={FolderOpen} title="Projects" desc="Pre-built GoHighLevel CRM templates, sales process maps, and automated workflows." />
        <div className="bento__media bento__reel" aria-hidden="true">
          <div className="bento__reel-track">
            {[...GHL_SHOTS, ...GHL_SHOTS].map((src, i) => (
              <span key={i} className="bento__shot">
                <img src={src} alt="" loading="lazy" decoding="async" />
              </span>
            ))}
          </div>
        </div>
      </Link>

      {/* About: a fanned stack of photos. */}
      <Link to="/about" className="bento__card bento__card--about">
        <CardHead Icon={User} title="About" desc="HighLevel Certified Admin & Automation Specialist with engineering precision." />
        <div className="bento__media bento__fan" aria-hidden="true">
          {PHOTOS.map((src, i) => (
            <span key={src} className="bento__photo" style={{ ['--i' as string]: i }}>
              <img src={src} alt="" loading="lazy" decoding="async" />
            </span>
          ))}
        </div>
      </Link>

      {/* Systems & tools */}
      <Link to="/projects" className="bento__card bento__card--ai">
        <CardHead Icon={Gear} title="Tools & Stack" desc="GoHighLevel, Google Workspace, Excel, Notion, and AI automation." />
        <div className="bento__media bento__chips" aria-hidden="true">
          {toolRows.map((row, r) => (
            <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
              <div className="bento__chip-track">
                {[...row, ...row].map((n, i) => (
                  <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status}>
                    <n.Icon size={15} weight="duotone" />
                    {n.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Link>

      {/* Credentials: the badge that matters, on its plate. */}
      <Link to="/about" className="bento__card bento__card--creds">
        <CardHead Icon={Medal} title="Credentials" desc="HighLevel Certified Admin · HLA Automation Builder" />
        <div className="bento__media bento__badge" aria-hidden="true">
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', justifyContent: 'center' }}>
            <span className="bento__badge-ring" title="HighLevel Certified Admin">
              <img src="/certified-admin-badge.png" alt="HighLevel Certified Admin Badge" width={56} height={56} style={{ objectFit: 'contain' }} />
            </span>
            <span className="bento__badge-ring" title="HighLevel Accelerator (HLA Automation Builder)">
              <img src="/hla_badge.png" alt="HLA Certified Builder Badge" width={56} height={56} style={{ objectFit: 'contain' }} />
            </span>
          </div>
          <span className="bento__badge-tag">
            <SealCheck size={14} weight="fill" />
            HighLevel Certified Admin
          </span>
        </div>
      </Link>

      {/* Services: the five offers as a compact index. */}
      <Link to="/services" className="bento__card bento__card--services">
        <CardHead Icon={Stack} title="Services" desc="End-to-end CRM setup, lead follow-up automation, calendar routing, and data hygiene." />
        <ul className="bento__media bento__offers" role="list">
          {OFFERS.map(({ Icon, title, note }, i) => (
            <li key={title} className="bento__offer" style={{ '--i': i } as React.CSSProperties}>
              <span className="bento__offer-tile">
                <Icon size={15} weight="duotone" aria-hidden="true" />
              </span>
              <span className="bento__offer-text">
                <span className="bento__offer-title">{title}</span>
                <span className="bento__offer-note">{note}</span>
              </span>
              <span className="bento__offer-num" aria-hidden="true">
                0{i + 1}
              </span>
            </li>
          ))}
        </ul>
      </Link>

      {/* Practice Scenarios */}
      <Link to="/testimonials" className="bento__card bento__card--quotes">
        <CardHead Icon={Quotes} title="Practice Scenarios" desc="Hands-on scenario breakdowns: automated lead intake, pipeline structuring, and executive operations." />
        <div className="bento__media bento__reviews" aria-hidden="true">
          <div className="bento__reviews-track">
            {[...SCENARIOS, ...SCENARIOS].map((s, i) => (
              <span key={i} className="bento__review">
                <span className="bento__review-top">
                  <s.Icon size={14} weight="duotone" />
                  <b>{s.name}</b>
                </span>
                <span className="bento__review-role">{s.type}</span>
                <span className="bento__review-work">{s.work}</span>
              </span>
            ))}
          </div>
        </div>
      </Link>
    </nav>
  )
}
