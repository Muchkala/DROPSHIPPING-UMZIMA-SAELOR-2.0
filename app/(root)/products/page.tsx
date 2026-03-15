"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Package,
  Grid3X3,
  List,
  Clock,
  Archive,
  Loader2
} from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  status: 'active' | 'draft' | 'archived'
  inventory: number
  sku: string
  images: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    category: "",
    status: "draft",
    inventory: 0,
    sku: "",
    tags: [],
    images: []
  })

  const handleProductClick = (productId: string) => {
    router.push(`/creator/products/${productId}`)
  }

  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys", "Beauty", "Food"]
  const statuses = ["all", "active", "draft", "archived"]

  useEffect(() => {
    // Initialize with sample data
    const sampleProducts: Product[] = [
      {
        id: "1",
        name: "Wireless Bluetooth Headphones Premium Noise-Cancelling Headphones with Extended Battery Life",
        description: "Experience premium sound quality with these advanced wireless headphones featuring industry-leading noise cancellation technology and 30-hour battery life for uninterrupted listening pleasure.",
        price: 199.99,
        category: "Electronics",
        status: "active",
        inventory: 45,
        sku: "WBH-001",
        images: [],
        tags: ["wireless", "bluetooth", "noise-cancelling"],
        createdAt: "2024-01-15",
        updatedAt: "2024-01-20",
      },
      {
        id: "2",
        name: "Organic Cotton T-Shirt Sustainable Comfortable Everyday Wear Essential",
        description: "Made from 100% organic cotton, this comfortable t-shirt is perfect for everyday wear. Sustainable fashion that feels good on your skin and good for the planet.",
        price: 29.99,
        category: "Clothing",
        status: "active",
        inventory: 120,
        sku: "OCT-002",
        images: [],
        tags: ["organic", "cotton", "sustainable"],
        createdAt: "2024-01-10",
        updatedAt: "2024-01-18",
      },
      {
        id: "3",
        name: "Smart Home Security Camera 1080p HD Night Vision Motion Detection",
        description: "Advanced security camera with crystal clear 1080p HD video quality, enhanced night vision capabilities, and intelligent motion detection for comprehensive home monitoring.",
        price: 89.99,
        category: "Electronics",
        status: "draft",
        inventory: 0,
        sku: "SHC-003",
        images: [],
        tags: ["smart home", "security", "wifi"],
        createdAt: "2024-01-22",
        updatedAt: "2024-01-22",
      }
    ]
    setProducts(sampleProducts)
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = activeTab === "all" || product.status === activeTab
    return matchesSearch && matchesStatus
  })

  const handleCreateProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.category) {
      // Simulate loading
      setIsLoading(true)
      setTimeout(() => {
        const product: Product = {
          id: Date.now().toString(),
          name: newProduct.name || "",
          description: newProduct.description || "",
          price: newProduct.price || 0,
          category: newProduct.category || "",
          status: "draft",
          inventory: 0,
          sku: newProduct.sku || `PROD-${Date.now()}`,
          tags: [],
          images: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setProducts([...products, product])
        setNewProduct({
          name: "",
          description: "",
          price: 0,
          category: "",
          status: "draft",
          inventory: 0,
          sku: "",
          tags: [],
          images: []
        })
        setIsLoading(false)
        setIsCreateDialogOpen(false)
      }, 1000)
    }
  }

  const handleUpdateProduct = () => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
      setEditingProduct(null)
    }
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      draft: "secondary",
      archived: "outline"
    } as const
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const getInventoryStatus = (inventory: number) => {
    if (inventory === 0) return <Badge variant="destructive">Out of Stock</Badge>
    if (inventory < 10) return <Badge variant="secondary">Low Stock</Badge>
    return <Badge variant="default">In Stock</Badge>
  }

  const ProductSkeleton = () => (
    <Card className="flex flex-col h-[600px]">
      <div className="relative">
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
          <Loader2 className="w-8 h-8 text-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
      <CardContent className="p-4 space-y-4 flex flex-col h-full">
        <div className="space-y-2 flex-shrink-0">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex items-center justify-between flex-shrink-0">
          <div className="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="flex flex-wrap gap-1 flex-shrink-0">
          <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
          <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        <div className="flex items-center gap-2 text-sm border-t pt-3 mt-auto flex-shrink-0">
          <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
      </CardContent>
    </Card>
  )

  const activeProducts = products.filter(p => p.status === 'active').length

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your products</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your inventory. Fill in the details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    placeholder="Auto-generated if empty"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder="Describe your product"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inventory">Inventory</Label>
                  <Input
                    id="inventory"
                    type="number"
                    value={newProduct.inventory}
                    onChange={(e) => setNewProduct({...newProduct, inventory: parseInt(e.target.value) || 0})}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={newProduct.status} onValueChange={(value: 'active' | 'draft' | 'archived') => setNewProduct({...newProduct, status: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateProduct}>Create Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      {null}

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Products Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Products ({products.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({activeProducts})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({products.filter(p => p.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="archived">Archived ({products.filter(p => p.status === 'archived').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-[600px] cursor-pointer" onClick={() => handleProductClick(product.id)}>
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                          <Package className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200">
                            <MoreHorizontal className="h-4 w-4 dark:text-black" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProduct(product) }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-4 flex flex-col h-full">
                    {/* Product Title and Description */}
                    <div className="space-y-2 flex-shrink-0">
                      <h3 className="font-semibold text-lg leading-tight text-ellipsis overflow-hidden whitespace-nowrap" title={product.name}>{product.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 overflow-hidden" title={product.description}>{product.description}</p>
                    </div>
                    
                    {/* Price and Inventory */}
                    <div className="flex items-center justify-between flex-shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                      </div>
                      {getInventoryStatus(product.inventory)}
                    </div>
                    
                    {/* Product Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground flex-shrink-0">SKU:</span>
                        <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.sku}>{product.sku}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground flex-shrink-0">Category:</span>
                        <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.category}>{product.category}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 flex-shrink-0">
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs max-w-[80px] truncate" title={tag}>
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.inventory}</span>
                          {getInventoryStatus(product.inventory)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-[600px] cursor-pointer" onClick={() => handleProductClick(product.id)}>
                  <div className="relative">
                    <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                          <Package className="h-12 w-12 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-500">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(product.status)}
                    </div>
                    <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProduct(product) }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 space-y-4 flex flex-col h-full">
                    {/* Product Title and Description */}
                    <div className="space-y-2 flex-shrink-0">
                      <h3 className="font-semibold text-lg leading-tight text-ellipsis overflow-hidden whitespace-nowrap" title={product.name}>{product.name}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 overflow-hidden" title={product.description}>{product.description}</p>
                    </div>
                    
                    {/* Price and Inventory */}
                    <div className="flex items-center justify-between flex-shrink-0">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary">${product.price}</span>
                      </div>
                      {getInventoryStatus(product.inventory)}
                    </div>
                    
                    {/* Product Meta Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground flex-shrink-0">SKU:</span>
                        <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.sku}>{product.sku}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-muted-foreground flex-shrink-0">Category:</span>
                        <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.category}>{product.category}</span>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {product.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 flex-shrink-0">
                        {product.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs max-w-[80px] truncate" title={tag}>
                            {tag}
                          </Badge>
                        ))}
                        {product.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{product.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    
                    {null}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Inventory</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                            {product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                                <Package className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                      <TableCell>${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{product.inventory}</span>
                          {getInventoryStatus(product.inventory)}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(product.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Draft Products</h3>
              <p className="text-muted-foreground">
                No products in draft status
              </p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-[600px] cursor-pointer" onClick={() => handleProductClick(product.id)}>
                      <div className="relative">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                              <Package className="h-12 w-12 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(product.status)}
                        </div>
                        <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProduct(product) }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-4 flex flex-col h-full">
                        {/* Product Title and Description */}
                        <div className="space-y-2 flex-shrink-0">
                          <h3 className="font-semibold text-lg leading-tight text-ellipsis overflow-hidden whitespace-nowrap" title={product.name}>{product.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 overflow-hidden" title={product.description}>{product.description}</p>
                        </div>
                        
                        {/* Price and Inventory */}
                        <div className="flex items-center justify-between flex-shrink-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">${product.price}</span>
                          </div>
                          {getInventoryStatus(product.inventory)}
                        </div>
                        
                        {/* Product Meta Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">SKU:</span>
                            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.sku}>{product.sku}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground flex-shrink-0">Category:</span>
                            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.category}>{product.category}</span>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 flex-shrink-0">
                            {product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs max-w-[80px] truncate" title={tag}>
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.inventory}</span>
                              {getInventoryStatus(product.inventory)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-lg font-semibold">No Archived Products</h3>
              <p className="text-muted-foreground">
                No products in archived status
              </p>
            </div>
          ) : (
            <>
              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              ) : viewMode === "grid" ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200 flex flex-col h-[600px] cursor-pointer" onClick={() => handleProductClick(product.id)}>
                      <div className="relative">
                        <div className="aspect-[4/3] bg-gray-100 overflow-hidden">
                          {product.images[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                              <Package className="h-12 w-12 text-gray-400 mb-2" />
                              <span className="text-sm text-gray-500">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="absolute top-3 right-3">
                          {getStatusBadge(product.status)}
                        </div>
                        <div className="absolute top-3 left-3" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" size="sm" className="h-8 w-8 p-0 bg-white/90 hover:bg-white shadow-md border border-gray-200">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setEditingProduct(product) }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive"
                                onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product.id) }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <CardContent className="p-4 space-y-4 flex flex-col h-full">
                        {/* Product Title and Description */}
                        <div className="space-y-2 flex-shrink-0">
                          <h3 className="font-semibold text-lg leading-tight text-ellipsis overflow-hidden whitespace-nowrap" title={product.name}>{product.name}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 overflow-hidden" title={product.description}>{product.description}</p>
                        </div>
                        
                        {/* Price and Inventory */}
                        <div className="flex items-center justify-between flex-shrink-0">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-primary">${product.price}</span>
                          </div>
                          {getInventoryStatus(product.inventory)}
                        </div>
                        
                        {/* Product Meta Info */}
                        <div className="grid grid-cols-2 gap-4 text-sm flex-shrink-0">
                          <div className="flex items-center gap-2 min-w-0">
                            <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-muted-foreground flex-shrink-0">SKU:</span>
                            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.sku}>{product.sku}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-muted-foreground flex-shrink-0">Category:</span>
                            <span className="font-medium text-ellipsis overflow-hidden whitespace-nowrap" title={product.category}>{product.category}</span>
                          </div>
                        </div>
                        
                        {/* Tags */}
                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 flex-shrink-0">
                            {product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs max-w-[80px] truncate" title={tag}>
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {null}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Inventory</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-md bg-muted overflow-hidden">
                                {product.images[0] ? (
                                  <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-50 border border-gray-200">
                                    <Package className="h-5 w-5 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-muted-foreground line-clamp-1">
                                  {product.description}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span>{product.inventory}</span>
                              {getInventoryStatus(product.inventory)}
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(product.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteProduct(product.id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update product information. Changes will be saved immediately.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})}
                    step="0.01"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-inventory">Inventory</Label>
                  <Input
                    id="edit-inventory"
                    type="number"
                    value={editingProduct.inventory}
                    onChange={(e) => setEditingProduct({...editingProduct, inventory: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={editingProduct.status} onValueChange={(value: 'active' | 'draft' | 'archived') => setEditingProduct({...editingProduct, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
              <Button onClick={handleUpdateProduct}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
