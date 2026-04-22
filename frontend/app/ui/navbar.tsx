'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Top Yeti' },
  { href: '/yetinder', label: 'Yetinder' },
  { href: '/add', label: 'Přidat' },
  { href: '/stats', label: 'Statistiky' },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="font-bold text-white text-xl tracking-tight">
        Yetinder
      </Link>
      <div className="flex gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${
              pathname === link.href
                ? 'bg-blue-600 text-white'
                : 'text-zinc-300 hover:text-white hover:bg-zinc-700'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
