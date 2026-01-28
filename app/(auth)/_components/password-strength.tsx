"use client"

import React from "react"
import { cn } from "@/lib/utils"

type Strength = {
  score: 0 | 1 | 2 | 3 | 4
  label: string
}

function calculate(password: string): Strength {
  let score = 0
  if (password.length >= 8) score += 1
  if (/[A-Z]/.test(password)) score += 1
  if (/[0-9]/.test(password)) score += 1
  if (/[^A-Za-z0-9]/.test(password)) score += 1

  const labels = ["Very weak", "Weak", "Okay", "Strong", "Very strong"] as const
  return { score: score as Strength["score"], label: labels[score] }
}

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = calculate(password)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Password strength</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {Array.from({ length: 4 }).map((_, i) => {
          const active = i < score
          return (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full bg-muted",
                active && score <= 1 && "bg-red-500",
                active && score === 2 && "bg-yellow-500",
                active && score === 3 && "bg-blue-500",
                active && score === 4 && "bg-green-500"
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
