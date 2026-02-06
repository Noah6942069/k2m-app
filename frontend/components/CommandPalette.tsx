"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/lib/i18n/language-context"
import {
    Search,
    LayoutDashboard,
    Upload,
    Beaker,
    Zap,
    FileText,
    Settings,
    TrendingUp,
    Brain,
    AlertTriangle,
    X
} from "lucide-react"

interface CommandItem {
    id: string
    title: string
    titleEn: string
    icon: any
    href?: string
    action?: () => void
    category: string
}

const commands: CommandItem[] = [
    // Navigation
    { id: "dashboard", title: "Dashboard", titleEn: "Dashboard", icon: LayoutDashboard, href: "/dashboard", category: "Navigace" },
    { id: "datasets", title: "Datasety", titleEn: "Datasets", icon: FileText, href: "/datasets", category: "Navigace" },
    { id: "analysis", title: "Analýza", titleEn: "Analysis", icon: Beaker, href: "/intelligence/analysis", category: "Navigace" },
    { id: "whatif", title: "What-If Simulace", titleEn: "What-If Simulation", icon: Zap, href: "/intelligence/what-if", category: "Navigace" },
    { id: "risks", title: "Rizika", titleEn: "Risks", icon: AlertTriangle, href: "/intelligence/risks", category: "Navigace" },
    { id: "recommendations", title: "Doporučení", titleEn: "Recommendations", icon: Brain, href: "/intelligence/recommendations", category: "Navigace" },
    { id: "bi", title: "BI Dashboard", titleEn: "BI Dashboard", icon: TrendingUp, href: "/bi", category: "Navigace" },
    { id: "settings", title: "Nastavení", titleEn: "Settings", icon: Settings, href: "/settings", category: "Navigace" },
    // Actions
    { id: "upload", title: "Nahrát nová data", titleEn: "Upload new data", icon: Upload, href: "/datasets?upload=true", category: "Akce" },
    { id: "run-analysis", title: "Spustit AI analýzu", titleEn: "Run AI analysis", icon: Brain, href: "/intelligence/analysis?run=true", category: "Akce" },
]

export function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false)
    const [search, setSearch] = useState("")
    const router = useRouter()
    const { language } = useTranslation()

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault()
                setIsOpen(prev => !prev)
            }
            if (e.key === "Escape") {
                setIsOpen(false)
            }
        }

        document.addEventListener("keydown", handleKeyDown)
        return () => document.removeEventListener("keydown", handleKeyDown)
    }, [])

    // Filter commands
    const filteredCommands = commands.filter(cmd => {
        const title = language === 'cs' ? cmd.title : cmd.titleEn
        return title.toLowerCase().includes(search.toLowerCase())
    })

    // Group by category
    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = []
        acc[cmd.category].push(cmd)
        return acc
    }, {} as Record<string, CommandItem[]>)

    const handleSelect = (cmd: CommandItem) => {
        if (cmd.href) {
            router.push(cmd.href)
        }
        if (cmd.action) {
            cmd.action()
        }
        setIsOpen(false)
        setSearch("")
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="relative flex items-start justify-center pt-[15vh]">
                <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                        <Search className="w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={language === 'cs' ? "Hledat příkazy..." : "Search commands..."}
                            className="flex-1 bg-transparent text-foreground placeholder-muted-foreground outline-none text-sm"
                            autoFocus
                        />
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 rounded hover:bg-muted transition-colors"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </div>

                    {/* Results */}
                    <div className="max-h-[300px] overflow-y-auto p-2">
                        {Object.entries(groupedCommands).map(([category, items]) => (
                            <div key={category} className="mb-2">
                                <p className="text-xs text-muted-foreground px-2 py-1 font-medium">
                                    {category}
                                </p>
                                {items.map((cmd) => {
                                    const Icon = cmd.icon
                                    return (
                                        <button
                                            key={cmd.id}
                                            onClick={() => handleSelect(cmd)}
                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                                        >
                                            <Icon className="w-4 h-4 text-muted-foreground" />
                                            <span className="text-sm text-foreground">
                                                {language === 'cs' ? cmd.title : cmd.titleEn}
                                            </span>
                                        </button>
                                    )
                                })}
                            </div>
                        ))}

                        {filteredCommands.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-8">
                                {language === 'cs' ? "Žádné výsledky" : "No results"}
                            </p>
                        )}
                    </div>

                    {/* Footer hint */}
                    <div className="flex items-center justify-between px-4 py-2 border-t border-border/50 bg-muted/30">
                        <span className="text-xs text-muted-foreground">
                            {language === 'cs' ? "Přejít" : "Navigate"}
                        </span>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">↑↓</kbd>
                            <span>{language === 'cs' ? "výběr" : "select"}</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">↵</kbd>
                            <span>{language === 'cs' ? "otevřít" : "open"}</span>
                            <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px]">esc</kbd>
                            <span>{language === 'cs' ? "zavřít" : "close"}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
