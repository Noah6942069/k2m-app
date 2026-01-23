"use client"

import { useParams } from "next/navigation"
import { useState } from "react"
import {
    Building2,
    ArrowLeft,
    FileSpreadsheet,
    Plus,
    TrendingUp,
    DollarSign,
    BarChart3,
    Calendar,
    MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Demo client data
const clientsData: Record<string, any> = {
    "1": { name: "Altech", industry: "Retail", status: "active" },
    "2": { name: "TechStart Inc", industry: "Technology", status: "active" },
    "3": { name: "Global Foods Ltd", industry: "Food & Beverage", status: "active" },
    "4": { name: "Urban Motors", industry: "Automotive", status: "pending" },
}

const demoDatasets = [
    { id: 1, name: "Q4_Sales_Report.csv", rows: 12500, uploadedAt: "2 days ago" },
    { id: 2, name: "Customer_Data_2024.csv", rows: 8430, uploadedAt: "1 week ago" },
    { id: 3, name: "Product_Categories.csv", rows: 156, uploadedAt: "2 weeks ago" },
]

export default function ClientDetailPage() {
    const params = useParams()
    const clientId = params?.id as string
    const client = clientsData[clientId] || { name: "Unknown Client", industry: "N/A", status: "inactive" }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link href="/clients" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Clients
            </Link>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c5cfc]/20 to-[#5b8def]/20 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-[#7c5cfc]" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{client.name}</h1>
                        <p className="text-zinc-500">{client.industry}</p>
                        <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${client.status === "active"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            }`}>
                            {client.status}
                        </span>
                    </div>
                </div>
                <Button className="bg-[#7c5cfc] hover:bg-[#6b4ce0] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Data
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Revenue", value: "$1.2M", icon: DollarSign, color: "#7c5cfc" },
                    { label: "Datasets", value: "3", icon: FileSpreadsheet, color: "#5b8def" },
                    { label: "Growth", value: "+15%", icon: TrendingUp, color: "#10b981" },
                    { label: "Reports", value: "8", icon: BarChart3, color: "#f59e0b" },
                ].map((stat, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-[#13131a] border border-white/[0.04]">
                        <stat.icon className="w-5 h-5 mb-2" style={{ color: stat.color }} />
                        <p className="text-xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-zinc-500">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Datasets Section */}
            <div className="rounded-2xl bg-[#13131a] border border-white/[0.04] p-5">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-white">Datasets</h2>
                    <Button variant="ghost" size="sm" className="text-[#7c5cfc]">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                    </Button>
                </div>

                <div className="space-y-3">
                    {demoDatasets.map((ds) => (
                        <div
                            key={ds.id}
                            className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#7c5cfc]/30 transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#7c5cfc]/10 flex items-center justify-center">
                                    <FileSpreadsheet className="w-5 h-5 text-[#7c5cfc]" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">{ds.name}</p>
                                    <p className="text-xs text-zinc-500">{ds.rows.toLocaleString()} rows</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Calendar className="w-3 h-3" />
                                    {ds.uploadedAt}
                                </div>
                                <button className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                                    <MoreHorizontal className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                    { label: "View Sales Dashboard", icon: BarChart3, href: "/dashboard" },
                    { label: "AI Analysis", icon: TrendingUp, href: "/insights" },
                    { label: "Clean Data", icon: FileSpreadsheet, href: "/analysis" },
                ].map((action, idx) => (
                    <Link key={idx} href={action.href}>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-[#7c5cfc]/30 transition-colors group cursor-pointer">
                            <action.icon className="w-5 h-5 text-zinc-500 group-hover:text-[#7c5cfc] transition-colors mb-2" />
                            <p className="text-sm font-medium text-white">{action.label}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
