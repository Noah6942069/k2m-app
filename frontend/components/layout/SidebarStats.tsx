"use client"

import { useEffect, useState } from "react"
import { TrendingUp, Users, Calendar, ArrowUpRight } from "lucide-react"

export function SidebarStats({ collapsed }: { collapsed: boolean }) {
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch datasets to get the latest one
                const dsRes = await fetch("http://localhost:8000/datasets/")
                if (dsRes.ok) {
                    const datasets = await dsRes.json()
                    if (datasets.length > 0) {
                        const latest = datasets[datasets.length - 1]

                        // Fetch stats for latest dataset
                        const statsRes = await fetch(`http://localhost:8000/analytics/${latest.id}/stats`)
                        if (statsRes.ok) {
                            const data = await statsRes.json()
                            setStats(data)
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load sidebar stats", error)
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [])

    if (collapsed || loading || !stats) return null

    const totalRevenue = stats?.smart_analysis?.total_sales || 0
    const bestMonth = stats?.smart_analysis?.best_month || "N/A"
    const activeUsers = stats.total_rows || 0

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fast Facts</span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-medium border border-indigo-500/20">
                    <TrendingUp className="w-3 h-3" />
                    <span>Live</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {/* Revenue Card */}
                <div className="col-span-2 p-3 rounded-xl bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent border border-indigo-500/20">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs text-muted-foreground">Est. Revenue</span>
                    </div>
                    <div className="flex items-end justify-between">
                        <span className="text-xl font-bold text-foreground">
                            ${(totalRevenue / 1000).toFixed(1)}k
                        </span>
                        <span className="text-[10px] text-indigo-400 mb-1">+12.5%</span>
                    </div>
                </div>

                {/* Rows Card */}
                <div className="p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Entries</span>
                    </div>
                    <span className="text-lg font-bold text-foreground">{activeUsers}</span>
                </div>

                {/* Month Card */}
                <div className="p-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-colors">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">Top Month</span>
                    </div>
                    <span className="text-lg font-bold text-foreground truncate">{bestMonth.substring(0, 3)}</span>
                </div>
            </div>
        </div>
    )
}
