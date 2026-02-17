"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Filter, 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  Package,
  Star,
  Clock
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface FilterState {
  search: string
  category: string[]
  status: string[]
  priceRange: [number, number]
  dateRange: string
  rating: number
  inStock: boolean
  sortBy: string
}

interface AdvancedFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onApply: () => void
  onReset: () => void
}

const categories = [
  "Electronics", "Clothing", "Home & Garden", "Sports", 
  "Books", "Toys", "Beauty", "Food"
]

const statuses = ["active", "draft", "archived"]

const sortOptions = [
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "created-desc", label: "Newest First" },
  { value: "created-asc", label: "Oldest First" },
]

export function AdvancedFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  onApply,
  onReset
}: AdvancedFilterDrawerProps) {
  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category)
    
    onFiltersChange({ ...filters, category: newCategories })
  }

  const handleStatusChange = (status: string, checked: boolean) => {
    const newStatuses = checked
      ? [...filters.status, status]
      : filters.status.filter(s => s !== status)
    
    onFiltersChange({ ...filters, status: newStatuses })
  }

  const activeFiltersCount = [
    filters.search,
    filters.category.length > 0,
    filters.status.length > 0,
    filters.priceRange[0] > 0 || filters.priceRange[1] < 1000,
    filters.dateRange !== "all",
    filters.rating > 0,
    !filters.inStock
  ].filter(Boolean).length

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Advanced Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Categories */}
                <div className="space-y-3">
                  <Label>Categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={category}
                          checked={filters.category.includes(category)}
                          onCheckedChange={(checked: boolean) => handleCategoryChange(category, checked)}
                        />
                        <Label htmlFor={category} className="text-sm font-normal">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <Label>Status</Label>
                  <div className="space-y-2">
                    {statuses.map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox
                          id={status}
                          checked={filters.status.includes(status)}
                          onCheckedChange={(checked: boolean) => handleStatusChange(status, checked)}
                        />
                        <Label htmlFor={status} className="text-sm font-normal capitalize">
                          {status}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-3">
                <Label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</Label>
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value as [number, number] })}
                  max={1000}
                  min={0}
                  step={10}
                  className="mt-2"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {/* Date Range */}
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select
                    value={filters.dateRange}
                    onValueChange={(value: string) => onFiltersChange({ ...filters, dateRange: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating">Minimum Rating</Label>
                  <Select
                    value={filters.rating.toString()}
                    onValueChange={(value: string) => onFiltersChange({ ...filters, rating: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="5">5 Stars Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Stock Status */}
                <div className="space-y-3">
                  <Label>Stock Status</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={filters.inStock}
                        onCheckedChange={(checked: boolean) => onFiltersChange({ ...filters, inStock: checked })}
                      />
                      <Label htmlFor="inStock" className="text-sm font-normal">
                        In Stock Only
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-2">
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => onFiltersChange({ ...filters, sortBy: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={onReset}>
                  Reset Filters
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button onClick={onApply}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
