"use client"

import { useEffect, useState, useMemo } from "react"
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
    Wallet,
    ArrowRight
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
import { DraggableGrid, EditModeButton, useDashboardLayout } from "@/components/dashboard/DraggableGrid"

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

export default function OverviewPage() {
    const { user, isAdmin, isClient } = useAuth()
    const [datasets, setDatasets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)

    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [advancedStats, setAdvancedStats] = useState<AdvancedStats | null>(null)
    const [recentDataset, setRecentDataset] = useState<any>(null)
    const [preferences, setPreferences] = useState<Record<string, boolean>>({})

    // Smart Filter System
    const [suggestedFilters, setSuggestedFilters] = useState<any[]>([])
    const [activeFilters, setActiveFilters] = useState<Record<string, string>>({})
    const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null)

    // Layout persistence
    const { layout, saveLayout, loading: layoutLoading } = useDashboardLayout(user?.email || undefined)

    // --- HELPER FUNCTIONS ---

    const formatNumber = (num: number | undefined | null) => {
        if (num === undefined || num === null) return "0"
        if (num >= 1000000) return (num / 1000000).toFixed(1) + "M"
        if (num >= 1000) return (num / 1000).toFixed(1) + "K"
        return num.toString()
    }

    const isWidgetEnabled = (id: string) => preferences[id] !== false

    const fetchStats = async (id: number) => {
        // Fetch basic stats
        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${id}/stats`)
        if (statsRes.ok) setStats(await statsRes.json())

        // Fetch ADVANCED stats
        try {
            const advRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${id}/advanced-stats`)
            if (advRes.ok) setAdvancedStats(await advRes.json())
        } catch (e) { console.error(e) }

        // Fetch filters
        const filtersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${id}/filters`)
        if (filtersRes.ok) {
            const filtersData = await filtersRes.json()
            setSuggestedFilters(filtersData.filters || [])
        }
    }

    const handleDatasetChange = async (datasetId: number) => {
        setSelectedDatasetId(datasetId)
        setActiveFilters({})
        setLoading(true)
        try {
            const ds = datasets.find(d => d.id === datasetId)
            setRecentDataset(ds)
            await fetchStats(datasetId)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleFilterChange = async (column: string, value: string) => {
        const newFilters = { ...activeFilters, [column]: value }
        if (value === "All") delete newFilters[column]
        setActiveFilters(newFilters)

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

    const savePreferences = async (newPrefs: Record<string, boolean>) => {
        setPreferences(newPrefs)
        if (user?.email) {
            try {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/preferences/dashboard/${user.email}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ widget_config: newPrefs })
                })
            } catch (e) { console.error(e) }
        }
    }

    // --- DATA LOADING ---

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

                    if (data.length > 0) {
                        const latest = data[data.length - 1]
                        setRecentDataset(latest)
                        setSelectedDatasetId(latest.id)
                        await fetchStats(latest.id)
                    }
                    // Always stop loading after data check
                    setLoading(false)
                } else {
                    setLoading(false)
                }
            } catch (error) {
                console.error("Failed to fetch data", error)
                setLoading(false)
            }
        }
        loadData()
    }, [user])

    // --- WIDGETS DEFINITION ---

    // Define Dashboard Widgets
    const widgets = useMemo(() => [
        {
            id: "kpi_revenue",
            title: "Total Revenue",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title={stats?.smart_analysis?.total_sales ? "Total Revenue" : "Total Rows"}
                    value={stats?.smart_analysis?.total_sales ? `$${formatNumber(stats.smart_analysis.total_sales)}` : formatNumber(stats?.total_rows)}
                    icon={DollarSign}
                    trend={12.5}
                    color="#8b5cf6"
                    variant="gradient"
                    sparklineData={stats?.smart_analysis?.sales_over_time?.slice(-10).map((p: any) => p.value) || [4, 6, 5, 8, 7, 9, 8, 10, 9, 12]}
                />
            )
        },
        {
            id: "kpi_growth",
            title: "Growth Rate",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Growth Rate"
                    value={advancedStats?.growth_rate ? `${advancedStats.growth_rate}%` : "+8.2%"}
                    icon={Activity}
                    color="#10b981"
                    trend={advancedStats?.growth_rate || 8.2}
                    variant="default"
                    sparklineData={[3, 4, 6, 5, 7, 8, 7, 9, 8, 10]}
                />
            )
        },
        {
            id: "kpi_health",
            title: "Data Health",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Data Health"
                    value={advancedStats?.data_health_score ? `${advancedStats.data_health_score}%` : "98%"}
                    icon={ShieldCheck}
                    color="#3b82f6"
                    subtitle={advancedStats?.data_quality_issues?.[0] || "No issues detected"}
                    variant="default"
                />
            )
        },
        {
            id: "kpi_transactions",
            title: "Transactions",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Transactions"
                    value={formatNumber(advancedStats?.transaction_count || stats?.total_rows)}
                    icon={ShoppingCart}
                    color="#f59e0b"
                    trend={5.3}
                    variant="default"
                    sparklineData={[8, 7, 9, 10, 8, 11, 10, 12, 11, 13]}
                />
            )
        },
        {
            id: "kpi_categories",
            title: "Unique Categories",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Unique Categories"
                    value={advancedStats?.unique_categories || 0}
                    icon={Layers}
                    color="#ec4899"
                    subtitle="Distinct product types"
                />
            )
        },
        {
            id: "kpi_best_month",
            title: "Best Month",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Best Month"
                    value={stats?.smart_analysis?.best_month || "-"}
                    icon={Calendar}
                    color="#8b5cf6"
                    subtitle="Highest activity period"
                />
            )
        },
        {
            id: "kpi_avg_order",
            title: "Avg. Order Value",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Avg. Order Value"
                    value={stats?.smart_analysis?.average_sales ? `$${formatNumber(stats.smart_analysis.average_sales)}` : "-"}
                    icon={Wallet}
                    color="#06b6d4"
                    subtitle="Average per transaction"
                />
            )
        },
        {
            id: "kpi_date_range",
            title: "Data Range",
            defaultSize: "small" as const,
            component: (
                <KPICard
                    title="Data Range"
                    value={advancedStats?.date_span_days ? `${advancedStats.date_span_days} days` : (stats?.total_columns || 0) + " cols"}
                    icon={Clock}
                    color="#f97316"
                    subtitle={advancedStats?.date_range_start ? `${advancedStats.date_range_start} to ${advancedStats.date_range_end}` : "Dataset span"}
                />
            )
        },
        {
            id: "chart_trend",
            title: "Sales Trend",
            defaultSize: "medium" as const,
            component: (
                <div className="h-full premium-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg tracking-tight">
                                {stats?.smart_analysis?.identified_value_col || 'Revenue'} Trend
                            </h3>
                            <p className="text-sm text-muted-foreground/80 font-medium">Performance over time</p>
                        </div>
                    </div>
                    <div className="w-full h-[250px] min-h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.smart_analysis?.sales_over_time?.length ? stats.smart_analysis.sales_over_time : demoRevenueData}>
                                <defs>
                                    <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradientStroke" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.3} />
                                <XAxis
                                    dataKey="month"
                                    stroke="var(--muted-foreground)"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                    tick={{ fill: 'var(--muted-foreground)', opacity: 0.7 }}
                                />
                                <YAxis
                                    stroke="var(--muted-foreground)"
                                    fontSize={11}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => value >= 1000 ? `$${(value / 1000).toFixed(0)}k` : `$${value}`}
                                    dx={-10}
                                    tick={{ fill: 'var(--muted-foreground)', opacity: 0.7 }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="px-4 py-3 rounded-xl glass border border-white/10 shadow-2xl backdrop-blur-xl">
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].payload.month}</p>
                                                    <p className="text-lg font-bold text-foreground font-display">
                                                        ${Number(payload[0].value).toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey={stats?.smart_analysis?.sales_over_time?.length ? "value" : "revenue"}
                                    stroke="url(#gradientStroke)"
                                    strokeWidth={3}
                                    fill="url(#gradientRevenue)"
                                    activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )
        },
        {
            id: "chart_dist",
            title: "Distribution",
            defaultSize: "medium" as const,
            component: (
                <div className="h-full premium-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg tracking-tight">Distribution</h3>
                            <p className="text-sm text-muted-foreground/80 font-medium">By Category</p>
                        </div>
                    </div>
                    <div className="w-full h-[250px] min-h-[200px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <defs>
                                    {[
                                        ['#8b5cf6', '#6366f1'],
                                        ['#10b981', '#34d399'],
                                        ['#f59e0b', '#fbbf24'],
                                        ['#ec4899', '#f472b6'],
                                        ['#06b6d4', '#22d3ee']
                                    ].map((colors, i) => (
                                        <linearGradient key={i} id={`gradientPie${i}`} x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor={colors[0]} />
                                            <stop offset="100%" stopColor={colors[1]} />
                                        </linearGradient>
                                    ))}
                                </defs>
                                <Pie
                                    data={stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories : demoCategoryData}
                                    cx="50%" cy="50%"
                                    innerRadius={70}
                                    outerRadius={90}
                                    paddingAngle={6}
                                    cornerRadius={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(stats?.smart_analysis?.top_categories || demoCategoryData).map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={`url(#gradientPie${index % 5})`} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="px-3 py-2 rounded-lg glass border border-white/10 shadow-xl backdrop-blur-xl">
                                                    <p className="text-sm font-semibold text-foreground">{payload[0].name}</p>
                                                    <p className="text-xs text-muted-foreground">{Number(payload[0].value).toLocaleString()}</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-3xl font-bold text-foreground font-display tracking-tight">
                                {advancedStats?.unique_categories || stats?.smart_analysis?.top_categories?.length || 4}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-70">Types</span>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: "chart_ranking",
            title: "Top Rankings",
            defaultSize: "large" as const,
            component: (
                <div className="h-full premium-card p-6 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground text-lg tracking-tight">Top Rankings</h3>
                            <p className="text-sm text-muted-foreground/80 font-medium">Highest performing items</p>
                        </div>
                    </div>
                    <div className="w-full h-[300px] min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                layout="vertical"
                                data={stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories.slice(0, 5) : demoCategoryData}
                                margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                                barSize={24}
                            >
                                <defs>
                                    <linearGradient id="gradientBar" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#ec4899" />
                                        <stop offset="100%" stopColor="#8b5cf6" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" opacity={0.3} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="var(--foreground)"
                                    fontSize={12}
                                    width={100}
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: 'var(--foreground)', fontSize: 13, fontWeight: 500 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'var(--primary)', opacity: 0.1, radius: 8 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="px-3 py-2 rounded-lg glass border border-white/10 shadow-xl backdrop-blur-xl">
                                                    <p className="text-sm font-semibold text-foreground">{payload[0].payload.name}</p>
                                                    <p className="text-lg font-bold text-primary font-display">
                                                        ${Number(payload[0].value).toLocaleString()}
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill="url(#gradientBar)"
                                    radius={[0, 12, 12, 0]}
                                    background={{ fill: 'var(--muted)', radius: [0, 12, 12, 0] as any, opacity: 0.3 }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )
        },
        {
            id: "list_products",
            title: "Top Products",
            defaultSize: "large" as const,
            component: (
                <div className="h-full bg-card p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-foreground">Top Products</h3>
                        <Link href="/datasets">
                            <Button variant="ghost" size="sm" className="h-8 text-xs">View All</Button>
                        </Link>
                    </div>
                    <div className="space-y-2 overflow-y-auto max-h-[220px] pr-2">
                        {(stats?.smart_analysis?.top_categories?.length ? stats.smart_analysis.top_categories : demoTopProducts).slice(0, 5).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        #{idx + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-foreground text-sm truncate max-w-[120px]">{item.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-foreground text-sm">${(item.value || item.sales).toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "quick_actions",
            title: "Quick Actions",
            defaultSize: "small" as const,
            component: (
                <div className="h-full premium-card p-5 flex flex-col justify-center gap-3">
                    <h3 className="font-semibold text-foreground mb-1">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {(isAdmin ? [
                            { label: "Upload", href: "/datasets", icon: Plus },
                            { label: "New Client", href: "/clients", icon: Building2 },
                            { label: "Insights", href: "/insights", icon: Sparkles },
                            { label: "Analysis", href: "/analysis", icon: BarChart3 },
                        ] : [
                            { label: "View Data", href: "/datasets", icon: BarChart3 },
                            { label: "Insights", href: "/insights", icon: Sparkles },
                            { label: "Ask AI", href: "/insights", icon: MessageSquareText },
                            { label: "Settings", href: "/settings", icon: Settings },
                        ]).map((action, idx) => (
                            <Link key={idx} href={action.href}>
                                <div className="h-auto py-2 px-3 rounded-xl border border-border bg-muted/30 hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-center gap-1 group">
                                    <action.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="text-[10px] font-medium text-muted-foreground group-hover:text-foreground">{action.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )
        },
        {
            id: "widget_ai_insights",
            title: "AI Analysis",
            defaultSize: "medium" as const,
            component: (
                <div className="h-full premium-card p-5 relative overflow-hidden group">
                    {/* Gradient Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 opacity-50" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <h3 className="font-semibold text-foreground">AI Highlights</h3>
                            </div>
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                {stats?.smart_analysis?.insights?.length || 2} new
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
                            {(stats?.smart_analysis?.insights || [
                                "Revenue is trending upwards by 12.5% compared to last period.",
                                "Laptop Pro X accounts for 32% of total category volume.",
                                "Customer retention seems stable."
                            ]).slice(0, 3).map((insight: any, i: number) => (
                                <div key={i} className="flex gap-3 text-sm group/item">
                                    <div className={`min-w-[4px] h-[4px] mt-2 rounded-full transition-colors ${insight.type === 'warning' ? 'bg-orange-500/50 group-hover/item:bg-orange-500' :
                                        insight.type === 'positive' ? 'bg-green-500/50 group-hover/item:bg-green-500' :
                                            'bg-primary/50 group-hover/item:bg-primary'
                                        }`} />
                                    <p className="text-muted-foreground group-hover/item:text-foreground transition-colors leading-relaxed">
                                        {typeof insight === 'string' ? insight : insight.text}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border/50">
                            <Link href="/insights" className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                                View full analysis <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                </div>
            )
        }

    ], [stats, advancedStats, isAdmin])

    if (loading || layoutLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
                        <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <p className="text-muted-foreground font-medium">Loading Dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
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
                    <EditModeButton editMode={editMode} onToggle={() => setEditMode(!editMode)} />

                    {isAdmin && (
                        <Link href="/clients">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                                <Plus className="w-4 h-4 mr-2" />
                                New Client
                            </Button>
                        </Link>
                    )}
                    {!isAdmin && (
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


            {/* Draggable Dashboard Grid */}
            <DraggableGrid
                widgets={widgets}
                editMode={editMode}
                savedLayout={layout}
                onLayoutChange={saveLayout}
            />
        </div>
    )
}
