import { getMonthlyStats, getSummaryStats, getTopYeti } from '../lib/api'
import StatsChart from '../ui/stats-chart'

const MONTHS = ['Led', 'Úno', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Čvc', 'Srp', 'Zář', 'Říj', 'Lis', 'Pro']

export default async function StatsPage() {
  const [monthly, summary, yetis] = await Promise.all([
    getMonthlyStats(),
    getSummaryStats(),
    getTopYeti(),
  ])

  const totalRatings = summary.reduce((s, y) => s + Number(y.total_ratings), 0)
  const avgScore =
    summary.length > 0
      ? (summary.reduce((s, y) => s + Number(y.avg_score), 0) / summary.length).toFixed(1)
      : '0.0'

  const currentYear = monthly[0]?.year ?? new Date().getFullYear()
  const currentYearData = monthly.filter((m) => m.year === currentYear)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Statistiky hodnocení</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'celkem hodnocení', value: totalRatings },
          { label: 'průměrné skóre', value: avgScore },
          { label: 'počet Yetů', value: yetis.length },
        ].map((card) => (
          <div key={card.label} className="bg-zinc-800 rounded-xl p-5">
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-zinc-400 text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-zinc-800 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold mb-5">
          Hodnocení po měsících ({currentYear})
        </h2>
        <StatsChart data={currentYearData} />
      </div>

      {/* Monthly table */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Detail po měsících</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-left">
              <th className="px-4 py-3">Měsíc</th>
              <th className="px-4 py-3">Počet hodnocení</th>
              <th className="px-4 py-3">Průměr</th>
              <th className="px-4 py-3">Min / Max</th>
            </tr>
          </thead>
          <tbody>
            {monthly.map((row) => (
              <tr
                key={`${row.year}-${row.month}`}
                className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">
                  {MONTHS[row.month - 1]} {row.year}
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.total_ratings}</td>
                <td className="px-4 py-3 text-zinc-300">{Number(row.avg_score).toFixed(1)}</td>
                <td className="px-4 py-3 text-zinc-400">
                  {row.min_score} / {row.max_score}
                </td>
              </tr>
            ))}
            {monthly.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">
                  Žádná hodnocení zatím.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
