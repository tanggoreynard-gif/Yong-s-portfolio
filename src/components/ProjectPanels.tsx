import { useState, type ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import { ShieldCheck } from '@/components/slab'
import WorkflowSamples from './WorkflowSamples'
import AIStackGrid from './AIStackGrid'
import { AppsSection } from './Projects'
import { useFunnelModal } from './FunnelModal'
import { websiteFunnel } from '@/data/funnels'
import { ProofCard, ProofLightbox, type ProofItem } from './ProofDeck'

const FunnelBarrel = lazy(() => import('./FunnelBarrel'))

/** A plain mac window with a scrolling body */
function SectionWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ppanel__url">
          <span className="ppanel__url-host">{label}</span>
        </span>
      </div>
      <div className="ppanel__scroll">{children}</div>
    </div>
  )
}

/** 01. The workflow automation architecture in a clean macOS window */
export function AutomationsPanel() {
  return (
    <SectionWindow label="ghl.workflows · Client Acquisition Pipeline">
      <WorkflowSamples />
    </SectionWindow>
  )
}

/** 02. GHL System Architecture: Sales Process Map, Custom Fields & Pipelines */
const ARCH_PROOFS: ProofItem[] = [
  {
    title: 'Comprehensive Sales Process Flowchart',
    badge: 'Process Architecture',
    src: '/proof/sales-process-map.png',
    alt: 'Complete GoHighLevel Sales Process Map Flowchart',
    desc: 'End-to-end sales process map mapping lead capture, form intake, conditional qualification routing, discovery call booking, automated reminder intervals, proposal generation, and invoice closing.',
    tags: ['Full-Funnel Logic', 'Conditional Branching', 'Discovery Call Routing', 'Invoice Trigger'],
    wide: true,
  },
  {
    title: 'CRM Custom Fields & Qualification Schema',
    badge: 'Data Architecture',
    src: '/proof/ghl-custom-fields.png',
    alt: 'GoHighLevel Contact Custom Fields Setup',
    desc: '12 custom qualification fields configured inside GHL (What industry are you?, Monthly Budget, Website URL, Current Challenge, Best Time To Meet, etc.) powering smart list filters and targeted messaging.',
    tags: ['12 Custom Fields', 'Data Hygiene', 'Lead Qualification', 'GHL Keys'],
    wide: false,
  },
  {
    title: 'Multi-Pipeline Management & Routing',
    badge: 'Pipelines Setup',
    src: '/proof/ghl-pipelines-config.png',
    alt: 'GoHighLevel Multi-Pipeline Configuration Table',
    desc: 'Production pipeline structures configured for RDTOps Sales Pipeline (8 stages), REC Sales Pipeline Coaching Service (5 stages), and Networking Leads.',
    tags: ['3 Active Pipelines', 'Opportunity Routing', 'Stage Sync'],
    wide: false,
  },
]

export function PlanPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="ghl.architecture · Sales Process & Data Schema">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            System Blueprint & Data Architecture
          </span>
          <h2 className="proof-deck__title">Sales Process Map & GoHighLevel Infrastructure</h2>
          <p className="proof-deck__desc">
            Complete architectural blueprint illustrating how prospects transition from cold traffic into qualified booked appointments and paid clients through disciplined CRM logic and automation.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">End-to-End</span>
            <span className="proof-deck__stat-lbl">Sales Process</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">12 Fields</span>
            <span className="proof-deck__stat-lbl">CRM Schema</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">3 Pipelines</span>
            <span className="proof-deck__stat-lbl">Configured</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">100% GHL</span>
            <span className="proof-deck__stat-lbl">Native Setup</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {ARCH_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

/** 03. Sales Pipeline & Opportunity Stages */
const PIPELINE_PROOFS: ProofItem[] = [
  {
    title: '8-Stage GoHighLevel Opportunity Kanban Board',
    badge: 'Live CRM Pipeline',
    src: '/proof/crm-opportunities-pipeline.png',
    alt: 'GoHighLevel Opportunity Stages Kanban Board',
    desc: 'Live 001_RDTOps Sales Pipeline Kanban board tracking deals across 8 structured stages: New Lead, Discovery Call Booked, Cancelled Booking, Discovery Call Completed, Proposal Sent, Signed and Accepted, Closed Won, and Closed Lost.',
    tags: ['8 Pipeline Stages', 'Kanban Board', 'Revenue Tracking', 'Stage Automation'],
    wide: false,
  },
  {
    title: 'CRM Contacts Directory & Smart List Segmentation',
    badge: 'Contacts Database',
    src: '/proof/crm-contacts-database.png',
    alt: 'GoHighLevel Contacts and Smart Lists Directory',
    desc: 'Centralized contacts database showing smart list segmentation, custom tag mapping (booked, new lead, signed and accepted), direct phone/email logging, and last activity tracking.',
    tags: ['Smart Lists', 'Tag Sync', 'Contact Attribution', 'Clean Data'],
    wide: false,
  },
]

export function TicketingPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="ghl.crm · Sales Pipeline & Opportunity Stages">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            CRM Pipeline Engine
          </span>
          <h2 className="proof-deck__title">8-Stage Sales Pipeline & Opportunity Tracking</h2>
          <p className="proof-deck__desc">
            Visual opportunity management configured in GoHighLevel to eliminate pipeline leaks, give stakeholders real-time visibility into deal progress, and automate next actions at every transition.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">8 Stages</span>
            <span className="proof-deck__stat-lbl">Active Pipeline</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Real-Time</span>
            <span className="proof-deck__stat-lbl">Opportunity Sync</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Zero Leaks</span>
            <span className="proof-deck__stat-lbl">Lead Retention</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Automated</span>
            <span className="proof-deck__stat-lbl">Deal Progression</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {PIPELINE_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

/** 04. Missed Call Text-Back, Client Messaging & Invoicing */
const MESSAGING_PROOFS: ProofItem[] = [
  {
    title: 'Client Contact Thread & Attribution Audit',
    badge: 'Sandbox Activity Log',
    src: '/proof/live-client-conversation.png',
    alt: 'GoHighLevel Contact Conversation and Activity Audit',
    desc: 'Sandbox communication record demonstrating automated Discovery Call reminders, test payment follow-ups, direct traffic page visit timestamps, and tag status updates inside GoHighLevel.',
    tags: ['Automated Reminders', 'Follow-Up Notice', 'Attribution Tracking', 'Omnichannel'],
    wide: false,
  },
]

export function FrameworkPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="ghl.messaging · Multi-Channel Lead Engagement">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Sandbox Workflow Test
          </span>
          <h2 className="proof-deck__title">Automated Follow-Up & Messaging Logic</h2>
          <p className="proof-deck__desc">
            Sub-minute multi-channel response sequences in action. Demonstrating automated appointment reminders, payment follow-ups, and activity attribution inside GoHighLevel.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">&lt; 60s</span>
            <span className="proof-deck__stat-lbl">Response Logic</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">SMS & Email</span>
            <span className="proof-deck__stat-lbl">Multi-Channel</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Automated</span>
            <span className="proof-deck__stat-lbl">Follow-Up Rules</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Full Audit</span>
            <span className="proof-deck__stat-lbl">Activity Log</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {MESSAGING_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

/** 05. Lead Capture & Calendar Funnel / Production Workflows Directory */
const DIRECTORY_PROOFS: ProofItem[] = [
  {
    title: 'Published Workflows Directory (RDTOps Sales Pipeline)',
    badge: 'Workflow Directory',
    src: '/proof/ghl-workflows-directory.png',
    alt: 'GoHighLevel Published Workflows List',
    desc: 'Structured workflow directory showing 7 published automation flows: New Lead Stage, Call Booked, Cancellation Alert, Call Completed, Proposal Sent, Signed and Accepted, and Invoice Sent.',
    tags: ['7 Published Workflows', 'Sandbox Verified', 'Lifecycle Stages', '100% Active'],
    wide: false,
  },
]

export function WorkflowPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="ghl.directory · Workflows Directory">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Workflow Architecture
          </span>
          <h2 className="proof-deck__title">Published Automation Workflows Directory</h2>
          <p className="proof-deck__desc">
            Centralized automation engine inside GoHighLevel managing the entire lead lifecycle with verified triggers and conditional branches.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">7 Sequences</span>
            <span className="proof-deck__stat-lbl">Published Workflows</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">End-to-End</span>
            <span className="proof-deck__stat-lbl">Lead Lifecycle</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Verified</span>
            <span className="proof-deck__stat-lbl">Sandbox Tested</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">100%</span>
            <span className="proof-deck__stat-lbl">Published Status</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {DIRECTORY_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}


const LUMINA_PROOFS: ProofItem[] = [
  {
    title: 'Lumina Dental Studio — Practice Experience & Patient Concierge',
    badge: 'Live Website',
    src: '/samples/thumbs/lumina-dental.png',
    fullSrc: '/samples/lumina-dental-full.png',
    href: '/lumina-dental',
    alt: 'Lumina Dental Studio luxury practice website screenshot',
    desc: 'High-converting private dental practice website featuring interactive treatment showcase, patient journey roadmap, doctor credentials, and an integrated booking modal concierge.',
    tags: ['Live Website', 'Online Booking Funnel', 'Mobile Responsive', 'Lead Capture'],
    wide: true,
  },
]

export function LuminaPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="web · Lumina Dental Studio">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Live Client Website
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            <h2 className="proof-deck__title" style={{ margin: 0 }}>Lumina Dental Studio — Austin, TX</h2>
            <a
              href="/lumina-dental"
              target="_blank"
              rel="noopener noreferrer"
              className="home__cta home__cta--primary"
              style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
            >
              Open Live Site in New Tab ↗
            </a>
          </div>
          <p className="proof-deck__desc">
            Bespoke cosmetic & gentle general dentistry sanctuary in Austin, TX with Dr. Olivia Bennett, DDS. Complete with treatment breakdown (Invisalign, Veneers, Implants), anxiety-free care roadmap, patient reviews, and an interactive booking concierge.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">10 Sections</span>
            <span className="proof-deck__stat-lbl">Full Website</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Interactive</span>
            <span className="proof-deck__stat-lbl">Booking Modal</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">100% Mobile</span>
            <span className="proof-deck__stat-lbl">Responsive</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Clean UI</span>
            <span className="proof-deck__stat-lbl">Luxury Aesthetic</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {LUMINA_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

const FITCO_PROOFS: ProofItem[] = [
  {
    title: 'FitCo Athletics — High-Performance Fitness Coaching Funnel',
    badge: 'Live Website & Funnel',
    src: '/samples/thumbs/fitco-coaching.png',
    fullSrc: '/samples/fitco-coaching-full.png',
    href: '/fitco-coaching',
    alt: 'FitCo High-Performance Coaching live website',
    desc: 'High-converting personal training and fitness athletics funnel featuring coach credentials, transformation gallery, program tiers, FAQ, and automated consultation booking flow.',
    tags: ['Fitness Funnel', 'High-Ticket Coaching', 'Lead Capture Form', 'Mobile Responsive'],
    wide: true,
  },
]

export function FitCoPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="web · FitCo Athletics">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Live Client Website
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            <h2 className="proof-deck__title" style={{ margin: 0 }}>Forge Fitness Co. — Elite Athletic Conditioning</h2>
            <a
              href="/fitco-coaching"
              target="_blank"
              rel="noopener noreferrer"
              className="home__cta home__cta--primary"
              style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
            >
              Open Live Site in New Tab ↗
            </a>
          </div>
          <p className="proof-deck__desc">
            High-converting fitness funnel built around Head Coach Alex Carter. Features 4 training tiers (1-on-1 Personal Training, Small Group, Online, Nutrition Coaching), real transformation metrics, interactive assessment, and strategy session booking.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">11 Sections</span>
            <span className="proof-deck__stat-lbl">Full Funnel</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Sub-60s</span>
            <span className="proof-deck__stat-lbl">Lead Response</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">100% Mobile</span>
            <span className="proof-deck__stat-lbl">Responsive</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">High-Ticket</span>
            <span className="proof-deck__stat-lbl">Coaching Funnel</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {FITCO_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

const HAVEN_PROOFS: ProofItem[] = [
  {
    title: 'Serene Haven — Senior Living & Assisted Care Community',
    badge: 'Live Website & Funnel',
    src: '/samples/thumbs/haven-senior-care.png',
    fullSrc: '/samples/haven-senior-care-full.png',
    href: '/haven-senior-care',
    alt: 'Serene Haven Senior Care live website',
    desc: 'Compassionate Scottsdale, AZ eldercare platform detailing 6 specialized care tiers (Companion, Personal, Memory/Dementia, Respite, Post-Hospital, 24-Hour Care), certified caregiver matching, family video testimonials, and an automated care consultation scheduler.',
    tags: ['Senior Living', 'Healthcare Website', 'Tour Booking', 'Family Roadmap'],
    wide: true,
  },
]

export function HavenPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="web · Serene Haven Care">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Live Client Funnel
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            <h2 className="proof-deck__title" style={{ margin: 0 }}>Serene Haven Care — In-Home & Assisted Living</h2>
            <a
              href="/haven-senior-care"
              target="_blank"
              rel="noopener noreferrer"
              className="home__cta home__cta--primary"
              style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
            >
              Open Live Site in New Tab ↗
            </a>
          </div>
          <p className="proof-deck__desc">
            Compassionate senior living and assisted living community website featuring care level breakdowns, family testimonials, memory care details, and a tour scheduling booking flow.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">12 Sections</span>
            <span className="proof-deck__stat-lbl">Full Website</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">HIPAA-Ready</span>
            <span className="proof-deck__stat-lbl">Care Intake</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Automated</span>
            <span className="proof-deck__stat-lbl">Tour Booking</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">100% Mobile</span>
            <span className="proof-deck__stat-lbl">Responsive</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {HAVEN_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}

const MERIDIAN_PROOFS: ProofItem[] = [
  {
    title: 'Meridian Executive Recruitment & Staffing Platform',
    badge: 'Live Website & Funnel',
    src: '/samples/thumbs/meridian-staffing.png',
    fullSrc: '/samples/meridian-staffing-full.png',
    href: '/meridian-staffing',
    alt: 'Meridian Executive Staffing full website screenshot',
    desc: 'High-impact corporate recruiting agency platform with candidate submission pipelines, client talent request order forms, and automated CRM onboarding.',
    tags: ['Corporate Staffing', 'Talent Request Portal', 'Candidate Pipeline', 'CRM Stage Sync'],
    wide: true,
  },
]

export function MeridianPanel() {
  const [active, setActive] = useState<ProofItem | null>(null)

  return (
    <SectionWindow label="web · Meridian Staffing">
      <div className="proof-deck">
        <header className="proof-deck__head">
          <span className="proof-deck__eyebrow">
            <ShieldCheck size={14} weight="bold" />
            Live Client Funnel
          </span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '4px' }}>
            <h2 className="proof-deck__title" style={{ margin: 0 }}>Meridian Executive Search & Strategic Talent Advisory</h2>
            <a
              href="/meridian-staffing"
              target="_blank"
              rel="noopener noreferrer"
              className="home__cta home__cta--primary"
              style={{ padding: '8px 16px', fontSize: '13px', textDecoration: 'none' }}
            >
              Open Live Site in New Tab ↗
            </a>
          </div>
          <p className="proof-deck__desc">
            Tier-1 corporate executive recruiting portal with dual workflows: enterprise talent requisition ordering for C-suite/VP roles, confidential candidate resume drop pipelines, and a transparent 4-stage executive vetting framework.
          </p>
        </header>

        <ul className="proof-deck__stats" role="list">
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">14 Sections</span>
            <span className="proof-deck__stat-lbl">Full Agency Site</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Dual Pipeline</span>
            <span className="proof-deck__stat-lbl">Client &amp; Candidate</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Resume Drop</span>
            <span className="proof-deck__stat-lbl">Portal</span>
          </li>
          <li className="proof-deck__stat">
            <span className="proof-deck__stat-val">Automated</span>
            <span className="proof-deck__stat-lbl">CRM Intake</span>
          </li>
        </ul>

        <div className="proof-deck__cards">
          {MERIDIAN_PROOFS.map((proof) => (
            <ProofCard key={proof.src} item={proof} onZoom={setActive} />
          ))}
        </div>

        <ProofLightbox active={active} onClose={() => setActive(null)} />
      </div>
    </SectionWindow>
  )
}


/** 06. Funnels Barrel */
export function BarrelPanel() {
  const { openFull, modal } = useFunnelModal()
  return (
    <div className="ppanel ppanel--barrel">
      <Suspense fallback={<div className="funnels__barrel-skeleton" aria-hidden="true" />}>
        <FunnelBarrel funnels={websiteFunnel} onOpen={openFull} />
      </Suspense>
      {modal}
    </div>
  )
}

/** AI Systems and Apps windows */
export function AIWindow() {
  return (
    <SectionWindow label="ghl.ops · Remote Operations & Toolchain">
      <AIStackGrid />
    </SectionWindow>
  )
}

export function AppsWindow() {
  return (
    <SectionWindow label="ghl.cases · Verified Production Case Studies">
      <AppsSection />
    </SectionWindow>
  )
}

