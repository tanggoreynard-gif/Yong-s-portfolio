import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MagnifyingGlassPlus, ArrowSquareOut, X, CheckCircle, ShieldCheck } from '@/components/slab'

export type ProofItem = {
  title: string
  badge: string
  src: string
  fullSrc?: string
  href?: string
  alt: string
  desc: string
  tags?: string[]
  wide?: boolean
}

export function ProofCard({
  item,
  onZoom,
}: {
  item: ProofItem
  onZoom: (item: ProofItem) => void
}) {
  return (
    <article className="proof-card">
      <div className="proof-card__bar">
        <div className="proof-card__bar-left">
          <div className="proof-card__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="proof-card__bar-title">{item.title}</span>
        </div>
        <span className="proof-card__bar-badge">
          <ShieldCheck size={12} weight="bold" />
          {item.badge}
        </span>
      </div>

      <figure
        className="proof-card__figure"
        onClick={() => onZoom(item)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onZoom(item)
          }
        }}
        aria-label={`Inspect ${item.title} in full resolution`}
      >
        <img
          className="proof-card__img"
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
        />
        <div className="proof-card__overlay" aria-hidden="true">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
            <span className="proof-card__zoom-btn" onClick={(e) => { e.stopPropagation(); onZoom(item); }}>
              <MagnifyingGlassPlus size={15} weight="bold" />
              Inspect Full-Page (High-Res)
            </span>
            {item.href && (
              <span
                className="proof-card__zoom-btn"
                style={{ background: '#5B4FE0', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(item.href, '_blank', 'noopener,noreferrer');
                }}
              >
                <ArrowSquareOut size={15} weight="bold" />
                Open Live Site ↗
              </span>
            )}
          </div>
        </div>
      </figure>

      <div className="proof-card__body">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
          <h4 className="proof-card__heading" style={{ margin: 0 }}>{item.title}</h4>
          {item.href && (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="home__cta home__cta--primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 700,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowSquareOut size={13} weight="bold" />
              Live Site ↗
            </a>
          )}
        </div>
        <p className="proof-card__desc" style={{ marginTop: '8px' }}>{item.desc}</p>
        {item.tags && item.tags.length > 0 && (
          <div className="proof-card__meta">
            {item.tags.map((t) => (
              <span key={t} className="proof-card__tag">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

export function ProofLightbox({
  active,
  onClose,
}: {
  active: ProofItem | null
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!active) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [active, onClose])

  if (!active) return null

  return createPortal(
    <div
      className="proof-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${active.title} live experience`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="proof-modal__window" style={{ maxWidth: 'min(1280px, 96vw)', height: '94vh', maxHeight: '94vh' }}>
        <div className="proof-modal__bar">
          <div className="proof-card__dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="proof-modal__title">
            <strong>{active.title}</strong>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {active.href && (
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                className="proof-modal__open-btn"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  background: 'var(--accent, #5B4FE0)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: '0 2px 8px rgba(91, 79, 224, 0.3)',
                }}
              >
                <ArrowSquareOut size={14} weight="bold" />
                Open Live Site in New Tab ↗
              </a>
            )}
            <button
              ref={closeRef}
              type="button"
              className="proof-modal__close"
              onClick={onClose}
              aria-label="Close interactive view"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </div>

        <div className="proof-modal__stage" style={{ padding: 0, height: 'calc(94vh - 105px)', maxHeight: 'none', background: '#FFFFFF', overflow: 'hidden' }}>
          {active.href ? (
            <iframe
              src={active.href}
              title={active.title}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                display: 'block',
                background: '#FFFFFF',
              }}
              loading="eager"
            />
          ) : (
            <div style={{ overflowY: 'auto', width: '100%', height: '100%', padding: '24px 16px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
              <img
                className={`proof-modal__full-img${active.wide ? ' proof-modal__full-img--wide' : ''}`}
                src={active.fullSrc || active.src}
                alt={active.alt}
                style={{ width: 'auto', maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
              />
            </div>
          )}
        </div>

        <div className="proof-modal__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={15} weight="fill" color="#0FB6D6" />
            <span>Interactive Live Website Sandbox · Fully Navigable</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {active.href && (
              <a
                href={active.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent, #5B4FE0)', fontWeight: 600, textDecoration: 'underline' }}
              >
                Launch {active.href} in new tab ↗
              </a>
            )}
            <span>Press ESC or click outside to close</span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
