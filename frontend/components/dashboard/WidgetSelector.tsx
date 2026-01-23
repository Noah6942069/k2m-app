"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import { Settings, Check, LayoutDashboard } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

interface WidgetSelectorProps {
    preferences: Record<string, boolean>;
    onSave: (newPreferences: Record<string, boolean>) => void;
}

const WIDGET_DEFINITIONS = [
    {
        category: "Key Performance Indicators",
        items: [
            { id: "kpi_revenue", label: "Revenue / Total Value" },
            { id: "kpi_growth", label: "Growth Rate" },
            { id: "kpi_health", label: "Data Health Score" },
            { id: "kpi_transactions", label: "Transaction Count" },
            { id: "kpi_categories", label: "Unique Categories" },
            { id: "kpi_best_month", label: "Best Performing Period" },
            { id: "kpi_avg_value", label: "Average Order Value" },
            { id: "kpi_date_range", label: "Data Range / Span" },
        ]
    },
    {
        category: "Charts & Visualizations",
        items: [
            { id: "chart_sales_trend", label: "Sales Trend (Line)" },
            { id: "chart_category_distribution", label: "Category Distribution (Pie)" },
            { id: "chart_horizontal_ranking", label: "Top Rankings (Bar)" },
        ]
    },
    {
        category: "Lists & Insights",
        items: [
            { id: "list_top_products", label: "Top Products List" },
            { id: "insights_bar", label: "AI Insights Bar" },
        ]
    }
]

export function WidgetSelector({ preferences, onSave }: WidgetSelectorProps) {
    const [localPrefs, setLocalPrefs] = useState<Record<string, boolean>>(preferences)
    const [open, setOpen] = useState(false)

    const handleToggle = (id: string, checked: boolean) => {
        setLocalPrefs(prev => ({
            ...prev,
            [id]: checked
        }))
    }

    const handleSave = () => {
        onSave(localPrefs)
        setOpen(false)
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Customize
                </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] p-6">
                <SheetHeader className="mb-6">
                    <SheetTitle>Dashboard Customization</SheetTitle>
                    <SheetDescription>
                        Select which widgets and metrics you want to see on your dashboard.
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-[calc(100vh-220px)] pr-4">
                    <div className="space-y-8 pl-1">
                        {WIDGET_DEFINITIONS.map((category) => (
                            <div key={category.category} className="space-y-4">
                                <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">
                                    {category.category}
                                </h3>
                                <div className="space-y-4">
                                    {category.items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between space-x-4 py-1">
                                            <Label htmlFor={item.id} className="flex flex-col space-y-1 cursor-pointer">
                                                <span className="text-foreground">{item.label}</span>
                                            </Label>
                                            <Switch
                                                id={item.id}
                                                checked={localPrefs[item.id] !== false} // Default to true if undefined
                                                onCheckedChange={(checked) => handleToggle(item.id, checked)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <SheetFooter className="mt-6">
                    <SheetClose asChild>
                        <Button variant="outline" className="mr-2">Cancel</Button>
                    </SheetClose>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground">
                        <Check className="w-4 h-4 mr-2" />
                        Save Changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
