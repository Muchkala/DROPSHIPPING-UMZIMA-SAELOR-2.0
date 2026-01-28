"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/app/@components/providers/auth-provider"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { requestPasswordReset, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [devCode, setDevCode] = useState<string | null>(null)
  const [open, setOpen] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await requestPasswordReset(email)
      setDevCode(res.devCode ?? null)
      setOpen(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed")
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Forgot password</CardTitle>
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

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send verification code"}
            </Button>
          </form>

          <div className="text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link className="text-foreground underline underline-offset-4" href="/login">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check your email</DialogTitle>
            <DialogDescription>
              In production, we would email a verification code. In development mode we show it here.
            </DialogDescription>
          </DialogHeader>

          {devCode && (
            <div className="rounded-md border bg-muted/40 px-4 py-3 text-sm">
              <div className="text-xs text-muted-foreground mb-1">DEV MODE: Verification code</div>
              <div className="font-mono text-lg tracking-widest">{devCode}</div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1"
              onClick={() => router.push(`/verify-code?email=${encodeURIComponent(email)}`)}
            >
              Verify code
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
