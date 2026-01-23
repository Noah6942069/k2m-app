"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, Trash2, Eye, Download, Search, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

interface SavedReport {
    id: string
    title: string
    date: number
    datasetName: string
    datasetId: string
    summary: string
    content: string // HTML or text content
}

export default function ReportsPage() {
    const [reports, setReports] = useState<SavedReport[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedReport, setSelectedReport] = useState<SavedReport | null>(null)

    useEffect(() => {
        const saved = localStorage.getItem("k2m-saved-reports")
        if (saved) {
            try {
                setReports(JSON.parse(saved).sort((a: any, b: any) => b.date - a.date))
            } catch (e) {
                console.error("Failed to parse reports", e)
            }
        }
    }, [])

    const handleDelete = (id: string) => {
        const updated = reports.filter(r => r.id !== id)
        setReports(updated)
        localStorage.setItem("k2m-saved-reports", JSON.stringify(updated))
        if (selectedReport?.id === id) setSelectedReport(null)
    }

    const handleDownload = async (report: SavedReport) => {
        // Simple text download for now, or re-generate PDF if content allows
        // Since we might not have the full DOM, we'll download as Markdown/Text
        const element = document.createElement("a");
        const file = new Blob([report.content], { type: 'text/html' });
        element.href = URL.createObjectURL(file);
        element.download = `${report.title.replace(/\s+/g, "_")}.html`;
        document.body.appendChild(element);
        element.click();
    }

    const filteredReports = reports.filter(r =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.datasetName.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Saved Reports</h1>
                <p className="text-muted-foreground mt-2">
                    Access your previously generated data stories and analysis reports.
                </p>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search reports..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-0"
                    />
                </div>
            </div>

            {/* List */}
            {filteredReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 rounded-3xl bg-card border border-border">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No reports saved</h3>
                    <p className="text-muted-foreground text-sm">Generate a Data Story to save it here.</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredReports.map(report => (
                        <div key={report.id} className="group relative rounded-2xl bg-card border border-border p-5 hover:border-primary/50 transition-all hover-lift">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                    {new Date(report.date).toLocaleDateString()}
                                </div>
                            </div>

                            <h3 className="font-semibold text-foreground mb-1 truncate" title={report.title}>{report.title}</h3>
                            <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
                                <Database className="w-3 h-3" />
                                {report.datasetName}
                            </p>

                            <div className="pt-4 border-t border-border flex items-center gap-2">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="ghost" size="sm" className="flex-1 text-muted-foreground hover:text-foreground" onClick={() => setSelectedReport(report)}>
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                        <div className="prose prose-invert max-w-none">
                                            <h1>{report.title}</h1>
                                            <p className="text-sm text-muted-foreground mb-8">
                                                Generated on {new Date(report.date).toLocaleString()} for {report.datasetName}
                                            </p>
                                            <div dangerouslySetInnerHTML={{ __html: report.content }} />
                                        </div>
                                    </DialogContent>
                                </Dialog>

                                <Button variant="ghost" size="sm" onClick={() => handleDownload(report)}>
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(report.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

function Database({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M3 5V19A9 3 0 0 0 21 19V5" />
            <path d="M3 12A9 3 0 0 0 21 12" />
        </svg>
    )
}
