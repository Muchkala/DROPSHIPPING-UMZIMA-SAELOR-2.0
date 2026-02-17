"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Clock, TrendingUp, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface SearchSuggestion {
  id: string
  title: string
  type: "product" | "order" | "customer" | "page"
  description?: string
  metadata?: Record<string, any>
  icon?: React.ReactNode
  trending?: boolean
  recent?: boolean
}

interface SmartSearchProps {
  placeholder?: string
  onSearch: (query: string) => void
  onSelect?: (suggestion: SearchSuggestion) => void
  suggestions?: SearchSuggestion[]
  recentSearches?: string[]
  className?: string
}

export function SmartSearch({
  placeholder = "Search products, orders, customers...",
  onSearch,
  onSelect,
  suggestions = [],
  recentSearches = [],
  className
}: SmartSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<SearchSuggestion[]>([])
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (query.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
        suggestion.description?.toLowerCase().includes(query.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setSelectedIndex(0)
    } else {
      setFilteredSuggestions([])
    }
  }, [query, suggestions])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredSuggestions.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredSuggestions[selectedIndex]) {
            handleSelect(filteredSuggestions[selectedIndex])
          }
          break
        case 'Escape':
          setOpen(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, filteredSuggestions, selectedIndex])

  const handleSelect = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.title)
    onSelect?.(suggestion)
    setOpen(false)
    onSearch(suggestion.title)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setOpen(false)
    }
  }

  const groupedSuggestions = React.useMemo(() => {
    const groups: Record<string, SearchSuggestion[]> = {}
    
    filteredSuggestions.forEach(suggestion => {
      if (!groups[suggestion.type]) {
        groups[suggestion.type] = []
      }
      groups[suggestion.type].push(suggestion)
    })

    return groups
  }, [filteredSuggestions])

  return (
    <div className={cn("relative w-full max-w-md", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setOpen(true)}
                placeholder={placeholder}
                className="pl-10 pr-10"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              )}
            </div>
          </form>
        </PopoverTrigger>

        <AnimatePresence>
          {open && (
            <PopoverContent className="w-full p-0" align="start">
              <Command className="rounded-lg border shadow-md">
                <div className="flex items-center border-b px-3">
                  <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                  <CommandInput
                    placeholder={placeholder}
                    value={query}
                    onValueChange={setQuery}
                    className="border-0 focus:ring-0"
                  />
                </div>

                <CommandList>
                  {/* Recent searches */}
                  {query.length === 0 && recentSearches.length > 0 && (
                    <CommandGroup heading="Recent Searches">
                      {recentSearches.slice(0, 5).map((search, index) => (
                        <CommandItem
                          key={`recent-${index}`}
                          onSelect={() => {
                            setQuery(search)
                            onSearch(search)
                            setOpen(false)
                          }}
                          className="flex items-center gap-2"
                        >
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{search}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Trending suggestions */}
                  {query.length === 0 && suggestions.filter(s => s.trending).length > 0 && (
                    <CommandGroup heading="Trending">
                      {suggestions.filter(s => s.trending).slice(0, 3).map((suggestion) => (
                        <CommandItem
                          key={suggestion.id}
                          onSelect={() => handleSelect(suggestion)}
                          className="flex items-center gap-2"
                        >
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="flex-1">{suggestion.title}</span>
                          {suggestion.trending && (
                            <Badge variant="secondary" className="text-xs">Trending</Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Filtered suggestions */}
                  {query.length > 0 && Object.entries(groupedSuggestions).map(([type, items]) => (
                    <CommandGroup key={type} heading={type.charAt(0).toUpperCase() + type.slice(1)}>
                      {items.map((suggestion, index) => (
                        <CommandItem
                          key={suggestion.id}
                          onSelect={() => handleSelect(suggestion)}
                          className={cn(
                            "flex items-center gap-2 px-2 py-2",
                            selectedIndex === filteredSuggestions.indexOf(suggestion) && "bg-accent"
                          )}
                        >
                          {suggestion.icon}
                          <div className="flex-1 min-w-0">
                            <div className="truncate font-medium">{suggestion.title}</div>
                            {suggestion.description && (
                              <div className="truncate text-sm text-muted-foreground">
                                {suggestion.description}
                              </div>
                            )}
                          </div>
                          {suggestion.recent && (
                            <Badge variant="outline" className="text-xs">Recent</Badge>
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}

                  {query.length > 0 && filteredSuggestions.length === 0 && (
                    <CommandEmpty>
                      <div className="flex flex-col items-center py-6 text-center">
                        <Filter className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No results found for "{query}"</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try different keywords or browse categories
                        </p>
                      </div>
                    </CommandEmpty>
                )}
              </CommandList>
            </Command>
            </PopoverContent>
          )}
        </AnimatePresence>
      </Popover>
    </div>
  )
}
