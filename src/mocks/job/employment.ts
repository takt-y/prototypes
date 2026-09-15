import type { Employment } from '../../types/job'

export const employment: Employment[] = [
  // The user's own employment, created when application a13 (N26, Backend Engineer) got an offer.
  { id: 'emp1', personId: 'me', companyId: 'c8', applicationId: 'a13', startDate: '2026-07-01' },
  { id: 'emp2', personId: 'p2', companyId: 'c1', startDate: '2022-01-10', endDate: '2024-06-30' },
  { id: 'emp3', personId: 'p5', companyId: 'c3', startDate: '2023-03-01', endDate: '2025-01-15' },
  { id: 'emp4', personId: 'p8', companyId: 'c6', startDate: '2021-05-01' },
  { id: 'emp5', personId: 'p10', companyId: 'c8', startDate: '2024-02-01', endDate: '2027-01-01' },
]
