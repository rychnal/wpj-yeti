'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { type AuthUser, getStoredUser, storeUser, clearUser } from '../lib/auth'

type AuthContextType = {
  user: AuthUser | null
  initialized: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  initialized: false,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    setUser(getStoredUser())
    setInitialized(true)
  }, [])

  const login = (user: AuthUser) => {
    storeUser(user)
    setUser(user)
  }

  const logout = () => {
    clearUser()
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, initialized, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
