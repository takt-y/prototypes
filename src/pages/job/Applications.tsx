import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useJobData } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import { Modal } from '../../components/Modal'
import { STATE_LABEL, stateChipLabel, stateChipTone } from '../../lib/applicationState'
import type { ApplicationState } from '../../types/job'

export default function Applications() {
  const { applications, people, resolveCompanyId, addApplication } = useJobData()
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'all' | ApplicationState>('all')
  const [showAdd, setShowAdd] = useState(false)

  const friendCompanyIds = useMemo(
    () => new Set(people.filter((person) => person.isFriend).map((person) => person.companyId)),
    [people],
  )

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    return applications.filter((app) => {
      if (stateFilter !== 'all' && app.state !== stateFilter) return false
      if (!needle) return true
      return (
        app.companyName.toLowerCase().includes(needle) ||
        app.role.toLowerCase().includes(needle) ||
        app.notes.toLowerCase().includes(needle)
      )
    })
  }, [applications, search, stateFilter])

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Applications</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
        >
          Add application
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search company, role or notes…"
          className="min-w-56 flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
        />
        <select
          value={stateFilter}
          onChange={(event) => setStateFilter(event.target.value as 'all' | ApplicationState)}
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-900"
        >
          <option value="all">All states</option>
          {Object.entries(STATE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-2 font-medium">Company</th>
              <th className="px-4 py-2 font-medium">Role</th>
              <th className="px-4 py-2 font-medium">State</th>
              <th className="px-4 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((app) => {
              const companyId = resolveCompanyId(app.companyName)
              const knowsPeople = companyId ? friendCompanyIds.has(companyId) : false
              return (
                <tr key={app.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-4 py-2.5">
                    {companyId ? (
                      <Link to={`/job/companies/${companyId}`} className="font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {app.companyName}
                      </Link>
                    ) : (
                      app.companyName
                    )}
                    {knowsPeople ? (
                      <div className="mt-0.5 text-xs text-green-600 dark:text-green-400">People you know here</div>
                    ) : null}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link to={`/job/applications/${app.id}`} className="text-slate-700 hover:underline dark:text-slate-200">
                      {app.role}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5">
                    <Chip tone={stateChipTone(app)}>{stateChipLabel(app)}</Chip>
                  </td>
                  <td className="max-w-64 truncate px-4 py-2.5 text-slate-500 dark:text-slate-400" title={app.notes}>
                    {app.notes}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                  No applications match your search.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {showAdd ? (
        <AddApplicationModal
          onClose={() => setShowAdd(false)}
          onSubmit={(input) => {
            addApplication(input)
            setShowAdd(false)
          }}
        />
      ) : null}
    </div>
  )
}

function AddApplicationModal({
  onClose,
  onSubmit,
}: {
  onClose: () => void
  onSubmit: (input: { companyName: string; role: string; link: string; notes: string }) => void
}) {
  const [companyName, setCompanyName] = useState('')
  const [role, setRole] = useState('')
  const [link, setLink] = useState('')
  const [notes, setNotes] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!companyName.trim() || !role.trim()) return
    onSubmit({ companyName: companyName.trim(), role: role.trim(), link: link.trim(), notes: notes.trim() })
  }

  return (
    <Modal title="Add application" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
          Company
          <input
            required
            value={companyName}
            onChange={(event) => setCompanyName(event.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
          Role
          <input
            required
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
          Link
          <input
            type="url"
            value={link}
            onChange={(event) => setLink(event.target.value)}
            placeholder="https://…"
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
          Notes
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            rows={3}
            className="mt-1 rounded-md border border-slate-300 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800"
          />
        </label>
        <div className="mt-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-md px-4 py-1.5 text-sm text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
            Cancel
          </button>
          <button type="submit" className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900">
            Add application
          </button>
        </div>
      </form>
    </Modal>
  )
}
