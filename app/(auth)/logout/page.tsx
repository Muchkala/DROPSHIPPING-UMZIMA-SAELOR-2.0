"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/app/@components/providers/auth-provider"

export default function LogoutPage() {
  const router = useRouter()
  const { logout } = useAuth()

  useEffect(() => {
    const run = async () => {
      await logout()
      router.replace("/login")
    }
    void run()
  }, [logout, router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
    </div>
  )
}
