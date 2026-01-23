"use client"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Database } from "lucide-react"

interface Dataset {
    id: number
    filename: string
    uploaded_at: string
}

interface PageHeaderWithSelectorProps {
    title: string
    description?: string
    datasets: Dataset[]
    selectedId: string | null
    onSelect: (id: string) => void
    loading?: boolean
}

export function PageHeaderWithSelector({
    title,
    description,
    datasets,
    selectedId,
    onSelect,
    loading = false
}: PageHeaderWithSelectorProps) {

    return (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-border pb-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-2 max-w-2xl">
                        {description}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 bg-card p-1.5 rounded-xl border border-border shadow-sm">
                <div className="px-2 flex items-center gap-2 text-muted-foreground">
                    <Database className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider hidden sm:inline-block">Source Data:</span>
                </div>
                <Select
                    value={selectedId || ""}
                    onValueChange={onSelect}
                    disabled={loading || datasets.length === 0}
                >
                    <SelectTrigger className="h-9 w-[200px] sm:w-[240px] border-none bg-muted hover:bg-muted/80 transition-colors focus:ring-primary/20">
                        <SelectValue placeholder={loading ? "Loading..." : "Select Dataset"} />
                    </SelectTrigger>
                    <SelectContent>
                        {datasets.length === 0 ? (
                            <SelectItem value="empty" disabled>No datasets found</SelectItem>
                        ) : (
                            datasets.map(ds => (
                                <SelectItem key={ds.id} value={String(ds.id)} className="cursor-pointer">
                                    <div className="flex flex-col text-left">
                                        <span className="font-medium truncate max-w-[180px]">{ds.filename}</span>
                                        <span className="text-[10px] text-muted-foreground">
                                            {new Date(ds.uploaded_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
