"use client"

import { AlertTriangle, TrendingDown, ArrowRight, ShieldAlert, DollarSign, Users, Package } from "lucide-react"
import { useTranslation } from "@/lib/i18n/language-context"

// Risk probability over time (line chart data)
const probabilityTrend = [
    { month: "Jun", value: 45 },
    { month: "Jul", value: 52 },
    { month: "Aug", value: 48 },
    { month: "Sep", value: 61 },
    { month: "Oct", value: 58 },
    { month: "Nov", value: 72 },
]

export default function RisksPage() {
    const { t } = useTranslation()
    const maxValue = 100
    const chartHeight = 160

    // Risk scenarios with what could happen (using translations)
    const riskScenarios = [
        {
            id: 1,
            category: t.risks.financial,
            title: t.risks.revenueDecline,
            probability: 72,
            impact: "High",
            description: t.risks.revenueDeclineDesc,
            consequence: t.risks.revenueDeclineConseq,
            icon: DollarSign,
            color: "red"
        },
        {
            id: 2,
            category: t.risks.operational,
            title: t.risks.supplyChain,
            probability: 58,
            impact: "Medium",
            description: t.risks.supplyChainDesc,
            consequence: t.risks.supplyChainConseq,
            icon: Package,
            color: "amber"
        },
        {
            id: 3,
            category: t.risks.customer,
            title: t.risks.churnRate,
            probability: 45,
            impact: "Medium",
            description: t.risks.churnRateDesc,
            consequence: t.risks.churnRateConseq,
            icon: Users,
            color: "amber"
        },
    ]

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t.risks.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t.risks.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">3 {t.risks.activeRisks}</span>
                </div>
            </div>

            {/* Main Grid: Chart + Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Risk Probability Trend Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">{t.risks.riskProbabilityTrend}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.risks.averageProbability}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-foreground">72%</p>
                            <p className="text-xs text-red-500 flex items-center justify-end gap-1">
                                <TrendingDown className="w-3 h-3 rotate-180" />
                                +14% {t.risks.fromLastMonth}
                            </p>
                        </div>
                    </div>

                    {/* Line Chart */}
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
                                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="rgb(239 68 68)" stopOpacity="0.3" />
                                    <stop offset="100%" stopColor="rgb(239 68 68)" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* Area */}
                            <path
                                d={`M 0 ${chartHeight - (probabilityTrend[0].value / maxValue) * chartHeight} 
                                    ${probabilityTrend.map((d, i) =>
                                    `L ${(i / (probabilityTrend.length - 1)) * 500} ${chartHeight - (d.value / maxValue) * chartHeight}`
                                ).join(' ')}
                                    L 500 ${chartHeight} L 0 ${chartHeight} Z`}
                                fill="url(#riskGradient)"
                            />

                            {/* Line */}
                            <path
                                d={`M 0 ${chartHeight - (probabilityTrend[0].value / maxValue) * chartHeight} 
                                    ${probabilityTrend.map((d, i) =>
                                    `L ${(i / (probabilityTrend.length - 1)) * 500} ${chartHeight - (d.value / maxValue) * chartHeight}`
                                ).join(' ')}`}
                                fill="none"
                                stroke="rgb(239 68 68)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            {/* Data points */}
                            {probabilityTrend.map((d, i) => (
                                <circle
                                    key={i}
                                    cx={(i / (probabilityTrend.length - 1)) * 500}
                                    cy={chartHeight - (d.value / maxValue) * chartHeight}
                                    r="4"
                                    fill="rgb(239 68 68)"
                                    stroke="white"
                                    strokeWidth="2"
                                />
                            ))}
                        </svg>

                        {/* X-axis labels */}
                        <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-muted-foreground translate-y-5">
                            {probabilityTrend.map((d) => (
                                <span key={d.month}>{d.month}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Risk Summary */}
                <div className="rounded-2xl bg-card border border-border/50 p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">{t.risks.riskSummary}</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <span className="text-sm font-medium text-foreground">{t.risks.highImpact}</span>
                            </div>
                            <span className="text-lg font-bold text-red-500">1</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-amber-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500" />
                                <span className="text-sm font-medium text-foreground">{t.risks.mediumImpact}</span>
                            </div>
                            <span className="text-lg font-bold text-amber-500">2</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                                <span className="text-sm font-medium text-foreground">{t.risks.lowImpact}</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-500">0</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">{t.risks.totalExposure}</p>
                        <p className="text-2xl font-bold text-foreground mt-1">€105,000</p>
                    </div>
                </div>
            </div>

            {/* Risk Scenarios */}
            <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">{t.risks.whatCouldHappen}</h2>

                <div className="grid gap-4">
                    {riskScenarios.map((risk) => {
                        const Icon = risk.icon
                        const colorClasses = {
                            red: "bg-red-500/10 text-red-500 border-red-500/20",
                            amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                        }
                        const barColor = risk.color === "red" ? "bg-red-500" : "bg-amber-500"

                        return (
                            <div
                                key={risk.id}
                                className="rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-colors"
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[risk.color as keyof typeof colorClasses]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-foreground">{risk.title}</h3>
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                        {risk.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">{risk.description}</p>
                                            </div>

                                            {/* Probability */}
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-muted-foreground">{t.risks.probability}</p>
                                                <p className={`text-lg font-bold ${risk.color === 'red' ? 'text-red-500' : 'text-amber-500'}`}>
                                                    {risk.probability}%
                                                </p>
                                            </div>
                                        </div>

                                        {/* Probability bar */}
                                        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${barColor} transition-all`}
                                                style={{ width: `${risk.probability}%` }}
                                            />
                                        </div>

                                        {/* Consequence */}
                                        <div className="mt-3 flex items-center gap-2 text-sm">
                                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <span className="text-muted-foreground">
                                                <span className="font-medium text-foreground">{t.risks.ifItHappens}</span> {risk.consequence}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
