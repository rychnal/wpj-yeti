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

export type Period = 'day' | 'month' | 'year'

export type MonthlyStat = {
  year: number
  month: number
  total_ratings: number
  avg_score: string
  min_score: number
  max_score: number
}

export type ChartBucket = {
  label: string
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

const MONTHS = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro']

export async function getMonthlyStats(): Promise<MonthlyStat[]> {
  const res = await fetch(`${SERVER_API}/stats/monthly`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch monthly stats')
  return res.json()
}

export async function getChartStats(period: Period): Promise<ChartBucket[]> {
  const res = await fetch(`${SERVER_API}/stats/monthly?period=${period}`, { cache: 'no-store' })
  if (!res.ok) return []
  const raw: Record<string, number>[] = await res.json()
  return buildChartBuckets(raw, period)
}

function emptyBucket(label: string): ChartBucket {
  return { label, total_ratings: 0, avg_score: '0.0', min_score: 0, max_score: 0 }
}

function fromRaw(label: string, d: Record<string, number>): ChartBucket {
  return {
    label,
    total_ratings: Number(d.total_ratings),
    avg_score: String(d.avg_score),
    min_score: Number(d.min_score),
    max_score: Number(d.max_score),
  }
}

function buildChartBuckets(raw: Record<string, number>[], period: Period): ChartBucket[] {
  const now = new Date()

  if (period === 'day') {
    return Array.from({ length: 24 }, (_, hour) => {
      const found = raw.find(d => Number(d.hour) === hour)
      return found ? fromRaw(`${hour}h`, found) : emptyBucket(`${hour}h`)
    })
  }

  if (period === 'month') {
    return Array.from({ length: 30 }, (_, i) => {
      const d = new Date(now)
      d.setDate(d.getDate() - (29 - i))
      const year = d.getFullYear()
      const month = d.getMonth() + 1
      const day = d.getDate()
      const found = raw.find(r => Number(r.year) === year && Number(r.month) === month && Number(r.day) === day)
      return found ? fromRaw(String(day), found) : emptyBucket(String(day))
    })
  }

  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
    const year = d.getFullYear()
    const month = d.getMonth() + 1
    const found = raw.find(r => Number(r.year) === year && Number(r.month) === month)
    return found ? fromRaw(MONTHS[month - 1], found) : emptyBucket(MONTHS[month - 1])
  })
}

export async function getSummaryStats(period: Period = 'year'): Promise<YetiSummary[]> {
  const res = await fetch(`${SERVER_API}/stats/summary?period=${period}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to fetch summary stats')
  return res.json()
}
