import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  applications as initialApplications,
  companies,
  people as initialPeople,
  events as initialEvents,
  conversations as initialConversations,
  summary as initialSummary,
  resolveCompanyId,
  findCompany,
} from '../mocks/job'
import type { Application, ApplicationState, AppEvent, ChatMessage, Conversation, Person, SummarySettings } from '../types/job'

interface NewApplicationInput {
  companyName: string
  role: string
  link: string
  notes: string
}

const REPLY_LINES = [
  "Sure, happy to help! I'll flag your application internally.",
  'Good timing, we have an opening on my team right now.',
  "Let me check with the hiring manager and get back to you.",
  "I've forwarded your CV to the recruiter, fingers crossed!",
]

interface JobDataValue {
  applications: Application[]
  companies: typeof companies
  people: Person[]
  events: AppEvent[]
  conversations: Conversation[]
  summary: SummarySettings
  resolveCompanyId: typeof resolveCompanyId
  findCompany: typeof findCompany
  addApplication: (input: NewApplicationInput) => void
  setApplicationState: (id: string, state: ApplicationState) => void
  setApplicationNotes: (id: string, notes: string) => void
  logManualEvent: (applicationId: string, text: string) => void
  addFriend: (personId: string) => void
  sendMessage: (personId: string, text: string) => void
  updateSummary: (patch: Partial<SummarySettings>) => void
}

const JobDataContext = createContext<JobDataValue | null>(null)

export function JobDataProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [events, setEvents] = useState<AppEvent[]>(initialEvents)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [summary, setSummary] = useState<SummarySettings>(initialSummary)
  const eventIdCounter = useRef(initialEvents.length)
  const appIdCounter = useRef(initialApplications.length)
  const msgIdCounter = useRef(0)

  const logManualEvent = useCallback((applicationId: string, text: string) => {
    eventIdCounter.current += 1
    setEvents((prev) => [
      ...prev,
      {
        id: `ev-new-${eventIdCounter.current}`,
        applicationId,
        source: 'manual',
        text,
        date: new Date().toISOString().slice(0, 10),
      },
    ])
  }, [])

  const addApplication = useCallback(
    (input: NewApplicationInput) => {
      appIdCounter.current += 1
      const id = `a-new-${appIdCounter.current}`
      setApplications((prev) => [
        {
          id,
          companyName: input.companyName,
          role: input.role,
          link: input.link,
          notes: input.notes,
          state: 'applied',
          cvVersion: 'CV v3',
          createdAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ])
      logManualEvent(id, 'Submitted application')
    },
    [logManualEvent],
  )

  const setApplicationState = useCallback(
    (id: string, state: ApplicationState) => {
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, state } : app)))
      logManualEvent(id, `Status changed to "${state}"`)
    },
    [logManualEvent],
  )

  const setApplicationNotes = useCallback((id: string, notes: string) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, notes } : app)))
  }, [])

  const addFriend = useCallback((personId: string) => {
    setPeople((prev) => prev.map((person) => (person.id === personId ? { ...person, isFriend: true } : person)))
  }, [])

  const sendMessage = useCallback((personId: string, text: string) => {
    msgIdCounter.current += 1
    const myMessage: ChatMessage = {
      id: `msg-new-${msgIdCounter.current}`,
      from: 'me',
      text,
      time: new Date().toISOString(),
    }
    setConversations((prev) => {
      const existing = prev.find((c) => c.personId === personId)
      if (existing) {
        return prev.map((c) => (c.personId === personId ? { ...c, messages: [...c.messages, myMessage] } : c))
      }
      return [...prev, { id: `conv-new-${personId}`, personId, messages: [myMessage] }]
    })

    const replyDelay = 2500 + Math.random() * 2000
    window.setTimeout(() => {
      msgIdCounter.current += 1
      const reply: ChatMessage = {
        id: `msg-new-${msgIdCounter.current}`,
        from: 'them',
        text: REPLY_LINES[Math.floor(Math.random() * REPLY_LINES.length)],
        time: new Date().toISOString(),
      }
      setConversations((prev) => prev.map((c) => (c.personId === personId ? { ...c, messages: [...c.messages, reply] } : c)))
    }, replyDelay)
  }, [])

  const updateSummary = useCallback((patch: Partial<SummarySettings>) => {
    setSummary((prev) => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo<JobDataValue>(
    () => ({
      applications,
      companies,
      people,
      events,
      conversations,
      summary,
      resolveCompanyId,
      findCompany,
      addApplication,
      setApplicationState,
      setApplicationNotes,
      logManualEvent,
      addFriend,
      sendMessage,
      updateSummary,
    }),
    [applications, people, events, conversations, summary, addApplication, setApplicationState, setApplicationNotes, logManualEvent, addFriend, sendMessage, updateSummary],
  )

  return <JobDataContext.Provider value={value}>{children}</JobDataContext.Provider>
}

export function useJobData() {
  const ctx = useContext(JobDataContext)
  if (!ctx) throw new Error('useJobData must be used within JobDataProvider')
  return ctx
}
