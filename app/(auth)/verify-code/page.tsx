"use client"

import React, { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/@components/providers/auth-provider"

function VerifyCodeInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialEmail = useMemo(() => searchParams.get("email") || "", [searchParams])

  const { verifyResetCode, isLoading } = useAuth()

  const [email, setEmail] = useState(initialEmail)
  const [code, setCode] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await verifyResetCode(email, code)
      router.push(`/change-password?reset=1&email=${encodeURIComponent(email)}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify code</CardTitle>
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
            <Label htmlFor="code">6-digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          Didn&apos;t get a code?{" "}
          <Link className="text-foreground underline underline-offset-4" href="/forgot-password">
            Send again
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyCodePage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Verify code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      }
    >
      <VerifyCodeInner />
    </Suspense>
  )
}
