"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Upload, CheckCircle, AlertCircle, FileSpreadsheet, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FileUploadProps {
    onSuccess?: () => void
}

export function FileUpload({ onSuccess }: FileUploadProps) {
    const router = useRouter()
    const [isDragging, setIsDragging] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [message, setMessage] = useState("")

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const droppedFile = e.dataTransfer.files[0]
        if (droppedFile && (
            droppedFile.type === "text/csv" ||
            droppedFile.name.endsWith(".csv") ||
            droppedFile.name.endsWith(".xlsx") ||
            droppedFile.name.endsWith(".xls")
        )) {
            setFile(droppedFile)
            setStatus("idle")
            setMessage("")
        } else {
            setStatus("error")
            setMessage("Please upload a valid CSV or Excel file.")
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            setStatus("idle")
            setMessage("")
        }
    }

    const clearFile = () => {
        setFile(null)
        setStatus("idle")
        setMessage("")
    }

    const handleUpload = async () => {
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("http://localhost:8000/datasets/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            setStatus("success")
            setMessage("Dataset uploaded successfully!")

            if (onSuccess) {
                setTimeout(() => {
                    onSuccess()
                    setFile(null)
                    setStatus("idle")
                    setMessage("")
                }, 800)
            } else {
                setTimeout(() => {
                    router.push("/dashboard")
                }, 1000)
            }

        } catch (error) {
            console.error(error)
            setStatus("error")
            setMessage("Failed to upload. Please try again.")
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="rounded-2xl bg-[#0f0f12] border border-white/[0.04] p-6">
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
                    isDragging
                        ? "border-violet-500 bg-violet-500/5"
                        : "border-white/[0.06] hover:border-violet-500/30 hover:bg-white/[0.01]",
                    status === "success" && "border-emerald-500/50 bg-emerald-500/5",
                    status === "error" && "border-red-500/50 bg-red-500/5"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
            >
                <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileChange}
                />

                <div className="flex flex-col items-center justify-center space-y-3">
                    {status === "success" ? (
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-emerald-400" />
                        </div>
                    ) : status === "error" ? (
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center">
                            <AlertCircle className="h-6 w-6 text-red-400" />
                        </div>
                    ) : file ? (
                        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center">
                            <FileSpreadsheet className="h-6 w-6 text-violet-400" />
                        </div>
                    ) : (
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors",
                            isDragging ? "bg-violet-500/10" : "bg-white/[0.02]"
                        )}>
                            <Upload className={cn(
                                "h-6 w-6 transition-colors",
                                isDragging ? "text-violet-400" : "text-zinc-500"
                            )} />
                        </div>
                    )}

                    <div className="space-y-1">
                        {file ? (
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-white">{file.name}</p>
                                <button
                                    onClick={(e) => { e.stopPropagation(); clearFile(); }}
                                    className="p-1 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-zinc-400">
                                {isDragging ? "Drop your file here" : "Drop CSV/Excel file or click to browse"}
                            </p>
                        )}
                        {file && (
                            <p className="text-xs text-zinc-500">
                                {(file.size / 1024).toFixed(1)} KB
                            </p>
                        )}
                        {message && (
                            <p className={cn(
                                "text-xs mt-2",
                                status === "success" ? "text-emerald-400" : "text-red-400"
                            )}>
                                {message}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {file && status !== "success" && (
                <div className="mt-4 flex justify-end">
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleUpload();
                        }}
                        disabled={uploading}
                        className="bg-violet-600 hover:bg-violet-700 text-white px-6"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                Uploading...
                            </>
                        ) : (
                            "Upload Dataset"
                        )}
                    </Button>
                </div>
            )}
        </div>
    )
}
