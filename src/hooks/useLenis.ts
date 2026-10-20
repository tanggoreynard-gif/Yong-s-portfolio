import { useEffect } from 'react'

export const SCROLLER_ID = 'main-content'

export function getScroller(): HTMLElement | null {
  return document.getElementById(SCROLLER_ID)
}

/**
 * Native, non-blocking smooth scrolling engine.
 * Handles in-page anchor links while preserving 100% native browser mouse wheel
 * rolling, trackpad gestures, and modal scrolling without virtual event hijacking.
 */
export function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const NAV_OFFSET = -88
    const onAnchorClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href || href === '#') return
      if (href === `#${SCROLLER_ID}`) return

      const scroller = getScroller() ?? window

      if (href === '#top') {
        e.preventDefault()
        scroller.scrollTo({ top: 0, behavior: 'smooth' })
        history.replaceState(null, '', ' ')
        return
      }

      const target = document.querySelector(href) as HTMLElement | null
      if (!target) return
      e.preventDefault()

      if (scroller instanceof HTMLElement) {
        const scrollerRect = scroller.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const top = scroller.scrollTop + (targetRect.top - scrollerRect.top) + NAV_OFFSET
        scroller.scrollTo({ top, behavior: 'smooth' })
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET
        window.scrollTo({ top, behavior: 'smooth' })
      }
      history.replaceState(null, '', href)
    }

    document.addEventListener('click', onAnchorClick)
    return () => {
      document.removeEventListener('click', onAnchorClick)
    }
  }, [])
}
