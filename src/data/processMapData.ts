export interface ProcessNode {
  id: string
  label: string
  type: 'trigger' | 'stage' | 'opp-check' | 'opp-action' | 'action' | 'decision' | 'manual' | 'end'
  channel?: 'sms' | 'email' | 'timer' | 'tag' | 'internal' | 'manual' | 'doc' | 'payment' | 'crm'
  timing?: string
  description?: string
  details?: string
}

export interface DecisionBranch {
  condition: string
  targetNodeId: string
  targetLabel: string
}

export interface PipelineStage {
  id: string
  number: string
  name: string
  trigger: ProcessNode
  stageNode: ProcessNode
  oppLookup: ProcessNode
  oppActions: {
    found: ProcessNode
    notFound: ProcessNode
  }
  actions: ProcessNode[]
  decision?: {
    node: ProcessNode
    branches: {
      yes: { targetLabel: string; endNodeId: string }
      no: { actions?: ProcessNode[]; targetLabel: string; endNodeId: string }
    }
  }
  endNodes: ProcessNode[]
}

export interface PipelineDefinition {
  id: string
  code: string
  title: string
  description: string
  stages: PipelineStage[]
}

export const MERMAID_PROCESS_MAP = `flowchart TD

classDef oppStage fill:#001f3f,color:#ffffff,stroke:#001f3f,font-weight:bold;
classDef trigger fill:#4a90d9,color:#ffffff,stroke:#4a90d9,font-weight:bold;
classDef endNode fill:#2ecc71,color:#ffffff,stroke:#27ae60,font-weight:bold;
classDef manualAction fill:#e67e22,color:#ffffff,stroke:#d35400,font-weight:bold;

%% =========================
%% SALES PIPELINE
%% =========================

subgraph S1["001 - Sales Pipeline"]

TR1(["⚡ Form Submitted"])
ST1["001 New Lead"]
FO1["Find Opportunity"]
UO1["Update Opportunity"]
CO1["Create Opportunity"]
A1["Tag Lead Source"]
A2["Welcome SMS"]
A3["Welcome Email"]
A4["Internal Notification"]
A5["Wait 1 Hour"]
D1{"Consultation Booked"}
A6["Reminder SMS"]
A7["Wait 2 Days"]
END1(["✔ Consultation Booked → Stage 002"])

TR2(["⚡ Customer Booked Appointment"])
ST2["002 Consultation Booked"]
FO2["Find Opportunity"]
UO2["Update Opportunity"]
CO2["Create Opportunity"]
A8["Confirmation SMS"]
A9["Confirmation Email"]
A10["Prep Instructions"]
A11["Wait Until 24 Hours"]
A12["Reminder SMS"]
A13["Wait Until 1 Hour"]
A14["Final Reminder"]
END2(["✔ Consultation Completed → Stage 003"])

TR3(["⚡ Pipeline Stage Changed"])
ST3["003 Consultation Completed"]
FO3["Find Opportunity"]
UO3["Update Opportunity"]
CO3["Create Opportunity"]
A15["Thank You SMS"]
A16["Resources Email"]
D2{"Ready To Enroll"}
END3(["✔ Client Enrolled → Stage 005"])
END4(["✔ Decision Pending → Stage 004"])

TR4(["⚡ Pipeline Stage Changed"])
ST4["004 Follow Up"]
FO4["Find Opportunity"]
UO4["Update Opportunity"]
CO4["Create Opportunity"]
A17["Success Stories"]
A18["Education Email"]
A19["Check In SMS"]
A20["Wait 3 Days"]
D3{"Enrolled"}
END5(["✔ Client Enrolled → Stage 005"])
END6(["✔ Closed Lost → Stage 007"])

TR5(["⚡ Opportunity Status Changed"])
ST5["005 Client Enrolled"]
FO5["Find Opportunity"]
UO5["Update Opportunity"]
CO5["Create Opportunity"]
A21["Welcome SMS"]
A22["Welcome Email"]
A23["Start Onboarding"]
END7(["✔ Move to Onboarding Pipeline"])

TR6(["⚡ Opportunity Status Changed"])
ST6["006 Active Client"]
FO6["Find Opportunity"]
UO6["Update Opportunity"]
CO6["Create Opportunity"]
A24["Weekly Check In"]
A25["Progress Reminder"]
A26["Milestone Message"]
A27["Review Request"]
END8(["✔ Coaching Continues"])

TR7(["⚡ Opportunity Status Changed"])
ST7["007 Closed Lost"]
FO7["Find Opportunity"]
UO7["Update Opportunity"]
CO7["Create Opportunity"]
A28["Add Lost Tag"]
A29["Start Reengagement"]
END9(["✔ Long Term Nurture"])

end

%% =========================
%% ONBOARDING PIPELINE
%% =========================

subgraph O1["002 - Client Onboarding"]

TR8(["⚡ Pipeline Stage Changed"])
ST8["001 New Client"]
FO8["Find Opportunity"]
UO8["Update Opportunity"]
CO8["Create Opportunity"]
A30["Send Intake Form"]
END10(["✔ Intake Complete → Stage 002"])

TR9(["⚡ Form Submitted"])
ST9["002 Intake Complete"]
FO9["Find Opportunity"]
UO9["Update Opportunity"]
CO9["Create Opportunity"]
A31["Send Agreement"]
END11(["✔ Agreement Signed → Stage 003"])

TR10(["⚡ Documents Signed"])
ST10["003 Agreement Signed"]
FO10["Find Opportunity"]
UO10["Update Opportunity"]
CO10["Create Opportunity"]
A32["Payment Request"]
END12(["✔ Payment Confirmed → Stage 004"])

TR11(["⚡ Payment Received"])
ST11["004 Payment Confirmed"]
FO11["Find Opportunity"]
UO11["Update Opportunity"]
CO11["Create Opportunity"]
A33["Book Onboarding"]
END13(["✔ Call Booked → Stage 005"])

TR12(["⚡ Customer Booked Appointment"])
ST12["005 Onboarding Call"]
FO12["Find Opportunity"]
UO12["Update Opportunity"]
CO12["Create Opportunity"]
A34["Call Reminder"]
M1["👤 Hold Call"]
END14(["✔ Setup Complete → Stage 006"])

TR13(["⚡ Pipeline Stage Changed"])
ST13["006 Program Setup"]
FO13["Find Opportunity"]
UO13["Update Opportunity"]
CO13["Create Opportunity"]
A35["Deliver Program"]
A36["Grant Resources"]
END15(["✔ Active Coaching"])

TR14(["⚡ Pipeline Stage Changed"])
ST14["007 Active Coaching"]
FO14["Find Opportunity"]
UO14["Update Opportunity"]
CO14["Create Opportunity"]
A37["Weekly Accountability"]
A38["Monthly Review"]
A39["Progress Survey"]
A40["Renewal Reminder"]
END16(["✔ Coaching Ongoing"])

end

%% Sales edges
TR1-->ST1
ST1-->FO1
FO1-->|Opp Found|UO1
FO1-->|Not Found|CO1
UO1-->A1-->A2-->A3-->A4-->A5-->D1
CO1-->A1
D1-->|Yes|END1
D1-->|No|A6-->A7-->END1

TR2-->ST2-->FO2
FO2-->|Opp Found|UO2
FO2-->|Not Found|CO2
UO2-->A8-->A9-->A10-->A11-->A12-->A13-->A14-->END2
CO2-->A8

TR3-->ST3-->FO3
FO3-->|Opp Found|UO3
FO3-->|Not Found|CO3
UO3-->A15-->A16-->D2
CO3-->A15
D2-->|Yes|END3
D2-->|No|END4

TR4-->ST4-->FO4
FO4-->|Opp Found|UO4
FO4-->|Not Found|CO4
UO4-->A17-->A18-->A19-->A20-->D3
CO4-->A17
D3-->|Yes|END5
D3-->|No|END6

TR5-->ST5-->FO5
FO5-->|Opp Found|UO5
FO5-->|Not Found|CO5
UO5-->A21-->A22-->A23-->END7
CO5-->A21

TR6-->ST6-->FO6
FO6-->|Opp Found|UO6
FO6-->|Not Found|CO6
UO6-->A24-->A25-->A26-->A27-->END8
CO6-->A24

TR7-->ST7-->FO7
FO7-->|Opp Found|UO7
FO7-->|Not Found|CO7
UO7-->A28-->A29-->END9
CO7-->A28

%% Onboarding edges
TR8-->ST8-->FO8
FO8-->|Opp Found|UO8
FO8-->|Not Found|CO8
UO8-->A30-->END10
CO8-->A30

TR9-->ST9-->FO9
FO9-->|Opp Found|UO9
FO9-->|Not Found|CO9
UO9-->A31-->END11
CO9-->A31

TR10-->ST10-->FO10
FO10-->|Opp Found|UO10
FO10-->|Not Found|CO10
UO10-->A32-->END12
CO10-->A32

TR11-->ST11-->FO11
FO11-->|Opp Found|UO11
FO11-->|Not Found|CO11
UO11-->A33-->END13
CO11-->A33

TR12-->ST12-->FO12
FO12-->|Opp Found|UO12
FO12-->|Not Found|CO12
UO12-->A34-->M1-->END14
CO12-->A34

TR13-->ST13-->FO13
FO13-->|Opp Found|UO13
FO13-->|Not Found|CO13
UO13-->A35-->A36-->END15
CO13-->A35

TR14-->ST14-->FO14
FO14-->|Opp Found|UO14
FO14-->|Not Found|CO14
UO14-->A37-->A38-->A39-->A40-->END16
CO14-->A37

%% Classes
class TR1,TR2,TR3,TR4,TR5,TR6,TR7,TR8,TR9,TR10,TR11,TR12,TR13,TR14 trigger;
class ST1,ST2,ST3,ST4,ST5,ST6,ST7,ST8,ST9,ST10,ST11,ST12,ST13,ST14 oppStage;
class END1,END2,END3,END4,END5,END6,END7,END8,END9,END10,END11,END12,END13,END14,END15,END16 endNode;
class M1 manualAction;`

export const SALES_PIPELINE: PipelineDefinition = {
  id: 'sales',
  code: '001',
  title: '001 - Coaching & Client Enrollment Pipeline',
  description: 'Full-funnel coaching enrollment automation: application intake, assessment reminders, proposal delivery, and transition to active training.',
  stages: [
    {
      id: 'sales-st1',
      number: '001',
      name: 'Strategy Intake Received',
      trigger: {
        id: 'TR1',
        label: '⚡ Application Submitted',
        type: 'trigger',
        description: 'Coaching questionnaire and strategy intake submitted by athlete/client.',
        details: 'Captures athletic background, current training goals, email, and phone.',
      },
      stageNode: {
        id: 'ST1',
        label: '001 Strategy Intake Received',
        type: 'stage',
        description: 'Sets contact status to Strategy Intake in coaching pipeline.',
      },
      oppLookup: {
        id: 'FO1',
        label: 'Find Opportunity',
        type: 'opp-check',
        description: 'Idempotency check: searches active pipeline for existing deal.',
      },
      oppActions: {
        found: {
          id: 'UO1',
          label: 'Update Opportunity',
          type: 'opp-action',
          description: 'Updates stage to 001 New Lead and refreshes contact timestamps.',
        },
        notFound: {
          id: 'CO1',
          label: 'Create Opportunity',
          type: 'opp-action',
          description: 'Initializes new deal record with source attribution.',
        },
      },
      actions: [
        { id: 'A1', label: 'Tag Lead Source', type: 'action', channel: 'tag', details: 'Applies source tag (e.g. meta-ads, organic-web, direct).' },
        { id: 'A2', label: 'Welcome SMS', type: 'action', channel: 'sms', timing: '< 60 seconds', details: 'Automated greeting message with personalized booking link.' },
        { id: 'A3', label: 'Welcome Email', type: 'action', channel: 'email', timing: 'Instant', details: 'Overview deck, company intro, and direct scheduler.' },
        { id: 'A4', label: 'Internal Notification', type: 'action', channel: 'internal', details: 'Instant alert dispatched to sales rep via Slack/SMS.' },
        { id: 'A5', label: 'Wait 1 Hour', type: 'action', channel: 'timer', timing: '60 minutes', details: 'Buffer delay allowing prospect to complete self-booking.' },
      ],
      decision: {
        node: {
          id: 'D1',
          label: 'Consultation Booked?',
          type: 'decision',
          description: 'Checks CRM appointment status for confirmed slot.',
        },
        branches: {
          yes: {
            targetLabel: 'Consultation Booked',
            endNodeId: 'END1',
          },
          no: {
            actions: [
              { id: 'A6', label: 'Reminder SMS', type: 'action', channel: 'sms', details: 'Friendly nudge asking if they need help picking a time slot.' },
              { id: 'A7', label: 'Wait 2 Days', type: 'action', channel: 'timer', timing: '48 hours', details: 'Grace period before recurring re-engagement.' },
            ],
            targetLabel: 'Consultation Booked',
            endNodeId: 'END1',
          },
        },
      },
      endNodes: [
        {
          id: 'END1',
          label: '✔ Consultation Booked → Stage 002',
          type: 'end',
          description: 'Handoff target: advances deal to Stage 002 Consultation Booked.',
        },
      ],
    },
    {
      id: 'sales-st2',
      number: '002',
      name: 'Consultation Call Confirmed',
      trigger: {
        id: 'TR2',
        label: '⚡ Consultation Call Confirmed',
        type: 'trigger',
        description: 'Calendar widget trigger when coaching consultation is locked in.',
      },
      stageNode: {
        id: 'ST2',
        label: '002 Consultation Call Confirmed',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO2',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO2', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO2', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A8', label: 'Confirmation SMS', type: 'action', channel: 'sms', timing: 'Instant', details: 'Instant SMS with meeting link and calendar invite.' },
        { id: 'A9', label: 'Confirmation Email', type: 'action', channel: 'email', timing: 'Instant', details: 'Calendar .ics file, meeting agenda, and zoom coordinates.' },
        { id: 'A10', label: 'Prep Instructions', type: 'action', channel: 'email', details: 'Coaching overview packet and questions to review prior to the call.' },
        { id: 'A11', label: 'Wait Until 24 Hours', type: 'action', channel: 'timer', timing: 'T - 24h', details: 'Smart dynamic wait until exactly 24 hours prior to appointment.' },
        { id: 'A12', label: 'Reminder SMS', type: 'action', channel: 'sms', timing: '24h before', details: '24-hour reminder asking prospect to reply "YES" to confirm.' },
        { id: 'A13', label: 'Wait Until 1 Hour', type: 'action', channel: 'timer', timing: 'T - 1h', details: 'Dynamic wait until 60 minutes before start time.' },
        { id: 'A14', label: 'Final Reminder', type: 'action', channel: 'sms', timing: '1h before', details: 'Final alert with direct join link to maximize show-up rates.' },
      ],
      endNodes: [
        {
          id: 'END2',
          label: '✔ Assessment Completed → Stage 003',
          type: 'end',
          description: 'Consultation attended: moved to assessment evaluation stage.',
        },
      ],
    },
    {
      id: 'sales-st3',
      number: '003',
      name: 'Assessment Completed',
      trigger: {
        id: 'TR3',
        label: '⚡ Pipeline Stage Changed',
        type: 'trigger',
        description: 'Coach marks strategy call and assessment as completed.',
      },
      stageNode: {
        id: 'ST3',
        label: '003 Assessment Completed',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO3',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO3', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO3', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A15', label: 'Thank You SMS', type: 'action', channel: 'sms', details: 'Thank you text from the head coach summarizing next steps.' },
        { id: 'A16', label: 'Resources Email', type: 'action', channel: 'email', details: 'Tailored training roadmap, pricing options, and enrollment deck.' },
      ],
      decision: {
        node: {
          id: 'D2',
          label: 'Ready To Enroll?',
          type: 'decision',
          description: 'Did athlete/client agree to enroll during the assessment?',
        },
        branches: {
          yes: { targetLabel: 'Ready to Enroll', endNodeId: 'END3' },
          no: { targetLabel: 'Needs Time to Decide', endNodeId: 'END4' },
        },
      },
      endNodes: [
        { id: 'END3', label: '✔ New Client Enrolled → Stage 005', type: 'end' },
        { id: 'END4', label: '✔ Proposal Follow-Up → Stage 004', type: 'end' },
      ],
    },
    {
      id: 'sales-st4',
      number: '004',
      name: 'Program Proposal Follow-Up',
      trigger: {
        id: 'TR4',
        label: '⚡ Pipeline Stage Changed',
        type: 'trigger',
        description: 'Moved into structured coaching proposal follow-up.',
      },
      stageNode: {
        id: 'ST4',
        label: '004 Program Proposal Follow-Up',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO4',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO4', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO4', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A17', label: 'Success Stories', type: 'action', channel: 'email', details: 'High-trust case studies and video transformations from past coaching clients.' },
        { id: 'A18', label: 'Education Email', type: 'action', channel: 'email', details: 'Framework breakdown addressing common onboarding & commitment questions.' },
        { id: 'A19', label: 'Check In SMS', type: 'action', channel: 'sms', details: 'Direct coach check-in: "Any questions on the training roadmap?"' },
        { id: 'A20', label: 'Wait 3 Days', type: 'action', channel: 'timer', timing: '72 hours', details: 'Final decision buffer.' },
      ],
      decision: {
        node: {
          id: 'D3',
          label: 'Enrolled?',
          type: 'decision',
          description: 'Final close verification after follow-up period.',
        },
        branches: {
          yes: { targetLabel: 'Enrolled', endNodeId: 'END5' },
          no: { targetLabel: 'Not Ready', endNodeId: 'END6' },
        },
      },
      endNodes: [
        { id: 'END5', label: '✔ New Client Enrolled → Stage 005', type: 'end' },
        { id: 'END6', label: '✔ Archived / Nurture → Stage 007', type: 'end' },
      ],
    },
    {
      id: 'sales-st5',
      number: '005',
      name: 'New Client Enrolled (Won)',
      trigger: {
        id: 'TR5',
        label: '⚡ Opportunity Status Changed',
        type: 'trigger',
        description: 'Opportunity marked WON or moved to Enrolled.',
      },
      stageNode: {
        id: 'ST5',
        label: '005 New Client Enrolled (Won)',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO5',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO5', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO5', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A21', label: 'Welcome SMS', type: 'action', channel: 'sms', details: 'Warm welcome message confirming coaching kickoff.' },
        { id: 'A22', label: 'Welcome Email', type: 'action', channel: 'email', details: 'Program welcome packet, portal credentials, and next steps roadmap.' },
        { id: 'A23', label: 'Start Onboarding', type: 'action', channel: 'crm', details: 'Triggers automated creation of record in Pipeline 002 Client Onboarding.' },
      ],
      endNodes: [
        { id: 'END7', label: '✔ Move to Onboarding Pipeline', type: 'end', description: 'Cross-pipeline handoff into 002 Client Onboarding.' },
      ],
    },
    {
      id: 'sales-st6',
      number: '006',
      name: 'Active Coaching & Training',
      trigger: {
        id: 'TR6',
        label: '⚡ Opportunity Status Changed',
        type: 'trigger',
        description: 'Client is actively receiving ongoing coaching & programming.',
      },
      stageNode: {
        id: 'ST6',
        label: '006 Active Coaching & Training',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO6',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO6', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO6', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A24', label: 'Weekly Check In', type: 'action', channel: 'sms', details: 'Automated weekly prompt for training logs, nutrition, & blockers.' },
        { id: 'A25', label: 'Progress Reminder', type: 'action', channel: 'email', details: 'Bi-weekly metric and PR tracking review.' },
        { id: 'A26', label: 'Milestone Message', type: 'action', channel: 'sms', details: 'Celebration SMS when key performance PRs are achieved.' },
        { id: 'A27', label: 'Review Request', type: 'action', channel: 'email', details: 'Triggered 30 days into program for testimonial & Google review.' },
      ],
      endNodes: [
        { id: 'END8', label: '✔ Coaching Continues', type: 'end' },
      ],
    },
    {
      id: 'sales-st7',
      number: '007',
      name: 'Archived / Nurture List',
      trigger: {
        id: 'TR7',
        label: '⚡ Opportunity Status Changed',
        type: 'trigger',
        description: 'Prospect declined, timing not right, or unresponsive.',
      },
      stageNode: {
        id: 'ST7',
        label: '007 Archived / Nurture List',
        type: 'stage',
      },
      oppLookup: {
        id: 'FO7',
        label: 'Find Opportunity',
        type: 'opp-check',
      },
      oppActions: {
        found: { id: 'UO7', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO7', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A28', label: 'Add Lost Tag', type: 'action', channel: 'tag', details: 'Applies lost-coaching tag and unenrolls from active reminder sequences.' },
        { id: 'A29', label: 'Start Reengagement', type: 'action', channel: 'email', details: 'Enrolls contact into monthly coaching newsletter and 90-day revive campaign.' },
      ],
      endNodes: [
        { id: 'END9', label: '✔ Long Term Nurture', type: 'end' },
      ],
    },
  ],
}

export const ONBOARDING_PIPELINE: PipelineDefinition = {
  id: 'onboarding',
  code: '002',
  title: '002 - Client Onboarding Pipeline',
  description: 'Post-sale onboarding and client activation: intake form submission, coaching agreement e-signature, retainer collection, kickoff call, and transition to active coaching.',
  stages: [
    {
      id: 'onb-st1',
      number: '001',
      name: 'Client Intake Form Dispatched',
      trigger: {
        id: 'TR8',
        label: '⚡ Pipeline Stage Changed',
        type: 'trigger',
        description: 'New opportunity initialized from Sales Pipeline 005.',
      },
      stageNode: {
        id: 'ST8',
        label: '001 Client Intake Form Dispatched',
        type: 'stage',
      },
      oppLookup: { id: 'FO8', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO8', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO8', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A30', label: 'Send Intake Form', type: 'action', channel: 'doc', details: 'Dispatches detailed client onboarding questionnaire & asset checklist.' },
      ],
      endNodes: [
        { id: 'END10', label: '✔ Intake Completed → Stage 002', type: 'end' },
      ],
    },
    {
      id: 'onb-st2',
      number: '002',
      name: 'Intake Completed & Review',
      trigger: {
        id: 'TR9',
        label: '⚡ Form Submitted',
        type: 'trigger',
        description: 'Client completes and submits onboarding intake form.',
      },
      stageNode: {
        id: 'ST9',
        label: '002 Intake Completed & Review',
        type: 'stage',
      },
      oppLookup: { id: 'FO9', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO9', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO9', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A31', label: 'Send Agreement', type: 'action', channel: 'doc', details: 'Auto-generates coaching agreement with merged client details for e-signature.' },
      ],
      endNodes: [
        { id: 'END11', label: '✔ Agreement Signed → Stage 003', type: 'end' },
      ],
    },
    {
      id: 'onb-st3',
      number: '003',
      name: 'Coaching Agreement Signed',
      trigger: {
        id: 'TR10',
        label: '⚡ Documents Signed',
        type: 'trigger',
        description: 'Webhook triggers when e-sign coaching agreement is executed.',
      },
      stageNode: {
        id: 'ST10',
        label: '003 Coaching Agreement Signed',
        type: 'stage',
      },
      oppLookup: { id: 'FO10', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO10', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO10', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A32', label: 'Payment Request', type: 'action', channel: 'payment', details: 'Dispatches invoice and Stripe payment portal link.' },
      ],
      endNodes: [
        { id: 'END12', label: '✔ Payment Confirmed → Stage 004', type: 'end' },
      ],
    },
    {
      id: 'onb-st4',
      number: '004',
      name: 'Payment & Retainer Confirmed',
      trigger: {
        id: 'TR11',
        label: '⚡ Payment Received',
        type: 'trigger',
        description: 'Stripe webhook triggers upon successful payment authorization.',
      },
      stageNode: {
        id: 'ST11',
        label: '004 Payment & Retainer Confirmed',
        type: 'stage',
      },
      oppLookup: { id: 'FO11', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO11', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO11', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A33', label: 'Book Onboarding', type: 'action', channel: 'sms', details: 'Provides private VIP calendar link for 60-min onboarding kickoff call.' },
      ],
      endNodes: [
        { id: 'END13', label: '✔ Call Booked → Stage 005', type: 'end' },
      ],
    },
    {
      id: 'onb-st5',
      number: '005',
      name: 'Kickoff Call Scheduled (Hold Call)',
      trigger: {
        id: 'TR12',
        label: '⚡ Customer Booked Appointment',
        type: 'trigger',
        description: 'Kickoff call locked into coach calendar.',
      },
      stageNode: {
        id: 'ST12',
        label: '005 Kickoff Call Scheduled (Hold Call)',
        type: 'stage',
      },
      oppLookup: { id: 'FO12', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO12', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO12', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A34', label: 'Call Reminder', type: 'action', channel: 'sms', details: 'Automated 24h & 1h meeting alerts with Zoom URL.' },
        { id: 'M1', label: '👤 Hold Call', type: 'manual', channel: 'manual', details: 'Human task: Head Coach conducts 1-on-1 kickoff session.' },
      ],
      endNodes: [
        { id: 'END14', label: '✔ Setup Complete → Stage 006', type: 'end' },
      ],
    },
    {
      id: 'onb-st6',
      number: '006',
      name: 'Portal Setup & Program Delivery',
      trigger: {
        id: 'TR13',
        label: '⚡ Pipeline Stage Changed',
        type: 'trigger',
        description: 'Coach confirms kickoff completion in CRM.',
      },
      stageNode: {
        id: 'ST13',
        label: '006 Portal Setup & Program Delivery',
        type: 'stage',
      },
      oppLookup: { id: 'FO13', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO13', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO13', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A35', label: 'Deliver Program', type: 'action', channel: 'doc', details: 'Provisions client workspace, training dashboard logins, and workout templates.' },
        { id: 'A36', label: 'Grant Resources', type: 'action', channel: 'crm', details: 'Unlocks member portal access and private coaching community channel.' },
      ],
      endNodes: [
        { id: 'END15', label: '✔ Active Coaching', type: 'end' },
      ],
    },
    {
      id: 'onb-st7',
      number: '007',
      name: 'Active Coaching Ongoing',
      trigger: {
        id: 'TR14',
        label: '⚡ Pipeline Stage Changed',
        type: 'trigger',
        description: 'Transitioned to ongoing retainer / coaching phase.',
      },
      stageNode: {
        id: 'ST14',
        label: '007 Active Coaching Ongoing',
        type: 'stage',
      },
      oppLookup: { id: 'FO14', label: 'Find Opportunity', type: 'opp-check' },
      oppActions: {
        found: { id: 'UO14', label: 'Update Opportunity', type: 'opp-action' },
        notFound: { id: 'CO14', label: 'Create Opportunity', type: 'opp-action' },
      },
      actions: [
        { id: 'A37', label: 'Weekly Accountability', type: 'action', channel: 'sms', details: 'Weekly check-in bot prompting for nutrition & training execution logs.' },
        { id: 'A38', label: 'Monthly Review', type: 'action', channel: 'email', details: 'Monthly KPI performance report & strategy call scheduler.' },
        { id: 'A39', label: 'Progress Survey', type: 'action', channel: 'doc', details: 'Quarterly satisfaction and progress assessment.' },
        { id: 'A40', label: 'Renewal Reminder', type: 'action', channel: 'email', details: 'Automated 45-day coaching contract renewal notice.' },
      ],
      endNodes: [
        { id: 'END16', label: '✔ Coaching Ongoing', type: 'end' },
      ],
    },
  ],
}
