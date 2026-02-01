export interface ProductModel {
  id: string
  name: string
  description: string
  price: number
  status: "active" | "draft" | "archived"
  inventory: number
  sku: string
  images: string[]
  tags: string[]
  createdAt: string
  updatedAt: string
}

export function getMockProductById(productId: string): ProductModel {
  const products: Record<string, ProductModel> = {
    "1": {
      id: "1",
      name: "Wireless Bluetooth Headphones Premium Noise-Cancelling Headphones with Extended Battery Life",
      description:
        "Experience premium sound quality with these advanced wireless headphones featuring industry-leading noise cancellation technology and 30-hour battery life for uninterrupted listening pleasure. Perfect for travel, work, or everyday use.",
      price: 199.99,
      status: "active",
      inventory: 45,
      sku: "WBH-001",
      images: [],
      tags: ["wireless", "bluetooth", "noise-cancelling"],
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    "2": {
      id: "2",
      name: "Organic Cotton T-Shirt Sustainable Comfortable Everyday Wear Essential",
      description:
        "Made from 100% organic cotton, this comfortable t-shirt is perfect for everyday wear. Sustainable fashion that feels good on your skin and good for the planet.",
      price: 29.99,
      status: "active",
      inventory: 120,
      sku: "OCT-002",
      images: [],
      tags: ["organic", "cotton", "sustainable"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-18",
    },
    "3": {
      id: "3",
      name: "Smart Home Security Camera 1080p HD Night Vision Motion Detection",
      description:
        "Advanced security camera with crystal clear 1080p HD video quality, enhanced night vision capabilities, and intelligent motion detection for comprehensive home monitoring.",
      price: 89.99,
      status: "draft",
      inventory: 0,
      sku: "SHC-003",
      images: [],
      tags: ["smart home", "security", "wifi"],
      createdAt: "2024-01-22",
      updatedAt: "2024-01-22",
    },
  }

  return (
    products[productId] ?? {
      id: productId,
      name: "Unknown Product",
      description: "",
      price: 0,
      status: "draft",
      inventory: 0,
      sku: "",
      images: [],
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )
}
