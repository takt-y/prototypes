import { useState } from 'react'
import { useJobData } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import type { SummaryFilter } from '../../types/job'

export default function Summary() {
  const { summary, summaryEntries, updateSummary } = useJobData()
  const [copied, setCopied] = useState(false)

  const publicUrl = `https://takt-y.github.io/prototypes/#/job/summary/public/${summary.linkToken}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(publicUrl)
    } catch {
      // Clipboard API unavailable in this context — the link is still shown below.
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  function handleRevoke() {
    updateSummary({ revoked: true })
  }

  function handleRepublish() {
    updateSummary({ revoked: false, linkToken: Math.random().toString(36).slice(2, 10) })
  }

  const isLive = summary.published && !summary.revoked

  return (
    <div>
      <h1 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Published summary</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">What to include</h2>
          <div className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={summary.includeCompanies}
                onChange={(event) => updateSummary({ includeCompanies: event.target.checked })}
              />
              Company names
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={summary.includeStates}
                onChange={(event) => updateSummary({ includeStates: event.target.checked })}
              />
              Application states
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={summary.includeNotes}
                onChange={(event) => updateSummary({ includeNotes: event.target.checked })}
              />
              Personal notes
            </label>
          </div>

          <label className="mt-4 flex flex-col text-xs text-slate-500 dark:text-slate-400">
            Applications to include
            <select
              value={summary.filter}
              onChange={(event) => updateSummary({ filter: event.target.value as SummaryFilter })}
              className="mt-1 w-48 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <option value="all">All applications</option>
              <option value="offers">Only offers</option>
            </select>
          </label>

          <div className="mt-5 flex items-center gap-2">
            <Chip tone={isLive ? 'green' : 'slate'}>{isLive ? 'Live' : 'Revoked'}</Chip>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={publicUrl}
              className="min-w-0 flex-1 rounded-md border border-slate-300 bg-slate-50 px-2 py-1.5 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            />
            <button
              onClick={handleCopy}
              disabled={!isLive}
              className="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900"
            >
              {copied ? 'Copied!' : 'Copy link'}
            </button>
            {isLive ? (
              <button
                onClick={handleRevoke}
                className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
              >
                Revoke
              </button>
            ) : (
              <button
                onClick={handleRepublish}
                className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Republish
              </button>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">Public page preview</h2>
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
            {!isLive ? (
              <p className="text-sm text-slate-400">This summary is not currently live.</p>
            ) : (
              <div>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">A read-only page anyone with the link can see.</p>
                <ul className="flex flex-col gap-2">
                  {summaryEntries.map((entry, index) => (
                    <li key={index} className="rounded-md bg-slate-50 px-3 py-2 text-sm dark:bg-slate-800">
                      <p className="font-medium text-slate-800 dark:text-slate-100">
                        {entry.role}
                        {entry.companyName ? ` @ ${entry.companyName}` : ''}
                      </p>
                      {entry.stateLabel ? <p className="text-xs text-slate-500 dark:text-slate-400">State: {entry.stateLabel}</p> : null}
                      {entry.notes ? <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{entry.notes}</p> : null}
                    </li>
                  ))}
                  {summaryEntries.length === 0 ? <p className="text-sm text-slate-400">No applications match this filter.</p> : null}
                </ul>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
