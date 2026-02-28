"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { Funnel, X, Check, CaretRight, CaretLeft, ArrowLeft, CalendarBlank } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/language-context"

// ── Types ──
type QuickRange = "1m" | "3m" | "6m" | "ytd" | "2025" | "all"
type AutoPreset = "month" | "quarter" | "half-year" | "year"
type DropdownView = "menu" | "auto" | "month" | "quarter" | "half-year" | "year" | "custom"

type Selection =
    | { type: "quick"; range: QuickRange }
    | { type: "auto"; preset: AutoPreset; year: number; period?: number }
    | { type: "custom"; from: string; to: string }

interface DateRange { from: string; to: string }
interface TimeRangeFilterProps { className?: string }

const quickRanges: { key: QuickRange; label: string }[] = [
    { key: "1m",   label: "1M"   },
    { key: "3m",   label: "3M"   },
    { key: "6m",   label: "6M"   },
    { key: "ytd",  label: "YTD"  },
    { key: "2025", label: "2025" },
    { key: "all",  label: ""     },
]

const panelWidth: Record<DropdownView, string> = {
    menu:        "w-[200px]",
    auto:        "w-[200px]",
    month:       "w-[280px]",
    quarter:     "w-[240px]",
    "half-year": "w-[240px]",
    year:        "w-[200px]",
    custom:      "w-[300px]",
}

export function TimeRangeFilter({ className }: TimeRangeFilterProps) {
    const { t } = useTranslation()
    const now = new Date()
    const [selection, setSelection] = useState<Selection | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<DropdownView>("menu")
    const [pickerYear, setPickerYear] = useState(now.getFullYear())
    const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" })
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!isOpen) return
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setTimeout(() => setView("menu"), 200)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [isOpen])

    const handleQuickSelect = useCallback((range: QuickRange) => {
        setSelection({ type: "quick", range })
        setIsOpen(false)
        setTimeout(() => setView("menu"), 200)
    }, [])

    const handleAutoSelect = useCallback((preset: AutoPreset, year: number, period?: number) => {
        setSelection({ type: "auto", preset, year, period })
        setIsOpen(false)
        setTimeout(() => setView("menu"), 200)
    }, [])

    const handleCustomApply = useCallback(() => {
        if (!dateRange.from || !dateRange.to || new Date(dateRange.from) > new Date(dateRange.to)) return
        setSelection({ type: "custom", from: dateRange.from, to: dateRange.to })
        setIsOpen(false)
        setTimeout(() => setView("menu"), 200)
    }, [dateRange])

    const handleClear = useCallback(() => {
        setSelection(null)
        setDateRange({ from: "", to: "" })
        setIsOpen(false)
        setView("menu")
    }, [])

    const isValidRange = dateRange.from && dateRange.to && new Date(dateRange.from) <= new Date(dateRange.to)

    // ── Active label for the pill ──
    const getActiveLabel = (): string | null => {
        if (!selection) return null
        if (selection.type === "quick") {
            const r = quickRanges.find(r => r.key === selection.range)
            return r ? (r.key === "all" ? t.filter.all : r.label) : null
        }
        if (selection.type === "auto") {
            const { preset, year, period } = selection
            switch (preset) {
                case "month":     return `${t.filter.months[period!]} ${year}`
                case "quarter":   return `Q${period! + 1} ${year}`
                case "half-year": return `${period === 0 ? t.filter.h1 : t.filter.h2} ${year}`
                case "year":      return `${year}`
            }
        }
        if (selection.type === "custom") return t.filter.custom
        return null
    }

    const activeLabel = getActiveLabel()
    const hasActive = selection !== null

    const inputClasses = cn(
        "w-full h-10 px-3 pl-9 rounded-xl text-sm text-white",
        "bg-white/[0.05] border border-white/[0.12]",
        "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
        "transition-all duration-150 [color-scheme:dark]"
    )

    // ── Shared sub-view helpers ──
    const YearNav = ({ title }: { title: string }) => (
        <div className="flex items-center justify-between mb-3">
            <button onClick={() => setView("menu")}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
                <ArrowLeft className="w-4 h-4" weight="bold" />
            </button>
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">{title}</span>
            <div className="w-7" />
        </div>
    )

    const YearStepper = () => (
        <div className="flex items-center justify-between mb-3 px-1">
            <button onClick={() => setPickerYear(y => y - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
                <CaretLeft className="w-3.5 h-3.5" weight="bold" />
            </button>
            <span className="text-sm font-semibold text-white tabular-nums">{pickerYear}</span>
            <button onClick={() => setPickerYear(y => y + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
                <CaretRight className="w-3.5 h-3.5" weight="bold" />
            </button>
        </div>
    )

    const isPeriodActive = (preset: AutoPreset, year: number, period?: number) =>
        selection?.type === "auto" && selection.preset === preset && selection.year === year && selection.period === period

    // ── Render dropdown view ──
    const renderView = () => {
        switch (view) {

            case "menu":
                return (
                    <motion.div key="menu"
                        initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }} className="p-2">

                        {/* Quick ranges */}
                        <div className="space-y-0.5">
                            {quickRanges.map((range) => {
                                const label = range.key === "all" ? t.filter.all : range.label
                                const isActive = selection?.type === "quick" && selection.range === range.key
                                return (
                                    <button key={range.key} onClick={() => handleQuickSelect(range.key)}
                                        className={cn(
                                            "w-full flex items-center h-9 px-3 rounded-xl",
                                            "text-[13px] font-medium transition-all duration-150 cursor-pointer tabular-nums",
                                            isActive ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}>
                                        {label}
                                    </button>
                                )
                            })}
                        </div>

                        <div className="my-1.5 border-t border-white/[0.06]" />

                        {/* Single Auto entry */}
                        <button onClick={() => setView("auto")}
                            className={cn(
                                "w-full flex items-center justify-between h-9 px-3 rounded-xl",
                                "text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                (selection?.type === "auto" || selection?.type === "custom")
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                            )}>
                            <span>Auto</span>
                            <CaretRight className="w-3.5 h-3.5 opacity-40" weight="bold" />
                        </button>
                    </motion.div>
                )

            case "auto":
                return (
                    <motion.div key="auto"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-2">
                        <div className="flex items-center justify-between mb-1 px-1">
                            <button onClick={() => setView("menu")}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
                                <ArrowLeft className="w-4 h-4" weight="bold" />
                            </button>
                            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Auto</span>
                            <div className="w-7" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                            {([
                                { key: "month" as AutoPreset,     label: t.filter.month,    view: "month" as DropdownView },
                                { key: "quarter" as AutoPreset,   label: t.filter.quarter,  view: "quarter" as DropdownView },
                                { key: "half-year" as AutoPreset, label: t.filter.halfYear, view: "half-year" as DropdownView },
                                { key: "year" as AutoPreset,      label: t.filter.year,     view: "year" as DropdownView },
                            ]).map((item) => {
                                const isActive = selection?.type === "auto" && selection.preset === item.key
                                return (
                                    <button key={item.key}
                                        onClick={() => { setPickerYear(now.getFullYear()); setView(item.view) }}
                                        className={cn(
                                            "w-full flex items-center justify-between h-9 px-3 rounded-xl",
                                            "text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                            isActive ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}>
                                        <span>{item.label}</span>
                                        <CaretRight className="w-3.5 h-3.5 opacity-40" weight="bold" />
                                    </button>
                                )
                            })}
                        </div>
                        <div className="my-1.5 border-t border-white/[0.06]" />
                        <button onClick={() => setView("custom")}
                            className={cn(
                                "w-full flex items-center justify-between h-9 px-3 rounded-xl",
                                "text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                selection?.type === "custom" ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                            )}>
                            <span>{t.filter.customRange}</span>
                            <CaretRight className="w-3.5 h-3.5 opacity-40" weight="bold" />
                        </button>
                    </motion.div>
                )

            case "month":
                return (
                    <motion.div key="month"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-3">
                        <YearNav title={t.filter.selectMonth} />
                        <YearStepper />
                        <div className="grid grid-cols-3 gap-1.5">
                            {t.filter.months.map((name: string, idx: number) => (
                                <button key={idx} onClick={() => handleAutoSelect("month", pickerYear, idx)}
                                    className={cn("h-9 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                        isPeriodActive("month", pickerYear, idx) ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.06]")}>
                                    {name}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )

            case "quarter":
                return (
                    <motion.div key="quarter"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-3">
                        <YearNav title={t.filter.selectQuarter} />
                        <YearStepper />
                        <div className="grid grid-cols-2 gap-1.5">
                            {[0, 1, 2, 3].map((q) => (
                                <button key={q} onClick={() => handleAutoSelect("quarter", pickerYear, q)}
                                    className={cn("h-10 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                        isPeriodActive("quarter", pickerYear, q) ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.06]")}>
                                    Q{q + 1}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )

            case "half-year":
                return (
                    <motion.div key="half-year"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-3">
                        <YearNav title={t.filter.selectHalfYear} />
                        <YearStepper />
                        <div className="grid grid-cols-2 gap-1.5">
                            {[0, 1].map((h) => (
                                <button key={h} onClick={() => handleAutoSelect("half-year", pickerYear, h)}
                                    className={cn("h-10 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                        isPeriodActive("half-year", pickerYear, h) ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.06]")}>
                                    {h === 0 ? t.filter.h1 : t.filter.h2}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )

            case "year": {
                const currentYear = now.getFullYear()
                const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]
                return (
                    <motion.div key="year"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-3">
                        <YearNav title={t.filter.selectYear} />
                        <div className="space-y-1">
                            {years.map((y) => (
                                <button key={y} onClick={() => handleAutoSelect("year", y)}
                                    className={cn("w-full h-9 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer tabular-nums",
                                        isPeriodActive("year", y) ? "bg-primary text-white" : "text-gray-400 hover:text-white hover:bg-white/[0.06]")}>
                                    {y}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )
            }

            case "custom":
                return (
                    <motion.div key="custom"
                        initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }} className="p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <button onClick={() => setView("menu")}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer">
                                <ArrowLeft className="w-4 h-4" weight="bold" />
                            </button>
                            <span className="text-sm font-medium text-white">{t.filter.customRange}</span>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">{t.filter.from}</label>
                                <div className="relative">
                                    <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" weight="duotone" />
                                    <input type="date" value={dateRange.from}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                        className={inputClasses} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">{t.filter.to}</label>
                                <div className="relative">
                                    <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" weight="duotone" />
                                    <input type="date" value={dateRange.to}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                        className={inputClasses} />
                                </div>
                            </div>
                        </div>
                        <button onClick={handleCustomApply} disabled={!isValidRange}
                            className={cn(
                                "w-full h-9 mt-4 rounded-xl text-[13px] font-medium transition-all duration-200",
                                "flex items-center justify-center gap-1.5 cursor-pointer",
                                isValidRange ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]" : "bg-white/[0.05] text-gray-600 cursor-not-allowed"
                            )}>
                            <Check className="w-3.5 h-3.5" weight="bold" />
                            {t.filter.apply}
                        </button>
                    </motion.div>
                )
        }
    }

    return (
        <div className={cn("relative inline-flex", className)} ref={containerRef}>
            {/* ── Oval trigger pill (same as FilterPanel) ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "inline-flex items-center gap-2 h-9 px-4 rounded-full",
                    "text-[13px] font-medium transition-all duration-200 cursor-pointer",
                    "border backdrop-blur-sm",
                    hasActive
                        ? "bg-primary/10 border-primary/30 text-primary hover:bg-primary/15"
                        : "bg-white/[0.03] border-white/[0.12] text-gray-400 hover:text-white hover:border-white/[0.18] hover:bg-white/[0.06]"
                )}
            >
                <Funnel className="w-4 h-4" weight="duotone" />
                <span>{t.filter.trigger}</span>
                {activeLabel && (
                    <>
                        <div className="w-px h-3.5 bg-current opacity-20" />
                        <span className="text-xs">{activeLabel}</span>
                    </>
                )}
                {hasActive && (
                    <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); handleClear() }}
                        className="ml-0.5 w-4 h-4 rounded-full hover:bg-white/10 flex items-center justify-center cursor-pointer"
                    >
                        <X className="w-3 h-3" weight="bold" />
                    </span>
                )}
            </button>

            {/* ── Dropdown ── */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => { setIsOpen(false); setTimeout(() => setView("menu"), 200) }} />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className={cn(
                                "absolute left-0 top-full mt-2 z-50",
                                "rounded-2xl border border-white/[0.12]",
                                "bg-[#0d0a1a]/95 backdrop-blur-xl",
                                "shadow-xl shadow-black/30 overflow-hidden",
                                panelWidth[view],
                                "transition-[width] duration-200 ease-out"
                            )}
                        >
                            <AnimatePresence mode="wait">
                                {renderView()}
                            </AnimatePresence>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
