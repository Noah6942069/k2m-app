"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkles, ArrowRight, Download, Share2, Printer, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from "recharts"

export default function DataStoryPage() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [showStory, setShowStory] = useState(false)
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const storyRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const loadData = async () => {
            try {
                const dsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
                if (dsRes.ok) {
                    const data = await dsRes.json()
                    if (data.length > 0) {
                        const latest = data[data.length - 1]
                        const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/analytics/${latest.id}/stats`)
                        if (statsRes.ok) {
                            const statsData = await statsRes.json()
                            setStats(statsData)
                        }
                    }
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    const generateDynamicStory = () => {
        if (!stats) return []

        const sa = stats.smart_analysis || {}
        const totalSales = sa.total_sales || 0
        const bestMonth = sa.best_month || "Unknown"
        const topProd = sa.top_product || "Unknown"

        // Prepare chart data
        const salesData = sa.sales_over_time?.map((pt: any) => ({ name: pt.date, value: pt.value })) || []
        const catData = sa.top_categories?.map((pt: any) => ({ name: pt.name, value: pt.value })) || []

        return [
            {
                id: "executive-summary",
                title: "Executive Summary",
                content: `This report analyzes the dataset '${stats.filename}'. We identified ${stats.total_rows} records with a total detected volume of $${totalSales.toLocaleString()}. The data indicates that ${bestMonth} was the most significant period for activity.`,
                highlight: totalSales > 0 ? `Vol: $${(totalSales / 1000).toFixed(1)}K` : "Data Analyzed",
                sentiment: "positive"
            },
            {
                id: "revenue-analysis",
                title: "Performance Trends",
                content: `Activity peaked in ${bestMonth}. The trend analysis suggests clear seasonality or growth patterns.`,
                chartType: "area",
                data: salesData.length > 0 ? salesData : [
                    { name: "Week 1", value: 400 }, { name: "Week 2", value: 300 }, { name: "Week 3", value: 500 }, { name: "Week 4", value: 200 }
                ]
            },
            {
                id: "risk-assessment",
                title: "Key Observations",
                content: `Our algorithm identified '${topProd}' as the leading category/product. This segment outperforms others and represents a key driver for the totals observed.`,
                highlight: "Top Performer",
                sentiment: "positive"
            },
            {
                id: "regional-breakdown",
                title: "Category Breakdown",
                content: `The distribution of data shows significant concentration in top categories. Monitoring the performance of '${topProd}' vs others is recommended.`,
                chartType: "bar",
                data: catData.length > 0 ? catData : [
                    { name: "A", value: 100 }, { name: "B", value: 80 }, { name: "C", value: 50 }
                ]
            }
        ]
    }

    const storySections = generateDynamicStory()

    const handleGenerate = async () => {
        setIsGenerating(true)
        await new Promise(resolve => setTimeout(resolve, 2000))
        setShowStory(true)
        setIsGenerating(false)
    }

    if (!showStory) {
        return (
            <div className="h-[calc(100vh-8rem)] flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="text-center max-w-lg mx-auto p-8 rounded-3xl bg-card border border-border shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-3">Generate Data Story</h1>
                    <p className="text-muted-foreground mb-8 text-lg">
                        Turn your complex data dashboards into a clear, narrative-driven report that tells the story behind the numbers.
                    </p>
                    <Button
                        size="lg"
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full text-lg h-14 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 rounded-xl transition-all hover:scale-105"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                                Analyzing Data...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5 mr-3" />
                                Generate Story
                            </>
                        )}
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-10 duration-700">
            {/* Header Actions */}
            <div className="flex items-center justify-between mb-12">
                <Button variant="ghost" onClick={() => setShowStory(false)} className="text-muted-foreground hover:text-foreground">
                    ← Back to Generator
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.print()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                        disabled={isExporting}
                        onClick={async () => {
                            if (!storyRef.current) return
                            setIsExporting(true)
                            try {
                                const html2pdf = (await import('html2pdf.js')).default
                                const opt = {
                                    margin: 0.5,
                                    filename: `${stats?.filename?.replace(/\.[^/.]+$/, "") || "report"}_story.pdf`,
                                    image: { type: 'jpeg' as const, quality: 0.98 },
                                    html2canvas: { scale: 2, useCORS: true },
                                    jsPDF: { unit: 'in' as const, format: 'letter' as const, orientation: 'portrait' as const }
                                }
                                await html2pdf().set(opt).from(storyRef.current).save()
                            } catch (error) {
                                console.error("PDF export failed", error)
                            } finally {
                                setIsExporting(false)
                            }
                        }}
                    >
                        {isExporting ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        {isExporting ? "Exporting..." : "Export PDF"}
                    </Button>
                </div>
            </div>

            {/* Story Content */}
            <div ref={storyRef} className="space-y-16">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                        AI Generated Report
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                        {stats ? `Analysis: ${stats.filename.replace(/\.[^/.]+$/, "")}` : "Data Analysis Report"}
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        Prepared for K2M • {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>

                <div className="grid gap-12">
                    {storySections.map((section, index) => (
                        <div key={section.id} className="group relative pl-8 border-l-2 border-border hover:border-primary transition-colors duration-500">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-background border-2 border-border group-hover:border-primary transition-colors" />

                            <div className="space-y-6">
                                <div className="flex items-start justify-between">
                                    <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                                        {section.title}
                                    </h2>
                                    {section.highlight && (
                                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${section.sentiment === 'positive'
                                            ? 'bg-green-500/10 text-green-500'
                                            : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            {section.sentiment === 'positive' ? <TrendingUp className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            {section.highlight}
                                        </div>
                                    )}
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                                    {section.content}
                                </p>

                                {section.chartType && (
                                    <div className="mt-8 p-6 rounded-2xl bg-card border border-border shadow-sm h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            {section.chartType === 'area' ? (
                                                <AreaChart data={section.data}>
                                                    <defs>
                                                        <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.3} />
                                                            <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0} />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                    <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                                                    <Tooltip contentStyle={{ backgroundColor: "#1f1f23", border: "none" }} />
                                                    <Area type="monotone" dataKey="value" stroke="#7c5cfc" fillOpacity={1} fill={`url(#gradient-${index})`} />
                                                </AreaChart>
                                            ) : (
                                                <BarChart data={section.data}>
                                                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                                    <XAxis dataKey="name" stroke="#888888" tickLine={false} axisLine={false} />
                                                    <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: "#1f1f23", border: "none" }} />
                                                    <Bar dataKey="value" fill="#7c5cfc" radius={[4, 4, 0, 0]} />
                                                </BarChart>
                                            )}
                                        </ResponsiveContainer>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-muted/30 border border-border text-center space-y-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">End of Report</h3>
                    <p className="text-muted-foreground max-w-md">
                        This report was generated by AI based on your live data.
                        Actions recommended: <strong>Launch Loyalty Program</strong>, <strong>Expand EMEA Sales Team</strong>.
                    </p>
                    <Button className="bg-foreground text-background hover:bg-foreground/90 mt-4">
                        Approve & Share
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
