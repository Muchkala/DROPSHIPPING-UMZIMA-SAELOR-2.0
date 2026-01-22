"use client"

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Package,
  Star,
  MessageSquare,
  TrendingUp,
  DollarSign,
  Loader2
} from "lucide-react"

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
  sales: number
  revenue: number
  rating: number
  reviews: number
}

interface Comment {
  id: string
  author: string
  content: string
  createdAt: string
  isCreator: boolean
}

interface Review {
  id: string
  author: string
  rating: number
  content: string
  createdAt: string
  helpful: number
}

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.productId as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProduct, setEditedProduct] = useState<Partial<Product>>({})
  const [activeTab, setActiveTab] = useState("overview")
  const [comments, setComments] = useState<Comment[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Mock data - in real app, this would be fetched from API
  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      
      // Simulate API call
      setTimeout(() => {
        const mockProduct: Product = {
          id: productId,
          name: "Wireless Bluetooth Headphones Premium Noise-Cancelling Headphones with Extended Battery Life",
          description: "Experience premium sound quality with these advanced wireless headphones featuring industry-leading noise cancellation technology and 30-hour battery life for uninterrupted listening pleasure. Perfect for travel, work, or everyday use.",
          price: 199.99,
          status: "active",
          inventory: 45,
          sku: "WBH-001",
          images: [],
          tags: ["wireless", "bluetooth", "noise-cancelling"],
          createdAt: "2024-01-15",
          updatedAt: "2024-01-20",
          sales: 128,
          revenue: 25598.72,
          rating: 4.5,
          reviews: 89
        }
        
        const mockComments: Comment[] = [
          {
            id: "1",
            author: "Sarah Chen",
            content: "Great product! Customers love the sound quality.",
            createdAt: "2024-01-18",
            isCreator: false
          },
          {
            id: "2", 
            author: "You (Creator)",
            content: "Thanks for the feedback! We're working on improving the bass response.",
            createdAt: "2024-01-19",
            isCreator: true
          }
        ]
        
        const mockReviews: Review[] = [
          {
            id: "1",
            author: "John Doe",
            rating: 5,
            content: "Amazing sound quality! The noise cancellation is incredible.",
            createdAt: "2024-01-16",
            helpful: 24
          },
          {
            id: "2",
            author: "Jane Smith", 
            rating: 4,
            content: "Great headphones, battery life is fantastic.",
            createdAt: "2024-01-17",
            helpful: 18
          }
        ]
        
        setProduct(mockProduct)
        setEditedProduct(mockProduct)
        setComments(mockComments)
        setReviews(mockReviews)
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full h-10 bg-muted/60 rounded-lg p-1 flex flex-nowrap justify-start gap-2 overflow-x-auto sm:grid sm:grid-cols-4 sm:gap-1">
              <TabsTrigger className="flex-shrink-0 whitespace-nowrap text-xs sm:text-sm px-3 py-1.5 rounded-md" value="overview">Overview</TabsTrigger>
              <TabsTrigger className="flex-shrink-0 whitespace-nowrap text-xs sm:text-sm px-3 py-1.5 rounded-md" value="comments">Comments</TabsTrigger>
              <TabsTrigger className="flex-shrink-0 whitespace-nowrap text-xs sm:text-sm px-3 py-1.5 rounded-md" value="reviews">Reviews</TabsTrigger>
              <TabsTrigger className="flex-shrink-0 whitespace-nowrap text-xs sm:text-sm px-3 py-1.5 rounded-md" value="stats">Stats</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="comments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Comments ({comments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {comments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Comments Yet</h3>
                      <p className="text-muted-foreground">Comments from customers and collaborators will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {comments.map((comment) => (
                        <div key={comment.id} className={`p-4 rounded-lg border ${comment.isCreator ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800' : 'bg-gray-50 dark:bg-gray-900 dark:border-gray-800'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.author}</span>
                              {comment.isCreator && (
                                <Badge variant="secondary" className="text-xs">Creator</Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reviews ({reviews.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
                      <p className="text-muted-foreground">Customer reviews will appear here once customers start reviewing.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-4 rounded-lg border bg-gray-50 dark:bg-gray-900 dark:border-gray-800">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.author}</span>
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm leading-relaxed mb-2">{review.content}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{review.helpful} helpful</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{product.sales}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.5%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${product.revenue.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+8.2%</span> from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rating</CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{product.rating.toFixed(1)}</div>
                    <p className="text-xs text-muted-foreground">
                      Based on {product.reviews} reviews
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Inventory</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{product.inventory}</div>
                    <p className="text-xs text-muted-foreground">
                      {product.inventory === 0 ? 'Out of Stock' : product.inventory < 10 ? 'Low Stock' : 'In Stock'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
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
