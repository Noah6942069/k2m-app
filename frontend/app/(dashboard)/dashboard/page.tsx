"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { CommandPalette } from "@/components/CommandPalette"
import {
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Upload,
    Beaker,
    ArrowRight,
    Sparkles,
    Bell,
    AlertCircle,
    TrendingDown,
    TrendingUp,
    DollarSign,
    Brain,
    Zap,
    Sun,
    Moon,
    CloudSun,
    RefreshCw,
    ChevronRight,
    Users,
    Target,
    Calendar,
    FileText,
    Activity,
    Clock,
    Search
} from "lucide-react"
import { Suspense } from "react"
import { DashboardSkeleton } from "@/components/skeletons"

// Types
type SystemStatus = "good" | "warning" | "critical"

// Demo KPI data
const kpiData = [
    { id: 1, label: "Tržby", labelEn: "Revenue", value: "€2.4M", trend: "+12%", trendUp: true, icon: DollarSign },
    { id: 2, label: "Klienti", labelEn: "Clients", value: "847", trend: "+5%", trendUp: true, icon: Users },
    { id: 3, label: "Cíl Q1", labelEn: "Q1 Goal", value: "68%", trend: "-8%", trendUp: false, icon: Target },
    { id: 4, label: "Datasety", labelEn: "Datasets", value: "12", trend: "active", trendUp: true, icon: FileText },
]

// Demo signals
const demoSignals = [
    {
        id: 1,
        type: "critical" as const,
        title: "Pokles cash flow",
        titleEn: "Cash Flow Drop",
        description: "-23% oproti minulému měsíci",
        descriptionEn: "-23% compared to last month",
        icon: DollarSign,
        time: "2h",
    },
    {
        id: 2,
        type: "warning" as const,
        title: "Tržby pod cílem",
        titleEn: "Revenue Below Target",
        description: "Q1 cíl splněn na 68%",
        descriptionEn: "Q1 target at 68%",
        icon: TrendingDown,
        time: "5h",
    },
    {
        id: 3,
        type: "warning" as const,
        title: "Riziko dodavatele",
        titleEn: "Supplier Risk",
        description: "Hlavní dodavatel hlásí zpoždění",
        descriptionEn: "Main supplier reports delays",
        icon: AlertCircle,
        time: "1d",
    },
]

// Demo recent activity
const recentActivity = [
    { id: 1, action: "Nahrán dataset", actionEn: "Dataset uploaded", item: "Prodeje_Q1.xlsx", time: "před 2h", icon: Upload },
    { id: 2, action: "AI analýza dokončena", actionEn: "AI analysis completed", item: "Cash Flow Report", time: "před 5h", icon: Brain },
    { id: 3, action: "Nový signál", actionEn: "New signal", item: "Pokles marže", time: "včera", icon: AlertTriangle },
]

// Daily goal
const dailyGoal = {
    cs: "Zkontrolujte cash flow analýzu",
    en: "Review cash flow analysis",
    href: "/intelligence/analysis"
}

// AI Insight
const aiInsight = {
    cs: "Doporučuji prověřit cash flow tento týden – klesající trend může ohrozit Q2 investice.",
    en: "I recommend reviewing cash flow this week – the declining trend may jeopardize Q2 investments."
}

// Time-of-day greeting
const getGreeting = (language: string): { text: string; icon: React.ComponentType<any> } => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
        return { text: language === 'cs' ? 'Dobré ráno' : 'Good morning', icon: Sun }
    } else if (hour >= 12 && hour < 17) {
        return { text: language === 'cs' ? 'Dobré odpoledne' : 'Good afternoon', icon: CloudSun }
    } else {
        return { text: language === 'cs' ? 'Dobrý večer' : 'Good evening', icon: Moon }
    }
}


function DashboardContent() {
    const { t, language } = useTranslation()
    const { user } = useAuth()
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [systemStatus] = useState<SystemStatus>("warning")

    const handleRefresh = () => {
        setIsRefreshing(true)
        setTimeout(() => setIsRefreshing(false), 1000)
    }

    const greeting = getGreeting(language)
    const GreetingIcon = greeting.icon

    const getStatusConfig = (status: SystemStatus) => {
        switch (status) {
            case "good":
                return {
                    message: t.home.statusAllGood,
                    subMessage: t.home.noIssuesDetected,
                    icon: CheckCircle2,
                    orbColors: "from-emerald-500 via-emerald-400 to-teal-500",
                    glowColor: "shadow-emerald-500/50",
                    textColor: "text-emerald-500",
                    borderColor: "border-emerald-500/30",
                }
            case "warning":
                return {
                    message: t.home.statusWarning,
                    subMessage: language === 'cs' ? "Zkontrolujte signály níže" : "Review the signals below",
                    icon: AlertTriangle,
                    orbColors: "from-amber-500 via-orange-400 to-yellow-500",
                    glowColor: "shadow-amber-500/50",
                    textColor: "text-amber-500",
                    borderColor: "border-amber-500/30",
                }
            case "critical":
                return {
                    message: t.home.statusCritical,
                    subMessage: language === 'cs' ? "Vyžadována okamžitá akce" : "Immediate action required",
                    icon: XCircle,
                    orbColors: "from-red-500 via-rose-400 to-pink-500",
                    glowColor: "shadow-red-500/50",
                    textColor: "text-red-500",
                    borderColor: "border-red-500/30",
                }
        }
    }

    const statusConfig = getStatusConfig(systemStatus)
    const StatusIcon = statusConfig.icon

    const quickActions = [
        {
            href: "/intelligence/analysis",
            icon: Beaker,
            title: language === 'cs' ? "Spustit Analýzu" : "Run Analysis",
            description: language === 'cs' ? "AI-powered insights" : "AI-powered insights",
            color: "violet",
        },
        {
            href: "/intelligence/what-if",
            icon: Zap,
            title: language === 'cs' ? "Simulace" : "Simulation",
            description: language === 'cs' ? "What-if scénáře" : "What-if scenarios",
            color: "blue",
        },
        {
            href: "/datasets",
            icon: Upload,
            title: language === 'cs' ? "Nahrát Data" : "Upload Data",
            description: language === 'cs' ? "Import nových dat" : "Import new data",
            color: "emerald",
        },
    ]

    return (
        <>
            {/* Command Palette - Ctrl+K */}
            <CommandPalette />

            <div className="flex-1 min-h-screen relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />
                <div
                    className="absolute inset-0 opacity-[0.015] pointer-events-none"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
                        backgroundSize: '40px 40px',
                    }}
                />

                <div className="relative p-6 md:p-10 lg:p-14 max-w-[1800px] mx-auto">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-10">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                                <Sparkles className="w-3.5 h-3.5" />
                                K2M Analytics
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                                <GreetingIcon className="w-7 h-7 text-primary/70" />
                                <span suppressHydrationWarning>
                                    {greeting.text}{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}
                                </span>
                            </h1>
                            <p className="text-muted-foreground text-sm mt-1">
                                {t.home.hereIsYourStatus}
                            </p>
                        </div>
                    </div>

                    {/* Main Grid Layout */}
                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-10">
                        {/* Left Column - Orb + KPIs */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Status Orb */}
                            <div className="flex flex-col items-center py-10">
                                <div className="relative group">
                                    {/* Outer glow - largest */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${statusConfig.orbColors} opacity-20 blur-3xl animate-pulse scale-[2]`} />

                                    {/* Secondary glow pulse */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${statusConfig.orbColors} opacity-10 blur-2xl scale-[1.6]`} />

                                    {/* Rotating outer ring - slow */}
                                    <div
                                        className={`absolute inset-[-16px] rounded-full border-2 border-dashed ${statusConfig.borderColor} opacity-40`}
                                        style={{ animation: 'spin 30s linear infinite' }}
                                    />

                                    {/* Rotating inner ring - faster, opposite direction */}
                                    <div
                                        className={`absolute inset-[-8px] rounded-full border border-dotted ${statusConfig.borderColor} opacity-30`}
                                        style={{ animation: 'spin 15s linear infinite reverse' }}
                                    />

                                    {/* Pulsing ring */}
                                    <div
                                        className={`absolute inset-[-24px] rounded-full border-2 ${statusConfig.borderColor} animate-ping opacity-15`}
                                        style={{ animationDuration: '3s' }}
                                    />

                                    {/* Inner glow layer */}
                                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${statusConfig.orbColors} opacity-40 blur-2xl`} />

                                    {/* Main Orb Container */}
                                    <div
                                        className={`
                                            relative w-32 h-32 md:w-40 md:h-40
                                            rounded-full 
                                            bg-gradient-to-br ${statusConfig.orbColors}
                                            shadow-2xl ${statusConfig.glowColor}
                                            flex items-center justify-center
                                            transition-all duration-500
                                            group-hover:scale-110
                                            cursor-pointer
                                            overflow-hidden
                                        `}
                                    >
                                        {/* Noise texture overlay for depth */}
                                        <div
                                            className="absolute inset-0 opacity-20 mix-blend-overlay"
                                            style={{
                                                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
                                                backgroundSize: 'cover'
                                            }}
                                        />

                                        {/* Top glass reflection - strong */}
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/50 via-white/20 to-transparent"
                                            style={{ clipPath: 'ellipse(60% 40% at 50% -10%)' }}
                                        />

                                        {/* Main glass layer */}
                                        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/40 via-white/10 to-transparent" />

                                        {/* Bottom shadow for depth */}
                                        <div className="absolute inset-4 rounded-full bg-gradient-to-tl from-black/20 via-black/5 to-transparent" />

                                        {/* Inner glow ring */}
                                        <div className={`absolute inset-6 rounded-full border border-white/20 shadow-inner`} />

                                        {/* Shimmer effect on hover */}
                                        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />

                                        {/* Icon with enhanced drop shadow */}
                                        <StatusIcon
                                            className="relative w-10 h-10 md:w-12 md:h-12 text-white drop-shadow-2xl"
                                            strokeWidth={1.5}
                                            style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-5 text-center">
                                    <h2 className={`text-lg md:text-xl font-semibold ${statusConfig.textColor}`}>
                                        {statusConfig.message}
                                    </h2>
                                    <button
                                        onClick={handleRefresh}
                                        className="inline-flex items-center gap-2 mt-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                                        {t.home.lastUpdated}: 5 {t.home.minutesAgo}
                                    </button>
                                </div>
                            </div>

                            {/* Mini KPI Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {kpiData.map((kpi) => {
                                    const Icon = kpi.icon
                                    return (
                                        <div
                                            key={kpi.id}
                                            className="rounded-xl border border-border/50 bg-card/50 p-5 hover:bg-card transition-colors flex flex-col justify-between min-h-[120px]"
                                        >
                                            <div className="flex items-center gap-2 mb-3">
                                                <Icon className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground">
                                                    {language === 'cs' ? kpi.label : kpi.labelEn}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-xl font-bold text-foreground mb-1">{kpi.value}</p>
                                                <p className={`text-xs ${kpi.trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    {kpi.trend}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Signals */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <Bell className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        {t.home.signals}
                                    </h3>
                                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-medium">
                                        {demoSignals.length}
                                    </span>
                                </div>

                                <div className="space-y-3">
                                    {demoSignals.map((signal) => {
                                        const SignalIcon = signal.icon
                                        const isCritical = signal.type === "critical"
                                        const colorClass = isCritical
                                            ? 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
                                            : 'border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10'
                                        const iconColorClass = isCritical
                                            ? 'bg-red-500/10 text-red-500'
                                            : 'bg-amber-500/10 text-amber-500'

                                        return (
                                            <Link
                                                key={signal.id}
                                                href="/intelligence/analysis"
                                                className={`group flex items-center gap-4 rounded-xl border ${colorClass} p-4 transition-all`}
                                            >
                                                <div className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColorClass}`}>
                                                    <SignalIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-sm font-medium text-foreground">
                                                        {language === 'cs' ? signal.title : signal.titleEn}
                                                    </h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {language === 'cs' ? signal.description : signal.descriptionEn}
                                                    </p>
                                                </div>
                                                <span className="text-xs text-muted-foreground">{signal.time}</span>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar widgets */}
                        <div className="space-y-8">
                            {/* Daily Goal */}
                            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Target className="w-4 h-4 text-primary" />
                                    <h3 className="text-sm font-medium text-foreground">
                                        {language === 'cs' ? 'Cíl dne' : 'Daily Goal'}
                                    </h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {language === 'cs' ? dailyGoal.cs : dailyGoal.en}
                                </p>
                                <Link
                                    href={dailyGoal.href}
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                    {language === 'cs' ? 'Zobrazit' : 'View'}
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            {/* AI Insight */}
                            <Link
                                href="/intelligence/recommendations"
                                className="block rounded-xl border border-violet-500/20 bg-violet-500/5 p-5 hover:bg-violet-500/10 transition-colors group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <Brain className="w-4 h-4 text-violet-500" />
                                    <h3 className="text-sm font-medium text-foreground">AI Insight</h3>
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-500 font-medium">BETA</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {language === 'cs' ? aiInsight.cs : aiInsight.en}
                                </p>
                            </Link>

                            {/* Recent Activity */}
                            <div className="rounded-xl border border-border/50 bg-card/50 p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Activity className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-foreground">
                                        {language === 'cs' ? 'Nedávná aktivita' : 'Recent Activity'}
                                    </h3>
                                </div>
                                <div className="space-y-4">
                                    {recentActivity.map((activity) => {
                                        const Icon = activity.icon
                                        return (
                                            <div key={activity.id} className="flex items-start gap-3">
                                                <div className="shrink-0 w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                                                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-foreground truncate">
                                                        {language === 'cs' ? activity.action : activity.actionEn}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground shrink-0">
                                                    {activity.time}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        {t.home.whatNext}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    {quickActions.map((action) => {
                                        const ActionIcon = action.icon
                                        return (
                                            <Link
                                                key={action.href}
                                                href={action.href}
                                                className="group flex items-center gap-3 rounded-xl border border-border/50 bg-card p-3 hover:border-primary/30 hover:bg-primary/5 transition-all"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <ActionIcon className="w-4 h-4 text-primary group-hover:text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-medium text-foreground">{action.title}</h4>
                                                </div>
                                                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </Link>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default function DashboardPage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <DashboardContent />
        </Suspense>
    )
}
