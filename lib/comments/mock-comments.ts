export type CommentSort = "newest" | "oldest"

export interface ProductCommentModel {
  id: string
  productId: string
  user: {
    name: string
    avatarUrl?: string
  }
  text: string
  rating?: number
  createdAt: string
  status: "visible" | "hidden"
}

const comments: ProductCommentModel[] = [
  {
    id: "c_1",
    productId: "1",
    user: { name: "Sarah Chen" },
    text: "Love these! Customers keep asking when they’ll be back in stock.",
    rating: 5,
    createdAt: "2024-01-18T10:14:00.000Z",
    status: "visible",
  },
  {
    id: "c_2",
    productId: "1",
    user: { name: "John Doe" },
    text: "Noise cancellation is great. Mic could be a bit better though.",
    rating: 4,
    createdAt: "2024-01-16T17:42:00.000Z",
    status: "visible",
  },
  {
    id: "c_3",
    productId: "1",
    user: { name: "Aisha Khan" },
    text: "Is there a carry case included?",
    createdAt: "2024-01-20T08:03:00.000Z",
    status: "visible",
  },
  {
    id: "c_4",
    productId: "2",
    user: { name: "Maria Lopez" },
    text: "Soft fabric and fits perfectly.",
    rating: 5,
    createdAt: "2024-01-12T12:55:00.000Z",
    status: "visible",
  },
]

export function getMockCommentsByProductId(productId: string, sort: CommentSort): ProductCommentModel[] {
  const filtered = comments.filter((c) => c.productId === productId)

  const sorted = [...filtered].sort((a, b) => {
    const at = new Date(a.createdAt).getTime()
    const bt = new Date(b.createdAt).getTime()
    return sort === "newest" ? bt - at : at - bt
  })

  return sorted
}
