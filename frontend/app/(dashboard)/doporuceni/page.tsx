"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Warning, TrendUp, Question, Link, ArrowUpRight, ArrowRight, Sparkle, Users, TrendDown, HardDrives, Wallet, Info, CaretUp, CaretDown, Lightbulb, CheckCircle } from "@phosphor-icons/react"
import { BarChart, Bar, XAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

const risksData = [
    {
        id: "klienti",
        title: "Závislost na klíčových klientech",
        severity: "Vysoká",
        severityLevel: "high",
        icon: Users,
        color: "red",
        accentColor: "text-rose-500",
        bgColor: "bg-rose-500/10",
        borderColor: "border-rose-500/20",
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
                {
                    title: "Akvizice SMB Klientů",
                    desc: "Aktivní oslovování menších klientů (obrat 10-50M) pro rozložení rizika. Cíl: 10 nových klientů do ročního portfolia."
                },
                {
                    title: "Produktizace Služeb",
                    desc: "Vytvoření standardizovaných balíčků služeb, které jsou snadno prodejné a nevyžadují custom vývoj (škálovatelnost)."
                },
                {
                    title: "Retenční Smlouvy",
                    desc: "Převedení klíčových klientů na 2-leté kontrakty výměnou za fixaci ceny, což zajistí střednědobou stabilitu."
                }
            ],
            impactMetrics: {
                label: "Podíl TOP 3 klientů na tržbách",
                current: 68,
                target: 45,
                unit: "%",
                chartData: [
                    { name: 'SOUČASNÝ STAV', value: 68, color: '#e11d48' },
                    { name: 'CÍLOVÝ STAV', value: 45, color: '#22c55e' },
                ]
            }
        }
    },
    {
        id: "sezonnost",
        title: "Sezónní výkyvy tržeb",
        severity: "Střední",
        severityLevel: "medium",
        icon: TrendDown,
        color: "orange",
        accentColor: "text-orange-500",
        bgColor: "bg-orange-500/10",
        borderColor: "border-orange-500/20",
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
                {
                    title: "Sezónní Off-peak Produkty",
                    desc: "Spuštění 'auditních' a 'plánovacích' služeb, o které je zájem právě na začátku roku (kdy se neinvestuje do kampaní)."
                },
                {
                    title: "Alokace 15% Reservy",
                    desc: "Automatické odkládání 15% ze zisku v Q3 a Q4 na specializovaný spořící účet pro krytí nákladů v Q1."
                },
                {
                    title: "Flexibilní Náklady",
                    desc: "Renegociace smluv s kontraktory na 'performance-based' odměňování, které kopíruje vývoj tržeb."
                }
            ],
            impactMetrics: {
                label: "Měsíční Cash Flow v Q1",
                current: -150,
                target: 50,
                unit: "k Kč",
                chartData: [
                    { name: 'Q1 (NYNÍ)', value: -150000, color: '#f97316' },
                    { name: 'Q1 (CÍL)', value: 50000, color: '#22c55e' },
                ]
            }
        }
    },
    {
        id: "technologie",
        title: "Technologický dluh",
        severity: "Střední",
        severityLevel: "medium",
        icon: HardDrives,
        color: "blue",
        accentColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
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
                {
                    title: "Migrace do Cloudu",
                    desc: "Přesun databáze a CRM na AWS/Azure. Zajištění 99.9% dostupnosti a automatického zálohování."
                },
                {
                    title: "Bezpečnostní Audit",
                    desc: "Implementace SSO a 2FA pro všechny interní systémy. Minimalizace rizika úniku dat."
                },
                {
                    title: "API-First Přístup",
                    desc: "Vytvoření integrační vrstvy pro napojení externích nástrojů, což umožní automatizaci reportingu."
                }
            ],
            impactMetrics: {
                label: "Dostupnost systémů (SLA)",
                current: 95,
                target: 99.9,
                unit: "%",
                chartData: [
                    { name: 'NYNÍ', value: 95, color: '#3b82f6' },
                    { name: 'PO MIGRACI', value: 99.9, color: '#22c55e' },
                ]
            }
        }
    },
    {
        id: "cashflow",
        title: "Nízká finanční rezerva",
        severity: "Nízká",
        severityLevel: "low",
        icon: Wallet,
        color: "emerald",
        accentColor: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
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
                {
                    title: "Pravidlo 10%",
                    desc: "Strikní alokace 10% z každé přijaté faktury na rezervní účet, dokud nebude dosaženo cíle 3M Kč."
                },
                {
                    title: "Revolvingový Úvěr",
                    desc: "Sjednání kontokorentu ve výši 2M Kč jako 'pojistky' pro překlenutí krátkodobých výpadků cash flow."
                },
                {
                    title: "Optimalizace Splatnosti",
                    desc: "Nastavení splatnosti faktur dodavatelům na 30 dní a klientům na 14 dní pro zlepšení obrátkovosti peněz."
                }
            ],
            impactMetrics: {
                label: "Finanční rezerva (měsíce provozu)",
                current: 1.8,
                target: 6,
                unit: "měs",
                chartData: [
                    { name: 'NYNÍ', value: 1.8, color: '#3f3f46' },
                    { name: 'CÍL', value: 6, color: '#10b981' },
                ]
            }
        }
    }
]

const optimalizaceData = [
    {
        id: "meta",
        title: "Meta Reklamy",
        subtitle: "Navýšení rozpočtu o 50%",
        description: "Vaše cílová skupina vykazuje vysokou míru engagement a konverzní poměr 3.2%, což je nad průměrem odvětví (2.1%). Doporučujeme navýšit rozpočet pro maximalizaci ROI.",
        icon: ArrowUpRight,
        color: "emerald",
        accentColor: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        percentChange: "+50%",
        budget: {
            current: { label: "Aktuální rozpočet", value: "10 000 Kč", percent: 67 },
            recommended: { label: "Doporučený rozpočet", value: "15 000 Kč", percent: 100 },
        },
        stats: [
            { value: "3.2%", label: "Konverzní poměr", subtitle: "+0.6% vs minulý měsíc", subtitleColor: "emerald" },
            { value: "2.8x", label: "ROAS", subtitle: "Nad průměrem odvětví", subtitleColor: "cyan" },
            { value: "45K", label: "Dosah/měsíc", subtitle: "+12K opportunity", subtitleColor: "emerald" },
            { value: "89 Kč", label: "CPA průměr", subtitle: "Nižší než konkurence", subtitleColor: "cyan" },
        ],
        campaigns: [
            { name: "Remarketing", conversion: 4.1, color: "#10b981" },
            { name: "Lookalike audiences", conversion: 3.5, color: "#34d399" },
            { name: "Interest targeting", conversion: 2.1, color: "#6ee7b7" },
        ],
        projectionList: [
            { label: "Očekávané konverze", value: "+156/měsíc" },
            { label: "Dodatečné tržby", value: "+78 000 Kč" },
            { label: "Čistý zisk po odečtu nákladů", value: "+63 000 Kč" },
        ],
        analysisText: "Historická data ukazují konzistentní růst engagement rate. Vaše cílová skupina (25-45 let, městské oblasti) vykazuje vysokou míru interakce s obsahem. Remarketing kampaně mají nejlepší výkon díky warm audience.",
        recommendations: "Navýšit rozpočet primárně na remarketing (+3000 Kč) a lookalike (+2000 Kč). Testovat nové kreativy každé 2 týdny pro udržení engagement rate. Implementovat dynamic product ads pro e-commerce segment.",
    },
    {
        id: "google",
        title: "Google Ads",
        subtitle: "Optimalizace klíčových slov +35%",
        description: "Identifikovali jsme klíčová slova s nejvyšším výkonem, která mají potenciál pro škálování. Fokus na long-tail keywords umožní lepší pozice v aukcích při zachování efektivního CPA.",
        icon: ArrowUpRight,
        color: "blue",
        accentColor: "text-blue-500",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        percentChange: "+35%",
        budget: {
            current: { label: "Aktuální rozpočet", value: "8 000 Kč", percent: 67 },
            recommended: { label: "Doporučený rozpočet", value: "12 000 Kč", percent: 100 },
        },
        stats: [
            { value: "4.1%", label: "CTR průměr", subtitle: "+0.8% vs průměr", subtitleColor: "cyan" },
            { value: "3.5x", label: "ROAS", subtitle: "Špičkový výkon", subtitleColor: "cyan" },
            { value: "12K", label: "Kliky/měsíc", subtitle: "+5K růst", subtitleColor: "cyan" },
            { value: "67 Kč", label: "CPC průměr", subtitle: "Konkurenceschopné", subtitleColor: "cyan" },
        ],
        campaigns: [
            { name: "Search Brand", conversion: 9.2, color: "#3b82f6" },
            { name: "Search Generic", conversion: 6.5, color: "#60a5fa" },
            { name: "Performance Max", conversion: 7.8, color: "#93c5fd" },
        ],
        projectionList: [
            { label: "Očekávané kliky", value: "+4 200/měsíc" },
            { label: "Dodatečné konverze", value: "+238 konverzí" },
            { label: "Dodatečné tržby", value: "+47 000 Kč" },
        ],
        analysisText: "Long-tail klíčová slova vykazují o 45% nižší CPC při srovnatelném konverzním poměru. Performance Max kampaně ukazují silný potenciál s průměrným ROAS 3.5x.",
        recommendations: "Přesunout 40% rozpočtu z generických termínů na specifické long-tail fráze. Testovat Performance Max s různými produktovými kategoriemi. Implementovat automatické bidding strategie pro lepší pozice.",
    },
    {
        id: "email",
        title: "Email Marketing",
        subtitle: "Zvýšení efektivity o 120%",
        description: "Implementace automatizovaných retenčních sekvencí a personalizovaného obsahu může dramaticky zvýšit open rate a konverze. Aktuální open rate 18% lze zvýšit na 35%+.",
        icon: ArrowUpRight,
        color: "violet",
        accentColor: "text-violet-500",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/20",
        percentChange: "+120%",
        budget: {
            current: { label: "Aktuální rozpočet", value: "2 000 Kč", percent: 50 },
            recommended: { label: "Doporučený rozpočet", value: "4 000 Kč", percent: 100 },
        },
        stats: [
            { value: "18%", label: "Open Rate", subtitle: "+5% vs průměr", subtitleColor: "violet" },
            { value: "4.2%", label: "Click Rate", subtitle: "Nad očekáváním", subtitleColor: "violet" },
            { value: "8.5K", label: "Odběratelé", subtitle: "+1.2K nových", subtitleColor: "violet" },
            { value: "12 Kč", label: "Cena/kontakt", subtitle: "Velmi efektivní", subtitleColor: "violet" },
        ],
        campaigns: [
            { name: "Welcome série", conversion: 8.8, color: "#8b5cf6" },
            { name: "Retenční", conversion: 7.2, color: "#a78bfa" },
            { name: "Newsletter", conversion: 5.5, color: "#c4b5fd" },
        ],
        projectionList: [
            { label: "Nový open rate", value: "35% (+17%)" },
            { label: "Očekávané konverze", value: "+408 konverzí" },
            { label: "Dodatečné tržby", value: "+50 400 Kč" },
        ],
        analysisText: "Segmentace databáze do 5 klíčových skupin podle nákupního chování zvýší engagement. Welcome série generuje 3x vyšší engagement než standardní newsletter.",
        recommendations: "Zavést A/B testování předmětů emailů. Implementovat personalizované automatizované sekvence pro každý segment. Rozšířit retencní kampaně na win-back sekvence pro neaktivní uživatele.",
    },
]

const otazkyCardsData = [
    {
        id: "dodavatele",
        chartTitle: "Rozložení rizik dodavatele",
        icon: Warning,
        iconColor: "text-orange-500",
        question: "Jaká jsou hlavní rizika v dodavatelském řetězci?",
        paragraphs: [
            {
                text: "Identifikovali jsme ",
                bold: "zpoždění dodávek (35%)",
                after: " jako kritickou hrozbu. Tato otázka vyžaduje okamžitou pozornost kvůli nestabilitě v logistickém centru hlavního dodavatele."
            },
            {
                text: "Dalším rizikem je ",
                bold: "variabilita kvality materiálu (25%)",
                after: ". Doporučujeme se zaměřit na to, zda jsou stávající kontroly kvality dostatečné pro eliminaci budoucích reklamací."
            }
        ],
        chartData: [
            { name: "Zpoždění dodávek", value: 35, color: "#a855f7" },
            { name: "Kvalita materiálu", value: 25, color: "#3b82f6" },
            { name: "Rostoucí ceny", value: 20, color: "#10b981" },
            { name: "Dostupnost skladem", value: 20, color: "#7c3aed" },
        ],
        chartPosition: "left" as const,
    },
    {
        id: "produkty",
        chartTitle: "Rozdělení tržeb dle produktů",
        icon: TrendUp,
        iconColor: "text-blue-500",
        question: "Které produkty tvoří jádro naší ziskovosti?",
        paragraphs: [
            {
                text: "",
                bold: "Prémiové služby (45%)",
                after: " jsou odpovědí na otázku stability příjmů – tvoří největší podíl a mají nejvyšší marži."
            },
            {
                text: "U ",
                bold: "konzultací (15%)",
                after: " se nabízí otázka k efektivitě, jelikož vytěžují značnou část týmu s nižším relativním přínosem. Doporučujeme zhodnotit jejich budoucí roli v portfoliu."
            }
        ],
        chartData: [
            { name: "Prémiové služby", value: 45, color: "#3b82f6" },
            { name: "Standardní produkty", value: 25, color: "#7c3aed" },
            { name: "Konzultace", value: 15, color: "#10b981" },
            { name: "Ostatní", value: 15, color: "#a855f7" },
        ],
        chartPosition: "right" as const,
    },
]

const whatIfData = [
    {
        id: "trzby-rust",
        chartTitle: "Dopad růstu tržeb o 20%",
        chartPosition: "left" as const,
        icon: TrendUp,
        iconColor: "text-orange-500",
        title: "Co by kdyby tržby vzrostly o 20%?",
        sections: [
            {
                label: "Optimistický scénář:",
                text: "Při růstu tržeb o 20% (z 10M Kč na 12M Kč) a zachování současné struktury nákladů by čistý zisk vzrostl z 1M Kč na ",
                highlight: "1.4M Kč (+40%)",
                after: "."
            },
            {
                label: "Klíčové předpoklady:",
                text: "Provozní náklady rostou lineárně (45%), marketing zůstává na 20%, mzdy se zvyšují o 15% kvůli náboru nových zaměstnanců.",
            }
        ],
        tip: {
            icon: "lightbulb" as const,
            text: "Doporučení: Pro dosažení tohoto scénáře investujte do marketingu dalších 400K Kč a připravte se na nábor 2-3 nových zaměstnanců."
        },
        chartData: [
            { name: "Provozní náklady", value: 45, color: "#f97316" },
            { name: "Marketing", value: 20, color: "#d97706" },
            { name: "Mzdy", value: 20, color: "#eab308" },
            { name: "Zisk", value: 15, color: "#10b981" },
        ]
    },
    {
        id: "naklady-snizeni",
        chartTitle: "Struktura po úsporách",
        chartPosition: "right" as const,
        icon: ArrowRight,
        iconColor: "text-orange-500",
        title: "Co by kdyby se snížily provozní náklady o 10%?",
        sections: [
            {
                label: "Úsporný scénář:",
                text: "Snížení provozních nákladů o 10% (z 4.5M Kč na 4M Kč) při zachování tržeb by zvýšilo čistý zisk o ",
                highlight: "500K Kč (+50%)",
                after: "."
            },
            {
                label: "Možné kroky:",
                text: "Renegociace smluv s dodavateli, optimalizace energetických nákladů, digitalizace procesů pro snížení administrativních nákladů.",
            }
        ],
        tip: {
            icon: "warning" as const,
            text: "Riziko: Příliš agresivní úspory mohou negativně ovlivnit kvalitu služeb. Doporučujeme postupné zavádění úspor s měřením dopadu."
        },
        chartData: [
            { name: "Provozní náklady", value: 40, color: "#f97316" },
            { name: "Marketing", value: 20, color: "#d97706" },
            { name: "Mzdy", value: 20, color: "#eab308" },
            { name: "Zisk", value: 20, color: "#10b981" },
        ]
    },
]

const tabs = [
    {
        id: "optimalizace",
        label: "Optimalizace",
        icon: TrendUp,
        activeColor: "text-emerald-500 border-emerald-500"
    },
    {
        id: "rizika-scenare",
        label: "Otázky",
        icon: Question,
        activeColor: "text-blue-500 border-blue-500"
    },
    {
        id: "what-if",
        label: "Co by kdyby",
        icon: Warning,
        activeColor: "text-orange-500 border-orange-500"
    },
]

export default function DoporuceniPage() {
    const [activeTab, setActiveTab] = useState("optimalizace")
    const [expandedRisks, setExpandedRisks] = useState<Record<string, boolean>>({})
    const riskRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const toggleRisk = (id: string) => {
        setExpandedRisks(prev => ({ ...prev, [id]: !prev[id] }))
    }

    const scrollToSolution = (id: string) => {
        const element = riskRefs.current[id];
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex-1 min-h-screen">
            {/* Header */}
            <div className="px-6 md:px-10 pt-10 pb-6">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/5">
                        <Lightbulb className="w-6 h-6 text-purple-400" weight="duotone" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Doporučení</h1>
                        <p className="text-gray-400 mt-1">
                            Přehled optimalizací a doporučení pro vaše podnikání
                        </p>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-6 md:px-10 py-8">
                {/* Tab Navigation - Underline Style */}
                <div className="flex gap-8 mb-12 border-b border-white/10">
                    {tabs.map((tab: any) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2.5 px-1 pb-4 text-sm font-medium transition-all duration-300 border-b-2 -mb-[1px]",
                                    isActive
                                        ? cn("text-white", tab.activeColor)
                                        : "text-gray-500 hover:text-gray-300 border-transparent"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive ? "" : "text-gray-500")} weight="duotone" />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Optimalizace Tab Content */}
                {activeTab === "optimalizace" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">

                        {/* Section Header - Klíčová doporučení */}
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 rounded-full bg-emerald-500" />
                            <h2 className="text-2xl font-bold text-white">Klíčová doporučení</h2>
                        </div>

                        {/* 3 Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {optimalizaceData.map((item) => {
                                const Icon = item.icon
                                return (
                                    <div
                                        key={`summary-${item.id}`}
                                        className={cn(
                                            "relative rounded-2xl border border-white/10 p-6 transition-all duration-300 overflow-hidden",
                                            item.color === "emerald" && "border-l-4 border-l-emerald-500",
                                            item.color === "blue" && "border-l-4 border-l-blue-500",
                                            item.color === "violet" && "border-l-4 border-l-violet-500"
                                        )}
                                    >
                                        {/* Gradient overlay background */}
                                        <div className={cn(
                                            "absolute inset-0 opacity-20",
                                            item.color === "emerald" && "bg-gradient-to-br from-emerald-500/40 via-emerald-500/10 to-transparent",
                                            item.color === "blue" && "bg-gradient-to-br from-blue-500/40 via-blue-500/10 to-transparent",
                                            item.color === "violet" && "bg-gradient-to-br from-violet-500/40 via-violet-500/10 to-transparent"
                                        )} />
                                        <div className="relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center border shadow-sm shadow-black/5", item.bgColor, item.borderColor)}>
                                                    <Icon className={cn("w-5 h-5", item.accentColor)} weight="duotone" />
                                                </div>
                                                <span className={cn("text-2xl font-bold", item.accentColor)}>{item.percentChange}</span>
                                            </div>
                                            <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                                            <p className="text-gray-500 text-sm mb-5">{item.subtitle}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-500 text-sm line-through">{item.budget.current.value}</span>
                                                <ArrowRight className={cn("w-3.5 h-3.5", item.accentColor)} weight="duotone" />
                                                <span className={cn("text-sm font-bold", item.accentColor)}>{item.budget.recommended.value}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Detail Rectangles */}
                        <div className="space-y-6">
                            {optimalizaceData.map((item) => {
                                const Icon = item.icon
                                const isExpanded = expandedRisks[item.id]

                                return (
                                    <div
                                        key={item.id}
                                        className="rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-sm overflow-hidden transition-all duration-300"
                                    >
                                        {/* Two-column layout */}
                                        <div className="p-8 md:p-10">
                                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                                                {/* Left column - Description */}
                                                <div className="lg:col-span-3">
                                                    <div className="flex items-center gap-4 mb-5">
                                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-lg shadow-black/5", item.bgColor, item.borderColor)}>
                                                            <Icon className={cn("w-6 h-6", item.accentColor)} weight="duotone" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                                            <p className={cn("text-sm font-medium", item.accentColor)}>{item.subtitle}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-400 leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>

                                                {/* Right column - Budget bars */}
                                                <div className="lg:col-span-2 flex flex-col justify-center space-y-5">
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-gray-500 text-sm">{item.budget.current.label}</span>
                                                            <span className="text-white font-semibold text-sm">{item.budget.current.value}</span>
                                                        </div>
                                                        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                                                                    item.color === "emerald" && "from-emerald-500 to-emerald-400",
                                                                    item.color === "blue" && "from-blue-500 to-blue-400",
                                                                    item.color === "violet" && "from-violet-500 to-violet-400"
                                                                )}
                                                                style={{ width: `${item.budget.current.percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-gray-500 text-sm">{item.budget.recommended.label}</span>
                                                            <span className={cn("font-semibold text-sm", item.accentColor)}>{item.budget.recommended.value}</span>
                                                        </div>
                                                        <div className="h-3 rounded-full bg-white/5 overflow-hidden">
                                                            <div
                                                                className={cn(
                                                                    "h-full rounded-full bg-gradient-to-r transition-all duration-700",
                                                                    item.color === "emerald" && "from-emerald-500 to-emerald-400",
                                                                    item.color === "blue" && "from-blue-500 to-blue-400",
                                                                    item.color === "violet" && "from-violet-500 to-violet-400"
                                                                )}
                                                                style={{ width: `${item.budget.recommended.percent}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Zobrazit více / Skrýt detaily button */}
                                            <div className="flex justify-center mt-8">
                                                <button
                                                    onClick={() => toggleRisk(item.id)}
                                                    className={cn(
                                                        "flex items-center gap-2 text-sm font-medium transition-colors px-6 py-2.5 rounded-xl hover:bg-white/5",
                                                        isExpanded ? cn(item.accentColor) : "text-gray-500 hover:text-gray-300"
                                                    )}
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            Skrýt detaily
                                                            <CaretUp className="w-4 h-4" weight="duotone" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            Zobrazit více
                                                            <CaretDown className="w-4 h-4" weight="duotone" />
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        {isExpanded && (
                                            <div className="border-t border-white/5 animate-in slide-in-from-top-2 duration-500 bg-white/[0.01]">
                                                <div className="p-8 md:p-10 space-y-10">

                                                    {/* 4 Stat Cards */}
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        {item.stats.map((stat, idx) => (
                                                            <div key={idx} className="rounded-2xl bg-white/[0.03] border border-white/5 p-5 text-center">
                                                                <p className={cn("text-2xl font-bold mb-1", item.accentColor)}>{stat.value}</p>
                                                                <p className="text-xs text-gray-500">{stat.label}</p>
                                                                {stat.subtitle && (
                                                                    <p className={cn("text-xs mt-1", stat.subtitleColor === "emerald" ? "text-emerald-500" : "text-cyan-500")}>
                                                                        {stat.subtitle}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* 2-Column Grid for Campaigns and Projections */}
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Performance by Campaigns */}
                                                        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-8">
                                                            <h4 className="text-lg font-bold text-white mb-6">Výkon podle kampaní</h4>
                                                            <div className="space-y-4">
                                                                {item.campaigns.map((campaign, idx) => (
                                                                    <div key={idx} className="flex items-center gap-4">
                                                                        <span className="text-sm text-gray-400 w-40 shrink-0">{campaign.name}</span>
                                                                        <div className="flex-1 h-3.5 rounded-full bg-white/5 overflow-hidden">
                                                                            <div
                                                                                className="h-full rounded-full transition-all duration-700"
                                                                                style={{ width: `${campaign.conversion * 20}%`, backgroundColor: campaign.color }}
                                                                            />
                                                                        </div>
                                                                        <span className="text-sm font-bold text-white w-24 text-right">{campaign.conversion}% konverze</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Projections After Increase */}
                                                        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-8">
                                                            <h4 className="text-lg font-bold text-white mb-6">Projekce po navýšení</h4>
                                                            <div className="space-y-4">
                                                                {item.projectionList.map((proj, idx) => (
                                                                    <div key={idx} className="flex items-center justify-between py-3">
                                                                        <span className="text-sm text-gray-400">{proj.label}</span>
                                                                        <span className="text-sm font-bold text-emerald-500">{proj.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Detailed Analysis and Recommendations */}
                                                    <div>
                                                        <h4 className="text-lg font-bold text-white mb-4">Podrobná analýza</h4>
                                                        <p className="text-gray-400 leading-relaxed">
                                                            {item.analysisText}
                                                        </p>
                                                        <p className="text-gray-400 leading-relaxed mt-4">
                                                            <strong className="text-white font-semibold">Doporučení:</strong>{" "}
                                                            {item.recommendations}
                                                        </p>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Otázky Tab */}
                {activeTab === "rizika-scenare" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 rounded-full bg-blue-500" />
                            <h2 className="text-2xl font-bold text-white">Otázky</h2>
                        </div>

                        {/* Question Cards */}
                        <div className="space-y-5">
                            {otazkyCardsData.map((card) => {
                                const Icon = card.icon
                                const isChartLeft = card.chartPosition === "left"

                                return (
                                    <div
                                        key={card.id}
                                        className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 md:p-7 overflow-hidden"
                                    >
                                        <div className={cn(
                                            "grid grid-cols-1 gap-6 items-center",
                                            isChartLeft ? "lg:grid-cols-[30%_70%]" : "lg:grid-cols-[70%_30%]"
                                        )}>
                                            {/* Chart Column */}
                                            <div className={cn("flex flex-col items-center", !isChartLeft && "lg:order-last")}>
                                                <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wide">{card.chartTitle}</p>

                                                {/* Enhanced Chart Container */}
                                                <div className="relative group">
                                                    {/* Outer decorative ring */}
                                                    <div className="absolute inset-0 rounded-full border border-white/5" />

                                                    {/* Radial gradient background */}
                                                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(124,92,252,0.08),transparent_70%)]" />

                                                    {/* Multi-layer shadow */}
                                                    <div className="absolute inset-0 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12),0_2px_8px_rgb(0,0,0,0.08)] group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.16),0_4px_12px_rgb(0,0,0,0.12)] transition-shadow duration-300" />

                                                    {/* Chart */}
                                                    <div className="relative w-[200px] h-[200px] transition-all duration-300 group-hover:scale-[1.03]" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={card.chartData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={60}
                                                                    outerRadius={85}
                                                                    paddingAngle={2}
                                                                    dataKey="value"
                                                                    stroke="rgba(0,0,0,0.2)"
                                                                    strokeWidth={0.5}
                                                                    animationBegin={0}
                                                                    animationDuration={800}
                                                                    animationEasing="ease-out"
                                                                >
                                                                    {card.chartData.map((entry, index) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={entry.color}
                                                                            className="hover:brightness-110 transition-all duration-200 cursor-pointer"
                                                                            style={{ filter: 'brightness(1)' }}
                                                                        />
                                                                    ))}
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>

                                                {/* Enhanced Legend */}
                                                <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 justify-center max-w-[220px]">
                                                    {card.chartData.map((entry, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-200 cursor-default"
                                                        >
                                                            <div
                                                                className="w-2 h-2 rounded-full shadow-sm ring-1 ring-white/10"
                                                                style={{ backgroundColor: entry.color }}
                                                            />
                                                            <span className="text-gray-500 text-[11px] font-medium leading-none">{entry.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Text Column */}
                                            <div>
                                                <div className="flex items-start gap-2.5 mb-4">
                                                    <Icon className={cn("w-5 h-5 mt-0.5 shrink-0", card.iconColor)} weight="duotone" />
                                                    <h3 className="text-lg font-bold text-white leading-tight">
                                                        Otázka: {card.question}
                                                    </h3>
                                                </div>
                                                <div className="space-y-3 pl-8">
                                                    {card.paragraphs.map((para, idx) => (
                                                        <p key={idx} className="text-gray-400 leading-relaxed text-sm">
                                                            {para.text}<strong className="text-white font-semibold">{para.bold}</strong>{para.after}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* What If Tab */}
                {activeTab === "what-if" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                        {/* Section Header */}
                        <div className="flex items-center gap-4">
                            <div className="w-1.5 h-8 rounded-full bg-orange-500" />
                            <h2 className="text-2xl font-bold text-white">Scénáře a simulace</h2>
                        </div>

                        {/* Scenario Cards */}
                        <div className="space-y-5">
                            {whatIfData.map((card) => {
                                const Icon = card.icon
                                const isChartLeft = card.chartPosition === "left"

                                return (
                                    <div
                                        key={card.id}
                                        className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 md:p-7 overflow-hidden"
                                    >
                                        <div className={cn(
                                            "grid grid-cols-1 gap-6 items-center",
                                            isChartLeft ? "lg:grid-cols-[30%_70%]" : "lg:grid-cols-[70%_30%]"
                                        )}>
                                            {/* Chart Column */}
                                            <div className={cn("flex flex-col items-center", !isChartLeft && "lg:order-last")}>
                                                <p className="text-gray-500 text-xs font-medium mb-3 uppercase tracking-wide">{card.chartTitle}</p>

                                                {/* Chart Container */}
                                                <div className="relative group">
                                                    <div className="absolute inset-0 rounded-full border border-white/5" />
                                                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(249,115,22,0.08),transparent_70%)]" />
                                                    <div className="absolute inset-0 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12),0_2px_8px_rgb(0,0,0,0.08)] group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.16),0_4px_12px_rgb(0,0,0,0.12)] transition-shadow duration-300" />

                                                    <div className="relative w-[200px] h-[200px] transition-all duration-300 group-hover:scale-[1.03]" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))' }}>
                                                        <ResponsiveContainer width="100%" height="100%">
                                                            <PieChart>
                                                                <Pie
                                                                    data={card.chartData}
                                                                    cx="50%"
                                                                    cy="50%"
                                                                    innerRadius={60}
                                                                    outerRadius={85}
                                                                    paddingAngle={2}
                                                                    dataKey="value"
                                                                    stroke="rgba(0,0,0,0.2)"
                                                                    strokeWidth={0.5}
                                                                    animationBegin={0}
                                                                    animationDuration={800}
                                                                    animationEasing="ease-out"
                                                                >
                                                                    {card.chartData.map((entry, index) => (
                                                                        <Cell
                                                                            key={`cell-${index}`}
                                                                            fill={entry.color}
                                                                            className="hover:brightness-110 transition-all duration-200 cursor-pointer"
                                                                            style={{ filter: 'brightness(1)' }}
                                                                        />
                                                                    ))}
                                                                </Pie>
                                                            </PieChart>
                                                        </ResponsiveContainer>
                                                    </div>
                                                </div>

                                                {/* Legend */}
                                                <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 justify-center max-w-[220px]">
                                                    {card.chartData.map((entry, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex items-center gap-1.5 hover:scale-105 transition-transform duration-200 cursor-default"
                                                        >
                                                            <div
                                                                className="w-2 h-2 rounded-full shadow-sm ring-1 ring-white/10"
                                                                style={{ backgroundColor: entry.color }}
                                                            />
                                                            <span className="text-gray-500 text-[11px] font-medium leading-none">{entry.name}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Text Column */}
                                            <div>
                                                <div className="flex items-start gap-2.5 mb-5">
                                                    <Icon className={cn("w-5 h-5 mt-1 shrink-0", card.iconColor)} weight="duotone" />
                                                    <h3 className="text-lg font-bold text-white leading-tight">
                                                        {card.title}
                                                    </h3>
                                                </div>
                                                <div className="space-y-4 pl-8">
                                                    {card.sections.map((section, idx) => (
                                                        <p key={idx} className="text-gray-400 leading-relaxed text-sm">
                                                            <strong className="text-white font-semibold">{section.label}</strong>{" "}
                                                            {section.text}
                                                            {section.highlight && (
                                                                <strong className="text-emerald-500 font-bold">{section.highlight}</strong>
                                                            )}
                                                            {section.after || ""}
                                                        </p>
                                                    ))}

                                                    {/* Tip / Recommendation */}
                                                    <div className="flex items-start gap-2 mt-4">
                                                        {card.tip.icon === "lightbulb" ? (
                                                            <Lightbulb className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" weight="duotone" />
                                                        ) : (
                                                            <Warning className="w-4 h-4 mt-0.5 shrink-0 text-orange-500" weight="duotone" />
                                                        )}
                                                        <p className="text-gray-500 text-sm italic leading-relaxed">
                                                            {card.tip.text}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Závislosti Tab */}
                {activeTab === "zavislosti" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-violet-500/15 flex items-center justify-center border border-violet-500/20 shadow-lg shadow-violet-500/5">
                                <Link className="w-6 h-6 text-violet-500" weight="duotone" />
                            </div>
                            <h2 className="text-3xl font-bold text-white">Mapování závislostí</h2>
                        </div>
                        <div className="p-10 rounded-3xl border border-white/5 bg-[#09090b]">
                            <h3 className="text-xl font-bold text-white mb-6">Závislosti na dodavatelích</h3>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                Analýza rizik spojených s klíčovými dodavateli a návrhy na diverzifikaci.
                                Vaše firma je aktuálně závislá na 2 klíčových dodavatelích pro <span className="text-violet-500 font-bold">60% obratu</span>.
                            </p>
                            <div className="space-y-4">
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-violet-500/30 transition-all duration-300">
                                    <div>
                                        <p className="text-white font-bold text-lg mb-1">Dodavatel A</p>
                                        <p className="text-gray-500 text-sm">Strategická surovina X</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-violet-500 font-bold text-2xl">42%</p>
                                        <p className="text-gray-600 text-xs uppercase tracking-tighter">Podíl na nákupu</p>
                                    </div>
                                </div>
                                <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-violet-500/30 transition-all duration-300">
                                    <div>
                                        <p className="text-white font-bold text-lg mb-1">Dodavatel B</p>
                                        <p className="text-gray-500 text-sm">Komponenta Y</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-violet-400 font-bold text-2xl">18%</p>
                                        <p className="text-gray-600 text-xs uppercase tracking-tighter">Podíl na nákupu</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
