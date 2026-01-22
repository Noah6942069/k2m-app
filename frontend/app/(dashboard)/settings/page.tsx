"use client"

import { useTheme } from "next-themes"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useState, useEffect } from "react"
import {
    Settings as SettingsIcon,
    Moon,
    Trash2,
    Download,
    Info,
    CheckCircle,
    TrendingUp,
    Database,
    BarChart3,
    Beaker,
    Users,
    Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SettingsPage() {
    const [clearConfirm, setClearConfirm] = useState(false)
    const [clearing, setClearing] = useState(false)
    const [cleared, setCleared] = useState(false)
    const { theme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const clearAllData = async () => {
        setClearing(true)
        try {
            const res = await fetch("http://localhost:8000/datasets/")
            if (res.ok) {
                const datasets = await res.json()
                for (const ds of datasets) {
                    await fetch(`http://localhost:8000/datasets/${ds.id}`, { method: "DELETE" })
                }
            }
            setCleared(true)
            setClearConfirm(false)
        } catch (error) {
            console.error("Failed to clear data", error)
        } finally {
            setClearing(false)
        }
    }

    if (!mounted) return null

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your K2M Analytics preferences</p>
            </div>

            {/* App Info */}
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="p-5 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-foreground">K2M Analytics</h2>
                            <p className="text-xs text-muted-foreground">Version 2.0.0 • Enterprise Edition</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-border">
                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Theme</p>
                                <p className="text-xs text-muted-foreground">Current appearance mode</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground capitalize mr-2">{theme} Mode</span>
                            <ThemeToggle />
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <Database className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Storage</p>
                                <p className="text-xs text-muted-foreground">Local SQLite database</p>
                            </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                            Connected
                        </span>
                    </div>

                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">AI Engine</p>
                                <p className="text-xs text-muted-foreground">Pattern-based insights</p>
                            </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Active (Simulated)</span>
                    </div>

                    <div className="flex items-center justify-between p-5">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Clients Module</p>
                                <p className="text-xs text-muted-foreground">Client management system</p>
                            </div>
                        </div>
                        <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                            Enabled
                        </span>
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div className="rounded-2xl bg-card border border-border p-5">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-muted-foreground" />
                    Data Management
                </h3>

                <div className="space-y-4">
                    {/* Export */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-accent/50 border border-border">
                        <div>
                            <p className="text-sm font-medium text-foreground">Export All Data</p>
                            <p className="text-xs text-muted-foreground">Download all client data as ZIP</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-border text-muted-foreground" disabled>
                            <Download className="w-4 h-4 mr-2" />
                            Coming Soon
                        </Button>
                    </div>

                    {/* Clear Data */}
                    <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <div>
                            <p className="text-sm font-medium text-foreground">Clear All Data</p>
                            <p className="text-xs text-muted-foreground">Delete all datasets and reset</p>
                        </div>
                        {cleared ? (
                            <div className="flex items-center gap-2 text-emerald-400 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Cleared
                            </div>
                        ) : clearConfirm ? (
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setClearConfirm(false)}
                                    className="text-muted-foreground"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={clearAllData}
                                    disabled={clearing}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    {clearing ? "Clearing..." : "Confirm"}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                onClick={() => setClearConfirm(true)}
                                className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-0"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Clear Data
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* About */}
            <div className="rounded-2xl bg-card border border-border p-5">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-4 h-4 text-muted-foreground" />
                    About K2M
                </h3>
                <div className="text-sm text-foreground space-y-2">
                    <p>K2M Analytics is a professional data analytics platform designed for data-driven decision making.</p>
                    <p className="text-muted-foreground">Features: Client Management, AI-Powered Insights, Interactive Dashboards, and Data Cleaning Pipelines.</p>
                </div>
            </div>
        </div>
    )
}
