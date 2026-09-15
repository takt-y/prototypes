import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useJobData, ME } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import { ChatPanel } from '../../components/ChatPanel'
import { stateChipLabel, stateChipTone } from '../../lib/applicationState'
import type { Employment, Person } from '../../types/job'

interface Occupant {
  key: string
  name: string
  isMe: boolean
  person?: Person
  employment?: Employment
}

function isCurrent(entry: Employment | undefined, today: string): boolean {
  if (!entry) return true
  return !entry.endDate || entry.endDate >= today
}

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const { applications, findCompany, people, employment, conversations, addFriend, sendMessage } = useJobData()
  const [chatPersonId, setChatPersonId] = useState<string | null>(null)

  const company = id ? findCompany(id) : undefined
  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])

  const companyApplications = useMemo(() => {
    if (!company) return []
    const names = new Set([company.name.toLowerCase(), ...company.aka.map((a) => a.toLowerCase())])
    return applications.filter((app) => names.has(app.companyName.toLowerCase()))
  }, [applications, company])

  const companyPeople = useMemo(() => (company ? people.filter((person) => person.companyId === company.id) : []), [people, company])

  const companyEmployment = useMemo(
    () => (company ? employment.filter((entry) => entry.companyId === company.id) : []),
    [employment, company],
  )

  const { current, former } = useMemo(() => {
    const occupants: Occupant[] = [
      ...companyPeople.map((person) => ({
        key: person.id,
        name: person.name,
        isMe: false,
        person,
        employment: companyEmployment.find((entry) => entry.personId === person.id),
      })),
      ...companyEmployment
        .filter((entry) => entry.personId === ME)
        .map((entry) => ({ key: entry.id, name: 'You', isMe: true, employment: entry })),
    ]
    return {
      current: occupants.filter((o) => isCurrent(o.employment, today)),
      former: occupants.filter((o) => !isCurrent(o.employment, today)),
    }
  }, [companyPeople, companyEmployment, today])

  const chatPerson = chatPersonId ? people.find((person) => person.id === chatPersonId) : undefined
  const chatConversation = chatPersonId ? conversations.find((c) => c.personId === chatPersonId) : undefined

  if (!company) {
    return (
      <div>
        <p className="text-slate-600 dark:text-slate-300">Company not found.</p>
        <Link to="/job/applications" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
          Back to applications
        </Link>
      </div>
    )
  }

  return (
    <div>
      <Link to="/job/applications" className="mb-4 inline-block text-sm text-blue-600 hover:underline dark:text-blue-400">
        ← Back to applications
      </Link>

      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{company.name}</h1>
      {company.aka.length > 0 ? (
        <p className="mb-1 text-xs text-slate-400">Also known as: {company.aka.join(', ')}</p>
      ) : null}
      <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">
        {companyApplications.length} application{companyApplications.length === 1 ? '' : 's'} to this company
      </p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">Your applications</h2>
          <ul className="flex flex-col gap-2">
            {companyApplications.map((app) => (
              <li
                key={app.id}
                className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <Link to={`/job/applications/${app.id}`} className="text-slate-700 hover:underline dark:text-slate-200">
                  {app.role}
                </Link>
                <Chip tone={stateChipTone(app)}>{stateChipLabel(app)}</Chip>
              </li>
            ))}
            {companyApplications.length === 0 ? <p className="text-sm text-slate-400">No applications yet.</p> : null}
          </ul>
        </section>

        <section className="flex flex-col gap-5">
          <OccupantGroup
            title="Works here now"
            occupants={current}
            emptyText="No one you know works here right now."
            onAddFriend={addFriend}
            onMessage={setChatPersonId}
          />
          {former.length > 0 ? (
            <OccupantGroup
              title="Used to work here"
              occupants={former}
              emptyText=""
              onAddFriend={addFriend}
              onMessage={setChatPersonId}
            />
          ) : null}
        </section>
      </div>

      {chatPerson ? (
        <ChatPanel
          person={chatPerson}
          conversation={chatConversation}
          onSend={(text) => sendMessage(chatPerson.id, text)}
          onClose={() => setChatPersonId(null)}
        />
      ) : null}
    </div>
  )
}

function OccupantGroup({
  title,
  occupants,
  emptyText,
  onAddFriend,
  onMessage,
}: {
  title: string
  occupants: Occupant[]
  emptyText: string
  onAddFriend: (personId: string) => void
  onMessage: (personId: string) => void
}) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h2>
      <ul className="flex flex-col gap-2">
        {occupants.map((occupant) =>
          occupant.isMe ? (
            <MeRow key={occupant.key} employment={occupant.employment!} />
          ) : (
            <li
              key={occupant.key}
              className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center gap-2">
                <span className="text-slate-700 dark:text-slate-200">{occupant.name}</span>
                {occupant.person?.openToReferrals ? (
                  <Chip tone="green" title="Willing to refer people for open roles at this company">
                    Happy to refer
                  </Chip>
                ) : null}
                {occupant.person?.isFriend ? (
                  <Chip tone="purple" title="Someone you've added as a contact">
                    Your connection
                  </Chip>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2">
                {occupant.person && !occupant.person.isFriend ? (
                  <button
                    onClick={() => onAddFriend(occupant.person!.id)}
                    className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Add connection
                  </button>
                ) : null}
                <button
                  onClick={() => onMessage(occupant.person!.id)}
                  className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
                >
                  Message
                </button>
              </div>
            </li>
          ),
        )}
        {occupants.length === 0 && emptyText ? <p className="text-sm text-slate-400">{emptyText}</p> : null}
      </ul>
    </div>
  )
}

function MeRow({ employment }: { employment: Employment }) {
  const { setEmploymentEndDate } = useJobData()
  const [showEndDateForm, setShowEndDateForm] = useState(false)
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10))

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setEmploymentEndDate(employment.id, endDate)
    setShowEndDateForm(false)
  }

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-700 dark:text-slate-200">You</span>
          <span className="text-xs text-slate-400">
            {employment.endDate ? `${employment.startDate} – ${employment.endDate}` : `Since ${employment.startDate}`}
          </span>
        </div>
        {!employment.endDate && !showEndDateForm ? (
          <button
            onClick={() => setShowEndDateForm(true)}
            className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Add end date
          </button>
        ) : null}
      </div>
      {showEndDateForm ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="date"
            value={endDate}
            onChange={(event) => setEndDate(event.target.value)}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-800"
          />
          <button
            type="submit"
            className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
          >
            Save
          </button>
        </form>
      ) : null}
    </li>
  )
}
