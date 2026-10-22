import { Fragment, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Ticket, Robot, FlowArrow, CursorClick } from '@/components/slab'
import { FlowIcon, PlanIcon, GlobeIcon, SparkIcon, DeviceIcon } from './ProjectIcons'
import { AutomationsPanel, PlanPanel, TicketingPanel, FrameworkPanel, WorkflowPanel, LuminaPanel, FitCoPanel, HavenPanel, MeridianPanel, AIWindow, AppsWindow } from './ProjectPanels'
import { aiStack, type StackNode } from '@/data/ai-stack'

type Project = {
  id: string
  index: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  eyebrow: string
  Section: ComponentType
  span?: 2
  kicker?: string
  logos?: string[]
  Preview: ComponentType
  cat: Cat
}

type Cat = 'sites' | 'crm' | 'work' | 'ops'
const FILTERS: { key: Cat | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sites', label: 'Websites & Funnels' },
  { key: 'crm', label: 'CRM & Templates' },
  { key: 'work', label: 'Workflows' },
  { key: 'ops', label: 'Admin Ops' },
]

/** Real tool marks from public/icons */
const GHL = '/icons/gohighlevel.png'
const SHEETS = '/icons/googlesheets.svg'
const EXCEL = '/icons/microsoftexcel.svg'
const OPENAI = '/icons/openai.svg'
const GWS = '/icons/googleworkspace.svg'
const NOTION = '/icons/notion.svg'

const WF_SHOTS = [
  '/proof/01-new-lead-stage.png',
  '/proof/02-call-booked-stage.png',
  '/proof/03-cancellation-alert.png',
  '/proof/04-proposal-sent.png',
  '/proof/05-invoice-sent.png',
]

const GHL_SHOTS = [
  '/proof/sales-process-map.png',
  '/proof/crm-opportunities-pipeline.png',
  '/proof/live-client-conversation.png',
  '/proof/ghl-workflows-directory.png',
  '/proof/ghl-custom-fields.png',
]

/** The three featured builds: personal concept builds & CRM templates ready for client implementation. */
const BUILDS: Project[] = [
  {
    id: 'ticketing',
    cat: 'crm',
    index: '03',
    kicker: 'CRM Template',
    title: '8-Stage Sales Pipeline Template',
    desc: 'Visual Kanban opportunity board with automated stage sync.',
    Icon: () => <Ticket size={20} weight="duotone" />,
    logos: [GHL],
    eyebrow: 'CRM Template',
    Section: TicketingPanel,
    Preview: () => null,
  },
  {
    id: 'framework',
    cat: 'work',
    index: '04',
    kicker: 'Messaging Template',
    title: 'Lead Nurture & Client Messaging',
    desc: 'Automated discovery reminders, invoice notices & visit tracking.',
    Icon: () => <Robot size={20} weight="duotone" />,
    logos: [GHL],
    eyebrow: 'Messaging Template',
    Section: FrameworkPanel,
    Preview: () => null,
  },
  {
    id: 'workflow',
    cat: 'work',
    index: '05',
    kicker: 'Directory Template',
    title: 'Pre-Built Workflows Directory',
    desc: 'Centralized sales pipeline workflows ready for client deployment.',
    Icon: () => <FlowArrow size={20} weight="duotone" />,
    logos: [GHL],
    eyebrow: 'Directory Template',
    Section: WorkflowPanel,
    Preview: () => null,
  },
]

const leaves = (n: StackNode): StackNode[] => (n.children?.length ? n.children.flatMap(leaves) : [n])
const AI_LEAVES = leaves(aiStack)

/* ---------- Previews ---------- */

function WorkflowsPreview() {
  return (
    <div className="bento__media bento__reel" aria-hidden="true">
      <div className="bento__reel-track">
        {[...WF_SHOTS, ...WF_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** Real sales process map preview */
function PlanPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <img
        src="/proof/sales-process-map.png"
        alt="Sales Process Map"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center 30%',
          opacity: 0.9,
          display: 'block',
        }}
        loading="lazy"
        decoding="async"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.92) 80%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px 14px',
        }}
      >
        <span className="bento__doc-eyebrow" style={{ color: 'var(--accent)', fontWeight: 700 }}>Implementation Blueprint</span>
        <span className="bento__doc-title" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>Sales Process Flowchart & Data Architecture</span>
      </div>
    </div>
  )
}

function LuminaPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <img
        src="/samples/thumbs/lumina-dental.jpeg"
        alt="Lumina Dental Studio"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          opacity: 0.95,
          display: 'block',
        }}
        loading="lazy"
        decoding="async"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.92) 80%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px 14px',
        }}
      >
        <span className="bento__doc-eyebrow" style={{ color: '#38bdf8', fontWeight: 700 }}>Client Website</span>
        <span className="bento__doc-title" style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Lumina Dental Studio · Booking Concierge</span>
      </div>
    </div>
  )
}

function FitCoPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <img
        src="/samples/thumbs/fitco-coaching.jpeg"
        alt="FitCo Athletics"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          opacity: 0.95,
          display: 'block',
        }}
        loading="lazy"
        decoding="async"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.92) 80%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px 14px',
        }}
      >
        <span className="bento__doc-eyebrow" style={{ color: '#a3e635', fontWeight: 700 }}>Fitness &amp; Athletics Funnel</span>
        <span className="bento__doc-title" style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>FitCo High-Performance Coaching</span>
      </div>
    </div>
  )
}

function HavenPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <img
        src="/samples/thumbs/haven-senior-care.jpeg"
        alt="Serene Haven Senior Care"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          opacity: 0.95,
          display: 'block',
        }}
        loading="lazy"
        decoding="async"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.92) 80%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px 14px',
        }}
      >
        <span className="bento__doc-eyebrow" style={{ color: '#38bdf8', fontWeight: 700 }}>Senior Care &amp; Living</span>
        <span className="bento__doc-title" style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Serene Haven Senior Living Community</span>
      </div>
    </div>
  )
}

function MeridianPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true" style={{ position: 'relative', overflow: 'hidden', padding: 0 }}>
      <img
        src="/samples/thumbs/meridian-staffing.jpeg"
        alt="Meridian Executive Staffing"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'top center',
          opacity: 0.95,
          display: 'block',
        }}
        loading="lazy"
        decoding="async"
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(15,23,42,0.1) 0%, rgba(15,23,42,0.92) 80%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '12px 14px',
        }}
      >
        <span className="bento__doc-eyebrow" style={{ color: '#facc15', fontWeight: 700 }}>Recruitment Agency Portal</span>
        <span className="bento__doc-title" style={{ fontSize: '13px', fontWeight: 600, color: '#f8fafc' }}>Meridian Executive Staffing Agency</span>
      </div>
    </div>
  )
}

function AIPreview() {
  const half = Math.ceil(AI_LEAVES.length / 2)
  const rows = [AI_LEAVES.slice(0, half), AI_LEAVES.slice(half)]
  return (
    <div className="bento__media bento__chips" aria-hidden="true">
      {rows.map((row, r) => (
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
  )
}

function AppsPreview() {
  return (
    <div className="bento__media bento__reel bento__reel--row" aria-hidden="true">
      <div className="bento__reel-track">
        {[...GHL_SHOTS, ...GHL_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot bento__shot--app">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

const PROJECTS: Project[] = [
  { id: 'workflows', cat: 'work', index: '01', title: 'Client Lifecycle Automation Template', desc: 'Pre-configured nurture sequences, conditional branching, webhook integrations, and automated pipeline triggers.', Icon: FlowIcon, logos: [GHL], eyebrow: 'Workflow Template', Section: AutomationsPanel, span: 2, Preview: WorkflowsPreview },
  { id: 'plan', cat: 'crm', index: '02', title: 'Full-Funnel Sales Architecture Map', desc: 'Implementation blueprint: end-to-end sales process map, 12 CRM custom fields, and multi-pipeline routing logic.', Icon: PlanIcon, logos: [GHL], eyebrow: 'Architecture Blueprint', Section: PlanPanel, Preview: PlanPreview },
  { id: 'lumina', cat: 'sites', index: '03', title: 'Lumina Dental Studio — Private Dentistry', desc: 'Bespoke Austin cosmetic & general dental website featuring Dr. Bennett’s credentials, patient journey roadmap, treatment showcases, and an interactive booking concierge.', Icon: GlobeIcon, logos: [GHL], eyebrow: 'Luxury Practice Website', Section: LuminaPanel, Preview: LuminaPreview },
  { id: 'fitco', cat: 'sites', index: '04', title: 'Forge Fitness Co. — Athletic Coaching Funnel', desc: 'High-converting conditioning & coaching funnel featuring Coach Alex Carter, 4 specialized training frameworks (1-on-1, Group, Online, Nutrition), and automated strategy intake.', Icon: GlobeIcon, logos: [GHL], eyebrow: 'Fitness & Athletics Funnel', Section: FitCoPanel, Preview: FitCoPreview },
  { id: 'haven', cat: 'sites', index: '05', title: 'Serene Haven Care — In-Home & Assisted Living', desc: 'Compassionate Scottsdale eldercare site detailing Companion, Personal, Memory, Respite & 24-Hour Care, family stories, and an integrated care consultation booking flow.', Icon: GlobeIcon, logos: [GHL], eyebrow: 'Senior Care & Assisted Living', Section: HavenPanel, Preview: HavenPreview },
  { id: 'meridian', cat: 'sites', index: '06', title: 'Meridian Executive Search & Talent Advisory', desc: 'High-impact C-suite & VP placement portal with dual-sided portals: client talent requisition forms, candidate confidential resume drops, and 4-stage vetting workflows.', Icon: GlobeIcon, logos: [GHL], eyebrow: 'Executive Staffing Platform', Section: MeridianPanel, Preview: MeridianPreview },
  { id: 'ai', cat: 'ops', index: '07', title: 'Administrative Operations Stack', desc: 'Virtual assistant workflows across Google Workspace, Excel trackers, Notion SOP documentation, and AI tools.', Icon: SparkIcon, logos: [SHEETS, EXCEL, OPENAI], eyebrow: 'Admin Ops Stack', Section: AIWindow, span: 2, Preview: AIPreview },
  { id: 'apps', cat: 'crm', index: '08', title: 'GoHighLevel Sub-Account Setup & Records', desc: 'Live system configurations from dedicated practice sub-accounts, demonstrating operational pipelines and invoice automation.', Icon: DeviceIcon, logos: [GHL, GWS, NOTION], eyebrow: 'Live System Setup', Section: AppsWindow, span: 2, Preview: AppsPreview },
]

/** The icon tile, or the real marks stacked horizontally in its place. */
function Marks({ p, size = 22 }: { p: Project; size?: number }) {
  if (!p.logos?.length) {
    return (
      <span className="bento__icon">
        <p.Icon size={size} />
      </span>
    )
  }
  return (
    <span className="bento__logos" aria-hidden="true">
      {p.logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/** Project Modal */
function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="pmodal"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="pmodal__stage">
        <div className="pmodal-panel">{children}</div>
      </div>
      <button
        ref={closeRef}
        type="button"
        className="pmodal__close"
        onClick={onClose}
        aria-label="Close dialog"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>,
    document.body
  )
}

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const [cat, setCat] = useState<Cat | 'all'>('all')

  const show = useCallback((p: Project, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setOpen(p)
  }, [])

  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  const projects = cat === 'all' ? PROJECTS : PROJECTS.filter((p) => p.cat === cat)
  const builds = cat === 'all' ? BUILDS : BUILDS.filter((b) => b.cat === cat)

  const showStack = builds.length > 0

  const stack = showStack ? (
    <div className="bento__stack bento__builds">
      {builds.map((b) => (
        <button
          key={b.id}
          type="button"
          className="bento__card bento__card--btn bento__card--build bento__build"
          onClick={(e) => show(b, e.currentTarget)}
          aria-haspopup="dialog"
        >
          <span className="bento__build-plate">
            {b.logos?.length ? <img src={b.logos[0]} alt="" width={24} height={24} /> : <b.Icon />}
          </span>
          <span className="bento__build-text">
            <span className="bento__kicker">{b.kicker}</span>
            <span className="bento__build-title">{b.title}</span>
            <span className="bento__build-desc">{b.desc}</span>
          </span>
          <span className="bento__build-arrow">
            <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  ) : null

  return (
    <section className="pgrid" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Concept Builds &amp; Templates</span>
        <h1 className="pgrid__title" id="projects-title">
          GoHighLevel CRM Templates &amp; Systems Architecture
        </h1>
        <p className="pgrid__lede">Personal concept builds, automated lead funnels, and CRM workflow templates configured inside GoHighLevel — pre-structured and ready for client onboarding and implementation.</p>
      </header>

      <div className="pfilter" role="group" aria-label="Filter projects">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className="pfilter__btn"
            aria-pressed={cat === f.key}
            onClick={() => setCat(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="home__glass pgrid__glass">
        <span className="pgrid__hint" aria-hidden="true">
          <CursorClick size={14} weight="duotone" />
          Click a card to open it
        </span>
        <div className="bento bento--projects">
          {projects.map((p) => (
            <Fragment key={p.id}>
              <button
                type="button"
                className={`bento__card bento__card--btn${p.span === 2 ? ' bento__card--wide' : ''}`}
                data-id={p.id}
                onClick={(e) => show(p, e.currentTarget)}
                aria-haspopup="dialog"
              >
                <span className="bento__head">
                  <Marks p={p} />
                  <span className="bento__title">{p.title}</span>
                  <span className="bento__desc">{p.desc}</span>
                  <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
                </span>
                <p.Preview />
              </button>
              {p.id === 'plan' && stack}
            </Fragment>
          ))}
          {!projects.some((p) => p.id === 'plan') && stack}
        </div>
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          <open.Section />
        </ProjectModal>
      )}
    </section>
  )
}
