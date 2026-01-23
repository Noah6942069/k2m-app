"use client"

import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: number;
    trendLabel?: string;
    color?: string;
    loading?: boolean;
    sparklineData?: number[];
    variant?: "default" | "gradient" | "glass";
}

import { MiniSparkline } from "@/components/ui/mini-sparkline"

export function KPICard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    trendLabel,
    color = "#8b5cf6",
    loading = false,
    sparklineData,
    variant = "default"
}: KPICardProps) {

    if (loading) {
        return (
            <div className="kpi-card animate-pulse">
                <div className="flex justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-muted" />
                    <div className="w-16 h-6 bg-muted rounded-full" />
                </div>
                <div className="h-9 w-28 bg-muted rounded mb-2" />
                <div className="h-4 w-36 bg-muted rounded" />
            </div>
        );
    }

    const isPositive = trend && trend > 0;
    const isNegative = trend && trend < 0;

    const cardClasses = cn(
        "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
        "border border-border hover:border-primary/30",
        variant === "default" && "bg-card",
        variant === "gradient" && "bg-gradient-to-br from-card via-card to-primary/5",
        variant === "glass" && "glass-card"
    );

    return (
        <div className={cardClasses}>
            {/* Gradient accent line at top */}
            <div
                className="absolute top-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
            />

            {/* Glow effect on hover */}
            <div
                className="absolute -inset-1 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-2xl rounded-3xl -z-10"
                style={{ background: color }}
            />

            <div className="flex items-start justify-between mb-4">
                {/* Premium Icon with Glow */}
                <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                        background: `linear-gradient(135deg, ${color}20, ${color}40)`,
                        boxShadow: `0 8px 24px -8px ${color}60`
                    }}
                >
                    <Icon
                        className="w-6 h-6 transition-transform duration-300"
                        style={{ color: color }}
                    />
                </div>

                {/* Trend Badge */}
                {trend !== undefined && (
                    <div
                        className={cn(
                            "flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-300",
                            isPositive && "text-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20",
                            isNegative && "text-rose-500 bg-rose-500/10 dark:bg-rose-500/20",
                            !isPositive && !isNegative && "text-muted-foreground bg-muted"
                        )}
                    >
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                            isNegative ? <ArrowDownRight className="w-3.5 h-3.5" /> :
                                <Minus className="w-3.5 h-3.5" />}
                        {Math.abs(trend)}%
                    </div>
                )}
            </div>

            {/* Value - Large Display Font */}
            <p
                className="text-3xl font-bold text-foreground font-display truncate transition-colors duration-300"
                title={String(value)}
            >
                {value}
            </p>

            {/* Title */}
            <p className="text-sm font-medium text-muted-foreground mt-1">
                {title}
            </p>

            {/* Sparkline */}
            {sparklineData && sparklineData.length > 1 && (
                <MiniSparkline data={sparklineData} color={color} />
            )}

            {/* Subtitle */}
            {subtitle && !sparklineData && (
                <p className="text-xs text-muted-foreground/70 mt-3 truncate flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" />
                    {subtitle}
                </p>
            )}
        </div>
    )
}
