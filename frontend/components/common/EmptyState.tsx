"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Database, Users, Target, Sparkles, Search, LucideIcon } from "lucide-react"
import Link from "next/link"

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    primaryAction?: {
        label: string
        onClick?: () => void
        href?: string
    }
    secondaryAction?: {
        label: string
        onClick?: () => void
        href?: string
    }
    className?: string
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    primaryAction,
    secondaryAction,
    className
}: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center py-16 px-6 animate-enter",
            className
        )}>
            {/* Icon with glow effect */}
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
                <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                    <Icon className="w-10 h-10 text-primary" />
                </div>
            </div>

            {/* Text content */}
            <h3 className="text-xl font-semibold text-foreground mb-2 text-center">
                {title}
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-8">
                {description}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
                {primaryAction && (
                    primaryAction.href ? (
                        <Link href={primaryAction.href}>
                            <Button className="btn-primary-glow bg-primary hover:bg-primary/90 px-6">
                                {primaryAction.label}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            onClick={primaryAction.onClick}
                            className="btn-primary-glow bg-primary hover:bg-primary/90 px-6"
                        >
                            {primaryAction.label}
                        </Button>
                    )
                )}

                {secondaryAction && (
                    secondaryAction.href ? (
                        <Link href={secondaryAction.href}>
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                                {secondaryAction.label} →
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            variant="ghost"
                            onClick={secondaryAction.onClick}
                            className="text-muted-foreground hover:text-foreground"
                        >
                            {secondaryAction.label} →
                        </Button>
                    )
                )}
            </div>
        </div>
    )
}

// Preset empty states for common scenarios
export function EmptyDatasets({ onUpload }: { onUpload?: () => void }) {
    return (
        <EmptyState
            icon={Database}
            title="No datasets yet"
            description="Upload your first Excel or CSV file to unlock AI-powered insights and visualizations."
            primaryAction={{
                label: "Upload Dataset",
                onClick: onUpload
            }}
            secondaryAction={{
                label: "Learn more",
                href: "/help"
            }}
        />
    )
}

export function EmptyClients({ onAdd }: { onAdd?: () => void }) {
    return (
        <EmptyState
            icon={Users}
            title="No clients yet"
            description="Add your first client to start organizing datasets and tracking their analytics."
            primaryAction={{
                label: "Add Client",
                onClick: onAdd
            }}
        />
    )
}

export function EmptyGoals({ onAdd }: { onAdd?: () => void }) {
    return (
        <EmptyState
            icon={Target}
            title="No goals set"
            description="Set goals to track your progress and get AI-powered recommendations."
            primaryAction={{
                label: "Create Goal",
                onClick: onAdd
            }}
        />
    )
}

export function EmptyInsights() {
    return (
        <EmptyState
            icon={Sparkles}
            title="No insights available"
            description="Upload a dataset and ask questions to generate AI-powered insights."
            primaryAction={{
                label: "Upload Data",
                href: "/datasets"
            }}
        />
    )
}

export function EmptySearch({ query }: { query: string }) {
    return (
        <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find anything matching "${query}". Try different keywords or filters.`}
        />
    )
}
