type Props = { score: number; max?: number }

export default function Stars({ score, max = 5 }: Props) {
  const rounded = Math.round(Number(score))
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-amber-400 tracking-tight">
        {'★'.repeat(rounded)}
        <span className="text-zinc-600">{'★'.repeat(max - rounded)}</span>
      </span>
      <span className="text-zinc-400 text-xs">{Number(score).toFixed(1)}</span>
    </span>
  )
}
