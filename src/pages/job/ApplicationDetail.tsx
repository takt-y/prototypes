import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useJobData } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import { STATE_LABEL, stateChipLabel, stateChipTone } from '../../lib/applicationState'
import type { ApplicationOutcome, ApplicationState, EventSource } from '../../types/job'

const SOURCE_ICON: Record<EventSource, string> = {
  manual: '✍️',
  email: '✉️',
  extension: '🧩',
}

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>()
  const { applications, employment, events, resolveCompanyId, setApplicationState, setApplicationOutcome, setApplicationNotes } =
    useJobData()
  const navigate = useNavigate()
  const application = applications.find((app) => app.id === id)

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
  const employmentRecord = employment.find((entry) => entry.applicationId === application.id)
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

          <NotesEditor
            key={application.id}
            applicationId={application.id}
            initialNotes={application.notes}
            onSave={setApplicationNotes}
          />

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
              <Chip tone={stateChipTone(application)}>{stateChipLabel(application)}</Chip>
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

            {application.state === 'result' ? (
              <select
                value={application.outcome ?? ''}
                onChange={(event) => setApplicationOutcome(application.id, event.target.value as ApplicationOutcome)}
                className="mt-2 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <option value="" disabled>
                  Select outcome…
                </option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            ) : null}

            {application.state === 'result' && application.outcome === 'offer' ? (
              <EmploymentSection
                applicationId={application.id}
                companyId={companyId}
                employmentRecord={employmentRecord}
              />
            ) : null}
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

function NotesEditor({
  applicationId,
  initialNotes,
  onSave,
}: {
  applicationId: string
  initialNotes: string
  onSave: (id: string, notes: string) => void
}) {
  const [notes, setNotes] = useState(initialNotes)

  return (
    <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Notes</h2>
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        onBlur={() => onSave(applicationId, notes)}
        rows={4}
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
    </div>
  )
}

function EmploymentSection({
  applicationId,
  companyId,
  employmentRecord,
}: {
  applicationId: string
  companyId: string | undefined
  employmentRecord: { startDate: string } | undefined
}) {
  const { addEmployment } = useJobData()
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10))

  if (employmentRecord) {
    return (
      <p className="mt-3 rounded-md bg-green-50 px-3 py-2 text-xs text-green-700 dark:bg-green-900/30 dark:text-green-300">
        🎉 Congratulations! Employment record added, started {employmentRecord.startDate}.
        {companyId ? (
          <>
            {' '}
            <Link to={`/job/companies/${companyId}`} className="underline">
              View on company page
            </Link>
          </>
        ) : null}
      </p>
    )
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    addEmployment(applicationId, startDate)
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-2 rounded-md bg-slate-50 p-3 dark:bg-slate-800">
      <p className="text-xs text-slate-600 dark:text-slate-300">Got the offer? Add your start date to create an employment record.</p>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(event) => setStartDate(event.target.value)}
          className="rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <button
          type="submit"
          className="rounded-md bg-slate-900 px-3 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
        >
          Add employment record
        </button>
      </div>
    </form>
  )
}
