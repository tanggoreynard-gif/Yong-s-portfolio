import type { CSSProperties } from 'react'
import { ArrowUpRight } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual. Swap the marks below for your own (any square SVG/PNG in public/).
 */

const GHL = { src: '/icons/gohighlevel.png', name: 'GoHighLevel' }
const GWS = { src: '/icons/googleworkspace.svg', name: 'Google Workspace' }
const ZAPIER = { src: '/icons/ai/zapier.svg', name: 'Zapier' }
const SLACK = { src: '/icons/ai/slack-color.svg', name: 'Slack' }
const CHATGPT = { src: '/icons/openai.svg', name: 'ChatGPT' }

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  {
    index: '01',
    title: 'GHL Pipeline Setup & Opportunity Management',
    marks: [GHL],
  },
  {
    index: '02',
    title: 'Automated Lead Follow-ups & SMS Reminders',
    marks: [GHL, ZAPIER],
  },
  {
    index: '03',
    title: 'Lead Capture Funnels, Landing Pages & Calendars',
    marks: [GHL],
  },
  {
    index: '04',
    title: 'Executive Admin, Data Hygiene & Documentation',
    marks: [GWS, SLACK, CHATGPT],
  },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          HighLevel Certified Administrator and detail-driven CRM & Administrative Specialist.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I build seamless GoHighLevel CRM pipelines and automated client workflows.
            <span> Turning chaotic prospect interactions into structured, reliable revenue engines.</span>
          </p>

          <p className="agrid__note">
            <strong>HighLevel Certified Administrator</strong> with a background in engineering (Licensed Biosystems Engineer) and graduate of the intensive <strong>HighLevel Accelerator (HLA) course</strong>.
            I combine rigorous process discipline with hands-on CRM expertise in GoHighLevel, Google Workspace, and AI platforms to deliver clean databases, instant lead responses, and dependable remote operations.
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* Symmetrical two-cell credential bar */}
          <div className="agrid__bar">
            <a
              className="agrid__cell"
              href="https://www.highlevel.com"
              target="_blank"
              rel="noopener noreferrer"
              title="HighLevel Certified Admin"
            >
              <span className="agrid__cell-mark agrid__cell-mark--badge">
                <img src="/certified-admin-badge.png" alt="HighLevel Certified Admin Badge" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">HighLevel Certified Admin</span>
                <span className="agrid__cell-meta">Official Platform Certification</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={14} weight="bold" aria-hidden="true" />
            </a>

            <a
              className="agrid__cell"
              href="https://www.highlevel.com"
              target="_blank"
              rel="noopener noreferrer"
              title="HLA Certified Builder"
            >
              <span className="agrid__cell-mark agrid__cell-mark--badge">
                <img src="/hla_badge.png" alt="HLA Certified Builder Badge" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">HighLevel Accelerator (HLA)</span>
                <span className="agrid__cell-meta">HLA Automation Builder · Course</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={14} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__portrait">
          <div className="agrid__portrait-card">
            <img
              src="/avatar.jpg"
              alt={profile.name}
              loading="eager"
              decoding="async"
              width={260}
              height={260}
            />
            <div className="agrid__portrait-badge">
              <span className="agrid__portrait-dot" aria-hidden="true" />
              <span>Active &amp; Open for Projects</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
