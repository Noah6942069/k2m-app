"use client"

import { useTranslation } from "@/lib/i18n/language-context"
import { FilterPanel } from "@/components/filters/FilterPanel"
import CountUp from "@/components/ui/CountUp"
import { ArrowUpRight, ArrowDownRight } from "@phosphor-icons/react"

// ── Palette ──
const UP_COLOR = "#2dd4bf"
const DOWN_COLOR = "#f472b6"

function getIndexColor(score: number): string {
    if (score >= 70) return "#7C5CFC"
    if (score >= 40) return "#5b8def"
    return "#2dd4bf"
}

// ── Sub-metric ──
interface SubMetric { label: string; value: string; percent: number }

// ── Index ──
interface IndexDef {
    id: string
    titleKey: string
    score: number
    trend: number
    subMetrics: SubMetric[]
}

// ── Mock data ──
function getIndexes(t: any): IndexDef[] {
    return [
        {
            id: "master", titleKey: "master", score: 74, trend: 3.2,
            subMetrics: [
                { label: t.indexes.masterMetric1, value: "78", percent: 78 },
                { label: t.indexes.masterMetric2, value: "45", percent: 45 },
                { label: t.indexes.masterMetric3, value: "68", percent: 68 },
                { label: t.indexes.masterMetric4, value: "71", percent: 71 },
            ],
        },
        {
            id: "financial", titleKey: "financial", score: 78, trend: 4.1,
            subMetrics: [
                { label: t.indexes.financialMetric1, value: "18.5%", percent: 74 },
                { label: t.indexes.financialMetric2, value: "42%", percent: 84 },
                { label: t.indexes.financialMetric3, value: "2.4M", percent: 62 },
                { label: t.indexes.financialMetric4, value: "1.2M", percent: 48 },
            ],
        },
        {
            id: "risk", titleKey: "risk", score: 45, trend: -2.8,
            subMetrics: [
                { label: t.indexes.riskMetric1, value: "34%", percent: 34 },
                { label: t.indexes.riskMetric2, value: "18%", percent: 56 },
                { label: t.indexes.riskMetric3, value: "0.42", percent: 42 },
                { label: t.indexes.riskMetric4, value: "6.2m", percent: 52 },
            ],
        },
        {
            id: "liquidity", titleKey: "liquidity", score: 68, trend: 1.5,
            subMetrics: [
                { label: t.indexes.liquidityMetric1, value: "3.8M", percent: 72 },
                { label: t.indexes.liquidityMetric2, value: "1.6", percent: 64 },
                { label: t.indexes.liquidityMetric3, value: "2.1M", percent: 55 },
                { label: t.indexes.liquidityMetric4, value: "8.4", percent: 70 },
            ],
        },
        {
            id: "growth", titleKey: "growth", score: 71, trend: 5.6,
            subMetrics: [
                { label: t.indexes.growthMetric1, value: "+22%", percent: 82 },
                { label: t.indexes.growthMetric2, value: "+3.1%", percent: 68 },
                { label: t.indexes.growthMetric3, value: "112%", percent: 86 },
                { label: t.indexes.growthMetric4, value: "+8%", percent: 60 },
            ],
        },
        {
            id: "operational", titleKey: "operational", score: 84, trend: 2.3,
            subMetrics: [
                { label: t.indexes.operationalMetric1, value: "420K", percent: 78 },
                { label: t.indexes.operationalMetric2, value: "72%", percent: 72 },
                { label: t.indexes.operationalMetric3, value: "88", percent: 88 },
                { label: t.indexes.operationalMetric4, value: "1.8x", percent: 75 },
            ],
        },
        {
            id: "customer", titleKey: "customer", score: 62, trend: -1.2,
            subMetrics: [
                { label: t.indexes.customerMetric1, value: "38%", percent: 38 },
                { label: t.indexes.customerMetric2, value: "4.2%", percent: 58 },
                { label: t.indexes.customerMetric3, value: "14m", percent: 70 },
                { label: t.indexes.customerMetric4, value: "104%", percent: 78 },
            ],
        },
    ]
}

// ── KPI Summary Cards ──
const kpiCards = [
    { titleCs: "Celkové Skóre", titleEn: "Overall Score", value: 74, suffix: "/100", color: "#7C5CFC" },
    { titleCs: "Trend Skóre", titleEn: "Score Trend", value: 3.2, suffix: "%", color: "#5b8def" },
    { titleCs: "Sledované Indexy", titleEn: "Indexes Tracked", value: 6, suffix: "", color: "#2dd4bf" },
    { titleCs: "Aktuálnost Dat", titleEn: "Data Freshness", value: 24, suffix: "h", color: "#7C5CFC" },
]

export default function BusinessIntelligencePage() {
    const { language, t } = useTranslation()
    const indexes = getIndexes(t)
    const masterIndex = indexes[0]
    const subIndexes = indexes.slice(1)

    return (
        <div className="flex-1 min-h-screen">
            <div className="px-4 md:px-10 pt-6 space-y-4 md:space-y-6">
                <FilterPanel allowedPresets={["month"]} />

                {/* KPI Summary Cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-5">
                    {kpiCards.map((card, idx) => (
                        <div
                            key={idx}
                            className="rounded-3xl bg-white/[0.03] backdrop-blur-sm px-5 md:px-7 py-4 md:py-5 min-h-[100px] md:min-h-[120px]"
                            style={{
                                borderTop: "1px solid rgba(255,255,255,0.12)",
                                borderRight: "1px solid rgba(255,255,255,0.12)",
                                borderBottom: "1px solid rgba(255,255,255,0.12)",
                                borderLeft: `4px solid ${card.color}`,
                            }}
                        >
                            <p className="text-[10px] md:text-xs font-normal uppercase tracking-widest mb-3"
                                style={{ color: "rgba(180,160,255,0.9)" }}>
                                {language === "cs" ? card.titleCs : card.titleEn}
                            </p>
                            <div className="flex items-baseline gap-1">
                                <CountUp
                                    from={0} to={card.value} duration={2} delay={0.1 * idx}
                                    className="text-[26px] md:text-[42px] font-semibold text-white tabular-nums leading-none"
                                />
                                {card.suffix && (
                                    <span className="text-xs md:text-sm font-normal" style={{ color: "rgba(180,160,255,0.85)" }}>
                                        {card.suffix}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Master Company Score */}
                <div
                    className="rounded-3xl bg-white/[0.03] backdrop-blur-sm p-5 md:p-8"
                    style={{
                        borderTop: "1px solid rgba(255,255,255,0.12)",
                        borderRight: "1px solid rgba(255,255,255,0.12)",
                        borderBottom: "1px solid rgba(255,255,255,0.12)",
                        borderLeft: `4px solid ${getIndexColor(masterIndex.score)}`,
                    }}
                >
                    <p className="text-[10px] md:text-xs font-normal uppercase tracking-widest"
                        style={{ color: "rgba(180,160,255,0.9)" }}>
                        {t.indexes.masterTitle}
                    </p>

                    <div className="flex items-baseline gap-2 mt-3">
                        <CountUp from={0} to={masterIndex.score} duration={2}
                            className="text-[40px] md:text-[56px] font-semibold text-white tabular-nums leading-none" />
                        <span className="text-base font-normal" style={{ color: "rgba(180,160,255,0.6)" }}>/100</span>
                        <Trend value={masterIndex.trend} />
                    </div>

                    <p className="text-xs text-gray-400 mt-2 mb-5">{t.indexes.masterDesc}</p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-3 pt-4 border-t border-white/[0.06]">
                        {masterIndex.subMetrics.map((m, i) => (
                            <MetricRow key={i} metric={m} />
                        ))}
                    </div>
                </div>

                {/* Sub-Index Cards */}
                {[0, 2, 4].map((start) => (
                    <div key={start} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {subIndexes.slice(start, start + 2).map((idx) => (
                            <IndexCard key={idx.id} index={idx} t={t} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

// ── Index Card ──
function IndexCard({ index, t }: { index: IndexDef; t: any }) {
    const titleKey = `${index.titleKey}Title` as keyof typeof t.indexes
    const descKey = `${index.titleKey}Desc` as keyof typeof t.indexes

    return (
        <div
            className="rounded-3xl bg-white/[0.03] backdrop-blur-sm p-4 md:p-7 min-h-[200px] md:min-h-[320px] flex flex-col"
            style={{
                borderTop: "1px solid rgba(255,255,255,0.12)",
                borderRight: "1px solid rgba(255,255,255,0.12)",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
                borderLeft: `4px solid ${getIndexColor(index.score)}`,
            }}
        >
            <p className="text-[10px] md:text-xs font-normal uppercase tracking-widest"
                style={{ color: "rgba(180,160,255,0.9)" }}>
                {t.indexes[titleKey]}
            </p>

            <div className="flex items-baseline gap-1.5 mt-2">
                <CountUp from={0} to={index.score} duration={2}
                    className="text-[28px] md:text-[40px] font-semibold text-white tabular-nums leading-none" />
                <span className="text-sm font-normal" style={{ color: "rgba(180,160,255,0.6)" }}>/100</span>
                <Trend value={index.trend} />
            </div>

            <p className="text-[11px] md:text-xs text-gray-400 mt-2 leading-relaxed">
                {t.indexes[descKey]}
            </p>

            <div className="mt-auto pt-4 border-t border-white/[0.06] space-y-2.5">
                {index.subMetrics.map((m, i) => (
                    <MetricRow key={i} metric={m} />
                ))}
            </div>
        </div>
    )
}

// ── Metric row ──
function MetricRow({ metric }: { metric: SubMetric }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-gray-400">{metric.label}</span>
                <span className="text-[11px] font-medium text-white tabular-nums">{metric.value}</span>
            </div>
            <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div className="h-full rounded-full"
                    style={{ width: `${metric.percent}%`, backgroundColor: getIndexColor(metric.percent) }} />
            </div>
        </div>
    )
}

// ── Trend ──
function Trend({ value }: { value: number }) {
    const up = value >= 0
    return (
        <span className="text-xs font-medium flex items-center gap-0.5 ml-2"
            style={{ color: up ? UP_COLOR : DOWN_COLOR }}>
            {up ? <ArrowUpRight size={12} weight="bold" /> : <ArrowDownRight size={12} weight="bold" />}
            {up ? "+" : ""}{value}%
        </span>
    )
}
