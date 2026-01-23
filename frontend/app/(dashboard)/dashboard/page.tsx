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
    MessageSquareText,
    Database,
    Activity,
    ShieldCheck,
    Layers,
    Calendar,
    Settings,
    Target,
    Clock,
    Wallet
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Bar,
    BarChart,
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// New Imports
import { AdvancedStats, DashboardStats } from "@/types/dashboard"
import { WidgetSelector } from "@/components/dashboard/WidgetSelector"
import { KPICard } from "@/components/dashboard/KPICard"

// Demo data fallback
const demoRevenueData = [
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

const demoCategoryData = [
    { name: "Electronics", value: 35, color: "#7c5cfc" },
    { name: "Clothing", value: 25, color: "#5b8def" },
    { name: "Food", value: 20, color: "#10b981" },
    { name: "Other", value: 20, color: "#3f3f46" },
]

const demoTopProducts = [
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

    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [advancedStats, setAdvancedStats] = useState<AdvancedStats | null>(null)
    const [recentDataset, setRecentDataset] = useState<any>(null)
    const [preferences, setPreferences] = useState<Record<string, boolean>>({})

    // Smart Filter System
    const [suggestedFilters, setSuggestedFilters] = useState<any[]>([])
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
    const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null)

    // Load initial data
    useEffect(() => {
        const loadData = async () => {
            try {
                // 1. Load User Preferences
                if (user?.email) {
                    try {
                        const prefRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/preferences/dashboard/${user.email}`)
                        if (prefRes.ok) {
                            const prefData = await prefRes.json()
                            setPreferences(prefData.widget_config)
                        }
                    } catch (e) {
                        console.error("Failed to load preferences", e)
                    }
                }

                // 2. Fetch all datasets
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const data = await dsRes.json()
                    setDatasets(data)

                    // 3. If we have datasets, fetch analytics for the most recent one
                    if (data.length > 0) {
                        const latest = data[data.length - 1]
                        setRecentDataset(latest)
                        setSelectedDatasetId(latest.id)

                        // Fetch basic stats
                        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/stats`)
                        if (statsRes.ok) {
                            const statsData = await statsRes.json()
                            setStats(statsData)
                        }

                        // Fetch ADVANCED stats
                        try {
                            const advRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/advanced-stats`)
                            if (advRes.ok) {
                                const advData = await advRes.json()
                                setAdvancedStats(advData)
                            }
                        } catch (e) {
                            console.error("Failed to load advanced stats", e)
                        }

                        // Fetch suggested filters
                        const filtersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/filters`)
                        if (filtersRes.ok) {
                            const filtersData = await filtersRes.json()
                            setSuggestedFilters(filtersData.filters || [])
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [user])

    const savePreferences = async (newPrefs: Record<string, boolean>) => {
        setPreferences(newPrefs)
        if (user?.email) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/preferences/dashboard/${user.email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ widget_config: newPrefs })
                })
            } catch (e) {
                console.error("Failed to save preferences", e)
            }
        }
    }

    // Helper to check if widget is enabled (default true if undefined)
    const isWidgetEnabled = (id: string) => preferences[id] !== false

    const handleDatasetChange = async (datasetId: number) => {
        setSelectedDatasetId(datasetId)
        setActiveFilters({})
        setLoading(true)

        try {
            const ds = datasets.find(d => d.id === datasetId)
            setRecentDataset(ds)

            const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/stats`)
            if (statsRes.ok) {
                setStats(await statsRes.json())
            }

            const advRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/advanced-stats`)
            if (advRes.ok) {
                setAdvancedStats(await advRes.json())
            }

            const filtersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/filters`)
            if (filtersRes.ok) {
                const filtersData = await filtersRes.json()
                setSuggestedFilters(filtersData.filters || [])
            }
        } catch (error) {
            console.error("Failed to load dataset", error)
        } finally {
            setLoading(false)
        }
    }

    // Handle filter change
    const handleFilterChange = async (column: string, value: string) => {
        const newFilters = { ...activeFilters, [column]: value }
        if (value === "All") {
            delete newFilters[column]
        }
        setActiveFilters(newFilters)

        // Fetch filtered stats
        if (selectedDatasetId) {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${selectedDatasetId}/stats/filtered`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filters: newFilters })
                })
                if (res.ok) {
                    const filteredData = await res.json()
                    setStats((prev: any) => ({
                        ...prev,
                        total_rows: filteredData.total_rows,
                        smart_analysis: filteredData.smart_analysis
                    }))
                }
            } catch (error) {
                console.error("Failed to fetch filtered stats", error)
            }
        }
    }

    const formatNumber = (num: number | undefined | null) => {
        if (num === undefined || num === null) return "0"
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
        if (num >= 1000) return (num / 1000).toFixed(1) + "K"
        return num.toString()
    }

    // Fallback logic for growth if api provides null
    const getGrowthRate = () => {
        if (advancedStats?.growth_rate) return advancedStats.growth_rate;
        // Mock fallback if nothing
        return 18.2;
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
                            ? (stats?.smart_analysis?.summary || "Your company analytics overview")
                            : "Welcome back to K2M Analytics"
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <WidgetSelector preferences={preferences} onSave={savePreferences} />

                    {isAdmin && (
                        <Select defaultValue="All Clients">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select Client" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="All Clients">All Clients</SelectItem>
                                <SelectItem value="Altech">Altech</SelectItem>
                                <SelectItem value="Synot">Synot</SelectItem>
                                <SelectItem value="Guarana Plus">Guarana Plus</SelectItem>
                                <SelectItem value="RayService">RayService</SelectItem>
                            </SelectContent>
                        </Select>
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

            {/* Smart Filters Bar */}
            {(datasets.length > 0 || suggestedFilters.length > 0) && (
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-card border border-border">
                    {datasets.length > 1 && (
                        <div className="flex items-center gap-2">
                            <Database className="w-4 h-4 text-muted-foreground" />
                            <Select
                                value={selectedDatasetId ? String(selectedDatasetId) : ""}
                                onValueChange={(value) => handleDatasetChange(Number(value))}
                            >
                                <SelectTrigger className="h-8 w-[200px] border-none bg-muted text-xs font-medium">
                                    <SelectValue placeholder="Select Dataset" />
                                </SelectTrigger>
                                <SelectContent>
                                    {datasets.map((ds) => (
                                        <SelectItem key={ds.id} value={String(ds.id)}>
                                            {ds.filename}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {/* Dynamic Filters */}
                    {suggestedFilters.length > 0 && (
                        <>
                            <div className="w-px h-6 bg-border mx-2" />
                            {suggestedFilters.map((filter) => (
                                <div key={filter.column} className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground font-medium">{filter.column}:</span>
                                    <Select
                                        value={activeFilters[filter.column] || "All"}
                                        onValueChange={(value) => handleFilterChange(filter.column, value)}
                                    >
                                        <SelectTrigger className="h-8 min-w-[120px] bg-muted border-none text-xs">
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="All">All</SelectItem>
                                            {filter.values.map((val: string) => (
                                                <SelectItem key={val} value={String(val)}>
                                                    {String(val)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Active Filter Count */}
                    {Object.keys(activeFilters).length > 0 && (
                        <div className="ml-auto flex items-center gap-2">
                            <span className="text-xs text-primary font-medium">
                                {Object.keys(activeFilters).length} filter{Object.keys(activeFilters).length > 1 ? "s" : ""} active
                            </span>
                            <button
                                onClick={() => {
                                    setActiveFilters({})
                                    if (selectedDatasetId) handleDatasetChange(selectedDatasetId)
                                }}
                                className="text-xs text-muted-foreground hover:text-foreground underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* AI Insights Bar */}
            {isWidgetEnabled("insights_bar") && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#7c5cfc]/10 to-[#5b8def]/10 border border-[#7c5cfc]/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-lg bg-[#7c5cfc]/20 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-[#7c5cfc]" />
                                </div>
                                <span className="text-sm font-medium text-foreground">AI Insights</span>
                            </div>
                            <div className="hidden md:flex items-center gap-6 text-sm">
                                {stats?.smart_analysis?.insights && stats.smart_analysis.insights.length > 0 ? (
                                    stats.smart_analysis.insights.slice(0, 3).map((insight: any, idx: number) => {
                                        let Icon = insight.icon;
                                        if (!Icon) {
                                            if (insight.type === "positive") Icon = TrendingUp;
                                            else if (insight.type === "warning") Icon = TrendingDown;
                                            else Icon = Sparkles;
                                        }

                                        return (
                                            <div key={idx} className="flex items-center gap-2 text-zinc-400">
                                                <Icon className={`w-4 h-4 ${insight.type === "positive" ? "text-emerald-400" :
                                                    insight.type === "warning" ? "text-yellow-400" : "text-[#7c5cfc]"
                                                    }`} />
                                                <span className="truncate max-w-[200px] xl:max-w-none" title={insight.text}>{insight.text}</span>
                                            </div>
                                        )
                                    })
                                ) : (
                                    <span className="text-zinc-500">Upload data to generate AI insights...</span>
                                )}
                            </div>
                        </div>
                        <Link href="/insights">
                            <Button variant="ghost" size="sm" className="text-[#7c5cfc] hover:text-white">
                                View All <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            )}

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {isWidgetEnabled("kpi_revenue") && (
                    <KPICard
                        title={stats?.smart_analysis?.total_sales ? "Total Revenue" : "Total Rows"}
                        value={stats?.smart_analysis?.total_sales ? `$${formatNumber(stats.smart_analysis.total_sales)}` : formatNumber(stats?.total_rows)}
                        icon={DollarSign}
                        trend={12.5}
                        trendLabel="vs last month"
                        subtitle="Gross revenue for period"
                    />
                )}

                {isWidgetEnabled("kpi_growth") && (
                    <KPICard
                        title="Growth Rate"
                        value={advancedStats?.growth_rate ? `${advancedStats.growth_rate}%` : "-"}
                        icon={Activity}
                        color="#10b981"
                        trend={advancedStats?.growth_rate}
                        subtitle="Period over period growth"
                    />
                )}

                {isWidgetEnabled("kpi_health") && (
                    <KPICard
                        title="Data Health"
                        value={advancedStats?.data_health_score ? `${advancedStats.data_health_score}%` : "100%"}
                        icon={ShieldCheck}
                        color="#3b82f6"
                        subtitle={advancedStats?.data_quality_issues?.[0] || "No issues detected"}
                    />
                )}

                {isWidgetEnabled("kpi_transactions") && (
                    <KPICard
                        title="Transactions"
                        value={formatNumber(advancedStats?.transaction_count || stats?.total_rows)}
                        icon={ShoppingCart}
                        color="#f59e0b"
                        subtitle="Total recorded rows"
                    />
                )}

                {isWidgetEnabled("kpi_categories") && (
                    <KPICard
                        title="Unique Categories"
                        value={advancedStats?.unique_categories || 0}
                        icon={Layers}
                        color="#ec4899"
                        subtitle="Distinct product types"
                    />
                )}

                {isWidgetEnabled("kpi_best_month") && (
                    <KPICard
                        title="Best Month"
                        value={stats?.smart_analysis?.best_month || "-"}
                        icon={Calendar}
                        color="#8b5cf6"
                        subtitle="Highest activity period"
                    />
                )}

                {/* NEW: Average Value Card */}
                <KPICard
                    title="Avg. Order Value"
                    value={stats?.smart_analysis?.average_sales ? `$${formatNumber(stats.smart_analysis.average_sales)}` : "-"}
                    icon={Wallet}
                    color="#06b6d4"
                    subtitle="Average per transaction"
                />

                {/* NEW: Date Range Card */}
                <KPICard
                    title="Data Range"
                    value={advancedStats?.date_span_days ? `${advancedStats.date_span_days} days` : (stats?.total_columns || 0) + " cols"}
                    icon={Clock}
                    color="#f97316"
                    subtitle={advancedStats?.date_range_start ? `${advancedStats.date_range_start} to ${advancedStats.date_range_end}` : "Dataset span"}
                />
            </div>

            {/* Charts Section - 2x2 Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isWidgetEnabled("chart_sales_trend") && (
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-foreground">
                                    {stats?.smart_analysis?.identified_value_col || 'Sales'} Trend
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Performance over time
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">12 months</span>
                            </div>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats?.smart_analysis?.sales_over_time?.length ? stats.smart_analysis.sales_over_time : demoRevenueData}>
                                    <defs>
                                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                                    <XAxis
                                        dataKey={stats?.smart_analysis?.sales_over_time?.length ? "date" : "month"}
                                        stroke="#888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1e1e24", borderColor: "#555", borderRadius: "8px" }}
                                        itemStyle={{ color: "#fff" }}
                                        formatter={(value: any) => `$${Math.round(value).toLocaleString()}`}
                                        labelStyle={{ color: "#aaa" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey={stats?.smart_analysis?.sales_over_time?.length ? "value" : "revenue"}
                                        stroke="#7c5cfc"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorValue)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {isWidgetEnabled("chart_category_distribution") && (
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Category Distribution</h3>
                            <span className="text-xs text-muted-foreground">Top categories</span>
                        </div>
                        <div className="h-[280px] w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories : demoCategoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(stats?.smart_analysis?.top_categories || demoCategoryData).map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={['#7c5cfc', '#5b8def', '#10b981', '#f59e0b', '#ec4899'][index % 5]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value: any) => Math.round(value).toLocaleString()}
                                        contentStyle={{ backgroundColor: "#1e1e24", borderColor: "#555", borderRadius: "8px" }}
                                        itemStyle={{ color: "#fff" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-foreground">
                                    {advancedStats?.unique_categories || stats?.smart_analysis?.top_categories?.length || 4}
                                </span>
                                <span className="text-xs text-muted-foreground">Categories</span>
                            </div>
                        </div>
                    </div>
                )}

                {isWidgetEnabled("chart_horizontal_ranking") && (
                    <div className="lg:col-span-2 p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-foreground">Top Rankings</h3>
                            <span className="text-xs text-muted-foreground">By revenue</span>
                        </div>
                        <div className="h-[280px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    layout="vertical"
                                    data={stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories.slice(0, 5) : demoCategoryData}
                                    margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#444" />
                                    <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        stroke="#888"
                                        fontSize={12}
                                        width={80}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: "#1e1e24", borderColor: "#555", borderRadius: "8px" }}
                                        itemStyle={{ color: "#fff" }}
                                        formatter={(value: any) => Math.round(value).toLocaleString()}
                                    />
                                    <Bar dataKey="value" fill="#ec4899" radius={[0, 4, 4, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Row - Top Products & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isWidgetEnabled("list_top_products") && (
                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="font-semibold text-foreground">Top Performing {stats?.smart_analysis?.identified_category_col || 'Products'}</h3>
                                <p className="text-xs text-muted-foreground">Ranked by value</p>
                            </div>
                            <Link href="/datasets">
                                <Button variant="ghost" size="sm">View All <ArrowUpRight className="ml-2 w-4 h-4" /></Button>
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {(stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories : demoTopProducts).slice(0, 5).map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                            #{idx + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-foreground text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">{item.category || "General"}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-foreground">${(item.value || item.sales).toLocaleString()}</p>
                                        {(item.growth !== undefined && item.growth !== null && item.growth !== 0) && (
                                            <p className={`text-xs ${item.growth > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                                {item.growth > 0 ? '+' : ''}{item.growth}%
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

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
