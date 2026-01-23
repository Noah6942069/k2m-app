"use client"

import { useState } from "react"
import {
    Search,
    Check,
    AlertCircle,
    ArrowUpRight,
    Settings2,
    Database,
    Cloud,
    CreditCard,
    ShoppingCart,
    Mail,
    MessageSquare,
    BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Integration {
    id: string
    name: string
    description: string
    category: "finance" | "ecommerce" | "marketing" | "productivity" | "data"
    icon: React.ElementType
    status: "connected" | "disconnected" | "error"
    popular?: boolean
}

const integrations: Integration[] = [
    {
        id: "stripe",
        name: "Stripe",
        description: "Import transactions, invoices, and customer payment data.",
        category: "finance",
        icon: CreditCard,
        status: "connected",
        popular: true
    },
    {
        id: "shopify",
        name: "Shopify",
        description: "Sync products, orders, and customer data from your store.",
        category: "ecommerce",
        icon: ShoppingCart,
        status: "disconnected",
        popular: true
    },
    {
        id: "google-ads",
        name: "Google Ads",
        description: "Track campaign performance, clicks, and conversion costs.",
        category: "marketing",
        icon: BarChart3,
        status: "disconnected"
    },
    {
        id: "slack",
        name: "Slack",
        description: "Receive AI alerts and daily summary reports in your channels.",
        category: "productivity",
        icon: MessageSquare,
        status: "connected"
    },
    {
        id: "postgres",
        name: "PostgreSQL",
        description: "Connect directly to your production database for real-time analytics.",
        category: "data",
        icon: Database,
        status: "error"
    },
    {
        id: "mailchimp",
        name: "Mailchimp",
        description: "Analyze campaign open rates and subscriber growth trends.",
        category: "marketing",
        icon: Mail,
        status: "disconnected"
    },
    {
        id: "quickbooks",
        name: "QuickBooks",
        description: "Sync accounting data for automated P&L generation.",
        category: "finance",
        icon: CreditCard,
        status: "disconnected",
        popular: true
    },
    {
        id: "salesforce",
        name: "Salesforce",
        description: "Import CRM opportunities and pipeline data.",
        category: "data",
        icon: Cloud,
        status: "disconnected"
    }
]

export default function IntegrationsPage() {
    const [searchQuery, setSearchQuery] = useState("")
    const [filter, setFilter] = useState("all")
    const [integrationList, setIntegrationList] = useState(integrations)

    const [connecting, setConnecting] = useState<string | null>(null)

    const toggleConnect = async (id: string) => {
        const integration = integrationList.find(i => i.id === id)
        if (integration?.status === "disconnected") {
            setConnecting(id)
            await new Promise(resolve => setTimeout(resolve, 1500))
            setConnecting(null)
        }

        setIntegrationList(prev => prev.map(inv => {
            if (inv.id === id) {
                return {
                    ...inv,
                    status: inv.status === "connected" ? "disconnected" : "connected"
                }
            }
            return inv
        }))
    }

    const filteredIntegrations = integrationList.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesFilter = filter === "all" || item.category === filter
        return matchesSearch && matchesFilter
    })

    const categories = [
        { id: "all", label: "All Apps" },
        { id: "finance", label: "Finance" },
        { id: "ecommerce", label: "E-Commerce" },
        { id: "marketing", label: "Marketing" },
        { id: "data", label: "Databases" },
        { id: "productivity", label: "Productivity" }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                    Connect your favorite tools to supercharge your data analysis.
                    We support over 50+ platforms with one-click syncing.
                </p>
            </div>

            {/* Filters & Search */}
            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between sticky top-0 z-30 bg-background/95 backdrop-blur-xl py-4 border-b border-border/40">
                <div className="flex gap-1 p-1 bg-muted/50 rounded-xl border border-border overflow-x-auto max-w-full">
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setFilter(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${filter === cat.id
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search integrations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {filteredIntegrations.map((item) => (
                    <div
                        key={item.id}
                        className="group relative flex flex-col p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                    >
                        {item.popular && (
                            <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-primary/10 text-[10px] font-semibold text-primary border border-primary/20 uppercase tracking-wide">
                                Popular
                            </div>
                        )}

                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner ${item.category === 'finance' ? 'bg-gradient-to-br from-green-400 to-emerald-600' :
                                item.category === 'ecommerce' ? 'bg-gradient-to-br from-blue-400 to-indigo-600' :
                                    item.category === 'marketing' ? 'bg-gradient-to-br from-pink-400 to-rose-600' :
                                        item.category === 'data' ? 'bg-gradient-to-br from-orange-400 to-red-600' :
                                            'bg-gradient-to-br from-slate-400 to-slate-600'
                                }`}>
                                <item.icon className="w-6 h-6" />
                            </div>

                            {item.status !== "disconnected" && (
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${item.status === "connected"
                                    ? "bg-green-500/10 text-green-500 border-green-500/20"
                                    : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}>
                                    {item.status === "connected" ? (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                            Active
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="w-3 h-3" />
                                            Error
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold text-foreground text-lg mb-1">{item.name}</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                                {item.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-border flex items-center gap-3">
                            {item.status === "connected" ? (
                                <>
                                    <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent hover:bg-muted border-border"
                                    >
                                        <Settings2 className="w-4 h-4 mr-2" />
                                        Configure
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => toggleConnect(item.id)}
                                        className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                                    >
                                        <div className="sr-only">Disconnect</div>
                                        <div className="w-2 h-2 rounded-full bg-current" />
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    onClick={() => toggleConnect(item.id)}
                                    disabled={connecting === item.id}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                                >
                                    {connecting === item.id ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            Connect App
                                            <ArrowUpRight className="w-4 h-4 ml-2 opacity-50" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
