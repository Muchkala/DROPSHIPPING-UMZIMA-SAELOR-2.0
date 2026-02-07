export interface CreatorModel {
  username: string
  name: string
  bio: string
  avatarUrl?: string
  socialLinks?: {
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string
    telegram?: string
  }
  checkoutUrl: string // Default checkout URL (Shopify, Stripe, etc.)
}

const creators: Record<string, CreatorModel> = {
  "sarahchen": {
    username: "sarahchen",
    name: "Sarah Chen",
    bio: "Tech enthusiast | Product reviewer | Helping you find the best gadgets",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      instagram: "https://instagram.com/sarahchen",
      youtube: "https://youtube.com/@sarahchen",
      tiktok: "https://tiktok.com/@sarahchen",
    },
    checkoutUrl: "https://checkout.stripe.com/pay/your-session-id"
  },
  "johndoe": {
    username: "johndoe",
    name: "John Doe",
    bio: "Fashion & lifestyle | Sustainable products | Minimal living",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      instagram: "https://instagram.com/johndoe",
      telegram: "https://t.me/johndoe",
    },
    checkoutUrl: "https://shop.example.com/checkout"
  },
  "aishakhan": {
    username: "aishakhan",
    name: "Aisha Khan",
    bio: "Home decor expert | DIY enthusiast | Creating beautiful spaces",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    socialLinks: {
      youtube: "https://youtube.com/@aishakhan",
      instagram: "https://instagram.com/aishakhan",
      tiktok: "https://tiktok.com/@aishakhan",
    },
    checkoutUrl: "https://kaspi.kz/checkout"
  }
}

export function getMockCreatorByUsername(username: string): CreatorModel | null {
  return creators[username] ?? null
}

export function getAllMockCreators(): CreatorModel[] {
  return Object.values(creators)
}
