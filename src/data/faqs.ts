export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What services do you specialize in?',
    a: 'I specialize in GoHighLevel CRM architecture (pipelines, missed-call text-backs, automated SMS/email follow-ups, and funnels) along with executive administrative support using Google Workspace and AI tools.',
  },
  {
    q: 'What time zones do you support?',
    a: 'I am based in the Philippines (GMT+8) and provide flexible, dedicated availability for U.S. time zones (EST, CST, PST) and international teams.',
  },
  {
    q: 'Are you certified in GoHighLevel?',
    a: 'Yes! I am an official HighLevel Certified Administrator, certified directly by HighLevel for platform architecture, sub-account setup, and agency operations. Additionally, I am a graduate of the intensive HighLevel Accelerator (HLA) course, with specialized training in end-to-end CRM pipelines, custom values, triggers, and client onboarding workflows.',
  },
  {
    q: 'How do you handle CRM data quality?',
    a: 'Coming from an engineering and government documentation background, I enforce strict data deduplication, standardized tagging conventions, and custom field validation to ensure your CRM stays clean.',
  },
  {
    q: 'How fast can you start?',
    a: 'I can typically start onboarding or begin project sprints within 24 to 48 hours after our initial workflow alignment.',
  },
]
