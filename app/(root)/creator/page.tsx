"use client"

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ErrorBoundary from "@/components/error-boundary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  FileText, 
  Archive, 
  Plus,
  TrendingUp,
  Users,
  Settings,
  DollarSign,
  ShoppingCart,
  Eye,
  Target,
  Zap,
  BarChart3,
  LineChart,
  PieChart,
  Activity,
  ArrowUp,
  ArrowDown,
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { motion } from "framer-motion"
import { AnimatedCounter } from "@/components/ui/animated-counter"
import { TrendIndicator } from "@/components/ui/trend-indicator"
import { EmptyState } from "@/components/ui/empty-state"
import { ProgressRing } from "@/components/ui/progress-ring"
import { ActivityTimeline } from "@/components/ui/activity-timeline"
import { HoverCard, StaggeredList, Pulse } from "@/components/ui/micro-interactions"
import { StatusIndicator } from "@/components/ui/status-indicator"
import { Chart, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, LineChart as RechartsLineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

// Mock analytics data with previous values for trends
const currentStats = {
  totalRevenue: 29966,
  previousRevenue: 26637,
  totalOrders: 178,
  previousOrders: 164,
  activeProducts: 24,
  previousProducts: 22,
  storeViews: 12500,
  previousViews: 10150
}
const salesData = [
  { name: "Jan", sales: 4000, orders: 24 },
  { name: "Feb", sales: 3000, orders: 18 },
  { name: "Mar", sales: 5000, orders: 32 },
  { name: "Apr", sales: 2780, orders: 15 },
  { name: "May", sales: 6890, orders: 41 },
  { name: "Jun", sales: 7390, orders: 48 },
]

const categoryData = [
  { name: "Electronics", value: 45, color: "#0088FE" },
  { name: "Clothing", value: 30, color: "#00C49F" },
  { name: "Home", value: 15, color: "#FFBB28" },
  { name: "Sports", value: 10, color: "#FF8042" },
]

const recentOrders = [
  { id: "ORD-001", customer: "John Doe", product: "Wireless Headphones", amount: "$199.99", status: "completed" },
  { id: "ORD-002", customer: "Jane Smith", product: "Organic T-Shirt", amount: "$29.99", status: "processing" },
  { id: "ORD-003", customer: "Bob Johnson", product: "Smart Camera", amount: "$89.99", status: "pending" },
]

const topProducts = [
  { name: "Wireless Headphones", sales: 145, revenue: "$28,998" },
  { name: "Organic T-Shirt", sales: 98, revenue: "$2,939" },
  { name: "Smart Camera", sales: 67, revenue: "$6,029" },
]

export default function CreatorDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [liveStats, setLiveStats] = useState(currentStats)
  const [isLive, setIsLive] = useState(true)
  const [notifications, setNotifications] = useState<Array<{id: string; type: 'success' | 'error' | 'info'; message: string}>>([])
  const [pageTransition, setPageTransition] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        storeViews: prev.storeViews + Math.floor(Math.random() * 5),
        totalOrders: Math.random() > 0.8 ? prev.totalOrders + 1 : prev.totalOrders,
        totalRevenue: Math.random() > 0.7 
          ? prev.totalRevenue + Math.floor(Math.random() * 100) + 50
          : prev.totalRevenue
      }))
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [isLive])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger shortcuts when not typing in input fields
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return
      }

      // Ctrl/Cmd + K: Quick add product
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        router.push('/creator/products')
      }
      // Ctrl/Cmd + O: View orders
      else if ((event.ctrlKey || event.metaKey) && event.key === 'o') {
        event.preventDefault()
        router.push('/creator/orders')
      }
      // Ctrl/Cmd + P: Profile settings
      else if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault()
        router.push('/creator/profile')
      }
      // R: Refresh dashboard
      else if (event.key === 'r' && !event.ctrlKey && !event.metaKey) {
        event.preventDefault()
        window.location.reload()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router])

  // Memoize expensive calculations
  const memoizedStats = useMemo(() => ({
    revenueGrowth: ((liveStats.totalRevenue - currentStats.previousRevenue) / currentStats.previousRevenue * 100).toFixed(1),
    ordersGrowth: ((liveStats.totalOrders - currentStats.previousOrders) / currentStats.previousOrders * 100).toFixed(1),
    viewsGrowth: ((liveStats.storeViews - currentStats.previousViews) / currentStats.previousViews * 100).toFixed(1)
  }), [liveStats, currentStats])

  // Memoize chart data
  const memoizedSalesData = useMemo(() => salesData, [])
  const memoizedCategoryData = useMemo(() => categoryData, [])

  // Enhanced loading with transition
  useEffect(() => {
    const loadDashboard = async () => {
      setPageTransition(true)
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 800))
      setIsLoading(false)
      setTimeout(() => setPageTransition(false), 300)
    }

    loadDashboard()
  }, [])

  // Notification system
  const addNotification = useCallback((type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString()
    setNotifications(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  // Enhanced navigation with transition
  const handleNavigation = (path: string) => {
    setPageTransition(true)
    setTimeout(() => router.push(path), 300)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted animate-pulse rounded"></div>
            <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 w-24 bg-muted rounded"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-muted rounded mb-2"></div>
                <div className="h-3 w-20 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-32 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className={`space-y-6 transition-opacity duration-300 ${pageTransition ? 'opacity-50' : 'opacity-100'}`}>
        {/* Notification System */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg shadow-lg border transition-all duration-300 transform ${
                notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                'bg-blue-50 border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'success' && <CheckCircle className="h-4 w-4" />}
                {notification.type === 'error' && <AlertCircle className="h-4 w-4" />}
                <span className="text-sm font-medium">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>
        {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your store today.
          </p>
          <div className="mt-2 text-xs text-muted-foreground" role="note" aria-label="Keyboard shortcuts">
            <span className="font-mono bg-muted px-2 py-1 rounded" aria-label="Control K for add product">Ctrl+K</span> Add Product • 
            <span className="font-mono bg-muted px-2 py-1 rounded ml-1" aria-label="Control O for orders">Ctrl+O</span> Orders • 
            <span className="font-mono bg-muted px-2 py-1 rounded ml-1" aria-label="Control P for profile">Ctrl+P</span> Profile • 
            <span className="font-mono bg-muted px-2 py-1 rounded ml-1" aria-label="R for refresh">R</span> Refresh
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => handleNavigation("/creator/products")} 
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
            aria-label="Add new product"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleNavigation("/creator/orders")}
            className="w-full sm:w-auto transition-all duration-200 hover:scale-105 hover:shadow-lg hover:bg-primary hover:text-primary-foreground active:scale-95"
            aria-label="View all orders"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            View Orders
          </Button>
        </div>
      </header>

      {/* Enhanced Stats Cards */}
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" aria-label="Key metrics">
        <HoverCard liftAmount={8} scale={1.02}>
          <Card className="transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors duration-200">Total Revenue</CardTitle>
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-md group-hover:scale-150 transition-transform duration-300"></div>
                <DollarSign className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 relative z-10" />
              </motion.div>
            </CardHeader>
            <CardContent className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AnimatedCounter 
                  value={liveStats.totalRevenue} 
                  prefix="$" 
                  duration={1.5}
                  className="text-2xl font-bold"
                />
                <TrendIndicator 
                  value={liveStats.totalRevenue}
                  previousValue={currentStats.previousRevenue}
                  className="flex items-center gap-1 text-xs text-muted-foreground mt-1"
                />
              </motion.div>
            </CardContent>
          </Card>
        </HoverCard>

        <HoverCard liftAmount={8} scale={1.02}>
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Total Orders</CardTitle>
              <motion.div
                whileHover={{ scale: 1.2 }}
                transition={{ duration: 0.2 }}
              >
                <ShoppingCart className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">{liveStats.totalOrders}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                +8.2% from last month
              </p>
            </CardContent>
          </Card>
        </HoverCard>

        <HoverCard liftAmount={8} scale={1.02}>
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Active Products</CardTitle>
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.4 }}
              >
                <Package className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">{currentStats.activeProducts}</div>
              <p className="text-xs text-muted-foreground">
                3 in draft, 2 archived
              </p>
            </CardContent>
          </Card>
        </HoverCard>

        <HoverCard liftAmount={8} scale={1.02}>
          <Card className="transition-all duration-200 hover:shadow-lg cursor-pointer group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-primary transition-colors">Store Views</CardTitle>
              <motion.div
                whileHover={{ scale: 1.3 }}
                transition={{ duration: 0.3 }}
              >
                <Eye className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:scale-105 transition-transform">{(liveStats.storeViews / 1000).toFixed(1)}k</div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">Live</span>
              </div>
            </CardContent>
          </Card>
        </HoverCard>
      </section>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Chart */}
        <HoverCard liftAmount={4} scale={1.01}>
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Sales Overview
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Live
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsLive(!isLive)}
                    className="text-xs h-6 px-2"
                  >
                    {isLive ? 'Pause' : 'Resume'}
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickLine={{ stroke: '#e5e7eb' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <ChartTooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-sm" style={{ color: entry.color }}>
                                  {entry.name}: {entry.name === 'sales' ? `$${entry.value}` : entry.value}
                                </p>
                              ))}
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#8884d8" 
                      strokeWidth={3}
                      dot={{ fill: '#8884d8', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#82ca9d" 
                      strokeWidth={3}
                      dot={{ fill: '#82ca9d', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </HoverCard>

        {/* Category Distribution */}
        <HoverCard liftAmount={4} scale={1.01}>
          <Card className="transition-all duration-200 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Chart>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationBegin={0}
                      animationDuration={800}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.color}
                          className="hover:opacity-80 transition-opacity cursor-pointer"
                        />
                      ))}
                    </Pie>
                    <ChartTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload as any
                          return (
                            <div className="bg-background border rounded-lg shadow-lg p-3">
                              <p className="font-medium">{data.name}</p>
                              <p className="text-sm">Value: {data.value}%</p>
                              <p className="text-xs text-muted-foreground">
                                ${(currentStats.totalRevenue * data.value / 100).toFixed(0)}
                              </p>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </Chart>
            </CardContent>
          </Card>
        </HoverCard>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <ShoppingCart className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.product}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.amount}</p>
                    <Badge variant={order.status === "completed" ? "default" : order.status === "processing" ? "secondary" : "outline"}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" onClick={() => router.push("/creator/orders")}>
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{product.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Enhanced Activity Timeline */}
        <div className="lg:col-span-2">
          <StaggeredList staggerDelay={0.1}>
            <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
                <Pulse>
                  <StatusIndicator status="online" size="sm" showIcon />
                </Pulse>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline 
                activities={[
                  {
                    id: "1",
                    type: "order",
                    title: "New Order #1234",
                    description: "Premium Widget Set - $299.00",
                    timestamp: new Date(Date.now() - 1000 * 60 * 5),
                    status: "success",
                    metadata: {
                      customer: "John Doe",
                      items: 3,
                      total: "$299.00"
                    }
                  },
                  {
                    id: "2",
                    type: "product",
                    title: "Product Created",
                    description: "New product added to inventory",
                    timestamp: new Date(Date.now() - 1000 * 60 * 15),
                    status: "info",
                    metadata: {
                      product: "Premium Widget",
                      category: "Electronics",
                      sku: "PW-001"
                    }
                  },
                  {
                    id: "3",
                    type: "review",
                    title: "New Customer Review",
                    description: "5-star review on Premium Widget",
                    timestamp: new Date(Date.now() - 1000 * 60 * 30),
                    status: "success",
                    metadata: {
                      rating: 5,
                      customer: "Jane Smith",
                      comment: "Amazing quality!"
                    }
                  }
                ]}
              />
            </CardContent>
          </Card>
          </StaggeredList>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <ProgressRing value={75} size={120} showPercentage />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">75% Complete</p>
                <p className="text-xs text-muted-foreground">$22,500 of $30,000 goal</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Revenue Goal</span>
                <span className="font-medium">$30,000</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Orders Target</span>
                <span className="font-medium">200 orders</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>New Customers</span>
                <span className="font-medium">50 customers</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Alerts */}
      <div className="grid gap-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm font-medium text-blue-800">💡 Trend Alert</p>
          <p className="text-xs text-blue-600 mt-1">
            Your "Wireless Headphones" are trending! Consider increasing inventory.
          </p>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm font-medium text-green-800">📈 Growth Tip</p>
          <p className="text-xs text-green-600 mt-1">
            Add product bundles to increase average order value by 23%.
          </p>
        </div>
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm font-medium text-orange-800">⚠️ Alert</p>
          <p className="text-xs text-orange-600 mt-1">
            3 products are low on stock. Restock soon to avoid lost sales.
          </p>
        </div>
      </div>
    </div>
    </ErrorBoundary>
  )
}
