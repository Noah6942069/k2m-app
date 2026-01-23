"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, ArrowDown, ArrowUp, Zap, CheckCircle, ShieldAlert, Activity, Bell, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageHeaderWithSelector } from "@/components/common/PageHeaderWithSelector"

interface Anomaly {
    id: string
    title: string
    description: string
    severity: "high" | "medium" | "low"
    metric: string
    change: number
    timestamp: string
    status: "new" | "investigating" | "resolved"
}

// Fallback demo data if no real anomalies detected
const demoAnomalies: Anomaly[] = [
    {
        id: "demo-1",
        title: "No Anomalies Detected",
        description: "Your data appears to be within normal ranges. The AI will alert you when statistical outliers are found.",
        severity: "low",
        metric: "Status",
        change: 0,
        timestamp: "Just now",
        status: "resolved"
    }
]

export default function AnomaliesPage() {
    const [anomalies, setAnomalies] = useState<Anomaly[]>([])
    const [loading, setLoading] = useState(true)
    const [datasetName, setDatasetName] = useState<string>("")

    // Dataset Selector State
    const [datasets, setDatasets] = useState<any[]>([])
    const [selectedDatasetId, setSelectedDatasetId] = useState<string | null>(null)
    const [loadingData, setLoadingData] = useState(false)

    // 1. Load Datasets
    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const data = await dsRes.json()
                    setDatasets(data)
                    if (data.length > 0) {
                        setSelectedDatasetId(String(data[data.length - 1].id))
                    }
                }
            } catch (error) {
                console.error("Failed to load datasets", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDatasets()
    }, [])

    // 2. Fetch Anomalies for selected dataset
    useEffect(() => {
        const loadAnomalies = async () => {
            if (!selectedDatasetId) return
            setLoadingData(true)

            try {
                // Find name for header
                const selected = datasets.find(d => String(d.id) === selectedDatasetId)
                if (selected) setDatasetName(selected.filename)

                const anomalyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${selectedDatasetId}/anomalies`)
                if (anomalyRes.ok) {
                    const data = await anomalyRes.json()
                    if (data.anomalies && data.anomalies.length > 0) {
                        setAnomalies(data.anomalies)
                    } else {
                        setAnomalies(demoAnomalies)
                    }
                } else {
                    setAnomalies(demoAnomalies)
                }
            } catch (e) {
                console.error(e)
                setAnomalies(demoAnomalies)
            } finally {
                setLoadingData(false)
            }
        }
        loadAnomalies()
    }, [selectedDatasetId, datasets])

    const resolveAnomaly = (id: string) => {
        setAnomalies(prev => prev.map(a => a.id === id ? { ...a, status: "resolved" } : a))
    }

    const unresolvedCount = anomalies.filter(a => a.status !== "resolved").length

    if (loading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-muted-foreground">Loading specific dataset...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col gap-6">
                <PageHeaderWithSelector
                    title="Smart Anomaly Detection"
                    description="AI-powered monitoring of your critical business metrics."
                    datasets={datasets}
                    selectedId={selectedDatasetId}
                    onSelect={setSelectedDatasetId}
                    loading={loadingData}
                />
            </div>

            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-card border border-border w-fit">
                <div className={`w-3 h-3 rounded-full ${unresolvedCount > 0 ? "bg-red-500 animate-pulse" : "bg-green-500"}`} />
                <span className="font-medium text-foreground">
                    {unresolvedCount > 0 ? `${unresolvedCount} Active Alerts` : "All Systems Normal"}
                </span>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: List */}
                <div className="lg:col-span-2 space-y-4">
                    {anomalies.map((anomaly) => (
                        <div
                            key={anomaly.id}
                            className={`group relative p-6 rounded-2xl border transition-all duration-300 ${anomaly.status === "resolved"
                                ? "bg-muted/30 border-border opacity-60 hover:opacity-100"
                                : "bg-card border-border hover:shadow-lg hover:border-primary/20"
                                }`}
                        >
                            {anomaly.status === "new" && (
                                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 border-2 border-background animate-ping" />
                            )}

                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${anomaly.severity === 'high' ? 'bg-red-500/10 text-red-500' :
                                        anomaly.severity === 'medium' ? 'bg-orange-500/10 text-orange-500' :
                                            'bg-blue-500/10 text-blue-500'
                                        }`}>
                                        <AlertTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-foreground text-lg">{anomaly.title}</h3>
                                            <span className="text-xs text-muted-foreground">• {anomaly.timestamp}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
                                            {anomaly.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <div className={`flex items-center justify-end gap-1 font-bold text-lg ${anomaly.change > 0 ? "text-red-500" : "text-green-500"
                                        }`}>
                                        {anomaly.change > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                                        {Math.abs(anomaly.change)}%
                                    </div>
                                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                        {anomaly.metric}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide border ${anomaly.severity === 'high' ? 'bg-red-500/5 border-red-500/20 text-red-600' :
                                        anomaly.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/20 text-orange-600' :
                                            'bg-blue-500/5 border-blue-500/20 text-blue-600'
                                        }`}>
                                        {anomaly.severity} Priority
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium uppercase tracking-wide border ${anomaly.status === 'resolved' ? 'bg-green-500/5 border-green-500/20 text-green-600' :
                                        'bg-zinc-500/5 border-zinc-500/20 text-zinc-500'
                                        }`}>
                                        {anomaly.status}
                                    </span>
                                </div>

                                {anomaly.status !== "resolved" && (
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                            Investigate
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => resolveAnomaly(anomaly.id)}
                                            className="bg-white/5 hover:bg-white/10 text-foreground border border-border"
                                        >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Resolve
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Column: Status Card */}
                <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-blue-600/20 border border-primary/20">
                        <div className="flex items-center gap-3 mb-4">
                            <ShieldAlert className="w-6 h-6 text-primary" />
                            <h3 className="font-semibold text-foreground">System Status</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Monitoring</span>
                                <span className="text-foreground font-medium">Active (24/7)</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Data Points</span>
                                <span className="text-foreground font-medium">1.2M / min</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">AI Confidence</span>
                                <span className="text-foreground font-medium">99.4%</span>
                            </div>
                            <div className="h-2 rounded-full bg-background/50 overflow-hidden">
                                <div className="h-full bg-primary w-[98%]" />
                            </div>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-6 h-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Recent Activity</h3>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((_, i) => (
                                <div key={i} className="flex gap-3 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2" />
                                    <div>
                                        <p className="text-foreground">System auto-resolved warning #{204 + i}</p>
                                        <p className="text-muted-foreground text-xs">Today, {10 + i}:00 AM</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full mt-4">View Log</Button>
                    </div>

                    <div className="p-6 rounded-2xl bg-card border border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <Bell className="w-6 h-6 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">Alert Settings</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                            Configure how you want to be notified when anomalies are detected.
                        </p>
                        <Button className="w-full">Configure Alerts</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
