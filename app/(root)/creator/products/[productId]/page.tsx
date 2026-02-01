"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package,
  Loader2
} from "lucide-react"

import { getMockProductById } from "@/lib/products/mock-products"

interface Product {
  id: string
  name: string
  description: string
  price: number
  status: 'active' | 'draft' | 'archived'
  inventory: number
  sku: string
  images: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({})
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        const mockProduct = getMockProductById(productId)
        setProduct(mockProduct)
        setEditedProduct(mockProduct)
        setIsLoading(false)
      }, 800)
    }
    
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const handleSave = () => {
    if (editedProduct && product) {
      // Simulate API call
      setIsLoading(true)
      setTimeout(() => {
        setProduct({ ...product, ...editedProduct, updatedAt: new Date().toISOString() })
        setIsEditing(false)
        setIsLoading(false)
      }, 500)
    }
  }

  const handleCancel = () => {
    if (product) {
      setEditedProduct(product)
      setIsEditing(false)
    }
  }

  const handleDelete = () => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      router.push('/products')
    }, 500)
  }

  if (isLoading && !product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded"></div>
              <div className="h-48 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist or has been deleted.</p>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-start mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/products')}
          className="px-0 h-8 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Back to Products
        </Button>
      </div>

      <div className="mb-6">
        <div className="min-w-0">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Creator Product
          </div>
          <h1 className="mt-1 text-xl sm:text-2xl font-semibold leading-tight line-clamp-2 min-h-[3.25rem]" title={product.name}>
            {product.name}
          </h1>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}>
              {product.status}
            </Badge>
            <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
            <span className="text-sm text-muted-foreground">ID: {product.id}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {/* Product Image */}
            <Card>
              <CardContent className="p-6">
                <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                      <Package className="h-16 w-16 text-gray-400 mb-4" />
                      <span className="text-gray-500">No Product Image</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
                <CardTitle className="text-base">Product Details</CardTitle>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {isEditing ? (
                    <>
                      <Button size="sm" className="min-w-[88px]" onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save
                      </Button>
                      <Button variant="outline" size="sm" className="min-w-[88px]" onClick={handleCancel} disabled={isLoading}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" size="sm" className="min-w-[88px]" onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  )}

                  <Button variant="destructive" size="sm" className="min-w-[88px]" onClick={() => setIsDeleteDialogOpen(true)}>
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Product Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedProduct.name || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm sm:text-base font-medium">{product.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  {isEditing ? (
                    <Textarea
                      id="description"
                      value={editedProduct.description || ''}
                      onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{product.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price</Label>
                    {isEditing ? (
                      <Input
                        id="price"
                        type="number"
                        value={editedProduct.price || 0}
                        onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-2xl font-bold text-primary mt-1">${product.price.toFixed(2)}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="inventory">Inventory</Label>
                    {isEditing ? (
                      <Input
                        id="inventory"
                        type="number"
                        value={editedProduct.inventory || 0}
                        onChange={(e) => setEditedProduct({ ...editedProduct, inventory: parseInt(e.target.value) || 0 })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-lg font-medium mt-1">{product.inventory} units</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select value={editedProduct.status || 'draft'} onValueChange={(value: 'active' | 'draft' | 'archived') => setEditedProduct({ ...editedProduct, status: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="mt-1">
                      <Badge variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}>
                        {product.status}
                      </Badge>
                    </div>
                  )}
                </div>
                
                <div>
                  <Label>Created</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(product.createdAt).toLocaleDateString()} at {new Date(product.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Product Info */}
          <Card>
            <CardHeader>
              <CardTitle>Product Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">SKU</Label>
                <p className="font-mono text-sm">{product.sku}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">
                  <Badge variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}>
                    {product.status}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Last Updated</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          {product.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
