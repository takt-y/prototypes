import type { AppEvent, EventSource } from '../../types/job'

// [applicationId, source, text, date]
const rows: [string, EventSource, string, string][] = [
  ['a1', 'manual', 'Submitted application', '2026-08-20'],
  ['a1', 'extension', 'Autofilled application via browser extension', '2026-08-20'],
  ['a1', 'email', 'Received application confirmation email', '2026-08-21'],

  ['a2', 'manual', 'Submitted application', '2026-07-02'],
  ['a2', 'email', 'Received take-home assignment', '2026-07-10'],
  ['a2', 'manual', 'Submitted take-home assignment', '2026-07-15'],
  ['a2', 'email', 'Rejection email received', '2026-07-22'],

  ['a3', 'extension', 'Application autofilled on Spotify Jobs', '2026-08-28'],
  ['a3', 'email', 'Recruiter screen invite', '2026-09-02'],
  ['a3', 'manual', 'Completed recruiter call', '2026-09-04'],

  ['a4', 'manual', 'Submitted application', '2026-09-01'],
  ['a4', 'email', 'Application received confirmation', '2026-09-01'],

  ['a5', 'manual', 'Submitted application', '2026-06-15'],
  ['a5', 'email', 'Interview invite', '2026-06-25'],
  ['a5', 'manual', 'Completed onsite interviews', '2026-07-05'],
  ['a5', 'email', 'Offer received', '2026-07-12'],

  ['a6', 'extension', 'Application autofilled on ASML careers site', '2026-09-05'],

  ['a7', 'manual', 'Submitted application', '2026-08-22'],
  ['a7', 'email', 'First interview scheduled', '2026-08-29'],
  ['a7', 'manual', 'Completed first interview', '2026-09-03'],
  ['a7', 'email', 'Second interview invite', '2026-09-09'],

  ['a8', 'manual', 'Submitted application', '2026-09-08'],
  ['a8', 'manual', 'Completed culture fit call', '2026-09-12'],

  ['a9', 'manual', 'Submitted application', '2026-05-30'],
  ['a9', 'email', 'Rejection email received', '2026-06-10'],

  ['a10', 'extension', 'Application autofilled on Uber careers', '2026-09-10'],
  ['a10', 'email', 'Coding assessment link received', '2026-09-12'],

  ['a11', 'manual', 'Submitted application', '2026-08-12'],
  ['a11', 'email', 'Phone screen invite', '2026-08-18'],
  ['a11', 'manual', 'Completed phone screen', '2026-08-24'],
  ['a11', 'email', 'Onsite loop scheduled', '2026-09-01'],

  ['a12', 'manual', 'Applied via LinkedIn Easy Apply', '2026-09-03'],

  ['a13', 'manual', 'Submitted application', '2026-06-01'],
  ['a13', 'email', 'Interview invite', '2026-06-08'],
  ['a13', 'manual', 'Completed interviews', '2026-06-20'],
  ['a13', 'email', 'Offer received', '2026-06-28'],

  ['a14', 'manual', 'Submitted application', '2026-09-11'],

  ['a15', 'manual', 'Submitted application', '2026-04-18'],
  ['a15', 'email', 'Rejection email received', '2026-04-30'],
]

export const events: AppEvent[] = rows.map(([applicationId, source, text, date], index) => ({
  id: `ev${index + 1}`,
  applicationId,
  source,
  text,
  date,
}))
