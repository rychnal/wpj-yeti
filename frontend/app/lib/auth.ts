export type AuthUser = {
  id: number
  email: string
  created_at: string
}

const KEY = 'yetinder_user'

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function storeUser(user: AuthUser): void {
  localStorage.setItem(KEY, JSON.stringify(user))
}

export function clearUser(): void {
  localStorage.removeItem(KEY)
}
