"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Package, 
  Star, 
  MoreVertical,
  Copy,
  Archive,
  ExternalLink
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface Product {
  id: string
  name: string
  price: number
  category: string
  status: "active" | "draft" | "archived"
  image: string
  sku: string
  description?: string
}

interface EnhancedProductCardProps {
  product: Product
  onUpdate: (id: string, updates: Partial<Product>) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onArchive: (id: string) => void
  onPreview: (id: string) => void
}

export function EnhancedProductCard({
  product,
  onUpdate,
  onDelete,
  onDuplicate,
  onArchive,
  onPreview
}: EnhancedProductCardProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editName, setEditName] = React.useState(product.name)
  const [editPrice, setEditPrice] = React.useState(product.price.toString())
  const [isDragging, setIsDragging] = React.useState(false)

  const handleSave = () => {
    onUpdate(product.id, {
      name: editName,
      price: parseFloat(editPrice)
    })
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditName(product.name)
    setEditPrice(product.price.toString())
    setIsEditing(false)
  }

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true)
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("productId", product.id)
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "draft": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "archived": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.2 }}
      className={isDragging ? "opacity-50" : ""}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-move">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-sm font-medium mb-2"
                  autoFocus
                />
              ) : (
                <h3 className="text-sm font-medium truncate">{product.name}</h3>
              )}
              <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
            </div>
            
            <div className="flex items-center gap-1">
              <Badge className={getStatusColor(product.status)}>
                {product.status}
              </Badge>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onPreview(product.id)}>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    <Edit3 className="h-4 w-4 mr-2" />
                    Quick Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onArchive(product.id)}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete(product.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg mb-3 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>

          {/* Product Details */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">$</span>
                  <Input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-20 h-8 text-sm"
                    type="number"
                    step="0.01"
                  />
                </div>
              ) : (
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              )}
              
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">4.5</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-1 rounded">{product.category}</span>
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                In Stock
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onPreview(product.id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Inline Edit Dialog */}
      <AnimatePresence>
        {isEditing && (
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Quick Edit Product</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Product Name</label>
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Price</label>
                  <Input
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    type="number"
                    step="0.01"
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="outline" onClick={handleCancel} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
