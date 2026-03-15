"use client"

import React, { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordStrength } from "../_components/password-strength"
import { useAuth } from "@/app/@components/providers/auth-provider"

function RegisterInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams])

  const { user, register, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isLoading) return
    if (!user) return
    router.replace(next)
  }, [isLoading, next, router, user])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    try {
      await register(email, password, { remember })
      router.push(next)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create account</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <PasswordStrength password={password} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm password</Label>
            <Input
              id="confirm"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="text-foreground underline underline-offset-4" href="/login">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Create account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      }
    >
      <RegisterInner />
    </Suspense>
  )
}
