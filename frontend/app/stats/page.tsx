import { getChartStats, getSummaryStats, getTopYeti, type Period } from '../lib/api'
import StatsChart from '../ui/stats-chart'
import PeriodSelector from '../ui/period-selector'
import UserTopYetiTable from '../ui/user-top-yeti-table'
import Avatar from '../ui/avatar'
import Stars from '../ui/stars'

const VALID_PERIODS: Period[] = ['day', 'month', 'year']

const CHART_TITLE: Record<Period, string> = {
  day:   'Hodnocení po hodinách (posledních 24h)',
  month: 'Hodnocení po dnech (posledních 30 dní)',
  year:  'Hodnocení po měsících (posledních 12 měsíců)',
}

export default async function StatsPage(props: { searchParams: Promise<{ period?: string }> }) {
  const { period: rawPeriod } = await props.searchParams
  const period: Period = VALID_PERIODS.includes(rawPeriod as Period) ? (rawPeriod as Period) : 'year'

  const [chartData, summary, yetis] = await Promise.all([
    getChartStats(period),
    getSummaryStats(period),
    getTopYeti(),
  ])

  const totalRatings = summary.reduce((s, y) => s + Number(y.total_ratings), 0)
  const avgScore =
    summary.filter(y => Number(y.total_ratings) > 0).length > 0
      ? (
          summary.reduce((s, y) => s + Number(y.avg_score) * Number(y.total_ratings), 0) /
          totalRatings
        ).toFixed(1)
      : '0.0'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Statistiky hodnocení</h1>
        <PeriodSelector current={period} />
      </div>

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
        <h2 className="text-lg font-semibold mb-5">{CHART_TITLE[period]}</h2>
        <StatsChart data={chartData} />
      </div>

      {/* Per-yeti summary table */}
      <div className="bg-zinc-800 rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Hodnocení Yetů</h2>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[450px] text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-left">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Jméno</th>
              <th className="px-4 py-3">Bydliště</th>
              <th className="px-4 py-3">Počet hodnocení</th>
              <th className="px-4 py-3">Průměr</th>
            </tr>
          </thead>
          <tbody>
            {summary.map((row) => (
              <tr
                key={row.id}
                className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
              >
                <td className="px-4 py-2">
                  <Avatar photo={row.photo} name={row.name} size="sm" />
                </td>
                <td className="px-4 py-2 font-medium">{row.name}</td>
                <td className="px-4 py-2 text-zinc-300">{row.location}</td>
                <td className="px-4 py-2 text-zinc-300">{row.total_ratings}</td>
                <td className="px-4 py-2">
                  <Stars score={Number(row.avg_score)} />
                </td>
              </tr>
            ))}
            {summary.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  Žádná hodnocení zatím.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        </div>
      </div>

      <UserTopYetiTable />
    </div>
  )
}
