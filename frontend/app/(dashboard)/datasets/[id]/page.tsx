"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { DataTable } from "@/components/datasets/DataTable"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, FileText } from "lucide-react"
import Link from "next/link"

export default function DatasetDetailsPage() {
    const params = useParams()
    const id = params?.id

    // State
    const [data, setData] = useState<any[]>([])
    const [rawColumns, setRawColumns] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [metadata, setMetadata] = useState<any>(null)

    // Pagination State
    const [pageIndex, setPageIndex] = useState(0)
    const pageSize = 50 // Fixed for now

    const fetchData = async (page: number) => {
        setLoading(true)
        try {
            const offset = page * pageSize
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/datasets/${id}/content?limit=${pageSize}&offset=${offset}`)

            if (res.ok) {
                const json = await res.json()
                setData(json.data)
                setRawColumns(json.columns)
                setMetadata({
                    filename: json.filename,
                    total_rows: json.total_rows
                })
            }
        } catch (error) {
            console.error("Failed to fetch data", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchData(pageIndex)
        }
    }, [id, pageIndex])

    // Generate columns definition for TanStack Table
    const columns = useMemo<ColumnDef<any>[]>(() => {
        return rawColumns.map((col) => ({
            accessorKey: col,
            header: col,
            cell: ({ getValue }) => {
                const val = getValue() as any
                return val !== null && val !== undefined ? String(val) : "-"
            }
        }))
    }, [rawColumns])

    const pageCount = metadata ? Math.ceil(metadata.total_rows / pageSize) : 0

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/datasets">
                        <Button variant="outline" size="icon" className="border-zinc-800 bg-zinc-950 hover:bg-zinc-900">
                            <ArrowLeft className="h-4 w-4 text-zinc-400" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                            <FileText className="h-6 w-6 text-purple-500" />
                            {metadata?.filename || "Loading..."}
                        </h1>
                        <p className="text-sm text-zinc-400">
                            {metadata ? `${metadata.total_rows.toLocaleString()} rows` : "..."} • Viewer
                        </p>
                    </div>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                </Button>
            </div>

            <div className="flex-1 overflow-auto">
                <DataTable
                    columns={columns}
                    data={data}
                    pageCount={pageCount}
                    pageIndex={pageIndex}
                    pageSize={pageSize}
                    onPageChange={setPageIndex}
                    isLoading={loading}
                />
            </div>
        </div>
    )
}
