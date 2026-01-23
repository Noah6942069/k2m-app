"use client"

import { DashboardStats } from "@/types/dashboard"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"

interface ComparisonChartProps {
    statsA: DashboardStats | null
    statsB: DashboardStats | null
}

export function ComparisonChart({ statsA, statsB }: ComparisonChartProps) {
    if (!statsA || !statsB) return null

    // Prepare data for overlay
    // We will normalize to "Day 1, Day 2..." index to compare different months side-by-side
    const dataA = statsA.smart_analysis?.sales_over_time || []
    const dataB = statsB.smart_analysis?.sales_over_time || []

    const maxLength = Math.max(dataA.length, dataB.length)
    const combinedData = Array.from({ length: maxLength }).map((_, idx) => {
        const ptA = dataA[idx]
        const ptB = dataB[idx]
        return {
            index: idx + 1,
            name: `Day ${idx + 1}`,
            valueA: ptA?.value || 0,
            dateA: ptA?.date,
            valueB: ptB?.value || 0,
            dateB: ptB?.date,
        }
    })

    return (
        <div className="p-6 rounded-xl bg-card border border-border h-[400px]">
            <h3 className="text-lg font-semibold text-foreground mb-6">Growth Trend Overlay</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={combinedData}>
                    <defs>
                        <linearGradient id="gradientA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="gradientB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                        contentStyle={{ backgroundColor: "var(--card)", borderColor: "var(--border)", borderRadius: "8px" }}
                        itemStyle={{ color: "var(--foreground)" }}
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                const data = payload[0].payload
                                return `${data.dateA || 'N/A'} vs ${data.dateB || 'N/A'}`
                            }
                            return label
                        }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <Area
                        name="Baseline (A)"
                        type="monotone"
                        dataKey="valueA"
                        stroke="var(--primary)"
                        fill="url(#gradientA)"
                        strokeWidth={2}
                    />
                    <Area
                        name="Comparison (B)"
                        type="monotone"
                        dataKey="valueB"
                        stroke="#8b5cf6"
                        fill="url(#gradientB)"
                        strokeWidth={2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
