import type { Company } from '../../types/job'

export const companies: Company[] = [
  { id: 'c1', name: 'Booking.com', aka: ['Booking', 'booking.com'] },
  { id: 'c2', name: 'Spotify', aka: [] },
  { id: 'c3', name: 'Adyen', aka: ['Adyen N.V.'] },
  { id: 'c4', name: 'ASML', aka: [] },
  { id: 'c5', name: 'Mollie', aka: [] },
  { id: 'c6', name: 'bunq', aka: ['Bunq'] },
  { id: 'c7', name: 'Uber', aka: ['Uber.com'] },
  { id: 'c8', name: 'N26', aka: [] },
]

export function resolveCompanyId(rawName: string): string | undefined {
  const needle = rawName.trim().toLowerCase()
  const match = companies.find(
    (company) => company.name.toLowerCase() === needle || company.aka.some((aka) => aka.toLowerCase() === needle),
  )
  return match?.id
}

export function findCompany(id: string): Company | undefined {
  return companies.find((company) => company.id === id)
}
