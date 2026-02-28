"use client"

import {
    CurrencyDollar, TrendUp, ChartLineUp, Wallet, HourglassMedium, Scales,
    ArrowUpRight, ArrowDownRight,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { TimeRangeFilter } from "@/components/filters/TimeRangeFilter"
import CountUp from "@/components/ui/CountUp"
import { useTranslation } from "@/lib/i18n/language-context"
import {
    AreaChart, Area, BarChart, Bar, ComposedChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

// ── KPI Data ──

const kpiData = [
    {
        titleCs: "Tržby",
        titleEn: "Revenue",
        tKey: "revenue" as const,
        value: 24.8,
        displaySuffix: "M Kč",
        change: "+12.5%",
        changeDirection: "up" as const,
        icon: CurrencyDollar,
    },
    {
        titleCs: "EBITDA",
        titleEn: "EBITDA",
        tKey: "ebitda" as const,
        value: 4.2,
        displaySuffix: "M Kč",
        change: "+8.3%",
        changeDirection: "up" as const,
        icon: TrendUp,
    },
    {
        titleCs: "EBITDA Marže",
        titleEn: "EBITDA Margin",
        tKey: "ebitdaMargin" as const,
        value: 16.9,
        displaySuffix: "%",
        change: "+1.4pp",
        changeDirection: "up" as const,
        icon: ChartLineUp,
    },
    {
        titleCs: "Provozní Cash Flow",
        titleEn: "Operating Cash Flow",
        tKey: "operatingCashFlow" as const,
        value: 3.1,
        displaySuffix: "M Kč",
        change: "+15.2%",
        changeDirection: "up" as const,
        icon: Wallet,
    },
    {
        titleCs: "Runway",
        titleEn: "Runway",
        tKey: "runway" as const,
        value: 18,
        displaySuffixCs: "měs.",
        displaySuffixEn: "mo.",
        change: "+2",
        changeDirection: "up" as const,
        icon: HourglassMedium,
    },
    {
        titleCs: "Working Capital",
        titleEn: "Working Capital",
        tKey: "workingCapital" as const,
        value: 6.5,
        displaySuffix: "M Kč",
        change: "-3.1%",
        changeDirection: "down" as const,
        icon: Scales,
    },
]

// ── Chart Data ──

const performanceTrendData = [
    { month: "Led", revenue: 1820, ebitda: 285 },
    { month: "Úno", revenue: 1780, ebitda: 272 },
    { month: "Bře", revenue: 1910, ebitda: 310 },
    { month: "Dub", revenue: 2050, ebitda: 348 },
    { month: "Kvě", revenue: 2120, ebitda: 365 },
    { month: "Čen", revenue: 1980, ebitda: 326 },
    { month: "Čnc", revenue: 2040, ebitda: 341 },
    { month: "Srp", revenue: 2150, ebitda: 375 },
    { month: "Zář", revenue: 2280, ebitda: 410 },
    { month: "Říj", revenue: 2180, ebitda: 385 },
    { month: "Lis", revenue: 2350, ebitda: 428 },
    { month: "Pro", revenue: 2480, ebitda: 420 },
]

const revenueVsCostsData = [
    { quarter: "Q1 2025", revenue: 5510, costs: 4190 },
    { quarter: "Q2 2025", revenue: 6150, costs: 4610 },
    { quarter: "Q3 2025", revenue: 6470, costs: 4780 },
    { quarter: "Q4 2025", revenue: 7010, costs: 5060 },
]

const marginStructureData = [
    { quarter: "Q1", cm1: 3200, cm2: 2400, cm3: 1600 },
    { quarter: "Q2", cm1: 3600, cm2: 2700, cm3: 1900 },
    { quarter: "Q3", cm1: 3800, cm2: 2900, cm3: 2100 },
    { quarter: "Q4", cm1: 4100, cm2: 3100, cm3: 2300 },
]

const cashFlowData = [
    { quarter: "Q1", operating: 1200, investing: -450, financing: -300 },
    { quarter: "Q2", operating: 1400, investing: -600, financing: -200 },
    { quarter: "Q3", operating: 1100, investing: -350, financing: -400 },
    { quarter: "Q4", operating: 1600, investing: -500, financing: -250 },
]

const runwayBurnData = [
    { month: "Led", burnRate: 420, runway: 22 },
    { month: "Úno", burnRate: 440, runway: 21 },
    { month: "Bře", burnRate: 410, runway: 22 },
    { month: "Dub", burnRate: 390, runway: 23 },
    { month: "Kvě", burnRate: 380, runway: 24 },
    { month: "Čen", burnRate: 400, runway: 22 },
    { month: "Čnc", burnRate: 370, runway: 24 },
    { month: "Srp", burnRate: 360, runway: 25 },
    { month: "Zář", burnRate: 350, runway: 26 },
    { month: "Říj", burnRate: 340, runway: 26 },
    { month: "Lis", burnRate: 330, runway: 27 },
    { month: "Pro", burnRate: 320, runway: 28 },
]

const costStructureData = [
    { category: "Marketing", categoryEn: "Marketing", value: 2800 },
    { category: "Mzdy", categoryEn: "Salaries", value: 5400 },
    { category: "Nástroje", categoryEn: "Tools", value: 1200 },
    { category: "Nájem", categoryEn: "Rent", value: 960 },
    { category: "Podpora", categoryEn: "Support", value: 680 },
    { category: "Provoz", categoryEn: "Operations", value: 1540 },
]

const revenueBreakdownData = [
    { name: "Produkt A", value: 4200 },
    { name: "Produkt B", value: 3600 },
    { name: "Služby", value: 2800 },
    { name: "Licence", value: 2100 },
    { name: "Konzultace", value: 1800 },
    { name: "Podpora", value: 1200 },
    { name: "Školení", value: 900 },
    { name: "Ostatní", value: 540 },
]

const funnelData = [
    { stageCs: "Návštěvy webu", stageEn: "Website Visits", value: 45200, color: "#7C5CFC" },
    { stageCs: "Registrace", stageEn: "Sign-ups", value: 8340, color: "#3b82f6" },
    { stageCs: "Aktivní trial", stageEn: "Active Trial", value: 3120, color: "#10b981" },
    { stageCs: "Platící zákazníci", stageEn: "Paying Customers", value: 1284, color: "#9F84FD" },
]

const forecastData = [
    { month: "Zář", actual: 2280, cashActual: 1800 },
    { month: "Říj", actual: 2180, cashActual: 1720 },
    { month: "Lis", actual: 2350, cashActual: 1850 },
    { month: "Pro", actual: 2480, cashActual: 1950, forecast: 2480, cashForecast: 1950 },
    { month: "Led*", forecast: 2550, cashForecast: 2010 },
    { month: "Úno*", forecast: 2620, cashForecast: 2080 },
    { month: "Bře*", forecast: 2700, cashForecast: 2150 },
    { month: "Dub*", forecast: 2800, cashForecast: 2240 },
    { month: "Kvě*", forecast: 2900, cashForecast: 2340 },
    { month: "Čen*", forecast: 3010, cashForecast: 2440 },
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

// ── Shared chart axis styling ──

const axisProps = {
    tick: { fill: "#6b7280", fontSize: 12 },
    axisLine: { stroke: "rgba(255,255,255,0.05)" },
    tickLine: false as const,
}
const yAxisProps = {
    tick: { fill: "#6b7280", fontSize: 12 },
    axisLine: false as const,
    tickLine: false as const,
}
const gridProps = {
    strokeDasharray: "3 3",
    stroke: "rgba(255,255,255,0.05)",
}

// ── Chart card wrapper ──

function ChartCard({ title, accentColor = "#7C5CFC", children, className }: {
    title: string
    accentColor?: string
    children: React.ReactNode
    className?: string
}) {
    return (
        <div className={cn("rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-4 md:p-6", className)}>
            <div className="flex items-center gap-3 mb-5">
                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: accentColor }} />
                <h3 className="text-base font-bold text-white">{title}</h3>
            </div>
            {children}
        </div>
    )
}

// ── Legend helper ──

function ChartLegend({ items }: { items: { color: string; label: string; shape?: "line" | "square" }[] }) {
    return (
        <div className="flex items-center gap-5 mt-4 justify-center flex-wrap">
            {items.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                    <div
                        className={cn(
                            item.shape === "line" ? "w-3 h-0.5" : "w-3 h-3 rounded-sm",
                            "rounded-full"
                        )}
                        style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-gray-500">{item.label}</span>
                </div>
            ))}
        </div>
    )
}

// ── Page ──

export default function AnalyzaPage() {
    const { language, t } = useTranslation()
    const a = t.analysis

    return (
        <div className="flex-1 min-h-screen">
            {/* KPI Row */}
            <div className="px-4 md:px-10 pt-6 pb-6">
                <div className="mb-4">
                    <TimeRangeFilter />
                </div>
                <div className="stagger-grid grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                    {kpiData.map((kpi) => {
                        const Icon = kpi.icon
                        const isUp = kpi.changeDirection === "up"
                        const suffix = "displaySuffix" in kpi
                            ? kpi.displaySuffix
                            : language === "cs" ? kpi.displaySuffixCs : kpi.displaySuffixEn
                        return (
                            <div
                                key={kpi.tKey}
                                className="group rounded-3xl backdrop-blur-sm px-4 py-3 md:px-5 md:py-3.5 transition-all duration-300"
                                style={{
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    borderLeft: "4px solid #7C5CFC",
                                    background: "rgba(255,255,255,0.04)",
                                    boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
                                }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[13px] font-medium text-gray-400">
                                        {(a as any)[kpi.tKey]}
                                    </p>
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                        <Icon className="w-3.5 h-3.5 text-purple-400" weight="duotone" />
                                    </div>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="text-xl md:text-[26px] font-bold text-white leading-tight tracking-tight">
                                        <CountUp from={0} to={kpi.value} duration={2} separator=" " />
                                        {suffix && (
                                            <span className="text-sm font-medium text-gray-500 ml-1">{suffix}</span>
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
            <div className="px-4 md:px-10 py-6 md:py-8 space-y-4 md:space-y-6">

                {/* Row 1: Performance Trend + Revenue vs Costs */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* A) Trend výkonu */}
                    <ChartCard title={a.performanceTrend}>
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={performanceTrendData}>
                                    <defs>
                                        <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.3} />
                                            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradEbitda" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="month" {...axisProps} />
                                    <YAxis {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Area type="monotone" dataKey="revenue" name={a.revenue} stroke="#7C5CFC" strokeWidth={2} fill="url(#gradRevenue)" />
                                    <Area type="monotone" dataKey="ebitda" name={a.ebitda} stroke="#10b981" strokeWidth={2} fill="url(#gradEbitda)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#7C5CFC", label: a.revenue, shape: "line" },
                            { color: "#10b981", label: a.ebitda, shape: "line" },
                        ]} />
                    </ChartCard>

                    {/* B) Tržby vs náklady */}
                    <ChartCard title={a.revenueVsCosts} accentColor="#3b82f6">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueVsCostsData} barGap={4}>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="quarter" {...axisProps} />
                                    <YAxis {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar dataKey="revenue" name={a.revenue} fill="#7C5CFC" radius={[6, 6, 0, 0]} barSize={28} />
                                    <Bar dataKey="costs" name={a.costs} fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={28} opacity={0.7} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#7C5CFC", label: a.revenue },
                            { color: "#3b82f6", label: a.costs },
                        ]} />
                    </ChartCard>
                </div>

                {/* Row 2: Margin Structure + Cash Flow Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* C) Maržová struktura */}
                    <ChartCard title={a.marginStructure} accentColor="#a78bfa">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={marginStructureData}>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="quarter" {...axisProps} />
                                    <YAxis {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar dataKey="cm3" name={a.cm3} stackId="margin" fill="#432EB5" radius={[0, 0, 0, 0]} barSize={36} />
                                    <Bar dataKey="cm2" name={a.cm2} stackId="margin" fill="#7C5CFC" radius={[0, 0, 0, 0]} barSize={36} />
                                    <Bar dataKey="cm1" name={a.cm1} stackId="margin" fill="#a78bfa" radius={[6, 6, 0, 0]} barSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#a78bfa", label: a.cm1 },
                            { color: "#7C5CFC", label: a.cm2 },
                            { color: "#432EB5", label: a.cm3 },
                        ]} />
                    </ChartCard>

                    {/* D) Cash flow breakdown */}
                    <ChartCard title={a.cashFlowBreakdown} accentColor="#10b981">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cashFlowData}>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="quarter" {...axisProps} />
                                    <YAxis {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar dataKey="operating" name={a.operating} stackId="cf" fill="#10b981" radius={[0, 0, 0, 0]} barSize={36} />
                                    <Bar dataKey="investing" name={a.investing} stackId="cf" fill="#7C5CFC" radius={[0, 0, 0, 0]} barSize={36} />
                                    <Bar dataKey="financing" name={a.financing} stackId="cf" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={36} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#10b981", label: a.operating },
                            { color: "#7C5CFC", label: a.investing },
                            { color: "#3b82f6", label: a.financing },
                        ]} />
                    </ChartCard>
                </div>

                {/* Row 3: Runway & Burn Rate + Cost Structure */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* E) Runway & burn rate */}
                    <ChartCard title={a.runwayBurnRate} accentColor="#3b82f6">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={runwayBurnData}>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="month" {...axisProps} />
                                    <YAxis yAxisId="left" {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <YAxis yAxisId="right" orientation="right" {...yAxisProps} tickFormatter={(v) => `${v}`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar yAxisId="left" dataKey="burnRate" name={a.burnRate} fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
                                    <Line yAxisId="right" type="monotone" dataKey="runway" name={a.runwayLine} stroke="#7C5CFC" strokeWidth={2.5} dot={{ fill: "#7C5CFC", r: 3 }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#3b82f6", label: a.burnRate },
                            { color: "#7C5CFC", label: a.runwayLine, shape: "line" },
                        ]} />
                    </ChartCard>

                    {/* F) Nákladová struktura */}
                    <ChartCard title={a.costStructure} accentColor="#432EB5">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={costStructureData}
                                    layout="vertical"
                                    margin={{ left: 10, right: 20 }}
                                >
                                    <CartesianGrid {...gridProps} horizontal={false} />
                                    <XAxis type="number" {...axisProps} tickFormatter={(v) => `${v}K`} />
                                    <YAxis
                                        type="category"
                                        dataKey={language === "cs" ? "category" : "categoryEn"}
                                        {...yAxisProps}
                                        width={80}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar
                                        dataKey="value"
                                        name={a.costs}
                                        fill="#7C5CFC"
                                        radius={[0, 6, 6, 0]}
                                        barSize={18}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>
                </div>

                {/* Row 4: Revenue Breakdown + Funnel */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* G) Revenue breakdown */}
                    <ChartCard title={a.revenueBreakdown} accentColor="#10b981">
                        <div className="h-[220px] md:h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={revenueBreakdownData}
                                    layout="vertical"
                                    margin={{ left: 10, right: 20 }}
                                >
                                    <CartesianGrid {...gridProps} horizontal={false} />
                                    <XAxis type="number" {...axisProps} tickFormatter={(v) => `${v}K`} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        {...yAxisProps}
                                        width={85}
                                        tick={{ fill: "#6b7280", fontSize: 11 }}
                                    />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Bar
                                        dataKey="value"
                                        name={a.revenue}
                                        fill="#10b981"
                                        radius={[0, 6, 6, 0]}
                                        barSize={16}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ChartCard>

                    {/* H) Conversion Funnel */}
                    <ChartCard title={a.retentionFunnel} accentColor="#9F84FD">
                        <div className="space-y-5">
                            {funnelData.map((item, idx) => {
                                const maxValue = funnelData[0].value
                                const widthPercent = (item.value / maxValue) * 100
                                return (
                                    <div key={idx}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-400">
                                                {language === "cs" ? item.stageCs : item.stageEn}
                                            </span>
                                            <span className="text-sm font-bold text-white">
                                                {item.value.toLocaleString("cs-CZ")}
                                            </span>
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
                                                    {((funnelData[idx + 1].value / item.value) * 100).toFixed(1)}% {a.conversion}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </ChartCard>
                </div>

                {/* Row 5: Forecast (full-width) */}
                <div className="grid grid-cols-1 gap-6">
                    <ChartCard title={a.forecast} accentColor="#5E43D8">
                        <div className="h-[220px] md:h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={forecastData}>
                                    <defs>
                                        <linearGradient id="gradFcActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradFcForecast" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#7C5CFC" stopOpacity={0.1} />
                                            <stop offset="100%" stopColor="#7C5CFC" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradFcCashActual" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="gradFcCashForecast" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.1} />
                                            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid {...gridProps} />
                                    <XAxis dataKey="month" {...axisProps} />
                                    <YAxis {...yAxisProps} tickFormatter={(v) => `${v}K`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(124, 92, 252, 0.06)" }} wrapperStyle={{ background: "none", border: "none", boxShadow: "none" }} />
                                    <Area type="monotone" dataKey="actual" name={`${a.revenue} (${a.actual})`} stroke="#7C5CFC" strokeWidth={2} fill="url(#gradFcActual)" connectNulls={false} />
                                    <Area type="monotone" dataKey="forecast" name={`${a.revenue} (${a.forecasted})`} stroke="#7C5CFC" strokeWidth={2} strokeDasharray="6 4" fill="url(#gradFcForecast)" connectNulls={false} />
                                    <Area type="monotone" dataKey="cashActual" name={`Cash Flow (${a.actual})`} stroke="#10b981" strokeWidth={2} fill="url(#gradFcCashActual)" connectNulls={false} />
                                    <Area type="monotone" dataKey="cashForecast" name={`Cash Flow (${a.forecasted})`} stroke="#10b981" strokeWidth={2} strokeDasharray="6 4" fill="url(#gradFcCashForecast)" connectNulls={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <ChartLegend items={[
                            { color: "#7C5CFC", label: a.revenue, shape: "line" },
                            { color: "#10b981", label: "Cash Flow", shape: "line" },
                        ]} />
                    </ChartCard>
                </div>

            </div>
        </div>
    )
}
