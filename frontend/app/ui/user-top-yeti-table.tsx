'use client'

import { useState, useEffect } from 'react'
import { CLIENT_API } from '../lib/api'
import { useAuth } from './auth-provider'
import Avatar from './avatar'
import Stars from './stars'

type UserRating = {
  id: number
  name: string
  location: string
  photo: string | null
  score: number
  rated_at: string
}

export default function UserTopYetiTable() {
  const { user, initialized } = useAuth()
  const [ratings, setRatings] = useState<UserRating[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!initialized || !user) return
    setLoading(true)
    fetch(`${CLIENT_API}/stats/user/${user.id}`)
      .then(r => r.json())
      .then(data => setRatings(data))
      .finally(() => setLoading(false))
  }, [initialized, user?.id])

  if (!initialized || !user) return null

  const topYetis = [...ratings].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10)

  return (
    <div className="bg-zinc-800 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-700">
        <h2 className="text-lg font-semibold">Moji top Yeti</h2>
      </div>
      <div className="overflow-x-auto">
      <table className="w-full min-w-[450px] text-sm">
        <thead>
          <tr className="border-b border-zinc-700 text-zinc-400 text-left">
            <th className="px-4 py-3 w-10"></th>
            <th className="px-4 py-3">Jméno</th>
            <th className="px-4 py-3">Bydliště</th>
            <th className="px-4 py-3">Moje hodnocení</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">Načítám...</td>
            </tr>
          )}
          {!loading && topYetis.map((row) => (
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
            </tr>
          ))}
          {!loading && topYetis.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-10 text-center text-zinc-400">
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
