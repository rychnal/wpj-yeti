'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from './auth-provider'

const links = [
  { href: '/', label: 'Top Yeti' },
  { href: '/yetinder', label: 'Yetinder' },
  { href: '/add', label: 'Přidat' },
  { href: '/stats', label: 'Statistiky' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="font-bold text-white text-xl tracking-tight">
        Yetinder
      </Link>

      <div className="flex items-center gap-4">
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

        <div className="border-l border-zinc-700 pl-4">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/stats/me"
                className="text-sm text-zinc-300 hover:text-white transition-colors truncate max-w-[180px]"
                title={user.email}
              >
                {user.email}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
              >
                Odhlásit
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Přihlásit se
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
