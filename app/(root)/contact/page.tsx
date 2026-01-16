
export default function ContactPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Contact FREEXIT</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Get in touch with our dropshipping experts and start your e-commerce journey today.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Name</label>
                            <input type="text" className="w-full px-3 py-2 border rounded-md" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input type="email" className="w-full px-3 py-2 border rounded-md" placeholder="your@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Subject</label>
                            <select className="w-full px-3 py-2 border rounded-md" title="Select inquiry type">
                                <option>General Inquiry</option>
                                <option>Technical Support</option>
                                <option>Partnership Opportunities</option>
                                <option>Account Issues</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Message</label>
                            <textarea className="w-full px-3 py-2 border rounded-md" rows={4} placeholder="How can we help you?"></textarea>
                        </div>
                        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Send Message
                        </button>
                    </form>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Email Support</h3>
                            <p className="text-muted-foreground">support@freexit.com</p>
                            <p className="text-sm text-muted-foreground">Response time: 24-48 hours</p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Phone Support</h3>
                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            <p className="text-sm text-muted-foreground">Mon-Fri: 9AM-6PM EST</p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Live Chat</h3>
                            <p className="text-muted-foreground">Available 24/7 for premium members</p>
                            <button className="mt-2 px-4 py-1 text-sm bg-secondary rounded-md hover:bg-secondary/80">
                                Start Chat
                            </button>
                        </div>
                    </div>
                    
                    <div className="mt-6">
                        <h3 className="font-semibold mb-2">Business Hours</h3>
                        <p className="text-sm text-muted-foreground">
                            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                            Saturday: 10:00 AM - 4:00 PM EST<br />
                            Sunday: Closed
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
