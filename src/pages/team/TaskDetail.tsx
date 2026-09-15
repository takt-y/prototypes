import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTeamData } from '../../state/TeamDataContext'
import { Avatar } from '../../components/Avatar'
import { Chip } from '../../components/Chip'
import type { ChipTone } from '../../components/Chip'
import type { TaskStatus } from '../../types/team'

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  review: 'Review',
  done: 'Done',
}

const PR_TONE: Record<string, ChipTone> = {
  draft: 'slate',
  open: 'blue',
  merged: 'purple',
  closed: 'red',
}

const SOURCE_ICON: Record<string, string> = {
  manual: '✍️',
  wakatime: '⏱️',
}

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>()
  const { tasks, members, timeEntries, pullRequests, updateTaskStatus, logTime } = useTeamData()
  const task = tasks.find((t) => t.id === id)

  const [hours, setHours] = useState('1')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [note, setNote] = useState('')

  const entries = useMemo(
    () => timeEntries.filter((entry) => entry.taskId === id).sort((a, b) => b.date.localeCompare(a.date)),
    [timeEntries, id],
  )

  if (!task) {
    return (
      <div>
        <p className="text-slate-600 dark:text-slate-300">Task not found.</p>
        <Link to="/team/board" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Back to board
        </Link>
      </div>
    )
  }

  const assignee = members.find((m) => m.id === task.assigneeId)
  const pr = task.prId ? pullRequests.find((p) => p.id === task.prId) : undefined
  const loggedTotal = entries.reduce((sum, entry) => sum + entry.hours, 0)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const hoursValue = Number.parseFloat(hours)
    if (!task || Number.isNaN(hoursValue) || hoursValue <= 0) return
    logTime(task.id, hoursValue, date, 'manual', note || undefined)
    setHours('1')
    setNote('')
  }

  return (
    <div>
      <Link to="/team/board" className="mb-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Back to board
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">{task.title}</h1>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">{task.description}</p>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Log time</h2>
            <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
              <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                Hours
                <input
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={hours}
                  onChange={(event) => setHours(event.target.value)}
                  className="mt-1 w-24 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
              <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
                Date
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
              <label className="flex flex-1 flex-col text-xs text-slate-500 dark:text-slate-400">
                Note (optional)
                <input
                  type="text"
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="What did you work on?"
                  className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
              >
                Log time
              </button>
            </form>
          </div>

          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Time entries ({loggedTotal}h logged)
          </h2>
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{SOURCE_ICON[entry.source]}</span>
                  <span className="text-slate-700 dark:text-slate-200">{entry.note || (entry.source === 'wakatime' ? 'Synced from WakaTime' : 'Manual entry')}</span>
                </span>
                <span className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <span>{entry.date}</span>
                  <span className="font-medium text-slate-900 dark:text-white">{entry.hours}h</span>
                </span>
              </li>
            ))}
            {entries.length === 0 ? <p className="text-sm text-slate-400">No time logged yet.</p> : null}
          </ul>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Status</h2>
            <select
              value={task.status}
              onChange={(event) => updateTaskStatus(task.id, event.target.value as TaskStatus)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {Object.entries(STATUS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Assignee</h2>
            {assignee ? (
              <div className="flex items-center gap-2">
                <Avatar initials={assignee.initials} colour={assignee.colour} />
                <span className="text-sm text-slate-700 dark:text-slate-200">{assignee.name}</span>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Unassigned</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Estimate</h2>
            <p className="text-sm text-slate-700 dark:text-slate-200">
              {loggedTotal}h logged of {task.estimateHours}h estimated
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Linked pull request</h2>
            {pr ? (
              <a href={pr.url} target="_blank" rel="noreferrer" className="flex flex-col gap-1 text-sm">
                <span className="text-slate-700 dark:text-slate-200">
                  #{pr.number} {pr.title}
                </span>
                <Chip tone={PR_TONE[pr.state]}>{pr.state}</Chip>
              </a>
            ) : (
              <p className="text-sm text-slate-400">No linked pull request.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
