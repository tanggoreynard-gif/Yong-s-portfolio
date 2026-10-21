import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  EnvelopeSimple,
  Kanban,
  ChatDots,
  CalendarCheck,
  Database,
  FileText,
} from '@/components/slab'
import { profile } from '@/data/profile'
import ToolsMarquee from './ToolsMarquee'
import { HomeProfile, HomeStats } from './HomeMobile'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { useIsPhone } from '@/hooks/useMediaQuery'

export default function Home() {
  useScrollReveal()
  const phone = useIsPhone()
  const { displayName } = profile

  return (
    <section className="home" aria-labelledby="home-title">
      {/* ========================================================
          1. HERO
          ======================================================== */}
      <header className="home__head" data-reveal>
        {phone && <HomeProfile />}

        <div className="home__headline">
          <div className="home__hero-main">
            <div className="home__role-pill">
              <img
                src="/certified-admin-badge.png"
                alt="HighLevel Certified Admin Badge"
                width={18}
                height={22}
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.12))' }}
              />
              <span>HighLevel Certified Admin · {profile.role}</span>
            </div>

            <h1 className="home__title" id="home-title">
              <span className="home__line">{displayName.line1}</span>
              <span className="home__line home__line--sub">{displayName.line2}</span>
            </h1>

            <p className="home__lede">
              Hi, I’m <strong>{profile.name}</strong>. HighLevel Certified Administrator and Licensed Biosystems Engineer. I configure clean GoHighLevel pipelines, automated lead follow-ups, and organized backend administrative systems with engineering precision.
            </p>

            <div className="home__hero-actions">
              <Link className="home__cta home__cta--primary" to="/projects">
                View My Projects
                <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
              </Link>
              <Link className="home__cta home__cta--secondary" to="/contact">
                Get in Touch
                <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {phone && <HomeStats />}
      </header>

      {/* ========================================================
          2. TOOLS I USE (Compact Single Section)
          ======================================================== */}
      <section className="home__glass home__glass--tools" aria-label="Tools I work with" data-reveal>
        <div className="home__tools">
          <div className="home__tools-head">
            <span className="home__tools-eyebrow">Software Stack</span>
            <h2 className="home__tools-label">Tools I Work With Daily</h2>
          </div>
          <ToolsMarquee />
        </div>
      </section>

      {/* ========================================================
          3. CLIENT WEBSITES & CONVERSION FUNNELS
          ======================================================== */}
      <section className="home__glass home__glass--section" aria-labelledby="client-websites-title" data-reveal>
        <div className="home__sec-head">
          <div className="home__sec-titleblock">
            <span className="home__sec-eyebrow">Client Websites &amp; Conversion Funnels</span>
            <h2 className="home__sec-title" id="client-websites-title">Websites &amp; Landing Pages</h2>
            <p className="home__sec-desc">
              Custom GoHighLevel landing pages, multi-section brand websites, and conversion-focused funnels engineered for lead capture, consultation booking, and automated CRM intake.
            </p>
          </div>
          <Link to="/projects" className="home__sec-action">
            <span>Explore All In Projects</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="home__sites-grid">
          {/* Site 1: Lumina */}
          <article className="home__site-card">
            <a
              href="/lumina-dental"
              target="_blank"
              rel="noopener noreferrer"
              className="home__site-visual"
              title="Open Lumina Dental Studio live preview"
            >
              <img src="/samples/thumbs/lumina-dental.jpeg" alt="Lumina Dental Studio website mockup" loading="lazy" />
              <span className="home__site-badge">Healthcare Website</span>
              <span className="home__site-overlay-hint">
                <ArrowUpRight size={14} weight="bold" /> Click for Live Preview
              </span>
            </a>
            <div className="home__site-body">
              <span className="home__site-industry">Private Dental Practice</span>
              <h3 className="home__site-title">Lumina Dental Studio</h3>
              <p className="home__site-desc">
                Luxury dental practice website featuring comprehensive treatment showcase, patient journey roadmap, doctor credentials, and an integrated booking modal concierge.
              </p>
              <div className="home__site-tags">
                <span>Online Booking</span>
                <span>Patient Onboarding</span>
                <span>Luxury Aesthetic</span>
                <span>Mobile Responsive</span>
              </div>
              <div className="home__site-actions">
                <a
                  href="/lumina-dental"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__site-btn home__site-btn--live"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
                <Link to="/projects" className="home__site-btn home__site-btn--inspect">
                  Inspect Website
                </Link>
              </div>
            </div>
          </article>

          {/* Site 2: FitCo */}
          <article className="home__site-card">
            <a
              href="/fitco-coaching"
              target="_blank"
              rel="noopener noreferrer"
              className="home__site-visual"
              title="Open FitCo High-Performance Coaching live preview"
            >
              <img src="/samples/thumbs/fitco-coaching.jpeg" alt="FitCo High-Performance Coaching website mockup" loading="lazy" />
              <span className="home__site-badge" style={{ background: 'rgba(163, 230, 53, 0.9)', color: '#090d16' }}>Fitness &amp; Coaching</span>
              <span className="home__site-overlay-hint">
                <ArrowUpRight size={14} weight="bold" /> Click for Live Preview
              </span>
            </a>
            <div className="home__site-body">
              <span className="home__site-industry">High-Ticket Athletics</span>
              <h3 className="home__site-title">FitCo Performance Coaching</h3>
              <p className="home__site-desc">
                High-converting 11-section fitness coaching funnel featuring coach credentials, client transformation proofs, program tiers, FAQ, and an integrated consultation booking flow.
              </p>
              <div className="home__site-tags">
                <span>Strategy Booking</span>
                <span>Program Tiers</span>
                <span>Social Proof</span>
                <span>Lead Intake</span>
              </div>
              <div className="home__site-actions">
                <a
                  href="/fitco-coaching"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__site-btn home__site-btn--live"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
                <Link to="/projects" className="home__site-btn home__site-btn--inspect">
                  Inspect Funnel
                </Link>
              </div>
            </div>
          </article>

          {/* Site 3: Serene Haven */}
          <article className="home__site-card">
            <a
              href="/haven-senior-care"
              target="_blank"
              rel="noopener noreferrer"
              className="home__site-visual"
              title="Open Serene Haven Senior Care live preview"
            >
              <img src="/samples/thumbs/haven-senior-care.jpeg" alt="Serene Haven Senior Care website mockup" loading="lazy" />
              <span className="home__site-badge">Senior Living</span>
              <span className="home__site-overlay-hint">
                <ArrowUpRight size={14} weight="bold" /> Click for Live Preview
              </span>
            </a>
            <div className="home__site-body">
              <span className="home__site-industry">Assisted Living Community</span>
              <h3 className="home__site-title">Serene Haven Senior Care</h3>
              <p className="home__site-desc">
                Warm, compassionate senior living community platform featuring care level breakdowns, family testimonials, memory care details, and a tour scheduling consultation flow.
              </p>
              <div className="home__site-tags">
                <span>Care Tier Selector</span>
                <span>Tour Scheduling</span>
                <span>Family Testimonials</span>
                <span>HIPAA Intake</span>
              </div>
              <div className="home__site-actions">
                <a
                  href="/haven-senior-care"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__site-btn home__site-btn--live"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
                <Link to="/projects" className="home__site-btn home__site-btn--inspect">
                  Inspect Funnel
                </Link>
              </div>
            </div>
          </article>

          {/* Site 4: Meridian */}
          <article className="home__site-card">
            <a
              href="/meridian-staffing"
              target="_blank"
              rel="noopener noreferrer"
              className="home__site-visual"
              title="Open Meridian Executive Staffing live preview"
            >
              <img src="/samples/thumbs/meridian-staffing.jpeg" alt="Meridian Executive Staffing website mockup" loading="lazy" />
              <span className="home__site-badge" style={{ background: 'rgba(234, 179, 8, 0.9)', color: '#090d16' }}>Corporate Staffing</span>
              <span className="home__site-overlay-hint">
                <ArrowUpRight size={14} weight="bold" /> Click for Live Preview
              </span>
            </a>
            <div className="home__site-body">
              <span className="home__site-industry">Recruitment &amp; Talent</span>
              <h3 className="home__site-title">Meridian Executive Staffing</h3>
              <p className="home__site-desc">
                Enterprise corporate recruiting agency platform with candidate submission pipelines, client talent request orders, and automated GHL candidate intake.
              </p>
              <div className="home__site-tags">
                <span>Talent Request Order</span>
                <span>Candidate Pipeline</span>
                <span>Resume Drop</span>
                <span>CRM Stage Sync</span>
              </div>
              <div className="home__site-actions">
                <a
                  href="/meridian-staffing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="home__site-btn home__site-btn--live"
                >
                  <span>Live Preview</span>
                  <ArrowUpRight size={13} weight="bold" />
                </a>
                <Link to="/projects" className="home__site-btn home__site-btn--inspect">
                  Inspect Funnel
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ========================================================
          4. FEATURED PROJECTS
          ======================================================== */}
      <section className="home__glass home__glass--section" aria-labelledby="featured-projects-title" data-reveal>
        <div className="home__sec-head">
          <div className="home__sec-titleblock">
            <span className="home__sec-eyebrow">Production Builds & Templates</span>
            <h2 className="home__sec-title" id="featured-projects-title">Featured Projects</h2>
            <p className="home__sec-desc">
              Practical GoHighLevel systems pre-configured with real pipeline stages, automated triggers, and lead tracking — ready for client demonstration and onboarding.
            </p>
          </div>
          <Link to="/projects" className="home__sec-action">
            <span>View All Projects</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="home__projects-grid">
          {/* Project 1 */}
          <Link to="/projects" className="home__project-card">
            <div className="home__project-visual">
              <img src="/proof/crm-opportunities-pipeline.png" alt="8-Stage Sales Pipeline Template" loading="lazy" />
              <span className="home__project-badge">CRM Template</span>
            </div>
            <div className="home__project-body">
              <span className="home__project-step">01 · Pipeline Architecture</span>
              <h3 className="home__project-name">8-Stage Sales Pipeline Template</h3>
              <p className="home__project-note">
                Visual Kanban opportunity board with standardized deal stages, custom fields, and automated stage migration triggers.
              </p>
              <div className="home__project-tags">
                <span>GoHighLevel</span>
                <span>Kanban Board</span>
                <span>Custom Fields</span>
                <span>Stage Sync</span>
              </div>
            </div>
          </Link>

          {/* Project 2 */}
          <Link to="/projects" className="home__project-card">
            <div className="home__project-visual">
              <img src="/proof/live-client-conversation.png" alt="Lead Nurture & Client Messaging System" loading="lazy" />
              <span className="home__project-badge">Messaging System</span>
            </div>
            <div className="home__project-body">
              <span className="home__project-step">02 · Automated Messaging</span>
              <h3 className="home__project-name">Lead Nurture & Client Messaging</h3>
              <p className="home__project-note">
                Sub-60-second missed-call text-back workflows, automated appointment confirmations, and multi-channel SMS follow-up sequences.
              </p>
              <div className="home__project-tags">
                <span>Missed-Call Text</span>
                <span>SMS Triggers</span>
                <span>Lead Follow-Up</span>
                <span>Reminders</span>
              </div>
            </div>
          </Link>

          {/* Project 3 */}
          <Link to="/projects" className="home__project-card">
            <div className="home__project-visual">
              <img src="/proof/ghl-workflows-directory.png" alt="Pre-Built Workflows & SOP Directory" loading="lazy" />
              <span className="home__project-badge">Systems & SOPs</span>
            </div>
            <div className="home__project-body">
              <span className="home__project-step">03 · Operations & SOPs</span>
              <h3 className="home__project-name">Pre-Built Workflows & SOP Directory</h3>
              <p className="home__project-note">
                Documented trigger matrices and standard operating procedures for new lead routing, reminders, and stage updates.
              </p>
              <div className="home__project-tags">
                <span>Workflow Directory</span>
                <span>SOP Tracking</span>
                <span>Lead Routing</span>
                <span>Data Hygiene</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ========================================================
          4. WORKFLOW DEMOS (Clearly labeled as Demo Builds / Sample Work)
          ======================================================== */}
      <section className="home__glass home__glass--section" aria-labelledby="workflow-demos-title" data-reveal>
        <div className="home__sec-head">
          <div className="home__sec-titleblock">
            <span className="home__sec-eyebrow">Practical Demonstrations</span>
            <h2 className="home__sec-title" id="workflow-demos-title">Workflow Demos</h2>
            <p className="home__sec-desc">
              Focused automation workflows demonstrating practical GoHighLevel capabilities. Each build demonstrates functional business logic.
            </p>
          </div>
          <Link to="/showcase" className="home__sec-action">
            <span>Explore Interactive Demo</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="home__demos-grid">
          {/* Demo 1 */}
          <div className="home__demo-card">
            <div className="home__demo-top">
              <span className="home__demo-tag">GHL Demo Build</span>
              <span className="home__demo-num">01</span>
            </div>
            <h3 className="home__demo-title">Lead Intake Automation</h3>
            <div className="home__demo-flow">
              <span className="home__flow-node">Form</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">SMS</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Calendar</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Follow-up</span>
            </div>
            <p className="home__demo-body">
              Captures inbound leads instantly, creates contact records with custom tags, and triggers an immediate text response under 60 seconds.
            </p>
          </div>

          {/* Demo 2 */}
          <div className="home__demo-card">
            <div className="home__demo-top">
              <span className="home__demo-tag">GHL Demo Build</span>
              <span className="home__demo-num">02</span>
            </div>
            <h3 className="home__demo-title">Lead Follow-Up Workflow</h3>
            <div className="home__demo-flow">
              <span className="home__flow-node">Unanswered</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Staged SMS</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Condition</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Pipeline Sync</span>
            </div>
            <p className="home__demo-body">
              Multi-channel follow-up sequences (Day 1, 3, 5) with conditional branching that pauses automatically when a prospect replies.
            </p>
          </div>

          {/* Demo 3 */}
          <div className="home__demo-card">
            <div className="home__demo-top">
              <span className="home__demo-tag">GHL Demo Build</span>
              <span className="home__demo-num">03</span>
            </div>
            <h3 className="home__demo-title">Appointment Workflow</h3>
            <div className="home__demo-flow">
              <span className="home__flow-node">Booking</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Calendar Sync</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">24h SMS</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">20m Alert</span>
            </div>
            <p className="home__demo-body">
              Automated booking confirmation, calendar event syncing, and staged reminders (24h and 20m prior) to maximize show-up rates.
            </p>
          </div>

          {/* Demo 4 */}
          <div className="home__demo-card">
            <div className="home__demo-top">
              <span className="home__demo-tag">GHL Demo Build</span>
              <span className="home__demo-num">04</span>
            </div>
            <h3 className="home__demo-title">Pipeline Automation</h3>
            <div className="home__demo-flow">
              <span className="home__flow-node">Stage Moved</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Tag Update</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Value Sync</span>
              <span className="home__flow-arr">→</span>
              <span className="home__flow-node">Internal Alert</span>
            </div>
            <p className="home__demo-body">
              Automatically advances opportunities through pipeline stages when actions occur (survey submitted, call completed, contract sent).
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. SERVICES (Simple, Realistic, Demonstrable)
          ======================================================== */}
      <section className="home__glass home__glass--section" aria-labelledby="services-title" data-reveal>
        <div className="home__sec-head">
          <div className="home__sec-titleblock">
            <span className="home__sec-eyebrow">Service Offerings</span>
            <h2 className="home__sec-title" id="services-title">Services I Offer</h2>
            <p className="home__sec-desc">
              Practical CRM configuration, automation workflows, and reliable remote administrative operations.
            </p>
          </div>
          <Link to="/services" className="home__sec-action">
            <span>View Full Services</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="home__services-grid">
          <div className="home__service-card">
            <span className="home__service-icon"><Kanban size={20} weight="duotone" /></span>
            <div className="home__service-body">
              <h3 className="home__service-title">GHL Pipeline Setup & Management</h3>
              <p className="home__service-desc">
                Custom sales pipeline stages, opportunity tracking, deal value calculations, and automated stage movements.
              </p>
            </div>
          </div>

          <div className="home__service-card">
            <span className="home__service-icon"><ChatDots size={20} weight="duotone" /></span>
            <div className="home__service-body">
              <h3 className="home__service-title">Automated Lead Follow-Ups & SMS</h3>
              <p className="home__service-desc">
                Instant missed-call text-back, appointment reminders, and automated nurture sequences so no lead goes cold.
              </p>
            </div>
          </div>

          <div className="home__service-card">
            <span className="home__service-icon"><CalendarCheck size={20} weight="duotone" /></span>
            <div className="home__service-body">
              <h3 className="home__service-title">Funnels & Booking Calendars</h3>
              <p className="home__service-desc">
                Clean lead capture funnels, qualification surveys, and embedded round-robin scheduling calendars.
              </p>
            </div>
          </div>

          <div className="home__service-card">
            <span className="home__service-icon"><Database size={20} weight="duotone" /></span>
            <div className="home__service-body">
              <h3 className="home__service-title">CRM Data Hygiene & Cleanup</h3>
              <p className="home__service-desc">
                Contact deduplication, standardized custom fields, smart tag organization, and clean database imports.
              </p>
            </div>
          </div>

          <div className="home__service-card">
            <span className="home__service-icon"><FileText size={20} weight="duotone" /></span>
            <div className="home__service-body">
              <h3 className="home__service-title">Administrative & Remote Support</h3>
              <p className="home__service-desc">
                Google Workspace management, spreadsheet tracking (Excel/Sheets), SOP documentation, and inbox coordination.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. ABOUT & CREDENTIALS (Consolidated, No Redundant Cards)
          ======================================================== */}
      <section className="home__glass home__glass--section" aria-labelledby="about-credentials-title" data-reveal>
        <div className="home__sec-head">
          <div className="home__sec-titleblock">
            <span className="home__sec-eyebrow">Background & Proof</span>
            <h2 className="home__sec-title" id="about-credentials-title">About Reynard Tanggo</h2>
            <p className="home__sec-desc">
              Engineering discipline applied to CRM systems and remote business operations.
            </p>
          </div>
          <Link to="/about" className="home__sec-action">
            <span>Read Full Bio</span>
            <ArrowUpRight size={15} weight="bold" aria-hidden="true" />
          </Link>
        </div>

        <div className="home__about-box">
          <div className="home__about-copy">
            <p className="home__about-lead">
              I am a <strong>Licensed Biosystems Engineer</strong> and <strong>GoHighLevel CRM Specialist</strong> based in the Philippines.
            </p>
            <p className="home__about-para">
              My engineering background taught me rigorous attention to detail, process documentation, and data integrity. I apply that same methodical standard when configuring GoHighLevel pipelines, automated lead workflows, and administrative SOPs.
            </p>
            <p className="home__about-para">
              I am an official <strong>HighLevel Certified Administrator</strong>, holding verified accreditation directly from HighLevel. In addition, I graduated from the intensive <strong>HighLevel Accelerator (HLA) course</strong>, mastering advanced sales pipelines, custom values, trigger automations, and client onboarding workflows.
            </p>

            <div className="home__about-specs">
              <div className="home__spec-item">
                <span className="home__spec-label">Time Zone</span>
                <span className="home__spec-value">GMT+8 · Dedicated U.S. Time Zone Coverage</span>
              </div>
              <div className="home__spec-item">
                <span className="home__spec-label">Core Focus</span>
                <span className="home__spec-value">GoHighLevel Pipelines, Follow-Up Automations, Admin VA</span>
              </div>
            </div>
          </div>

          <div className="home__about-card">
            <a
              className="home__cred-badge"
              href="https://www.highlevel.com"
              target="_blank"
              rel="noopener noreferrer"
              title="HighLevel Certified Admin"
            >
              <img src="/certified-admin-badge.png" alt="HighLevel Certified Admin Badge" width={48} height={56} style={{ objectFit: 'contain' }} />
              <div className="home__cred-text">
                <span className="home__cred-title">HighLevel Certified Admin</span>
                <span className="home__cred-meta">Official Platform Certification</span>
              </div>
              <ArrowUpRight size={16} weight="bold" className="home__cred-arrow" aria-hidden="true" />
            </a>

            <a
              className="home__cred-badge"
              href="https://www.highlevel.com"
              target="_blank"
              rel="noopener noreferrer"
              title="HLA Certified Builder"
            >
              <img src="/hla_badge.png" alt="HLA Certified Builder Badge" width={48} height={48} style={{ objectFit: 'contain' }} />
              <div className="home__cred-text">
                <span className="home__cred-title">HighLevel Accelerator (HLA)</span>
                <span className="home__cred-meta">Course Graduate · Automation Builder</span>
              </div>
              <ArrowUpRight size={16} weight="bold" className="home__cred-arrow" aria-hidden="true" />
            </a>

            <div className="home__about-photo">
              <img src={profile.avatarSrc} alt={profile.name} width={64} height={64} />
              <div className="home__photo-tag">
                <span className="home__status-dot" aria-hidden="true" />
                <span>Active &amp; Open for Projects</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. CONTACT (Simple Final CTA)
          ======================================================== */}
      <section className="home__glass home__glass--contact" aria-labelledby="home-contact-title" data-reveal>
        <div className="home__contact-inner">
          <div className="home__contact-copy">
            <span className="home__contact-eyebrow">Let’s Connect</span>
            <h2 className="home__contact-title" id="home-contact-title">
              Ready to streamline your CRM and administrative workflows?
            </h2>
            <p className="home__contact-desc">
              Whether you need a new GoHighLevel pipeline built, automated follow-up sequences configured, or dependable virtual assistant support, let’s talk.
            </p>
          </div>

          <div className="home__contact-actions">
            <Link className="home__cta home__cta--primary" to="/contact">
              Get in Touch
              <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
            </Link>
            <a className="home__contact-email" href={`mailto:${profile.email}`}>
              <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
              <span>{profile.email}</span>
            </a>
          </div>
        </div>
      </section>
    </section>
  )
}
