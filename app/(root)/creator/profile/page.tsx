"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  User, 
  Camera, 
  Instagram, 
  Youtube, 
  MessageCircle, 
  Twitter, 
  Send,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Users
} from "lucide-react"

interface CreatorProfile {
  username: string
  name: string
  bio: string
  avatarUrl?: string
  email: string
  socialLinks: {
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string
    telegram?: string
  }
}

const mockProfile: CreatorProfile = {
  username: "sarahchen",
  name: "Sarah Chen",
  bio: "Tech enthusiast | Product reviewer | Helping you find the best gadgets",
  avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  email: "sarah@example.com",
  socialLinks: {
    instagram: "https://instagram.com/sarahchen",
    youtube: "https://youtube.com/@sarahchen",
    tiktok: "https://tiktok.com/@sarahchen",
  }
}

export default function CreatorProfile() {
  const router = useRouter()
  const [profile, setProfile] = useState<CreatorProfile>(mockProfile)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [saveMessage, setSaveMessage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Simulate API call
    const loadProfile = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setIsLoading(false)
    }

    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    setIsSaving(true)
    setSaveMessage("")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    setSaveMessage("Profile saved successfully!")
    
    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setSaveMessage("Passwords do not match")
      return
    }

    setIsSaving(true)
    setSaveMessage("")
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSaving(false)
    setShowPasswordDialog(false)
    setNewPassword("")
    setConfirmPassword("")
    setSaveMessage("Password changed successfully!")
    
    setTimeout(() => setSaveMessage(""), 3000)
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setSaveMessage("File size must be less than 2MB")
        setTimeout(() => setSaveMessage(""), 3000)
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setSaveMessage("Please select an image file")
        setTimeout(() => setSaveMessage(""), 3000)
        return
      }

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const newAvatarUrl = e.target?.result as string
        setProfile(prev => ({ ...prev, avatarUrl: newAvatarUrl }))
        setSaveMessage("Avatar updated! Click 'Save Changes' to persist.")
        setTimeout(() => setSaveMessage(""), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-4 w-4" />
      case 'youtube': return <Youtube className="h-4 w-4" />
      case 'tiktok': return <MessageCircle className="h-4 w-4" />
      case 'twitter': return <Twitter className="h-4 w-4" />
      case 'telegram': return <Send className="h-4 w-4" />
      default: return null
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your public profile and account settings
          </p>
        </div>
        <Button onClick={handleSaveProfile} disabled={isSaving} className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Success/Error Message */}
      {saveMessage && (
        <div className={`p-3 rounded-md text-sm ${
          saveMessage.includes("successfully") 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {saveMessage}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>
                  <User className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  aria-label="Upload avatar image"
                />
                <Button variant="outline" size="sm" onClick={handleAvatarClick}>
                  <Camera className="h-4 w-4 mr-2" />
                  Change Avatar
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={profile.username}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Username cannot be changed
                </p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                placeholder="Tell people about yourself"
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                Brief description for your storefront. Max 200 characters.
              </p>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
                placeholder="your@email.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Social Links */}
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries({
              instagram: "Instagram",
              youtube: "YouTube", 
              tiktok: "TikTok",
              twitter: "Twitter",
              telegram: "Telegram"
            }).map(([platform, label]) => (
              <div key={platform} className="space-y-2">
                <Label htmlFor={platform} className="flex items-center gap-2">
                  {getSocialIcon(platform)}
                  {label}
                </Label>
                <Input
                  id={platform}
                  value={profile.socialLinks[platform as keyof typeof profile.socialLinks] || ""}
                  onChange={(e) => setProfile({
                    ...profile,
                    socialLinks: {
                      ...profile.socialLinks,
                      [platform]: e.target.value
                    }
                  })}
                  placeholder={`https://${platform}.com/username`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Password</Label>
              <p className="text-sm text-muted-foreground">
                Change your password to keep your account secure
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPasswordDialog(true)}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Storefront Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Storefront Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <a href={`/@${profile.username}`} target="_blank" rel="noopener noreferrer">
                <Users className="h-4 w-4 mr-2" />
                View Storefront
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your new password below. Make sure it's at least 8 characters long.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange} disabled={isSaving}>
              {isSaving ? "Changing..." : "Change Password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
