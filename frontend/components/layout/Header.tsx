"use client"

import { MobileSidebar } from "./Sidebar"
import { Button } from "@/components/ui/button"
import { ModifierKey } from "@/components/ui/modifier-key"
import { Bell, Search, User, LogOut, ChevronDown, Settings, Sparkles } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Header() {
    const { user, logout, isAdmin } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <header className="sticky top-0 z-40 h-16 glass border-b border-border/50">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-3">
                    <MobileSidebar />

                    {/* Search Bar - Premium Style */}
                    <div className="hidden md:flex items-center">
                        <button
                            className="group flex items-center gap-3 px-4 py-2.5 rounded-xl bg-muted/50 border border-border hover:border-primary/30 hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 w-[300px]"
                        >
                            <Search className="w-4 h-4 group-hover:text-primary transition-colors" />
                            <span className="text-sm">
                                {isAdmin ? "Search clients, data..." : "Search your data..."}
                            </span>
                            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                                <kbd className="px-1.5 py-0.5 rounded bg-background/50 border border-border font-mono"><ModifierKey /></kbd>
                                <kbd className="px-1.5 py-0.5 rounded bg-background/50 border border-border font-mono">K</kbd>
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

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse" />
                    </Button>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-xl hover:bg-muted/50 transition-all duration-200 group"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-sm font-medium text-foreground">{user?.name || "User"}</p>
                                <p className="text-xs text-muted-foreground">
                                    {isAdmin ? "Administrator" : "Client"}
                                </p>
                            </div>
                            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-primary/25">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block transition-transform duration-200 group-hover:rotate-180" />
                        </button>

                        {/* Dropdown - Premium Glass Effect */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl glass-card shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User Info */}
                                    <div className="px-3 py-3 border-b border-border/50 mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                                                <User className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Role/Company Badge */}
                                    {isAdmin ? (
                                        <div className="px-3 py-2 mb-1">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                                                <Sparkles className="w-3 h-3" />
                                                Administrator
                                            </span>
                                        </div>
                                    ) : user?.companyName && (
                                        <div className="px-3 py-2 mb-1">
                                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">Company</span>
                                            <p className="text-sm font-medium text-foreground">{user.companyName}</p>
                                        </div>
                                    )}

                                    {/* Quick Links */}
                                    <div className="space-y-0.5">
                                        <Link href="/settings" onClick={() => setShowUserMenu(false)}>
                                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-sm">
                                                <Settings className="w-4 h-4" />
                                                Settings
                                            </div>
                                        </Link>

                                        <button
                                            onClick={() => {
                                                setShowUserMenu(false)
                                                logout()
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-rose-500 hover:bg-rose-500/10 transition-colors text-sm"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
