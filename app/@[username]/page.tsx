"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Twitter, 
  Send,
  ShoppingCart,
  ExternalLink,
  User
} from "lucide-react"

import { getMockCreatorByUsername } from "@/lib/creators/mock-creators"
import { getMockProductsByCreator } from "@/lib/products/storefront-products"

export default function StorefrontPage() {
  const params = useParams()
  const username = params.username as string
  
  const [creator, setCreator] = useState<ReturnType<typeof getMockCreatorByUsername>>(null)
  const [products, setProducts] = useState<ReturnType<typeof getMockProductsByCreator>>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      setIsLoading(true)
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const creatorData = getMockCreatorByUsername(username)
      const productsData = getMockProductsByCreator(username)
      
      setCreator(creatorData)
      setProducts(productsData)
      setIsLoading(false)
    }

    loadData()
  }, [username])

  const handleBuyClick = (product?: { id: string; name: string }) => {
    // In real app, this would handle checkout logic
    // For now, just open the creator's checkout URL
    if (creator?.checkoutUrl) {
      window.open(creator.checkoutUrl, '_blank')
    }
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />
      case 'youtube': return <Youtube className="h-5 w-5" />
      case 'tiktok': return <MessageCircle className="h-5 w-5" />
      case 'twitter': return <Twitter className="h-5 w-5" />
      case 'telegram': return <Send className="h-5 w-5" />
      default: return <ExternalLink className="h-5 w-5" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading storefront...</p>
        </div>
      </div>
    )
  }

  if (!creator) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Creator Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The creator @{username} doesn't exist or hasn't set up their storefront yet.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-background to-background/50">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Creator Info */}
          <div className="text-center mb-8">
            <div className="relative inline-block mb-4">
              {creator.avatarUrl ? (
                <Image
                  src={creator.avatarUrl}
                  alt={creator.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-background shadow-lg"
                />
              ) : (
                <div className="w-30 h-30 rounded-full bg-muted flex items-center justify-center border-4 border-background shadow-lg">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{creator.name}</h1>
            <p className="text-lg text-muted-foreground mb-4 max-w-2xl mx-auto">
              {creator.bio}
            </p>
            
            {/* Social Links */}
            {creator.socialLinks && Object.keys(creator.socialLinks).length > 0 && (
              <div className="flex justify-center gap-3 mb-6">
                {Object.entries(creator.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    aria-label={platform}
                  >
                    {getSocialIcon(platform)}
                  </a>
                ))}
              </div>
            )}
            
            <Badge variant="outline" className="text-sm">
              @{creator.username}
            </Badge>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-4xl mx-auto px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Products</h2>
          <p className="text-muted-foreground">
            {products.length > 0 
              ? `Discover ${products.length} product${products.length > 1 ? 's' : ''} from ${creator.name}`
              : `${creator.name} hasn't added any products yet.`
            }
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square bg-muted overflow-hidden rounded-t-lg">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <ShoppingCart className="h-12 w-12 text-primary/30" />
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ${product.price}
                      </span>
                    </div>
                    
                    <Button 
                      onClick={() => handleBuyClick(product)}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Products Yet</h3>
            <p className="text-muted-foreground mb-6">
              Check back soon or follow {creator.name} on social media for updates!
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>Storefront powered by Freexit</p>
            <Link href="/" className="hover:text-foreground transition-colors">
              Create your own storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
