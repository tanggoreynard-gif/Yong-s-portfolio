import { useState, useEffect, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  PaperPlaneTilt,
  CheckCircle,
  WarningCircle,
  EnvelopeSimple,
  ArrowUpRight,
  CaretDown,
  CalendarCheck,
  Clock,
  ShieldCheck,
} from '@/components/slab'
import { FAQS } from '@/data/faqs'
import { profile } from '@/data/profile'
import { readLead, submitLead, SubmitError, MAX_NAME, MAX_EMAIL, MAX_MESSAGE, type SubmitResult } from '@/lib/contact'

/**
 * ContactGrid - the Contact view featuring live GoHighLevel Calendar booking
 * and direct email inquiry form.
 */

type Status = { kind: 'idle' } | { kind: 'sending' } | { kind: 'error'; note: string } | { kind: 'sent'; via: SubmitResult['via'] }

const FLIGHT_MS = 650
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export default function ContactGrid() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') === 'calendar' ? 'calendar' : 'message'
  const [view, setView] = useState<'calendar' | 'message'>(initialTab)

  const [status, setStatus] = useState<Status>({ kind: 'idle' })
  const [shake, setShake] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Ensure GHL form embed auto-resizer script is loaded and listen for dynamic height events
  useEffect(() => {
    if (view === 'calendar') {
      const existing = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]')
      if (!existing) {
        const script = document.createElement('script')
        script.src = 'https://link.msgsndr.com/js/form_embed.js'
        script.type = 'text/javascript'
        script.async = true
        document.body.appendChild(script)
      }

      const onMessage = (e: MessageEvent) => {
        try {
          const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
          if (data && (data.action === 'resize' || data.height || data.frameHeight)) {
            const h = Number(data.height || data.frameHeight)
            if (h && h > 400) {
              const frame = document.getElementById('f9JUfjP5sB4JwXvsZKFU_1792925195076') as HTMLIFrameElement | null
              if (frame) frame.style.minHeight = `${Math.max(h + 40, 940)}px`
            }
          }
        } catch {
          // Ignore unrelated cross-origin messages
        }
      }
      window.addEventListener('message', onMessage)
      return () => window.removeEventListener('message', onMessage)
    }
  }, [view])

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const lead = readLead(new FormData(e.currentTarget))
    if (!lead) {
      setStatus({ kind: 'error', note: 'Add your name, a real email, and a short note.' })
      setShake((n) => n + 1)
      return
    }
    setStatus({ kind: 'sending' })
    try {
      const [result] = await Promise.all([submitLead(lead), wait(FLIGHT_MS)])
      setStatus({ kind: 'sent', via: result.via })
    } catch (err) {
      const note = err instanceof SubmitError ? err.message : 'That did not go through. Email me directly instead.'
      setStatus({ kind: 'error', note })
      setShake((n) => n + 1)
    }
  }

  const busy = status.kind === 'sending'

  return (
    <section className="pgrid cgrid" aria-labelledby="contact-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Contact & Scheduling</span>
        <h1 className="pgrid__title" id="contact-title">
          Let’s streamline your CRM & administrative workflow.
        </h1>
        <p className="pgrid__lede">
          Book a 30-minute discovery call directly on my HighLevel calendar below, or send a quick note to get started.
        </p>
      </header>

      <div className="home__glass cgrid__glass">
        {/* Left: the dark plate. FAQs, Email, and Socials */}
        <aside className="cgrid__aside" aria-labelledby="contact-faq">
          <div className="cgrid__aside-head">
            <span className="cgrid__eyebrow">FAQs</span>
            <h2 className="cgrid__aside-title" id="contact-faq">
              Quick answers.
              <br />
              <span>Still have one? Book or write.</span>
            </h2>
          </div>

          <ul className="cgrid__faqs" role="list">
            {FAQS.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <li key={f.q} className={`cgrid__faq${isOpen ? ' is-open' : ''}`}>
                  <button
                    type="button"
                    className="cgrid__faq-q"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`cfaq-${i}`}
                  >
                    <span className="cgrid__step-index" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cgrid__faq-text">{f.q}</span>
                    <CaretDown size={14} weight="bold" className="cgrid__faq-caret" aria-hidden="true" />
                  </button>
                  <div className="cgrid__faq-a" id={`cfaq-${i}`} hidden={!isOpen}>
                    <p>{f.a}</p>
                  </div>
                </li>
              )
            })}
          </ul>

          <div className="cgrid__direct">
            <a className="cgrid__mail" href={`mailto:${profile.email}`}>
              <EnvelopeSimple size={16} weight="fill" aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
            <ul className="cgrid__socials" role="list">
              {profile.socials.map((s) => (
                <li key={s.label}>
                  <a className="cgrid__social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <img src={s.iconPath} alt="" loading="lazy" decoding="async" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Right: The interactive HighLevel Calendar & Contact Panel */}
        <div className="cgrid__panel">
          {/* Top Switcher Tabs */}
          <div className="cgrid__tabs-header">
            <div className="cgrid__tabs" role="tablist" aria-label="Contact options">
              <button
                type="button"
                role="tab"
                aria-selected={view === 'message'}
                className={`cgrid__tab-btn ${view === 'message' ? 'is-active' : ''}`}
                onClick={() => {
                  setView('message')
                  setSearchParams({ tab: 'message' })
                }}
              >
                <PaperPlaneTilt size={16} weight={view === 'message' ? 'fill' : 'bold'} aria-hidden="true" />
                <span>Send a Note</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={view === 'calendar'}
                className={`cgrid__tab-btn ${view === 'calendar' ? 'is-active' : ''}`}
                onClick={() => {
                  setView('calendar')
                  setSearchParams({ tab: 'calendar' })
                }}
              >
                <CalendarCheck size={16} weight={view === 'calendar' ? 'fill' : 'bold'} aria-hidden="true" />
                <span>Book Discovery Call</span>
              </button>
            </div>
            <div className="cgrid__tab-meta">
              {view === 'calendar' ? (
                <span className="cgrid__live-indicator">
                  <span className="cgrid__live-dot" aria-hidden="true" />
                  Live GHL Booking
                </span>
              ) : (
                <span className="cgrid__live-indicator">
                  <Clock size={13} weight="bold" aria-hidden="true" />
                  Replies in &lt; 24h
                </span>
              )}
            </div>
          </div>

          {/* View 1: GoHighLevel Embedded Calendar */}
          {view === 'calendar' && (
            <div className="cgrid__calendar-card">
              <div className="cgrid__calendar-intro">
                <div>
                  <h3 className="cgrid__cal-title">Schedule a 30-Min Discovery & Workflow Call</h3>
                  <p className="cgrid__cal-desc">
                    Pick a convenient time below to discuss your GoHighLevel CRM setup, automated workflows, or administrative support needs.
                  </p>
                </div>
                <div className="cgrid__cal-perks">
                  <span className="cgrid__cal-pill">
                    <Clock size={12} weight="fill" aria-hidden="true" /> 30 Minutes
                  </span>
                  <span className="cgrid__cal-pill">
                    <ShieldCheck size={12} weight="fill" aria-hidden="true" /> Zero Obligation
                  </span>
                  <span className="cgrid__cal-pill">
                    <CheckCircle size={12} weight="fill" aria-hidden="true" /> Google Meet / Zoom
                  </span>
                </div>
              </div>

              <div className="cgrid__calendar-frame-wrap">
                <iframe
                  src="https://go.rdtops.online/widget/booking/f9JUfjP5sB4JwXvsZKFU"
                  allow="payment"
                  style={{ width: '100%', border: 'none', minHeight: '940px', height: '100%' }}
                  scrolling="auto"
                  id="f9JUfjP5sB4JwXvsZKFU_1792925195076"
                  title="GoHighLevel Appointment Booking Calendar"
                />
              </div>
            </div>
          )}

          {/* View 2: Direct Note / Form */}
          {view === 'message' && (
            <>
              {status.kind === 'sent' ? (
                <div className="cgrid__done" role="status">
                  <span className="cgrid__done-mark" aria-hidden="true">
                    <CheckCircle size={30} weight="fill" />
                  </span>
                  <h2 className="cgrid__done-title">
                    {status.via === 'webhook' ? 'Got it.' : 'Your mail app has it.'}
                  </h2>
                  <p className="cgrid__done-body">
                    {status.via === 'webhook'
                      ? 'It is in my inbox and on my phone. You will hear back within one business day.'
                      : 'The message is laid out and addressed. Press send there and you will hear back within one business day.'}
                  </p>
                  <button type="button" className="cgrid__again" onClick={() => setStatus({ kind: 'idle' })}>
                    Write another
                  </button>
                </div>
              ) : (
                <form className={`cgrid__form${busy ? ' is-sending' : ''}`} onSubmit={onSubmit} noValidate>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="cgrid__trap"
                  />
                  <div className="cgrid__row">
                    <label className="cgrid__field">
                      <span className="cgrid__label">First name</span>
                      <input type="text" name="firstName" autoComplete="given-name" required maxLength={MAX_NAME} placeholder="First name" />
                    </label>
                    <label className="cgrid__field">
                      <span className="cgrid__label">Last name</span>
                      <input type="text" name="lastName" autoComplete="family-name" required maxLength={MAX_NAME} placeholder="Last name" />
                    </label>
                  </div>

                  <label className="cgrid__field">
                    <span className="cgrid__label">Email</span>
                    <input type="email" name="email" autoComplete="email" required maxLength={MAX_EMAIL} placeholder="you@yourbusiness.com" />
                  </label>

                  <label className="cgrid__field cgrid__field--grow">
                    <span className="cgrid__label">Tell me more about your business</span>
                    <textarea
                      name="message"
                      required
                      maxLength={MAX_MESSAGE}
                      placeholder="What do you need help with? What are you working with today?"
                    />
                  </label>

                  <div className="cgrid__actions">
                    <button
                      key={shake}
                      type="submit"
                      className={`cgrid__submit${busy ? ' is-sending' : ''}${status.kind === 'error' ? ' is-shaking' : ''}`}
                      disabled={busy}
                    >
                      <span className="cgrid__submit-plane" aria-hidden="true">
                        <PaperPlaneTilt size={17} weight="fill" />
                      </span>
                      <span className="cgrid__submit-label">{busy ? 'Sending' : 'Send message'}</span>
                      <ArrowUpRight className="cgrid__submit-arrow" size={15} weight="bold" aria-hidden="true" />
                    </button>
                    {status.kind === 'error' ? (
                      <span className="cgrid__status" role="alert">
                        <WarningCircle size={16} weight="fill" aria-hidden="true" />
                        {status.note}
                      </span>
                    ) : (
                      <span className="cgrid__hint">Guaranteed response within 24 hours.</span>
                    )}
                  </div>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
