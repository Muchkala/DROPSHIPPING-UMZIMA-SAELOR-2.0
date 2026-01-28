"use client"

import React, { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "../providers/auth-provider"

type RequireAuthProps = {
  enabled?: boolean
  children: React.ReactNode
}

export function RequireAuth({ enabled = true, children }: RequireAuthProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!enabled) return
    if (isLoading) return
    if (user) return

    const next = encodeURIComponent(pathname || "/")
    router.replace(`/login?next=${next}`)
  }, [enabled, isLoading, pathname, router, user])

  if (!enabled) return <>{children}</>

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return <>{children}</>
}
