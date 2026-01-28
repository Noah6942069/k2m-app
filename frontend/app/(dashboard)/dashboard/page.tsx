"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/language-context"
import {
    LayoutDashboard,
    PieChart,
    Sparkles,
    TrendingUp,
    ArrowRight,
    MessageSquareText,
    Target,
    Database,
    BarChart3,
    Zap
} from "lucide-react"
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton"

export default function HomePage() {
    const { user, isAdmin } = useAuth()
    const { t } = useTranslation()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isClientMounted, setIsClientMounted] = useState(false)

    useEffect(() => {
        setIsClientMounted(true)
        const loadQuickStats = async () => {
            try {
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const datasets = await dsRes.json()
                    if (datasets.length > 0) {
                        const latest = datasets[datasets.length - 1]
                        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/stats`)
                        if (statsRes.ok) {
                            const data = await statsRes.json()
                            setStats({ ...data, datasetCount: datasets.length })
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load stats", error)
            } finally {
                setLoading(false)
            }
        }
        loadQuickStats()
    }, [])

    const quickLinks = isAdmin ? [
        { label: t.navigation.overview, href: "/overview", icon: LayoutDashboard },
        { label: t.navigation.bi, href: "/bi", icon: PieChart },
        { label: t.navigation.insights, href: "/insights", icon: MessageSquareText },
        { label: t.navigation.data, href: "/datasets", icon: Database },
    ] : [
        { label: t.navigation.overview, href: "/overview", icon: LayoutDashboard },
        { label: t.navigation.bi, href: "/bi", icon: PieChart },
        { label: t.navigation.insights, href: "/insights", icon: MessageSquareText },
        { label: t.navigation.goals, href: "/goals", icon: Target },
    ]

    if (loading) {
        return (
            <div className="space-y-10 pb-20 max-w-6xl mx-auto animate-enter">
                <div className="pt-8 pb-6 border-b border-border/50 space-y-3">
                    <Skeleton className="h-10 w-80" />
                    <Skeleton className="h-5 w-96" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SkeletonCard />
                    <SkeletonCard />
                    <SkeletonCard />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-28 rounded-2xl" />
                    ))}
                </div>
            </div>
        )
    }

    const revenue = stats?.smart_analysis?.total_sales
        ? `$${(stats.smart_analysis.total_sales / 1000).toFixed(0)}K`
        : "$0"

    return (
        <div className="space-y-10 pb-20 max-w-6xl mx-auto">
            {/* Hero Welcome - Bold & Professional */}
            <div className="relative pt-8 pb-6 px-6 border-b border-border/30">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-blue-500/5 rounded-3xl" />
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 relative">
                    {t.home.heroTitle}, <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">{isClientMounted ? (user?.displayName || 'Guest') : ''}</span>
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl relative">
                    {isAdmin
                        ? "Command center ready. Overview of your latest system heuristics."
                        : "Welcome to your personal analytics workspace."
                    }
                </p>
            </div>

            {/* Key Metrics - Gradient Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Revenue Card */}
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-card via-card to-primary/5 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.home.revenue}</p>
                            <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{revenue}</p>
                        <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1">
                            <Zap className="w-3 h-3" /> +12.5% from last month
                        </p>
                    </div>
                </div>

                {/* Datasets Card */}
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-card via-card to-blue-500/5 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.home.datasets}</p>
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Database className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stats?.datasetCount || 0}</p>
                        <p className="text-xs text-muted-foreground mt-2">Active data sources</p>
                    </div>
                </div>

                {/* Categories Card */}
                <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-card via-card to-emerald-500/5 border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{t.home.categories}</p>
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                        </div>
                        <p className="text-3xl font-bold text-foreground">{stats?.smart_analysis?.top_categories?.length || 0}</p>
                        <p className="text-xs text-muted-foreground mt-2">Data categories</p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {quickLinks.map((link, idx) => (
                    <Link key={idx} href={link.href} className="block h-full">
                        <div className="group relative h-full overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/40 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            <div className="mb-4 relative z-10">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:scale-110">
                                    <link.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <h3 className="text-base font-semibold text-foreground mb-1 group-hover:text-primary transition-colors relative z-10">{link.label}</h3>
                            <p className="text-xs text-muted-foreground relative z-10">Access module</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* AI and Insights Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Ask AI CTA */}
                <Link href="/insights" className="group h-full block">
                    <div className="h-full relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-card to-blue-500/10 border border-primary/20 p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                        {/* Animated background glow */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all duration-500" />

                        <div className="flex items-start gap-3 relative z-10">
                            <div className="p-2.5 rounded-lg bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="flex-1 space-y-1">
                                <h2 className="text-base font-semibold text-foreground">{t.home.askAI}</h2>
                                <p className="text-muted-foreground text-sm leading-relaxed">{t.home.descInsights}</p>

                                <div className="pt-2 flex items-center text-primary text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                                    {t.home.open} <ArrowRight className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Latest Insight Preview */}
                <div className="h-full rounded-xl bg-card border border-border p-5 hover:border-primary/30 transition-all duration-300 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-semibold text-foreground">{t.home.latestInsights}</h3>
                        </div>
                        {stats?.smart_analysis?.insights?.length > 0 && (
                            <Link href="/insights">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary transition-colors h-7 text-xs">
                                    {t.home.viewAll}
                                </Button>
                            </Link>
                        )}
                    </div>

                    {stats?.smart_analysis?.insights?.length > 0 ? (
                        <div className="flex-1 bg-gradient-to-br from-muted/50 to-muted/20 rounded-lg p-4 border border-border/50">
                            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 italic">
                                "{typeof stats.smart_analysis.insights[0] === 'string'
                                    ? stats.smart_analysis.insights[0]
                                    : stats.smart_analysis.insights[0]?.text}"
                            </p>
                        </div>
                    ) : (
                        <div className="flex-1 rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-center gap-2 bg-muted/10 py-5">
                            <div className="p-2 rounded-lg bg-muted">
                                <Database className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">No insights yet</p>
                                <p className="text-xs text-muted-foreground">Upload data to generate AI insights</p>
                            </div>
                            <Button variant="outline" size="sm" className="h-7 text-xs mt-1" onClick={() => window.location.href = '/datasets'}>
                                Upload Dataset
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
