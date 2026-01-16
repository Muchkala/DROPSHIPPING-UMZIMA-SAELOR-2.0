import React from 'react'

export default function ProductsPage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Products</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Browse our extensive catalog of dropshipping products across multiple categories.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Electronics</h2>
                    <p className="text-muted-foreground">Latest gadgets, accessories, and tech products with fast shipping.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Fashion & Apparel</h2>
                    <p className="text-muted-foreground">Trendy clothing, shoes, and accessories for all seasons.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Home & Garden</h2>
                    <p className="text-muted-foreground">Decor, furniture, and essentials for modern living.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Beauty & Health</h2>
                    <p className="text-muted-foreground">Skincare, cosmetics, and wellness products.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Sports & Outdoors</h2>
                    <p className="text-muted-foreground">Equipment and gear for active lifestyles.</p>
                </div>
                <div className="bg-card p-6 rounded-lg border">
                    <h2 className="text-xl font-semibold mb-2">Toys & Hobbies</h2>
                    <p className="text-muted-foreground">Fun and educational items for all ages.</p>
                </div>
            </div>
        </div>
    )
}
