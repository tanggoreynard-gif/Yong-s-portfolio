import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Lightning,
  CheckCircle,
  ArrowDown,
  Clock,
  ChatText,
  EnvelopeSimple,
  Bell,
  Tag,
  FileText,
  User,
  CreditCard,
  Copy,
  Check,
  MagnifyingGlassPlus,
  MagnifyingGlassMinus,
  ArrowCounterClockwise,
  Code,
  TreeStructure,
  ShieldCheck,
  X,
  ArrowRight,
  Sparkle,
} from '@/components/slab'
import {
  ProcessNode,
  PipelineDefinition,
  PipelineStage,
  SALES_PIPELINE,
  ONBOARDING_PIPELINE,
  MERMAID_PROCESS_MAP,
} from '@/data/processMapData'

/**
 * Returns a contextual Phosphor icon based on action channel / type
 */
function getActionIcon(node: ProcessNode) {
  if (node.channel === 'sms') return <ChatText size={14} weight="bold" />
  if (node.channel === 'email') return <EnvelopeSimple size={14} weight="bold" />
  if (node.channel === 'timer') return <Clock size={14} weight="bold" />
  if (node.channel === 'tag') return <Tag size={14} weight="bold" />
  if (node.channel === 'internal') return <Bell size={14} weight="bold" />
  if (node.channel === 'doc') return <FileText size={14} weight="bold" />
  if (node.channel === 'payment') return <CreditCard size={14} weight="bold" />
  if (node.type === 'manual') return <User size={14} weight="bold" />
  return <Sparkle size={14} weight="bold" />
}

export default function ProcessMapExplorer() {
  const [activeTab, setActiveTab] = useState<'sales' | 'onboarding' | 'dual'>('sales')
  const [viewMode, setViewMode] = useState<'canvas' | 'code'>('canvas')
  const [zoom, setZoom] = useState<number>(1)
  const [inspectedNode, setInspectedNode] = useState<{ node: ProcessNode; stageName: string } | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const [activeStageId, setActiveStageId] = useState<string>('')

  const viewportRef = useRef<HTMLDivElement>(null)

  // Zoom controls
  const handleZoomIn = () => setZoom((z) => Math.min(Number((z + 0.1).toFixed(2)), 1.3))
  const handleZoomOut = () => setZoom((z) => Math.max(Number((z - 0.1).toFixed(2)), 0.65))
  const handleResetZoom = () => setZoom(1)

  // Copy Mermaid code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(MERMAID_PROCESS_MAP)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  // Smooth scroll to a specific stage column
  const scrollToStage = (stageId: string) => {
    setActiveStageId(stageId)
    const el = document.getElementById(`stage-col-${stageId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  // Keyboard escape for inspector modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedNode(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const currentPipeline: PipelineDefinition =
    activeTab === 'onboarding' ? ONBOARDING_PIPELINE : SALES_PIPELINE

  return (
    <div className="pme" id="process-map-explorer">
      {/* ---------- Header / Toolbar ---------- */}
      <div className="pme__top">
        <div className="pme__info">
          <div className="pme__title-row">
            <span className="pme__badge">
              <ShieldCheck size={13} weight="bold" />
              GoHighLevel Engine
            </span>
            <h3 className="pme__title">Multi-Pipeline Automation Architecture</h3>
          </div>
          <p className="pme__desc">
            Production flowchart mapping end-to-end CRM lead capture, idempotent opportunity routing, multi-channel nurture, and post-sale onboarding.
          </p>
        </div>

        <div className="pme__actions">
          {/* Tabs */}
          <div className="pme__tabs" role="tablist" aria-label="Pipeline selector">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'sales'}
              className={`pme__tab ${activeTab === 'sales' ? 'pme__tab--active' : ''}`}
              onClick={() => {
                setActiveTab('sales')
                setViewMode('canvas')
              }}
            >
              <TreeStructure size={14} weight="bold" />
              001 · Sales Pipeline
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'onboarding'}
              className={`pme__tab ${activeTab === 'onboarding' ? 'pme__tab--active' : ''}`}
              onClick={() => {
                setActiveTab('onboarding')
                setViewMode('canvas')
              }}
            >
              <CheckCircle size={14} weight="bold" />
              002 · Client Onboarding
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'dual'}
              className={`pme__tab ${activeTab === 'dual' ? 'pme__tab--active' : ''}`}
              onClick={() => {
                setActiveTab('dual')
                setViewMode('canvas')
              }}
            >
              <Sparkle size={14} weight="bold" />
              Dual-Pipeline Map
            </button>
          </div>

          {/* View Toggle */}
          <button
            type="button"
            className={`pme__btn ${viewMode === 'code' ? 'pme__btn--accent' : ''}`}
            onClick={() => setViewMode((m) => (m === 'canvas' ? 'code' : 'canvas'))}
            title="Toggle between Interactive Canvas and Mermaid Code"
          >
            <Code size={14} weight="bold" />
            {viewMode === 'canvas' ? 'View Mermaid Code' : 'View Visual Flow'}
          </button>

          {/* Copy button */}
          <button
            type="button"
            className="pme__btn"
            onClick={handleCopyCode}
            title="Copy full Mermaid flowchart code to clipboard"
          >
            {copied ? (
              <>
                <Check size={14} weight="bold" style={{ color: '#4ade80' }} />
                <span style={{ color: '#4ade80' }}>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} weight="bold" />
                Copy Code
              </>
            )}
          </button>

          {/* Zoom controls (only active in canvas mode) */}
          {viewMode === 'canvas' && (
            <div style={{ display: 'inline-flex', gap: '4px' }}>
              <button
                type="button"
                className="pme__btn"
                onClick={handleZoomOut}
                title="Zoom Out"
                disabled={zoom <= 0.65}
              >
                <MagnifyingGlassMinus size={14} weight="bold" />
              </button>
              <button
                type="button"
                className="pme__btn"
                onClick={handleResetZoom}
                title="Reset Zoom to 100%"
              >
                <ArrowCounterClockwise size={14} weight="bold" />
                <span style={{ fontSize: '11px' }}>{Math.round(zoom * 100)}%</span>
              </button>
              <button
                type="button"
                className="pme__btn"
                onClick={handleZoomIn}
                title="Zoom In"
                disabled={zoom >= 1.3}
              >
                <MagnifyingGlassPlus size={14} weight="bold" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---------- Quick Stage Filter Pills ---------- */}
      {viewMode === 'canvas' && activeTab !== 'dual' && (
        <div className="pme__stage-nav" aria-label="Jump to pipeline stage">
          <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, paddingRight: '4px' }}>
            STAGES:
          </span>
          {currentPipeline.stages.map((st) => (
            <button
              key={st.id}
              type="button"
              className={`pme__stage-pill ${activeStageId === st.id ? 'pme__stage-pill--active' : ''}`}
              onClick={() => scrollToStage(st.id)}
            >
              <span className="pme__stage-pill-num">{st.number}</span>
              {st.name}
            </button>
          ))}
        </div>
      )}

      {/* ---------- Visual Canvas Mode ---------- */}
      {viewMode === 'canvas' ? (
        <div className="pme__viewport" ref={viewportRef}>
          <div
            className="pme__canvas"
            style={{
              transform: `scale(${zoom})`,
            }}
          >
            {activeTab === 'dual' ? (
              // Dual side-by-side view
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span className="pme__badge" style={{ background: '#001f3f', borderColor: '#4a90d9', color: '#60a5fa' }}>
                      Pipeline 001
                    </span>
                    <h4 style={{ margin: 0, color: '#ffffff', fontSize: '16px' }}>001 - Sales Pipeline (7 Stages)</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {SALES_PIPELINE.stages.map((stage) => (
                      <StageColumn
                        key={stage.id}
                        stage={stage}
                        onInspect={(node) => setInspectedNode({ node, stageName: stage.name })}
                      />
                    ))}
                  </div>
                </div>

                {/* Pipeline Handoff Bridge */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 20px',
                    background: 'linear-gradient(90deg, rgba(74, 144, 217, 0.15), rgba(46, 204, 113, 0.15))',
                    border: '1px solid rgba(74, 144, 217, 0.3)',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                    fontWeight: 600,
                  }}
                >
                  <Lightning size={16} weight="fill" style={{ color: '#60a5fa' }} />
                  <span>AUTOMATED HANDOFF: Sales Stage 005 (Client Enrolled)</span>
                  <ArrowRight size={14} weight="bold" style={{ color: '#2ecc71' }} />
                  <span>Initializes Onboarding Pipeline Stage 001 (New Client)</span>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <span className="pme__badge" style={{ background: '#14532d', borderColor: '#22c55e', color: '#4ade80' }}>
                      Pipeline 002
                    </span>
                    <h4 style={{ margin: 0, color: '#ffffff', fontSize: '16px' }}>002 - Client Onboarding (7 Stages)</h4>
                  </div>
                  <div style={{ display: 'flex', gap: '20px' }}>
                    {ONBOARDING_PIPELINE.stages.map((stage) => (
                      <StageColumn
                        key={stage.id}
                        stage={stage}
                        onInspect={(node) => setInspectedNode({ node, stageName: stage.name })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Single Pipeline View (Sales or Onboarding)
              currentPipeline.stages.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  onInspect={(node) => setInspectedNode({ node, stageName: stage.name })}
                />
              ))
            )}
          </div>
        </div>
      ) : (
        /* ---------- Mermaid Code View ---------- */
        <div className="pme__code-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              Mermaid 10.0+ Flowchart Source Definition
            </span>
            <button
              type="button"
              className="pme__btn"
              onClick={handleCopyCode}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
          <pre className="pme__code-pre">
            <code>{MERMAID_PROCESS_MAP}</code>
          </pre>
        </div>
      )}

      {/* ---------- Node Details Inspector Modal ---------- */}
      {inspectedNode &&
        createPortal(
          <div className="pme__modal-backdrop" onClick={() => setInspectedNode(null)}>
            <div
              className="pme__modal"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                className="pme__modal-close"
                onClick={() => setInspectedNode(null)}
                aria-label="Close inspector"
              >
                <X size={16} weight="bold" />
              </button>

              <div className="pme__modal-header">
                <span className="pme__modal-id">NODE_ID: {inspectedNode.node.id}</span>
                <h4 className="pme__modal-title">{inspectedNode.node.label}</h4>
                <span style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 600 }}>
                  Associated Stage: {inspectedNode.stageName}
                </span>
              </div>

              <div className="pme__modal-body">
                {inspectedNode.node.description && (
                  <div className="pme__modal-field">
                    <span className="pme__modal-label">Execution Purpose</span>
                    <span className="pme__modal-val">{inspectedNode.node.description}</span>
                  </div>
                )}

                {inspectedNode.node.details && (
                  <div className="pme__modal-field">
                    <span className="pme__modal-label">Configuration & Payload</span>
                    <span className="pme__modal-val">{inspectedNode.node.details}</span>
                  </div>
                )}

                <div className="pme__modal-field">
                  <span className="pme__modal-label">Node Class / Category</span>
                  <span className="pme__modal-val" style={{ textTransform: 'capitalize' }}>
                    {inspectedNode.node.type === 'trigger' && '⚡ Workflow Trigger Event'}
                    {inspectedNode.node.type === 'stage' && '📁 Opportunity Pipeline Stage'}
                    {inspectedNode.node.type === 'opp-check' && '🔍 Idempotent Opportunity Lookup'}
                    {inspectedNode.node.type === 'opp-action' && '⚙️ Opportunity Create / Update Action'}
                    {inspectedNode.node.type === 'action' && '🚀 Automated Multi-Channel Action'}
                    {inspectedNode.node.type === 'manual' && '👤 Human-in-the-Loop Manual Task'}
                    {inspectedNode.node.type === 'decision' && '⚖️ Conditional Decision Split'}
                    {inspectedNode.node.type === 'end' && '✔ Stage Terminal Goal & Pipeline Advance'}
                  </span>
                </div>

                {inspectedNode.node.timing && (
                  <div className="pme__modal-field">
                    <span className="pme__modal-label">Trigger Timing / Delay</span>
                    <span className="pme__modal-val">{inspectedNode.node.timing}</span>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}

/**
 * Individual Column representing a single Pipeline Stage
 */
function StageColumn({
  stage,
  onInspect,
}: {
  stage: PipelineStage
  onInspect: (node: ProcessNode) => void
}) {
  return (
    <div className="pme__col" id={`stage-col-${stage.id}`}>
      {/* Column Header */}
      <div className="pme__col-head">
        <span className="pme__col-stage-tag">Stage {stage.number}</span>
        <h5 className="pme__col-title" title={stage.name}>
          {stage.name}
        </h5>
      </div>

      {/* 1. Trigger Node */}
      <div
        className="pme__node-trigger"
        onClick={() => onInspect(stage.trigger)}
        title="Click to inspect trigger event"
      >
        <Lightning size={14} weight="fill" style={{ color: '#fbbf24' }} />
        <span>{stage.trigger.label}</span>
      </div>

      <div className="pme__flow-arrow">
        <ArrowDown size={14} weight="bold" />
      </div>

      {/* 2. Opportunity Stage Node */}
      <div
        className="pme__node-stage"
        onClick={() => onInspect(stage.stageNode)}
        title="Click to inspect CRM stage"
      >
        <span>{stage.stageNode.label}</span>
      </div>

      <div className="pme__flow-arrow">
        <ArrowDown size={14} weight="bold" />
      </div>

      {/* 3. Idempotent Opportunity Lookup Block */}
      <div className="pme__opp-box">
        <div
          className="pme__opp-check"
          onClick={() => onInspect(stage.oppLookup)}
          title="Idempotency query to prevent duplicate deals"
        >
          <span>{stage.oppLookup.label}</span>
        </div>

        <div className="pme__opp-split">
          <div className="pme__opp-path">
            <span className="pme__opp-tag pme__opp-tag--found">Opp Found</span>
            <div
              className="pme__opp-node pme__opp-node--update"
              onClick={() => onInspect(stage.oppActions.found)}
              title="Click to inspect update action"
            >
              {stage.oppActions.found.label}
            </div>
          </div>

          <div className="pme__opp-path">
            <span className="pme__opp-tag pme__opp-tag--not-found">Not Found</span>
            <div
              className="pme__opp-node pme__opp-node--create"
              onClick={() => onInspect(stage.oppActions.notFound)}
              title="Click to inspect creation action"
            >
              {stage.oppActions.notFound.label}
            </div>
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="pme__flow-arrow">
        <ArrowDown size={14} weight="bold" />
      </div>

      {/* 4. Sequential Actions Stack */}
      <div className="pme__actions-stack">
        {stage.actions.map((act) =>
          act.type === 'manual' ? (
            <div
              key={act.id}
              className="pme__node-manual"
              onClick={() => onInspect(act)}
              title="Human action required"
            >
              <User size={14} weight="bold" />
              <span>{act.label}</span>
            </div>
          ) : (
            <div
              key={act.id}
              className="pme__node-action"
              onClick={() => onInspect(act)}
              title={act.details || act.label}
            >
              <div className="pme__node-action-left">
                <span className="pme__action-icon">{getActionIcon(act)}</span>
                <span>{act.label}</span>
              </div>
              {act.timing && <span className="pme__node-timing">{act.timing}</span>}
            </div>
          )
        )}
      </div>

      {/* 5. Conditional Decision Diamond (if present) */}
      {stage.decision && (
        <>
          <div className="pme__flow-arrow">
            <ArrowDown size={14} weight="bold" />
          </div>
          <div className="pme__decision-box">
            <div
              className="pme__decision-node"
              onClick={() => onInspect(stage.decision!.node)}
              title="Conditional decision branch"
            >
              <span>{stage.decision.node.label}</span>
            </div>

            <div className="pme__decision-branches">
              <div className="pme__branch pme__branch--yes">
                <span className="pme__branch-label">
                  <CheckCircle size={12} weight="bold" />
                  Yes
                </span>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  {stage.decision.branches.yes.targetLabel}
                </span>
              </div>

              <div className="pme__branch pme__branch--no">
                <span className="pme__branch-label">
                  <X size={12} weight="bold" />
                  No
                </span>
                <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                  {stage.decision.branches.no.targetLabel}
                </span>
                {stage.decision.branches.no.actions && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    {stage.decision.branches.no.actions.map((act) => (
                      <div
                        key={act.id}
                        className="pme__node-action"
                        style={{ padding: '4px 6px', fontSize: '10.5px' }}
                        onClick={() => onInspect(act)}
                      >
                        <div className="pme__node-action-left">
                          <span className="pme__action-icon">{getActionIcon(act)}</span>
                          <span>{act.label}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Connector */}
      <div className="pme__flow-arrow">
        <ArrowDown size={14} weight="bold" />
      </div>

      {/* 6. End / Target Stage Nodes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {stage.endNodes.map((end) => (
          <div
            key={end.id}
            className="pme__node-end"
            onClick={() => onInspect(end)}
            title="Terminal stage advance"
          >
            <CheckCircle size={14} weight="fill" style={{ color: '#4ade80', flexShrink: 0 }} />
            <span>{end.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
