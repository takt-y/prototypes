import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTeamData } from '../../state/TeamDataContext'

export default function Dashboard() {
  const { tasks, members, timeEntries } = useTeamData()

  const perTask = useMemo(
    () =>
      tasks.map((task) => ({
        name: task.title.length > 18 ? `${task.title.slice(0, 18)}…` : task.title,
        estimate: task.estimateHours,
        actual: timeEntries.filter((entry) => entry.taskId === task.id).reduce((sum, entry) => sum + entry.hours, 0),
      })),
    [tasks, timeEntries],
  )

  const perMember = useMemo(
    () =>
      members.map((member) => ({
        name: member.name.split(' ')[0],
        estimate: tasks.filter((task) => task.assigneeId === member.id).reduce((sum, task) => sum + task.estimateHours, 0),
        actual: timeEntries.filter((entry) => entry.memberId === member.id).reduce((sum, entry) => sum + entry.hours, 0),
      })),
    [members, tasks, timeEntries],
  )

  const overTime = useMemo(() => {
    const totals = new Map<string, number>()
    for (const entry of timeEntries) {
      totals.set(entry.date, (totals.get(entry.date) ?? 0) + entry.hours)
    }
    const sortedDates = [...totals.keys()].sort()
    let running = 0
    return sortedDates.map((date) => {
      running += totals.get(date) ?? 0
      return { date, hours: totals.get(date) ?? 0, cumulative: running }
    })
  }, [timeEntries])

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Dashboard</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Estimate vs actual per task</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perTask} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-35} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'hours', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="estimate" fill="#94a3b8" name="Estimate" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="#6366f1" name="Actual" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Estimate vs actual per member</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={perMember} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'hours', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="estimate" fill="#94a3b8" name="Estimate" radius={[3, 3, 0, 0]} />
              <Bar dataKey="actual" fill="#22c55e" name="Actual" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Hours logged over time</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={overTime} margin={{ left: 0, right: 8 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} label={{ value: 'hours', angle: -90, position: 'insideLeft', fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cumulative" stroke="#6366f1" name="Cumulative hours" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="hours" stroke="#f97316" name="Hours that day" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  )
}
