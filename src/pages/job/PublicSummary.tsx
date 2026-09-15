import { useParams } from 'react-router-dom'
import { loadSummarySnapshot } from '../../lib/summaryStorage'

export default function PublicSummary() {
  const { token } = useParams<{ token: string }>()
  const snapshot = token ? loadSummarySnapshot(token) : null

  return (
    <div className="min-h-svh bg-slate-50 px-4 py-10 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-1 text-xl font-semibold text-slate-900 dark:text-white">Job search summary</h1>

        {!snapshot ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Link not found.</p>
        ) : snapshot.revoked ? (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">This summary link has been revoked.</p>
        ) : (
          <>
            <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">A read-only overview shared by this person.</p>
            <ul className="flex flex-col gap-2">
              {snapshot.entries.map((entry, index) => (
                <li
                  key={index}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-100">
                    {entry.role}
                    {entry.companyName ? ` @ ${entry.companyName}` : ''}
                  </p>
                  {entry.stateLabel ? <p className="text-xs text-slate-500 dark:text-slate-400">State: {entry.stateLabel}</p> : null}
                  {entry.notes ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.notes}</p> : null}
                </li>
              ))}
              {snapshot.entries.length === 0 ? <p className="text-sm text-slate-400">No applications to show.</p> : null}
            </ul>
          </>
        )}
      </div>
    </div>
  )
}
