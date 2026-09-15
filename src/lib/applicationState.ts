import type { ChipTone } from '../components/Chip'
import type { Application, ApplicationState } from '../types/job'

export const STATE_LABEL: Record<ApplicationState, string> = {
  applied: 'Applied',
  'in-process': 'In process',
  result: 'Result',
}

type StateLike = Pick<Application, 'state' | 'outcome'>

export function stateChipLabel(app: StateLike): string {
  if (app.state !== 'result') return STATE_LABEL[app.state]
  if (!app.outcome) return 'Result'
  return app.outcome === 'offer' ? 'Offer' : 'Rejected'
}

export function stateChipTone(app: StateLike): ChipTone {
  if (app.state === 'applied') return 'blue'
  if (app.state === 'in-process') return 'amber'
  if (app.outcome === 'offer') return 'green'
  if (app.outcome === 'rejected') return 'red'
  return 'slate'
}
