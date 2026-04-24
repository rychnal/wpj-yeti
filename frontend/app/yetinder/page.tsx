'use client'

import { useState, useEffect } from 'react'
import { CLIENT_API, type Yeti } from '../lib/api'
import { useAuth } from '../ui/auth-provider'
import StarRating from '../ui/star-rating'
import Avatar from '../ui/avatar'

const GENDER: Record<string, string> = { male: 'Muž', female: 'Žena', unknown: 'Neznámé' }

export default function YetinderPage() {
  const { user } = useAuth()
  const [yeti, setYeti] = useState<Yeti | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rated, setRated] = useState(false)
  const [selectedScore, setSelectedScore] = useState(0)

  const loadNext = async () => {
    setLoading(true)
    setError(null)
    setRated(false)
    setSelectedScore(0)
    try {
      const res = await fetch(`${CLIENT_API}/yeti/match`)
      if (!res.ok) throw new Error('Žádný yeti k dispozici.')
      setYeti(await res.json())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadNext() }, [])

  const handleRate = async (score: number) => {
    if (!yeti || rated) return
    setRated(true)
    setSelectedScore(score)
    await fetch(`${CLIENT_API}/rating/${yeti.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, user_id: user?.id ?? null }),
    })
    setTimeout(loadNext, 500)
  }

  const handleSkip = async () => {
    if (!yeti) return
    await fetch(`${CLIENT_API}/rating/${yeti.id}/skip`, { method: 'POST' })
    loadNext()
  }

  if (loading) {
    return <div className="text-center py-24 text-zinc-400 text-lg">Načítám...</div>
  }

  if (error) {
    return (
      <div className="text-center py-24">
        <p className="text-red-400 mb-4">{error}</p>
        <a href="/add" className="text-blue-400 hover:underline text-sm">Přidat nového Yetiho</a>
      </div>
    )
  }

  if (!yeti) return null

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Ohodnoť tohoto Yetiho</h1>
      {!user && (
        <p className="text-center text-zinc-500 text-sm mb-4">
          <a href="/login" className="text-blue-400 hover:underline">Přihlas se</a>
          {' '}pro možnost hodnotit.
        </p>
      )}
      {user && <p className="text-center text-zinc-500 text-xs mb-4">Hodnotíš jako {user.email}</p>}

      <div className="bg-zinc-800 rounded-2xl p-8 text-center shadow-xl">
        {/* Avatar */}
        <div className="mx-auto mb-4 border-4 border-zinc-600 rounded-full w-fit">
          <Avatar photo={yeti.photo} name={yeti.name} size="md" />
        </div>

        {/* Name & location */}
        <h2 className="text-2xl font-bold mb-1">{yeti.name}</h2>
        <p className="text-zinc-400 mb-5 text-sm">📍 {yeti.location}</p>

        {/* Stat badges */}
        <div className="flex justify-center gap-3 mb-5">
          {[
            { label: 'výška cm', value: yeti.height_cm },
            { label: 'váha kg', value: yeti.weight_kg },
            { label: 'pohlaví', value: GENDER[yeti.gender] ?? yeti.gender },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-700 rounded-lg px-4 py-2.5 text-center min-w-[72px]">
              <div className="font-bold text-lg leading-tight">{stat.value}</div>
              <div className="text-zinc-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {yeti.description && (
          <p className="text-zinc-300 text-sm mb-6 leading-relaxed line-clamp-3">
            {yeti.description}
          </p>
        )}

        {/* Star rating */}
        <div className="mb-5">
          <p className="text-zinc-400 text-sm mb-3">Ohodnoť hvězdičkami</p>
          <div className="flex justify-center">
            <StarRating onRate={handleRate} disabled={!user || rated} selected={selectedScore} />
          </div>
          {rated && <p className="text-amber-400 text-sm mt-2">Hodnocení uloženo ✓</p>}
        </div>

        <button
          onClick={handleSkip}
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          Přeskočit →
        </button>
      </div>
    </div>
  )
}
