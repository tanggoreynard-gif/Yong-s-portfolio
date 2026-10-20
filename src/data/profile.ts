/**
 * YOUR IDENTITY - start here.
 *
 * Everything that says who you are lives in this file: name, handle, photo,
 * socials, email and the Home headline. Every value below is a PLACEHOLDER.
 * Replace the text, or hand this file to your AI assistant and tell it what
 * to put in each field.
 *
 * Page-specific copy (projects, services, testimonials, FAQs) lives in the
 * other files in src/data/ and at the top of each view component.
 */

import { Briefcase, SealCheck, Clock, type Icon } from '@/components/slab'

export type SocialLink = {
  label: string
  href: string
  iconPath: string
}

/** A proof fact on the phone's Home: a glyph, a short value, a caption. */
export type Stat = { value: string; label: string; Icon: Icon }

export type Profile = {
  name: string
  /** First name, used in "Hi, I'm ___." on About. */
  firstName: string
  handle: string
  /** HighLevel Certified Admin ID number. */
  adminNumber: string
  /** Short role line under the handle on phones. */
  role: string
  /** Square image. An SVG, WebP or PNG with a transparent background looks best. */
  avatarSrc: string
  /** Tooltip / screen-reader label on the verified tick next to your name. */
  verifiedLabel: string
  email: string
  location: string
  /** Three short proof facts shown on phones under the Home lede. */
  stats: Stat[]
  displayName: { line1: string; line2: string }
  hero: {
    body: string
    portraitSrc: string
    portraitAlt: string
  }
  socials: SocialLink[]
}

export const profile: Profile = {
  name: 'Reynard Tanggo',
  firstName: 'Reynard',
  handle: '@reynardtanggo',
  adminNumber: 'HLA-Verified',
  role: 'GoHighLevel CRM Specialist & Administrative Virtual Assistant',
  avatarSrc: '/avatar.jpg',
  verifiedLabel: 'HighLevel Certified Admin & HLA Certified Builder',
  email: 'tanggoreynard@gmail.com',
  location: 'Philippines (GMT+8) · Available for U.S. Time Zones',
  // Pick any icon from https://phosphoricons.com and import it above.
  stats: [
    { value: 'HLA Cert', label: 'Automation Builder', Icon: SealCheck },
    { value: 'GHL & Admin', label: 'CRM Specialist', Icon: Briefcase },
    { value: 'GMT+8 / US', label: 'Global Coverage', Icon: Clock },
  ],
  // The intro types this line, then flies it into the Home headline.
  // Keep it short: two halves, 5-8 words total.
  displayName: { line1: 'Building CRM & Automation Systems.', line2: 'Streamlining Operations.' },
  hero: {
    body: 'Detail-oriented GoHighLevel CRM Specialist and Administrative Virtual Assistant building automated sales pipelines, lead follow-up systems, and structured backend operations.',
    portraitSrc: '/avatar.jpg',
    portraitAlt: 'Reynard Tanggo portrait',
  },
  socials: [
    { label: 'LinkedIn profile', href: 'https://linkedin.com', iconPath: '/icons/linkedin.svg' },
    { label: 'Email Reynard', href: 'mailto:tanggoreynard@gmail.com', iconPath: '/icons/gmail.svg' },
  ],
}
