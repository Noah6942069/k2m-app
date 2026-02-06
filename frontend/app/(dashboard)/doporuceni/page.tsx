"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { AlertTriangle, TrendingUp, HelpCircle, Link2, ArrowUpRight, ArrowRight } from "lucide-react"

const tabs = [
    {
        id: "rizika-scenare",
        label: "Rizika / Scénáře",
        icon: AlertTriangle,
        color: "from-red-500 to-orange-500"
    },
    {
        id: "optimalizace",
        label: "Optimalizace",
        icon: TrendingUp,
        color: "from-emerald-500 to-teal-500"
    },
    {
        id: "what-if",
        label: "Co by kdyby",
        icon: HelpCircle,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: "zavislosti",
        label: "Závislosti",
        icon: Link2,
        color: "from-violet-500 to-purple-500"
    },
]

export default function DoporuceniPage() {
    const [activeTab, setActiveTab] = useState("optimalizace")

    return (
        <div className="flex-1 min-h-screen">
            {/* Clean Header */}
            <div className="px-6 md:px-10 pt-8 pb-6">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1">Doporučení</h1>
                <p className="text-muted-foreground">
                    Přehled optimalizací a doporučení pro vaše podnikání
                </p>
            </div>

            {/* Content Area */}
            <div className="px-6 md:px-10 py-8">
                {/* Tab Navigation - Pill Style */}
                <div className="flex flex-wrap gap-2 mb-10 p-1.5 bg-muted/30 rounded-2xl w-fit border border-border/50">
                    {tabs.map((tab) => {
                        const Icon = tab.icon
                        const isActive = activeTab === tab.id
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-background text-foreground shadow-lg shadow-black/5"
                                        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                                )}
                            >
                                <Icon className={cn("w-4 h-4", isActive && "text-primary")} />
                                {tab.label}
                            </button>
                        )
                    })}
                </div>

                {/* Optimalizace Tab Content */}
                {activeTab === "optimalizace" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">

                        {/* Section 1: Key Recommendations */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-500 to-teal-500" />
                                <h2 className="text-xl font-semibold">Klíčová doporučení</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {/* Card 1 - Meta */}
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/10 via-background to-background border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/20 to-transparent rounded-bl-full" />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                <ArrowUpRight className="w-6 h-6 text-emerald-500" />
                                            </div>
                                            <span className="text-2xl font-bold text-emerald-500">+50%</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Meta Reklamy</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Navýšení rozpočtu pro vyšší ROI</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">10 000 Kč</span>
                                            <ArrowRight className="w-4 h-4 text-emerald-500" />
                                            <span className="font-semibold text-emerald-500">15 000 Kč</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 - Google */}
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-background to-background border border-blue-500/20 p-6 hover:border-blue-500/40 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-bl-full" />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                                <ArrowUpRight className="w-6 h-6 text-blue-500" />
                                            </div>
                                            <span className="text-2xl font-bold text-blue-500">+35%</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Google Ads</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Optimalizace klíčových slov</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">8 000 Kč</span>
                                            <ArrowRight className="w-4 h-4 text-blue-500" />
                                            <span className="font-semibold text-blue-500">12 000 Kč</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 - Email */}
                                <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-500/10 via-background to-background border border-violet-500/20 p-6 hover:border-violet-500/40 transition-all duration-300">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/20 to-transparent rounded-bl-full" />
                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                                <ArrowUpRight className="w-6 h-6 text-violet-500" />
                                            </div>
                                            <span className="text-2xl font-bold text-violet-500">+120%</span>
                                        </div>
                                        <h3 className="text-lg font-semibold mb-1">Email Marketing</h3>
                                        <p className="text-sm text-muted-foreground mb-4">Personalizace a segmentace</p>
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">2 000 Kč</span>
                                            <ArrowRight className="w-4 h-4 text-violet-500" />
                                            <span className="font-semibold text-violet-500">4 000 Kč</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Analysis + Projection */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
                            {/* Left - Detailed Analysis (3 cols) */}
                            <div className="xl:col-span-3 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
                                <div className="p-6 border-b border-border/50">
                                    <h3 className="text-lg font-semibold">Detailní analýza</h3>
                                </div>
                                <div className="divide-y divide-border/50">
                                    <div className="p-6 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-emerald-500 mb-2">Meta Reklamy</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Na základě analýzy vašich dat doporučujeme navýšit rozpočet na Meta reklamy o 50%.
                                                    Vaše cílová skupina vykazuje vysokou míru engagement a konverzní poměr 3.2%,
                                                    což je nad průměrem odvětví (2.1%).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-blue-500 mb-2">Google Ads</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Klíčová slova s nejvyšším výkonem mají potenciál pro škálování.
                                                    Navýšení rozpočtu umožní lepší pozice v aukcích a větší reach.
                                                    Doporučujeme fokus na long-tail keywords.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 hover:bg-muted/20 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-2 h-2 rounded-full bg-violet-500 mt-2 shrink-0" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-violet-500 mb-2">Email Marketing</h4>
                                                <p className="text-sm text-muted-foreground leading-relaxed">
                                                    Segmentace databáze a personalizovaný obsah mohou dramaticky
                                                    zvýšit open rate a konverze. Aktuální open rate 18% lze zvýšit na 35%+.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Projection (2 cols) */}
                            <div className="xl:col-span-2 rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 via-card/50 to-card/30 backdrop-blur-sm p-6">
                                <h3 className="text-lg font-semibold mb-6">Projekce výnosů</h3>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-center">
                                        <p className="text-3xl font-bold text-emerald-500 mb-1">+45%</p>
                                        <p className="text-xs text-muted-foreground">Nárůst výnosů</p>
                                    </div>
                                    <div className="rounded-xl bg-primary/10 border border-primary/20 p-4 text-center">
                                        <p className="text-3xl font-bold text-primary mb-1">3.2x</p>
                                        <p className="text-xs text-muted-foreground">ROI</p>
                                    </div>
                                </div>

                                {/* Visual Progress Bars */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">Nyní</span>
                                            <span className="font-medium">100 000 Kč</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                                            <div className="h-full w-[55%] rounded-full bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/30" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">+1 měsíc</span>
                                            <span className="font-medium">115 000 Kč</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                                            <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-primary/70 to-primary/50" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">+2 měsíce</span>
                                            <span className="font-medium">132 000 Kč</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                                            <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-primary to-primary/80" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-muted-foreground">+3 měsíce</span>
                                            <span className="font-semibold text-emerald-500">145 000 Kč</span>
                                        </div>
                                        <div className="h-3 rounded-full bg-muted/30 overflow-hidden">
                                            <div className="h-full w-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-lg shadow-emerald-500/30" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-border/50">
                                    <p className="text-xs text-muted-foreground">
                                        * Projekce založena na historických datech a tržních trendech
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Tabs - Placeholder Content */}
                {activeTab === "rizika-scenare" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-red-500 to-orange-500" />
                            <h2 className="text-xl font-semibold">Rizika / Scénáře / Řešení</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-5">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-background border border-red-500/20">
                                <h3 className="font-semibold mb-2">Zdroj rizika</h3>
                                <p className="text-sm text-muted-foreground">Identifikace původu rizikových faktorů</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-500/5 to-background border border-orange-500/20">
                                <h3 className="font-semibold mb-2">Co by kdyby</h3>
                                <p className="text-sm text-muted-foreground">Analýza možných scénářů a dopadů</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-background border border-amber-500/20">
                                <h3 className="font-semibold mb-2">Způsoby řešení</h3>
                                <p className="text-sm text-muted-foreground">Návrhy na mitigaci identifikovaných rizik</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "what-if" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-blue-500 to-cyan-500" />
                            <h2 className="text-xl font-semibold">Co by kdyby (Simulace)</h2>
                        </div>
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-background border border-blue-500/20">
                            <h3 className="text-lg font-semibold mb-3">Ukázkový scénář</h3>
                            <p className="text-muted-foreground mb-4">
                                Co kdyby největší klient odešel? Jaký dopad by to mělo na vaše příjmy a cashflow?
                            </p>
                            <button className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors">
                                Spustit simulaci
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "zavislosti" && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-500 to-purple-500" />
                            <h2 className="text-xl font-semibold">Mapování závislostí</h2>
                        </div>
                        <div className="p-8 rounded-2xl bg-gradient-to-br from-violet-500/5 to-background border border-violet-500/20">
                            <h3 className="text-lg font-semibold mb-3">Závislosti na dodavatelích</h3>
                            <p className="text-muted-foreground">
                                Analýza rizik spojených s klíčovými dodavateli a návrhy na diverzifikaci.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
