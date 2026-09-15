import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { members as initialMembers, project, tasks as initialTasks, timeEntries as initialTimeEntries, pullRequests } from '../mocks/team'
import type { IntegrationsState, Task, TaskStatus, TimeEntry, TimeSource } from '../types/team'

interface TeamDataValue {
  members: typeof initialMembers
  project: typeof project
  tasks: Task[]
  timeEntries: TimeEntry[]
  pullRequests: typeof pullRequests
  integrations: IntegrationsState
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  logTime: (taskId: string, hours: number, date: string, source: TimeSource, note?: string) => void
  connectGithub: (repo: string) => void
  connectWakatime: (mappedProject: string) => void
  disconnectGithub: () => void
  disconnectWakatime: () => void
}

const TeamDataContext = createContext<TeamDataValue | null>(null)

export function TeamDataProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(initialTimeEntries)
  const [integrations, setIntegrations] = useState<IntegrationsState>({
    github: { connected: false, repo: null },
    wakatime: { connected: false, mappedProject: null },
  })

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status } : task)))
  }, [])

  const logTime = useCallback(
    (taskId: string, hours: number, date: string, source: TimeSource, note?: string) => {
      setTimeEntries((prev) => [
        ...prev,
        {
          id: `te${prev.length + 1}-${Date.now()}`,
          taskId,
          memberId: prev.find((entry) => entry.taskId === taskId)?.memberId ?? tasks.find((t) => t.id === taskId)?.assigneeId ?? '',
          hours,
          date,
          source,
          note,
        },
      ])
    },
    [tasks],
  )

  const connectGithub = useCallback((repo: string) => {
    setIntegrations((prev) => ({ ...prev, github: { connected: true, repo } }))
  }, [])

  const disconnectGithub = useCallback(() => {
    setIntegrations((prev) => ({ ...prev, github: { connected: false, repo: null } }))
  }, [])

  const connectWakatime = useCallback((mappedProject: string) => {
    setIntegrations((prev) => ({ ...prev, wakatime: { connected: true, mappedProject } }))
  }, [])

  const disconnectWakatime = useCallback(() => {
    setIntegrations((prev) => ({ ...prev, wakatime: { connected: false, mappedProject: null } }))
  }, [])

  const value = useMemo<TeamDataValue>(
    () => ({
      members: initialMembers,
      project,
      tasks,
      timeEntries,
      pullRequests,
      integrations,
      updateTaskStatus,
      logTime,
      connectGithub,
      connectWakatime,
      disconnectGithub,
      disconnectWakatime,
    }),
    [tasks, timeEntries, integrations, updateTaskStatus, logTime, connectGithub, connectWakatime, disconnectGithub, disconnectWakatime],
  )

  return <TeamDataContext.Provider value={value}>{children}</TeamDataContext.Provider>
}

export function useTeamData() {
  const ctx = useContext(TeamDataContext)
  if (!ctx) throw new Error('useTeamData must be used within TeamDataProvider')
  return ctx
}
