"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MiniSparkline } from "@/components/ui/mini-sparkline"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import { cn } from "@/lib/utils"

interface Metric {
    id: string
    title: string
    value: string | number
    trend?: number
    status?: "positive" | "negative" | "neutral"
    sparklineData?: number[]
    color?: string
}

interface OverviewTableProps {
    data: Metric[]
}

export function OverviewTable({ data }: OverviewTableProps) {
    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableHead className="w-[300px]">Metric Name</TableHead>
                        <TableHead>Current Value</TableHead>
                        <TableHead className="w-[200px]">Trend (30 Days)</TableHead>
                        <TableHead>Change</TableHead>
                        <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((metric) => {
                        const isPositive = metric.trend && metric.trend > 0;
                        const isNegative = metric.trend && metric.trend < 0;

                        return (
                            <TableRow key={metric.id} className="group hover:bg-muted/30 transition-colors">
                                <TableCell className="font-medium text-foreground">
                                    {metric.title}
                                </TableCell>
                                <TableCell className="font-display font-bold text-lg">
                                    {metric.value}
                                </TableCell>
                                <TableCell>
                                    <div className="h-8 w-32">
                                        <MiniSparkline
                                            data={metric.sparklineData || [10, 15, 12, 18, 20]}
                                            color={metric.color || "#8b5cf6"}
                                        />
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={cn(
                                        "flex items-center gap-1.5 text-sm font-medium w-fit px-2 py-0.5 rounded-full",
                                        isPositive && "text-emerald-500 bg-emerald-500/10",
                                        isNegative && "text-rose-500 bg-rose-500/10",
                                        !isPositive && !isNegative && "text-muted-foreground bg-muted"
                                    )}>
                                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> :
                                            isNegative ? <ArrowDownRight className="w-3 h-3" /> :
                                                <Minus className="w-3 h-3" />}
                                        {Math.abs(metric.trend || 0)}%
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end">
                                        <div className={cn(
                                            "h-2.5 w-2.5 rounded-full",
                                            isPositive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" :
                                                isNegative ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" : "bg-gray-400"
                                        )} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
