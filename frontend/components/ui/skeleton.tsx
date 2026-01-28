"use client"

import { cn } from "@/lib/utils"
import { CSSProperties } from "react"

interface SkeletonProps {
    className?: string
    style?: CSSProperties
}

// Base skeleton with shimmer effect
export function Skeleton({ className, style }: SkeletonProps) {
    return (
        <div
            className={cn(
                "skeleton bg-muted",
                className
            )}
            style={style}
        />
    )
}

// Skeleton for stat cards (KPI cards)
export function SkeletonCard({ className }: SkeletonProps) {
    return (
        <div className={cn(
            "rounded-2xl border border-border bg-card p-6 space-y-4",
            className
        )}>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-3 w-20" />
        </div>
    )
}

// Skeleton for chart areas
export function SkeletonChart({ className }: SkeletonProps) {
    return (
        <div className={cn(
            "rounded-2xl border border-border bg-card p-6 space-y-4",
            className
        )}>
            <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
            <div className="h-[250px] flex items-end gap-2 pt-8">
                {/* Bar chart skeleton */}
                {[40, 65, 45, 80, 55, 70, 50, 75, 60, 85, 45, 70].map((height, i) => (
                    <Skeleton
                        key={i}
                        className="flex-1 rounded-t-md"
                        style={{ height: `${height}%` }}
                    />
                ))}
            </div>
        </div>
    )
}

// Skeleton for list items
export function SkeletonListItem({ className }: SkeletonProps) {
    return (
        <div className={cn(
            "flex items-center gap-4 p-4 border-b border-border last:border-0",
            className
        )}>
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
        </div>
    )
}

// Skeleton for client/dataset cards
export function SkeletonDataCard({ className }: SkeletonProps) {
    return (
        <div className={cn(
            "rounded-2xl border border-border bg-card p-6 space-y-4",
            className
        )}>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-12" />
                </div>
                <div className="space-y-1">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-12" />
                </div>
            </div>
        </div>
    )
}

// Skeleton for text content
export function SkeletonText({
    lines = 3,
    className
}: SkeletonProps & { lines?: number }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <Skeleton
                    key={i}
                    className={cn(
                        "h-4",
                        i === lines - 1 ? "w-2/3" : "w-full"
                    )}
                />
            ))}
        </div>
    )
}

// Skeleton for avatar
export function SkeletonAvatar({
    size = "md",
    className
}: SkeletonProps & { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-14 w-14"
    }

    return (
        <Skeleton
            className={cn(
                "rounded-full",
                sizeClasses[size],
                className
            )}
        />
    )
}

// Dashboard skeleton - full page loading state
export function SkeletonDashboard() {
    return (
        <div className="space-y-6 animate-enter">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonChart />
                <SkeletonChart />
            </div>

            {/* Recent Items */}
            <div className="rounded-2xl border border-border bg-card">
                <div className="p-4 border-b border-border">
                    <Skeleton className="h-5 w-32" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonListItem key={i} />
                ))}
            </div>
        </div>
    )
}

// Clients/Datasets grid skeleton
export function SkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-grid">
            {Array.from({ length: count }).map((_, i) => (
                <SkeletonDataCard key={i} />
            ))}
        </div>
    )
}
