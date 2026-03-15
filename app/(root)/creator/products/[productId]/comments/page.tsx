"use client"

import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Star, ImageOff, Edit2, Save, X, Search, Check } from "lucide-react"

import { getMockProductById } from "@/lib/products/mock-products"
import type { CommentSort, ProductCommentModel } from "@/lib/comments/mock-comments"
import { getMockCommentsByProductId } from "@/lib/comments/mock-comments"

export default function ProductCommentsPage() {
  const params = useParams()
  const productId = params.productId as string

  const product = useMemo(() => getMockProductById(productId), [productId])

  const [sort, setSort] = useState<CommentSort>("newest")
  const [isLoading, setIsLoading] = useState(true)
  const [comments, setComments] = useState<ProductCommentModel[]>([])
  const [replyOpenForId, setReplyOpenForId] = useState<string | null>(null)
  const [replyDraft, setReplyDraft] = useState("")
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedComments, setSelectedComments] = useState<string[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-save draft replies to localStorage
  useEffect(() => {
    if (replyOpenForId && replyDraft) {
      const draftKey = `reply-draft-${replyOpenForId}`
      localStorage.setItem(draftKey, replyDraft)
    }
  }, [replyDraft, replyOpenForId])

  // Load draft from localStorage when opening reply
  useEffect(() => {
    if (replyOpenForId) {
      const draftKey = `reply-draft-${replyOpenForId}`
      const savedDraft = localStorage.getItem(draftKey)
      if (savedDraft) {
        setReplyDraft(savedDraft)
      }
      // Focus textarea
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [replyOpenForId])

  // Clear draft when closing reply
  useEffect(() => {
    if (!replyOpenForId) {
      // Clear all reply drafts
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('reply-draft-')) {
          localStorage.removeItem(key)
        }
      })
    }
  }, [replyOpenForId])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return
      }

      if (e.key === 'e' && e.ctrlKey) {
        e.preventDefault()
        // Edit first selected comment or first visible comment
        const targetComment = selectedComments[0] || comments.find(c => c.status === 'visible')?.id
        if (targetComment) {
          const comment = comments.find(c => c.id === targetComment)
          if (comment) handleEditComment(targetComment, comment.text)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedComments, comments])

  const handleToggleHide = (id: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === "hidden" ? "visible" : "hidden" } : c))
    )
  }

  const handleDelete = (id: string) => {
    setComments((prev) => prev.filter((c) => c.id !== id))
    if (replyOpenForId === id) {
      setReplyOpenForId(null)
      setReplyDraft("")
    }
  }

  const handleReply = (id: string) => {
    if (replyOpenForId === id) {
      setReplyOpenForId(null)
      setReplyDraft("")
      return
    }
    setReplyOpenForId(id)
    setReplyDraft("")
  }

  const handleSendReply = () => {
    if (!replyDraft.trim()) return
    
    // Simulate sending reply
    setReplyOpenForId(null)
    setReplyDraft("")
  }

  const handleEditComment = (id: string, currentText: string) => {
    setEditingCommentId(id)
    setEditDraft(currentText)
  }

  const handleSaveEdit = () => {
    if (!editDraft.trim() || !editingCommentId) return
    
    setComments(prev => 
      prev.map(comment => 
        comment.id === editingCommentId 
          ? { ...comment, text: editDraft.trim() }
          : comment
      )
    )
    setEditingCommentId(null)
    setEditDraft("")
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditDraft("")
  }

  const handleToggleSelect = (id: string) => {
    setSelectedComments(prev => 
      prev.includes(id) 
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    )
  }

  const handleBulkHide = () => {
    setComments(prev => 
      prev.map(comment => 
        selectedComments.includes(comment.id)
          ? { ...comment, status: "hidden" as const }
          : comment
      )
    )
    setSelectedComments([])
  }

  const handleBulkDelete = () => {
    setComments(prev => prev.filter(comment => !selectedComments.includes(comment.id)))
    setSelectedComments([])
  }

  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => {
      setComments(getMockCommentsByProductId(productId, sort))
      setIsLoading(false)
    }, 250)

    return () => clearTimeout(t)
  }, [productId, sort])

  // Filter comments based on search
  const filteredComments = useMemo(() => {
    if (!searchQuery.trim()) return comments
    
    const query = searchQuery.toLowerCase()
    return comments.filter(comment => 
      comment.user.name.toLowerCase().includes(query) ||
      comment.text.toLowerCase().includes(query)
    )
  }, [comments, searchQuery])

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={
              "h-3.5 w-3.5 " +
              (i < rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/40")
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Comments</div>
        <h1 className="mt-1 text-xl sm:text-2xl font-semibold leading-tight line-clamp-2">{product.name}</h1>
        <div className="mt-2 text-xs text-muted-foreground">
          <span className="font-mono bg-muted px-2 py-1 rounded">Ctrl+E</span> Edit Comment • 
          <span className="font-mono bg-muted px-2 py-1 rounded ml-1">Click</span> Select • 
          <span className="font-mono bg-muted px-2 py-1 rounded ml-1">Search</span> Filter
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="text-sm text-muted-foreground">{filteredComments.length} comments</div>
              {selectedComments.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {selectedComments.length} selected
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search comments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              <div className="w-[120px]">
                <Select value={sort} onValueChange={(v: CommentSort) => setSort(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {selectedComments.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-800">
                    {selectedComments.length} comment{selectedComments.length !== 1 ? 's' : ''} selected
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={handleBulkHide}>
                      Hide Selected
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
                      Delete Selected
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setSelectedComments([])}>
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-muted animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-24 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-16 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                      <div className="h-16 bg-muted animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              ) : filteredComments.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">
                  {searchQuery ? 'No comments found matching your search.' : 'No comments yet.'}
                </div>
              ) : (
                <div className="divide-y">
                  {filteredComments.map((comment) => {
                    const initials = comment.user.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("")

                    return (
                      <div 
                        key={comment.id} 
                        className={`p-4 transition-colors ${
                          selectedComments.includes(comment.id) ? 'bg-blue-50/50' : ''
                        } ${editingCommentId === comment.id ? 'bg-yellow-50/50' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedComments.includes(comment.id)}
                            onChange={() => handleToggleSelect(comment.id)}
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select comment from ${comment.user.name}`}
                          />
                          <div className="h-9 w-9 shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                            {initials || "U"}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium truncate">{comment.user.name}</div>
                                  {typeof comment.rating === "number" ? renderStars(comment.rating) : null}
                                  {comment.status === "hidden" ? (
                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Hidden</span>
                                  ) : null}
                                  {editingCommentId === comment.id && (
                                    <Badge variant="outline" className="text-xs">
                                      <Edit2 className="h-3 w-3 mr-1" />
                                      Editing
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            {editingCommentId === comment.id ? (
                              <div className="mt-2 space-y-2">
                                <Textarea
                                  value={editDraft}
                                  onChange={(e) => setEditDraft(e.target.value)}
                                  placeholder="Edit comment..."
                                  rows={3}
                                  className="resize-none"
                                  maxLength={1000}
                                />
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    {editDraft.length}/1000 characters
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                                      <X className="h-3 w-3 mr-1" />
                                      Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSaveEdit} disabled={!editDraft.trim()}>
                                      <Save className="h-3 w-3 mr-1" />
                                      Save Changes
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`mt-2 text-sm leading-relaxed ${
                                comment.status === "hidden" ? "text-muted-foreground" : ""
                              }`}> 
                                {comment.text}
                              </div>
                            )}

                            {editingCommentId !== comment.id && (
                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleReply(comment.id)}>
                                  Reply
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment.id, comment.text)}>
                                  <Edit2 className="h-3 w-3 mr-1" />
                                  Edit
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleToggleHide(comment.id)}>
                                  {comment.status === "hidden" ? "Unhide" : "Hide"}
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)}>
                                  Delete
                                </Button>
                              </div>
                            )}

                            {replyOpenForId === comment.id ? (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  ref={textareaRef}
                                  value={replyDraft}
                                  onChange={(e) => setReplyDraft(e.target.value)}
                                  placeholder="Write a reply…"
                                  rows={3}
                                  className="resize-none"
                                  maxLength={500}
                                />
                                <div className="flex items-center justify-between">
                                  <div className="text-xs text-muted-foreground">
                                    {replyDraft.length}/500 characters
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleReply(comment.id)}>
                                      Cancel
                                    </Button>
                                    <Button size="sm" onClick={handleSendReply} disabled={!replyDraft.trim()}>
                                      <Check className="h-3 w-3 mr-1" />
                                      Send Reply
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-md bg-muted overflow-hidden flex items-center justify-center">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageOff className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-sm line-clamp-2">{product.name}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
