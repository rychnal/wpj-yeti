'use client'

import Link from 'next/link'
import { useState } from 'react'
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push('/')
    setMenuOpen(false)
  }

  return (
    <nav className="bg-zinc-800 border-b border-zinc-700 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
      <Link href="/" className="font-bold text-white text-xl tracking-tight">
        Yetinder
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-4">
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
            <Link href="/login" className="text-sm text-zinc-300 hover:text-white transition-colors">
              Přihlásit se
            </Link>
          )}
        </div>
      </div>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
        aria-label="Menu"
      >
        <span className={`block w-6 h-0.5 bg-zinc-300 transition-transform ${menuOpen ? 'translate-y-2 rotate-45' : ''}`} />
        <span className={`block w-6 h-0.5 bg-zinc-300 transition-opacity ${menuOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-0.5 bg-zinc-300 transition-transform ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`} />
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-zinc-800 border-b border-zinc-700 py-2 flex flex-col">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-blue-400 bg-zinc-700/50'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-700/50'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-t border-zinc-700 mt-2 pt-2">
            {user ? (
              <>
                <Link
                  href="/stats/me"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 block transition-colors"
                >
                  {user.email}
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-6 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-zinc-700/50 w-full text-left transition-colors"
                >
                  Odhlásit
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="px-6 py-3 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/50 block transition-colors"
              >
                Přihlásit se
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
