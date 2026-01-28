"use client"

import { useState } from "react"
import {
    Building2,
    Plus,
    Search,
    ArrowUpRight,
    X,
    Users
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Client {
    id: number
    name: string
    industry: string
    datasetsCount: number
    lastActivity: string
    status: "active" | "pending" | "inactive"
}

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

    const statusStyles = {
        active: "bg-emerald-500/10 text-emerald-500",
        pending: "bg-amber-500/10 text-amber-500",
        inactive: "bg-muted text-muted-foreground"
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-foreground">Clients</h1>
                    <p className="text-sm text-muted-foreground">Manage your client accounts</p>
                </div>
                <Button onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-1.5" />
                    Add Client
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 rounded-xl bg-card border border-border/60">
                    <p className="text-2xl font-semibold text-foreground">{clients.length}</p>
                    <p className="text-xs text-muted-foreground">Total Clients</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/60">
                    <p className="text-2xl font-semibold text-foreground">{clients.filter(c => c.status === "active").length}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/60">
                    <p className="text-2xl font-semibold text-foreground">{clients.reduce((acc, c) => acc + c.datasetsCount, 0)}</p>
                    <p className="text-xs text-muted-foreground">Total Datasets</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border/60">
                    <p className="text-2xl font-semibold text-emerald-500">+12%</p>
                    <p className="text-xs text-muted-foreground">Growth</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                    placeholder="Search clients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                />
            </div>

            {/* Clients List */}
            {filteredClients.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No clients found</p>
                    <Button variant="outline" onClick={() => setShowAddModal(true)}>
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add your first client
                    </Button>
                </div>
            ) : (
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {filteredClients.map((client) => (
                        <Link key={client.id} href={`/client-details?id=${client.id}`}>
                            <div className="group p-4 rounded-xl bg-card border border-border/60 hover:border-primary/30 transition-all duration-150">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-primary" />
                                    </div>
                                    <span className={cn(
                                        "px-2 py-0.5 text-xs rounded-full font-medium",
                                        statusStyles[client.status]
                                    )}>
                                        {client.status}
                                    </span>
                                </div>

                                <h3 className="font-medium text-foreground mb-0.5 group-hover:text-primary transition-colors">
                                    {client.name}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">{client.industry}</p>

                                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                                    <span className="text-xs text-muted-foreground">{client.datasetsCount} datasets</span>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Add Client Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-md rounded-xl bg-card border border-border shadow-xl animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between p-4 border-b border-border/60">
                            <h2 className="font-semibold text-foreground">Add New Client</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
                                <Input
                                    value={newClientName}
                                    onChange={(e) => setNewClientName(e.target.value)}
                                    placeholder="Enter company name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-1.5">Industry</label>
                                <Input
                                    value={newClientIndustry}
                                    onChange={(e) => setNewClientIndustry(e.target.value)}
                                    placeholder="Technology, Retail, etc."
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 p-4 border-t border-border/60">
                            <Button variant="ghost" onClick={() => setShowAddModal(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={addClient} className="flex-1">
                                Add Client
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
