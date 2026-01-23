"use client"

import { DashboardStats, SmartAnalysis } from "@/types/dashboard"
import { ArrowUp, ArrowDown, Minus, DollarSign, Activity, ShoppingCart, Calendar } from "lucide-react"

interface DiffStatsProps {
    statsA: DashboardStats | null
    statsB: DashboardStats | null
}

export function DiffStats({ statsA, statsB }: DiffStatsProps) {
    if (!statsA || !statsB) return null

    // Helper to safely extract values
    const getRevenue = (s: DashboardStats) => s.smart_analysis?.total_sales || 0
    const getTxns = (s: DashboardStats) => s.smart_analysis?.sales_over_time?.length || s.total_rows || 0
    const getAvg = (s: DashboardStats) => s.smart_analysis?.average_sales || 0
    const getBestMonth = (s: DashboardStats) => s.smart_analysis?.best_month || "N/A"

    const metrics = [
        {
            label: "Total Revenue",
            valA: getRevenue(statsA),
            valB: getRevenue(statsB),
            icon: DollarSign,
            format: (v: number) => `$${v.toLocaleString()}`
        },
        {
            label: "Total Transactions",
            valA: getTxns(statsA),
            valB: getTxns(statsB),
            icon: ShoppingCart,
            format: (v: number) => v.toLocaleString()
        },
        {
            label: "Avg. Order Value",
            valA: getAvg(statsA),
            valB: getAvg(statsB),
            icon: Activity,
            format: (v: number) => `$${v.toFixed(2)}`
        },
        // For best month we can't do numeric diff easily, so skip or treat differently
    ]

    const calculateChange = (a: number, b: number) => {
        if (a === 0) return b === 0 ? 0 : 100
        return ((b - a) / a) * 100
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.map((m, idx) => {
                const change = calculateChange(m.valA as number, m.valB as number)
                const isPositive = change > 0
                const isNeutral = change === 0

                return (
                    <div key={idx} className="p-5 rounded-xl bg-card border border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                <m.icon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-muted-foreground">{m.label}</span>
                        </div>

                        <div className="flex items-end justify-between">
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">Baseline</p>
                                <p className="text-lg font-semibold text-foreground/70">{m.format(m.valA as number)}</p>
                            </div>

                            <div className={`px-2 py-1 mb-1 rounded flex items-center gap-1 text-xs font-bold ${isPositive ? "bg-green-500/10 text-green-500" :
                                    isNeutral ? "bg-gray-500/10 text-gray-500" :
                                        "bg-red-500/10 text-red-500"
                                }`}>
                                {isPositive ? <ArrowUp className="w-3 h-3" /> : isNeutral ? <Minus className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                {Math.abs(change).toFixed(1)}%
                            </div>

                            <div className="space-y-1 text-right">
                                <p className="text-xs text-violet-400">Comparison</p>
                                <p className="text-2xl font-bold text-foreground">{m.format(m.valB as number)}</p>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
