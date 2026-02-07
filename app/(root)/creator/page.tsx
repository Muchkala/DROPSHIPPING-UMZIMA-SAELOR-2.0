"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  FileText, 
  Archive, 
  Plus,
  TrendingUp,
  Users,
  Settings
} from "lucide-react"

// Mock data - in real app, this would come from API
const mockStats = {
  totalProducts: 12,
  activeProducts: 8,
  draftProducts: 4,
}

const recentProducts = [
  { id: "1", name: "Wireless Bluetooth Headphones", status: "active" },
  { id: "2", name: "Organic Cotton T-Shirt", status: "active" },
  { id: "3", name: "Smart Home Security Camera", status: "draft" },
]

export default function CreatorDashboard() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadDashboard = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
    }

    loadDashboard()
  }, [])

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
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your products and grow your business
          </p>
        </div>
        <Button onClick={() => router.push("/creator/products")} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              All your products
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeProducts}</div>
            <p className="text-xs text-muted-foreground">
              Currently live
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Draft Products</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.draftProducts}</div>
            <p className="text-xs text-muted-foreground">
              Ready to publish
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Recent Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/creator/products">
              <Button variant="outline" className="w-full justify-start">
                <Package className="h-4 w-4 mr-2" />
                Manage Products
              </Button>
            </Link>
            <Link href="/creator/profile">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                      <Package className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{product.status}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push(`/creator/products/${product.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/creator/products">
                <Button variant="outline" className="w-full">
                  View All Products
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
