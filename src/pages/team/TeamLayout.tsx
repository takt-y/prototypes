import { Outlet } from 'react-router-dom'
import { TopBar } from '../../components/TopBar'
import { NavTab } from '../../components/NavTab'
import { TeamDataProvider } from '../../state/TeamDataContext'

export default function TeamLayout() {
  return (
    <TeamDataProvider>
      <div className="min-h-svh bg-slate-50 dark:bg-slate-950">
        <TopBar
          name="Team Project Tracker"
          nav={
            <>
              <NavTab to="/team/board">Board</NavTab>
              <NavTab to="/team/dashboard">Dashboard</NavTab>
              <NavTab to="/team/integrations">Integrations</NavTab>
            </>
          }
        />
        <main className="mx-auto max-w-6xl px-4 py-6">
          <Outlet />
        </main>
      </div>
    </TeamDataProvider>
  )
}
