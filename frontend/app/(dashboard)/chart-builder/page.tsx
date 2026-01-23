"use client"

import { useState, useEffect } from "react"
import { Send, Sparkles, BarChart3, PieChart, LineChart, RefreshCw, Download, Maximize2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart as ReLineChart, Line, PieChart as RePieChart, Pie, Cell } from "recharts"

export default function ChartBuilderPage() {
    const [prompt, setPrompt] = useState("")
    const [isGenerating, setIsGenerating] = useState(false)
    const [generatedChart, setGeneratedChart] = useState<any>(null)
    const [stats, setStats] = useState<any>(null)
    const [datasetName, setDatasetName] = useState("")
    const [loading, setLoading] = useState(true)

    // Fetch latest dataset on mount
    useEffect(() => {
        const loadData = async () => {
            try {
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const datasets = await dsRes.json()
                    if (datasets.length > 0) {
                        const latest = datasets[datasets.length - 1]
                        setDatasetName(latest.filename)

                        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/stats`)
                        if (statsRes.ok) {
                            const data = await statsRes.json()
                            setStats(data)
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to load dataset", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    // Generate suggested prompts from real data
    const getSuggestedPrompts = () => {
        if (!stats?.columns) {
            return [
                "Sales trend over the last year",
                "Customer distribution by region (Pie)",
                "Profit margin analysis",
                "Revenue vs Expenses comparison"
            ]
        }
        const numericCols = stats.columns.filter((c: any) => c.type === "numeric").slice(0, 2)
        const catCols = stats.columns.filter((c: any) => c.type === "categorical").slice(0, 2)

        const prompts = []
        if (numericCols.length > 0) {
            prompts.push(`Show ${numericCols[0]?.name} trend as a line chart`)
            if (numericCols.length > 1) {
                prompts.push(`Compare ${numericCols[0]?.name} vs ${numericCols[1]?.name}`)
            }
        }
        if (catCols.length > 0) {
            prompts.push(`Distribution by ${catCols[0]?.name} (Pie chart)`)
        }
        prompts.push("Show top performing categories")
        return prompts.slice(0, 4)
    }

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!prompt.trim()) return

        setIsGenerating(true)
        // Simulate AI generation with real data context
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Use real data if available, otherwise fallback
        let chartData = stats?.smart_analysis?.monthly_data || [
            { name: "Jan", value: 4000, value2: 2400 },
            { name: "Feb", value: 3000, value2: 1398 },
            { name: "Mar", value: 2000, value2: 9800 },
            { name: "Apr", value: 2780, value2: 3908 },
            { name: "May", value: 1890, value2: 4800 },
            { name: "Jun", value: 2390, value2: 3800 },
        ]

        let type = "bar"
        if (prompt.toLowerCase().includes("line") || prompt.toLowerCase().includes("trend")) type = "line"
        if (prompt.toLowerCase().includes("pie") || prompt.toLowerCase().includes("distribution")) type = "pie"

        setGeneratedChart({
            type,
            title: `Analysis: ${prompt}`,
            data: chartData
        })
        setIsGenerating(false)
    }

    const renderChart = () => {
        if (!generatedChart) return null
        const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#00C49F", "#FFBB28"]

        const CommonProps = {
            data: generatedChart.data,
            margin: { top: 10, right: 30, left: 0, bottom: 0 }
        }

        if (generatedChart.type === "line") {
            return (
                <ReLineChart {...CommonProps}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="value2" stroke="#82ca9d" strokeWidth={2} dot={false} />
                </ReLineChart>
            )
        }

        if (generatedChart.type === "pie") {
            return (
                <RePieChart>
                    <Pie
                        data={generatedChart.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {generatedChart.data.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                </RePieChart>
            )
        }

        return (
            <BarChart {...CommonProps}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value2" fill="#82ca9d" radius={[4, 4, 0, 0]} />
            </BarChart>
        )
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Chart Builder</h1>
                    <p className="text-muted-foreground mt-2">
                        Describe the chart you want to see, and AI will generate it instantly.
                    </p>
                </div>
                {datasetName && (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm">
                        <Database className="w-3.5 h-3.5" />
                        <span className="font-medium">{datasetName}</span>
                    </div>
                )}
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                {/* Left Panel: Input & History */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <div className="p-6 rounded-2xl bg-card border border-border shadow-sm">
                        <form onSubmit={handleGenerate} className="flex flex-col gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-2 block">
                                    What would you like to visualize?
                                </label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. Show me a bar chart comparing revenue vs expenses for the last 6 months..."
                                    className="w-full h-32 p-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none transition-all"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={!prompt.trim() || isGenerating}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium shadow-lg shadow-primary/20"
                            >
                                {isGenerating ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Chart
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    <div className="flex-1 p-6 rounded-2xl bg-card/50 border border-border/50">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                            Suggested Prompts
                        </h3>
                        <div className="space-y-2">
                            {getSuggestedPrompts().map((suggestion, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPrompt(suggestion)}
                                    className="w-full text-left px-4 py-3 rounded-xl bg-muted/30 hover:bg-muted text-sm text-foreground transition-all border border-transparent hover:border-border flex items-center justify-between group"
                                >
                                    {suggestion}
                                    <ArrowUpRight className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Canvas */}
                <div className="lg:col-span-2 flex flex-col rounded-2xl bg-card border border-border overflow-hidden shadow-sm relative">
                    {!generatedChart ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-muted/5 border-2 border-dashed border-border/50 m-4 rounded-xl">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <BarChart3 className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">Ready to Visualize</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Enter a prompt to generate a custom visualization. You can ask for bar charts, line graphs, or pie charts.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm">
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    {generatedChart.type === 'bar' && <BarChart3 className="w-4 h-4 text-purple-500" />}
                                    {generatedChart.type === 'line' && <LineChart className="w-4 h-4 text-emerald-500" />}
                                    {generatedChart.type === 'pie' && <PieChart className="w-4 h-4 text-blue-500" />}
                                    {generatedChart.title}
                                </h3>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                        <Download className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                        <Maximize2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex-1 min-h-[400px] p-6 flex items-center justify-center bg-gradient-to-b from-transparent to-muted/5">
                                <div className="w-full h-full max-h-[500px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        {renderChart() || <div />}
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div >
    )
}

function ArrowUpRight({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
        </svg>
    )
}
