"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Target,
  Users,
  Share2,
  Calendar,
  TrendingUp,
  DollarSign,
  Link2,
  Copy,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Instagram,
  Youtube,
  MessageCircle,
  Twitter,
  Send,
  Mail,
  Gift,
  BarChart3,
  Plus,
  Settings,
  Edit,
  Trash2,
  Package,
  ShoppingCart
} from "lucide-react"

interface SocialPost {
  id: string
  platform: "instagram" | "youtube" | "tiktok" | "twitter" | "telegram"
  content: string
  image?: string
  scheduledDate: string
  status: "scheduled" | "posted" | "draft"
  engagement?: {
    likes: number
    comments: number
    shares: number
  }
}

interface AffiliateLink {
  id: string
  product: string
  code: string
  commission: number
  clicks: number
  conversions: number
  revenue: number
  status: "active" | "inactive"
}

const mockSocialPosts: SocialPost[] = [
  {
    id: "1",
    platform: "instagram",
    content: "Check out our new wireless headphones! 🎧 Premium sound quality with 30-hour battery life. Limited time offer - 20% off! #tech #audio #deals",
    scheduledDate: "2024-01-20T14:00:00Z",
    status: "scheduled",
    engagement: { likes: 0, comments: 0, shares: 0 }
  },
  {
    id: "2",
    platform: "youtube",
    content: "Full review of our best-selling smart camera! See why customers love it. Link in bio! 📹",
    scheduledDate: "2024-01-18T10:00:00Z",
    status: "posted",
    engagement: { likes: 245, comments: 89, shares: 34 }
  },
  {
    id: "3",
    platform: "twitter",
    content: "Flash sale! All organic t-shirts 50% off this weekend only. Eco-friendly fashion that feels good! 🌱 #sustainable #fashion",
    scheduledDate: "2024-01-19T16:00:00Z",
    status: "draft",
    engagement: { likes: 0, comments: 0, shares: 0 }
  }
]

const mockAffiliateLinks: AffiliateLink[] = [
  {
    id: "1",
    product: "Wireless Bluetooth Headphones",
    code: "SARAH20",
    commission: 15,
    clicks: 1250,
    conversions: 45,
    revenue: 1349.55,
    status: "active"
  },
  {
    id: "2",
    product: "Organic Cotton T-Shirt",
    code: "ECO15",
    commission: 10,
    clicks: 890,
    conversions: 28,
    revenue: 839.72,
    status: "active"
  },
  {
    id: "3",
    product: "Smart Home Security Camera",
    code: "CAMERA25",
    commission: 20,
    clicks: 450,
    conversions: 12,
    revenue: 215.88,
    status: "inactive"
  }
]

export default function MarketingPage() {
  const router = useRouter()
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [showAffiliateDialog, setShowAffiliateDialog] = useState(false)

  useEffect(() => {
    const loadMarketingData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setSocialPosts(mockSocialPosts)
      setAffiliateLinks(mockAffiliateLinks)
      setIsLoading(false)
    }

    loadMarketingData()
  }, [])

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />
      case 'youtube': return <Youtube className="h-5 w-5" />
      case 'tiktok': return <MessageCircle className="h-5 w-5" />
      case 'twitter': return <Twitter className="h-5 w-5" />
      case 'telegram': return <Send className="h-5 w-5" />
      default: return <Share2 className="h-5 w-5" />
    }
  }

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return "bg-pink-100 text-pink-800"
      case 'youtube': return "bg-red-100 text-red-800"
      case 'tiktok': return "bg-black text-white"
      case 'twitter': return "bg-blue-100 text-blue-800"
      case 'telegram': return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted": return "bg-green-100 text-green-800"
      case "scheduled": return "bg-blue-100 text-blue-800"
      case "draft": return "bg-gray-100 text-gray-800"
      case "active": return "bg-green-100 text-green-800"
      case "inactive": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = affiliateLinks.reduce((sum, link) => sum + link.revenue, 0)
  const totalClicks = affiliateLinks.reduce((sum, link) => sum + link.clicks, 0)
  const totalConversions = affiliateLinks.reduce((sum, link) => sum + link.conversions, 0)
  const avgCommission = affiliateLinks.filter(l => l.status === "active").reduce((sum, link) => sum + link.commission, 0) / affiliateLinks.filter(l => l.status === "active").length || 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketing Tools</h1>
          <p className="text-muted-foreground">
            Grow your business with social media and affiliate marketing
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowPostDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
          <Button variant="outline" onClick={() => setShowAffiliateDialog(true)}>
            <Link2 className="h-4 w-4 mr-2" />
            Create Affiliate Link
          </Button>
        </div>
      </div>

      {/* Marketing Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              From affiliate sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Affiliate link clicks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              Successful sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgCommission.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Per affiliate sale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Tools */}
      <Tabs defaultValue="social" className="space-y-4">
        <TabsList>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="affiliate">Affiliate Marketing</TabsTrigger>
          <TabsTrigger value="email">Email Campaigns</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Social Media Scheduling */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialPosts.map((post) => (
                  <div key={post.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getPlatformColor(post.platform)}`}>
                        {getPlatformIcon(post.platform)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(post.scheduledDate).toLocaleDateString()}
                          </span>
                          <Badge className={getStatusColor(post.status)}>
                            {post.status}
                          </Badge>
                          {post.status === "posted" && post.engagement && (
                            <span className="flex items-center gap-3">
                              <span>❤️ {post.engagement.likes}</span>
                              <span>💬 {post.engagement.comments}</span>
                              <span>🔄 {post.engagement.shares}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Affiliate Marketing */}
        <TabsContent value="affiliate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                Affiliate Links
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {affiliateLinks.map((link) => (
                  <div key={link.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{link.product}</h4>
                        <Badge className={getStatusColor(link.status)}>
                          {link.status}
                        </Badge>
                        <Badge variant="outline">{link.commission}% commission</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <span>Code: <strong>{link.code}</strong></span>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Clicks:</span>
                          <span className="ml-2 font-medium">{link.clicks}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversions:</span>
                          <span className="ml-2 font-medium">{link.conversions}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Revenue:</span>
                          <span className="ml-2 font-medium">${link.revenue.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Campaigns */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Email Marketing Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Create and manage email campaigns to engage with your customers
                </p>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Get Notified
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Marketing Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Advanced Analytics Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed insights into your marketing performance and ROI
                </p>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Request Early Access
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link href="/creator/products">
            <Button variant="outline" className="w-full justify-start">
              <Package className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
          </Link>
          <Link href="/creator/orders">
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="h-4 w-4 mr-2" />
              View Orders
            </Button>
          </Link>
          <Link href="/creator/profile">
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Profile Settings
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Schedule Post Dialog */}
      <Dialog open={showPostDialog} onOpenChange={setShowPostDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Social Media Post</DialogTitle>
            <DialogDescription>
              Create and schedule a post for your social media platforms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="twitter">Twitter</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="telegram">Telegram</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea placeholder="Write your post content..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule">Schedule Date</Label>
              <Input type="datetime-local" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPostDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowPostDialog(false)}>
              Schedule Post
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Affiliate Link Dialog */}
      <Dialog open={showAffiliateDialog} onOpenChange={setShowAffiliateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Affiliate Link</DialogTitle>
            <DialogDescription>
              Generate a new affiliate link for your products
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="headphones">Wireless Headphones</SelectItem>
                  <SelectItem value="tshirt">Organic T-Shirt</SelectItem>
                  <SelectItem value="camera">Smart Camera</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="code">Discount Code</Label>
              <Input placeholder="Enter discount code" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commission">Commission Rate (%)</Label>
              <Input type="number" placeholder="15" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAffiliateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowAffiliateDialog(false)}>
              Create Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
