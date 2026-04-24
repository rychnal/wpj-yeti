'use client'

import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { CLIENT_API } from '../lib/api'
import { useAuth } from '../ui/auth-provider'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [error, formAction, isPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      const email = (formData.get('email') as string).trim()
      try {
        const res = await fetch(`${CLIENT_API}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        if (!res.ok) {
          const err = await res.json()
          return err.error ?? 'Přihlášení selhalo.'
        }
        const user = await res.json()
        login(user)
        router.push('/')
        return null
      } catch {
        return 'Nelze se připojit k serveru.'
      }
    },
    null,
  )

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-bold mb-2 text-center">Přihlášení</h1>
      <p className="text-zinc-400 text-sm text-center mb-8">
        Zadej svůj e-mail a můžeš začít hodnotit Yeti.
      </p>

      <form action={formAction} className="bg-zinc-800 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1.5">E-mail</label>
          <input
            name="email"
            type="email"
            required
            autoFocus
            className="input"
            placeholder="vas@email.cz"
          />
        </div>

        {error && !isPending && (
          <p className="text-red-400 text-sm bg-red-400/10 px-3 py-2 rounded-lg">{error}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
        >
          {isPending ? 'Přihlašuji...' : 'Přihlásit se'}
        </button>
      </form>
    </div>
  )
}
