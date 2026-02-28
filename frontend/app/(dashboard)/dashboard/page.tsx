"use client"

import { useTranslation } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { CommandPalette } from "@/components/CommandPalette"
import Link from "next/link"
import { Fragment, Suspense, useState, useEffect, useMemo } from "react"
import { DashboardSkeleton } from "@/components/skeletons"
import CountUp from "@/components/ui/CountUp"
import {
    TrendDown, ArrowUpRight, ArrowDownRight, ArrowRight, Drop
} from "@phosphor-icons/react"

// ── Palette (3 main colors) ──
// Purple #7C5CFC | Blue #5b8def | Teal #2dd4bf
const UP_COLOR = "#2dd4bf"
const DOWN_COLOR = "#f472b6"

// ── Score Status (4 tiers) ──
function getScoreStatus(score: number) {
    if (score >= 80) return {
        labelCs: "Optimální", labelEn: "Optimal",
        color: "rgba(45,212,191,0.9)", bg: "rgba(45,212,191,0.06)",
        border: "rgba(45,212,191,0.12)", dotColor: "#2dd4bf",
    }
    if (score >= 60) return {
        labelCs: "Stabilní", labelEn: "Stable",
        color: "rgba(91,141,239,0.9)", bg: "rgba(91,141,239,0.06)",
        border: "rgba(91,141,239,0.12)", dotColor: "#5b8def",
    }
    if (score >= 40) return {
        labelCs: "Nestabilní", labelEn: "Unstable",
        color: "rgba(245,158,11,0.9)", bg: "rgba(245,158,11,0.06)",
        border: "rgba(245,158,11,0.12)", dotColor: "#f59e0b",
    }
    return {
        labelCs: "Rizikový", labelEn: "Risky",
        color: "rgba(244,114,182,0.9)", bg: "rgba(244,114,182,0.06)",
        border: "rgba(244,114,182,0.12)", dotColor: "#f472b6",
    }
}

// ── Health Score ──
const HEALTH_SCORE = 82
const RADIUS = 88
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

// ── Key Metrics (Left Panel) ──
const keyMetricsData = [
    { shortCs: "Runway", shortEn: "Runway", value: 6.2, suffix: " mo", trend: -8.0, direction: "down" as const },
    { shortCs: "Burn Rate", shortEn: "Burn Rate", value: 1.2, suffix: "M Kč", trend: 8.0, direction: "down" as const },
    { shortCs: "Hotovost. rezerva", shortEn: "Cash Reserve", value: 1.8, suffix: " mo", trend: -12.0, direction: "down" as const },
    { shortCs: "Růst tržeb", shortEn: "Revenue Growth", value: 12.5, suffix: "%", trend: 3.2, direction: "up" as const },
    { shortCs: "Zisková marže", shortEn: "Profit Margin", value: 23.8, suffix: "%", trend: 1.5, direction: "up" as const },
    { shortCs: "Retence", shortEn: "Retention", value: 94.2, suffix: "%", trend: 0.8, direction: "up" as const },
]

// ── KPI Data (below panels) ──
const kpiData = [
    { titleCs: "Tržby", titleEn: "Revenue", value: 24.8, suffix: "M Kč", trend: 5.2, direction: "up" as const, color: "#7C5CFC" },
    { titleCs: "EBITDA", titleEn: "EBITDA", value: 5.9, suffix: "M Kč", trend: 3.8, direction: "up" as const, color: "#5b8def" },
    { titleCs: "Provozní Cash Flow", titleEn: "Op. Cash Flow", value: 3.2, suffix: "M Kč", trend: -2.1, direction: "down" as const, color: "#2dd4bf" },
    { titleCs: "Working Capital", titleEn: "Working Capital", value: 8.4, suffix: "M Kč", trend: 1.4, direction: "up" as const, color: "#7C5CFC" },
]

// ── Index Score Data ──
const indexScoreData = [
    { titleCs: "Index finanční stability", titleEn: "Financial Health Index", shortCs: "Fin. stabilita", shortEn: "Financial Health", score: 78, trend: 4.1, direction: "up" as const },
    { titleCs: "Rizikový index", titleEn: "Risk Index", shortCs: "Rizikový index", shortEn: "Risk Index", score: 45, trend: -2.8, direction: "down" as const },
    { titleCs: "Index likvidity", titleEn: "Liquidity Index", shortCs: "Likvidita", shortEn: "Liquidity", score: 68, trend: 1.5, direction: "up" as const },
    { titleCs: "Index kvality růstu", titleEn: "Growth Quality Index", shortCs: "Kvalita růstu", shortEn: "Growth Quality", score: 71, trend: 5.6, direction: "up" as const },
    { titleCs: "Index provozní efektivity", titleEn: "Operational Efficiency Index", shortCs: "Provoz. efektivita", shortEn: "Op. Efficiency", score: 84, trend: 2.3, direction: "up" as const },
    { titleCs: "Index stability zákazníků", titleEn: "Customer Stability Index", shortCs: "Stab. zákazníků", shortEn: "Customer Stability", score: 62, trend: -1.2, direction: "down" as const },
]

// ── Alert Cards ──
const alertCards = [
    {
        titleCs: "Likvidita pod minimem",
        titleEn: "Liquidity Below Minimum",
        descriptionCs: "Aktuální hotovostní rezerva pokrývá pouze 1.8 měsíce provozu. Doporučujeme přehodnotit krátkodobé výdaje.",
        descriptionEn: "Current cash reserve covers only 1.8 months of operations. We recommend reassessing short-term expenses.",
        metricValue: 1.8,
        metricLabelCs: "měsíců runway",
        metricLabelEn: "months runway",
        linkHref: "/rizika",
        linkLabelCs: "Zobrazit analýzu",
        linkLabelEn: "View analysis",
        color: "#5b8def",
    },
    {
        titleCs: "Runway a Burn Rate",
        titleEn: "Runway & Burn Rate",
        descriptionCs: "Měsíční burn rate vzrostl o 8% oproti předchozímu kvartálu. Runway přibližně 6.2 měsíce bez dalšího financování.",
        descriptionEn: "Monthly burn rate increased by 8% compared to the previous quarter. Runway is approximately 6.2 months without additional funding.",
        metricValue: 6.2,
        metricLabelCs: "měsíců do vyčerpání",
        metricLabelEn: "months until depletion",
        linkHref: "/rizika",
        linkLabelCs: "Zobrazit detail",
        linkLabelEn: "View details",
        color: "#7C5CFC",
    },
]

function DashboardContent() {
    const { language } = useTranslation()
    const { user } = useAuth()
    const [circleOffset, setCircleOffset] = useState(CIRCUMFERENCE)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCircleOffset(CIRCUMFERENCE * (1 - HEALTH_SCORE / 100))
        }, 200)
        return () => clearTimeout(timer)
    }, [])

    const status = getScoreStatus(HEALTH_SCORE)

    const formattedDate = useMemo(() => {
        const now = new Date()
        if (language === "cs") {
            return now.toLocaleDateString("cs-CZ", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
        }
        return now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
    }, [language])

    const displayName = user?.displayName || user?.email?.split("@")[0] || ""
    const companyName = "Altech"

    return (
        <>
            <CommandPalette />

            <div className="flex-1 relative overflow-hidden">
                <div className="relative max-w-[1600px] mx-auto px-4 md:px-10 w-full flex flex-col gap-10 md:gap-16 py-8 md:py-14">

                    {/* ── Greeting ── */}
                    <section className="text-center">
                        <h1 className="text-xl md:text-2xl font-semibold text-white">
                            {language === "cs" ? `Dobrý den, ${companyName}` : `Welcome, ${companyName}`}
                        </h1>
                        <p className="text-sm mt-1 capitalize" style={{ color: "rgba(180,160,255,0.7)" }}>
                            {formattedDate}
                        </p>
                    </section>

                    {/* ── Health Score + Side Panels ── */}
                    <section className="pt-4 md:pt-10 pb-4 lg:pb-52">
                        <div className="flex flex-col items-center gap-8 lg:gap-0 lg:relative">

                            {/* Key Metrics Panel (Left) */}
                            <div
                                className="rounded-3xl bg-white/[0.03] backdrop-blur-sm px-6 md:px-8 py-4 md:py-5 w-full max-w-[400px] lg:absolute lg:left-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[380px] xl:w-[420px] flex flex-col justify-center order-2 lg:order-none"
                                style={{
                                    borderTop: "1px solid rgba(255,255,255,0.12)",
                                    borderLeft: "1px solid rgba(255,255,255,0.12)",
                                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    borderRight: "4px solid #7C5CFC",
                                }}
                            >
                                <p className="text-[10px] font-medium uppercase tracking-widest mb-2 pb-2"
                                    style={{ color: "rgba(180,160,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    {language === "cs" ? "Finanční metriky" : "Financial Metrics"}
                                </p>
                                {keyMetricsData.map((item, idx) => (
                                    <Fragment key={idx}>
                                        <div className="flex items-center justify-between py-2.5 md:py-3">
                                            <span
                                                className="text-[13px] md:text-sm font-medium"
                                                style={{ color: "rgba(220,210,255,0.95)" }}
                                            >
                                                {language === "cs" ? item.shortCs : item.shortEn}
                                            </span>

                                            <div className="flex items-center gap-3">
                                                <div className="flex items-baseline gap-0.5">
                                                    <CountUp
                                                        from={0} to={item.value} duration={2} delay={0.1 * idx}
                                                        className="text-[16px] md:text-lg font-semibold text-white tabular-nums"
                                                    />
                                                    <span className="text-[11px] md:text-xs font-normal" style={{ color: "rgba(180,160,255,0.7)" }}>
                                                        {item.suffix}
                                                    </span>
                                                </div>
                                                <span
                                                    className="flex items-center gap-0.5 text-[11px] md:text-xs font-semibold tabular-nums min-w-[58px] justify-end"
                                                    style={{ color: item.direction === "up" ? UP_COLOR : DOWN_COLOR }}
                                                >
                                                    {item.direction === "up"
                                                        ? <ArrowUpRight className="w-3.5 h-3.5" weight="bold" />
                                                        : <ArrowDownRight className="w-3.5 h-3.5" weight="bold" />
                                                    }
                                                    {item.trend > 0 ? "+" : ""}{item.trend}%
                                                </span>
                                            </div>
                                        </div>
                                        {idx < keyMetricsData.length - 1 && (
                                            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                                        )}
                                    </Fragment>
                                ))}
                            </div>

                            {/* Circle (centered) */}
                            <div className="flex flex-col items-center gap-3 order-1 lg:order-none">
                                <div className="relative w-44 h-44 md:w-56 md:h-56 shrink-0">
                                    {/* Glow */}
                                    <div
                                        className="absolute rounded-full pointer-events-none"
                                        style={{
                                            inset: "-50px",
                                            background: "radial-gradient(circle, rgba(124,92,252,0.35) 0%, rgba(91,141,239,0.15) 40%, transparent 70%)",
                                            filter: "blur(30px)",
                                        }}
                                    />

                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                        <defs>
                                            <linearGradient id="scoreGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#2dd4bf" />
                                                <stop offset="50%" stopColor="#5b8def" />
                                                <stop offset="100%" stopColor="#7C5CFC" />
                                            </linearGradient>
                                        </defs>

                                        {/* Track */}
                                        <circle cx="100" cy="100" r={RADIUS} fill="none"
                                            stroke="rgba(124,92,252,0.08)" strokeWidth="7" />

                                        {/* Progress */}
                                        <circle cx="100" cy="100" r={RADIUS} fill="none"
                                            stroke="url(#scoreGrad)" strokeWidth="7" strokeLinecap="round"
                                            strokeDasharray={CIRCUMFERENCE} strokeDashoffset={circleOffset}
                                            style={{ transition: "stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
                                        />
                                    </svg>

                                    {/* Center content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                                        <CountUp
                                            from={0} to={HEALTH_SCORE} duration={2.5} delay={0.2}
                                            className="text-5xl md:text-7xl font-light text-white tabular-nums tracking-tight"
                                        />
                                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full"
                                            style={{ background: status.bg, border: `1px solid ${status.border}` }}>
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.dotColor }} />
                                            <p className="text-[11px] font-medium" style={{ color: status.color }}>
                                                {language === "cs" ? status.labelCs : status.labelEn}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Index Breakdown Panel (Right) */}
                            <div
                                className="rounded-3xl bg-white/[0.03] backdrop-blur-sm px-6 md:px-8 py-4 md:py-5 w-full max-w-[400px] lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[380px] xl:w-[420px] flex flex-col justify-center order-3 lg:order-none"
                                style={{
                                    borderTop: "1px solid rgba(255,255,255,0.12)",
                                    borderRight: "1px solid rgba(255,255,255,0.12)",
                                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    borderLeft: "4px solid #7C5CFC",
                                }}
                            >
                                <p className="text-[10px] font-medium uppercase tracking-widest mb-2 pb-2"
                                    style={{ color: "rgba(180,160,255,0.6)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                                    {language === "cs" ? "Indexy" : "Indexes"}
                                </p>
                                {indexScoreData.map((item, idx) => (
                                    <Fragment key={idx}>
                                        <div className="flex items-center justify-between py-2.5 md:py-3">
                                            <span
                                                className="text-[13px] md:text-sm font-medium"
                                                style={{ color: "rgba(220,210,255,0.95)" }}
                                            >
                                                {language === "cs" ? item.shortCs : item.shortEn}
                                            </span>

                                            <div className="flex items-center gap-4">
                                                <CountUp
                                                    from={0} to={item.score} duration={2} delay={0.1 * idx}
                                                    className="text-[16px] md:text-lg font-semibold text-white tabular-nums"
                                                />
                                                <span
                                                    className="flex items-center gap-0.5 text-[11px] md:text-xs font-semibold tabular-nums min-w-[58px] justify-end"
                                                    style={{ color: item.direction === "up" ? UP_COLOR : DOWN_COLOR }}
                                                >
                                                    {item.direction === "up"
                                                        ? <ArrowUpRight className="w-3.5 h-3.5" weight="bold" />
                                                        : <ArrowDownRight className="w-3.5 h-3.5" weight="bold" />
                                                    }
                                                    {item.trend > 0 ? "+" : ""}{item.trend}%
                                                </span>
                                            </div>
                                        </div>
                                        {idx < indexScoreData.length - 1 && (
                                            <div className="h-px w-full" style={{ background: "rgba(255,255,255,0.08)" }} />
                                        )}
                                    </Fragment>
                                ))}
                            </div>

                        </div>
                    </section>

                    {/* ── KPI Cards ── */}
                    <section>
                        <p className="text-[10px] md:text-xs font-medium uppercase tracking-widest mb-4"
                            style={{ color: "rgba(180,160,255,0.6)" }}>
                            {language === "cs" ? "Klíčové ukazatele" : "Key Performance"}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
                            {kpiData.map((kpi, idx) => (
                                <div
                                    key={idx}
                                    className="rounded-3xl bg-white/[0.03] backdrop-blur-sm px-5 md:px-7 py-4 md:py-5 min-h-[100px] md:min-h-[120px] transition-all duration-200 hover:bg-white/[0.06] hover:-translate-y-0.5"
                                    style={{
                                        borderTop: "1px solid rgba(255,255,255,0.12)",
                                        borderRight: "1px solid rgba(255,255,255,0.12)",
                                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                                        borderLeft: `4px solid ${kpi.color}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-[10px] md:text-xs font-normal uppercase tracking-widest"
                                            style={{ color: "rgba(180,160,255,0.9)" }}>
                                            {language === "cs" ? kpi.titleCs : kpi.titleEn}
                                        </p>
                                        <span
                                            className="flex items-center gap-0.5 text-[10px] md:text-[11px] font-semibold tabular-nums"
                                            style={{ color: kpi.direction === "up" ? UP_COLOR : DOWN_COLOR }}
                                        >
                                            {kpi.direction === "up"
                                                ? <ArrowUpRight className="w-3 h-3" weight="bold" />
                                                : <ArrowDownRight className="w-3 h-3" weight="bold" />
                                            }
                                            {kpi.trend > 0 ? "+" : ""}{kpi.trend}%
                                        </span>
                                    </div>
                                    <div className="flex items-baseline gap-1">
                                        <CountUp
                                            from={0} to={kpi.value} duration={2} delay={0.1 * idx}
                                            className="text-[26px] md:text-[42px] font-semibold text-white tabular-nums leading-none"
                                        />
                                        <span className="text-xs md:text-sm font-normal" style={{ color: "rgba(180,160,255,0.85)" }}>
                                            {kpi.suffix}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* ── Alert Cards ── */}
                    <section>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-6">
                        {alertCards.map((card, idx) => (
                            <div
                                key={idx}
                                className="rounded-3xl bg-white/[0.03] backdrop-blur-sm p-5 md:p-7 transition-all duration-200 hover:bg-white/[0.06] hover:-translate-y-0.5"
                                style={{
                                    borderTop: "1px solid rgba(255,255,255,0.12)",
                                    borderRight: "1px solid rgba(255,255,255,0.12)",
                                    borderBottom: "1px solid rgba(255,255,255,0.12)",
                                    borderLeft: `4px solid ${card.color}`,
                                }}
                            >
                                <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                                    {language === "cs" ? card.titleCs : card.titleEn}
                                </h3>
                                <p className="text-sm text-gray-400 leading-relaxed mb-5">
                                    {language === "cs" ? card.descriptionCs : card.descriptionEn}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                                    <div className="flex items-baseline gap-2">
                                        <CountUp
                                            from={0} to={card.metricValue} duration={2} delay={0.5}
                                            className="text-2xl md:text-3xl font-semibold tabular-nums"
                                            // @ts-ignore
                                            style={{ color: card.color }}
                                        />
                                        <span className="text-xs text-gray-400">
                                            {language === "cs" ? card.metricLabelCs : card.metricLabelEn}
                                        </span>
                                    </div>
                                    <Link
                                        href={card.linkHref}
                                        className="flex items-center gap-1.5 text-[13px] font-medium transition-colors hover:text-white"
                                        style={{ color: "rgba(180,160,255,0.9)" }}
                                    >
                                        {language === "cs" ? card.linkLabelCs : card.linkLabelEn}
                                        <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                        </div>
                    </section>

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
