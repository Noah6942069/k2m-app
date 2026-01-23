"use client"

import { MobileSidebar } from "./Sidebar"
import { Button } from "@/components/ui/button"
import { ModifierKey } from "@/components/ui/modifier-key"
import { Bell, Search, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"

export function Header() {
    const { user, logout, isAdmin } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-3">
                    <MobileSidebar />

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center">
                        <button
                            className="flex items-center gap-3 px-4 py-2 rounded-xl bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-border/50 transition-all w-[280px]"
                        >
                            <Search className="w-4 h-4" />
                            <span className="text-sm">
                                {isAdmin ? "Search clients, data..." : "Search your data..."}
                            </span>
                            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border"><ModifierKey /></kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-border">K</kbd>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Mobile Search */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden text-muted-foreground hover:text-foreground"
                    >
                        <Search className="w-5 h-5" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-muted-foreground hover:text-foreground hover:bg-white/5"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-[#7c5cfc] rounded-full" />
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-xl hover:bg-white/5 transition-colors"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {isAdmin ? "Administrator" : "Client"}
                                </p>
                            </div>
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-56 p-2 rounded-xl bg-card border border-border shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-3 py-2 border-b border-border mb-2">
                                        <p className="text-sm font-medium text-foreground">{user?.name}</p>
                                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                                    </div>

                                    {isAdmin && (
                                        <div className="px-3 py-1.5 mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Role</span>
                                            <span className="ml-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">
                                                Admin
                                            </span>
                                        </div>
                                    )}

                                    {!isAdmin && user?.companyName && (
                                        <div className="px-3 py-1.5 mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Company</span>
                                            <p className="text-sm text-foreground">{user.companyName}</p>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => {
                                            setShowUserMenu(false)
                                            logout()
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
