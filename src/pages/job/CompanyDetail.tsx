import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useJobData } from '../../state/JobDataContext'
import { Chip } from '../../components/Chip'
import type { ChipTone } from '../../components/Chip'
import { ChatPanel } from '../../components/ChatPanel'
import type { ApplicationState } from '../../types/job'

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

export default function CompanyDetail() {
  const { id } = useParams<{ id: string }>()
  const { applications, findCompany, people, conversations, addFriend, sendMessage } = useJobData()
  const [chatPersonId, setChatPersonId] = useState<string | null>(null)

  const company = id ? findCompany(id) : undefined

  const companyApplications = useMemo(() => {
    if (!company) return []
    const names = new Set([company.name.toLowerCase(), ...company.aka.map((a) => a.toLowerCase())])
    return applications.filter((app) => names.has(app.companyName.toLowerCase()))
  }, [applications, company])

  const companyPeople = useMemo(() => (company ? people.filter((person) => person.companyId === company.id) : []), [people, company])

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
                <Chip tone={STATE_TONE[app.state]}>{STATE_LABEL[app.state]}</Chip>
              </li>
            ))}
            {companyApplications.length === 0 ? <p className="text-sm text-slate-400">No applications yet.</p> : null}
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">People here</h2>
          <ul className="flex flex-col gap-2">
            {companyPeople.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-700 dark:text-slate-200">{person.name}</span>
                  {person.openToReferrals ? <Chip tone="green">Open to referrals</Chip> : null}
                  {person.isFriend ? <Chip tone="purple">Friend</Chip> : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  {!person.isFriend ? (
                    <button
                      onClick={() => addFriend(person.id)}
                      className="rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      Add friend
                    </button>
                  ) : null}
                  <button
                    onClick={() => setChatPersonId(person.id)}
                    className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900"
                  >
                    Message
                  </button>
                </div>
              </li>
            ))}
            {companyPeople.length === 0 ? <p className="text-sm text-slate-400">No known contacts here.</p> : null}
          </ul>
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
