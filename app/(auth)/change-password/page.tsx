"use client"

import React, { Suspense, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordStrength } from "../_components/password-strength"
import { useAuth } from "@/app/@components/providers/auth-provider"

function ChangePasswordInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const reset = useMemo(() => searchParams.get("reset") === "1", [searchParams])
  const email = useMemo(() => searchParams.get("email") || "", [searchParams])

  const { user, changePassword, isLoading } = useAuth()

  const isResetFlow = reset || !user

  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (newPassword !== confirm) {
      setError("Passwords do not match")
      return
    }

    try {
      await changePassword(isResetFlow ? "" : oldPassword, newPassword)
      router.replace("/login")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Change password failed")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isResetFlow ? "Set a new password" : "Change password"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isResetFlow && email && (
          <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Resetting password for <span className="font-medium text-foreground">{email}</span>
          </div>
        )}

        {error && (
          <div className="rounded-md border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {!isResetFlow && (
            <div className="space-y-2">
              <Label htmlFor="old">Current password</Label>
              <Input id="old" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="new">New password</Label>
            <Input id="new" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <PasswordStrength password={newPassword} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Update password"}
          </Button>
        </form>

        <div className="text-sm text-muted-foreground">
          <Link className="text-foreground underline underline-offset-4" href="/login">
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ChangePasswordPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      }
    >
      <ChangePasswordInner />
    </Suspense>
  )
}
