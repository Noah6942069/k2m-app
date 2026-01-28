"use client"

import { useEffect, useState } from "react"
import {
    Activity,
    Database,
    AlertCircle,
    CheckCircle2,
    FileText,
    TrendingUp,
    MoreHorizontal
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
    PieChart,
    Pie
} from "recharts"
import { SkeletonCard, SkeletonChart, Skeleton } from "@/components/ui/skeleton"

// K2M Brand Colors
const K2M_COLORS = {
    primary: '#7C5CFC',
    primaryDark: '#5E43D8',
    primaryDeep: '#432EB5',
    primaryLight: '#9F84FD',
    primaryMuted: '#B49DFE',
    background: '#0f1219',
    card: '#161b26',
    border: '#252d3d',
}

interface AutoDashboardProps {
    datasetId: number
}

export function AutoDashboard({ datasetId }: AutoDashboardProps) {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (datasetId) {
            fetchStats()
        }
    }, [datasetId])

    const fetchStats = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${datasetId}/stats`)
            if (!res.ok) throw new Error("Failed to fetch statistics")

            const data = await res.json()
            if (!data || !data.column_stats) throw new Error("Invalid data format")

            setStats(data)
        } catch (error) {
            console.error(error)
            setStats(null)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="space-y-6 p-2 animate-enter">
                {/* Header skeleton */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-40" />
                    </div>
                    <Skeleton className="h-10 w-36 rounded-2xl" />
                </div>

                {/* Stats skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>

                {/* Charts skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <SkeletonChart className="lg:col-span-2" />
                    <Skeleton className="h-[400px] rounded-2xl" />
                </div>
            </div>
        )
    }

    if (!stats) {
        return (
            <div className="flex h-[50vh] items-center justify-center flex-col gap-4 text-center">
                <AlertCircle className="h-12 w-12 text-red-500/50" />
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-white">Analysis Failed</h3>
                    <p className="text-zinc-500 max-w-sm">
                        Could not analyze this dataset. It might be empty or the backend is offline.
                    </p>
                </div>
            </div>
        )
    }

    const numericCols = stats.column_stats.filter((c: any) => c.type === "numeric")
    const categoricalCols = stats.column_stats.filter((c: any) => c.type === "categorical")

    // Data health using brand colors
    const healthData = [
        { name: 'Valid', value: 100 - stats.missing_percentage, fill: K2M_COLORS.primary },
        { name: 'Missing', value: stats.missing_percentage, fill: K2M_COLORS.border },
    ]

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 p-2">

            {/* Header / Title Card */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        {stats.filename}
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">Automated Intelligence Report</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-4 py-2 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm font-medium flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        AI Analysis Ready
                    </div>
                </div>
            </div>

            {/* Top Row: Hero Stats (Mobile Card Style) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stat Card 1 */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 group hover:border-primary/30 transition-all duration-300 card-hover-glow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Database className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="text-zinc-400 font-medium text-sm flex items-center gap-2">
                            Total Records
                        </div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white tracking-tight">
                                {stats.total_rows.toLocaleString()}
                            </span>
                            <div className="flex items-center gap-1 text-emerald-400 text-xs mt-2 font-medium">
                                <TrendingUp className="w-3 h-3" />
                                +100% Ingested
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat Card 2 */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 group hover:border-primary/30 transition-all duration-300 card-hover-glow">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex flex-col h-full justify-between relative z-10">
                        <div className="text-zinc-400 font-medium text-sm">Features</div>
                        <div className="mt-4">
                            <span className="text-4xl font-bold text-white tracking-tight">
                                {stats.total_columns}
                            </span>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {numericCols.length} NUM
                                </span>
                                <span className="bg-primary/10 text-primary/80 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    {categoricalCols.length} CAT
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stat Card 3 - Data Health */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 flex flex-col items-center justify-center card-hover-glow">
                    <div className="absolute top-4 left-6 text-zinc-400 font-medium text-sm w-full">Data Health</div>
                    <div className="relative h-32 w-32 mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={healthData}
                                    innerRadius={40}
                                    outerRadius={55}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {healthData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-bold text-white">{100 - stats.missing_percentage}%</span>
                        </div>
                    </div>
                </div>

                {/* Stat Card 4 */}
                <div className="relative overflow-hidden rounded-2xl bg-card border border-border p-6 card-hover-glow">
                    <div className="flex justify-between items-start">
                        <div className="text-zinc-400 font-medium text-sm">Duplicates</div>
                        <MoreHorizontal className="w-5 h-5 text-zinc-600" />
                    </div>
                    <div className="mt-8">
                        <div className="text-4xl font-bold text-white mb-1">{stats.duplicate_rows}</div>
                        <p className="text-xs text-zinc-500">Identical rows found</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Large Chart: Distribution */}
                <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-8 relative overflow-hidden">
                    {/* Gradient Glow */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent opacity-50"></div>

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Dominant Categories</h3>
                            <p className="text-zinc-500 text-sm">Top distribution in primary text columns</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-violet-500"></div>
                            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        {categoricalCols.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoricalCols[0].distribution} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={K2M_COLORS.primary} stopOpacity={0.9} />
                                            <stop offset="95%" stopColor={K2M_COLORS.primaryDark} stopOpacity={0.3} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={K2M_COLORS.border} vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                                    <Tooltip
                                        cursor={{ fill: K2M_COLORS.border, opacity: 0.3 }}
                                        contentStyle={{
                                            backgroundColor: K2M_COLORS.card,
                                            borderColor: K2M_COLORS.border,
                                            borderRadius: '12px',
                                            color: '#fff',
                                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                                        }}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="url(#colorBar)"
                                        radius={[8, 8, 0, 0]}
                                        barSize={40}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-zinc-500">
                                No Categorical Data Available
                            </div>
                        )}
                    </div>
                </div>

                {/* Side Panel: Numeric Stats List */}
                <div className="rounded-2xl bg-card border border-border p-6 h-full">
                    <h3 className="text-lg font-semibold text-foreground mb-6">Key Metrics</h3>
                    <div className="space-y-4 max-h-[340px] overflow-y-auto pr-2 custom-scrollbar">
                        {numericCols.map((col: any, idx: number) => (
                            <div key={idx} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors border border-border">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-muted-foreground font-medium text-sm truncate max-w-[120px]" title={col.name}>
                                        {col.name}
                                    </span>
                                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                        AVG
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-foreground counter-animate">
                                        {col.mean > 1000 ? (col.mean / 1000).toFixed(1) + 'k' : col.mean.toFixed(1)}
                                    </span>
                                </div>
                                {/* Mini sparkline visual */}
                                <div className="h-6 w-full mt-2 opacity-60">
                                    <div className="h-full w-full bg-gradient-to-r from-primary/20 to-transparent rounded-full flex items-end overflow-hidden px-1 gap-0.5">
                                        <div className="w-[12%] h-[30%] bg-primary/70 rounded-t-sm"></div>
                                        <div className="w-[12%] h-[55%] bg-primary/70 rounded-t-sm"></div>
                                        <div className="w-[12%] h-[40%] bg-primary/70 rounded-t-sm"></div>
                                        <div className="w-[12%] h-[75%] bg-primary/70 rounded-t-sm"></div>
                                        <div className="w-[12%] h-[60%] bg-primary/70 rounded-t-sm"></div>
                                        <div className="w-[12%] h-[85%] bg-primary rounded-t-sm"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
