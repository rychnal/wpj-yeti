import { MEDIA_BASE } from '../lib/api'

type Props = {
  photo: string | null
  name: string
  size?: 'sm' | 'md'
}

export default function Avatar({ photo, name, size = 'sm' }: Props) {
  const dim = size === 'sm' ? 'w-8 h-8 text-base' : 'w-24 h-24 text-5xl'

  return (
    <div className={`${dim} rounded-full overflow-hidden bg-zinc-700 border border-zinc-600 flex items-center justify-center shrink-0`}>
      {photo ? (
        <img
          src={`${MEDIA_BASE}/uploads/yeti/${photo}`}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="select-none leading-none">🦣</span>
      )}
    </div>
  )
}
