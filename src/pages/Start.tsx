import { Link } from 'react-router-dom'

interface IdeaCard {
  to: string
  title: string
  description: string
}

const ideas: IdeaCard[] = [
  {
    to: '/team/board',
    title: 'Team Project Tracker',
    description: 'Organise team study-project work: tasks, estimated vs actual hours, and GitHub activity.',
  },
  {
    to: '/job/applications',
    title: 'Job Tracker',
    description: 'A personal job application tracker with minimal data entry and a shared layer for finding referrals.',
  },
]

export default function Start() {
  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col items-center justify-center px-4 py-16">
      <h1 className="mb-2 text-center text-3xl font-semibold text-slate-900 dark:text-white">Idea Prototypes</h1>
      <p className="mb-10 max-w-xl text-center text-slate-500 dark:text-slate-400">
        Two clickable prototypes to compare. Pick one to explore its core screens.
      </p>
      <div className="grid w-full gap-6 sm:grid-cols-2">
        {ideas.map((idea) => (
          <div
            key={idea.to}
            className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div>
              <h2 className="mb-2 text-xl font-semibold text-slate-900 dark:text-white">{idea.title}</h2>
              <p className="mb-6 text-sm text-slate-500 dark:text-slate-400">{idea.description}</p>
            </div>
            <Link
              to={idea.to}
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            >
              Open
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
