"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { authService, setRememberMe, type AuthUser } from "@/lib/auth"

type LoginOptions = {
  remember?: boolean
}

type AuthContextValue = {
  user: AuthUser | null
  isLoading: boolean
  login: (email: string, password: string, options?: LoginOptions) => Promise<void>
  register: (email: string, password: string, options?: LoginOptions) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  requestPasswordReset: (email: string) => Promise<{ devCode?: string }>
  verifyResetCode: (email: string, code: string) => Promise<void>
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = useCallback(async () => {
    setIsLoading(true)
    try {
      const current = await authService.getCurrentUser()
      setUser(current)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const login = useCallback(
    async (email: string, password: string, options?: LoginOptions) => {
      setIsLoading(true)
      try {
        setRememberMe(Boolean(options?.remember))
        const u = await authService.login(email, password)
        setUser(u)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const register = useCallback(
    async (email: string, password: string, options?: LoginOptions) => {
      setIsLoading(true)
      try {
        setRememberMe(Boolean(options?.remember))
        const u = await authService.register(email, password)
        setUser(u)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await authService.logout()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const requestPasswordReset = useCallback(async (email: string) => {
    setIsLoading(true)
    try {
      const sendCode = authService.sendCode
      if (!sendCode) {
        return {}
      }
      const { code } = await sendCode(email)
      return { devCode: code }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const verifyResetCode = useCallback(async (email: string, code: string) => {
    setIsLoading(true)
    try {
      const verifyCode = authService.verifyCode
      if (!verifyCode) {
        throw new Error("Email verification is coming soon")
      }
      await verifyCode(email, code)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const changePassword = useCallback(async (oldPassword: string, newPassword: string) => {
    setIsLoading(true)
    try {
      await authService.changePassword(oldPassword, newPassword)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      login,
      register,
      logout,
      refresh,
      requestPasswordReset,
      verifyResetCode,
      changePassword
    }),
    [user, isLoading, login, register, logout, refresh, requestPasswordReset, verifyResetCode, changePassword]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return ctx
}
