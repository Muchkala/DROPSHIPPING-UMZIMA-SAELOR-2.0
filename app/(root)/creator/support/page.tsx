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
  MessageSquare,
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  Filter,
  Reply,
  Archive,
  Star,
  TrendingUp,
  Users,
  Headphones,
  Package,
  DollarSign
} from "lucide-react"

interface SupportTicket {
  id: string
  customer: {
    name: string
    email: string
    phone?: string
  }
  subject: string
  message: string
  category: "order" | "product" | "payment" | "shipping" | "general"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  createdAt: string
  updatedAt: string
  assignedTo?: string
  responses: Array<{
    id: string
    message: string
    author: string
    createdAt: string
    isCustomer: boolean
  }>
}

const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1 234-567-8900"
    },
    subject: "Order not received",
    message: "I placed order ORD-001 a week ago but haven't received it yet. Can you check the tracking status?",
    category: "shipping",
    priority: "high",
    status: "open",
    createdAt: "2024-01-17T10:30:00Z",
    updatedAt: "2024-01-17T10:30:00Z",
    responses: []
  },
  {
    id: "TKT-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com"
    },
    subject: "Product defect - Wireless Headphones",
    message: "The headphones I received are not working properly. The left side has no sound.",
    category: "product",
    priority: "medium",
    status: "in-progress",
    createdAt: "2024-01-16T14:20:00Z",
    updatedAt: "2024-01-17T09:15:00Z",
    assignedTo: "Support Agent",
    responses: [
      {
        id: "1",
        message: "Hi Jane, I'm sorry to hear about the issue with your headphones. We'd be happy to send you a replacement. Can you confirm your shipping address?",
        author: "Support Agent",
        createdAt: "2024-01-17T09:15:00Z",
        isCustomer: false
      }
    ]
  },
  {
    id: "TKT-003",
    customer: {
      name: "Bob Johnson",
      email: "bob@example.com"
    },
    subject: "Payment failed",
    message: "My payment was declined but I was charged. Can you help me resolve this?",
    category: "payment",
    priority: "urgent",
    status: "resolved",
    createdAt: "2024-01-15T16:45:00Z",
    updatedAt: "2024-01-16T11:30:00Z",
    assignedTo: "Billing Team",
    responses: [
      {
        id: "1",
        message: "Hi Bob, I've checked your account and the charge was reversed. You should see the refund in 3-5 business days.",
        author: "Billing Team",
        createdAt: "2024-01-16T11:30:00Z",
        isCustomer: false
      }
    ]
  }
]

export default function SupportPage() {
  const router = useRouter()
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)

  useEffect(() => {
    const loadTickets = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 500))
      setTickets(mockTickets)
      setIsLoading(false)
    }

    loadTickets()
  }, [])

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesCategory = categoryFilter === "all" || ticket.category === categoryFilter
    
    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-red-100 text-red-800"
      case "in-progress": return "bg-yellow-100 text-yellow-800"
      case "resolved": return "bg-green-100 text-green-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "order": return <Package className="h-4 w-4" />
      case "product": return <Headphones className="h-4 w-4" />
      case "payment": return <DollarSign className="h-4 w-4" />
      case "shipping": return <Package className="h-4 w-4" />
      case "general": return <MessageSquare className="h-4 w-4" />
      default: return <MessageSquare className="h-4 w-4" />
    }
  }

  const ticketStats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === "open").length,
    inProgress: tickets.filter(t => t.status === "in-progress").length,
    resolved: tickets.filter(t => t.status === "resolved").length,
    urgent: tickets.filter(t => t.priority === "urgent").length
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
          <h1 className="text-3xl font-bold tracking-tight">Customer Support</h1>
          <p className="text-muted-foreground">
            Manage customer inquiries and support tickets
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowNewTicketDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.total}</div>
            <p className="text-xs text-muted-foreground">
              All support tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.open}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Being handled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ticketStats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              Completed tickets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{ticketStats.urgent}</div>
            <p className="text-xs text-muted-foreground">
              High priority
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="order">Order</SelectItem>
            <SelectItem value="product">Product</SelectItem>
            <SelectItem value="payment">Payment</SelectItem>
            <SelectItem value="shipping">Shipping</SelectItem>
            <SelectItem value="general">General</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No tickets found</h3>
              <p className="text-muted-foreground">
                {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "You haven't received any support tickets yet"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Ticket Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{ticket.id}</h3>
                      <Badge className={getStatusColor(ticket.status)}>
                        {ticket.status.replace("-", " ").charAt(0).toUpperCase() + ticket.status.slice(1).replace("-", " ")}
                      </Badge>
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {getCategoryIcon(ticket.category)}
                        <span className="text-sm text-muted-foreground capitalize">{ticket.category}</span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium mb-2">{ticket.subject}</h4>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{ticket.message}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        <span>{ticket.customer.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        <span>{ticket.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {ticket.responses.length > 0 && (
                      <div className="mt-3 p-2 bg-muted/50 rounded">
                        <p className="text-sm font-medium mb-1">Latest Response:</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {ticket.responses[ticket.responses.length - 1].message}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Ticket Actions */}
                  <div className="flex flex-col lg:items-end gap-3">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Reply className="h-4 w-4 mr-2" />
                        Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {ticket.assignedTo && (
                      <div className="text-sm text-muted-foreground">
                        Assigned to: <span className="font-medium">{ticket.assignedTo}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* New Ticket Dialog */}
      <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>
              Create a new support ticket for customer inquiry
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customer-email">Customer Email</Label>
                <Input type="email" placeholder="Enter customer email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order">Order</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input placeholder="Enter ticket subject" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea placeholder="Describe the issue..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewTicketDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowNewTicketDialog(false)}>
              Create Ticket
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
