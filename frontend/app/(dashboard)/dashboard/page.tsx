"use client"

import { useTranslation } from "@/lib/i18n/language-context"
import { useAuth } from "@/lib/auth-context"
import { CommandPalette } from "@/components/CommandPalette"
import Link from "next/link"
import { Suspense, useState, useEffect } from "react"
import { DashboardSkeleton } from "@/components/skeletons"
import CountUp from "@/components/ui/CountUp"
import {
    TrendUp, TrendDown, ChartLineUp, Users, Wallet, CurrencyDollar,
    ArrowUpRight, ArrowDownRight, ArrowRight, Drop
} from "@phosphor-icons/react"

// ── Palette ──
// Purple #7C5CFC | Blue #5b8def | Teal #2dd4bf | Rose #f472b6
const UP_COLOR = "#2dd4bf"       // teal - positive
const UP_BG = "rgba(45,212,191,0.08)"
const DOWN_COLOR = "#f472b6"     // rose - negative (fits purple theme)
const DOWN_BG = "rgba(244,114,182,0.08)"

// ── Health Score ──
const HEALTH_SCORE = 82
const RADIUS = 88
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const TIP_ANGLE = (HEALTH_SCORE / 100) * 2 * Math.PI
const TIP_X = 100 + RADIUS * Math.cos(TIP_ANGLE)
const TIP_Y = 100 + RADIUS * Math.sin(TIP_ANGLE)

// ── KPI Data ──
const kpiData = [
    {
        titleCs: "Růst tržeb",
        titleEn: "Revenue Growth",
        value: 12.5,
        suffix: "%",
        changeDirection: "up" as const,
    },
    {
        titleCs: "Zisková marže",
        titleEn: "Profit Margin",
        value: 23.8,
        suffix: "%",
        changeDirection: "up" as const,
    },
    {
        titleCs: "Retence zákazníků",
        titleEn: "Customer Retention",
        value: 94.2,
        suffix: "%",
        changeDirection: "up" as const,
    },
    {
        titleCs: "Nákladová efektivita",
        titleEn: "Cost Efficiency",
        value: 87,
        suffix: "%",
        changeDirection: "down" as const,
    },
    {
        titleCs: "Cash Flow",
        titleEn: "Cash Flow",
        value: 2.4,
        suffix: "M Kč",
        changeDirection: "up" as const,
    },
]

// ── Alert Cards ──
const alertCards = [
    {
        titleCs: "Likvidita pod minimem",
        titleEn: "Liquidity Below Minimum",
        descriptionCs: "Aktuální hotovostní rezerva pokrývá pouze 1.8 měsíce provozu. Doporučujeme přehodnotit krátkodobé výdaje a zvážit optimalizaci provozního kapitálu.",
        descriptionEn: "Current cash reserve covers only 1.8 months of operations. We recommend reassessing short-term expenses and considering working capital optimization.",
        icon: Drop,
        accent: "blue" as const,
        metricValue: 1.8,
        metricLabelCs: "měsíců runway",
        metricLabelEn: "months runway",
        linkHref: "/rizika",
        linkLabelCs: "Zobrazit analýzu",
        linkLabelEn: "View analysis",
    },
    {
        titleCs: "Runway a Burn Rate",
        titleEn: "Runway & Burn Rate",
        descriptionCs: "Měsíční burn rate vzrostl o 8% oproti předchozímu kvartálu. Při aktuálním tempu spalování máte runway přibližně 6.2 měsíce bez dalšího financování.",
        descriptionEn: "Monthly burn rate increased by 8% compared to the previous quarter. At the current burn rate, your runway is approximately 6.2 months without additional funding.",
        icon: TrendDown,
        accent: "rose" as const,
        metricValue: 6.2,
        metricLabelCs: "měsíců do vyčerpání",
        metricLabelEn: "months until depletion",
        linkHref: "/rizika",
        linkLabelCs: "Zobrazit detail",
        linkLabelEn: "View details",
    },
]

// ── Bottom Bar Indicators ──
const barIndicators = [
    { labelCs: "Cash", labelEn: "Cash", direction: "up" as const },
    { labelCs: "Runway", labelEn: "Runway", direction: "down" as const },
    { labelCs: "Marže", labelEn: "Margin", direction: "up" as const },
    { labelCs: "Tržby", labelEn: "Revenue", direction: "up" as const },
    { labelCs: "Náklady", labelEn: "Costs", direction: "down" as const },
    { labelCs: "Retence", labelEn: "Retention", direction: "up" as const },
    { labelCs: "Konverze", labelEn: "Conversion", direction: "up" as const },
]

// ── Alert card color map ──
const alertAccents = {
    blue: {
        border: "rgba(91,141,239,0.4)",
        iconBg: "rgba(91,141,239,0.1)",
        iconBorder: "rgba(91,141,239,0.2)",
        iconText: "#5b8def",
        metric: "#5b8def",
    },
    rose: {
        border: "rgba(244,114,182,0.4)",
        iconBg: "rgba(244,114,182,0.1)",
        iconBorder: "rgba(244,114,182,0.2)",
        iconText: "#f472b6",
        metric: "#f472b6",
    },
}

function DashboardContent() {
    const { language } = useTranslation()
    const { user } = useAuth()
    const [circleOffset, setCircleOffset] = useState(CIRCUMFERENCE)
    const [showTip, setShowTip] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            setCircleOffset(CIRCUMFERENCE * (1 - HEALTH_SCORE / 100))
        }, 200)
        const tipTimer = setTimeout(() => setShowTip(true), 2800)
        return () => { clearTimeout(timer); clearTimeout(tipTimer) }
    }, [])

    return (
        <>
            <CommandPalette />

            <div className="flex-1 relative overflow-hidden">
                <div className="relative max-w-[1600px] mx-auto px-6 md:px-10 w-full flex flex-col gap-8 md:gap-10 py-4 md:py-6 min-h-[calc(100vh-140px)]">

                    {/* ═══════════════════════════════════════════ */}
                    {/* SECTION 1: Health Score Circle              */}
                    {/* ═══════════════════════════════════════════ */}
                    <section className="flex flex-col items-center pt-2">
                        {/* Pulse glow keyframes */}
                        <style dangerouslySetInnerHTML={{ __html: `
                            @keyframes scoreGlowPulse {
                                0%, 100% { opacity: 0.18; transform: scale(1); }
                                50% { opacity: 0.32; transform: scale(1.06); }
                            }
                            @keyframes tipFadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                        `}} />

                        {/* Small label above */}
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium mb-5 tracking-wide uppercase"
                            style={{
                                background: "rgba(124,92,252,0.06)",
                                border: "1px solid rgba(124,92,252,0.12)",
                                color: "#9F84FD",
                            }}>
                            {language === 'cs' ? 'Přehled společnosti' : 'Company Overview'}
                        </div>

                        {/* Circle container */}
                        <div className="relative w-48 h-48 md:w-60 md:h-60">
                            {/* Layer 1: Slow pulsing outer glow — purple/blue/green blend */}
                            <div
                                className="absolute inset-[-55px] rounded-full"
                                style={{
                                    background: "conic-gradient(from 200deg, rgba(16,185,129,0.25), rgba(91,141,239,0.3) 35%, rgba(124,92,252,0.4) 65%, rgba(139,108,255,0.2) 100%)",
                                    animation: "scoreGlowPulse 5s ease-in-out infinite",
                                    filter: "blur(30px)",
                                }}
                            />
                            {/* Layer 2: Focused mid glow — purple dominant */}
                            <div
                                className="absolute inset-[-28px] rounded-full blur-[45px] opacity-30"
                                style={{ background: "radial-gradient(circle, #7C5CFC 0%, #5b8def 40%, rgba(16,185,129,0.4) 65%, transparent 80%)" }}
                            />
                            {/* Layer 3: Tight inner glow */}
                            <div
                                className="absolute inset-[-10px] rounded-full blur-[22px] opacity-20"
                                style={{ background: "radial-gradient(circle, #9F84FD 0%, transparent 55%)" }}
                            />

                            {/* SVG Ring */}
                            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                                <defs>
                                    {/* Arc gradient: green → blue → purple (matches app color hierarchy) */}
                                    <linearGradient id="scoreGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="18%" stopColor="#10b981" />
                                        <stop offset="32%" stopColor="#3b9ee0" />
                                        <stop offset="45%" stopColor="#5b8def" />
                                        <stop offset="60%" stopColor="#5b8def" />
                                        <stop offset="75%" stopColor="#6a6ff5" />
                                        <stop offset="88%" stopColor="#7C5CFC" />
                                        <stop offset="100%" stopColor="#8B6CFF" />
                                    </linearGradient>
                                    {/* Arc glow filter */}
                                    <filter id="arcGlow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    {/* Tip dot glow filter */}
                                    <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                                        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                                        <feMerge>
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="blur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    {/* Inner glass gradient */}
                                    <radialGradient id="innerGlass" cx="50%" cy="40%" r="50%">
                                        <stop offset="0%" stopColor="rgba(124,92,252,0.04)" />
                                        <stop offset="100%" stopColor="rgba(7,3,18,0.5)" />
                                    </radialGradient>
                                </defs>

                                {/* Outer decorative ring */}
                                <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(124,92,252,0.06)" strokeWidth="0.5" />

                                {/* Inner glass disc */}
                                <circle cx="100" cy="100" r="78" fill="url(#innerGlass)" stroke="rgba(124,92,252,0.08)" strokeWidth="0.5" />

                                {/* Track ring */}
                                <circle
                                    cx="100" cy="100" r={RADIUS}
                                    fill="none"
                                    stroke="rgba(124,92,252,0.1)"
                                    strokeWidth="8"
                                />

                                {/* Wide soft glow behind progress */}
                                <circle
                                    cx="100" cy="100" r={RADIUS}
                                    fill="none"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="20"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={circleOffset}
                                    opacity="0.18"
                                    style={{
                                        transition: "stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                        filter: "blur(12px)",
                                    }}
                                />

                                {/* Main progress arc with glow filter */}
                                <circle
                                    cx="100" cy="100" r={RADIUS}
                                    fill="none"
                                    stroke="url(#scoreGradient)"
                                    strokeWidth="9"
                                    strokeLinecap="round"
                                    strokeDasharray={CIRCUMFERENCE}
                                    strokeDashoffset={circleOffset}
                                    filter="url(#arcGlow)"
                                    style={{
                                        transition: "stroke-dashoffset 2.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                    }}
                                />

                                {/* Endpoint tip dot */}
                                {showTip && (
                                    <circle
                                        cx={TIP_X}
                                        cy={TIP_Y}
                                        r="5"
                                        fill="#c4b5fd"
                                        filter="url(#dotGlow)"
                                        style={{ animation: "tipFadeIn 0.6s ease-out" }}
                                    />
                                )}
                            </svg>

                            {/* Center content */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <CountUp
                                    from={0}
                                    to={HEALTH_SCORE}
                                    duration={2.5}
                                    delay={0.2}
                                    className="text-6xl md:text-7xl font-normal text-white tabular-nums tracking-tight"
                                    // @ts-ignore
                                    style={{ textShadow: "0 0 40px rgba(124,92,252,0.45), 0 0 80px rgba(124,92,252,0.15)" }}
                                />
                                <p className="text-xs md:text-sm mt-2 font-medium tracking-[0.2em] uppercase"
                                    style={{ color: "rgba(180,160,255,0.85)" }}>
                                    {language === 'cs' ? 'Zdraví firmy' : 'Company Health'}
                                </p>
                            </div>
                        </div>

                        {/* Score status badge */}
                        <div className="mt-5 text-center">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full"
                                style={{ background: "rgba(45,212,191,0.06)", border: "1px solid rgba(45,212,191,0.12)" }}>
                                <div className="w-1.5 h-1.5 rounded-full" style={{ background: HEALTH_SCORE >= 70 ? UP_COLOR : HEALTH_SCORE >= 40 ? "#f59e0b" : DOWN_COLOR }} />
                                <p className="text-[13px] font-medium" style={{ color: HEALTH_SCORE >= 70 ? "rgba(45,212,191,0.9)" : HEALTH_SCORE >= 40 ? "rgba(245,158,11,0.9)" : "rgba(244,114,182,0.9)" }}>
                                    {HEALTH_SCORE >= 70
                                        ? (language === 'cs' ? 'Firma je v dobré kondici' : 'Company is in good shape')
                                        : HEALTH_SCORE >= 40
                                            ? (language === 'cs' ? 'Vyžaduje pozornost' : 'Needs attention')
                                            : (language === 'cs' ? 'Kritický stav' : 'Critical state')
                                    }
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════ */}
                    {/* SECTION 2: Mini KPI Cards                   */}
                    {/* ═══════════════════════════════════════════ */}
                    <section>
                        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 md:gap-4">
                            {kpiData.map((kpi, idx) => {
                                const isUp = kpi.changeDirection === "up"
                                return (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl backdrop-blur-sm p-5 md:p-6 transition-all duration-300 hover:scale-[1.02]"
                                        style={{
                                            border: "1px solid rgba(124,92,252,0.15)",
                                            background: "rgba(124,92,252,0.06)",
                                        }}
                                    >
                                        {/* Title - small, subtle */}
                                        <p className="text-[11px] md:text-xs font-normal uppercase tracking-widest mb-4"
                                            style={{ color: "rgba(180,160,255,0.9)" }}>
                                            {language === 'cs' ? kpi.titleCs : kpi.titleEn}
                                        </p>

                                        {/* Main row: big number + big arrow icon */}
                                        <div className="flex items-center justify-between">
                                            {/* Number */}
                                            <div className="flex items-baseline gap-1.5">
                                                <CountUp
                                                    from={0}
                                                    to={kpi.value}
                                                    duration={2}
                                                    delay={0.1 * idx}
                                                    className="text-[34px] md:text-[42px] font-semibold text-white tabular-nums leading-none"
                                                />
                                                <span className="text-xs md:text-sm font-normal" style={{ color: "rgba(180,160,255,0.85)" }}>
                                                    {kpi.suffix}
                                                </span>
                                            </div>

                                            {/* Arrow icon - prominent */}
                                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center"
                                                style={{ background: isUp ? UP_BG : DOWN_BG }}>
                                                {isUp
                                                    ? <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: UP_COLOR }} weight="bold" />
                                                    : <ArrowDownRight className="w-5 h-5 md:w-6 md:h-6" style={{ color: DOWN_COLOR }} weight="bold" />
                                                }
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════ */}
                    {/* SECTION 3: Alert / Insight Cards            */}
                    {/* ═══════════════════════════════════════════ */}
                    <section>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            {alertCards.map((card, idx) => {
                                const Icon = card.icon
                                const a = alertAccents[card.accent]

                                return (
                                    <div
                                        key={idx}
                                        className="group relative rounded-2xl backdrop-blur-sm p-6 md:p-8 transition-all duration-300 hover:scale-[1.01]"
                                        style={{
                                            border: "1px solid rgba(124,92,252,0.15)",
                                            borderLeft: `3px solid ${a.border}`,
                                            background: "rgba(124,92,252,0.06)",
                                        }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-start gap-4 mb-5">
                                            <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                                                style={{
                                                    background: a.iconBg,
                                                    border: `1px solid ${a.iconBorder}`,
                                                }}>
                                                <Icon className="w-5 h-5" style={{ color: a.iconText }} weight="duotone" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-white mb-1.5">
                                                    {language === 'cs' ? card.titleCs : card.titleEn}
                                                </h3>
                                                <p className="text-sm leading-relaxed" style={{ color: "rgba(210,200,235,0.9)" }}>
                                                    {language === 'cs' ? card.descriptionCs : card.descriptionEn}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Bottom metric + link */}
                                        <div className="flex items-center justify-between pt-5" style={{ borderTop: "1px solid rgba(124,92,252,0.18)" }}>
                                            <div className="flex items-baseline gap-2">
                                                <CountUp
                                                    from={0}
                                                    to={card.metricValue}
                                                    duration={2}
                                                    delay={0.5}
                                                    className="text-2xl md:text-3xl font-semibold tabular-nums"
                                                    // @ts-ignore
                                                    style={{ color: a.metric }}
                                                />
                                                <span className="text-xs" style={{ color: "rgba(210,200,235,0.85)" }}>
                                                    {language === 'cs' ? card.metricLabelCs : card.metricLabelEn}
                                                </span>
                                            </div>
                                            <Link
                                                href={card.linkHref}
                                                className="flex items-center gap-1.5 text-[13px] font-medium transition-colors"
                                                style={{ color: "rgba(180,160,255,0.9)" }}
                                                onMouseEnter={(e) => e.currentTarget.style.color = "#B8A4FE"}
                                                onMouseLeave={(e) => e.currentTarget.style.color = "rgba(180,160,255,0.9)"}
                                            >
                                                {language === 'cs' ? card.linkLabelCs : card.linkLabelEn}
                                                <ArrowRight className="w-3.5 h-3.5" weight="bold" />
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* ═══════════════════════════════════════════ */}
                    {/* SECTION 4: Touch Bar                        */}
                    {/* ═══════════════════════════════════════════ */}
                    <section className="pb-2">
                        <div
                            className="rounded-2xl px-3 py-2.5 flex items-center justify-between overflow-x-auto scrollbar-hide"
                            style={{
                                border: "1px solid rgba(124,92,252,0.15)",
                                background: "rgba(124,92,252,0.06)",
                            }}
                        >
                            {barIndicators.map((item, idx) => {
                                const isUp = item.direction === "up"
                                return (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-2 px-4 md:px-5 py-2 rounded-xl shrink-0 transition-all duration-200 cursor-default"
                                        onMouseEnter={(e) => e.currentTarget.style.background = "rgba(124,92,252,0.07)"}
                                        onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                                    >
                                        <span className="text-sm font-normal" style={{ color: "rgba(180,160,255,0.9)" }}>
                                            {language === 'cs' ? item.labelCs : item.labelEn}
                                        </span>
                                        {isUp
                                            ? <ArrowUpRight className="w-4 h-4" style={{ color: UP_COLOR }} weight="bold" />
                                            : <ArrowDownRight className="w-4 h-4" style={{ color: DOWN_COLOR }} weight="bold" />
                                        }
                                    </div>
                                )
                            })}
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
