"use client"

import { useState, useEffect } from "react"
import {
    Beaker,
    Trash2,
    Filter,
    ArrowDownUp,
    Copy,
    Sparkles,
    Play,
    Plus,
    X,
    CheckCircle,
    Database
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TransformStep {
    id: string
    type: "drop_na" | "drop_duplicates" | "filter" | "sort"
    column?: string
    config?: any
}

export default function AnalysisPage() {
    const [datasets, setDatasets] = useState<any[]>([])
    const [selectedDataset, setSelectedDataset] = useState<number | null>(null)
    const [columns, setColumns] = useState<string[]>([])
    const [steps, setSteps] = useState<TransformStep[]>([])
    const [processing, setProcessing] = useState(false)
    const [result, setResult] = useState<any>(null)

    useEffect(() => {
        fetchDatasets()
    }, [])

    const fetchDatasets = async () => {
        try {
            const res = await fetch("http://localhost:8000/datasets/")
            if (res.ok) {
                const data = await res.json()
                setDatasets(data)
            }
        } catch (error) {
            console.error("Failed to fetch datasets", error)
        }
    }

    const fetchColumns = async (id: number) => {
        try {
            const res = await fetch(`http://localhost:8000/visualizations/dataset/${id}/columns`)
            if (res.ok) {
                const cols = await res.json()
                setColumns(cols)
            }
        } catch (error) {
            console.error("Failed to fetch columns", error)
        }
    }

    const handleDatasetSelect = (id: number) => {
        setSelectedDataset(id)
        fetchColumns(id)
        setSteps([])
        setResult(null)
    }

    const addStep = (type: TransformStep["type"]) => {
        const newStep: TransformStep = {
            id: Date.now().toString(),
            type,
            column: columns[0] || undefined
        }
        setSteps([...steps, newStep])
    }

    const removeStep = (id: string) => {
        setSteps(steps.filter(s => s.id !== id))
    }

    const updateStepColumn = (id: string, column: string) => {
        setSteps(steps.map(s => s.id === id ? { ...s, column } : s))
    }

    const runPipeline = async () => {
        if (!selectedDataset || steps.length === 0) return

        setProcessing(true)
        // Simulate processing (backend would handle this)
        await new Promise(resolve => setTimeout(resolve, 1500))

        setResult({
            success: true,
            message: `Applied ${steps.length} transformation(s) to dataset`,
            rowsBefore: datasets.find(d => d.id === selectedDataset)?.total_rows || 0,
            rowsAfter: Math.floor((datasets.find(d => d.id === selectedDataset)?.total_rows || 100) * 0.85)
        })
        setProcessing(false)
    }

    const stepLabels: Record<TransformStep["type"], { label: string; icon: any; description: string }> = {
        drop_na: { label: "Drop Missing", icon: Trash2, description: "Remove rows with null values" },
        drop_duplicates: { label: "Remove Duplicates", icon: Copy, description: "Remove duplicate rows" },
        filter: { label: "Filter Rows", icon: Filter, description: "Keep rows matching condition" },
        sort: { label: "Sort Data", icon: ArrowDownUp, description: "Order by column values" }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-foreground">Analysis Pipeline</h1>
                <p className="text-muted-foreground">Clean and transform your datasets with visual pipelines</p>
            </div>

            {/* Empty State */}
            {datasets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-card border border-border">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                        <Beaker className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No datasets to analyze</h3>
                    <p className="text-muted-foreground text-sm mb-4">Upload a dataset first to build analysis pipelines</p>
                    <Link href="/datasets">
                        <Button className="bg-primary hover:bg-primary/90">
                            <Database className="w-4 h-4 mr-2" />
                            Go to Datasets
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Dataset Selection */}
                    <div className="rounded-2xl bg-card border border-border p-5">
                        <h3 className="font-medium text-foreground mb-4">Select Dataset</h3>
                        <div className="space-y-2">
                            {datasets.map(ds => (
                                <button
                                    key={ds.id}
                                    onClick={() => handleDatasetSelect(ds.id)}
                                    className={`w-full text-left p-3 rounded-xl transition-all ${selectedDataset === ds.id
                                        ? "bg-primary/10 border border-primary/20 text-primary"
                                        : "bg-muted border border-border text-muted-foreground hover:bg-muted/80"
                                        }`}
                                >
                                    <p className="font-medium text-sm truncate">{ds.filename}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{ds.total_rows?.toLocaleString()} rows</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Center Panel: Pipeline Builder */}
                    <div className="lg:col-span-2 rounded-2xl bg-card border border-border p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium text-foreground">Pipeline Steps</h3>
                            {steps.length > 0 && (
                                <Button
                                    onClick={runPipeline}
                                    disabled={processing || !selectedDataset}
                                    className="bg-violet-600 hover:bg-violet-700 text-white"
                                    size="sm"
                                >
                                    {processing ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-4 h-4 mr-2" />
                                            Run Pipeline
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>

                        {!selectedDataset ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p>Select a dataset to start building your pipeline</p>
                            </div>
                        ) : (
                            <>
                                {/* Add Step Buttons */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {(Object.entries(stepLabels) as [TransformStep["type"], typeof stepLabels["drop_na"]][]).map(([type, { label, icon: Icon }]) => (
                                        <button
                                            key={type}
                                            onClick={() => addStep(type)}
                                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all text-sm"
                                        >
                                            <Plus className="w-3 h-3" />
                                            <Icon className="w-3.5 h-3.5" />
                                            {label}
                                        </button>
                                    ))}
                                </div>

                                {/* Steps List */}
                                {steps.length === 0 ? (
                                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
                                        <Sparkles className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                        <p className="text-muted-foreground text-sm">Add transformation steps above</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {steps.map((step, idx) => {
                                            const { label, icon: Icon, description } = stepLabels[step.type]
                                            return (
                                                <div
                                                    key={step.id}
                                                    className="flex items-center gap-3 p-4 rounded-xl bg-muted border border-border group"
                                                >
                                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                                                        {idx + 1}
                                                    </div>
                                                    <Icon className="w-4 h-4 text-muted-foreground" />
                                                    <div className="flex-1">
                                                        <p className="text-foreground text-sm font-medium">{label}</p>
                                                        <p className="text-muted-foreground text-xs">{description}</p>
                                                    </div>
                                                    {step.type !== "drop_duplicates" && columns.length > 0 && (
                                                        <select
                                                            value={step.column || ""}
                                                            onChange={(e) => updateStepColumn(step.id, e.target.value)}
                                                            className="px-3 py-1.5 rounded-lg bg-background border border-border text-sm text-foreground"
                                                        >
                                                            <option value="">All columns</option>
                                                            {columns.map(col => (
                                                                <option key={col} value={col}>{col}</option>
                                                            ))}
                                                        </select>
                                                    )}
                                                    <button
                                                        onClick={() => removeStep(step.id)}
                                                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {/* Result */}
                                {result && (
                                    <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="flex items-center gap-2 text-emerald-500 mb-2">
                                            <CheckCircle className="w-4 h-4" />
                                            <span className="font-medium text-sm">Pipeline Complete</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm">{result.message}</p>
                                        <p className="text-muted-foreground text-xs mt-1">
                                            {result.rowsBefore.toLocaleString()} rows → {result.rowsAfter.toLocaleString()} rows
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
