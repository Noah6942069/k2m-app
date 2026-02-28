"use client"

import { useState, useRef } from "react"
import {
    Users, HardDrives, Wallet,
    ArrowRight, Lightbulb, CheckCircle, CaretDown, CaretUp,
    TrendDown, Info, Clock, ArrowUpRight, ArrowDownRight
} from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import CountUp from "@/components/ui/CountUp"

// --- Risk Data ---

const risksData = [
    {
        id: "klienti",
        title: "Závislost na klíčových klientech",
        severity: "Vysoká",
        // Purple = most severe
        accentText: "text-purple-400",
        accentBg: "bg-purple-500/10",
        accentBorder: "border-purple-500/20",
        leftBorder: "border-l-purple-500",
        barBg: "bg-purple-500",
        icon: Users,
        probability: 75,
        impact: "Kritický",
        trend: "Rostoucí",
        trendDirection: "up" as const,
        timeHorizon: "3-6 měsíců",
        affectedAreas: ["Cash Flow", "Obchodní strategie", "Vyjednávací pozice", "Pricing"],
        riskAnalysis: {
            title: "Analýza Rizika: Nestabilita příjmů",
            content: [
                "Top 3 klienti tvoří 68% vašich celkových příjmů. Tato koncentrace představuje kritické riziko pro stabilitu cash flow. Ztráta jediného z těchto klientů by znamenala okamžitý výpadek příjmů, který byste nedokázali pokrýt z rezerv.",
                "Zároveň tato závislost oslabuje vaši vyjednávací pozici při cenotvorbě a nutí firmu přistupovat na nevýhodné podmínky ze strachu o ztrátu zakázky."
            ]
        },
        solution: {
            title: "Strategie Diverzifikace",
            timeEstimate: "6-12 měsíců",
            steps: [
                { title: "Akvizice SMB Klientů", desc: "Aktivní oslovování menších klientů (obrat 10-50M) pro rozložení rizika. Cíl: 10 nových klientů do ročního portfolia." },
                { title: "Produktizace Služeb", desc: "Vytvoření standardizovaných balíčků služeb, které jsou snadno prodejné a nevyžadují custom vývoj (škálovatelnost)." },
                { title: "Retenční Smlouvy", desc: "Převedení klíčových klientů na 2-leté kontrakty výměnou za fixaci ceny, což zajistí střednědobou stabilitu." },
            ],
        }
    },
    {
        id: "sezonnost",
        title: "Sezónní výkyvy tržeb",
        severity: "Střední",
        // Blue = medium severity
        accentText: "text-blue-400",
        accentBg: "bg-blue-500/10",
        accentBorder: "border-blue-500/20",
        leftBorder: "border-l-blue-500",
        barBg: "bg-blue-500",
        icon: TrendDown,
        probability: 60,
        impact: "Vysoký",
        trend: "Stabilní",
        trendDirection: "stable" as const,
        timeHorizon: "1-3 měsíce",
        affectedAreas: ["Cash Flow", "Provozní náklady", "Plánování", "HR"],
        riskAnalysis: {
            title: "Analýza Rizika: Q1 Propad",
            content: [
                "Historická data ukazují pravidelný propad tržeb o 40% v prvním kvartálu. Fixní náklady (mzdy, nájem, licence) však zůstávají neměnné, což v tomto období dostává firmu do červených čísel.",
                "Tento cyklus nutí firmu vytvářet v Q4 neúměrně vysoké rezervy, které pak 'projedí' v Q1, místo aby je investovala do rozvoje a inovací."
            ]
        },
        solution: {
            title: "Vyhlazení Cash Flow",
            timeEstimate: "3 měsíce",
            steps: [
                { title: "Sezónní Off-peak Produkty", desc: "Spuštění 'auditních' a 'plánovacích' služeb, o které je zájem právě na začátku roku (kdy se neinvestuje do kampaní)." },
                { title: "Alokace 15% Reservy", desc: "Automatické odkládání 15% ze zisku v Q3 a Q4 na specializovaný spořící účet pro krytí nákladů v Q1." },
                { title: "Flexibilní Náklady", desc: "Renegociace smluv s kontraktory na 'performance-based' odměňování, které kopíruje vývoj tržeb." },
            ],
        }
    },
    {
        id: "technologie",
        title: "Technologický dluh",
        severity: "Střední",
        // Blue = medium severity
        accentText: "text-blue-400",
        accentBg: "bg-blue-500/10",
        accentBorder: "border-blue-500/20",
        leftBorder: "border-l-blue-500",
        barBg: "bg-blue-500",
        icon: HardDrives,
        probability: 55,
        impact: "Kritický",
        trend: "Rostoucí",
        trendDirection: "up" as const,
        timeHorizon: "6-12 měsíců",
        affectedAreas: ["IT Infrastruktura", "Bezpečnost dat", "Efektivita", "Integrace"],
        riskAnalysis: {
            title: "Analýza Rizika: Zastaralý SW",
            content: [
                "Klíčové procesy běží na on-premise řešení, kterému končí podpora. Riziko výpadku serveru nebo ztráty dat je hodnoceno jako 'Střední', ale s dopadem 'Kritický'.",
                "Současná infrastruktura navíc neumožňuje snadnou integraci s moderními API (AI nástroje, automatizace), což brzdí efektivitu týmu a zvyšuje mzdové náklady na manuální práci."
            ]
        },
        solution: {
            title: "Cloudová Transformace",
            timeEstimate: "6 měsíců",
            steps: [
                { title: "Migrace do Cloudu", desc: "Přesun databáze a CRM na AWS/Azure. Zajištění 99.9% dostupnosti a automatického zálohování." },
                { title: "Bezpečnostní Audit", desc: "Implementace SSO a 2FA pro všechny interní systémy. Minimalizace rizika úniku dat." },
                { title: "API-First Přístup", desc: "Vytvoření integrační vrstvy pro napojení externích nástrojů, což umožní automatizaci reportingu." },
            ],
        }
    },
    {
        id: "cashflow",
        title: "Nízká finanční rezerva",
        severity: "Nízká",
        // Green = least severe
        accentText: "text-emerald-400",
        accentBg: "bg-emerald-500/10",
        accentBorder: "border-emerald-500/20",
        leftBorder: "border-l-emerald-500",
        barBg: "bg-emerald-500",
        icon: Wallet,
        probability: 40,
        impact: "Střední",
        trend: "Klesající",
        trendDirection: "down" as const,
        timeHorizon: "12-18 měsíců",
        affectedAreas: ["Likvidita", "Investiční příležitosti", "Provozní stabilita"],
        riskAnalysis: {
            title: "Analýza Rizika: Runway < 2 měsíce",
            content: [
                "Aktuální hotovostní rezerva pokrývá pouze 1.8 měsíce provozu při nulových tržbách. Bezpečný standard pro vaši velikost firmy je 4-6 měsíců.",
                "Tento stav vytváří stres při každém zpoždění platby od klienta a znemožňuje využít neočekávané investiční příležitosti (např. akvizice menšího konkurenta)."
            ]
        },
        solution: {
            title: "Budování Finančního Polštáře",
            timeEstimate: "18 měsíců",
            steps: [
                { title: "Pravidlo 10%", desc: "Strikní alokace 10% z každé přijaté faktury na rezervní účet, dokud nebude dosaženo cíle 3M Kč." },
                { title: "Revolvingový Úvěr", desc: "Sjednání kontokorentu ve výši 2M Kč jako 'pojistky' pro překlenutí krátkodobých výpadků cash flow." },
                { title: "Optimalizace Splatnosti", desc: "Nastavení splatnosti faktur dodavatelům na 30 dní a klientům na 14 dní pro zlepšení obrátkovosti peněz." },
            ],
        }
    }
]

// --- Page Component ---

export default function RizikaPage() {
    const [expandedRisks, setExpandedRisks] = useState<Record<string, boolean>>({})
    const riskRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const toggleRisk = (id: string) => {
        setExpandedRisks(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const handleSolutionClick = (id: string) => {
        const isCurrentlyExpanded = expandedRisks[id]
        if (!isCurrentlyExpanded) {
            setExpandedRisks(prev => ({ ...prev, [id]: true }))
            setTimeout(() => {
                riskRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 150)
        } else {
            riskRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className="flex-1 min-h-screen">
            <div className="px-4 md:px-10 pt-6 pb-6 space-y-8 md:space-y-10">

                {/* === COMPACT OVERVIEW ROW === */}
                <div className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row md:items-center md:divide-x divide-white/5">
                        {/* Risk Score */}
                        <div className="flex items-center gap-4 px-4 md:px-8 py-4 md:py-5">
                            <div className="w-12 h-12 rounded-full border-2 border-purple-500/40 flex items-center justify-center">
                                <CountUp from={0} to={72} duration={2} className="text-lg font-bold text-purple-400" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white">Rizikové skóre</p>
                                <p className="text-xs text-purple-400">Zvýšené</p>
                            </div>
                        </div>

                        {/* Vysoká */}
                        <div className="flex items-center gap-4 px-4 md:px-8 py-4 md:py-5 flex-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-300">Vysoká</span>
                                    <div className="flex items-center gap-2">
                                        <CountUp from={0} to={1} duration={1.5} className="text-lg font-bold text-purple-400" />
                                        <span className="text-xs text-gray-500"><CountUp from={0} to={25} duration={2} />%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[25%] bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Střední */}
                        <div className="flex items-center gap-4 px-4 md:px-8 py-4 md:py-5 flex-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-300">Střední</span>
                                    <div className="flex items-center gap-2">
                                        <CountUp from={0} to={2} duration={1.5} className="text-lg font-bold text-blue-400" />
                                        <span className="text-xs text-gray-500"><CountUp from={0} to={50} duration={2} />%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[50%] bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" />
                                </div>
                            </div>
                        </div>

                        {/* Nízká */}
                        <div className="flex items-center gap-4 px-4 md:px-8 py-4 md:py-5 flex-1">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-gray-300">Nízká</span>
                                    <div className="flex items-center gap-2">
                                        <CountUp from={0} to={1} duration={1.5} className="text-lg font-bold text-emerald-400" />
                                        <span className="text-xs text-gray-500"><CountUp from={0} to={25} duration={2} />%</span>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[25%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === RISK CARDS === */}
                <div>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-1.5 h-8 rounded-full bg-purple-500" />
                        <h2 className="text-2xl font-bold text-white">Identifikovaná rizika</h2>
                    </div>

                    <div className="stagger-grid space-y-6">
                        {risksData.map((risk) => {
                            const Icon = risk.icon
                            const isExpanded = expandedRisks[risk.id]

                            return (
                                <div
                                    key={risk.id}
                                    className={cn(
                                        "rounded-3xl border border-white/5 border-l-4 bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300 hover:border-white/10",
                                        risk.leftBorder
                                    )}
                                >
                                    {/* Collapsed Header */}
                                    <div className="p-4 md:p-8">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                            {/* Left: Icon + Title + Badge */}
                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shadow-black/5", risk.accentBg, risk.accentBorder)}>
                                                    <Icon className={cn("w-6 h-6", risk.accentText)} weight="duotone" />
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white">{risk.title}</h3>
                                                    <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide inline-block mt-1", risk.accentText, risk.accentBg)}>
                                                        {risk.severity} Priorita
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Middle: Description */}
                                            <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 flex-1 max-w-xl">
                                                {risk.riskAnalysis.content[0]}
                                            </p>

                                            {/* Right: Buttons */}
                                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3 shrink-0 w-full sm:w-auto">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => toggleRisk(risk.id)}
                                                    className="h-10 md:h-11 px-4 md:px-5 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold gap-2 transition-all active:scale-95 text-sm"
                                                >
                                                    <Info className="w-4 h-4 text-blue-400" weight="duotone" />
                                                    Více informací
                                                    {isExpanded ? <CaretUp className="w-4 h-4 ml-1 opacity-50" weight="duotone" /> : <CaretDown className="w-4 h-4 ml-1 opacity-50" weight="duotone" />}
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => handleSolutionClick(risk.id)}
                                                    className="h-10 md:h-11 px-4 md:px-5 rounded-xl border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 font-bold gap-2 transition-all active:scale-95 text-sm"
                                                >
                                                    <Lightbulb className="w-4 h-4 text-emerald-400" weight="duotone" />
                                                    Řešení
                                                </Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Content */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 animate-in slide-in-from-top-2 duration-500 bg-white/[0.01]">
                                            <div className="p-4 md:p-8 space-y-5 md:space-y-6">

                                                {/* ========== SECTION A: RISK ANALYSIS ========== */}

                                                {/* Section header */}
                                                <div className="flex items-center gap-3">
                                                    <div className={cn("w-1.5 h-8 rounded-full", risk.barBg)} />
                                                    <h3 className="text-xl font-bold text-white">{risk.riskAnalysis.title}</h3>
                                                </div>

                                                {/* Stat cards */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                    <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 md:p-5 text-center">
                                                        <p className={cn("text-xl md:text-2xl font-bold mb-1", risk.accentText)}><CountUp from={0} to={risk.probability} duration={2} />%</p>
                                                        <p className="text-xs text-gray-500">Pravděpodobnost</p>
                                                        <div className="flex items-center justify-center gap-1 mt-1.5">
                                                            {risk.trendDirection === "up" && <ArrowUpRight className={cn("w-3 h-3", risk.accentText)} weight="duotone" />}
                                                            {risk.trendDirection === "down" && <ArrowDownRight className={cn("w-3 h-3", risk.accentText)} weight="duotone" />}
                                                            {risk.trendDirection === "stable" && <ArrowRight className={cn("w-3 h-3", risk.accentText)} weight="duotone" />}
                                                            <span className="text-[10px] text-gray-600">{risk.trend}</span>
                                                        </div>
                                                    </div>
                                                    <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 md:p-5 text-center">
                                                        <p className={cn("text-xl md:text-2xl font-bold mb-1", risk.accentText)}>{risk.impact}</p>
                                                        <p className="text-xs text-gray-500">Dopad</p>
                                                        <p className="text-[10px] text-gray-600 mt-1.5">Na operace firmy</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 md:p-5 text-center">
                                                        <div className="flex items-center justify-center gap-1.5 mb-1">
                                                            {risk.trendDirection === "up" && <ArrowUpRight className={cn("w-4 h-4 md:w-5 md:h-5", risk.accentText)} weight="duotone" />}
                                                            {risk.trendDirection === "down" && <ArrowDownRight className={cn("w-4 h-4 md:w-5 md:h-5", risk.accentText)} weight="duotone" />}
                                                            {risk.trendDirection === "stable" && <ArrowRight className={cn("w-4 h-4 md:w-5 md:h-5", risk.accentText)} weight="duotone" />}
                                                            <p className={cn("text-lg md:text-2xl font-bold", risk.accentText)}>{risk.trend}</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">Trend</p>
                                                    </div>
                                                    <div className="rounded-2xl bg-white/[0.03] border border-white/5 p-3 md:p-5 text-center">
                                                        <div className="flex items-center justify-center gap-1.5 mb-1">
                                                            <Clock className={cn("w-4 h-4 md:w-5 md:h-5", risk.accentText)} weight="duotone" />
                                                        </div>
                                                        <p className={cn("text-base md:text-lg font-bold", risk.accentText)}>{risk.timeHorizon}</p>
                                                        <p className="text-xs text-gray-500">Časový horizont</p>
                                                    </div>
                                                </div>

                                                {/* Analysis paragraphs + affected areas */}
                                                <div className="space-y-4">
                                                    {risk.riskAnalysis.content.map((paragraph, i) => (
                                                        <p key={i} className={cn("text-gray-400 text-sm leading-relaxed border-l-2 pl-5", risk.accentBorder)}>
                                                            {paragraph}
                                                        </p>
                                                    ))}
                                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                                        {risk.affectedAreas.map((area, idx) => (
                                                            <span key={idx} className={cn("px-2.5 py-1 rounded-full text-[11px] font-medium border", risk.accentBg, risk.accentBorder, risk.accentText)}>
                                                                {area}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* ========== SECTION B: ŘEŠENÍ ========== */}
                                                <div
                                                    ref={(el) => { riskRefs.current[risk.id] = el }}
                                                    className="scroll-mt-24 pt-6 mt-2 border-t border-dashed border-white/10"
                                                >
                                                    <div className="flex items-center gap-3 mb-5">
                                                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" weight="duotone" />
                                                        <h4 className="text-lg font-bold text-white">{risk.solution.title}</h4>
                                                        <span className="text-xs text-emerald-400 font-medium ml-auto">{risk.solution.timeEstimate}</span>
                                                    </div>

                                                    <div className="space-y-3">
                                                        {risk.solution.steps.map((step, idx) => (
                                                            <div key={idx} className="flex gap-3 items-baseline">
                                                                <span className="text-xs font-bold text-emerald-400 shrink-0">{idx + 1}.</span>
                                                                <p className="text-sm text-gray-300">
                                                                    <span className="font-semibold text-white">{step.title}</span>
                                                                    <span className="text-gray-500"> — </span>
                                                                    {step.desc}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}
