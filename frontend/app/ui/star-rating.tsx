'use client'

import { useState } from 'react'

type Props = {
  onRate: (score: number) => void
  disabled?: boolean
  selected?: number
}

export default function StarRating({ onRate, disabled = false, selected = 0 }: Props) {
  const [hovered, setHovered] = useState(0)

  const activeScore = hovered || selected

  return (
    <div className={`flex gap-2 ${disabled && !selected ? 'opacity-40 pointer-events-none' : ''} ${disabled && selected ? 'pointer-events-none' : ''}`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onRate(n)}
          disabled={disabled}
          className={`text-4xl transition-colors leading-none ${
            n <= activeScore ? 'text-amber-400' : 'text-zinc-600'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
