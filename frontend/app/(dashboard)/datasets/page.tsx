"use client"

import { FileUpload } from "@/components/datasets/FileUpload"
import { useEffect, useState } from "react"
import {
    Database,
    MoreHorizontal,
    Trash2,
    Download,
    Eye,
    Grid3X3,
    List,
    Search,
    Plus,
    FileSpreadsheet,
    Edit
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function DatasetsPage() {
    const [datasets, setDatasets] = useState<any[]>([])
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState("")
    const [showUpload, setShowUpload] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

    // Rename State
    const [renamingId, setRenamingId] = useState<number | null>(null)
    const [newName, setNewName] = useState("")

    const startRename = (dataset: any) => {
        setRenamingId(dataset.id)
        setNewName(dataset.filename)
    }

    const handleRename = async () => {
        if (!renamingId || !newName.trim()) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/${renamingId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ filename: newName })
            })

            if (res.ok) {
                setDatasets(datasets.map(d => d.id === renamingId ? { ...d, filename: newName } : d))
                setRenamingId(null)
            }
        } catch (error) {
            console.error("Failed to rename dataset", error)
        }
    }

    const fetchDatasets = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/`)
            if (res.ok) {
                const data = await res.json()
                setDatasets(data)
            }
        } catch (error) {
            console.error("Failed to fetch datasets", error)
        }
    }

    const deleteDataset = async (id: number) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/${id}`, {
                method: "DELETE"
            })
            if (res.ok) {
                setDatasets(datasets.filter(d => d.id !== id))
                setDeleteConfirm(null)
            }
        } catch (error) {
            console.error("Failed to delete dataset", error)
        }
    }

    const downloadDataset = (id: number) => {
        window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/${id}/download`, "_blank")
    }

    useEffect(() => {
        fetchDatasets()
    }, [])

    const filteredDatasets = datasets.filter(ds =>
        ds.filename.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const formatFileSize = (bytes: number) => {
        if (!bytes) return "—"
        if (bytes < 1024) return bytes + " B"
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Datasets</h1>
                    <p className="text-muted-foreground">Manage and analyze your data files</p>
                </div>
                <Button
                    onClick={() => setShowUpload(!showUpload)}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Dataset
                </Button>
            </div>

            {/* Upload Panel (Collapsible) */}
            {showUpload && (
                <div className="animate-in slide-in-from-top-2 duration-300">
                    <FileUpload onSuccess={() => { fetchDatasets(); setShowUpload(false); }} />
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search datasets..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-0"
                    />
                </div>

                {/* View Toggle */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-muted border border-border">
                    <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"}`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Dataset Count */}
            <p className="text-sm text-zinc-500">
                {filteredDatasets.length} dataset{filteredDatasets.length !== 1 ? "s" : ""}
            </p>

            {/* Empty State */}
            {filteredDatasets.length === 0 && !showUpload && (
                <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-card border border-border">
                    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                        <FileSpreadsheet className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground mb-1">No datasets found</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        {searchQuery ? "Try a different search term" : "Upload your first dataset to get started"}
                    </p>
                    {!searchQuery && (
                        <Button onClick={() => setShowUpload(true)} variant="outline" className="border-white/10">
                            <Plus className="w-4 h-4 mr-2" />
                            Upload Dataset
                        </Button>
                    )}
                </div>
            )}

            {/* Grid View */}
            {viewMode === "grid" && filteredDatasets.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredDatasets.map((ds) => (
                        <div
                            key={ds.id}
                            className="group relative rounded-2xl bg-card border border-border p-5 hover:border-border/80 transition-all hover-lift"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                    <Database className="w-5 h-5 text-violet-400" />
                                </div>

                                {/* Actions Dropdown */}
                                <div className="relative">
                                    <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <h3 className="font-medium text-foreground truncate mb-1" title={ds.filename}>
                                {ds.filename}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
                                <span>{ds.total_rows?.toLocaleString() || "—"} rows</span>
                                <span>•</span>
                                <span>{ds.total_columns || "—"} cols</span>
                                <span>•</span>
                                <span>{formatFileSize(ds.file_size)}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-border">
                                <Link href={`/dataset-details?id=${ds.id}`} className="flex-1">
                                    <Button variant="ghost" size="sm" className="w-full text-muted-foreground hover:text-foreground hover:bg-muted">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() => downloadDataset(ds.id)}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                                    onClick={() => startRename(ds)}
                                >
                                    <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-red-400 hover:bg-red-500/10"
                                    onClick={() => setDeleteConfirm(ds.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* Delete Confirmation */}
                            {deleteConfirm === ds.id && (
                                <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
                                    <p className="text-foreground text-sm font-medium mb-1">Delete this dataset?</p>
                                    <p className="text-zinc-500 text-xs mb-4">This action cannot be undone</p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => setDeleteConfirm(null)}
                                            className="text-zinc-400"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => deleteDataset(ds.id)}
                                            className="bg-red-600 hover:bg-red-700 text-white"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* List View */}
            {viewMode === "list" && filteredDatasets.length > 0 && (
                <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <table className="w-full data-table">
                        <thead>
                            <tr>
                                <th className="text-left px-5 py-3">Name</th>
                                <th className="text-left px-5 py-3 hidden md:table-cell">Rows</th>
                                <th className="text-left px-5 py-3 hidden md:table-cell">Columns</th>
                                <th className="text-left px-5 py-3 hidden lg:table-cell">Size</th>
                                <th className="text-right px-5 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDatasets.map((ds) => (
                                <tr key={ds.id} className="group">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                <Database className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <span className="font-medium text-foreground truncate max-w-[200px]">{ds.filename}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-zinc-400 hidden md:table-cell">
                                        {ds.total_rows?.toLocaleString() || "—"}
                                    </td>
                                    <td className="px-5 py-4 text-zinc-400 hidden md:table-cell">
                                        {ds.total_columns || "—"}
                                    </td>
                                    <td className="px-5 py-4 text-zinc-400 hidden lg:table-cell">
                                        {formatFileSize(ds.file_size)}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/dataset-details?id=${ds.id}`}>
                                                <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-white"
                                                onClick={() => downloadDataset(ds.id)}
                                            >
                                                <Download className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-white"
                                                onClick={() => startRename(ds)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-zinc-400 hover:text-red-400"
                                                onClick={() => deleteDataset(ds.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Rename Dialog */}
            <Dialog open={!!renamingId} onOpenChange={(open) => !open && setRenamingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename Dataset</DialogTitle>
                        <DialogDescription>
                            Enter a new name for your dataset. The file extension will be preserved.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            placeholder="New dataset name"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleRename()
                            }}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRenamingId(null)}>Cancel</Button>
                        <Button onClick={handleRename}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
