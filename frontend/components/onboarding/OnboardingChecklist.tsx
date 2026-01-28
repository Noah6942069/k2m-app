"use client"

import { useState, useEffect } from "react"
import {
    Upload,
    BarChart3,
    Target,
    Sparkles,
    Check,
    ChevronDown,
    ChevronRight,
    X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

const STEPS_CONFIG = [
    {
        id: "upload",
        icon: Upload,
        title: "Upload your first dataset",
        description: "Import Excel or CSV files to analyze",
        href: "/datasets"
    },
    {
        id: "visualize",
        icon: BarChart3,
        title: "Create a visualization",
        description: "Build charts from your data",
        href: "/visualizations"
    },
    {
        id: "goal",
        icon: Target,
        title: "Set a goal",
        description: "Track progress towards targets",
        href: "/goals"
    },
    {
        id: "insights",
        icon: Sparkles,
        title: "Get AI insights",
        description: "Ask questions about your data",
        href: "/insights"
    }
]

interface OnboardingChecklistProps {
    collapsed?: boolean
    className?: string
}

export function OnboardingChecklist({ collapsed, className }: OnboardingChecklistProps) {
    // Only store completed status and ID in state/localStorage
    const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({})
    const [isExpanded, setIsExpanded] = useState(true)
    const [isDismissed, setIsDismissed] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Load state from localStorage on mount
    useEffect(() => {
        setMounted(true)
        try {
            const savedCompleted = localStorage.getItem("k2m-onboarding-completed")
            const dismissed = localStorage.getItem("k2m-onboarding-dismissed")

            if (savedCompleted) {
                setCompletedSteps(JSON.parse(savedCompleted))
            }
            if (dismissed === "true") {
                setIsDismissed(true)
            }
        } catch (e) {
            console.error("Failed to load onboarding state", e)
        }
    }, [])

    // Check completion status based on app state
    useEffect(() => {
        if (!mounted || isDismissed) return

        const checkCompletion = async () => {
            try {
                // Check if user has datasets
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                const datasets = dsRes.ok ? await dsRes.json() : []

                // Check local storage for goals
                const goals = JSON.parse(localStorage.getItem("k2m-goals") || "[]")

                setCompletedSteps(prev => {
                    const newCompleted = { ...prev }
                    let changed = false

                    // Check 'upload' step
                    if (datasets.length > 0 && !newCompleted["upload"]) {
                        newCompleted["upload"] = true
                        changed = true
                    }

                    // Check 'goal' step
                    if (goals.length > 0 && !newCompleted["goal"]) {
                        newCompleted["goal"] = true
                        changed = true
                    }

                    if (changed) {
                        localStorage.setItem("k2m-onboarding-completed", JSON.stringify(newCompleted))
                        return newCompleted
                    }
                    return prev
                })
            } catch (error) {
                console.error("Failed to check onboarding status", error)
            }
        }

        checkCompletion()
    }, [mounted, isDismissed])

    const totalSteps = STEPS_CONFIG.length
    const completedCount = Object.values(completedSteps).filter(Boolean).length
    const progress = (completedCount / totalSteps) * 100
    const isComplete = completedCount === totalSteps

    const handleDismiss = () => {
        setIsDismissed(true)
        localStorage.setItem("k2m-onboarding-dismissed", "true")
    }

    const markStepComplete = (id: string) => {
        setCompletedSteps(prev => {
            const newState = { ...prev, [id]: true }
            localStorage.setItem("k2m-onboarding-completed", JSON.stringify(newState))
            return newState
        })
    }


    // Don't render if dismissed or all complete
    if (isDismissed || isComplete) return null

    // Don't render if collapsed
    if (collapsed) return null

    return (
        <div className={cn(
            "mx-3 mb-4 rounded-xl border border-border bg-card/50 overflow-hidden animate-enter",
            className
        )}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <svg className="w-8 h-8 -rotate-90">
                            <circle
                                cx="16"
                                cy="16"
                                r="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="text-muted"
                            />
                            <circle
                                cx="16"
                                cy="16"
                                r="12"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeDasharray={`${progress * 0.75} 75`}
                                className="text-primary"
                            />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
                            {completedCount}/{totalSteps}
                        </span>
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Getting Started</p>
                        <p className="text-xs text-muted-foreground">{completedCount} of {totalSteps} complete</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {/* Steps */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                    {STEPS_CONFIG.map((step) => {
                        const Icon = step.icon
                        const isStepComplete = !!completedSteps[step.id]

                        return (
                            <Link
                                key={step.id}
                                href={step.href}
                                onClick={() => markStepComplete(step.id)}
                                className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                                    isStepComplete
                                        ? "bg-primary/5 opacity-60"
                                        : "bg-muted/30 hover:bg-muted/50"
                                )}
                            >
                                <div className={cn(
                                    "w-8 h-8 rounded-lg flex items-center justify-center",
                                    isStepComplete
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted text-muted-foreground"
                                )}>
                                    {isStepComplete ? (
                                        <Check className="w-4 h-4" />
                                    ) : (
                                        <Icon className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={cn(
                                        "text-sm font-medium truncate",
                                        isStepComplete ? "text-muted-foreground line-through" : "text-foreground"
                                    )}>
                                        {step.title}
                                    </p>
                                </div>
                            </Link>
                        )
                    })}

                    {/* Dismiss button */}
                    <button
                        onClick={handleDismiss}
                        className="w-full text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
                    >
                        Dismiss checklist
                    </button>
                </div>
            )}

        </div>
    )
}
