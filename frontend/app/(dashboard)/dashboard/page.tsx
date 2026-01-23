"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    PieChart,
    Database,
    Sparkles,
    TrendingUp,
    Users,
    FileText,
    Target,
    ArrowRight,
    BarChart3,
    Loader2,
    Upload,
    MessageSquareText
} from "lucide-react"

export default function HomePage() {
    const { user, isAdmin, isClient } = useAuth()
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isClientMounted, setIsClientMounted] = useState(false)

    useEffect(() => {
        setIsClientMounted(true)
        const loadQuickStats = async () => {
            try {
                // Get latest dataset stats for quick overview
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

    const quickStats = [
        {
            label: "Total Revenue",
            value: stats?.smart_analysis?.total_sales ? `$${(stats.smart_analysis.total_sales / 1000).toFixed(0)}K` : "$0",
            icon: TrendingUp,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            label: "Datasets",
            value: stats?.datasetCount || 0,
            icon: Database,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            label: "Categories",
            value: stats?.smart_analysis?.top_categories?.length || 0,
            icon: BarChart3,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            label: "Transactions",
            value: stats?.total_rows?.toLocaleString() || "0",
            icon: FileText,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        }
    ]

    const quickActions = isAdmin ? [
        { label: "Upload Dataset", href: "/datasets", icon: Upload, description: "Import new data files" },
        { label: "View Overview", href: "/overview", icon: LayoutDashboard, description: "See all metrics" },
        { label: "BI Analytics", href: "/bi", icon: PieChart, description: "Deep dive analysis" },
        { label: "Manage Clients", href: "/clients", icon: Users, description: "Client management" },
    ] : [
        { label: "View Overview", href: "/overview", icon: LayoutDashboard, description: "See all metrics" },
        { label: "BI Analytics", href: "/bi", icon: PieChart, description: "Deep dive analysis" },
        { label: "Ask AI", href: "/insights", icon: MessageSquareText, description: "Get AI insights" },
        { label: "My Goals", href: "/goals", icon: Target, description: "Track your targets" },
    ]

    const sectionCards = [
        {
            title: "Overview Dashboard",
            description: "Monitor all your key metrics, charts, and performance indicators in one place.",
            href: "/overview",
            icon: LayoutDashboard,
            gradient: "from-blue-500/10 to-cyan-500/10",
            iconColor: "text-blue-500"
        },
        {
            title: "Business Intelligence",
            description: "Deep analytics with AI-powered insights, trend analysis, and executive summaries.",
            href: "/bi",
            icon: PieChart,
            gradient: "from-purple-500/10 to-pink-500/10",
            iconColor: "text-purple-500"
        },
        {
            title: "AI Insights",
            description: "Ask questions about your data and get intelligent answers instantly.",
            href: "/insights",
            icon: Sparkles,
            gradient: "from-amber-500/10 to-orange-500/10",
            iconColor: "text-amber-500"
        }
    ]

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-blue-500/5 border border-border p-8 md:p-12">
                <div className="absolute inset-0 bg-grid-white/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-primary/10">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-primary">K2M Analytics</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                        {isClientMounted ? `Welcome back, ${user?.name || user?.companyName || 'User'}` : 'Welcome back'}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">
                        {isAdmin
                            ? "Manage your clients, analyze data, and generate insights from your analytics platform."
                            : "Track your business performance, explore analytics, and get AI-powered insights."
                        }
                    </p>
                </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, idx) => (
                    <div key={idx} className="premium-card p-5 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${stat.bg}`}>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quickActions.map((action, idx) => (
                        <Link key={idx} href={action.href}>
                            <div className="premium-card p-5 h-full hover:border-primary/30 transition-all group cursor-pointer">
                                <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3 group-hover:bg-primary/20 transition-colors">
                                    <action.icon className="w-5 h-5 text-primary" />
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">{action.label}</h3>
                                <p className="text-xs text-muted-foreground">{action.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Section Navigation Cards */}
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Explore Sections</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {sectionCards.map((card, idx) => (
                        <Link key={idx} href={card.href}>
                            <div className={`premium-card p-6 h-full bg-gradient-to-br ${card.gradient} hover:border-primary/30 transition-all group cursor-pointer`}>
                                <div className={`p-3 rounded-xl bg-background/50 w-fit mb-4`}>
                                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{card.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4">{card.description}</p>
                                <div className="flex items-center text-sm font-medium text-primary group-hover:gap-2 transition-all">
                                    <span>Open</span>
                                    <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* AI Insights Teaser */}
            {stats?.smart_analysis?.insights?.length > 0 && (
                <div className="premium-card p-6 bg-gradient-to-r from-primary/5 to-purple-500/5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" />
                            <h3 className="font-semibold text-foreground">Latest AI Insights</h3>
                        </div>
                        <Link href="/insights">
                            <Button variant="ghost" size="sm" className="text-primary">
                                View All <ArrowRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-2">
                        {stats.smart_analysis.insights.slice(0, 2).map((insight: any, i: number) => (
                            <div key={i} className="flex gap-3 text-sm">
                                <div className="min-w-[6px] h-[6px] mt-2 rounded-full bg-primary/50" />
                                <p className="text-muted-foreground">
                                    {typeof insight === 'string' ? insight : insight.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
