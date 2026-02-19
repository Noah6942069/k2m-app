"use client"

import {
    Flask, TrendUp, CurrencyDollar, Users, Target, ChartLineUp,
    ArrowUpRight, ArrowDownRight, Lightbulb, CheckCircle, WarningCircle, Star,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import CountUp from "@/components/ui/CountUp"
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

// ── KPI Data ──

const kpiData = [
    {
        title: "Celkové tržby",
        value: 12.45,
        displaySuffix: "M Kč",
        change: "+12.5%",
        changeDirection: "up" as const,
        icon: CurrencyDollar,
    },
    {
        title: "Zisková marže",
        value: 23.8,
        displaySuffix: "%",
        change: "+2.1%",
        changeDirection: "up" as const,
        icon: TrendUp,
    },
    {
        title: "Aktivní zákazníci",
        value: 1284,
        displaySuffix: "",
        change: "+8.3%",
        changeDirection: "up" as const,
        icon: Users,
    },
    {
        title: "Konverzní poměr",
        value: 4.7,
        displaySuffix: "%",
        change: "-0.3%",
        changeDirection: "down" as const,
        icon: Target,
    },
    {
        title: "Meziroční růst",
        value: 18.2,
        displaySuffix: "%",
        change: "+5.4%",
        changeDirection: "up" as const,
        icon: ChartLineUp,
    },
]

// ── Chart Data ──

const revenueTrendData = [
    { month: "Led", revenue: 820000, profit: 185000 },
    { month: "Úno", revenue: 780000, profit: 172000 },
    { month: "Bře", revenue: 910000, profit: 210000 },
    { month: "Dub", revenue: 1050000, profit: 248000 },
    { month: "Kvě", revenue: 1120000, profit: 265000 },
    { month: "Čen", revenue: 980000, profit: 226000 },
    { month: "Čnc", revenue: 1040000, profit: 241000 },
    { month: "Srp", revenue: 1150000, profit: 275000 },
    { month: "Zář", revenue: 1280000, profit: 310000 },
    { month: "Říj", revenue: 1180000, profit: 285000 },
    { month: "Lis", revenue: 1350000, profit: 328000 },
    { month: "Pro", revenue: 1290000, profit: 315000 },
]

const costRevenueData = [
    { quarter: "Q1 2025", revenue: 2510000, costs: 1890000 },
    { quarter: "Q2 2025", revenue: 3150000, costs: 2210000 },
    { quarter: "Q3 2025", revenue: 3470000, costs: 2380000 },
    { quarter: "Q4 2025", revenue: 3820000, costs: 2560000 },
]

const funnelData = [
    { stage: "Návštěvy webu", value: 45200, color: "#7C5CFC" },
    { stage: "Registrace", value: 8340, color: "#9F84FD" },
    { stage: "Aktivní trial", value: 3120, color: "#5E43D8" },
    { stage: "Konverze na platbu", value: 1284, color: "#432EB5" },
]

const categoryPerformanceData = [
    { category: "Produkty", revenue: 4850000, target: 5000000 },
    { category: "Služby", revenue: 3200000, target: 3000000 },
    { category: "Konzultace", revenue: 2100000, target: 2500000 },
    { category: "Licence", revenue: 1500000, target: 1800000 },
    { category: "Podpora", revenue: 800000, target: 700000 },
]

const keyInsights = [
    { type: "positive" as const, text: "Tržby vzrostly o 12.5% oproti minulému kvartálu, primárně díky segmentu služeb." },
    { type: "positive" as const, text: "Zákaznická retence dosáhla historického maxima 94.2%." },
    { type: "warning" as const, text: "Konverzní poměr mírně poklesl (-0.3%) — doporučujeme analýzu onboardingu." },
    { type: "positive" as const, text: "Náklady na akvizici zákazníka klesly o 15% díky optimalizaci kampaní." },
    { type: "warning" as const, text: "Segment konzultací zaostává za cílem o 16% — zvážit cenovou revizi." },
]

const topMetrics = [
    { label: "Průměrná hodnota objednávky", value: "9 700 Kč", change: "+8%", positive: true },
    { label: "Customer Lifetime Value", value: "142 000 Kč", change: "+12%", positive: true },
    { label: "Náklady na akvizici (CAC)", value: "3 200 Kč", change: "-15%", positive: true },
    { label: "Měsíční opakující se výnos", value: "2.8M Kč", change: "+18%", positive: true },
    { label: "Net Promoter Score", value: "72", change: "+5", positive: true },
]

// ── Custom Tooltip ──

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
        <div className="rounded-xl bg-[#0d0a1a] border border-white/10 px-4 py-3 shadow-xl">
            <p className="text-xs text-gray-400 mb-2 font-medium">{label}</p>
            {payload.map((entry: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-xs text-gray-300">{entry.name}:</span>
                    <span className="text-xs font-bold text-white">
                        {typeof entry.value === "number" ? entry.value.toLocaleString("cs-CZ") : entry.value}
                    </span>
                </div>
            ))}
        </div>
    )
}

// ── Page ──

export default function AnalyzaPage() {
    return (
        <div className="flex-1 min-h-screen">
            {/* KPI Row */}
            <div className="px-6 md:px-10 pt-6 pb-6">
                <div className="stagger-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                    {kpiData.map((kpi) => {
                        const Icon = kpi.icon
                        const isUp = kpi.changeDirection === "up"
                        return (
                            <div
                                key={kpi.title}
                                className="group rounded-3xl backdrop-blur-sm px-5 py-3.5 transition-all duration-300"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderLeft: "4px solid #7C5CFC",
                                    background: "rgba(255,255,255,0.04)",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                                }}
                            >

                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[13px] font-medium text-gray-400">{kpi.title}</p>
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5 text-purple-400" weight="duotone" />
                                    </div>
                                </div>

                                <div className="flex items-end justify-between">
                                    <div className="text-[26px] font-bold text-white leading-tight tracking-tight">
                                        <CountUp from={0} to={kpi.value} duration={2} separator=" " />
                                        {kpi.displaySuffix && (
                                            <span className="text-sm font-medium text-gray-500 ml-1">{kpi.displaySuffix}</span>
                                        )}
                                    </div>

                                    <div className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold",
                                        isUp
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : "bg-red-500/10 text-red-400"
                                    )}>
                                        {isUp
                                            ? <ArrowUpRight className="w-3 h-3" weight="bold" />
                                            : <ArrowDownRight className="w-3 h-3" weight="bold" />
                                        }
                                        {kpi.change}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Chart Rows */}
            <div className="px-6 md:px-10 py-8 space-y-6">

                {/* Row 1: Revenue Trend + Cost vs Revenue */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Revenue Trend (Area Chart) */}
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 rounded-full bg-purple-500" />
                            <h3 className="text-lg font-bold text-white">Vývoj tržeb a zisku</h3>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={revenueTrendData}>
                                    <defs>
                                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.05)" }} tickLine={false} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="revenue" name="Tržby" stroke="#7C5CFC" strokeWidth={2} fill="url(#gradRevenue)" />
                                    <Area type="monotone" dataKey="profit" name="Zisk" stroke="#10b981" strokeWidth={2} fill="url(#gradProfit)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 rounded-full bg-purple-500" />
                                <span className="text-xs text-gray-500">Tržby</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-1 rounded-full bg-emerald-500" />
                                <span className="text-xs text-gray-500">Zisk</span>
                            </div>
                        </div>
                    </div>

                    {/* Cost vs Revenue (Bar Chart) */}
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 rounded-full bg-blue-500" />
                            <h3 className="text-lg font-bold text-white">Tržby vs. Náklady</h3>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={costRevenueData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="quarter" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "rgba(255,255,255,0.05)" }} tickLine={false} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="revenue" name="Tržby" fill="#7C5CFC" radius={[6, 6, 0, 0]} barSize={28} />
                                    <Bar dataKey="costs" name="Náklady" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} opacity={0.7} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                                <span className="text-xs text-gray-500">Tržby</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-blue-500 opacity-70" />
                                <span className="text-xs text-gray-500">Náklady</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 2: Funnel + Category Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Conversion Funnel */}
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 rounded-full bg-purple-500" />
                            <h3 className="text-lg font-bold text-white">Konverzní trychtýř</h3>
                        </div>
                        <div className="space-y-5">
                            {funnelData.map((item, idx) => {
                                const maxValue = funnelData[0].value
                                const widthPercent = (item.value / maxValue) * 100
                                return (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">{item.stage}</span>
                                            <span className="text-sm font-bold text-white">{item.value.toLocaleString("cs-CZ")}</span>
                                        </div>
                                        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${widthPercent}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                        {idx < funnelData.length - 1 && (
                                            <div className="flex justify-end mt-1">
                                                <span className="text-[10px] text-gray-600">
                                                    {((funnelData[idx + 1].value / item.value) * 100).toFixed(1)}% konverze
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Category Performance vs Target */}
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 rounded-full bg-emerald-500" />
                            <h3 className="text-lg font-bold text-white">Výkon dle kategorie vs. cíl</h3>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryPerformanceData} barGap={4}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="category" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={{ stroke: "rgba(255,255,255,0.05)" }} tickLine={false} />
                                    <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="revenue" name="Skutečnost" fill="#7C5CFC" radius={[6, 6, 0, 0]} barSize={24} />
                                    <Bar dataKey="target" name="Cíl" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-6 mt-4 justify-center">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-purple-500" />
                                <span className="text-xs text-gray-500">Skutečnost</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm bg-white/10 border border-white/20" />
                                <span className="text-xs text-gray-500">Cíl</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Row 3: Key Insights + Top Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Key Insights */}
                    <div className="rounded-3xl border border-white/[0.12] border-l-4 border-l-purple-500 bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Lightbulb className="w-5 h-5 text-purple-400" weight="duotone" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Klíčové poznatky</h3>
                        </div>
                        <div className="space-y-4">
                            {keyInsights.map((insight, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                    {insight.type === "positive" ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" weight="duotone" />
                                    ) : (
                                        <WarningCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" weight="duotone" />
                                    )}
                                    <p className="text-sm text-gray-400 leading-relaxed">{insight.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Metrics Table */}
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                <Star className="w-5 h-5 text-blue-400" weight="duotone" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Klíčové ukazatele</h3>
                        </div>
                        <div className="space-y-0">
                            {topMetrics.map((metric, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex items-center justify-between py-4",
                                        idx < topMetrics.length - 1 && "border-b border-white/5"
                                    )}
                                >
                                    <span className="text-sm text-gray-400">{metric.label}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-white">{metric.value}</span>
                                        <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-400">
                                            {metric.change.startsWith("-")
                                                ? <ArrowDownRight className="w-3 h-3" weight="duotone" />
                                                : <ArrowUpRight className="w-3 h-3" weight="duotone" />
                                            }
                                            {metric.change}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
