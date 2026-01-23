"use client"

import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Target, TrendingUp, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface Goal {
    id: string
    title: string
    metric: "revenue" | "transactions" | "avg_order"
    targetValue: number
    createdAt: number
}

interface GoalCardProps {
    goal: Goal
    currentValue: number
    onDelete: (id: string) => void
}

export function GoalCard({ goal, currentValue, onDelete }: GoalCardProps) {
    // Calculate progress
    // Cap at 100 for visual bar, but keep real % for display
    const percentage = Math.min(100, Math.max(0, (currentValue / goal.targetValue) * 100))
    const isCompleted = currentValue >= goal.targetValue

    const formatValue = (val: number) => {
        if (goal.metric === "revenue" || goal.metric === "avg_order") {
            return `$${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
        }
        return val.toLocaleString()
    }

    return (
        <div className={`relative p-6 rounded-2xl border transition-all duration-500 overflow-hidden ${isCompleted
                ? "bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-lg shadow-green-500/10"
                : "bg-card border-border hover:border-primary/30"
            }`}>
            {/* Background pattern for completed */}
            {isCompleted && (
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <CheckCircle2 className="w-32 h-32 text-green-500 rotate-12" />
                </div>
            )}

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${isCompleted ? "bg-green-500 text-white shadow-lg shadow-green-500/40" : "bg-primary/10 text-primary"
                        }`}>
                        <Target className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground text-lg">{goal.title}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{goal.metric.replace('_', ' ')} Goal</p>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(goal.id)}
                    className="text-muted-foreground hover:text-red-500 -mt-1 -mr-2"
                >
                    <X className="w-4 h-4" />
                </Button>
            </div>

            <div className="space-y-4 relative z-10">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-3xl font-bold text-foreground tracking-tight">
                            {formatValue(currentValue)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Current Value
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-semibold text-muted-foreground mb-1">Target</p>
                        <p className="font-medium text-foreground">{formatValue(goal.targetValue)}</p>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className={isCompleted ? "text-green-500" : "text-primary"}>
                            {percentage.toFixed(1)}% Completed
                        </span>
                    </div>
                    <Progress
                        value={percentage}
                        className={`h-3 ${isCompleted ? "bg-green-950/20" : "bg-muted"}`}
                    // We need to customize the indicator color. 
                    // Assuming the shadcn Progress component uses a standard class or we can override.
                    />
                </div>

                {isCompleted ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-500 pt-2 animate-in slide-in-from-bottom-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Target Achieved! Great job.
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {formatValue(goal.targetValue - currentValue)} to go
                    </div>
                )}
            </div>
        </div>
    )
}
