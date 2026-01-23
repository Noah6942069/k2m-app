"use client"

import { useState, useEffect } from "react"
import { Goal, GoalCard } from "@/components/goals/GoalCard"
import { CreateGoalDialog } from "@/components/goals/CreateGoalDialog"
import { PageHeaderWithSelector } from "@/components/common/PageHeaderWithSelector"
import { Loader2, Target, Trophy } from "lucide-react"

// Initial empty state, will load from localStorage
const STORAGE_KEY = "k2m-goals-v1"

export default function GoalsPage() {
    const [goals, setGoals] = useState<Goal[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    const [datasets, setDatasets] = useState<any[]>([])
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null)
    const [loadingStats, setLoadingStats] = useState(false)

    // Load Initial Data
    useEffect(() => {
        const init = async () => {
            try {
                // 1. Load Goals
                const saved = localStorage.getItem(STORAGE_KEY)
                if (saved) {
                    setGoals(JSON.parse(saved))
                } else {
                    setGoals([
                        {
                            id: "demo-1",
                            title: "Hit $1M Revenue",
                            metric: "revenue",
                            targetValue: 1000000,
                            createdAt: Date.now()
                        }
                    ])
                }

                // 2. Fetch Datasets
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const data = await dsRes.json()
                    setDatasets(data)
                    if (data.length > 0) {
                        const latestId = String(data[data.length - 1].id)
                        setSelectedDatasetId(latestId)

                        // Load goals for this specific dataset
                        const key = `${STORAGE_KEY}-${latestId}`
                        const saved = localStorage.getItem(key)
                        if (saved) {
                            setGoals(JSON.parse(saved))
                        } else {
                            // Empty default for new dataset
                            setGoals([])
                        }
                    }
                }
            } catch (error) {
                console.error("Init failed", error)
            } finally {
                setLoading(false)
            }
        }
        init()
    }, [])

    // Fetch Stats when selected dataset changes
    useEffect(() => {
        const loadStats = async () => {
            if (!selectedDatasetId) return
            setLoadingStats(true)

            // Load goals for this dataset
            const key = `${STORAGE_KEY}-${selectedDatasetId}`
            const saved = localStorage.getItem(key)
            if (saved) {
                setGoals(JSON.parse(saved))
            } else {
                setGoals([])
            }

            try {
                const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${selectedDatasetId}/stats`)
                if (statsRes.ok) {
                    setStats(await statsRes.json())
                }
            } catch (e) { console.error(e) }
            finally { setLoadingStats(false) }
        }
        loadStats()
    }, [selectedDatasetId])

    const handleCreate = (newGoal: Omit<Goal, "id" | "createdAt">) => {
        if (!selectedDatasetId) {
            alert("Please select a dataset before creating a goal.")
            return
        }
        const goal: Goal = {
            ...newGoal,
            id: Math.random().toString(36).substring(2, 9),
            createdAt: Date.now()
        }
        const updated = [...goals, goal]
        setGoals(updated)

        const key = `${STORAGE_KEY}-${selectedDatasetId}`
        localStorage.setItem(key, JSON.stringify(updated))
    }

    const handleDelete = (id: string) => {
        if (!selectedDatasetId) return
        const updated = goals.filter(g => g.id !== id)
        setGoals(updated)

        const key = `${STORAGE_KEY}-${selectedDatasetId}`
        localStorage.setItem(key, JSON.stringify(updated))
    }

    const getCurrentValue = (metric: string) => {
        if (!stats) return 0
        const sa = stats.smart_analysis || {}
        switch (metric) {
            case "revenue": return sa.total_sales || 0
            case "transactions": return sa.sales_over_time?.length || stats.total_rows || 0
            case "avg_order": return sa.average_sales || 0
            default: return 0
        }
    }

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading specific targets...</p>
                </div>
            </div>
        )
    }

    const completedCount = goals.filter(g => getCurrentValue(g.metric) >= g.targetValue).length

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6">
                <PageHeaderWithSelector
                    title="Goals & Targets"
                    description="Track your progress against key performance indicators based on the selected dataset."
                    datasets={datasets}
                    selectedId={selectedDatasetId}
                    onSelect={setSelectedDatasetId}
                    loading={loadingStats}
                />

                <div className="flex justify-end">
                    <CreateGoalDialog onSave={handleCreate} />
                </div>
            </div>

            {/* Achievement Banner */}
            {completedCount > 0 && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-500/20 flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30">
                        <Trophy className="w-6 h-6 animate-bounce" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">You're crushing it!</h3>
                        <p className="text-sm text-muted-foreground">
                            You've hit <span className="text-green-500 font-bold">{completedCount}</span> of your {goals.length} targets. Keep pushing!
                        </p>
                    </div>
                </div>
            )}

            {/* Grid */}
            {goals.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                        <Target className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">No goals set yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first target to start tracking progress.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {goals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            currentValue={getCurrentValue(goal.metric)}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
