'use client'

import { useRouter } from 'next/navigation'
import type { Period } from '../lib/api'

const LABELS: Record<Period, string> = { day: 'Den', month: 'Měsíc', year: 'Rok' }
const PERIODS: Period[] = ['day', 'month', 'year']

export default function PeriodSelector({ current }: { current: Period }) {
  const router = useRouter()

  return (
    <div className="flex gap-2">
      {PERIODS.map((p) => (
        <button
          key={p}
          onClick={() => router.push(`/stats?period=${p}`)}
          className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
            current === p
              ? 'bg-blue-600 text-white'
              : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
          }`}
        >
          {LABELS[p]}
        </button>
      ))}
    </div>
  )
}
