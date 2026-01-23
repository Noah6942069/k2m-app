"use client"

import { useState, useEffect } from "react"
import { Dataset, DashboardStats } from "@/types/dashboard"
import { ComparisonSelector } from "@/components/comparison/ComparisonSelector"
import { DiffStats } from "@/components/comparison/DiffStats"
import { ComparisonChart } from "@/components/comparison/ComparisonChart"
import { Loader2, ArrowRight } from "lucide-react"

export default function ComparePage() {
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const [loading, setLoading] = useState(true)

    const [selectedIdA, setSelectedIdA] = useState<string | null>(null)
    const [selectedIdB, setSelectedIdB] = useState<string | null>(null)

    const [statsA, setStatsA] = useState<DashboardStats | null>(null)
    const [statsB, setStatsB] = useState<DashboardStats | null>(null)

    const [loadingStats, setLoadingStats] = useState(false)

    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")

    // Load initial list of datasets
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (res.ok) {
                    const data = await res.json()
                    setDatasets(data)
                    // Auto-select last 2 if available for convenience
                    if (data.length >= 2) {
                        setSelectedIdA(String(data[data.length - 2].id))
                        setSelectedIdB(String(data[data.length - 1].id))
                    }
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchDatasets()
    }, [])

    // Fetch stats when selection changes
    useEffect(() => {
        const fetchComparisonData = async () => {
            if (!selectedIdA && !selectedIdB) return

            setLoadingStats(true)
            try {
                // Fetch A
                if (selectedIdA) {
                    const resA = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${selectedIdA}/stats`)
                    if (resA.ok) setStatsA(await resA.json())
                } else {
                    setStatsA(null)
                }

                // Fetch B
                if (selectedIdB) {
                    const resB = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${selectedIdB}/stats`)
                    if (resB.ok) setStatsB(await resB.json())
                } else {
                    setStatsB(null)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoadingStats(false)
            }
        }

        fetchComparisonData()
    }, [selectedIdA, selectedIdB])

    // Filter Logic
    const getFilteredStats = (originalStats: DashboardStats | null) => {
        if (!originalStats || !originalStats.smart_analysis?.sales_over_time) return originalStats

        // If no filter, return original
        if (!startDate && !endDate) return originalStats

        const filteredSales = originalStats.smart_analysis.sales_over_time.filter((item: any) => {
            const itemDate = new Date(item.date)
            const start = startDate ? new Date(startDate) : new Date("1970-01-01")
            const end = endDate ? new Date(endDate) : new Date("2100-01-01")
            return itemDate >= start && itemDate <= end
        })

        // Recalculate total sales based on filtered range
        const newTotal = filteredSales.reduce((acc: number, curr: any) => acc + curr.value, 0)

        return {
            ...originalStats,
            smart_analysis: {
                ...originalStats.smart_analysis,
                sales_over_time: filteredSales,
                total_sales: newTotal
            }
        }
    }

    const filteredStatsA = getFilteredStats(statsA)
    const filteredStatsB = getFilteredStats(statsB)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dataset Comparison</h1>
                    <p className="text-muted-foreground mt-2">
                        Analyze performance differences between two distinct datasets.
                    </p>
                </div>

                {/* Date Filter */}
                <div className="flex items-center gap-2 p-1 rounded-xl bg-card border border-border">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3 py-2 bg-transparent text-sm border-r border-border focus:outline-none text-foreground"
                    />
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="px-3 py-2 bg-transparent text-sm focus:outline-none text-foreground"
                    />
                </div>
            </div>

            {/* Selector */}
            {loading ? (
                <div className="h-24 flex items-center justify-center border border-border rounded-xl bg-card">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
            ) : (
                <ComparisonSelector
                    datasets={datasets}
                    selectedIdA={selectedIdA}
                    selectedIdB={selectedIdB}
                    onSelectA={setSelectedIdA}
                    onSelectB={setSelectedIdB}
                />
            )}

            {/* Content */}
            {loadingStats ? (
                <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Running comparison analysis...</p>
                </div>
            ) : (filteredStatsA && filteredStatsB) ? (
                <div className="space-y-8">
                    <DiffStats statsA={filteredStatsA} statsB={filteredStatsB} />
                    <ComparisonChart statsA={filteredStatsA} statsB={filteredStatsB} />

                    {/* Insights Box */}
                    <div className="p-6 rounded-xl bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/20">
                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            AI Summary
                        </h3>
                        <p className="text-sm text-foreground/80 leading-relaxed">
                            Comparing <strong>{filteredStatsA.filename}</strong> to <strong>{filteredStatsB.filename}</strong>
                            {startDate && endDate && ` (from ${startDate} to ${endDate}) `}
                            shows a
                            <span className="font-bold"> {filteredStatsB.smart_analysis?.total_sales !== undefined && filteredStatsA.smart_analysis?.total_sales
                                ? (((filteredStatsB.smart_analysis.total_sales - filteredStatsA.smart_analysis.total_sales) / filteredStatsA.smart_analysis.total_sales) * 100).toFixed(1)
                                : 0}%
                            </span> change in revenue.
                            The trend suggests {(filteredStatsB.smart_analysis?.total_sales || 0) > (filteredStatsA.smart_analysis?.total_sales || 0) ? "positive growth" : "a decline"} in overall volume.
                        </p>
                    </div>
                </div>
            ) : (
                <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border rounded-xl">
                    <p>Select two datasets above to begin comparison.</p>
                </div>
            )}
        </div>
    )
}
