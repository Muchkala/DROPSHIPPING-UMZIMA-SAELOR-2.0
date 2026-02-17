"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
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
  Loader2,
  Camera,
  X,
  Plus,
  Trash2,
  Upload,
  Check,
  AlertCircle,
  Edit3,
  Save,
  RotateCcw,
  Home,
  ChevronRight,
  Eye,
  Share2,
  Copy,
  TrendingUp,
  Users,
  ShoppingCart,
  Star,
  MoreVertical,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Zap
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [uploadMessage, setUploadMessage] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [deletedImages, setDeletedImages] = useState<{index: number; url: string; wasPrimary: boolean}[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dragCounterRef = useRef(0)
  
  // Enhanced editing states
  const [editingField, setEditingField] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  // New UX states
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isStickyHeader, setIsStickyHeader] = useState(false)

  // Mock performance data
  const productMetrics = {
    views: 1250,
    viewsChange: 12.5,
    orders: 45,
    ordersChange: 8.3,
    revenue: 2340.50,
    revenueChange: 15.2,
    rating: 4.6,
    reviews: 23,
    conversionRate: 3.6
  }

  // Sticky header detection
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyHeader(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
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

  const handleSave = async () => {
    if (!editedProduct || !product) return
    
    // Validate fields
    const errors: Record<string, string> = {}
    if (!editedProduct.name?.trim()) {
      errors.name = 'Product name is required'
    }
    if (!editedProduct.description?.trim()) {
      errors.description = 'Description is required'
    }
    if (editedProduct.price && editedProduct.price <= 0) {
      errors.price = 'Price must be greater than 0'
    }
    if (editedProduct.inventory && editedProduct.inventory < 0) {
      errors.inventory = 'Inventory cannot be negative'
    }
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    
    setSaveStatus('saving')
    
    // Simulate API call
    setTimeout(() => {
      setProduct({ ...product, ...editedProduct, updatedAt: new Date().toISOString() })
      setEditedProduct({ ...product, ...editedProduct })
      setSaveStatus('saved')
      setHasUnsavedChanges(false)
      setFieldErrors({})
      
      setTimeout(() => setSaveStatus('idle'), 2000)
    }, 800)
  }

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      // Show confirmation dialog or reset
      if (confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        if (product) {
          setEditedProduct(product)
          setHasUnsavedChanges(false)
          setFieldErrors({})
        }
      }
    } else {
      if (product) {
        setEditedProduct(product)
      }
    }
  }

  // Auto-save functionality
  const triggerAutoSave = useCallback(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }
    
    const timer = setTimeout(() => {
      if (hasUnsavedChanges && !Object.keys(fieldErrors).length) {
        handleSave()
      }
    }, 2000) // 2 seconds delay
    
    setAutoSaveTimer(timer)
  }, [hasUnsavedChanges, fieldErrors, autoSaveTimer])

  // Field change handlers with validation
  const handleFieldChange = (field: keyof Product, value: any) => {
    setEditedProduct(prev => ({ ...prev, [field]: value }))
    setHasUnsavedChanges(true)
    
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }))
    }
    
    // Trigger auto-save
    triggerAutoSave()
  }

  // Inline field editing
  const startEditingField = (field: string) => {
    setEditingField(field)
    setIsEditing(true)
  }

  const finishEditingField = () => {
    setEditingField(null)
    if (hasUnsavedChanges) {
      handleSave()
    }
  }

  // New UX handlers
  const handleCopyLink = async () => {
    const productUrl = `${window.location.origin}/products/${productId}`
    try {
      await navigator.clipboard.writeText(productUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleShare = () => {
    setShowShareDialog(true)
  }

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode)
    if (hasUnsavedChanges) {
      handleSave()
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'duplicate':
        // Implement duplicate functionality
        console.log('Duplicate product')
        break
      case 'archive':
        handleFieldChange('status', 'archived')
        break
      case 'delete':
        setIsDeleteDialogOpen(true)
        break
      case 'preview':
        togglePreviewMode()
        break
    }
    setShowQuickActions(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault()
            if (hasUnsavedChanges) {
              handleSave()
            }
            break
          case 'p':
            e.preventDefault()
            togglePreviewMode()
            break
          case 'c':
            e.preventDefault()
            handleCopyLink()
            break
          case 'e':
            e.preventDefault()
            setIsEditing(true)
            break
        }
      } else if (e.key === 'Escape') {
        if (showQuickActions) setShowQuickActions(false)
        if (showShareDialog) setShowShareDialog(false)
        if (lightboxOpen) closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [hasUnsavedChanges, showQuickActions, showShareDialog, lightboxOpen])

  const handleDelete = () => {
    // Simulate API call
    setIsLoading(true)
    setTimeout(() => {
      router.push('/products')
    }, 500)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || !product) return

    setIsUploading(true)
    const newImages: string[] = []
    const validFiles = Array.from(files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        setUploadMessage('Please select only image files')
        setTimeout(() => setUploadMessage(''), 3000)
        return false
      }
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadMessage('File size must be less than 5MB')
        setTimeout(() => setUploadMessage(''), 3000)
        return false
      }
      return true
    })

    if (validFiles.length === 0) {
      setIsUploading(false)
      return
    }

    let processedCount = 0
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        newImages.push(imageUrl)
        processedCount++
        
        if (processedCount === validFiles.length) {
          const currentImages = editedProduct.images || product.images
          // Check if adding would exceed limit
          if (currentImages.length + newImages.length > 8) {
            setUploadMessage(`Only ${8 - currentImages.length} more images can be added (max 8 total)`)
            setTimeout(() => setUploadMessage(''), 3000)
          } else {
            const updatedImages = [...currentImages, ...newImages]
            setEditedProduct({ ...editedProduct, images: updatedImages })
            setUploadMessage(`${validFiles.length} image(s) added successfully!`)
            setTimeout(() => setUploadMessage(''), 3000)
          }
          setIsUploading(false)
        }
      }
      reader.onerror = () => {
        processedCount++
        if (processedCount === validFiles.length) {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  
  const handleSetPrimaryImage = (index: number) => {
    if (!product) return
    
    const currentImages = editedProduct.images || product.images
    const updatedImages = [currentImages[index], ...currentImages.filter((_, i) => i !== index)]
    setEditedProduct({ ...editedProduct, images: updatedImages })
    setSelectedImageIndex(0)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      handleImageUpload({ target: { files } } as React.ChangeEvent<HTMLInputElement>)
    }
  }

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const images = editedProduct.images || product?.images || []
    if (direction === 'prev') {
      setLightboxIndex((lightboxIndex - 1 + images.length) % images.length)
    } else {
      setLightboxIndex((lightboxIndex + 1) % images.length)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') closeLightbox()
        if (e.key === 'ArrowLeft') navigateLightbox('prev')
        if (e.key === 'ArrowRight') navigateLightbox('next')
      } else if (isEditing && e.target && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        const images = editedProduct.images || product?.images || []
        if (e.key === 'ArrowLeft' && images.length > 0) {
          setSelectedImageIndex((selectedImageIndex - 1 + images.length) % images.length)
        }
        if (e.key === 'ArrowRight' && images.length > 0) {
          setSelectedImageIndex((selectedImageIndex + 1) % images.length)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightboxOpen, isEditing, selectedImageIndex, lightboxIndex, editedProduct.images, product?.images])

  // Enhanced delete with undo
  const handleDeleteImage = (index: number) => {
    if (!product) return
    
    const currentImages = editedProduct.images || product.images
    const imageToDelete = currentImages[index]
    const wasPrimary = index === 0
    
    // Store for undo
    setDeletedImages(prev => [...prev, { index, url: imageToDelete, wasPrimary }])
    
    const updatedImages = currentImages.filter((_, i) => i !== index)
    setEditedProduct({ ...editedProduct, images: updatedImages })
    
    // Adjust selected index if needed
    if (selectedImageIndex >= updatedImages.length && updatedImages.length > 0) {
      setSelectedImageIndex(updatedImages.length - 1)
    } else if (updatedImages.length === 0) {
      setSelectedImageIndex(0)
    }

    // Show undo notification
    setUploadMessage('Image deleted. Click here to undo.')
    setTimeout(() => {
      setDeletedImages(prev => prev.filter((_, i) => i !== 0))
      setUploadMessage('')
    }, 5000)
  }

  // Undo delete
  const handleUndoDelete = () => {
    if (deletedImages.length === 0 || !product) return
    
    const lastDeleted = deletedImages[deletedImages.length - 1]
    const currentImages = editedProduct.images || product.images
    
    // Restore image to original position
    const updatedImages = [...currentImages]
    updatedImages.splice(lastDeleted.index, 0, lastDeleted.url)
    
    // If it was primary, restore primary position
    if (lastDeleted.wasPrimary) {
      const primaryImage = updatedImages[lastDeleted.index]
      updatedImages.splice(lastDeleted.index, 1)
      updatedImages.unshift(primaryImage)
    }
    
    setEditedProduct({ ...editedProduct, images: updatedImages })
    setDeletedImages(prev => prev.slice(0, -1))
    setUploadMessage('')
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-3">
          <nav className="flex items-center space-x-2 text-sm" aria-label="Breadcrumb">
            <Link href="/creator" className="text-gray-500 hover:text-gray-700 transition-colors flex items-center">
              <Home className="h-4 w-4" />
              <span className="ml-1">Dashboard</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/creator/products" className="text-gray-500 hover:text-gray-700 transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 font-medium">{product?.name}</span>
          </nav>
        </div>
      </div>

      {/* Sticky Header */}
      {isStickyHeader && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold truncate">{product?.name}</h2>
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Unsaved changes
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleCopyLink}>
                  {copiedLink ? (
                    <><Check className="h-4 w-4 mr-1" />Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4 mr-1" />Copy Link</>
                  )}
                </Button>
                <Button size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button size="sm" onClick={togglePreviewMode} variant={isPreviewMode ? "default" : "outline"}>
                  <Eye className="h-4 w-4 mr-1" />
                  {isPreviewMode ? 'Exit Preview' : 'Preview'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-8">
        {/* Regular Header */}
        {!isStickyHeader && (
          <div className="flex items-center justify-start mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/creator/products')}
              className="px-0 h-8 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              ← Back to Products
            </Button>
          </div>
        )}

        <div className="mb-6">
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Creator Product
            </div>
            <div className="flex items-center gap-3 mt-1">
              <h1 className="text-xl sm:text-2xl font-semibold leading-tight line-clamp-2 min-h-[3.25rem]" title={product.name}>
                {product.name}
              </h1>
              {hasUnsavedChanges && (
                <Badge variant="outline" className="text-xs animate-pulse">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unsaved changes
                </Badge>
              )}
              {saveStatus === 'saving' && (
                <Badge variant="secondary" className="text-xs">
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Saving...
                </Badge>
              )}
              {saveStatus === 'saved' && (
                <Badge variant="default" className="text-xs bg-green-600">
                  <Check className="h-3 w-3 mr-1" />
                  Saved
                </Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <Badge variant={product.status === 'active' ? 'default' : product.status === 'draft' ? 'secondary' : 'outline'}>
                {product.status}
              </Badge>
              <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              <span className="text-sm text-muted-foreground">ID: {product.id}</span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-2xl font-bold">{productMetrics.views.toLocaleString()}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+{productMetrics.viewsChange}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <p className="text-2xl font-bold">{productMetrics.orders}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+{productMetrics.ordersChange}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold">${productMetrics.revenue.toFixed(2)}</p>
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="text-sm">+{productMetrics.revenueChange}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{productMetrics.rating}</p>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(productMetrics.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {productMetrics.reviews} reviews
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
                <CardTitle className="text-base">Product Images</CardTitle>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                      aria-label="Upload product images"
                    />
                    <Button size="sm" onClick={handleUploadClick}>
                      <Upload className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {uploadMessage && (
                  <div 
                    className={`p-3 rounded-md text-sm cursor-pointer transition-colors ${
                      uploadMessage.includes('success') 
                        ? 'bg-green-50 text-green-800 border border-green-200 hover:bg-green-100' 
                        : uploadMessage.includes('undo')
                        ? 'bg-yellow-50 text-yellow-800 border border-yellow-200 hover:bg-yellow-100'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                    onClick={uploadMessage.includes('undo') ? handleUndoDelete : undefined}
                  >
                    {uploadMessage}
                  </div>
                )}
                
                {/* Main Image Display */}
                <div 
                  className={`aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden relative transition-colors ${
                    isDragging ? 'border-4 border-dashed border-blue-400 bg-blue-50' : ''
                  }`}
                  onDragEnter={isEditing ? handleDragEnter : undefined}
                  onDragLeave={isEditing ? handleDragLeave : undefined}
                  onDragOver={isEditing ? handleDragOver : undefined}
                  onDrop={isEditing ? handleDrop : undefined}
                >
                  {(editedProduct.images || product?.images || []).length > 0 ? (
                    <>
                      <div className="relative w-full h-full cursor-pointer" onClick={() => openLightbox(selectedImageIndex)}>
                        <Image
                          src={(editedProduct.images || product?.images || [])[selectedImageIndex]}
                          alt={`${product?.name} - Image ${selectedImageIndex + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                          <div className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                            Click to zoom
                          </div>
                        </div>
                      </div>
                      {isEditing && (editedProduct.images || product?.images || []).length > 1 && selectedImageIndex !== 0 && (
                        <div className="absolute top-2 left-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetPrimaryImage(selectedImageIndex)
                            }}
                            className="bg-white/90 hover:bg-white"
                          >
                            Set as Primary
                          </Button>
                        </div>
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="bg-white rounded-lg p-4 flex flex-col items-center">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                            <span className="text-sm text-gray-600">Uploading images...</span>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                      <Package className="h-16 w-16 text-gray-400 mb-4" />
                      <span className="text-gray-500 mb-2">No Product Images</span>
                      {isEditing && (
                        <>
                          <Button size="sm" variant="outline" onClick={handleUploadClick} className="mb-2">
                            <Camera className="h-4 w-4 mr-2" />
                            Add First Image
                          </Button>
                          <p className="text-xs text-gray-400 text-center">
                            or drag and drop images here
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Gallery */}
                {(editedProduct.images || product.images).length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Image Gallery {(editedProduct.images || product.images).length > 1 && `(${(editedProduct.images || product.images).length} images)`}
                    </Label>
                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {(editedProduct.images || product.images).map((image, index) => (
                        <div
                          key={index}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 ${
                            selectedImageIndex === index
                              ? 'border-blue-500'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        >
                          <div className="aspect-square">
                            <Image
                              src={image}
                              alt={`${product.name} - Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {index === 0 && (
                            <div className="absolute top-1 left-1">
                              <Badge variant="secondary" className="text-xs px-1 py-0">
                                Primary
                              </Badge>
                            </div>
                          )}
                          {isEditing && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteImage(index)
                                }}
                                className="h-6 w-6 p-0"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                      {isEditing && (editedProduct.images || product.images).length < 8 && (
                        <div
                          className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                          onClick={handleUploadClick}
                        >
                          <Plus className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Click to select primary image. Use arrow keys to navigate. Maximum 8 images. JPG, PNG, GIF up to 5MB each. Drag & drop supported.
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card>
              <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between space-y-0">
                <CardTitle className="text-base flex items-center gap-2">
                  Product Details
                  {hasUnsavedChanges && (
                    <span className="text-xs text-orange-600 font-normal">*editing</span>
                  )}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {hasUnsavedChanges && (
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Discard
                    </Button>
                  )}
                  <Button size="sm" onClick={handleSave} disabled={!hasUnsavedChanges || saveStatus === 'saving'}>
                    {saveStatus === 'saving' ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" />Save Changes</>
                    )}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    Product Name
                    {fieldErrors.name && (
                      <span className="text-red-500 text-xs">{fieldErrors.name}</span>
                    )}
                  </Label>
                  <div className="relative group">
                    <Input
                      id="name"
                      value={editedProduct.name || ''}
                      onChange={(e) => handleFieldChange('name', e.target.value)}
                      className={`mt-1 transition-colors ${
                        fieldErrors.name ? 'border-red-500 focus:border-red-500' : ''
                      } ${hasUnsavedChanges && editedProduct.name !== product.name ? 'border-blue-400' : ''}`}
                      placeholder="Enter product name"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {editedProduct.name?.length || 0}/100 characters
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="description" className="flex items-center gap-2">
                    Description
                    {fieldErrors.description && (
                      <span className="text-red-500 text-xs">{fieldErrors.description}</span>
                    )}
                  </Label>
                  <div className="relative group">
                    <Textarea
                      id="description"
                      value={editedProduct.description || ''}
                      onChange={(e) => handleFieldChange('description', e.target.value)}
                      className={`mt-1 resize-none transition-colors ${
                        fieldErrors.description ? 'border-red-500 focus:border-red-500' : ''
                      } ${hasUnsavedChanges && editedProduct.description !== product.description ? 'border-blue-400' : ''}`}
                      placeholder="Describe your product..."
                      rows={4}
                      maxLength={1000}
                    />
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {editedProduct.description?.length || 0}/1000 characters
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price" className="flex items-center gap-2">
                      Price
                      {fieldErrors.price && (
                        <span className="text-red-500 text-xs">{fieldErrors.price}</span>
                      )}
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</div>
                      <Input
                        id="price"
                        type="number"
                        value={editedProduct.price || 0}
                        onChange={(e) => handleFieldChange('price', parseFloat(e.target.value) || 0)}
                        className={`mt-1 pl-8 transition-colors ${
                          fieldErrors.price ? 'border-red-500 focus:border-red-500' : ''
                        } ${hasUnsavedChanges && editedProduct.price !== product.price ? 'border-blue-400' : ''}`}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="inventory" className="flex items-center gap-2">
                      Inventory
                      {fieldErrors.inventory && (
                        <span className="text-red-500 text-xs">{fieldErrors.inventory}</span>
                      )}
                    </Label>
                    <div className="relative group">
                      <Input
                        id="inventory"
                        type="number"
                        value={editedProduct.inventory || 0}
                        onChange={(e) => handleFieldChange('inventory', parseInt(e.target.value) || 0)}
                        className={`mt-1 transition-colors ${
                          fieldErrors.inventory ? 'border-red-500 focus:border-red-500' : ''
                        } ${hasUnsavedChanges && editedProduct.inventory !== product.inventory ? 'border-blue-400' : ''}`}
                        placeholder="0"
                        min="0"
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <div className="relative group">
                    <Select 
                      value={editedProduct.status || 'draft'} 
                      onValueChange={(value: 'active' | 'draft' | 'archived') => handleFieldChange('status', value)}
                    >
                      <SelectTrigger className={`mt-1 transition-colors ${
                        hasUnsavedChanges && editedProduct.status !== product.status ? 'border-blue-400' : ''
                      }`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
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

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={closeLightbox}>
          <div className="relative max-w-7xl max-h-screen p-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <Image
                src={(editedProduct.images || product?.images || [])[lightboxIndex]}
                alt={`${product?.name} - Lightbox Image ${lightboxIndex + 1}`}
                width={1200}
                height={800}
                className="max-w-full max-h-[80vh] object-contain"
              />
              
              {/* Navigation arrows */}
              {(editedProduct.images || product?.images || []).length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                    onClick={() => navigateLightbox('prev')}
                    aria-label="Previous image"
                  >
                    <X className="h-6 w-6 rotate-180" />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                    onClick={() => navigateLightbox('next')}
                    aria-label="Next image"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </>
              )}
              
              {/* Close button */}
              <button
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
                onClick={closeLightbox}
                aria-label="Close lightbox"
              >
                <X className="h-6 w-6" />
              </button>
              
              {/* Image counter */}
              {(editedProduct.images || product?.images || []).length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {lightboxIndex + 1} / {(editedProduct.images || product?.images || []).length}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}
