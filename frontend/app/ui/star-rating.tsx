'use client'

import { useState } from 'react'

type Props = {
  onRate: (score: number) => void
  disabled?: boolean
}

export default function StarRating({ onRate, disabled = false }: Props) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className={`flex gap-2 ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(n)}
          disabled={disabled}
          className={`text-4xl transition-colors leading-none ${
            n <= hovered ? 'text-amber-400' : 'text-zinc-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
