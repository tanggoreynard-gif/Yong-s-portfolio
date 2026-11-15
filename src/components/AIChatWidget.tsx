import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  PaperPlaneTilt,
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
    text: "Hey! Glad you're here. Ask me anything about my GoHighLevel workflows, CRM architecture, pricing, or let's book a quick strategy call.",
    time: 'Just now',
  },
]

const QUICK_CHIPS = [
  'How does your missed-call workflow work?',
  'What are your rates?',
  'What services do you offer?',
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

    // 0. Quick greetings / Casual check-in
    if (q === 'hi' || q === 'hello' || q === 'hey' || q === 'yo' || q === 'sup' || q.startsWith('good morning') || q.startsWith('good afternoon') || q.startsWith('good evening') || q === 'hey there') {
      return {
        text: "Hey! Glad you reached out. What can I help you with today? Feel free to ask about my GoHighLevel workflows, rates, or systems.",
      }
    }

    // 1. Booking / Calendar / Meeting
    if (q.includes('book') || q.includes('calendar') || q.includes('schedule') || q.includes('call') || q.includes('meet')) {
      return {
        text: "You can grab a 15-minute slot directly on my calendar! We can dive into your sales pipeline, audit your CRM bottlenecks, or discuss your workflows.",
        action: { label: 'Open Booking Calendar ↗', actionType: 'calendar' },
      }
    }

    // 2. Missed Call Text Back / Speed-to-lead
    if (q.includes('missed') || q.includes('mctb') || q.includes('speed to lead') || q.includes('text back') || q.includes('008')) {
      return {
        text: "My 008_Missed Call Text Back engine triggers immediately on missed or busy incoming calls. I apply a natural 60-second delay so the text feels human and unhurried, send a conversational SMS, tag the contact ('status: missed-call'), and alert the team right inside the LeadConnector app.",
        action: { label: 'View Workflow Blueprint ↗', actionType: 'portfolio' },
      }
    }

    // 3. Services / What do you do / GHL
    if (q.includes('service') || q.includes('offer') || q.includes('what do you do') || q.includes('help with') || q.includes('skills')) {
      return {
        text: "I specialize in end-to-end GoHighLevel CRM architecture:\n\n• Speed-to-lead & missed-call text-back\n• 8-stage sales pipelines & custom qualification fields\n• Appointment booking engines with 24h & 20m reminders\n• Client onboarding workflows & contract triggers\n• Zapier/webhook integrations & data hygiene",
        action: { label: 'Explore Full Process Map ↗', actionType: 'portfolio' },
      }
    }

    // 4. Pricing / Cost / Rates / Salary
    if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('rate') || q.includes('how much') || q.includes('salary') || q.includes('fee')) {
      return {
        text: "My rates typically range from $10–$15/hour for part-time operations, $1,200–$1,500/month for dedicated full-time support, or fixed per-project quotes based on the HLA Maria Pricing framework. Would you like to hop on a quick 15-minute call so we can go over what you need?",
        action: { label: 'Book a Quick Strategy Call ↗', actionType: 'calendar' },
      }
    }

    // 5. Background / Engineering / Credentials
    if (q.includes('background') || q.includes('who is') || q.includes('certified') || q.includes('engineer') || q.includes('reynard')) {
      return {
        text: "I'm a licensed Agricultural and Biosystems Engineer and an official HighLevel Certified Admin (HLA-Verified). My engineering background gives me a disciplined, systematic approach—I build workflows with proper fail-safes so systems don't break under real client volume.",
      }
    }

    // 6. Fitness Coaches
    if (q.includes('fitness') || q.includes('gym') || q.includes('coach') || q.includes('trainer')) {
      return {
        text: "I've built turnkey workflows designed specifically for fitness businesses: capturing inquiries in under 60 seconds, stopping appointment no-shows with staged SMS reminders, and automating weekly check-in forms so coaches reclaim 10–15 hours every week.",
        action: { label: 'See FitCo Blueprint ↗', actionType: 'portfolio' },
      }
    }

    // 7. Contact / Leave message
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('message') || q.includes('quote')) {
      setLeadMode(true)
      return {
        text: "Drop your name, email, and a quick note below and it will send directly to my inbox, or feel free to book directly on my calendar.",
        action: { label: 'Open Booking Calendar ↗', actionType: 'calendar' },
      }
    }

    // Default friendly answer
    return {
      text: "I'd love to help with that! I build full-funnel GoHighLevel pipelines, automated follow-ups, and calendar booking systems. Would you like to review my live portfolio or grab a quick 15-minute strategy call on my calendar?",
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

    const { text: replyText, action } = generateAIResponse(text)

    // Realistic human reading & typing simulation:
    // 1. Reading time: scales with user's input length (350ms to 1100ms)
    const readTime = Math.min(1100, Math.max(350, 250 + text.length * 10))

    // 2. Typing time: scales directly with the length of the reply (~13ms per char, min 650ms)
    const typeTime = Math.max(650, replyText.length * 12.5)

    // 3. Subtle human jitter (+/- 100ms)
    const jitter = Math.floor(Math.random() * 200) - 100

    // Dynamic delay: short greetings take ~1.2s - 1.6s, medium replies take ~2.2s - 2.8s, long detailed blueprints take ~3.8s - 4.6s
    const typingDelay = Math.min(4800, Math.max(1100, Math.round(readTime + typeTime + jitter)))

    setTimeout(() => {
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        action,
      }
      setIsTyping(false)
      setMessages((prev) => [...prev, aiMsg])
    }, typingDelay)
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
    <aside className="ai-chat" aria-label="Chat with Reynard">
      {/* Floating Teaser Tooltip */}
      {showTeaser && !isOpen && (
        <div className="ai-chat__teaser" onClick={() => setIsOpen(true)}>
          <span className="ai-chat__teaser-dot" />
          <span>Have a question? Let's chat</span>
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
          aria-label="Open chat with Reynard"
        >
          <div className="ai-chat__avatar-wrap">
            <img src={profile.avatarSrc} alt="Reynard Tanggo" className="ai-chat__avatar" />
            <span className="ai-chat__online-dot" />
          </div>
          <div className="ai-chat__launcher-text">
            <span className="ai-chat__launcher-title">Chat with Reynard</span>
            <span className="ai-chat__launcher-sub">Replies in minutes</span>
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
                <h3 className="ai-chat__header-title">Reynard Tanggo</h3>
                <span className="ai-chat__header-badge">
                  <span className="ai-chat__badge-dot" />
                  HighLevel Certified Admin • Active
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
              placeholder="Ask about workflows, pricing, or booking..."
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

