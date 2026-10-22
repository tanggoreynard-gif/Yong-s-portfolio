import Flagship from '@/components/Flagship'

/**
 * ShowcaseGrid - the /showcase view on one glass sheet.
 *
 * A page head with a compact badge card on the right, then the Flagship build:
 * workflow overview strip, the five-tab product mock, the copy, the CTA, the
 * architecture highlights, the "What This Demonstrates" section, and a clear
 * demo disclaimer. Same head and glass as Projects and Services.
 * Styles live in src/styles/showcase.css (.ktools).
 */
export default function ShowcaseGrid() {
  return (
    <section className="pgrid ktools" aria-labelledby="showcase-title">
      <header className="pgrid__head ktools__head">
        <div className="ktools__head-copy">
          <span className="pgrid__eyebrow">Interactive Demonstration</span>
          <h1 className="pgrid__title" id="showcase-title">
            GoHighLevel Client Acquisition Workflow Demo
          </h1>
          <p className="pgrid__lede">
            A portfolio demonstration showing how lead qualification, calendar booking, automated follow-up, pipeline management, and client onboarding can be structured inside GoHighLevel.
          </p>
        </div>

        {/* HighLevel Certification — compact single instance */}
        <div className="ktools__vote">
          <p className="ktools__vote-label">
            <span className="ktools__vote-dot" aria-hidden="true" />
            Certified Admin
          </p>
          <a href="https://directory.gohighlevel.com/philippines/general-santos-city-dadiangas/certified-admins/reynard-tanggo" target="_blank" rel="noopener noreferrer" className="ktools__vote-frame ktools__vote-card" title="HighLevel Certified Admin - Official Directory Profile">
            <img src="/certified-admin-badge.png" alt="HighLevel Certified Admin Badge" width="40" height="46" style={{ objectFit: 'contain' }} />
            <span className="ktools__vote-text">Verified Admin</span>
          </a>
        </div>
      </header>

      <div className="home__glass ktools__glass">
        <Flagship eyebrow="Concept CRM Architecture" />
      </div>
    </section>
  )
}
