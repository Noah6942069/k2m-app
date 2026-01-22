"use client"

import { useState, useEffect } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Loader2, RefreshCw } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface ChartGeneratorProps {
    datasets: any[]
}

export function ChartGenerator({ datasets }: ChartGeneratorProps) {
    const [selectedDataset, setSelectedDataset] = useState<string>("")
    const [chartType, setChartType] = useState<string>("bar")
    const [xAxis, setXAxis] = useState<string>("")
    const [yAxis, setYAxis] = useState<string>("")
    const [columns, setColumns] = useState<string[]>([])

    const [chartData, setChartData] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Reset when dataset changes
    useEffect(() => {
        setXAxis("")
        setYAxis("")
        setChartData(null)
        setColumns([])
        if (selectedDataset) {
            fetchColumns(selectedDataset)
        }
    }, [selectedDataset])

    const fetchColumns = async (id: string) => {
        try {
            const res = await fetch(`http://localhost:8000/visualizations/dataset/${id}/columns`)
            if (res.ok) {
                const cols = await res.json()
                setColumns(cols)
            }
        } catch (e) {
            console.error(e)
        }
    }

    const generateChart = async () => {
        if (!selectedDataset || !xAxis) return

        setLoading(true)
        setError("")
        try {
            let url = `http://localhost:8000/visualizations/dataset/${selectedDataset}/generate?type=${chartType}&x_axis=${xAxis}`
            if (yAxis && yAxis !== "count_ops") url += `&y_axis=${yAxis}`

            const res = await fetch(url)
            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.detail || "Failed to generate chart")
            }
            const data = await res.json()
            setChartData(data)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-4">
            {/* Configuration Panel */}
            <Card className="lg:col-span-1 rounded-[2rem] bg-[#111116] border-white/5 shadow-none h-fit">
                <CardHeader>
                    <CardTitle className="text-white">Configure Chart</CardTitle>
                    <CardDescription className="text-zinc-500">Select parameters to visualize</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Dataset</label>
                        <Select onValueChange={setSelectedDataset} value={selectedDataset}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue placeholder="Select dataset" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {datasets.map((ds) => (
                                    <SelectItem key={ds.id} value={String(ds.id)}>{ds.filename}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Chart Type</label>
                        <Select onValueChange={setChartType} value={chartType}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="bar">Bar Chart (Distribution)</SelectItem>
                                <SelectItem value="line">Line Chart (Trend)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">X Axis (Category)</label>
                        <Select onValueChange={setXAxis} value={xAxis} disabled={!selectedDataset}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue placeholder="Select column" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>{col}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Y Axis (Value) - Optional</label>
                        <Select onValueChange={setYAxis} value={yAxis} disabled={!selectedDataset}>
                            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectValue placeholder="Count (Default)" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                <SelectItem value="count_ops">Count (Frequency)</SelectItem>
                                {columns.map((col) => (
                                    <SelectItem key={col} value={col}>{col}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        onClick={generateChart}
                        disabled={!selectedDataset || !xAxis || loading}
                        className="w-full h-12 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Visualization
                    </Button>
                </CardContent>
            </Card>

            {/* Chart Display */}
            <Card className="lg:col-span-3 rounded-[2rem] bg-[#111116] border-white/5 shadow-none min-h-[400px] flex flex-col">
                <CardHeader>
                    <CardTitle className="text-white">
                        {chartData ? chartData.title : "Visualization Preview"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center p-6">
                    {loading ? (
                        <Loader2 className="h-10 w-10 text-purple-500 animate-spin" />
                    ) : error ? (
                        <div className="text-red-400 bg-red-900/10 p-4 rounded-lg">
                            Error: {error}
                        </div>
                    ) : chartData ? (
                        <ResponsiveContainer width="100%" height={400}>
                            {chartData.type === 'bar' ? (
                                <BarChart data={chartData.data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey={Object.keys(chartData.config)[0]} tick={{ fill: '#a1a1aa' }} />
                                    <YAxis tick={{ fill: '#a1a1aa' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                        cursor={{ fill: '#27272a', opacity: 0.4 }}
                                    />
                                    <Bar dataKey={Object.keys(chartData.config)[1] || "count"} fill="#9333ea" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            ) : (
                                <LineChart data={chartData.data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                                    <XAxis dataKey={Object.keys(chartData.config)[0]} tick={{ fill: '#a1a1aa' }} />
                                    <YAxis tick={{ fill: '#a1a1aa' }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#fff' }}
                                    />
                                    <Line type="monotone" dataKey={Object.keys(chartData.config)[1]} stroke="#9333ea" strokeWidth={2} dot={{ fill: '#9333ea' }} />
                                </LineChart>
                            )}
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center text-zinc-500">
                            <p>Select a dataset and axes to generate a chart.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
