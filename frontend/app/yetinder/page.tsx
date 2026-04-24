'use client'

import { useState, useEffect, useRef } from 'react'
import { CLIENT_API, type Yeti } from '../lib/api'
import { useAuth } from '../ui/auth-provider'
import StarRating from '../ui/star-rating'
import Avatar from '../ui/avatar'

const GENDER: Record<string, string> = { male: 'Muž', female: 'Žena', unknown: 'Neznámé' }
const REFETCH_THRESHOLD = 1

export default function YetinderPage() {
  const { user, initialized } = useAuth()
  const [queue, setQueue] = useState<Yeti[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [rated, setRated] = useState(false)
  const [selectedScore, setSelectedScore] = useState(0)
  const fetchingMoreRef = useRef(false)
  const canFetchMoreRef = useRef(true)

  useEffect(() => {
    if (!initialized) return
    if (!user) {
      setLoading(false)
      return
    }
    canFetchMoreRef.current = true
    fetchingMoreRef.current = false

    const controller = new AbortController()
    const params = new URLSearchParams({ user_id: String(user.id) })
    fetch(`${CLIENT_API}/yeti/match/batch?${params}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : [])
      .then((batch: Yeti[]) => {
        setQueue(batch)
        if (batch.length === 0) canFetchMoreRef.current = false
        setLoading(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          setError('Chyba při načítání.')
          setLoading(false)
        }
      })
    return () => controller.abort()
  }, [initialized, user?.id])

  useEffect(() => {
    if (!user || loading || fetchingMoreRef.current || !canFetchMoreRef.current) return
    if (queue.length === 0 || queue.length > REFETCH_THRESHOLD) return

    fetchingMoreRef.current = true
    setIsFetchingMore(true)

    const controller = new AbortController()
    const excludeIds = queue.map(y => y.id).join(',')
    const params = new URLSearchParams({ user_id: String(user.id) })
    if (excludeIds) params.set('exclude_ids', excludeIds)

    fetch(`${CLIENT_API}/yeti/match/batch?${params}`, { signal: controller.signal })
      .then(res => res.ok ? res.json() : [])
      .then((batch: Yeti[]) => {
        if (batch.length > 0) setQueue(prev => [...prev, ...batch])
        else canFetchMoreRef.current = false
        fetchingMoreRef.current = false
        setIsFetchingMore(false)
      })
      .catch(err => {
        if (err.name !== 'AbortError') {
          fetchingMoreRef.current = false
          setIsFetchingMore(false)
        }
      })

    return () => {
      controller.abort()
      fetchingMoreRef.current = false
    }
  }, [queue.length, loading, user?.id])

  const advanceQueue = () => {
    setRated(false)
    setSelectedScore(0)
    setQueue(prev => prev.slice(1))
  }

  const handleRate = async (score: number) => {
    const yeti = queue[0]
    if (!yeti || rated || !user) return
    setRated(true)
    setSelectedScore(score)
    await fetch(`${CLIENT_API}/rating/${yeti.id}/rate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, user_id: user.id }),
    })
    setTimeout(advanceQueue, 500)
  }

  const handleSkip = async () => {
    const yeti = queue[0]
    if (!yeti) return
    await fetch(`${CLIENT_API}/rating/${yeti.id}/skip`, { method: 'POST' })
    advanceQueue()
  }

  if (loading) {
    return <div className="text-center py-24 text-zinc-400 text-lg">Načítám...</div>
  }

  if (!user) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-400 mb-4">Pro hodnocení yetů se přihlas.</p>
        <a href="/login" className="text-blue-400 hover:underline">Přihlásit se</a>
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-24 text-red-400">{error}</div>
  }

  if (queue.length === 0 && !isFetchingMore) {
    return (
      <div className="text-center py-24">
        <p className="text-zinc-400 mb-4">Všechny yeti jsou již ohodnoceni.</p>
        <a href="/add" className="text-blue-400 hover:underline text-sm">Přidat nového Yetiho</a>
      </div>
    )
  }

  if (queue.length === 0) {
    return <div className="text-center py-24 text-zinc-400 text-lg">Načítám dalšího...</div>
  }

  const currentYeti = queue[0]

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Ohodnoť tohoto Yetiho</h1>
      <p className="text-center text-zinc-500 text-xs mb-4">Hodnotíš jako {user.email}</p>

      <div className="bg-zinc-800 rounded-2xl p-8 text-center shadow-xl">
        <div className="mx-auto mb-4 border-4 border-zinc-600 rounded-full w-fit">
          <Avatar photo={currentYeti.photo} name={currentYeti.name} size="md" />
        </div>

        <h2 className="text-2xl font-bold mb-1">{currentYeti.name}</h2>
        <p className="text-zinc-400 mb-5 text-sm">📍 {currentYeti.location}</p>

        <div className="flex justify-center gap-3 mb-5">
          {[
            { label: 'výška cm', value: currentYeti.height_cm },
            { label: 'váha kg', value: currentYeti.weight_kg },
            { label: 'pohlaví', value: GENDER[currentYeti.gender] ?? currentYeti.gender },
          ].map((stat) => (
            <div key={stat.label} className="bg-zinc-700 rounded-lg px-4 py-2.5 text-center min-w-[72px]">
              <div className="font-bold text-lg leading-tight">{stat.value}</div>
              <div className="text-zinc-400 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {currentYeti.description && (
          <p className="text-zinc-300 text-sm mb-6 leading-relaxed line-clamp-3">
            {currentYeti.description}
          </p>
        )}

        <div className="mb-5">
          <p className="text-zinc-400 text-sm mb-3">Ohodnoť hvězdičkami</p>
          <div className="flex justify-center">
            <StarRating onRate={handleRate} disabled={rated} selected={selectedScore} />
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
