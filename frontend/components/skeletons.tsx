import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="flex-1 min-h-screen relative overflow-hidden">
            {/* Background mimic */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

            <div className="relative p-6 md:p-10 lg:p-14 max-w-[1800px] mx-auto">
                {/* Header Skeleton */}
                <div className="flex items-start justify-between mb-10">
                    <div className="space-y-3">
                        <Skeleton className="h-6 w-32 rounded-full" />
                        <Skeleton className="h-10 w-64 rounded-lg" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <Skeleton className="hidden md:block h-10 w-32 rounded-xl" />
                </div>

                {/* Main Grid Layout */}
                <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Orb Skeleton */}
                        <div className="flex flex-col items-center py-10">
                            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full" />
                            <div className="mt-5 text-center space-y-2">
                                <Skeleton className="h-6 w-48 mx-auto" />
                                <Skeleton className="h-4 w-32 mx-auto" />
                            </div>
                        </div>

                        {/* KPI Cards Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="w-4 h-4 rounded" />
                                        <Skeleton className="w-16 h-3" />
                                    </div>
                                    <Skeleton className="w-24 h-8" />
                                    <Skeleton className="w-12 h-3" />
                                </div>
                            ))}
                        </div>

                        {/* Signals Skeleton */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Skeleton className="w-32 h-5" />
                                <Skeleton className="w-8 h-5 rounded-full" />
                            </div>
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-4 rounded-xl border border-border/50 p-4">
                                    <Skeleton className="w-9 h-9 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-48 h-4" />
                                        <Skeleton className="w-32 h-3" />
                                    </div>
                                    <Skeleton className="w-12 h-3" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Goal Skeleton */}
                        <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                            <Skeleton className="w-full h-10" />
                            <Skeleton className="w-20 h-4" />
                        </div>

                        {/* AI Insight Skeleton */}
                        <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 space-y-3">
                            <div className="flex items-center gap-2">
                                <Skeleton className="w-4 h-4" />
                                <Skeleton className="w-24 h-4" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="w-full h-3" />
                                <Skeleton className="w-full h-3" />
                                <Skeleton className="w-2/3 h-3" />
                            </div>
                        </div>

                        {/* Recent Activity Skeleton */}
                        <div className="rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
                            <Skeleton className="w-32 h-5 mb-2" />
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <Skeleton className="w-7 h-7 rounded-lg" />
                                    <div className="flex-1 space-y-2">
                                        <Skeleton className="w-32 h-3" />
                                        <Skeleton className="w-24 h-3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
