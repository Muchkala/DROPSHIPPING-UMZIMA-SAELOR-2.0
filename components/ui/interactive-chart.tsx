"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Area,
  AreaChart
} from "recharts"
import { cn } from "@/lib/utils"

interface InteractiveChartProps {
  data: any[]
  type: "bar" | "line" | "pie" | "area"
  dataKey?: string
  xAxisKey?: string
  colors?: string[]
  height?: number
  onBarClick?: (data: any) => void
  onLineClick?: (data: any) => void
  onPieClick?: (data: any) => void
  className?: string
}

const defaultColors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1", "#d084d0"
]

export function InteractiveChart({
  data,
  type,
  dataKey = "value",
  xAxisKey = "name",
  colors = defaultColors,
  height = 300,
  onBarClick,
  onLineClick,
  onPieClick,
  className
}: InteractiveChartProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)
  const [selectedData, setSelectedData] = React.useState<any>(null)

  const handleBarClick = (data: any, index: number) => {
    setActiveIndex(index)
    setSelectedData(data)
    onBarClick?.(data)
  }

  const handleLineClick = (data: any) => {
    setSelectedData(data)
    onLineClick?.(data)
  }

  const handlePieClick = (data: any) => {
    setSelectedData(data)
    onPieClick?.(data)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background border rounded-lg shadow-lg p-3"
        >
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </motion.div>
      )
    }
    return null
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey={dataKey}
              fill={colors[0]}
              radius={[8, 8, 0, 0]}
              onClick={handleBarClick}
              className="cursor-pointer transition-all duration-200 hover:opacity-80"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={activeIndex === index ? colors[1] : colors[0]}
                />
              ))}
            </Bar>
          </BarChart>
        )

      case "line":
        return (
          <RechartsLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, onClick: handleLineClick }}
              className="cursor-pointer"
            />
          </RechartsLineChart>
        )

      case "area":
        return (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey={xAxisKey} 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={colors[0]}
              strokeWidth={2}
              fill="url(#colorGradient)"
              className="cursor-pointer"
              onClick={handleLineClick}
            />
          </AreaChart>
        )

      case "pie":
        return (
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }: any) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={100}
              fill={colors[0]}
              dataKey={dataKey}
              onClick={handlePieClick}
              className="cursor-pointer"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </RechartsPieChart>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      {selectedData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-4 p-3 bg-muted/50 rounded-lg"
        >
          <p className="text-sm font-medium">Selected Data:</p>
          <p className="text-xs text-muted-foreground">
            {JSON.stringify(selectedData, null, 2)}
          </p>
        </motion.div>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </motion.div>
  )
}
