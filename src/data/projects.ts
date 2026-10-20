export type AppStat = { value: string; label: string }

export type AppProject = {
  name: string
  tagline: string
  description: string
  /** Optional - omit for gradient placeholder cards */
  imageSrc?: string
  /** CSS object-position override. Defaults to 'top center'. */
  imagePosition?: string
  /** External brand color - not a site token. Passed via --app-color inline prop. */
  accentColor: string
  stats: AppStat[]
  badge: string
}

/** @deprecated use AppProject */
export type MobileApp = AppProject

/**
 * GoHighLevel Sandbox Builds & Architecture Prototypes
 */
export const mobileApps: MobileApp[] = [
  {
    name: '8-Stage Sales Pipeline Prototype',
    tagline: 'Structured opportunity pipeline from New Lead to Closed Won.',
    description: 'Designed and configured complete CRM pipeline stages inside a GoHighLevel sandbox, covering lead qualification, discovery call scheduling, proposal delivery, and onboarding triggers.',
    imageSrc: '/proof/crm-opportunities-pipeline.png',
    imagePosition: 'center 15%',
    accentColor: '#5B4FE0',
    stats: [
      { value: '8 Stages', label: 'Pipeline' },
      { value: 'GHL Sandbox', label: 'Environment' },
      { value: 'Verified', label: 'Triggers' },
    ],
    badge: 'Sandbox Prototype',
  },
  {
    name: 'Automated Lead Nurture & Messaging Sequences',
    tagline: 'Instant lead response logic with multi-channel SMS & email triggers.',
    description: 'Configured workflow templates demonstrating sub-60-second automated response, appointment confirmation reminders, and structured follow-up cadences.',
    imageSrc: '/proof/live-client-conversation.png',
    imagePosition: 'center 15%',
    accentColor: '#0FB6D6',
    stats: [
      { value: '< 60s', label: 'Response Logic' },
      { value: 'SMS / Email', label: 'Channels' },
      { value: 'Verified', label: 'Logic Tested' },
    ],
    badge: 'Workflow Prototype',
  },
  {
    name: 'Full-Funnel Sales Process Map & Architecture',
    tagline: 'Logic flowchart mapping lead intake through discovery and onboarding.',
    description: 'Detailed process architecture diagram connecting webhooks, conditional branches, calendar scheduling rules, and 12 custom CRM fields.',
    imageSrc: '/proof/sales-process-map.png',
    imagePosition: 'center 25%',
    accentColor: '#16A34A',
    stats: [
      { value: 'End-to-End', label: 'Process Map' },
      { value: '12 Fields', label: 'Data Model' },
      { value: 'GHL', label: 'Architecture' },
    ],
    badge: 'Architecture Blueprint',
  },
]

