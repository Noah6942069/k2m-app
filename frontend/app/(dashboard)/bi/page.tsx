"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/language-context"
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    BarChart3,
    ArrowUpRight,
    ArrowDownRight,
    Sparkles,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Target,
    Loader2,
    FileText,
    PieChart,
    Activity,
    Zap,
    Calendar,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    TrendingUpIcon,
    LineChart,
    Layers,
    Shield,
    Eye,
    Brain,
    Lightbulb,
    ArrowRight,
    ChevronRight,
    RefreshCw,
    Download
} from "lucide-react"
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
    PieChart as RechartsPie,
    Pie,
    Cell,
    LineChart as RechartsLine,
    Line,
    Legend,
    ComposedChart,
    Scatter,
    ReferenceLine
} from "recharts"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function BIAnalyticsPage() {
    const { user, isAdmin } = useAuth()
    const { t } = useTranslation()
    const [datasets, setDatasets] = useState<any[]>([])
    const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(null)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    // Demo Data defined inside to potentially use translations later if needed, 
    // or just kept here for simplicity. 
    const demoTrendData = [
        { month: "Jan", revenue: 320000, profit: 89600, orders: 1200, target: 300000 },
        { month: "Feb", revenue: 280000, profit: 78400, orders: 1050, target: 310000 },
        { month: "Mar", revenue: 350000, profit: 98000, orders: 1380, target: 320000 },
        { month: "Apr", revenue: 310000, profit: 86800, orders: 1250, target: 330000 },
        { month: "May", revenue: 340000, profit: 95200, orders: 1320, target: 340000 },
        { month: "Jun", revenue: 380000, profit: 106400, orders: 1450, target: 350000 },
        { month: "Jul", revenue: 420000, profit: 117600, orders: 1580, target: 360000 },
        { month: "Aug", revenue: 395000, profit: 110600, orders: 1520, target: 370000 },
    ]

    const demoForecastData = [
        { month: "Sep", revenue: 430000, forecast: true },
        { month: "Oct", revenue: 455000, forecast: true },
        { month: "Nov", revenue: 490000, forecast: true },
        { month: "Dec", revenue: 520000, forecast: true },
    ]

    const demoCategoryData = [
        { name: "Electronics", value: 485000, percentage: 35, growth: 12 },
        { name: "Clothing", value: 346000, percentage: 25, growth: 8 },
        { name: "Food & Beverage", value: 277000, percentage: 20, growth: -3 },
        { name: "Home & Garden", value: 166000, percentage: 12, growth: 15 },
        { name: "Sports", value: 111000, percentage: 8, growth: 22 },
    ]

    const demoTopPerformers = [
        { name: "Laptop Pro X", value: 125000, growth: 23, units: 250 },
        { name: "Wireless Earbuds", value: 89000, growth: 45, units: 1780 },
        { name: "Smart Watch S3", value: 67000, growth: 12, units: 335 },
        { name: "Gaming Console", value: 54000, growth: -5, units: 108 },
        { name: "Tablet Ultra", value: 48000, growth: 8, units: 160 },
    ]

    const demoAnomalies = [
        { date: "Aug 15", metric: t.bi.totalRevenue, expected: 15000, actual: 8500, deviation: -43, severity: "high" },
        { date: "Aug 22", metric: t.bi.totalOrders, expected: 52, actual: 89, deviation: 71, severity: "medium" },
        { date: "Aug 28", metric: t.bi.avgOrderValue, expected: 245, actual: 312, deviation: 27, severity: "low" },
    ]

    const demoRegionalData = [
        { region: "North America", revenue: 580000, orders: 2100, avgOrder: 276 },
        { region: "Europe", revenue: 420000, orders: 1650, avgOrder: 255 },
        { region: "Asia Pacific", revenue: 310000, orders: 1800, avgOrder: 172 },
        { region: "Latin America", revenue: 75000, orders: 420, avgOrder: 179 },
    ]

    const demoDataQuality = {
        completeness: 94.2,
        accuracy: 98.7,
        consistency: 91.5,
        timeliness: 89.3,
        totalRecords: 15420,
        missingValues: 892,
        duplicates: 45,
        outliers: 127
    }

    const demoAIInsights = [
        { type: "positive", text: "Revenue increased by 23% compared to Q2, exceeding the quarterly target by $45,000. This growth is primarily driven by the Electronics category which saw a 31% surge.", priority: 1 },
        { type: "positive", text: "Customer retention rate improved to 78.4%, up from 71.2% last quarter. Repeat purchase frequency increased by 15%.", priority: 2 },
        { type: "warning", text: "Food & Beverage category showing declining trend (-3% MoM). Consider promotional activities or product mix optimization.", priority: 1 },
        { type: "warning", text: "Inventory turnover for Gaming Console has slowed. Current stock levels suggest 45 days of inventory vs. optimal 30 days.", priority: 2 },
        { type: "info", text: "Weekend sales account for 42% of weekly revenue despite being only 29% of operating days. Consider extending weekend promotions.", priority: 3 },
        { type: "positive", text: "Mobile orders now represent 62% of total orders, up from 48% YoY. Mobile conversion rate improved by 28%.", priority: 2 },
        { type: "info", text: "Average order value peaks between 2-4 PM (avg $312 vs. daily avg $267). This pattern is consistent across all regions.", priority: 3 },
        { type: "warning", text: "Customer acquisition cost increased by 8% this month. Consider optimizing ad spend allocation across channels.", priority: 2 },
    ]

    const demoRecommendations = [
        { category: "Growth", title: "Expand Electronics Inventory", description: "Based on demand patterns, increase electronics stock by 20% for Q4 to capture holiday demand.", impact: "High", effort: "Medium" },
        { category: "Optimization", title: "Reduce Food & Beverage SKUs", description: "Bottom 15% of F&B products contribute only 2% to revenue. Consider discontinuing underperformers.", impact: "Medium", effort: "Low" },
        { category: "Marketing", title: "Launch Weekend Flash Sales", description: "Capitalize on weekend traffic by implementing flash sales. Predicted 18% revenue increase.", impact: "High", effort: "Low" },
        { category: "Operations", title: "Optimize Shipping Routes", description: "Analysis shows 12% delivery cost savings possible by consolidating APAC shipments.", impact: "Medium", effort: "High" },
    ]

    useEffect(() => {
        const loadData = async () => {
            try {
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const data = await dsRes.json()
                    setDatasets(data)
                    if (data.length > 0) {
                        const latest = data[data.length - 1]
                        setSelectedDatasetId(latest.id)
                        await fetchStats(latest.id)
                    }
                }
            } catch (error) {
                console.error("Failed to load data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const fetchStats = async (datasetId: number) => {
        try {
            const [statsRes, advRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/stats`),
                fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/advanced`)
            ])
            if (statsRes.ok) {
                const statsData = await statsRes.json()
                let advData = {}
                if (advRes.ok) advData = await advRes.json()
                setStats({ ...statsData, advanced: advData })
            }
        } catch (error) {
            console.error("Failed to fetch stats", error)
        }
    }

    const handleDatasetChange = async (value: string) => {
        const id = Number(value)
        setSelectedDatasetId(id)
        await fetchStats(id)
    }

    // Calculate metrics
    const totalRevenue = stats?.smart_analysis?.total_sales || 1385000
    const avgOrderValue = stats?.smart_analysis?.average_sales || 267
    const totalRows = stats?.total_rows || 15420
    const categoryCount = stats?.smart_analysis?.top_categories?.length || 5
    const insights = stats?.smart_analysis?.insights || demoAIInsights

    if (loading) {
        return (
            <div className="space-y-6 pb-20">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
                            <div className="h-8 w-48 bg-muted rounded-lg animate-pulse" />
                        </div>
                        <div className="h-4 w-64 bg-muted rounded animate-pulse" />
                    </div>
                    <div className="flex gap-2">
                        <div className="h-10 w-40 bg-muted rounded-lg animate-pulse" />
                        <div className="h-10 w-32 bg-muted rounded-lg animate-pulse" />
                    </div>
                </div>

                {/* Stats Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                            <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                            <div className="h-10 w-32 bg-muted rounded animate-pulse" />
                            <div className="h-3 w-20 bg-muted rounded animate-pulse" />
                        </div>
                    ))}
                </div>

                {/* Charts Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                                <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
                            </div>
                            <div className="h-[250px] flex items-end gap-2 pt-8">
                                {[40, 65, 45, 80, 55, 70, 50, 75, 60, 85, 45, 70].map((height, j) => (
                                    <div
                                        key={j}
                                        className="flex-1 bg-muted rounded-t-md animate-pulse"
                                        style={{ height: `${height}%` }}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20">
                            <Brain className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-2xl font-bold text-foreground">{t.bi.title}</h1>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">{t.bi.aiPowered}</span>
                    </div>
                    <p className="text-muted-foreground">
                        {t.bi.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {datasets.length > 1 && (
                        <Select value={selectedDatasetId ? String(selectedDatasetId) : ""} onValueChange={handleDatasetChange}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder={t.overview.selectDataset} />
                            </SelectTrigger>
                            <SelectContent>
                                {datasets.map((ds) => (
                                    <SelectItem key={ds.id} value={String(ds.id)}>{ds.filename}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" /> {t.bi.exportReport}
                    </Button>
                    <Link href="/intelligence/analysis">
                        <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90">
                            <Sparkles className="w-4 h-4 mr-2" /> {t.home.runAnalysis}
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Executive Summary Card */}
            <div className="premium-card p-6 bg-gradient-to-br from-slate-900/50 via-background to-slate-900/30 border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                    <FileText className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">{t.bi.executiveSummary}</h2>
                    <span className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                        <RefreshCw className="w-3 h-3" /> {t.bi.updated} 2 hours ago
                    </span>
                </div>

                <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                    <p className="text-foreground leading-relaxed text-base">
                        <strong className="text-primary">Q3 2024 Performance Analysis:</strong> Total revenue reached <strong>${(totalRevenue / 1000).toFixed(0)}K</strong>,
                        representing a <span className="text-green-500 font-semibold">23% increase</span> over Q2 and exceeding quarterly targets by $45K.
                        Analysis of {totalRows.toLocaleString()} transactions across {categoryCount} categories reveals strong momentum in core segments.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                        The Electronics category continues to drive growth (+31% YoY), while Food & Beverage shows signs of market saturation (-3% MoM).
                        Customer acquisition remains healthy with a 78.4% retention rate, though CAC has increased 8% requiring optimization focus.
                        Mobile commerce now represents 62% of orders, indicating successful digital transformation initiatives.
                    </p>
                </div>

                {/* Key Metrics Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border/50">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-500">+23%</p>
                        <p className="text-xs text-muted-foreground">{t.bi.revenueGrowth}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-500">78.4%</p>
                        <p className="text-xs text-muted-foreground">{t.bi.retentionRate}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-500">62%</p>
                        <p className="text-xs text-muted-foreground">{t.bi.mobileOrders}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-orange-500">$267</p>
                        <p className="text-xs text-muted-foreground">{t.bi.avgOrderValue}</p>
                    </div>
                </div>
            </div>

            {/* KPI Dashboard */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="premium-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-green-500/10">
                            <DollarSign className="w-5 h-5 text-green-500" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-500">+12.4%</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">${(totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-sm text-muted-foreground">{t.bi.totalRevenue}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">vs. $1.23M last period</p>
                </div>

                <div className="premium-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <ShoppingCart className="w-5 h-5 text-blue-500" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10">
                            <TrendingUp className="w-3 h-3 text-blue-500" />
                            <span className="text-xs font-medium text-blue-500">+8.2%</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{totalRows.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{t.bi.totalOrders}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">vs. 14,250 last period</p>
                </div>

                <div className="premium-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Target className="w-5 h-5 text-purple-500" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10">
                            <TrendingUp className="w-3 h-3 text-purple-500" />
                            <span className="text-xs font-medium text-purple-500">+3.8%</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">${avgOrderValue.toFixed(0)}</p>
                    <p className="text-sm text-muted-foreground">{t.bi.avgOrderValue}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">vs. $257 last period</p>
                </div>

                <div className="premium-card p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                            <Users className="w-5 h-5 text-orange-500" />
                        </div>
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs font-medium text-green-500">+7.2%</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">78.4%</p>
                    <p className="text-sm text-muted-foreground">{t.bi.customerRetention}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">vs. 71.2% last period</p>
                </div>
            </div>

            {/* Main Charts Row */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Revenue Trend with Forecast */}
                <div className="lg:col-span-2 premium-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">{t.bi.revenueTrend}</h3>
                            <p className="text-sm text-muted-foreground">{t.bi.actualVsTarget}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-primary" />
                                <span className="text-muted-foreground">{t.bi.actual}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-orange-500" />
                                <span className="text-muted-foreground">Target</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-primary/40 border-2 border-dashed border-primary" />
                                <span className="text-muted-foreground">Forecast</span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={[...demoTrendData, ...demoForecastData]}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                                        <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} />
                                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="px-4 py-3 rounded-xl glass border border-white/10 shadow-2xl backdrop-blur-xl">
                                                    <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].payload.month}</p>
                                                    <p className="text-lg font-bold text-foreground">
                                                        ${Number(payload[0].value).toLocaleString()}
                                                    </p>
                                                    {payload[0].payload.forecast && (
                                                        <p className="text-xs text-primary mt-1">Forecasted</p>
                                                    )}
                                                </div>
                                            )
                                        }
                                        return null
                                    }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#revenueGradient)" />
                                <Line type="monotone" dataKey="target" stroke="#f97316" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                <ReferenceLine y={400000} stroke="#22c55e" strokeDasharray="3 3" label={{ value: 'Goal', fill: '#22c55e', fontSize: 10 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="font-semibold text-foreground">{t.bi.categoryMix}</h3>
                            <p className="text-sm text-muted-foreground">{t.bi.revenueDist}</p>
                        </div>
                    </div>
                    <div className="h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RechartsPie>
                                <Pie
                                    data={demoCategoryData}
                                    cx="50%" cy="50%"
                                    innerRadius={50}
                                    outerRadius={75}
                                    paddingAngle={3}
                                    cornerRadius={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {demoCategoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6b7280'][index % 5]} />
                                    ))}
                                </Pie>
                            </RechartsPie>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 mt-4">
                        {demoCategoryData.map((cat, i) => (
                            <div key={i} className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#6b7280'][i % 5] }} />
                                    <span className="text-foreground truncate max-w-[100px]">{cat.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-muted-foreground">{cat.percentage}%</span>
                                    <span className={`text-xs font-medium ${cat.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {cat.growth >= 0 ? '+' : ''}{cat.growth}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Performers with Growth */}
                <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">{t.bi.topPerformers}</h3>
                            <p className="text-sm text-muted-foreground">{t.bi.bestSelling}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {demoTopPerformers.map((item, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                    #{i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-foreground truncate">{item.name}</p>
                                        <p className="font-bold text-foreground">${(item.value / 1000).toFixed(0)}K</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full"
                                                style={{ width: `${(item.value / demoTopPerformers[0].value) * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-medium ${item.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.growth >= 0 ? '+' : ''}{item.growth}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Regional Performance */}
                <div className="premium-card p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="font-semibold text-foreground">{t.bi.regionalBreakdown}</h3>
                            <p className="text-sm text-muted-foreground">{t.bi.byGeography}</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        {demoRegionalData.map((region, i) => (
                            <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/50">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-foreground">{region.region}</p>
                                    <p className="font-bold text-foreground">${(region.revenue / 1000).toFixed(0)}K</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">{t.bi.totalOrders}</p>
                                        <p className="font-medium text-foreground">{region.orders.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">{t.bi.avgOrderValue}</p>
                                        <p className="font-medium text-foreground">${region.avgOrder}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Anomaly Detection */}
            <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-6">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="font-semibold text-foreground">{t.bi.anomalyDetection}</h3>
                    <span className="ml-auto px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-xs font-medium">
                        {demoAnomalies.length} {t.bi.detected}
                    </span>
                </div>
                <div className="grid md:grid-cols-3 gap-4">
                    {demoAnomalies.map((anomaly, i) => (
                        <div key={i} className={`p-4 rounded-xl border ${anomaly.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                            anomaly.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/20' :
                                'bg-yellow-500/5 border-yellow-500/20'
                            }`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-foreground">{anomaly.metric}</span>
                                <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${anomaly.severity === 'high' ? 'bg-red-500/20 text-red-500' :
                                    anomaly.severity === 'medium' ? 'bg-orange-500/20 text-orange-500' :
                                        'bg-yellow-500/20 text-yellow-500'
                                    }`}>
                                    {anomaly.severity}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2">{anomaly.date}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">{t.bi.expected}: ${anomaly.expected.toLocaleString()}</span>
                                <span className="text-muted-foreground">{t.bi.actual}: ${anomaly.actual.toLocaleString()}</span>
                            </div>
                            <div className={`mt-2 text-sm font-medium ${anomaly.deviation < 0 ? 'text-red-500' : 'text-green-500'}`}>
                                {anomaly.deviation > 0 ? '+' : ''}{anomaly.deviation}% {t.bi.deviation}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Data Quality Metrics */}
            <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Data Quality Metrics</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: t.bi.completeness, value: demoDataQuality.completeness, color: '#3b82f6' },
                        { label: t.bi.accuracy, value: demoDataQuality.accuracy, color: '#8b5cf6' },
                        { label: t.bi.consistency, value: demoDataQuality.consistency, color: '#10b981' },
                        { label: t.bi.timeliness, value: demoDataQuality.timeliness, color: '#f59e0b' },
                    ].map((metric, i) => (
                        <div key={i} className="text-center group">
                            <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
                                {/* Refined Clean Ring */}
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted/10" />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="40"
                                        fill="none"
                                        stroke={metric.color}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(metric.value / 100) * 251} 251`}
                                        className="transition-all duration-1000 ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xl font-bold tracking-tight text-foreground">{metric.value}%</span>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-border/50 text-center">
                    <div>
                        <p className="text-lg font-bold text-foreground">{demoDataQuality.totalRecords.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{t.bi.totalRecords}</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-orange-500">{demoDataQuality.missingValues}</p>
                        <p className="text-xs text-muted-foreground">{t.bi.missingValues}</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-yellow-500">{demoDataQuality.duplicates}</p>
                        <p className="text-xs text-muted-foreground">{t.bi.duplicates}</p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-red-500">{demoDataQuality.outliers}</p>
                        <p className="text-xs text-muted-foreground">{t.bi.outliers}</p>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="premium-card p-6 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-foreground">{t.bi.generatedInsights}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                            {demoAIInsights.length} insights
                        </span>
                    </div>
                    <Link href="/insights">
                        <Button variant="ghost" size="sm" className="text-primary">
                            {t.bi.exploreMore} <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {demoAIInsights.slice(0, 6).map((insight, i) => {
                        const colors = {
                            positive: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, iconColor: 'text-green-500' },
                            warning: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertTriangle, iconColor: 'text-orange-500' },
                            info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Activity, iconColor: 'text-blue-500' },
                        }
                        const style = colors[insight.type as keyof typeof colors] || colors.info
                        const Icon = style.icon

                        return (
                            <div key={i} className={`p-4 rounded-xl ${style.bg} border ${style.border}`}>
                                <div className="flex gap-3">
                                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${style.iconColor}`} />
                                    <p className="text-sm text-foreground leading-relaxed">{insight.text}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* AI Recommendations */}
            <div className="premium-card p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                    <h3 className="font-semibold text-foreground">{t.bi.recommendations}</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    {demoRecommendations.map((rec, i) => (
                        <div key={i} className="p-4 rounded-xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between mb-2">
                                <div>
                                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary mb-2 inline-block">
                                        {rec.category}
                                    </span>
                                    <h4 className="font-medium text-foreground">{rec.title}</h4>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">{t.bi.impact}:</span>
                                    <span className={`font-medium ${rec.impact === 'High' ? 'text-green-500' : rec.impact === 'Medium' ? 'text-yellow-500' : 'text-gray-500'}`}>
                                        {rec.impact}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="text-muted-foreground">{t.bi.effort}:</span>
                                    <span className={`font-medium ${rec.effort === 'Low' ? 'text-green-500' : rec.effort === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>
                                        {rec.effort}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
