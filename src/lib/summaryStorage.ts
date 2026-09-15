const STORAGE_PREFIX = 'job-tracker:summary:'

export interface PublicSummaryEntry {
  role: string
  companyName?: string
  stateLabel?: string
  notes?: string
}

export interface PublicSummarySnapshot {
  token: string
  revoked: boolean
  entries: PublicSummaryEntry[]
}

export function saveSummarySnapshot(token: string, snapshot: PublicSummarySnapshot) {
  try {
    localStorage.setItem(STORAGE_PREFIX + token, JSON.stringify(snapshot))
  } catch {
    // localStorage unavailable (e.g. private browsing) — the public link just won't persist.
  }
}

export function loadSummarySnapshot(token: string): PublicSummarySnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + token)
    if (!raw) return null
    return JSON.parse(raw) as PublicSummarySnapshot
  } catch {
    return null
  }
}
