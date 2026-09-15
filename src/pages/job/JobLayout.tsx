import { Outlet } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { NavTab } from '../../components/NavTab'
import { JobDataProvider } from '../../state/JobDataContext'

export default function JobLayout() {
  return (
    <JobDataProvider>
      <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
        <TopBar
          name="Job Tracker"
          nav={
            <>
              <NavTab to="/job/applications">Applications</NavTab>
              <NavTab to="/job/summary">Summary</NavTab>
            </>
          }
        />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </JobDataProvider>
  )
}
