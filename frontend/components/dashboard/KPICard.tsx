"use client"

import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    color?: string;
    loading?: boolean;
}

export function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendLabel,
    color = "#7c5cfc",
    loading = false
}: KPICardProps) {

    if (loading) {
        return (
            <div className="metric-card p-5 animate-pulse">
                <div className="flex justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-muted" />
                    <div className="w-12 h-4 bg-muted rounded" />
                </div>
                <div className="text-2xl font-bold bg-muted h-8 w-24 rounded mb-2" />
                <div className="h-3 w-32 bg-muted rounded" />
            </div>
        );
    }

    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;

    return (
        <div className="metric-card p-5 hover:border-primary/20 transition-all duration-300">
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
                    style={{ backgroundColor: `${color}15` }}
                >
                    <Icon className="w-5 h-5" style={{ color: color }} />
                </div>
                {trend !== undefined && (
                    <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${isPositive ? "text-emerald-400 bg-emerald-400/10" :
                            isNegative ? "text-red-400 bg-red-400/10" :
                                "text-zinc-400 bg-zinc-400/10"
                        }`}>
                        {isPositive ? <ArrowUpRight className="w-3 h-3" /> :
                            isNegative ? <ArrowDownRight className="w-3 h-3" /> :
                                <Minus className="w-3 h-3" />}
                        {Math.abs(trend)}% {trendLabel}
                    </div>
                )}
            </div>

            <p className="text-2xl font-bold text-foreground truncate" title={String(value)}>
                {value}
            </p>

            {subtitle && (
                <p className="text-xs text-muted-foreground mt-1 truncate">
                    {subtitle}
                </p>
            )}
        </div>
    )
}
