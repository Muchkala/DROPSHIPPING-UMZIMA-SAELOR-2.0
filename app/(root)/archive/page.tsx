import React from 'react'

export default function ArchivePage() {
    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-6">Archive</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Browse our archived products, past promotions, and historical dropshipping data.
            </p>
            
            <div className="space-y-8">
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Past Bestsellers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Q4 2023 Electronics</h3>
                            <p className="text-muted-foreground">Top-selling gadgets and accessories from last quarter.</p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Summer Fashion 2023</h3>
                            <p className="text-muted-foreground">Trending apparel and accessories from summer collection.</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Promotional Campaigns</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Black Friday 2023</h3>
                            <p className="text-muted-foreground">Record-breaking sales and customer insights.</p>
                        </div>
                        <div className="bg-card p-4 rounded-lg border">
                            <h3 className="font-semibold mb-2">Holiday Season 2023</h3>
                            <p className="text-muted-foreground">Gift guides and seasonal product performance.</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Market Reports</h2>
                    <div className="bg-card p-6 rounded-lg border">
                        <h3 className="font-semibold mb-2">2023 Dropshipping Trends</h3>
                        <p className="text-muted-foreground mb-4">
                            Comprehensive analysis of market trends, consumer behavior, and emerging opportunities in the dropshipping industry.
                        </p>
                        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                            Download Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
