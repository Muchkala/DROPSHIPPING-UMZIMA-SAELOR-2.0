"use client"

import React, { Suspense, useEffect, useMemo, useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/app/@components/providers/auth-provider"
import { Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

function LoginInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = useMemo(() => searchParams.get("next") || "/", [searchParams])

  const { user, login, isLoading } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string}>({})

  useEffect(() => {
    if (isLoading) return
    if (!user) return
    router.replace(next)
  }, [isLoading, next, router, user])

  // Enhanced form validation
  const validateForm = useCallback(() => {
    const errors: {email?: string; password?: string} = {}
    
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address"
    }
    
    if (!password) {
      errors.password = "Password is required"
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }
    
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }, [email, password])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      await login(email, password, { remember })
      // Success will be handled by the useEffect redirect
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 flex items-center gap-2 animate-pulse">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (fieldErrors.email) {
                    setFieldErrors(prev => ({ ...prev, email: '' }))
                  }
                }}
                placeholder="Enter your email"
                className={`transition-colors ${
                  fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                }`}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (fieldErrors.password) {
                    setFieldErrors(prev => ({ ...prev, password: '' }))
                  }
                }}
                placeholder="Enter your password"
                className={`pr-10 transition-colors ${
                  fieldErrors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-primary'
                }`}
                disabled={isSubmitting}
                aria-invalid={!!fieldErrors.password}
                aria-describedby={fieldErrors.password ? 'password-error' : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {fieldErrors.password && (
                <p id="password-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <Link className="text-sm underline underline-offset-4" href="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              <>Sign in</>
            )}
          </Button>
          <div className="text-center">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="text-foreground underline underline-offset-4" href="/register">
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card>
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
            <div className="h-10 w-full rounded bg-muted" />
          </CardContent>
        </Card>
      }
    >
      <LoginInner />
    </Suspense>
  )
}
