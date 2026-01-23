"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useTranslation } from "@/lib/i18n/language-context"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Calculator, RefreshCw, TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { smartFormat } from "@/lib/utils/smart-format"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts"

export default function SimulationPage() {
    const { t } = useTranslation()
    const { user } = useAuth()

    // Sliders State (-50% to +50%)
    const [priceChange, setPriceChange] = useState(0)
    const [volumeChange, setVolumeChange] = useState(0)
    const [costChange, setCostChange] = useState(0)

    // Base Stats (Mocked or fetched)
    const [baseStats, setBaseStats] = useState({
        revenue: 1250000, // $1.25M
        volume: 50000,    // 50k units
        unitPrice: 25,    // $25
        unitCost: 15,     // $15 margin
        fixedCosts: 200000,
        profit: 300000
    })

    useEffect(() => {
        // Calculate initial profit
        const revenue = baseStats.volume * baseStats.unitPrice
        const varCost = baseStats.volume * baseStats.unitCost
        const profit = revenue - varCost - baseStats.fixedCosts
        setBaseStats(prev => ({ ...prev, revenue, profit }))
    }, [])

    // Derived Stats (Simulated)
    const simPrice = baseStats.unitPrice * (1 + priceChange / 100)
    const simVolume = baseStats.volume * (1 + volumeChange / 100)
    const simCost = baseStats.unitCost * (1 + costChange / 100)

    const simRevenue = simVolume * simPrice
    const simVarCost = simVolume * simCost
    const simProfit = simRevenue - simVarCost - baseStats.fixedCosts

    const profitDiff = simProfit - baseStats.profit
    const profitGrowth = (profitDiff / baseStats.profit) * 100

    // Chart Data
    const data = [
        { name: "Current", profit: baseStats.profit, color: "#94a3b8" },
        { name: "Scenario", profit: simProfit, color: profitDiff >= 0 ? "#10b981" : "#ef4444" }
    ]

    const handleReset = () => {
        setPriceChange(0)
        setVolumeChange(0)
        setCostChange(0)
    }

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Calculator className="w-8 h-8 text-primary" />
                        What-If Scenario Playground
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Simulate business outcomes by adjusting key variables.
                    </p>
                </div>
                <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Reset Model
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Controls */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="premium-card p-6 space-y-6">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-500" />
                            Variables
                        </h3>

                        {/* Price Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Unit Price Impact</label>
                                <span className={cn("text-sm font-bold", priceChange > 0 ? "text-green-500" : priceChange < 0 ? "text-red-500" : "text-muted-foreground")}>
                                    {priceChange > 0 && "+"}{priceChange}%
                                </span>
                            </div>
                            <Slider
                                value={[priceChange]}
                                onValueChange={(val) => setPriceChange(val[0])}
                                min={-50}
                                max={50}
                                step={1}
                                className="py-2"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>$12.50</span>
                                <span>Current: $25.00</span>
                                <span>$37.50</span>
                            </div>
                        </div>

                        {/* Volume Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Sales Volume</label>
                                <span className={cn("text-sm font-bold", volumeChange > 0 ? "text-green-500" : volumeChange < 0 ? "text-red-500" : "text-muted-foreground")}>
                                    {volumeChange > 0 && "+"}{volumeChange}%
                                </span>
                            </div>
                            <Slider
                                value={[volumeChange]}
                                onValueChange={(val) => setVolumeChange(val[0])}
                                min={-50}
                                max={50}
                                step={1}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>25k</span>
                                <span>Current: 50k</span>
                                <span>75k</span>
                            </div>
                        </div>

                        {/* Cost Slider */}
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium">Unit Cost (COGS)</label>
                                <span className={cn("text-sm font-bold", costChange < 0 ? "text-green-500" : costChange > 0 ? "text-red-500" : "text-muted-foreground")}>
                                    {costChange > 0 && "+"}{costChange}%
                                </span>
                            </div>
                            <Slider
                                value={[costChange]}
                                onValueChange={(val) => setCostChange(val[0])}
                                min={-50}
                                max={50}
                                step={1}
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>$7.50</span>
                                <span>Current: $15.00</span>
                                <span>$22.50</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="premium-card p-4 text-center">
                            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Simulated Revenue</p>
                            <p className="text-xl font-bold text-foreground">{smartFormat(simRevenue, "revenue")}</p>
                            <span className="text-xs text-muted-foreground">
                                vs {smartFormat(baseStats.revenue, "revenue")}
                            </span>
                        </div>
                        <div className="premium-card p-4 text-center">
                            <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Simulated Margin</p>
                            <p className="text-xl font-bold text-foreground">{smartFormat((simProfit / simRevenue) * 100, "profitMargin")}</p>
                            <span className="text-xs text-muted-foreground">
                                vs {smartFormat((baseStats.profit / baseStats.revenue) * 100, "profitMargin")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Results */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Hero Result Card */}
                    <div className={cn("premium-card p-8 border-l-4 transition-all duration-500", profitDiff >= 0 ? "border-l-green-500 bg-green-500/5" : "border-l-red-500 bg-red-500/5")}>
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div>
                                <h2 className="text-lg font-medium text-foreground">Projected Profit Impact</h2>
                                <div className="flex items-baseline gap-3 mt-1">
                                    <span className={cn("text-5xl font-bold tracking-tight", profitDiff >= 0 ? "text-green-500" : "text-red-500")}>
                                        {profitDiff > 0 && "+"}{smartFormat(profitDiff, "profit")}
                                    </span>
                                    <span className={cn("text-lg font-semibold", profitGrowth >= 0 ? "text-green-600" : "text-red-600")}>
                                        ({profitGrowth > 0 && "+"}{profitGrowth.toFixed(1)}%)
                                    </span>
                                </div>
                                <p className="text-muted-foreground mt-2 max-w-md">
                                    {profitDiff >= 0
                                        ? "This scenario results in a significant profit increase. Great job optimizing the margins!"
                                        : "Warning: This scenario reduces overall profitability. Consider offsetting costs or increasing volume."}
                                </p>
                            </div>
                            <div className={cn("p-4 rounded-full", profitDiff >= 0 ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-600")}>
                                {profitDiff >= 0 ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="premium-card p-6 h-[400px]">
                        <h3 className="font-semibold mb-6 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-primary" />
                            Profit Comparison
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fill: 'currentColor', fontSize: 14, fontWeight: 500 }} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                                    formatter={(value) => smartFormat(value, "profit")}
                                />
                                <Bar dataKey="profit" radius={[0, 4, 4, 0]} barSize={40}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}

function cn(...classes: (string | undefined | null | false)[]) {
    return classes.filter(Boolean).join(" ")
}
