'use client'

import type { ChartBucket } from '../lib/api'

export default function StatsChart({ data }: { data: ChartBucket[] }) {
  if (data.length === 0) return <p className="text-zinc-400 text-sm">Žádná data k zobrazení.</p>

  const max = Math.max(...data.map((d) => d.total_ratings))

  return (
    <div className="flex items-end gap-1.5 h-36">
      {data.map((d, i) => {
        const heightPct = max > 0 ? (d.total_ratings / max) * 100 : 0
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-1 min-w-0 h-full justify-end"
          >
            <span className="text-zinc-400 text-xs">{d.total_ratings}</span>
            <div
              className="w-full bg-blue-600 hover:bg-blue-500 rounded-t transition-colors cursor-default"
              style={{ height: `${heightPct}%`, minHeight: '4px' }}
              title={`${d.label}: ${d.total_ratings} hodnocení, průměr ${Number(d.avg_score).toFixed(1)}`}
            />
            <span className="text-zinc-400 text-xs truncate w-full text-center">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
