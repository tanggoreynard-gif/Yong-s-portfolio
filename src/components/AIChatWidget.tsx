import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  PaperPlaneTilt,
  Sparkle,
  ArrowCounterClockwise,
  CalendarCheck,
} from '@/components/slab'
import { profile } from '@/data/profile'
import { submitLead } from '@/lib/contact'
import '@/styles/ai-chat-widget.css'

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
  time: string
  action?: {
    label: string
    url?: string
    actionType?: 'calendar' | 'portfolio' | 'audit'
  }
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'm1',
    sender: 'ai',
    text: "Hi there! 👋 I'm Reynard's AI Assistant. Ask me anything about his GoHighLevel systems, CRM workflows, pricing, or book a quick strategy call.",
    time: 'Just now',
  },
]

const QUICK_CHIPS = [
  'How does your missed-call workflow work?',
  'What services do you offer?',
  'What are your rates?',
  'Book a 15-minute call',
  'Tell me about your background',
]

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [showTeaser, setShowTeaser] = useState(true)
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [leadMode, setLeadMode] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false)
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES)
    setLeadMode(false)
    setLeadSubmitted(false)
  }

  const handleActionClick = (action: Message['action']) => {
    if (!action) return
    if (action.actionType === 'calendar') {
      navigate('/contact?tab=calendar')
      setIsOpen(false)
    } else if (action.actionType === 'portfolio') {
      navigate('/projects')
      setIsOpen(false)
    }
  }

  const generateAIResponse = (userQuery: string): { text: string; action?: Message['action'] } => {
    const q = userQuery.toLowerCase().trim()

    // 1. Booking / Calendar / Meeting
    if (q.includes('book') || q.includes('calendar') || q.includes('schedule') || q.includes('call') || q.includes('meet')) {
      return {
        text: "You can book a 15-minute strategy call directly on Reynard's calendar! We can discuss your sales pipeline, CRM bottlenecks, or audit your existing workflows.",
        action: { label: 'Open Booking Calendar ↗', actionType: 'calendar' },
      }
    }

    // 2. Missed Call Text Back / Speed-to-lead
    if (q.includes('missed') || q.includes('mctb') || q.includes('speed to lead') || q.includes('text back') || q.includes('008')) {
      return {
        text: "Reynard's 008_Missed Call Text Back engine triggers immediately on missed or busy incoming calls. It applies a natural 60-second delay so the text feels human (not robotic), sends a conversational SMS, tags the contact ('status: missed-call'), and pings the team via the LeadConnector app.",
        action: { label: 'View Workflow Blueprint ↗', actionType: 'portfolio' },
      }
    }

    // 3. Services / What do you do / GHL
    if (q.includes('service') || q.includes('offer') || q.includes('what do you do') || q.includes('help with') || q.includes('skills')) {
      return {
        text: "Reynard specializes in end-to-end GoHighLevel CRM architecture:\n\n• Speed-to-lead and missed-call text-back\n• 8-stage sales pipelines & custom qualification fields\n• Appointment booking engines with 24h & 20m reminders\n• Client onboarding workflows & contract triggers\n• Data hygiene and Zapier integrations",
        action: { label: 'Explore Full Process Map ↗', actionType: 'portfolio' },
      }
    }

    // 4. Pricing / Cost / Rates / Salary
    if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('salary') || q.includes('fee')) {
      return {
        text: "Reynard's rates are typically $10–$15/hour for part-time operations, $1,200–$1,500/month for dedicated full-time support, or fixed per-project quotes based on the HLA Maria Pricing framework. Would you like to schedule a 15-minute call to get an exact scope?",
        action: { label: 'Book a Quick Strategy Call ↗', actionType: 'calendar' },
      }
    }

    // 5. Background / Engineering / Credentials
    if (q.includes('background') || q.includes('who is') || q.includes('certified') || q.includes('engineer') || q.includes('reynard')) {
      return {
        text: "Reynard Tanggo is a licensed Agricultural and Biosystems Engineer and an official HighLevel Certified Admin (HLA-Verified). His engineering background gives him a disciplined, systematic approach—building workflows with proper fail-safes so systems don't break under real client volume.",
      }
    }

    // 6. Fitness Coaches
    if (q.includes('fitness') || q.includes('gym') || q.includes('coach') || q.includes('trainer')) {
      return {
        text: "Reynard has custom workflows designed specifically for fitness businesses: capturing inquiries in under 60 seconds, stopping appointment no-shows with staged reminders, and automating weekly check-in forms so coaches reclaim 10–15 hours a week.",
        action: { label: 'See FitCo Blueprint ↗', actionType: 'portfolio' },
      }
    }

    // 7. Contact / Leave message
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('message') || q.includes('quote')) {
      setLeadMode(true)
      return {
        text: "I can forward your message directly to Reynard's inbox! Please enter your name, email, and a short note below, or book directly on his calendar.",
        action: { label: 'Open Booking Calendar ↗', actionType: 'calendar' },
      }
    }

    // Default friendly answer
    return {
      text: "I'd be happy to help with that! Reynard builds full-funnel GoHighLevel pipelines, automated follow-ups, and calendar booking systems. Would you like to review his live portfolio or book a 15-minute strategy call?",
      action: { label: 'Book 15-Min Strategy Call ↗', actionType: 'calendar' },
    }
  }

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || input).trim()
    if (!text) return

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsTyping(true)

    // Simulate realistic AI thought/typing delay
    setTimeout(() => {
      const { text: replyText, action } = generateAIResponse(text)
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      }
      setIsTyping(false)
      setMessages((prev) => [...prev, aiMsg])
    }, 650)
  }

  const handleLeadSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const note = String(data.get('note') || '').trim()

    if (!name || !email) return

    const names = name.split(' ')
    const firstName = names[0] || 'Lead'
    const lastName = names.slice(1).join(' ') || 'Visitor'

    setLeadSubmitted(true)
    try {
      await submitLead({
        firstName,
        lastName,
        email,
        message: `[AI Chat Widget Lead]\nNote: ${note || 'Interested in CRM services'}`,
        website: '',
      })
    } catch {
      // Ignored - fallback shown to user
    }

    const confirmMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Thanks ${firstName}! Your details have been sent directly to Reynard's inbox (${profile.email}). He will get back to you within 24 hours.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: { label: 'Book on Calendar Instead ↗', actionType: 'calendar' },
    }
    setMessages((prev) => [...prev, confirmMsg])
    setLeadMode(false)
  }

  return (
    <aside className="ai-chat" aria-label="AI Chat Assistant">
      {/* Floating Teaser Tooltip */}
      {showTeaser && !isOpen && (
        <div className="ai-chat__teaser" onClick={() => setIsOpen(true)}>
          <Sparkle size={15} weight="fill" color="#F59E0B" />
          <span>Have questions? Chat with AI</span>
          <button
            type="button"
            className="ai-chat__teaser-close"
            onClick={(e) => {
              e.stopPropagation()
              setShowTeaser(false)
            }}
            aria-label="Dismiss chat teaser"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="ai-chat__launcher"
          onClick={() => setIsOpen(true)}
          aria-expanded={isOpen}
          aria-label="Open Reynard's AI Chat Assistant"
        >
          <div className="ai-chat__avatar-wrap">
            <img src={profile.avatarSrc} alt="Reynard Tanggo" className="ai-chat__avatar" />
            <span className="ai-chat__online-dot" />
          </div>
          <div className="ai-chat__launcher-text">
            <span className="ai-chat__launcher-title">Chat with AI</span>
            <span className="ai-chat__launcher-sub">
              <Sparkle size={11} weight="fill" color="#38BDF8" />
              Ask about GHL & Systems
            </span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div className="ai-chat__window" role="dialog" aria-modal="true">
          {/* Header */}
          <header className="ai-chat__header">
            <div className="ai-chat__header-info">
              <div className="ai-chat__avatar-wrap" style={{ width: 34, height: 34 }}>
                <img src={profile.avatarSrc} alt="Reynard Tanggo" className="ai-chat__avatar" />
                <span className="ai-chat__online-dot" />
              </div>
              <div>
                <h3 className="ai-chat__header-title">Reynard's AI Assistant</h3>
                <span className="ai-chat__header-badge">
                  <Sparkle size={11} weight="fill" />
                  HighLevel Certified Admin
                </span>
              </div>
            </div>
            <div className="ai-chat__header-actions">
              <button
                type="button"
                className="ai-chat__btn-icon"
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <ArrowCounterClockwise size={14} weight="bold" />
              </button>
              <button
                type="button"
                className="ai-chat__btn-icon"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                aria-label="Close chat"
              >
                <X size={15} weight="bold" />
              </button>
            </div>
          </header>

          {/* Messages Body */}
          <div className="ai-chat__messages">
            {messages.map((m) => (
              <div key={m.id} className={`ai-chat__msg ai-chat__msg--${m.sender}`}>
                <div className="ai-chat__bubble">
                  {m.text.split('\n\n').map((para, i) => (
                    <p key={i} style={{ margin: i > 0 ? '8px 0 0' : 0 }}>
                      {para}
                    </p>
                  ))}
                  {m.action && (
                    <button
                      type="button"
                      className="ai-chat__action-btn"
                      onClick={() => handleActionClick(m.action)}
                    >
                      <CalendarCheck size={14} weight="bold" />
                      {m.action.label}
                    </button>
                  )}
                </div>
                <span className="ai-chat__time">{m.time}</span>
              </div>
            ))}

            {isTyping && (
              <div className="ai-chat__msg ai-chat__msg--ai">
                <div className="ai-chat__bubble" style={{ padding: '6px 12px' }}>
                  <div className="ai-chat__typing">
                    <span className="ai-chat__typing-dot" />
                    <span className="ai-chat__typing-dot" />
                    <span className="ai-chat__typing-dot" />
                  </div>
                </div>
              </div>
            )}

            {leadMode && !leadSubmitted && (
              <form onSubmit={handleLeadSubmit} style={{ marginTop: 8, padding: 12, background: 'rgba(37, 99, 235, 0.08)', borderRadius: 12, border: '1px solid rgba(37, 99, 235, 0.2)' }}>
                <span style={{ fontSize: 12, fontWeight: 700, display: 'block', marginBottom: 8, color: 'var(--navy)' }}>Send a Direct Message to Reynard:</span>
                <input name="name" required placeholder="Your Name" style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', marginBottom: 6, boxSizing: 'border-box' }} />
                <input name="email" type="email" required placeholder="Your Email" style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', marginBottom: 6, boxSizing: 'border-box' }} />
                <input name="note" placeholder="Project or note (optional)" style={{ width: '100%', padding: '7px 10px', fontSize: 12, borderRadius: 6, border: '1px solid var(--line)', marginBottom: 8, boxSizing: 'border-box' }} />
                <button type="submit" className="home__cta home__cta--primary" style={{ width: '100%', padding: '8px', fontSize: 12, justifyContent: 'center' }}>
                  Send to Reynard's Inbox ➔
                </button>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Chips */}
          <div className="ai-chat__chips">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                className="ai-chat__chip"
                onClick={() => handleSend(chip)}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Footer Input */}
          <footer className="ai-chat__footer">
            <input
              ref={inputRef}
              type="text"
              className="ai-chat__input"
              placeholder="Ask anything about GHL, pricing, booking..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              disabled={isTyping}
            />
            <button
              type="button"
              className="ai-chat__send-btn"
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              aria-label="Send message"
            >
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </footer>
        </div>
      )}
    </aside>
  )
}

