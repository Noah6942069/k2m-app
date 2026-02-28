"use client"

import { useState, useCallback } from "react"
import { Funnel, X, Check, CaretRight, CaretLeft, ArrowLeft, CalendarBlank } from "@phosphor-icons/react"
import { AnimatePresence, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/i18n/language-context"

// ── Types ──
type FilterPreset = "month" | "quarter" | "half-year" | "year" | "auto"
type PanelView = "quick" | "month" | "quarter" | "half-year" | "year" | "advanced"

interface Selection {
    preset: FilterPreset
    year: number
    period?: number // month (0-11), quarter (0-3), half (0-1)
}

interface DateRange {
    from: string
    to: string
}

interface FilterPanelProps {
    className?: string
    allowedPresets?: FilterPreset[]
}

// ── Preset definitions ──
const presets: { key: FilterPreset; labelKey: "month" | "quarter" | "halfYear" | "year" }[] = [
    { key: "month", labelKey: "month" },
    { key: "quarter", labelKey: "quarter" },
    { key: "half-year", labelKey: "halfYear" },
    { key: "year", labelKey: "year" },
]

// ── Panel width map ──
const panelWidth: Record<PanelView, string> = {
    quick: "w-[200px]",
    month: "w-[280px]",
    quarter: "w-[240px]",
    "half-year": "w-[240px]",
    year: "w-[200px]",
    advanced: "w-[300px]",
}

export function FilterPanel({ className, allowedPresets }: FilterPanelProps) {
    const { t } = useTranslation()
    const now = new Date()
    const singlePreset = allowedPresets?.length === 1 ? allowedPresets[0] : null
    const defaultView: PanelView = singlePreset && singlePreset !== "auto" ? singlePreset as PanelView : "quick"
    const [isOpen, setIsOpen] = useState(false)
    const [view, setView] = useState<PanelView>(defaultView)
    const [selection, setSelection] = useState<Selection | null>(null)
    const [dateRange, setDateRange] = useState<DateRange>({ from: "", to: "" })
    const [pickerYear, setPickerYear] = useState(now.getFullYear())

    // ── Handlers ──

    const handlePresetClick = useCallback((preset: FilterPreset) => {
        if (preset === "auto") {
            setView("advanced")
            return
        }
        setPickerYear(now.getFullYear())
        setView(preset as PanelView)
    }, [now])

    const handleSelect = useCallback((preset: FilterPreset, year: number, period?: number) => {
        setSelection({ preset, year, period })
        setIsOpen(false)
        setTimeout(() => setView(defaultView), 200)
    }, [defaultView])

    const handleAdvancedApply = useCallback(() => {
        if (!dateRange.from || !dateRange.to || new Date(dateRange.from) > new Date(dateRange.to)) return
        setSelection({ preset: "auto", year: 0 })
        setIsOpen(false)
        setTimeout(() => setView("quick"), 200)
    }, [dateRange])

    const handleClose = useCallback(() => {
        setIsOpen(false)
        setTimeout(() => setView(defaultView), 200)
    }, [defaultView])

    const handleClear = useCallback(() => {
        setSelection(null)
        setDateRange({ from: "", to: "" })
        setIsOpen(false)
        setView("quick")
    }, [])

    // ── Active label for the pill ──
    const getActiveLabel = (): string | null => {
        if (!selection) return null
        const { preset, year, period } = selection
        switch (preset) {
            case "month":
                return `${t.filter.months[period!]} ${year}`
            case "quarter":
                return `Q${period! + 1} ${year}`
            case "half-year":
                return `${period === 0 ? t.filter.h1 : t.filter.h2} ${year}`
            case "year":
                return `${year}`
            case "auto":
                return t.filter.custom
            default:
                return null
        }
    }

    const activeLabel = getActiveLabel()
    const hasActiveFilter = selection !== null
    const isValidRange = dateRange.from && dateRange.to && new Date(dateRange.from) <= new Date(dateRange.to)

    const inputClasses = cn(
        "w-full h-10 px-3 pl-9 rounded-xl text-sm text-white",
        "bg-white/[0.05] border border-white/[0.12]",
        "focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20",
        "transition-all duration-150",
        "[color-scheme:dark]"
    )

    // ── Shared year navigation header ──
    const YearNav = ({ title }: { title: string }) => (
        <div className={cn("flex items-center justify-between mb-3", singlePreset && "justify-center")}>
            {!singlePreset && (
                <button
                    onClick={() => setView("quick")}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" weight="bold" />
                </button>
            )}
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                {title}
            </span>
            {!singlePreset && <div className="w-7" />}
        </div>
    )

    const YearStepper = () => (
        <div className="flex items-center justify-between mb-3 px-1">
            <button
                onClick={() => setPickerYear(y => y - 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
                <CaretLeft className="w-3.5 h-3.5" weight="bold" />
            </button>
            <span className="text-sm font-semibold text-white tabular-nums">{pickerYear}</span>
            <button
                onClick={() => setPickerYear(y => y + 1)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
                <CaretRight className="w-3.5 h-3.5" weight="bold" />
            </button>
        </div>
    )

    // ── Check if a period is the selected one ──
    const isSelected = (preset: FilterPreset, year: number, period?: number) =>
        selection?.preset === preset && selection.year === year && selection.period === period

    // ── Render the current view ──
    const renderView = () => {
        switch (view) {

            // ── Quick Menu ──
            case "quick":
                return (
                    <motion.div
                        key="quick"
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="p-2"
                    >
                        <div className="space-y-0.5">
                            {presets.map((preset) => {
                                const isActive = selection?.preset === preset.key
                                return (
                                    <button
                                        key={preset.key}
                                        onClick={() => handlePresetClick(preset.key)}
                                        className={cn(
                                            "w-full flex items-center justify-between h-9 px-3 rounded-xl",
                                            "text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}
                                    >
                                        <span>{t.filter[preset.labelKey]}</span>
                                        <CaretRight className="w-3.5 h-3.5 opacity-40" weight="bold" />
                                    </button>
                                )
                            })}
                        </div>

                        <div className="my-1.5 border-t border-white/[0.06]" />

                        <button
                            onClick={() => handlePresetClick("auto")}
                            className={cn(
                                "w-full flex items-center justify-between h-9 px-3 rounded-xl",
                                "text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                selection?.preset === "auto"
                                    ? "bg-primary/10 text-primary"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                            )}
                        >
                            <span>Auto</span>
                            <CaretRight className="w-3.5 h-3.5 opacity-40" weight="bold" />
                        </button>
                    </motion.div>
                )

            // ── Month Picker (3×4 grid) ──
            case "month":
                return (
                    <motion.div
                        key="month"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                        className="p-3"
                    >
                        <YearNav title={t.filter.selectMonth} />
                        <YearStepper />
                        <div className="grid grid-cols-3 gap-1.5">
                            {t.filter.months.map((name, idx) => {
                                const active = isSelected("month", pickerYear, idx)
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleSelect("month", pickerYear, idx)}
                                        className={cn(
                                            "h-9 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                            active
                                                ? "bg-primary text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}
                                    >
                                        {name}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )

            // ── Quarter Picker ──
            case "quarter":
                return (
                    <motion.div
                        key="quarter"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                        className="p-3"
                    >
                        <YearNav title={t.filter.selectQuarter} />
                        <YearStepper />
                        <div className="grid grid-cols-2 gap-1.5">
                            {[0, 1, 2, 3].map((q) => {
                                const active = isSelected("quarter", pickerYear, q)
                                return (
                                    <button
                                        key={q}
                                        onClick={() => handleSelect("quarter", pickerYear, q)}
                                        className={cn(
                                            "h-10 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                            active
                                                ? "bg-primary text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}
                                    >
                                        Q{q + 1}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )

            // ── Half Year Picker ──
            case "half-year":
                return (
                    <motion.div
                        key="half-year"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                        className="p-3"
                    >
                        <YearNav title={t.filter.selectHalfYear} />
                        <YearStepper />
                        <div className="grid grid-cols-2 gap-1.5">
                            {[0, 1].map((h) => {
                                const active = isSelected("half-year", pickerYear, h)
                                return (
                                    <button
                                        key={h}
                                        onClick={() => handleSelect("half-year", pickerYear, h)}
                                        className={cn(
                                            "h-10 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer",
                                            active
                                                ? "bg-primary text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}
                                    >
                                        {h === 0 ? t.filter.h1 : t.filter.h2}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )

            // ── Year Picker ──
            case "year": {
                const currentYear = now.getFullYear()
                const years = [currentYear - 2, currentYear - 1, currentYear, currentYear + 1]
                return (
                    <motion.div
                        key="year"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                        className="p-3"
                    >
                        <YearNav title={t.filter.selectYear} />
                        <div className="space-y-1">
                            {years.map((y) => {
                                const active = isSelected("year", y)
                                return (
                                    <button
                                        key={y}
                                        onClick={() => handleSelect("year", y)}
                                        className={cn(
                                            "w-full h-9 rounded-xl text-[13px] font-medium transition-all duration-150 cursor-pointer tabular-nums",
                                            active
                                                ? "bg-primary text-white"
                                                : "text-gray-400 hover:text-white hover:bg-white/[0.06]"
                                        )}
                                    >
                                        {y}
                                    </button>
                                )
                            })}
                        </div>
                    </motion.div>
                )
            }

            // ── Advanced (Custom Date Range) ──
            case "advanced":
                return (
                    <motion.div
                        key="advanced"
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                        className="p-4"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <button
                                onClick={() => setView("quick")}
                                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                            >
                                <ArrowLeft className="w-4 h-4" weight="bold" />
                            </button>
                            <span className="text-sm font-medium text-white">
                                {t.filter.customRange}
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                                    {t.filter.from}
                                </label>
                                <div className="relative">
                                    <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" weight="duotone" />
                                    <input
                                        type="date"
                                        value={dateRange.from}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-medium text-gray-500 uppercase tracking-wider mb-1.5 block">
                                    {t.filter.to}
                                </label>
                                <div className="relative">
                                    <CalendarBlank className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" weight="duotone" />
                                    <input
                                        type="date"
                                        value={dateRange.to}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleAdvancedApply}
                            disabled={!isValidRange}
                            className={cn(
                                "w-full h-9 mt-4 rounded-xl text-[13px] font-medium transition-all duration-200",
                                "flex items-center justify-center gap-1.5 cursor-pointer",
                                isValidRange
                                    ? "bg-primary text-white hover:bg-primary/90 active:scale-[0.98]"
                                    : "bg-white/[0.05] text-gray-600 cursor-not-allowed"
                            )}
                        >
                            <Check className="w-3.5 h-3.5" weight="bold" />
                            {t.filter.apply}
                        </button>
                    </motion.div>
                )
        }
    }

    return (
        <div className={cn("relative inline-flex", className)}>
            {/* ── Trigger Button ── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "inline-flex items-center gap-2 h-9 px-4 rounded-full",
                    "text-[13px] font-medium transition-all duration-200 cursor-pointer",
                    "border backdrop-blur-sm",
                    hasActiveFilter
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
                {hasActiveFilter && (
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
                        <div className="fixed inset-0 z-40" onClick={handleClose} />

                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                            className={cn(
                                "absolute left-0 top-full mt-2 z-50",
                                "rounded-2xl border border-white/[0.12]",
                                "bg-[#0d0a1a]/95 backdrop-blur-xl",
                                "shadow-xl shadow-black/30",
                                "overflow-hidden",
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
