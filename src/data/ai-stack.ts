/**
 * The systems tree shown in the Projects "systems" pop-up (and as chips on
 * Home and in the Projects bento card).
 *
 * Fully configured with Reynard Tanggo's GoHighLevel and Administrative VA systems.
 */

import {
  Sparkle,
  Robot,
  Article,
  UsersThree,
  Database,
  ChatCircleDots,
  FlowArrow,
  Timer,
  CheckCircle,
  FileText,
  Table,
} from '@/components/slab'
import type { Icon } from '@/components/slab'
import { profile } from '@/data/profile'

export type StackStatus = 'Live' | 'Internal' | 'Beta'

export type StackLogo = { src: string; name: string }

export type StackNode = {
  id: string
  name: string
  /** One plain sentence a client understands. */
  what: string
  /** Real stack / model / where it runs. Rendered small and muted. */
  stack?: string
  status?: StackStatus
  /** Phosphor glyph for the card's mark tile. Every node has one. */
  Icon: Icon
  logos?: StackLogo[]
  children?: StackNode[]
}

const GHL: StackLogo = { src: '/icons/gohighlevel.png', name: 'GoHighLevel' }
const GWS: StackLogo = { src: '/icons/googleworkspace.svg', name: 'Google Workspace' }
const OPENAI: StackLogo = { src: '/icons/openai.svg', name: 'ChatGPT' }

/** Single root: Reynard Tanggo. Branches are the core service categories. */
export const aiStack: StackNode = {
  id: 'root',
  Icon: Sparkle,
  name: profile.name,
  what: 'Certified GoHighLevel automation builder and detail-driven administrative virtual assistant delivering reliable client operations.',
  stack: 'GoHighLevel · Google Workspace · Excel · AI Tools',
  children: [
    {
      id: 'ghl-core',
      Icon: FlowArrow,
      name: 'GoHighLevel CRM & Automations',
      what: 'Full-funnel client acquisition pipelines, automated SMS/email sequences, and trigger-based invoicing.',
      children: [
        {
          id: 'sales-pipeline',
          Icon: UsersThree,
          logos: [GHL],
          name: '8-Stage Sales Pipeline',
          what: 'Visual opportunity tracking from New Lead to Closed Won with automated stage sync.',
          stack: 'GoHighLevel CRM · Opportunity Stages',
          status: 'Live',
        },
        {
          id: 'lead-nurture',
          Icon: ChatCircleDots,
          logos: [GHL],
          name: 'Lead Nurture & Reminders',
          what: 'Instant SMS response and multi-step discovery call reminders (24h & 20m before).',
          stack: 'GHL Workflows · SMS · Email',
          status: 'Live',
        },
        {
          id: 'invoice-engine',
          Icon: CheckCircle,
          logos: [GHL],
          name: 'Automated Invoice Follow-Up',
          what: 'Automated payment reminder notifications and stage-advancement sequences linked to CRM stages.',
          stack: 'GHL Invoicing · Payment Triggers',
          status: 'Live',
        },
        {
          id: 'cancellation-alert',
          Icon: Timer,
          logos: [GHL],
          name: 'Cancellation Fail-Safe',
          what: 'Real-time alert notifying the account owner and routing cancelled leads to recovery.',
          stack: 'GHL Workflows · Fail-Safe Logic',
          status: 'Live',
        },
      ],
    },
    {
      id: 'admin-ops',
      Icon: Database,
      name: 'Remote Operations & Data Hygiene',
      what: 'Executive virtual assistance, Google Workspace management, and structured data cleanliness.',
      children: [
        {
          id: 'google-workspace',
          Icon: Article,
          logos: [GWS],
          name: 'Google Workspace Operations',
          what: 'Daily email triage, Google Calendar scheduling, Docs documentation, and Drive filing.',
          stack: 'Sheets · Docs · Drive · Calendar · Gmail',
          status: 'Live',
        },
        {
          id: 'crm-hygiene',
          Icon: Table,
          logos: [GHL],
          name: 'CRM Schema & Smart Lists',
          what: '12 custom qualification fields (budget, industry, challenge) and tag segmentation.',
          stack: 'GHL Custom Fields · Tags · Deduplication',
          status: 'Live',
        },
        {
          id: 'excel-reporting',
          Icon: FileText,
          logos: [GWS],
          name: 'Excel Data & Documentation',
          what: 'Data entry, QA reporting, spreadsheet formulas, and process documentation SOPs.',
          stack: 'Microsoft Excel · SOP Creation',
          status: 'Live',
        },
        {
          id: 'ai-efficiency',
          Icon: Robot,
          logos: [OPENAI],
          name: 'AI-Powered Workflow Support',
          what: 'Prompt engineering in ChatGPT for customer communications, drafting, and task speed.',
          stack: 'ChatGPT · AI Tools · Productivity',
          status: 'Live',
        },
      ],
    },
  ],
}
