import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useJobData } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import type { ChipTone } from '../../components/Chip'
import type { ApplicationState, EventSource } from '../../types/job'

const STATE_LABEL: Record<ApplicationState, string> = {
  applied: 'Applied',
  interviewing: 'Interviewing',
  closed: 'Closed',
}

const STATE_TONE: Record<ApplicationState, ChipTone> = {
  applied: 'blue',
  interviewing: 'amber',
  closed: 'slate',
}

const SOURCE_ICON: Record<EventSource, string> = {
  manual: '✍️',
  email: '✉️',
  extension: '🧩',
}

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const { applications, events, resolveCompanyId, setApplicationState, setApplicationNotes } = useJobData()
  const navigate = useNavigate()
  const application = applications.find((app) => app.id === id)
  const [notes, setNotes] = useState(application?.notes ?? '')

  useEffect(() => {
    setNotes(application?.notes ?? '')
  }, [application?.id, application?.notes])

  if (!application) {
    return (
      <div>
        <p className="text-slate-600 dark:text-slate-300">Application not found.</p>
        <Link to="/job/applications" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Back to applications
        </Link>
      </div>
    )
  }

  const companyId = resolveCompanyId(application.companyName)
  const timeline = events
    .filter((event) => event.applicationId === application.id)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div>
      <Link to="/job/applications" className="mb-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Back to applications
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">{application.role}</h1>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            {companyId ? (
              <Link to={`/job/companies/${companyId}`} className="text-blue-600 hover:underline dark:text-blue-400">
                {application.companyName}
              </Link>
            ) : (
              application.companyName
            )}
            {application.link ? (
              <>
                {' · '}
                <a href={application.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline dark:text-blue-400">
                  Job posting
                </a>
              </>
            ) : null}
          </p>

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Notes</h2>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              onBlur={() => setApplicationNotes(application.id, notes)}
              rows={4}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Event timeline</h2>
          <ul className="flex flex-col gap-2">
            {timeline.map((event) => (
              <li
                key={event.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden>{SOURCE_ICON[event.source]}</span>
                  <span className="text-slate-700 dark:text-slate-200">{event.text}</span>
                </span>
                <span className="text-slate-500 dark:text-slate-400">{event.date}</span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">State</h2>
            <div className="mb-2">
              <Chip tone={STATE_TONE[application.state]}>{STATE_LABEL[application.state]}</Chip>
            </div>
            <select
              value={application.state}
              onChange={(event) => setApplicationState(application.id, event.target.value as ApplicationState)}
              className="w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {Object.entries(STATE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Attached CV</h2>
            <p className="text-sm text-slate-700 dark:text-slate-200">{application.cvVersion}</p>
          </div>

          {companyId ? (
            <button
              onClick={() => navigate(`/job/companies/${companyId}`)}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
            >
              Find a referral
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  )
}
