import { useState } from 'react'
import { useTeamData } from '../../state/TeamDataContext'
import { Chip } from '../../components/Chip'
import type { ChipTone } from '../../components/Chip'

const MOCK_REPOS = ['takt-y/ft_transcendence', 'takt-y/prototypes', 'takt-y/study-notes']
const MOCK_WAKATIME_PROJECTS = ['ft_transcendence', 'job-tracker-idea', 'dotfiles']

const PR_TONE: Record<string, ChipTone> = {
  draft: 'slate',
  open: 'blue',
  merged: 'purple',
  closed: 'red',
}

export default function Integrations() {
  const { integrations, pullRequests, connectGithub, connectWakatime, disconnectGithub, disconnectWakatime } = useTeamData()
  const [githubConnecting, setGithubConnecting] = useState(false)
  const [wakatimeConnecting, setWakatimeConnecting] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState(MOCK_REPOS[0])
  const [selectedProject, setSelectedProject] = useState(MOCK_WAKATIME_PROJECTS[0])

  function handleGithubConnect() {
    setGithubConnecting(true)
    window.setTimeout(() => {
      setGithubConnecting(false)
      connectGithub(selectedRepo)
    }, 1200)
  }

  function handleWakatimeConnect() {
    setWakatimeConnecting(true)
    window.setTimeout(() => {
      setWakatimeConnecting(false)
      connectWakatime(selectedProject)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Integrations</h1>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">GitHub</h2>
          {integrations.github.connected ? <Chip tone="green">Connected</Chip> : <Chip tone="slate">Not connected</Chip>}
        </div>

        {!integrations.github.connected ? (
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
              Repository
              <select
                value={selectedRepo}
                onChange={(event) => setSelectedRepo(event.target.value)}
                className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                {MOCK_REPOS.map((repo) => (
                  <option key={repo} value={repo}>
                    {repo}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleGithubConnect}
              disabled={githubConnecting}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {githubConnecting ? 'Connecting…' : 'Connect GitHub'}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
              Repository <span className="font-medium text-slate-900 dark:text-white">{integrations.github.repo}</span>{' '}
              — imported {pullRequests.length} pull requests.
            </p>
            <ul className="mb-3 flex flex-col gap-1.5">
              {pullRequests.map((pr) => (
                <li key={pr.id} className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-1.5 text-sm dark:bg-slate-800">
                  <span className="text-slate-700 dark:text-slate-200">
                    #{pr.number} {pr.title}
                  </span>
                  <Chip tone={PR_TONE[pr.state]}>{pr.state}</Chip>
                </li>
              ))}
            </ul>
            <button
              onClick={disconnectGithub}
              className="text-sm text-red-600 hover:underline dark:text-red-400"
            >
              Disconnect
            </button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">WakaTime</h2>
          {integrations.wakatime.connected ? <Chip tone="green">Connected</Chip> : <Chip tone="slate">Not connected</Chip>}
        </div>

        {!integrations.wakatime.connected ? (
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col text-xs text-slate-500 dark:text-slate-400">
              Map to project
              <select
                value={selectedProject}
                onChange={(event) => setSelectedProject(event.target.value)}
                className="mt-1 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800"
              >
                {MOCK_WAKATIME_PROJECTS.map((wtProject) => (
                  <option key={wtProject} value={wtProject}>
                    {wtProject}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={handleWakatimeConnect}
              disabled={wakatimeConnecting}
              className="rounded-md bg-slate-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900"
            >
              {wakatimeConnecting ? 'Connecting…' : 'Connect WakaTime'}
            </button>
          </div>
        ) : (
          <div>
            <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
              Mapped to WakaTime project{' '}
              <span className="font-medium text-slate-900 dark:text-white">{integrations.wakatime.mappedProject}</span>.
              Time entries tagged "wakatime" sync automatically.
            </p>
            <button onClick={disconnectWakatime} className="text-sm text-red-600 hover:underline dark:text-red-400">
              Disconnect
            </button>
          </div>
        )}
      </section>
    </div>
  )
}
