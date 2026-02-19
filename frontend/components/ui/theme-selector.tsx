/**
 * K2M Analytics - Theme Selector Component
 * =========================================
 * Allows users to choose between different color schemes.
 * Persists preference to localStorage.
 */

"use client"

import { useState, useEffect } from "react"
import { Check, Palette } from "@phosphor-icons/react"
import { cn } from "@/lib/utils"

const themes = [
    {
        id: "default",
        name: "Default",
        description: "Blue & Purple",
        colors: ["#7c5cfc", "#5b8def"],
    },
    {
        id: "purple",
        name: "Purple",
        description: "Violet & Pink",
        colors: ["#8b5cf6", "#a78bfa"],
    },
    {
        id: "green",
        name: "Green",
        description: "Emerald & Teal",
        colors: ["#10b981", "#34d399"],
    },
    {
        id: "ocean",
        name: "Ocean",
        description: "Cyan & Sky",
        colors: ["#0891b2", "#06b6d4"],
    },
]

export function ThemeSelector() {
    const [currentTheme, setCurrentTheme] = useState("default")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem("k2m-color-theme")
        if (saved && themes.find((t) => t.id === saved)) {
            setCurrentTheme(saved)
            applyTheme(saved)
        }
    }, [])

    const applyTheme = (themeId: string) => {
        const html = document.documentElement
        // Remove all theme data attributes
        themes.forEach((t) => {
            if (t.id !== "default") {
                html.removeAttribute(`data-theme`)
            }
        })
        // Apply new theme
        if (themeId !== "default") {
            html.setAttribute("data-theme", themeId)
        }
    }

    const selectTheme = (themeId: string) => {
        setCurrentTheme(themeId)
        localStorage.setItem("k2m-color-theme", themeId)
        applyTheme(themeId)
    }

    if (!mounted) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        className="h-24 rounded-xl bg-muted animate-pulse"
                    />
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold text-foreground">
                    Color Scheme
                </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => selectTheme(theme.id)}
                        className={cn(
                            "relative p-4 rounded-xl border-2 transition-all duration-200 text-left",
                            currentTheme === theme.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50 bg-card"
                        )}
                    >
                        {/* Color Preview */}
                        <div className="flex gap-1.5 mb-3">
                            {theme.colors.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-6 h-6 rounded-lg"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>

                        {/* Theme Name */}
                        <p className="font-medium text-foreground text-sm">
                            {theme.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {theme.description}
                        </p>

                        {/* Selected Indicator */}
                        {currentTheme === theme.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    )
}
