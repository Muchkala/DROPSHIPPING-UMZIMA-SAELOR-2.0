"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star, ImageOff } from "lucide-react"

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

  useEffect(() => {
    setIsLoading(true)
    const t = setTimeout(() => {
      setComments(getMockCommentsByProductId(productId, sort))
      setIsLoading(false)
    }, 250)

    return () => clearTimeout(t)
  }, [productId, sort])

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
    setReplyOpenForId(null)
    setReplyDraft("")
  }

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
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">{comments.length} comments</div>
            <div className="w-[160px]">
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

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-6 text-sm text-muted-foreground">Loading comments…</div>
              ) : comments.length === 0 ? (
                <div className="p-6 text-sm text-muted-foreground">No comments yet.</div>
              ) : (
                <div className="divide-y">
                  {comments.map((comment) => {
                    const initials = comment.user.name
                      .split(" ")
                      .filter(Boolean)
                      .slice(0, 2)
                      .map((p) => p[0]?.toUpperCase())
                      .join("")

                    return (
                      <div key={comment.id} className="p-4">
                        <div className="flex items-start gap-3">
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
                                    <span className="text-xs text-muted-foreground">Hidden</span>
                                  ) : null}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </div>

                            <div className={"mt-2 text-sm leading-relaxed " + (comment.status === "hidden" ? "text-muted-foreground" : "")}> 
                              {comment.text}
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleReply(comment.id)}>
                                Reply
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleToggleHide(comment.id)}>
                                {comment.status === "hidden" ? "Unhide" : "Hide"}
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDelete(comment.id)}>
                                Delete
                              </Button>
                            </div>

                            {replyOpenForId === comment.id ? (
                              <div className="mt-3 space-y-2">
                                <Textarea
                                  value={replyDraft}
                                  onChange={(e) => setReplyDraft(e.target.value)}
                                  placeholder="Write a reply…"
                                  rows={3}
                                />
                                <div className="flex items-center gap-2">
                                  <Button size="sm" onClick={handleSendReply} disabled={!replyDraft.trim()}>
                                    Send
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleReply(comment.id)}>
                                    Cancel
                                  </Button>
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
