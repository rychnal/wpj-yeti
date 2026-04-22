export type Yeti = {
  id: number
  name: string
  gender: string
  height_cm: number
  weight_kg: number
  location: string
  description: string | null
  photo: string | null
  created_at: string
  avg_rating: string
  rating_count: number
}

export type MonthlyStat = {
  year: number
  month: number
  total_ratings: number
  avg_score: string
  min_score: number
  max_score: number
}

export type YetiSummary = {
  id: number
  name: string
  location: string
  photo: string | null
  total_ratings: number
  avg_score: string
}

// server-side (internal Docker network)
const SERVER_API = process.env.API_URL ?? 'http://localhost:8000/api'

// client-side (browser) — MEDIA_BASE derived so no extra env var needed
export const CLIENT_API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api'
export const MEDIA_BASE = CLIENT_API.replace(/\/api$/, '')

export async function getTopYeti(): Promise<Yeti[]> {
  const res = await fetch(`${SERVER_API}/yeti`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch yeti')
  return res.json()
}

export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  const res = await fetch(`${SERVER_API}/stats/monthly`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch monthly stats')
  return res.json()
}

export async function getSummaryStats(): Promise<YetiSummary[]> {
  const res = await fetch(`${SERVER_API}/stats/summary`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch summary stats')
  return res.json()
}
