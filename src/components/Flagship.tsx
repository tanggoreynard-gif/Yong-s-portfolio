import { useState, useCallback, useEffect, useRef } from 'react'
import {
  ArrowSquareOut,
  House,
  SquaresFour,
  UsersThree,
  MagnifyingGlass,
  Toolbox,
  BookOpen,
  Lightning,
  Sparkle,
  Crown,
  CaretLeft,
  CaretRight,
  PencilSimple,
  ChatCircleDots,
  Headphones,
  Timer,
  ChatCircle,
  Bell,
  ClockCounterClockwise,
  CheckCircle,
  Plus,
  Kanban,
  Briefcase,
  MapPinLine,
  FileArrowUp,
  ImageSquare,
  FilePdf,
  TextAa,
  QrCode,
  Scissors,
  ArrowsOutSimple,
  Microphone,
  ClosedCaptioning,
  MagicWand,
  Star,
} from '@/components/slab'
import type { Icon } from '@/components/slab'

/**
 * Flagship - "Main build" callout. Used at the bottom of Projects and as the
 * body of the /showcase page. Showcases one product via a 5-tab carousel and
 * a horizontal marquee of user feedback.
 *
 * Architecture:
 *   - Tabs control the carousel slide. Click to switch instantly.
 *   - The active slide auto-advances every 6s but pauses on hover and
 *     when the carousel is offscreen (IntersectionObserver) so it does
 *     not chew CPU when the user is reading the rest of the page.
 *   - Feedback marquee is a CSS keyframe; the track is duplicated so
 *     the loop seams cleanly. Pauses on hover.
 *
 * The preview is NOT a screenshot. Every slide is a hand-built HTML/CSS
 * mock of an app UI rendered from the data below, so it stays crisp at any
 * size and ships zero image bytes. The mock sits on a container-query stage
 * (.flagship__stage) whose font-size is the single scale knob - every
 * dimension inside is in em, so the whole composition shrinks proportionally
 * on a phone instead of reflowing into a wireframe. That also means every
 * Phosphor icon in the mock takes an em size, never px.
 *
 * The mock runs its own BLUE accent, separate from the site accent, so it
 * reads as a separate product. To make it look like YOUR product, edit the
 * data arrays below (tabs, nav, board, features, listings, records).
 */

type TabId = 'announcement' | 'desk' | 'work' | 'tools' | 'leads'

/** Sidebar rows, in the order the mock app lists them. */
type NavId = 'announcement' | 'desk' | 'community' | 'work' | 'tools' | 'guides' | 'learn' | 'premium'

type FlagshipTab = {
  id: TabId
  label: string
  /** URL path echoed in the faux browser chrome. */
  path: string
  /** Page name in the app's own chrome strip. */
  pageTitle: string
  /** Which sidebar row lights up on this slide. */
  nav: NavId
  caption: string
  Icon: Icon
}

const TABS: FlagshipTab[] = [
  {
    id: 'announcement',
    label: 'Overview',
    path: '/dashboard',
    pageTitle: 'CRM Dashboard',
    nav: 'announcement',
    caption:
      'Conceptual GoHighLevel operations dashboard demonstrating lead stage tracking, workflow execution status, and appointment scheduling.',
    Icon: House,
  },
  {
    id: 'desk',
    label: 'Pipeline',
    path: '/pipeline',
    pageTitle: '8-Stage Opportunity Board',
    nav: 'desk',
    caption:
      '8-stage Kanban opportunity pipeline prototype tracking leads from New Lead to Closed Won with automated stage sync, tags, and status updates.',
    Icon: Kanban,
  },
  {
    id: 'work',
    label: 'Workflows',
    path: '/workflows',
    pageTitle: 'Workflow Sequences',
    nav: 'work',
    caption:
      'Multiple GoHighLevel automation sequences configured across lead capture, calendar booking, cancellation recovery, and follow-up cadences.',
    Icon: Briefcase,
  },
  {
    id: 'tools',
    label: 'Messaging',
    path: '/messaging',
    pageTitle: 'Omnichannel Client Comms',
    nav: 'tools',
    caption:
      'Automated SMS reminders (24h & 20m before calls) and triggered follow-up notices delivering responsive, sub-minute lead engagement.',
    Icon: Toolbox,
  },
  {
    id: 'leads',
    label: 'Data Schema',
    path: '/schema',
    pageTitle: 'Custom Fields & Smart Lists',
    nav: 'desk',
    caption:
      '12 custom qualification fields (budget, industry, challenge, meet time) keeping CRM contact databases clean and structured.',
    Icon: MapPinLine,
  },
]

/* ---- Mock data. Decorative only (the device is aria-hidden). Replace the
   labels with the real screens of your product so the preview is honest. */

const NAV: { id: NavId; label: string; Icon: Icon; sub?: boolean; pro?: boolean }[] = [
  { id: 'announcement', label: 'Home', Icon: House },
  { id: 'desk', label: 'Board', Icon: SquaresFour, sub: true },
  { id: 'community', label: 'Community', Icon: UsersThree, sub: true },
  { id: 'work', label: 'Listings', Icon: MagnifyingGlass, sub: true },
  { id: 'tools', label: 'Features', Icon: Toolbox, sub: true },
  { id: 'guides', label: 'Docs', Icon: BookOpen, sub: true },
  { id: 'learn', label: 'Learn', Icon: Lightning, sub: true },
  { id: 'premium', label: 'Premium', Icon: Sparkle, pro: true },
]

/* Two-zone clock card in the sidebar. Times are static - a live clock would
   be a timer running behind a decorative screenshot. */
const CLOCKS = [
  { time: '9:00', meridiem: 'AM', zone: 'Zone A GMT+0' },
  { time: '5:00', meridiem: 'AM', zone: 'Zone B GMT-4' },
]

const CHROME_ICONS: Icon[] = [Headphones, Timer, ChatCircle, Bell, ClockCounterClockwise]

const GO_TO = ['Board', 'Features', 'Search', 'Settings']

type Update = {
  date: string
  year: string
  ago: string
  kind: 'New' | 'Improved'
  title: string
  text: string
}

const UPDATES: Update[] = [
  {
    date: 'Aug 27',
    year: '2026',
    ago: 'Active',
    kind: 'New',
    title: 'Automated Discovery Call Reminders Launched',
    text: 'Configured 24h and 20m multi-channel SMS and email reminders to maximize show-up rates for qualified bookings.',
  },
  {
    date: 'Aug 24',
    year: '2026',
    ago: 'Active',
    kind: 'Improved',
    title: '8-Stage Opportunity Pipeline Deployed',
    text: 'Structured sales progression from New Lead to Closed Won with automated stage sync and revenue attribution.',
  },
  {
    date: 'Jun 20',
    year: '2026',
    ago: 'Active',
    kind: 'New',
    title: '12 Qualification Custom Fields Initialized',
    text: 'Standardized budget, industry, and challenge data points across all inbound contacts for smart list targeting.',
  },
]

type Task = { title: string; tag: string; mine?: boolean }

const BOARD: { name: string; tasks: Task[] }[] = [
  {
    name: 'New Lead',
    tasks: [
      { title: 'Inbound Form Intake', tag: 'Web Form', mine: true },
      { title: '12 Custom Fields Captured', tag: 'Data Schema' },
      { title: 'Contact Tagged "new lead"', tag: 'Tag Sync' },
    ],
  },
  {
    name: 'Call Booked',
    tasks: [
      { title: 'Discovery Scheduled (Aug 27)', tag: 'GHL Calendar', mine: true },
      { title: '24h Reminder SMS Dispatched', tag: 'Automated' },
      { title: 'Owner Calendar Synced', tag: 'Calendar' },
    ],
  },
  {
    name: 'Proposal Sent',
    tasks: [
      { title: 'Service Proposal Prepared', tag: 'Documents', mine: true },
      { title: '3-Day Follow-Up Workflow', tag: 'Conditional' },
    ],
  },
  {
    name: 'Closed Won',
    tasks: [
      { title: 'Contract Signed & Accepted', tag: 'Closing', mine: true },
      { title: 'Invoice #INV-000010 Paid', tag: 'Invoicing' },
    ],
  },
]

type Tool = { name: string; note: string; Icon: Icon; pro?: boolean }

const TOOLS: Tool[] = [
  { name: 'Lead Nurture Sequence', note: 'SMS & Email follow-ups', Icon: FileArrowUp },
  { name: 'Opportunity Kanban', note: '8-stage pipeline board', Icon: ImageSquare },
  { name: 'Calendar Booking Sync', note: 'Round-robin scheduling', Icon: FilePdf },
  { name: 'Invoice Delivery Engine', note: 'Automated payment alerts', Icon: TextAa },
  { name: 'Custom Fields Schema', note: '12 qualification parameters', Icon: QrCode },
  { name: 'Cancellation Alert', note: 'Instant owner fail-safe', Icon: Scissors },
  { name: 'Smart List Segmentation', note: 'Audience filtering', Icon: ArrowsOutSimple },
  { name: 'Activity Attribution', note: 'Direct traffic tracking', Icon: Microphone },
  { name: 'Tag Automation', note: 'Booked, new lead, signed', Icon: ClosedCaptioning, pro: true },
  { name: 'Multi-Pipeline Setup', note: '3 active sub-account flows', Icon: MagicWand },
]

const TOOL_FILTERS = ['All 10', 'CRM', 'Workflows', 'Invoicing', 'Data Schema']

type Job = {
  source: string
  /** Picks one of the three source pill colours. */
  tone: 'olj' | 'linkedin' | 'jobstreet'
  title: string
  rate: string
  posted: string
  state: 'Applied' | 'Saved' | 'New'
}

const JOBS: Job[] = [
  { source: 'RDTOps', tone: 'olj', title: '001_New Lead Stage_RDTOps', rate: '86 Enrolled', posted: 'Active', state: 'New' },
  { source: 'RDTOps', tone: 'linkedin', title: '002_Call Booked Stage_RDTOps', rate: '51 Enrolled', posted: 'Active', state: 'Applied' },
  { source: 'RDTOps', tone: 'jobstreet', title: '003_Discovery Call Cancellation Alert', rate: '17 Enrolled', posted: 'Active', state: 'Saved' },
  { source: 'RDTOps', tone: 'olj', title: '005_Proposal Sent_RDTOps', rate: '7 Enrolled', posted: 'Active', state: 'Applied' },
  { source: 'RDTOps', tone: 'linkedin', title: '007_Invoice Sent_RDTOps', rate: '5 Enrolled', posted: 'Active', state: 'New' },
]

type Lead = {
  name: string
  place: string
  rating: string
  reviews: string
  score: number
  angle: string
}

const LEADS: Lead[] = [
  { name: 'MARY Jane', place: '0942 614 4812', rating: '5.0', reviews: 'New Lead', score: 98, angle: 'Booked' },
  { name: 'Reynard Tanggo', place: 'tanggoreynard@gmail.com', rating: '5.0', reviews: 'Admin', score: 100, angle: 'Owner' },
  { name: 'Discovery Call Candidate', place: 'Qualified Intake', rating: '4.9', reviews: '12 Fields', score: 92, angle: 'Proposal' },
  { name: 'Coaching Client Intake', place: 'Service Pipeline', rating: '4.8', reviews: '5 Stages', score: 88, angle: 'Active' },
  { name: 'Networking Lead Referral', place: 'Direct Source', rating: '4.7', reviews: '1 Stage', score: 84, angle: 'Nurture' },
]

/* ---- The app shell. Every slide renders inside this, so switching tabs
   moves the active pill in the sidebar and retitles the chrome strip the
   way a real navigation does. Pure markup, no images, no network. The
   parent device is aria-hidden, so none of this reaches the a11y tree. */

function Shell({ tab, children }: { tab: FlagshipTab; children: React.ReactNode }) {
  return (
    <div className="flagship__app">
      <aside className="flagship__side" style={{ ['--i' as string]: 0 }}>
        <div className="flagship__side-head">
          <span className="flagship__logo">
            <Sparkle weight="fill" size="1.05em" />
          </span>
          <span className="flagship__wordmark">
            Product<span className="flagship__wordmark-accent">Name</span>
          </span>
          <span className="flagship__collapse">
            <CaretLeft weight="bold" size="0.8em" />
          </span>
        </div>

        <div className="flagship__clock">
          {CLOCKS.map((c) => (
            <span key={c.zone} className="flagship__clock-row">
              <span className="flagship__clock-time">
                {c.time}
                <span className="flagship__clock-meridiem">{c.meridiem}</span>
              </span>
              <span className="flagship__clock-zone">{c.zone}</span>
            </span>
          ))}
        </div>

        <div className="flagship__nav">
          {NAV.map((n) => {
            const NavIcon = n.Icon
            const active = n.id === tab.nav
            return (
              <span
                key={n.id}
                className={`flagship__navrow${active ? ' is-active' : ''}`}
              >
                <NavIcon weight={active ? 'fill' : 'regular'} size="1em" />
                <span className="flagship__navrow-label">{n.label}</span>
                {n.pro ? (
                  <Crown weight="fill" size="0.85em" className="flagship__navrow-crown" />
                ) : n.sub ? (
                  <CaretRight weight="bold" size="0.7em" className="flagship__navrow-caret" />
                ) : null}
              </span>
            )
          })}
        </div>

        <div className="flagship__side-foot">
          <div className="flagship__shortcuts">
            <span className="flagship__shortcuts-head">
              Shortcuts
              <PencilSimple weight="bold" size="0.85em" />
            </span>
            <span className="flagship__shortcuts-btn">Pick your shortcuts</span>
          </div>
          <span className="flagship__side-link">
            <SquaresFour weight="regular" size="1em" />
            Layout
          </span>
          <span className="flagship__side-link">
            <ChatCircleDots weight="regular" size="1em" />
            Feedback
          </span>
        </div>
      </aside>

      <div className="flagship__main">
        <div className="flagship__chrome" style={{ ['--i' as string]: 1 }}>
          <span className="flagship__page-title">{tab.pageTitle}</span>
          <div className="flagship__chrome-right">
            <span className="flagship__search">
              <MagnifyingGlass weight="bold" size="1em" />
              <span>Search...</span>
              <span className="flagship__kbd">Ctrl K</span>
            </span>
            {CHROME_ICONS.map((ChromeIcon, i) => (
              <span key={i} className="flagship__chrome-icon">
                <ChromeIcon weight="regular" size="1em" />
                {i === 3 && <span className="flagship__ping" />}
              </span>
            ))}
            <span className="flagship__pro">
              <Crown weight="fill" size="0.85em" />
              Plan
            </span>
            <span className="flagship__fx">
              <span className="flagship__fx-dot" />
              All systems normal
            </span>
            <span className="flagship__avatar" />
          </div>
        </div>

        <div className="flagship__canvas">{children}</div>
      </div>
    </div>
  )
}

/** Small reusable page heading, matching the app's own greeting stack. */
function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub: string }) {
  return (
    <div className="flagship__pagehead" style={{ ['--i' as string]: 2 }}>
      <span className="flagship__kicker">{kicker}</span>
      <span className="flagship__greeting">{title}</span>
      <span className="flagship__sub">{sub}</span>
    </div>
  )
}

function AnnouncementMock() {
  return (
    <>
      <PageHead
        kicker="Demo CRM Environment"
        title="GoHighLevel Demo Overview"
        sub="Concept system showing lead capture, pipeline stages, and automation logic."
      />

      <div className="flagship__card" style={{ ['--i' as string]: 3 }}>
        <div className="flagship__card-head">
          <span className="flagship__label">System Health</span>
          <span className="flagship__card-link">View all</span>
        </div>
        <div className="flagship__card-body">
          <CheckCircle weight="fill" size="1.15em" className="flagship__ok" />
          <span>
            All CRM webhooks and automated follow-up sequences running at 100% operational health.
          </span>
        </div>
        <div className="flagship__card-foot">
          <span className="flagship__label">Go to</span>
          {GO_TO.map((g) => (
            <span key={g} className="flagship__goto">
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="flagship__news" style={{ ['--i' as string]: 4 }}>
        <span className="flagship__news-title">What&rsquo;s new</span>
        <span className="flagship__ghostbtn">
          <Plus weight="bold" size="0.9em" />
          New update
        </span>
      </div>

      {UPDATES.map((u, i) => (
        <div
          key={u.title}
          className="flagship__update"
          style={{ ['--i' as string]: i + 5 }}
        >
          <div className="flagship__update-when">
            <span className="flagship__update-date">{u.date}</span>
            <span className="flagship__update-year">{u.year}</span>
            <span className="flagship__update-ago">{u.ago}</span>
          </div>
          <div className="flagship__update-body">
            <span
              className={`flagship__tag flagship__tag--${u.kind === 'New' ? 'new' : 'improved'}`}
            >
              {u.kind}
            </span>
            <span className="flagship__update-title">{u.title}</span>
            <span className="flagship__update-text">{u.text}</span>
          </div>
        </div>
      ))}
    </>
  )
}

function DeskMock() {
  return (
    <>
      <PageHead
        kicker="CRM Pipeline"
        title="001_RDTOps Sales Pipeline"
        sub="8-stage visual opportunity Kanban board tracking deals from New Lead to Closed Won."
      />
      <div className="flagship__board">
        {BOARD.map((col, i) => (
          <div
            key={col.name}
            className="flagship__col"
            style={{ ['--i' as string]: i + 3 }}
          >
            <div className="flagship__col-head">
              <span className="flagship__col-name">{col.name}</span>
              <span className="flagship__col-count">{col.tasks.length}</span>
            </div>
            <div className="flagship__col-list">
              {col.tasks.map((t) => (
                <div key={t.title} className="flagship__task">
                  <span className="flagship__task-title">{t.title}</span>
                  <span className="flagship__task-foot">
                    <span className="flagship__chip">{t.tag}</span>
                    <span
                      className={`flagship__who${t.mine ? ' flagship__who--mine' : ''}`}
                    />
                  </span>
                </div>
              ))}
            </div>
            <span className="flagship__col-add">
              <Plus weight="bold" size="0.9em" />
              <span>Add task</span>
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

function ToolsMock() {
  return (
    <>
      <PageHead
        kicker="Automation Features"
        title="Core Workflow Capabilities"
        sub="Integrated GoHighLevel automation modules running 24/7."
      />
      <div className="flagship__filters" style={{ ['--i' as string]: 3 }}>
        {TOOL_FILTERS.map((f, i) => (
          <span key={f} className={`flagship__filter${i === 0 ? ' is-active' : ''}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="flagship__grid">
        {TOOLS.map((tool, i) => {
          const ToolIcon = tool.Icon
          return (
            <div
              key={tool.name}
              className="flagship__tile"
              style={{ ['--i' as string]: i + 4 }}
            >
              <span className="flagship__tile-icon">
                <ToolIcon weight="fill" size="1em" />
              </span>
              <span className="flagship__tile-name">{tool.name}</span>
              <span className="flagship__tile-note">{tool.note}</span>
              {tool.pro && <span className="flagship__tile-pro">Pro</span>}
            </div>
          )
        })}
      </div>
    </>
  )
}

function JobsMock() {
  return (
    <>
      <PageHead
        kicker="Workflow Directory"
        title="Automation Sequences"
        sub="Sample workflow sequences — this is a demo environment showing GoHighLevel automation structure."
      />
      <div className="flagship__filters" style={{ ['--i' as string]: 3 }}>
        {['All workflows', 'Lead Capture', 'Booking', 'Follow-Up'].map((f, i) => (
          <span key={f} className={`flagship__filter${i === 0 ? ' is-active' : ''}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="flagship__list">
        {JOBS.map((job, i) => (
          <div
            key={job.title}
            className="flagship__job"
            style={{ ['--i' as string]: i + 4 }}
          >
            <span className={`flagship__source flagship__source--${job.tone}`}>
              {job.source}
            </span>
            <span className="flagship__job-main">
              <span className="flagship__job-title">{job.title}</span>
              <span className="flagship__job-meta">
                {job.rate} · {job.posted}
              </span>
            </span>
            <span
              className={`flagship__state flagship__state--${job.state.toLowerCase()}`}
            >
              {job.state}
            </span>
            <CaretRight weight="bold" size="0.85em" className="flagship__job-caret" />
          </div>
        ))}
      </div>
      <span className="flagship__foot" style={{ ['--i' as string]: 9 }}>
        Sample workflow directory — demo data only
      </span>
    </>
  )
}

function LeadsMock() {
  return (
    <>
      <div className="flagship__leadbar" style={{ ['--i' as string]: 2 }}>
        <span className="flagship__field">
          <span className="flagship__field-label">Pipeline Stage</span>
          <span className="flagship__field-value">All Stages</span>
        </span>
        <span className="flagship__field">
          <span className="flagship__field-label">Source</span>
          <span className="flagship__field-value">All Sources</span>
        </span>
        <span className="flagship__leadgo">
          <MapPinLine weight="fill" size="0.95em" />
          Filter
        </span>
      </div>

      <span className="flagship__leadmeta" style={{ ['--i' as string]: 3 }}>
        Sample CRM Environment — demonstration contacts only, not real clients
      </span>

      <div className="flagship__list">
        {LEADS.map((lead, i) => (
          <div
            key={lead.name}
            className="flagship__lead"
            style={{ ['--i' as string]: i + 4 }}
          >
            <span className="flagship__lead-main">
              <span className="flagship__lead-name">{lead.name}</span>
              <span className="flagship__lead-place">{lead.place}</span>
            </span>
            <span className="flagship__lead-rating">
              <Star weight="fill" size="0.85em" />
              {lead.rating}
              <span className="flagship__lead-reviews">({lead.reviews})</span>
            </span>
            <span className="flagship__lead-score">
              <span className="flagship__score-track">
                <span
                  className="flagship__score-fill"
                  style={{ ['--pct' as string]: `${lead.score}%` }}
                />
              </span>
              <span className="flagship__score-num">{lead.score}</span>
            </span>
            <span className="flagship__lead-angle">{lead.angle}</span>
          </div>
        ))}
      </div>

      <span className="flagship__foot" style={{ ['--i' as string]: 9 }}>
        Sample qualification score (0–100) based on 12 custom field responses — demo data only.
      </span>
    </>
  )
}

const MOCKS: Record<TabId, React.ComponentType> = {
  announcement: AnnouncementMock,
  desk: DeskMock,
  work: JobsMock,
  tools: ToolsMock,
  leads: LeadsMock,
}

type Specification = {
  badge: string
  trigger: string
  action: string
  result: string
  title: string
}

const SPECIFICATIONS: Specification[] = [
  {
    badge: 'Stage 01',
    title: 'Lead Qualification',
    trigger: 'Form Submission',
    action: 'Validate → Qualify → Tag',
    result: 'Lead enters the appropriate workflow',
  },
  {
    badge: 'Stage 02',
    title: 'Calendar Routing',
    trigger: 'Qualified Lead',
    action: 'Route to Calendar → Create Booking',
    result: 'Appointment enters the system',
  },
  {
    badge: 'Stage 03',
    title: 'SMS & Email Follow-Up',
    trigger: 'Lead or Appointment Event',
    action: 'Send Scheduled Follow-Up',
    result: 'Consistent lead communication',
  },
  {
    badge: 'Stage 04',
    title: 'Pipeline Automation',
    trigger: 'Lead / Appointment Status',
    action: 'Update Opportunity Stage',
    result: 'Pipeline stays organized',
  },
]

/** What this demo demonstrates — compact evidence list. */
const DEMO_SKILLS = [
  { label: 'CRM Organization', note: 'Custom fields, tags, contact structure' },
  { label: 'Pipeline Management', note: '8-stage opportunity board with stage logic' },
  { label: 'Workflow Logic', note: 'Triggers, conditions, and automated actions' },
  { label: 'Lead Follow-Up', note: 'Multi-channel SMS and email sequences' },
  { label: 'Appointment Automation', note: 'Booking, reminders, and calendar sync' },
]

/** Workflow flow steps for the visual overview strip. */
const FLOW_STEPS = [
  { label: 'Lead', note: 'Form intake' },
  { label: 'Qualification', note: 'Tag & route' },
  { label: 'Booking', note: 'Calendar sync' },
  { label: 'Follow-Up', note: 'SMS & Email' },
  { label: 'Pipeline', note: 'Stage update' },
  { label: 'Onboarding', note: 'Client begins' },
]

const AUTO_ADVANCE_MS = 6000

type FlagshipProps = {
  /** Overrides the eyebrow. Projects numbers its sections; the Services
   *  page does not, so it passes its own label. */
  eyebrow?: string
}

export default function Flagship({ eyebrow = '12 / Flagship build' }: FlagshipProps = {}) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(true)
  const ref = useRef<HTMLDivElement | null>(null)

  // Pause auto-advance when the carousel is offscreen so we are not
  // running an interval the user cannot see.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.2 },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % TABS.length)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(id)
  }, [paused, inView])

  const onTabKey = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault()
        const dir = e.key === 'ArrowRight' ? 1 : -1
        const next = (index + dir + TABS.length) % TABS.length
        setActive(next)
        const buttons = e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>(
          'button[role="tab"]',
        )
        buttons?.[next]?.focus()
      }
    },
    [],
  )

  const current = TABS[active]
  const Mock = MOCKS[current.id]

  return (
    <aside className="flagship" aria-labelledby="flagship-heading" ref={ref}>

      {/* ── Workflow flow overview strip ───────────────────────── */}
      <div className="flagship__flow-strip" aria-label="System workflow overview">
        {FLOW_STEPS.map((step, i) => (
          <div key={step.label} className="flagship__flow-step">
            <span className="flagship__flow-num">{String(i + 1).padStart(2, '0')}</span>
            <span className="flagship__flow-label">{step.label}</span>
            <span className="flagship__flow-note">{step.note}</span>
            {i < FLOW_STEPS.length - 1 && (
              <span className="flagship__flow-arr" aria-hidden="true">→</span>
            )}
          </div>
        ))}
      </div>

      <header className="flagship__header">
        <span className="flagship__eyebrow">{eyebrow}</span>
        <h3 className="flagship__title" id="flagship-heading">
          GoHighLevel Client Acquisition System
        </h3>
        <p className="flagship__desc">
          A demonstration of how lead qualification, appointment booking, automated follow-up, pipeline management, and client onboarding can be configured inside GoHighLevel. This is a concept/demo build — all records are sample data.
        </p>
        <a className="flagship__cta" href="/projects">
          Explore Projects
          <ArrowSquareOut weight="bold" size={16} aria-hidden="true" />
        </a>
      </header>

      <div
        className="flagship__showcase"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flagship__device" aria-hidden="true">
          <div className="flagship__device-bar">
            <span className="flagship__dot flagship__dot--red" />
            <span className="flagship__dot flagship__dot--amber" />
            <span className="flagship__dot flagship__dot--green" />
            <span className="flagship__device-url">
              <span className="flagship__device-url-host">example.com</span>
              <span className="flagship__device-url-path">{current.path}</span>
            </span>
          </div>
          <div className="flagship__device-screen">
            {/* Re-keyed on tab change so the stage remounts and replays the
                staggered entrance instead of swapping content in place. */}
            <div className="flagship__stage" key={current.id}>
              <Shell tab={current}>
                <Mock />
              </Shell>
            </div>
          </div>
        </div>

        <div className="flagship__panel">
          <div className="flagship__tabs" role="tablist" aria-label="Product screens">
            {TABS.map((tab, i) => {
              const TabIcon = tab.Icon
              const selected = i === active
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  className={`flagship__tab${selected ? ' is-active' : ''}`}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onTabKey(e, i)}
                >
                  <span className="flagship__tab-icon" aria-hidden="true">
                    <TabIcon size={16} weight="bold" />
                  </span>
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
          <p className="flagship__caption" key={current.id}>
            {current.caption}
          </p>
          <div className="flagship__progress" aria-hidden="true">
            {TABS.map((_, i) => (
              <span
                key={i}
                className={`flagship__progress-bar${i === active ? ' is-active' : ''}${paused || !inView ? ' is-paused' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flagship__feedback" aria-labelledby="flagship-spec-heading">
        <header className="flagship__feedback-header">
          <span className="flagship__feedback-eyebrow">Architecture Highlights</span>
          <h4 className="flagship__feedback-title" id="flagship-spec-heading">
            Core Workflow Logic &amp; Automation Rules
          </h4>
        </header>
        {/* 2×2 grid — balanced, no orphaned card */}
        <div className="flagship__spec-grid">
          {SPECIFICATIONS.map((s) => (
            <div key={s.title} className="flagship__spec-card">
              <span className="flagship__spec-badge">{s.badge}</span>
              <strong className="flagship__spec-title">{s.title}</strong>
              <dl className="flagship__spec-logic">
                <div className="flagship__spec-row">
                  <dt>Trigger</dt>
                  <dd>{s.trigger}</dd>
                </div>
                <div className="flagship__spec-row">
                  <dt>Action</dt>
                  <dd>{s.action}</dd>
                </div>
                <div className="flagship__spec-row flagship__spec-row--result">
                  <dt>Result</dt>
                  <dd>{s.result}</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* ── What This Demonstrates ───────────────────────────── */}
        <div className="flagship__demonstrates">
          <div className="flagship__demonstrates-head">
            <span className="flagship__demonstrates-eyebrow">Portfolio Scope</span>
            <h5 className="flagship__demonstrates-title">What This Demo Demonstrates</h5>
          </div>
          <ul className="flagship__demonstrates-list" role="list">
            {DEMO_SKILLS.map((skill) => (
              <li key={skill.label} className="flagship__demonstrates-item">
                <span className="flagship__demonstrates-check" aria-hidden="true">✓</span>
                <span className="flagship__demonstrates-label">{skill.label}</span>
                <span className="flagship__demonstrates-note">{skill.note}</span>
              </li>
            ))}
          </ul>
          <p className="flagship__demo-disclaimer">
            This is a concept GoHighLevel build demonstrating practical CRM configuration knowledge.
            No client results, revenue figures, or conversion rates are claimed or implied.
          </p>
        </div>
      </div>
    </aside>
  )
}
