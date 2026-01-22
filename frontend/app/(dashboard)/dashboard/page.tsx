"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    BarChart3,
    ArrowUpRight,
    Sparkles,
    Building2,
    Plus,
    ChevronRight,
    MessageSquareText
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts"

// Demo data
const revenueData = [
    { month: "Jan", revenue: 320000, profit: 89600 },
    { month: "Feb", revenue: 280000, profit: 78400 },
    { month: "Mar", revenue: 350000, profit: 98000 },
    { month: "Apr", revenue: 310000, profit: 86800 },
    { month: "May", revenue: 340000, profit: 95200 },
    { month: "Jun", revenue: 280000, profit: 78400 },
    { month: "Jul", revenue: 320000, profit: 89600 },
    { month: "Aug", revenue: 360000, profit: 100800 },
    { month: "Sep", revenue: 380000, profit: 106400 },
    { month: "Oct", revenue: 400000, profit: 112000 },
    { month: "Nov", revenue: 420000, profit: 117600 },
    { month: "Dec", revenue: 480000, profit: 134400 },
]

const categoryData = [
    { name: "Electronics", value: 35, color: "#7c5cfc" },
    { name: "Clothing", value: 25, color: "#5b8def" },
    { name: "Food", value: 20, color: "#10b981" },
    { name: "Other", value: 20, color: "#3f3f46" },
]

const topProducts = [
    { name: "Product Alpha", sales: 12500, growth: 23 },
    { name: "Product Beta", sales: 9800, growth: 15 },
    { name: "Product Gamma", sales: 7200, growth: -5 },
    { name: "Product Delta", sales: 5400, growth: 8 },
]

const aiInsights = [
    { icon: TrendingUp, text: "Revenue up 18% vs last quarter", type: "positive" },
    { icon: TrendingDown, text: "June sales were 23% below average", type: "warning" },
    { icon: Sparkles, text: "Focus on Q4 - historically strongest", type: "info" },
]

export default function DashboardPage() {
    const { user, isAdmin, isClient } = useAuth()
    const [datasets, setDatasets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDatasets()
    }, [])

    const fetchDatasets = async () => {
        try {
            const res = await fetch("http://localhost:8000/datasets/")
            if (res.ok) {
                const data = await res.json()
                setDatasets(data)
            }
        } catch (error) {
            console.error("Failed to fetch datasets")
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value: number) => {
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`
        return `$${value}`
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#7c5cfc]/10 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-6 h-6 text-[#7c5cfc]" />
                    </div>
                    <p className="text-zinc-500 font-medium">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {isClient ? `Welcome, ${user?.companyName || user?.name}` : "Dashboard"}
                    </h1>
                    <p className="text-muted-foreground">
                        {isClient
                            ? "Your company analytics overview"
                            : "Welcome back to K2M Analytics"
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isAdmin && (
                        <select className="px-4 py-2 rounded-xl bg-muted border border-border text-foreground text-sm">
                            <option>All Clients</option>
                            <option>Altech</option>
                            <option>Synot</option>
                            <option>Guarana Plus</option>
                            <option>RayService</option>
                        </select>
                    )}
                    {isAdmin ? (
                        <Link href="/clients">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Plus className="w-4 h-4 mr-2" />
                                New Client
                            </Button>
                        </Link>
                    ) : (
                        <Link href="/insights">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <MessageSquareText className="w-4 h-4 mr-2" />
                                Ask AI
                            </Button>
                        </Link>
                    )}
                </div>
            </div>

            {/* AI Insights Bar */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7c5cfc]/10 to-[#5b8def]/10 border border-[#7c5cfc]/20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#7c5cfc]/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-[#7c5cfc]" />
                            </div>
                            <span className="text-sm font-medium text-white">AI Insights</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm">
                            {aiInsights.map((insight, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-zinc-400">
                                    <insight.icon className={`w-4 h-4 ${insight.type === "positive" ? "text-emerald-400" :
                                        insight.type === "warning" ? "text-yellow-400" : "text-[#7c5cfc]"
                                        }`} />
                                    <span>{insight.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Link href="/insights">
                        <Button variant="ghost" size="sm" className="text-[#7c5cfc] hover:text-white">
                            View All <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: "$4.2M", change: 18, icon: DollarSign, color: "#7c5cfc" },
                    { label: "Total Profit", value: "$1.2M", change: 15, icon: TrendingUp, color: "#10b981" },
                    { label: "Orders", value: "12,543", change: 8, icon: ShoppingCart, color: "#5b8def" },
                    { label: isAdmin ? "Active Clients" : "Products", value: isAdmin ? "24" : "156", change: 12, icon: isAdmin ? Users : BarChart3, color: "#f59e0b" },
                ].map((kpi, idx) => (
                    <div key={idx} className="metric-card p-5">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${kpi.color}15` }}>
                                <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${kpi.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                {kpi.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {kpi.change >= 0 ? "+" : ""}{kpi.change}%
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                        <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">Revenue Overview</h3>
                            <p className="text-xs text-muted-foreground">Monthly revenue and profit trends</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-muted-foreground">Revenue</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500" />
                                <span className="text-muted-foreground">Profit</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={revenueData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#5b8def" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#5b8def" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                                <XAxis dataKey="month" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis
                                    stroke="#52525b"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `$${value / 1000}K`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#13131a',
                                        borderColor: '#27272a',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                    formatter={(value: number) => [formatCurrency(value), ""]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#7c5cfc"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="profit"
                                    stroke="#5b8def"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorProfit)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-1">Sales by Category</h3>
                    <p className="text-xs text-muted-foreground mb-6">Distribution across product categories</p>
                    <div className="h-[180px] mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={50}
                                    outerRadius={70}
                                    paddingAngle={4}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2">
                        {categoryData.map((cat, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                                    <span className="text-muted-foreground">{cat.name}</span>
                                </div>
                                <span className="text-foreground font-medium">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">Top Products</h3>
                            <p className="text-xs text-muted-foreground">Best performing items</p>
                        </div>
                        <Link href="/datasets">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                                        #{idx + 1}
                                    </div>
                                    <span className="text-foreground font-medium">{product.name}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">{product.sales.toLocaleString()} units</span>
                                    <span className={`text-xs font-medium ${product.growth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                        {product.growth >= 0 ? "+" : ""}{product.growth}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 rounded-2xl bg-card border border-border">
                    <h3 className="font-semibold text-foreground mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {(isAdmin ? [
                            { label: "Upload Data", href: "/datasets", icon: Plus },
                            { label: "New Client", href: "/clients", icon: Building2 },
                            { label: "AI Insights", href: "/insights", icon: Sparkles },
                            { label: "Analysis", href: "/analysis", icon: BarChart3 },
                        ] : [
                            { label: "View Data", href: "/datasets", icon: BarChart3 },
                            { label: "AI Insights", href: "/insights", icon: Sparkles },
                            { label: "Ask AI", href: "/insights", icon: MessageSquareText },
                            { label: "Settings", href: "/settings", icon: Users },
                        ]).map((action, idx) => (
                            <Link key={idx} href={action.href}>
                                <div className="p-4 rounded-xl bg-muted border border-border hover:border-primary/30 transition-colors group cursor-pointer">
                                    <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                    <p className="text-sm font-medium text-foreground">{action.label}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
