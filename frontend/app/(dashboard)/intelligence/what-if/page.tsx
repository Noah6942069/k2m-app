"use client"

import { GitBranch, TrendingUp, DollarSign, Clock, Target, Megaphone, Package, Settings2, ArrowRight } from "lucide-react"
import { useTranslation } from "@/lib/i18n/language-context"

// Impact projection data (bar chart)
const impactProjection = [
    { scenario: "Marketing", baseline: 45, projected: 63 },
    { scenario: "Products", baseline: 52, projected: 64 },
    { scenario: "Operations", baseline: 38, projected: 53 },
]

export default function WhatIfPage() {
    const { t } = useTranslation()

    // Scenario cards with translations
    const scenarios = [
        {
            id: 1,
            title: t.whatIf.scenario1Title,
            description: t.whatIf.scenario1Desc,
            result: t.whatIf.scenario1Result,
            icon: Megaphone,
            color: "blue",
            impact: "+€42K",
            confidence: 85
        },
        {
            id: 2,
            title: t.whatIf.scenario2Title,
            description: t.whatIf.scenario2Desc,
            result: t.whatIf.scenario2Result,
            icon: Package,
            color: "violet",
            impact: "+€85K",
            confidence: 72
        },
        {
            id: 3,
            title: t.whatIf.scenario3Title,
            description: t.whatIf.scenario3Desc,
            result: t.whatIf.scenario3Result,
            icon: Settings2,
            color: "emerald",
            impact: "-15%",
            confidence: 91
        },
    ]

    const chartHeight = 120
    const maxValue = 80

    return (
        <div className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{t.whatIf.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        {t.whatIf.subtitle}
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
                    <GitBranch className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-500">3 {t.whatIf.activeScenarios}</span>
                </div>
            </div>

            {/* Main Grid: Chart + Summary */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Impact Projection Chart */}
                <div className="lg:col-span-2 rounded-2xl bg-card border border-border/50 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">{t.whatIf.projectedImpact}</h2>
                            <p className="text-xs text-muted-foreground mt-0.5">{t.whatIf.baselineComparison}</p>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-muted-foreground/30" />
                                <span className="text-muted-foreground">Baseline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-blue-500" />
                                <span className="text-muted-foreground">Projected</span>
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Bar Chart */}
                    <div className="space-y-6">
                        {impactProjection.map((item, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="font-medium text-foreground">{item.scenario}</span>
                                    <span className="text-emerald-500 font-medium">
                                        +{item.projected - item.baseline}%
                                    </span>
                                </div>
                                <div className="relative h-8 bg-muted/30 rounded-lg overflow-hidden">
                                    {/* Baseline bar */}
                                    <div
                                        className="absolute top-1 left-0 h-3 rounded bg-muted-foreground/30 transition-all"
                                        style={{ width: `${(item.baseline / maxValue) * 100}%` }}
                                    />
                                    {/* Projected bar */}
                                    <div
                                        className="absolute bottom-1 left-0 h-3 rounded bg-gradient-to-r from-blue-500 to-violet-500 transition-all"
                                        style={{ width: `${(item.projected / maxValue) * 100}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Scale */}
                    <div className="flex justify-between mt-4 text-[10px] text-muted-foreground">
                        <span>0%</span>
                        <span>20%</span>
                        <span>40%</span>
                        <span>60%</span>
                        <span>80%</span>
                    </div>
                </div>

                {/* Impact Summary */}
                <div className="rounded-2xl bg-card border border-border/50 p-6">
                    <h2 className="text-base font-semibold text-foreground mb-4">{t.whatIf.impactSummary}</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium text-foreground">{t.whatIf.revenueChange}</span>
                            </div>
                            <span className="text-lg font-bold text-emerald-500">+€127K</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-violet-500/10">
                            <div className="flex items-center gap-3">
                                <DollarSign className="w-4 h-4 text-violet-500" />
                                <span className="text-sm font-medium text-foreground">{t.whatIf.costSavings}</span>
                            </div>
                            <span className="text-lg font-bold text-violet-500">€23K</span>
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-500/10">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-medium text-foreground">{t.whatIf.timeToImpact}</span>
                            </div>
                            <span className="text-lg font-bold text-blue-500">3-6 {t.whatIf.months}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-border/50">
                        <p className="text-xs text-muted-foreground">Combined Potential Impact</p>
                        <div className="flex items-baseline gap-2 mt-1">
                            <p className="text-2xl font-bold text-foreground">+€150K</p>
                            <span className="text-xs text-emerald-500 font-medium">annual projection</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scenario Cards */}
            <div className="space-y-4">
                <h2 className="text-base font-semibold text-foreground">{t.whatIf.scenarioDetails}</h2>

                <div className="grid gap-4">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon
                        const colorClasses = {
                            blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
                            violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
                            emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
                        }
                        const textColor = {
                            blue: "text-blue-500",
                            violet: "text-violet-500",
                            emerald: "text-emerald-500",
                        }
                        const barColor = {
                            blue: "bg-blue-500",
                            violet: "bg-violet-500",
                            emerald: "bg-emerald-500",
                        }

                        return (
                            <div
                                key={scenario.id}
                                className="rounded-2xl bg-card border border-border/50 p-5 hover:border-border transition-colors"
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${colorClasses[scenario.color as keyof typeof colorClasses]}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-foreground">{scenario.title}</h3>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${colorClasses[scenario.color as keyof typeof colorClasses]}`}>
                                                        {scenario.confidence}% confidence
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    <span className="font-medium text-foreground">{t.whatIf.ifYou}:</span> {scenario.description}
                                                </p>
                                            </div>

                                            {/* Impact */}
                                            <div className="shrink-0 text-right">
                                                <p className="text-xs text-muted-foreground">Impact</p>
                                                <p className={`text-lg font-bold ${textColor[scenario.color as keyof typeof textColor]}`}>
                                                    {scenario.impact}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Confidence bar */}
                                        <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${barColor[scenario.color as keyof typeof barColor]} transition-all`}
                                                style={{ width: `${scenario.confidence}%` }}
                                            />
                                        </div>

                                        {/* Result */}
                                        <div className="mt-3 flex items-center gap-2 text-sm">
                                            <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                                            <span className="text-muted-foreground">
                                                <span className="font-medium text-foreground">{t.whatIf.thenExpect}:</span> {scenario.result}
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
