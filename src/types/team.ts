export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done'

export type TimeSource = 'manual' | 'wakatime'

export type PrState = 'draft' | 'open' | 'merged' | 'closed'

export interface TeamMember {
  id: string
  name: string
  initials: string
  colour: string
}

export interface Project {
  id: string
  name: string
  template: string
  repo: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  assigneeId: string
  estimateHours: number
  prId?: string
}

export interface TimeEntry {
  id: string
  taskId: string
  memberId: string
  hours: number
  date: string
  source: TimeSource
  note?: string
}

export interface PullRequest {
  id: string
  number: number
  title: string
  repo: string
  state: PrState
  authorId: string
  taskId?: string
  url: string
}

export interface IntegrationsState {
  github: {
    connected: boolean
    repo: string | null
  }
  wakatime: {
    connected: boolean
    mappedProject: string | null
  }
}
