'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CLIENT_API } from '../../lib/api'
import { useAuth } from '../../ui/auth-provider'
import Avatar from '../../ui/avatar'
import Stars from '../../ui/stars'

type UserRating = {
  id: number
  name: string
  location: string
  photo: string | null
  score: number
  rated_at: string
}

export default function MeStatsPage() {
  const { user, initialized } = useAuth()
  const router = useRouter()
  const [ratings, setRatings] = useState<UserRating[]>([])
  const [fetching, setFetching] = useState(false)

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      router.push('/login')
      return
    }
    setFetching(true)
    fetch(`${CLIENT_API}/stats/user/${user.id}`)
      .then((r) => r.json())
      .then((data) => setRatings(data))
      .finally(() => setFetching(false))
  }, [initialized, user, router])

  if (!initialized || fetching) {
    return <div className="text-center py-24 text-zinc-400 text-lg">Načítám...</div>
  }

  if (!user) return null

  const totalRatings = ratings.length
  const avgScore =
    totalRatings > 0
      ? (ratings.reduce((s, r) => s + Number(r.score), 0) / totalRatings).toFixed(1)
      : '0.0'

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Moje statistiky</h1>
      <p className="text-zinc-400 text-sm mb-6">{user.email}</p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[
          { label: 'celkem hodnocení', value: totalRatings },
          { label: 'průměrné skóre', value: avgScore },
        ].map((card) => (
          <div key={card.label} className="bg-zinc-800 rounded-xl p-5">
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-zinc-400 text-sm">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-zinc-800 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-zinc-700">
          <h2 className="text-lg font-semibold">Má hodnocení</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-700 text-zinc-400 text-left">
              <th className="px-4 py-3 w-10"></th>
              <th className="px-4 py-3">Jméno</th>
              <th className="px-4 py-3">Bydliště</th>
              <th className="px-4 py-3">Hodnocení</th>
              <th className="px-4 py-3">Datum</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((row) => (
              <tr
                key={`${row.id}-${row.rated_at}`}
                className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors"
              >
                <td className="px-4 py-2">
                  <Avatar photo={row.photo} name={row.name} size="sm" />
                </td>
                <td className="px-4 py-2 font-medium">{row.name}</td>
                <td className="px-4 py-2 text-zinc-300">{row.location}</td>
                <td className="px-4 py-2">
                  <Stars score={Number(row.score)} />
                </td>
                <td className="px-4 py-2 text-zinc-400">
                  {new Date(row.rated_at).toLocaleDateString('cs-CZ')}
                </td>
              </tr>
            ))}
            {ratings.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-zinc-400">
                  Zatím jsi nehodnotil/a žádného Yetiho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
