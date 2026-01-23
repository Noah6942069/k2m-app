"use client"

import { Dataset } from "@/types/dashboard"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ArrowLeftRight, Database } from "lucide-react"

interface ComparisonSelectorProps {
    datasets: Dataset[]
    selectedIdA: string | null
    selectedIdB: string | null
    onSelectA: (id: string) => void
    onSelectB: (id: string) => void
}

export function ComparisonSelector({
    datasets,
    selectedIdA,
    selectedIdB,
    onSelectA,
    onSelectB
}: ComparisonSelectorProps) {

    // Filter out datasets that are already selected in the OTHER slot to avoid self-comparison
    // (Optional: allow self-comparison for debugging, but usually bad UX).
    // Let's allow it but maybe warn in UI? For now, allowing all is simpler.

    return (
        <div className="flex flex-col md:flex-row items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">

            {/* Slot A */}
            <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-3 h-3 text-primary" />
                    Baseline Dataset (A)
                </label>
                <Select value={selectedIdA || ""} onValueChange={onSelectA}>
                    <SelectTrigger className="h-12 border-border/60 bg-muted/20 focus:ring-primary/20">
                        <SelectValue placeholder="Select first dataset..." />
                    </SelectTrigger>
                    <SelectContent>
                        {datasets.map(ds => (
                            <SelectItem
                                key={ds.id}
                                value={String(ds.id)}
                                disabled={String(ds.id) === selectedIdB}
                                className="cursor-pointer"
                            >
                                <span className="font-medium">{ds.filename}</span>
                                <span className="text-xs text-muted-foreground ml-2">({ds.total_rows} rows)</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Swap Icon */}
            <div className="flex items-center justify-center p-2 rounded-full bg-muted text-muted-foreground">
                <ArrowLeftRight className="w-5 h-5" />
            </div>

            {/* Slot B */}
            <div className="flex-1 w-full space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Database className="w-3 h-3 text-violet-500" />
                    Comparison Dataset (B)
                </label>
                <Select value={selectedIdB || ""} onValueChange={onSelectB}>
                    <SelectTrigger className="h-12 border-border/60 bg-muted/20 focus:ring-violet-500/20">
                        <SelectValue placeholder="Select second dataset..." />
                    </SelectTrigger>
                    <SelectContent>
                        {datasets.map(ds => (
                            <SelectItem
                                key={ds.id}
                                value={String(ds.id)}
                                disabled={String(ds.id) === selectedIdA}
                                className="cursor-pointer"
                            >
                                <span className="font-medium">{ds.filename}</span>
                                <span className="text-xs text-muted-foreground ml-2">({ds.total_rows} rows)</span>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </div>
    )
}
