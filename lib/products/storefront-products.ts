import { getMockProductById } from "./mock-products"

export interface StorefrontProduct {
  id: string
  name: string
  price: number
  imageUrl?: string
  checkoutUrl?: string // Product-specific checkout URL
}

// Mock function to get products for a specific creator
// In real app, this would fetch from API based on creator ID
export function getMockProductsByCreator(username: string): StorefrontProduct[] {
  // For demo, return some products for each creator
  const creatorProducts: Record<string, string[]> = {
    "sarahchen": ["1", "2"], // Wireless headphones, Organic t-shirt
    "johndoe": ["2"], // Organic t-shirt
    "aishakhan": ["3"], // Smart camera
  }

  const productIds = creatorProducts[username] || []
  
  return productIds.map(id => {
    const product = getMockProductById(id)
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.images[0] || undefined,
      checkoutUrl: undefined // Will use creator's default checkout
    }
  }).filter(product => product.name !== "Unknown Product")
}
