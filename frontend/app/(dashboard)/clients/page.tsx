"use client"

import { useState, useEffect } from "react"
import {
    Building2,
    Plus,
    MoreHorizontal,
    FileSpreadsheet,
    TrendingUp,
    BarChart3,
    Search,
    ArrowUpRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Client {
    id: number
    name: string
    industry: string
    datasetsCount: number
    lastActivity: string
    status: "active" | "pending" | "inactive"
}

// Demo clients data
const demoClients: Client[] = [
    { id: 1, name: "Altech", industry: "Technology", datasetsCount: 5, lastActivity: "2 hours ago", status: "active" },
    { id: 2, name: "Synot", industry: "Technology", datasetsCount: 3, lastActivity: "1 day ago", status: "active" },
    { id: 3, name: "Guarana Plus", industry: "Food & Beverage", datasetsCount: 8, lastActivity: "3 hours ago", status: "active" },
    { id: 4, name: "RayService", industry: "Automotive", datasetsCount: 2, lastActivity: "1 week ago", status: "pending" },
]

export default function ClientsPage() {
    const [clients, setClients] = useState<Client[]>(demoClients)
    const [searchQuery, setSearchQuery] = useState("")
    const [showAddModal, setShowAddModal] = useState(false)
    const [newClientName, setNewClientName] = useState("")
    const [newClientIndustry, setNewClientIndustry] = useState("")

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.industry.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const addClient = () => {
        if (!newClientName.trim()) return

        const newClient: Client = {
            id: Date.now(),
            name: newClientName,
            industry: newClientIndustry || "General",
            datasetsCount: 0,
            lastActivity: "Just now",
            status: "pending"
        }
        setClients([...clients, newClient])
        setNewClientName("")
        setNewClientIndustry("")
        setShowAddModal(false)
    }

    const statusColors = {
        active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
        inactive: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Clients</h1>
                    <p className="text-muted-foreground">Manage your client accounts and their data</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Client
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-2xl font-bold text-foreground">{clients.length}</p>
                    <p className="text-xs text-muted-foreground">Total Clients</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-2xl font-bold text-foreground">{clients.filter(c => c.status === "active").length}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-2xl font-bold text-foreground">{clients.reduce((acc, c) => acc + c.datasetsCount, 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Datasets</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border">
                    <p className="text-2xl font-bold text-emerald-500">+12%</p>
                    <p className="text-xs text-muted-foreground">Growth</p>
                </div>
            </div>

            {/* Clients Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredClients.map((client) => (
                    <Link key={client.id} href={`/clients/${client.id}`}>
                        <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all hover-lift cursor-pointer">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[client.status]}`}>
                                    {client.status}
                                </span>
                            </div>

                            {/* Info */}
                            <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                                {client.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-4">{client.industry}</p>

                            {/* Stats */}
                            <div className="flex items-center justify-between pt-4 border-t border-border">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <FileSpreadsheet className="w-3.5 h-3.5" />
                                        <span>{client.datasetsCount} datasets</span>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="w-full max-w-md p-6 rounded-2xl bg-card border border-border animate-in fade-in zoom-in-95 duration-200">
                        <h2 className="text-xl font-semibold text-foreground mb-4">Add New Client</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Company Name</label>
                                <input
                                    type="text"
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    placeholder="Altech"
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-2">Industry</label>
                                <input
                                    type="text"
                                    value={newClientIndustry}
                                    onChange={(e) => setNewClientIndustry(e.target.value)}
                                    placeholder="Technology, Retail, etc."
                                    className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button
                                variant="ghost"
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 text-muted-foreground"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={addClient}
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Add Client
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
