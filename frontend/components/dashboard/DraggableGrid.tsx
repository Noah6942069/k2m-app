/**
 * K2M Analytics - Draggable Dashboard Grid
 * ==========================================
 * Provides widget visibility toggle and reordering for dashboard.
 * Uses CSS Grid for layout with manual state management.
 */

"use client"

import { useState, useEffect, ReactNode } from "react"
import { GripVertical, X, Plus, Edit3, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LayoutItem {
    id: string
    order: number
    visible: boolean
    size: "small" | "medium" | "large"
}

interface Widget {
    id: string
    title: string
    component: ReactNode
    defaultSize?: "small" | "medium" | "large"
}

interface DraggableGridProps {
    widgets: Widget[]
    onLayoutChange?: (layout: LayoutItem[]) => void
    savedLayout?: LayoutItem[]
    editMode?: boolean
}

const sizeClasses = {
    small: "col-span-1",
    medium: "col-span-1 md:col-span-2",
    large: "col-span-1 md:col-span-4",
}

export function DraggableGrid({
    widgets,
    onLayoutChange,
    savedLayout,
    editMode = false,
}: DraggableGridProps) {
    const [layout, setLayout] = useState<LayoutItem[]>([])
    const [mounted, setMounted] = useState(false)
    const [draggedId, setDraggedId] = useState<string | null>(null)

    // Initialize layout
    useEffect(() => {
        setMounted(true)

        if (savedLayout && savedLayout.length > 0) {
            setLayout(savedLayout)
        } else {
            // Default layout - all widgets visible
            const defaultLayout: LayoutItem[] = widgets.map((widget, index) => ({
                id: widget.id,
                order: index,
                visible: true,
                size: widget.defaultSize || "medium",
            }))
            setLayout(defaultLayout)
        }
    }, [widgets, savedLayout])

    const toggleWidget = (widgetId: string) => {
        const updated = layout.map((item) =>
            item.id === widgetId ? { ...item, visible: !item.visible } : item
        )
        setLayout(updated)
        onLayoutChange?.(updated)
    }

    const cycleSize = (widgetId: string) => {
        const sizes: Array<"small" | "medium" | "large"> = ["small", "medium", "large"]
        const updated = layout.map((item) => {
            if (item.id !== widgetId) return item
            const currentIndex = sizes.indexOf(item.size)
            const nextIndex = (currentIndex + 1) % sizes.length
            return { ...item, size: sizes[nextIndex] }
        })
        setLayout(updated)
        onLayoutChange?.(updated)
    }

    const handleDragStart = (widgetId: string) => {
        setDraggedId(widgetId)
    }

    const handleDragOver = (e: React.DragEvent, targetId: string) => {
        e.preventDefault()
        if (!draggedId || draggedId === targetId) return

        setLayout((prev) => {
            const draggedIndex = prev.findIndex((item) => item.id === draggedId)
            const targetIndex = prev.findIndex((item) => item.id === targetId)
            if (draggedIndex === -1 || targetIndex === -1) return prev

            const updated = [...prev]
            const [removed] = updated.splice(draggedIndex, 1)
            updated.splice(targetIndex, 0, removed)
            return updated.map((item, index) => ({ ...item, order: index }))
        })
    }

    const handleDragEnd = () => {
        setDraggedId(null)
        onLayoutChange?.(layout)
    }

    if (!mounted) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {widgets.slice(0, 4).map((w) => (
                    <div
                        key={w.id}
                        className="h-48 rounded-xl bg-muted animate-pulse"
                    />
                ))}
            </div>
        )
    }

    // Sort widgets by layout order and filter visible
    const sortedWidgets = [...widgets]
        .map((widget) => ({
            widget,
            layoutItem: layout.find((l) => l.id === widget.id),
        }))
        .filter(({ layoutItem }) => layoutItem?.visible !== false)
        .sort((a, b) => (a.layoutItem?.order ?? 0) - (b.layoutItem?.order ?? 0))

    return (
        <div className="space-y-4">
            {/* Edit Mode Widget Selector */}
            {editMode && (
                <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-card border border-border">
                    <span className="text-sm font-medium text-foreground mr-2">
                        Toggle Widgets:
                    </span>
                    {widgets.map((widget) => {
                        const isVisible = layout.find((l) => l.id === widget.id)?.visible !== false
                        return (
                            <Button
                                key={widget.id}
                                variant={isVisible ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleWidget(widget.id)}
                                className={cn(
                                    "text-xs gap-1",
                                    isVisible
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {isVisible ? (
                                    <Check className="w-3 h-3" />
                                ) : (
                                    <Plus className="w-3 h-3" />
                                )}
                                {widget.title}
                            </Button>
                        )
                    })}
                </div>
            )}

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {sortedWidgets.map(({ widget, layoutItem }) => (
                    <div
                        key={widget.id}
                        draggable={editMode}
                        onDragStart={() => handleDragStart(widget.id)}
                        onDragOver={(e) => handleDragOver(e, widget.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                            "rounded-xl bg-card border border-border overflow-hidden transition-all duration-300",
                            "hover:shadow-lg hover:border-primary/30 hover:-translate-y-1",
                            sizeClasses[layoutItem?.size || "medium"],
                            editMode && "ring-2 ring-primary/20 cursor-grab active:cursor-grabbing hover:translate-y-0 hover:shadow-none",
                            draggedId === widget.id && "opacity-50 scale-95"
                        )}
                    >
                        {/* Widget Header (visible in edit mode) */}
                        {editMode && (
                            <div className="drag-handle flex items-center justify-between px-3 py-2 bg-muted/50 border-b border-border">
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {widget.title}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => cycleSize(widget.id)}
                                        className="px-2 py-0.5 rounded text-[10px] bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {layoutItem?.size || "medium"}
                                    </button>
                                    <button
                                        onClick={() => toggleWidget(widget.id)}
                                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Widget Content */}
                        <div className="p-0">
                            {widget.component}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

/**
 * Edit Mode Toggle Button
 */
export function EditModeButton({
    editMode,
    onToggle,
}: {
    editMode: boolean
    onToggle: () => void
}) {
    return (
        <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={onToggle}
            className={cn(
                "gap-2",
                editMode && "bg-primary text-primary-foreground"
            )}
        >
            <Edit3 className="w-4 h-4" />
            {editMode ? "Done" : "Customize"}
        </Button>
    )
}

/**
 * Hook for managing dashboard layout persistence
 */
export function useDashboardLayout(userEmail: string | undefined) {
    const [layout, setLayout] = useState<LayoutItem[]>([])
    const [loading, setLoading] = useState(true)

    // Load saved layout
    useEffect(() => {
        if (!userEmail) {
            setLoading(false)
            return
        }

        const saved = localStorage.getItem(`k2m-dashboard-layout-${userEmail}`)
        if (saved) {
            try {
                setLayout(JSON.parse(saved))
            } catch {
                console.error("Failed to parse saved layout")
            }
        }
        setLoading(false)
    }, [userEmail])

    // Save layout
    const saveLayout = (newLayout: LayoutItem[]) => {
        setLayout(newLayout)
        if (userEmail) {
            localStorage.setItem(
                `k2m-dashboard-layout-${userEmail}`,
                JSON.stringify(newLayout)
            )
        }
    }

    return { layout, saveLayout, loading }
}


