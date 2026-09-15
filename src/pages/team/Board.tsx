import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTeamData } from '../../state/TeamDataContext'
import { Avatar } from '../../components/Avatar'
import { Chip } from '../../components/Chip'
import type { ChipTone } from '../../components/Chip'
import type { Task, TaskStatus } from '../../types/team'

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'todo', label: 'To do' },
  { status: 'in-progress', label: 'In progress' },
  { status: 'review', label: 'Review' },
  { status: 'done', label: 'Done' },
]

const PR_TONE: Record<string, ChipTone> = {
  draft: 'slate',
  open: 'blue',
  merged: 'purple',
  closed: 'red',
}

export default function Board() {
  const { tasks, members, timeEntries, pullRequests, updateTaskStatus } = useTeamData()
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null)

  const visibleTasks = useMemo(
    () => (assigneeFilter === 'all' ? tasks : tasks.filter((task) => task.assigneeId === assigneeFilter)),
    [tasks, assigneeFilter],
  )

  const loggedHours = useMemo(() => {
    const totals = new Map<string, number>()
    for (const entry of timeEntries) {
      totals.set(entry.taskId, (totals.get(entry.taskId) ?? 0) + entry.hours)
    }
    return totals
  }, [timeEntries])

  function memberFor(id: string) {
    return members.find((m) => m.id === id)
  }

  function prFor(task: Task) {
    return task.prId ? pullRequests.find((pr) => pr.id === task.prId) : undefined
  }

  function handleDrop(status: TaskStatus) {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, status)
      setDraggedTaskId(null)
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Board</h1>
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          Assignee
          <select
            value={assigneeFilter}
            onChange={(event) => setAssigneeFilter(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="all">Everyone</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((column) => {
          const columnTasks = visibleTasks.filter((task) => task.status === column.status)
          return (
            <div
              key={column.status}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => handleDrop(column.status)}
              className="flex flex-col gap-3 rounded-xl bg-slate-100 p-3 dark:bg-slate-900/60"
            >
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{column.label}</h2>
                <span className="text-xs text-slate-400">{columnTasks.length}</span>
              </div>
              <div className="flex flex-col gap-2 min-h-16">
                {columnTasks.map((task) => {
                  const assignee = memberFor(task.assigneeId)
                  const pr = prFor(task)
                  const logged = loggedHours.get(task.id) ?? 0
                  return (
                    <Link
                      key={task.id}
                      to={`/team/tasks/${task.id}`}
                      draggable
                      onDragStart={() => setDraggedTaskId(task.id)}
                      className="block rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-800"
                    >
                      <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white">{task.title}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {assignee ? <Avatar initials={assignee.initials} colour={assignee.colour} size={22} /> : null}
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {logged}h / {task.estimateHours}h
                          </span>
                        </div>
                        {pr ? <Chip tone={PR_TONE[pr.state]}>PR #{pr.number}</Chip> : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
