import { getTopYeti } from './lib/api'
import Stars from './ui/stars'
import Avatar from './ui/avatar'

const GENDER: Record<string, string> = { male: 'Muž', female: 'Žena', unknown: 'Neznámé' }

function RankBadge({ rank }: { rank: number }) {
  const styles = [
    'bg-amber-400 text-zinc-900',
    'bg-zinc-400 text-zinc-900',
    'bg-amber-700 text-white',
  ]
  if (rank <= 3) {
    return (
      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${styles[rank - 1]}`}>
        {rank}
      </div>
    )
  }
  return <span className="text-zinc-500 text-sm pl-2">{rank}</span>
}

export default async function Page() {
  const yetis = await getTopYeti()

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Top 10 nejlépe hodnocených Yetů</h1>
      <p className="text-zinc-400 text-sm mb-6">Seřazeno podle průměrného hodnocení</p>

      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-left">
              <th className="px-4 py-3 w-12">#</th>
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Jméno</th>
              <th className="px-4 py-3">Pohlaví</th>
              <th className="px-4 py-3">Výška</th>
              <th className="px-4 py-3">Váha</th>
              <th className="px-4 py-3">Bydliště</th>
              <th className="px-4 py-3">Hodnocení</th>
            </tr>
          </thead>
          <tbody>
            {yetis.map((yeti, i) => (
              <tr
                key={yeti.id}
                className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
              >
                <td className="px-4 py-2">
                  <RankBadge rank={i + 1} />
                </td>
                <td className="px-2 py-2">
                  <Avatar photo={yeti.photo} name={yeti.name} size="sm" />
                </td>
                <td className="px-4 py-2 font-medium">{yeti.name}</td>
                <td className="px-4 py-2 text-zinc-300">{GENDER[yeti.gender] ?? yeti.gender}</td>
                <td className="px-4 py-2 text-zinc-300">{yeti.height_cm} cm</td>
                <td className="px-4 py-2 text-zinc-300">{yeti.weight_kg} kg</td>
                <td className="px-4 py-2 text-zinc-300">{yeti.location}</td>
                <td className="px-4 py-2">
                  <Stars score={Number(yeti.avg_rating)} />
                </td>
              </tr>
            ))}
            {yetis.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-zinc-400">
                  Zatím žádní Yeti.{' '}
                  <a href="/add" className="text-blue-400 hover:underline">
                    Přidat prvního!
                  </a>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
