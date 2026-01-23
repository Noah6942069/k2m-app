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
    Loader2,
    MessageSquareText,
    Target,
    Database,
    BarChart3
} from "lucide-react"

export default function HomePage() {
    const { user, isAdmin, isClient } = useAuth()
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
        { label: t.navigation.overview, href: "/overview", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
        { label: t.navigation.bi, href: "/bi", icon: PieChart, color: "from-purple-500 to-pink-500" },
        { label: t.navigation.insights, href: "/insights", icon: MessageSquareText, color: "from-amber-500 to-orange-500" },
        { label: t.navigation.data, href: "/datasets", icon: Database, color: "from-emerald-500 to-green-500" },
    ] : [
        { label: t.navigation.overview, href: "/overview", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
        { label: t.navigation.bi, href: "/bi", icon: PieChart, color: "from-purple-500 to-pink-500" },
        { label: t.navigation.insights, href: "/insights", icon: MessageSquareText, color: "from-amber-500 to-orange-500" },
        { label: t.navigation.goals, href: "/goals", icon: Target, color: "from-emerald-500 to-green-500" },
    ]

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">{t.common.loading}</p>
                </div>
            </div>
        )
    }

    const revenue = stats?.smart_analysis?.total_sales
        ? `$${(stats.smart_analysis.total_sales / 1000).toFixed(0)}K`
        : "$0"

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto">
            {/* Hero Welcome - Clean and Minimal */}
            <div className="text-center pt-8 pb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                    {isClientMounted
                        ? `${t.home.heroTitle}, ${user?.name || user?.companyName || ''}`
                        : t.home.heroTitle
                    }
                </h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    {isAdmin
                        ? "Your analytics command center"
                        : "Explore your business insights"
                    }
                </p>
            </div>

            {/* Key Metrics - Compact Inline */}
            <div className="flex flex-wrap items-center justify-center gap-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-green-500/10">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-foreground">{revenue}</p>
                        <p className="text-xs text-muted-foreground">{t.home.revenue}</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <Database className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-foreground">{stats?.datasetCount || 0}</p>
                        <p className="text-xs text-muted-foreground">{t.home.datasets}</p>
                    </div>
                </div>
                <div className="w-px h-8 bg-border hidden sm:block" />
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <BarChart3 className="w-4 h-4 text-purple-500" />
                    </div>
                    <div>
                        <p className="text-xl font-bold text-foreground">{stats?.smart_analysis?.top_categories?.length || 0}</p>
                        <p className="text-xs text-muted-foreground">{t.home.categories}</p>
                    </div>
                </div>
            </div>

            {/* Quick Navigation - 4 Clean Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickLinks.map((link, idx) => (
                    <Link key={idx} href={link.href}>
                        <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-6 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer h-full">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <link.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="font-semibold text-foreground">{link.label}</h3>
                            <ArrowRight className="w-4 h-4 text-muted-foreground absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* AI Assistant CTA - Single Prominent Card */}
            <Link href="/insights">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-purple-500/5 to-pink-500/10 border border-primary/20 p-8 hover:border-primary/40 transition-all cursor-pointer group">
                    <div className="flex items-center gap-6">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-primary to-purple-600 shadow-lg shadow-primary/20">
                            <Sparkles className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-foreground mb-1">{t.home.askAI}</h2>
                            <p className="text-muted-foreground">{t.home.descInsights}</p>
                        </div>
                        <Button className="bg-primary hover:bg-primary/90 hidden md:flex">
                            {t.home.open} <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                    {/* Decorative gradient orb */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl group-hover:from-primary/30 transition-all" />
                </div>
            </Link>

            {/* Latest Insight Preview - Minimal */}
            {stats?.smart_analysis?.insights?.length > 0 && (
                <div className="rounded-2xl bg-card border border-border p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <h3 className="font-medium text-foreground">{t.home.latestInsights}</h3>
                        </div>
                        <Link href="/insights">
                            <Button variant="ghost" size="sm" className="text-primary text-sm">
                                {t.home.viewAll}
                            </Button>
                        </Link>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        {typeof stats.smart_analysis.insights[0] === 'string'
                            ? stats.smart_analysis.insights[0]
                            : stats.smart_analysis.insights[0]?.text}
                    </p>
                </div>
            )}
        </div>
    )
}
