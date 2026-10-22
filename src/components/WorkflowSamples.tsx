import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import {
  X,
  ArrowUpRight,
  CheckCircle,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowCounterClockwise,
} from '@/components/slab'

/**
 * WorkflowSamples
 *
 * Real GoHighLevel automation workflow proof diagrams.
 * Displays all 5 pipeline stages in a clean, structured workflow gallery.
 * Clicking any card opens a full high-resolution diagram modal inspector.
 */

type Sample = {
  file: string
  label: string
  stage: string
  desc: string
  nodes: string
}

const SAMPLES: Sample[] = [
  {
    file: '01-new-lead-stage.png',
    label: '001_New Lead Stage',
    stage: 'Lead Capture & Welcome',
    desc: 'Form submission trigger with conditional lead lookup, CRM opportunity check, tag assignment, and automated welcome sequence.',
    nodes: 'Form Submit · Wait 0.5m · Opportunity Lookup · Tagging · Welcome Email',
  },
  {
    file: '02-call-booked-stage.png',
    label: '002_Call Booked Stage',
    stage: 'Booking & Reminders',
    desc: 'Discovery call booking confirmation, calendar sync, plus staged multi-step reminders (24h and 20m before the call) to maximize show-up rates.',
    nodes: 'Appointment Status · Opportunity Sync · 24h Reminder · 20m SMS/Email Alert',
  },
  {
    file: '03-cancellation-alert.png',
    label: 'Discovery Call Cancellation Alert',
    stage: 'Fail-Safe & Retention',
    desc: 'Automated appointment status change tracking: moves opportunity to Canceled, logs internal CRM notes, sends confirmation, and alerts the business owner instantly.',
    nodes: 'Status Changed · Move to Canceled · Add Internal Note · Notify Owner',
  },
  {
    file: '04-discovery-completed.png',
    label: '003_Discovery Call Completed',
    stage: 'Post-Call Debrief & Staging',
    desc: 'Triggered when stage changes to Discovery Call Completed: executes a structured buffer delay, strips active pre-call tags, and logs post-call internal CRM qualification notes.',
    nodes: 'Pipeline Stage Changed · Wait Buffer · Remove Active Tag · Wait · Log Internal Note',
  },
  {
    file: '04-proposal-sent.png',
    label: '004_Proposal Sent',
    stage: 'Proposal Delivery & Nurture',
    desc: 'Triggered when proposal is prepared, dispatching proposal emails and branching into conditional 3-day, 7-day, and 14-day follow-up touchpoints.',
    nodes: 'Pipeline Stage Changed · Send Proposal · 3d / 7d / 14d Conditional Branching',
  },
  {
    file: '06-signed-accepted.png',
    label: '005_Signed / Accepted Contract',
    stage: 'Contract Onboarding & Hand-off',
    desc: 'Triggered upon document signature: ejects lead from nurture workflows, strips pending tags, sends instant owner push notifications, and applies the official onboarding client tag.',
    nodes: 'Documents & Contracts Signed · Remove from Workflow · Remove Tag · Internal Notification · Add Client Tag',
  },
  {
    file: '05-invoice-sent.png',
    label: '006_Invoice Sent',
    stage: 'Invoicing & Closing',
    desc: 'Automated invoice delivery sequence with conditional logic checking payment status across 2-day, 5-day, 7-day, and 10-day reminder intervals.',
    nodes: 'Pipeline Stage Changed · Send Invoice · 2d / 5d / 7d / 10d Payment Sequences',
  },
]

const srcOf = (s: Sample) => `/proof/${encodeURIComponent(s.file)}`

export default function WorkflowSamples() {
  const [active, setActive] = useState<Sample | null>(null)
  const [zoom, setZoom] = useState<number>(1)
  const lastTriggerRef = useRef<HTMLElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const open = useCallback((s: Sample, trigger: HTMLElement | null) => {
    lastTriggerRef.current = trigger ?? (document.activeElement as HTMLElement | null)
    setActive(s)
    setZoom(1)
  }, [])

  const close = useCallback(() => {
    setActive(null)
    requestAnimationFrame(() => lastTriggerRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, close])

  return (
    <section className="wfs" id="workflow-samples" aria-labelledby="wfs-heading">
      <header className="wfs__head">
        <span className="wfs__eyebrow">GoHighLevel Production Systems</span>
        <h2 className="wfs__title" id="wfs-heading">
          Full-Funnel Sales & Client Lifecycle Automation
        </h2>
        <p className="wfs__desc">
          Live automation architecture configured inside GoHighLevel: lead capture, discovery call reminders, cancellation fail-safes, proposal follow-ups, and invoice delivery. Click any workflow card to inspect the full branching diagram.
        </p>
      </header>

      <div className="wfs__grid">
        {SAMPLES.map((s, i) => (
          <article
            key={s.file}
            className="wfs__card"
            onClick={(e) => open(s, e.currentTarget)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                open(s, e.currentTarget)
              }
            }}
            aria-label={`Inspect ${s.label} workflow diagram`}
          >
            <div className="wfs__card-top">
              <span className="wfs__step-badge">Stage 0{i + 1}</span>
              <span className="wfs__stage-tag">{s.stage}</span>
            </div>

            <div className="wfs__thumb">
              <img src={srcOf(s)} alt={`${s.label} workflow screenshot`} loading="lazy" decoding="async" />
              <div className="wfs__thumb-overlay" aria-hidden="true">
                <span className="wfs__inspect-pill">
                  <MagnifyingGlassPlus size={14} weight="bold" />
                  <span>Inspect Workflow</span>
                  <ArrowUpRight size={13} weight="bold" />
                </span>
              </div>
            </div>

            <div className="wfs__card-info">
              <h3 className="wfs__card-title">{s.label}</h3>
              <p className="wfs__card-desc">{s.desc}</p>
              <div className="wfs__card-nodes">
                <span className="wfs__nodes-label">Flow:</span>
                <span className="wfs__nodes-text">{s.nodes}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {active &&
        createPortal(
          <div
            className="wfs__modal"
            role="dialog"
            aria-modal="true"
            aria-label={`${active.label} workflow diagram`}
            onClick={(e) => {
              if (e.target === e.currentTarget) close()
            }}
          >
            <div className="wfs__window">
              <div className="wfs__bar">
                <span className="wfs__bar-dots" aria-hidden="true">
                  <span className="wfs__dot wfs__dot--r" />
                  <span className="wfs__dot wfs__dot--y" />
                  <span className="wfs__dot wfs__dot--g" />
                </span>
                <span className="wfs__bar-title">
                  <strong>{active.label}</strong> — {active.stage}
                </span>
                <div className="wfs__bar-actions">
                  <div className="wfs__zoom-controls" role="toolbar" aria-label="Zoom controls">
                    <button
                      type="button"
                      className="wfs__zoom-btn"
                      onClick={() => setZoom((z) => Math.max(0.6, Math.round((z - 0.2) * 10) / 10))}
                      disabled={zoom <= 0.6}
                      aria-label="Zoom out"
                      title="Zoom out"
                    >
                      <MagnifyingGlassMinus size={15} weight="bold" />
                    </button>
                    <span className="wfs__zoom-label">{Math.round(zoom * 100)}%</span>
                    <button
                      type="button"
                      className="wfs__zoom-btn"
                      onClick={() => setZoom((z) => Math.min(2.5, Math.round((z + 0.2) * 10) / 10))}
                      disabled={zoom >= 2.5}
                      aria-label="Zoom in"
                      title="Zoom in"
                    >
                      <MagnifyingGlassPlus size={15} weight="bold" />
                    </button>
                    <button
                      type="button"
                      className="wfs__zoom-btn"
                      onClick={() => setZoom(1)}
                      aria-label="Reset zoom to fit"
                      title="Reset zoom to fit"
                    >
                      <ArrowCounterClockwise size={14} weight="bold" />
                    </button>
                  </div>
                  <button
                    ref={closeRef}
                    type="button"
                    className="wfs__close"
                    onClick={close}
                    aria-label="Close modal"
                  >
                    <X weight="bold" size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="wfs__imgwrap">
                <img
                  className={`wfs__full ${zoom > 1 ? 'wfs__full--zoomed' : ''}`}
                  src={srcOf(active)}
                  alt={`${active.label} full diagram`}
                  style={{
                    width: `${Math.round(920 * zoom)}px`,
                    maxWidth: zoom <= 1 ? '100%' : 'none',
                  }}
                  onClick={() => setZoom((z) => (z === 1 ? 1.4 : 1))}
                  title={zoom === 1 ? 'Click to magnify' : 'Click to reset zoom'}
                />
              </div>
              <div className="wfs__footer">
                <div className="wfs__footer-meta">
                  <span className="wfs__footer-badge">
                    <CheckCircle size={14} weight="fill" />
                    Verified GHL Production Flow
                  </span>
                  <span className="wfs__footer-text">{active.desc}</span>
                </div>
                <div className="wfs__footer-sub">
                  <span className="wfs__footer-tip">
                    Tip: Scroll vertically to see the full branching architecture. Click the diagram or use zoom buttons to inspect actions.
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  )
}
