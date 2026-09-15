import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import {
  applications as initialApplications,
  companies,
  people as initialPeople,
  employment as initialEmployment,
  events as initialEvents,
  conversations as initialConversations,
  summary as initialSummary,
  resolveCompanyId,
  findCompany,
} from '../mocks/job'
import { STATE_LABEL, stateChipLabel } from '../lib/applicationState'
import { saveSummarySnapshot } from '../lib/summaryStorage'
import type { PublicSummaryEntry } from '../lib/summaryStorage'
import type {
  Application,
  ApplicationOutcome,
  ApplicationState,
  AppEvent,
  ChatMessage,
  Conversation,
  Employment,
  Person,
  SummarySettings,
} from '../types/job'

export const ME = 'me'

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
  employment: Employment[]
  events: AppEvent[]
  conversations: Conversation[]
  summary: SummarySettings
  summaryEntries: PublicSummaryEntry[]
  resolveCompanyId: typeof resolveCompanyId
  findCompany: typeof findCompany
  addApplication: (input: NewApplicationInput) => void
  setApplicationState: (id: string, state: ApplicationState) => void
  setApplicationOutcome: (id: string, outcome: ApplicationOutcome) => void
  setApplicationNotes: (id: string, notes: string) => void
  logManualEvent: (applicationId: string, text: string) => void
  addFriend: (personId: string) => void
  sendMessage: (personId: string, text: string) => void
  updateSummary: (patch: Partial<SummarySettings>) => void
  addEmployment: (applicationId: string, startDate: string) => void
  setEmploymentEndDate: (employmentId: string, endDate: string) => void
}

const JobDataContext = createContext<JobDataValue | null>(null)

export function JobDataProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [people, setPeople] = useState<Person[]>(initialPeople)
  const [employment, setEmployment] = useState<Employment[]>(initialEmployment)
  const [events, setEvents] = useState<AppEvent[]>(initialEvents)
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [summary, setSummary] = useState<SummarySettings>(initialSummary)
  const eventIdCounter = useRef(initialEvents.length)
  const appIdCounter = useRef(initialApplications.length)
  const msgIdCounter = useRef(0)
  const employmentIdCounter = useRef(initialEmployment.length)

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
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, state, outcome: state === 'result' ? app.outcome : undefined } : app)),
      )
      logManualEvent(id, `Status changed to "${STATE_LABEL[state]}"`)
    },
    [logManualEvent],
  )

  const setApplicationOutcome = useCallback(
    (id: string, outcome: ApplicationOutcome) => {
      setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, outcome } : app)))
      logManualEvent(id, `Outcome set to "${outcome === 'offer' ? 'Offer' : 'Rejected'}"`)
    },
    [logManualEvent],
  )

  const setApplicationNotes = useCallback((id: string, notes: string) => {
    setApplications((prev) => prev.map((app) => (app.id === id ? { ...app, notes } : app)))
  }, [])

  const addFriend = useCallback((personId: string) => {
    setPeople((prev) => prev.map((person) => (person.id === personId ? { ...person, isFriend: true } : person)))
  }, [])

  const addEmployment = useCallback(
    (applicationId: string, startDate: string) => {
      const application = applications.find((app) => app.id === applicationId)
      const companyId = application ? resolveCompanyId(application.companyName) : undefined
      if (!application || !companyId) return
      employmentIdCounter.current += 1
      setEmployment((prev) => [
        ...prev,
        {
          id: `emp-new-${employmentIdCounter.current}`,
          personId: ME,
          companyId,
          applicationId,
          startDate,
        },
      ])
    },
    [applications],
  )

  const setEmploymentEndDate = useCallback((employmentId: string, endDate: string) => {
    setEmployment((prev) => prev.map((entry) => (entry.id === employmentId ? { ...entry, endDate } : entry)))
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

  const summaryEntries = useMemo<PublicSummaryEntry[]>(() => {
    const filtered =
      summary.filter === 'offers' ? applications.filter((app) => app.state === 'result' && app.outcome === 'offer') : applications
    return filtered.map((app) => {
      const companyId = resolveCompanyId(app.companyName)
      const canonicalName = companyId ? (findCompany(companyId)?.name ?? app.companyName) : app.companyName
      return {
        role: app.role,
        companyName: summary.includeCompanies ? canonicalName : undefined,
        stateLabel: summary.includeStates ? stateChipLabel(app) : undefined,
        notes: summary.includeNotes && app.notes ? app.notes : undefined,
      }
    })
  }, [applications, summary.filter, summary.includeCompanies, summary.includeStates, summary.includeNotes])

  useEffect(() => {
    if (!summary.published) return
    saveSummarySnapshot(summary.linkToken, {
      token: summary.linkToken,
      revoked: summary.revoked,
      entries: summaryEntries,
    })
  }, [summary.published, summary.linkToken, summary.revoked, summaryEntries])

  const value = useMemo<JobDataValue>(
    () => ({
      applications,
      companies,
      people,
      employment,
      events,
      conversations,
      summary,
      summaryEntries,
      resolveCompanyId,
      findCompany,
      addApplication,
      setApplicationState,
      setApplicationOutcome,
      setApplicationNotes,
      logManualEvent,
      addFriend,
      sendMessage,
      updateSummary,
      addEmployment,
      setEmploymentEndDate,
    }),
    [
      applications,
      people,
      employment,
      events,
      conversations,
      summary,
      summaryEntries,
      addApplication,
      setApplicationState,
      setApplicationOutcome,
      setApplicationNotes,
      logManualEvent,
      addFriend,
      sendMessage,
      updateSummary,
      addEmployment,
      setEmploymentEndDate,
    ],
  )

  return <JobDataContext.Provider value={value}>{children}</JobDataContext.Provider>
}

export function useJobData() {
  const ctx = useContext(JobDataContext)
  if (!ctx) throw new Error('useJobData must be used within JobDataProvider')
  return ctx
}
