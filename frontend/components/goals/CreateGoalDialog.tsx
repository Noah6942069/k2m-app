"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Plus, Target } from "lucide-react"
import { Goal } from "./GoalCard"

interface CreateGoalDialogProps {
    onSave: (goal: Omit<Goal, "id" | "createdAt">) => void
}

export function CreateGoalDialog({ onSave }: CreateGoalDialogProps) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [metric, setMetric] = useState<"revenue" | "transactions" | "avg_order">("revenue")
    const [targetValue, setTargetValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || !targetValue) return

        onSave({
            title,
            metric,
            targetValue: Number(targetValue)
        })
        setOpen(false)
        setTitle("")
        setTargetValue("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" />
                    Set New Goal
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Set Performance Target
                    </DialogTitle>
                    <DialogDescription>
                        Define a new goal to track your success. Progress will update automatically based on the latest data.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Goal Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Q1 Revenue Target"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Metric</Label>
                            <Select
                                value={metric}
                                onValueChange={(v: any) => setMetric(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="revenue">Total Revenue</SelectItem>
                                    <SelectItem value="transactions">Transactions</SelectItem>
                                    <SelectItem value="avg_order">Avg. Order Value</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="target">Target Value</Label>
                            <Input
                                id="target"
                                type="number"
                                placeholder="50000"
                                value={targetValue}
                                onChange={(e) => setTargetValue(e.target.value)}
                                min="1"
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit}>Create Goal</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
