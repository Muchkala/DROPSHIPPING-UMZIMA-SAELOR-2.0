"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "@/lib/utils"

interface ChartContextValue {
  color?: string
  index?: number
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

const Chart = React.forwardRef<
  React.ElementRef<typeof RechartsPrimitive.ResponsiveContainer>,
  React.ComponentPropsWithoutRef<typeof RechartsPrimitive.ResponsiveContainer>
>(({ className, children, ...props }, ref) => (
  <RechartsPrimitive.ResponsiveContainer
    ref={ref}
    className={cn("", className)}
    {...props}
  >
    <ChartContext.Provider value={{}}>
      {children}
    </ChartContext.Provider>
  </RechartsPrimitive.ResponsiveContainer>
))
Chart.displayName = "Chart"

const ChartTooltip = RechartsPrimitive.Tooltip

interface TooltipContentProps {
  className?: string
  active?: boolean
  payload?: Array<{ name: string; value: number; color: string }>
  label?: string
}

const ChartTooltipContent = React.forwardRef<
  React.ElementRef<typeof RechartsPrimitive.Tooltip>,
  TooltipContentProps
>(({ className, active, payload, label }, ref) => {
  if (!active || !payload?.length) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border bg-background px-3 py-2 text-sm shadow-md",
        className
      )}
    >
      <div className="font-medium">{label}</div>
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color as string }} />
          <span className="text-muted-foreground">
            {entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  )
})
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartTooltip, ChartTooltipContent }
