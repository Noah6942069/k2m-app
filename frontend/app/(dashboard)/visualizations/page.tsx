"use client"

import { ChartGenerator } from "@/components/visualizations/ChartGenerator"
import { useEffect, useState } from "react"
import { BarChart3, Lightbulb, Database } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function VisualizationsPage() {
    const [datasets, setDatasets] = useState<any[]>([])

    const fetchDatasets = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
            if (res.ok) {
                const data = await res.json()
                setDatasets(data)
            }
        } catch (error) {
            console.error("Failed to fetch datasets", error)
        }
    }

    useEffect(() => {
        fetchDatasets()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Visualizations</h1>
                    <p className="text-zinc-500">Create interactive charts from your datasets</p>
                </div>
            </div>

            {/* Empty State */}
            {datasets.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-[#0f0f12] border border-white/[0.04]">
                    <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mb-4">
                        <BarChart3 className="w-8 h-8 text-violet-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-1">No datasets available</h3>
                    <p className="text-zinc-500 text-sm mb-4">Upload a dataset first to create visualizations</p>
                    <Link href="/datasets">
                        <Button className="bg-violet-600 hover:bg-violet-700">
                            <Database className="w-4 h-4 mr-2" />
                            Go to Datasets
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Tips Card */}
                    <div className="rounded-2xl bg-gradient-to-r from-violet-500/10 to-blue-500/10 border border-violet-500/20 p-4 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-4 h-4 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-sm text-zinc-300">
                                <strong className="text-white">Pro Tip:</strong> Select a categorical column for X-axis and leave Y-axis empty to see frequency distribution.
                            </p>
                        </div>
                    </div>

                    {/* Chart Generator */}
                    <ChartGenerator datasets={datasets} />
                </>
            )}
        </div>
    )
}
