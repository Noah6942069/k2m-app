"use client"

import { TrendingUp, BarChart3, DollarSign, Zap, Users, Activity } from "lucide-react"
import { useTranslation } from "@/lib/i18n/language-context"

// Performance trend data (area chart)
const performanceTrend = [
    { month: "Jun", value: 68 },
    { month: "Jul", value: 72 },
    { month: "Aug", value: 75 },
    { month: "Sep", value: 71 },
    { month: "Oct", value: 82 },
    { month: "Nov", value: 87 },
]

export default function AnalysisPage() {
    const { t } = useTranslation()
    const maxValue = 100
    const chartHeight = 160

    // Key insights data
    const insights = [
        {
            id: 1,
            title: t.analysis.revenue,
            description: t.analysis.revenueDesc,
            change: "+12%",
            positive: true,
            icon: DollarSign,
            color: "emerald"
        },
        {
            id: 2,
            title: t.analysis.efficiency,
            description: t.analysis.efficiencyDesc,
            change: "+8%",
            positive: true,
            icon: Zap,
            color: "violet"
        },
        {
            id: 3,
            title: t.analysis.customers,
            description: t.analysis.customersDesc,
            change: "+340",
            positive: true,
            icon: Users,
            color: "blue"
        },
    ]

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t.analysis.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t.analysis.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm font-medium text-emerald-500">87% {t.analysis.performanceScore}</span>
                </div>
            </div>

            {/* Main Grid: Chart + Key Stats */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Performance Trend Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">{t.analysis.performanceTrend}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.analysis.monthlyAverage}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">87%</p>
                            <p className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                                <TrendingUp className="w-3 h-3" />
                                +5% {t.analysis.vsLastPeriod}
                            </p>
                        </div>
                    </div>

                    {/* Area Chart */}
                    <div className="relative h-40">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[100, 75, 50, 25, 0].map((val) => (
                                <div key={val} className="flex items-center gap-2">
                                    <span className="text-[10px] text-muted-foreground w-6 text-right">{val}%</span>
                                    <div className="flex-1 border-t border-border/30" />
                                </div>
                            ))}
                        </div>

                        {/* Chart area */}
                        <svg className="absolute inset-0 ml-8" viewBox="0 0 500 160" preserveAspectRatio="none">
                            {/* Gradient fill */}
                            <defs>
                                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(139 92 246)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="rgb(139 92 246)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area */}
                            <path
                                d={`M 0 ${chartHeight - (performanceTrend[0].value / maxValue) * chartHeight} 
                                    ${performanceTrend.map((d, i) =>
                                    `L ${(i / (performanceTrend.length - 1)) * 500} ${chartHeight - (d.value / maxValue) * chartHeight}`
                                ).join(' ')}
                                    L 500 ${chartHeight} L 0 ${chartHeight} Z`}
                                fill="url(#performanceGradient)"
                            />

                            {/* Line */}
                            <path
                                d={`M 0 ${chartHeight - (performanceTrend[0].value / maxValue) * chartHeight} 
                                    ${performanceTrend.map((d, i) =>
                                    `L ${(i / (performanceTrend.length - 1)) * 500} ${chartHeight - (d.value / maxValue) * chartHeight}`
                                ).join(' ')}`}
                                fill="none"
                                stroke="rgb(139 92 246)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data points */}
                            {performanceTrend.map((d, i) => (
                                <circle
                                    key={i}
                                    cx={(i / (performanceTrend.length - 1)) * 500}
                                    cy={chartHeight - (d.value / maxValue) * chartHeight}
                                    r="4"
                                    fill="rgb(139 92 246)"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            ))}
                        </svg>

                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-muted-foreground translate-y-5">
                            {performanceTrend.map((d) => (
                                <span key={d.month}>{d.month}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Summary */}
                <div className="rounded-2xl bg-card border border-border/50 p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">{t.analysis.keyInsights}</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10">
                            <div className="flex items-center gap-3">
                                <BarChart3 className="w-4 h-4 text-violet-500" />
                                <span className="text-sm font-medium text-foreground">{t.analysis.dataPoints}</span>
                            </div>
                            <span className="text-lg font-bold text-violet-500">12.4K</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10">
                            <div className="flex items-center gap-3">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium text-foreground">{t.analysis.confidenceLevel}</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-500">94%</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-foreground">{t.analysis.lastUpdated}</span>
                            </div>
                            <span className="text-sm font-bold text-blue-500">2 {t.analysis.hoursAgo}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">{t.analysis.performanceScore}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-foreground">87%</p>
                            <span className="text-xs text-emerald-500 font-medium">+5% {t.analysis.vsLastPeriod}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Insights Cards */}
            <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">{t.analysis.keyInsights}</h2>

                <div className="grid md:grid-cols-3 gap-4">
                    {insights.map((insight) => {
                        const Icon = insight.icon
                        const colorClasses = {
                            emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                            violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
                            blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                        }
                        const textColor = {
                            emerald: "text-emerald-500",
                            violet: "text-violet-500",
                            blue: "text-blue-500",
                        }

                        return (
                            <div
                                key={insight.id}
                                className="rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-colors"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[insight.color as keyof typeof colorClasses]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`text-lg font-bold ${textColor[insight.color as keyof typeof textColor]}`}>
                                        {insight.change}
                                    </span>
                                </div>

                                <h3 className="font-semibold text-foreground">{insight.title}</h3>
                                <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>

                                {/* Progress indicator */}
                                <div className="mt-4 h-1.5 rounded-full bg-muted overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all ${insight.color === 'emerald' ? 'bg-emerald-500' : insight.color === 'violet' ? 'bg-violet-500' : 'bg-blue-500'}`}
                                        style={{ width: insight.color === 'emerald' ? '85%' : insight.color === 'violet' ? '78%' : '92%' }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
