import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import TeamLayout from './pages/team/TeamLayout'
import Board from './pages/team/Board'
import TaskDetail from './pages/team/TaskDetail'
import Dashboard from './pages/team/Dashboard'
import Integrations from './pages/team/Integrations'
import JobLayout from './pages/job/JobLayout'
import Applications from './pages/job/Applications'
import ApplicationDetail from './pages/job/ApplicationDetail'
import CompanyDetail from './pages/job/CompanyDetail'
import Summary from './pages/job/Summary'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Start />} />

        <Route path="/team" element={<TeamLayout />}>
          <Route index element={<Navigate to="board" replace />} />
          <Route path="board" element={<Board />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="integrations" element={<Integrations />} />
        </Route>

        <Route path="/job" element={<JobLayout />}>
          <Route index element={<Navigate to="applications" replace />} />
          <Route path="applications" element={<Applications />} />
          <Route path="applications/:id" element={<ApplicationDetail />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="summary" element={<Summary />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
