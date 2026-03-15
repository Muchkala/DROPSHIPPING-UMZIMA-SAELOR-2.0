"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Package, 
  ShoppingCart,
  Search,
  Filter,
  Download,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MoreHorizontal,
  Calendar,
  DollarSign,
  User,
  Mail,
  Phone,
  MapPin
} from "lucide-react"

interface Order {
  id: string
  customer: {
    name: string
    email: string
    phone: string
    address: string
  }
  items: Array<{
    id: string
    name: string
    quantity: number
    price: number
    image?: string
  }>
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "paid" | "failed"
  total: number
  createdAt: string
  trackingNumber?: string
}

const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900",
      address: "123 Main St, New York, NY 10001"
    },
    items: [
      { id: "1", name: "Wireless Bluetooth Headphones", quantity: 1, price: 199.99 },
      { id: "2", name: "USB-C Cable", quantity: 2, price: 14.99 }
    ],
    status: "delivered",
    paymentStatus: "paid",
    total: 229.97,
    createdAt: "2024-01-15T10:30:00Z",
    trackingNumber: "TRK123456789"
  },
  {
    id: "ORD-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1 234-567-8901",
      address: "456 Oak Ave, Los Angeles, CA 90001"
    },
    items: [
      { id: "3", name: "Organic Cotton T-Shirt", quantity: 3, price: 29.99 }
    ],
    status: "processing",
    paymentStatus: "paid",
    total: 89.97,
    createdAt: "2024-01-16T14:20:00Z"
  },
  {
    id: "ORD-003",
    customer: {
      name: "Bob Johnson",
      email: "bob@example.com",
      phone: "+1 234-567-8902",
      address: "789 Pine Rd, Chicago, IL 60601"
    },
    items: [
      { id: "4", name: "Smart Home Security Camera", quantity: 1, price: 89.99 },
      { id: "5", name: "SD Card 32GB", quantity: 1, price: 12.99 }
    ],
    status: "pending",
    paymentStatus: "pending",
    total: 102.98,
    createdAt: "2024-01-17T09:15:00Z"
  },
  {
    id: "ORD-004",
    customer: {
      name: "Alice Brown",
      email: "alice@example.com",
      phone: "+1 234-567-8903",
      address: "321 Elm St, Houston, TX 77001"
    },
    items: [
      { id: "6", name: "Yoga Mat", quantity: 2, price: 24.99 }
    ],
    status: "shipped",
    paymentStatus: "paid",
    total: 49.98,
    createdAt: "2024-01-14T16:45:00Z",
    trackingNumber: "TRK987654321"
  },
  {
    id: "ORD-005",
    customer: {
      name: "Charlie Wilson",
      email: "charlie@example.com",
      phone: "+1 234-567-8904",
      address: "654 Maple Dr, Phoenix, AZ 85001"
    },
    items: [
      { id: "7", name: "Coffee Maker", quantity: 1, price: 79.99 }
    ],
    status: "cancelled",
    paymentStatus: "failed",
    total: 79.99,
    createdAt: "2024-01-13T11:30:00Z"
  }
]

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setOrders(mockOrders)
      setIsLoading(false)
    }

    loadOrders()
  }, [])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800"
      case "shipped": return "bg-blue-100 text-blue-800"
      case "processing": return "bg-yellow-100 text-yellow-800"
      case "pending": return "bg-gray-100 text-gray-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered": return <CheckCircle className="h-4 w-4" />
      case "shipped": return <Truck className="h-4 w-4" />
      case "processing": return <Clock className="h-4 w-4" />
      case "pending": return <Clock className="h-4 w-4" />
      case "cancelled": return <XCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    totalRevenue: orders.filter(o => o.paymentStatus === "paid").reduce((sum, o) => sum + o.total, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track your customer orders
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => router.push("/creator/products")}>
            <Package className="h-4 w-4 mr-2" />
            View Products
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
            <p className="text-xs text-muted-foreground">
              Being prepared
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orderStats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From paid orders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" 
                  ? "Try adjusting your search or filters"
                  : "You haven't received any orders yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{order.id}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </Badge>
                      <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                        {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{order.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>{order.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{order.customer.address}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="mt-3 space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{item.name}</span>
                            <Badge variant="outline" className="text-xs">
                              Qty: {item.quantity}
                            </Badge>
                          </div>
                          <span className="font-medium">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {order.trackingNumber && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Tracking:</span> {order.trackingNumber}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
