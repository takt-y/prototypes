export type ApplicationState = 'applied' | 'in-process' | 'result'

export type ApplicationOutcome = 'offer' | 'rejected'

export type EventSource = 'manual' | 'email' | 'extension'

export interface Application {
  id: string
  companyName: string
  role: string
  link: string
  notes: string
  state: ApplicationState
  outcome?: ApplicationOutcome
  cvVersion: string
  createdAt: string
}

export interface Company {
  id: string
  name: string
  aka: string[]
}

export interface Person {
  id: string
  name: string
  companyId: string
  openToReferrals: boolean
  isFriend: boolean
}

export interface Employment {
  id: string
  personId: string
  companyId: string
  applicationId?: string
  startDate: string
  endDate?: string
}

export interface AppEvent {
  id: string
  applicationId: string
  source: EventSource
  text: string
  date: string
}

export interface ChatMessage {
  id: string
  from: 'me' | 'them'
  text: string
  time: string
}

export interface Conversation {
  id: string
  personId: string
  messages: ChatMessage[]
}

export type SummaryFilter = 'all' | 'offers'

export interface SummarySettings {
  published: boolean
  includeNotes: boolean
  includeStates: boolean
  includeCompanies: boolean
  filter: SummaryFilter
  linkToken: string
  revoked: boolean
}
