export default function HomePage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-4">Welcome to FREEXIT</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Your premier dropshipping platform for seamless e-commerce success.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Product Sourcing</h2>
                    <p className="text-muted-foreground">Access thousands of verified suppliers and products.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Automated Fulfillment</h2>
                    <p className="text-muted-foreground">Streamline your order processing with our automation tools.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
                    <p className="text-muted-foreground">Track sales, inventory, and performance in real-time.</p>
                </div>
            </div>
        </div>
    )
}
