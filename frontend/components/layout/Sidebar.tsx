"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import {
    LayoutDashboard,
    Database,
    Settings,
    Menu,
    Beaker,
    ChevronLeft,
    ChevronRight,
    Users,
    Building2,
    MessageSquareText,
    BarChart3,
    Sparkles,
    AlertTriangle
} from "lucide-react"
import { CommandMenu } from "./CommandMenu"

// Different nav items based on role
const adminNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/datasets", label: "Data", icon: Database },
    { href: "/insights", label: "AI Insights", icon: MessageSquareText },
    { href: "/analysis", label: "Analysis", icon: Beaker },
    { href: "/integrations", label: "Integrations", icon: Beaker }, // Using Beaker as placeholder or import Lucide icon
    { href: "/settings", label: "Settings", icon: Settings },
]

const clientNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/datasets", label: "My Data", icon: Database },
    { href: "/insights", label: "AI Insights", icon: MessageSquareText },
    { href: "/chart-builder", label: "Chart Builder", icon: BarChart3 },
    { href: "/data-story", label: "Data Story", icon: Sparkles },
    { href: "/anomalies", label: "Anomalies", icon: AlertTriangle },
    { href: "/integrations", label: "Integrations", icon: Beaker },
    { href: "/settings", label: "Settings", icon: Settings },
]

interface SidebarProps {
    collapsed?: boolean
    onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const pathname = usePathname()
    const { user, isAdmin } = useAuth()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Choose nav items based on role
    const navItems = isAdmin ? adminNavItems : clientNavItems

    const logoSrc = mounted && resolvedTheme === "light" ? "/logo-light.png" : "/k2m-logo-new.png"

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 sticky top-0",
                collapsed ? "w-[72px]" : "w-[240px]"
            )}
        >
            {/* K2M Logo */}
            <div className={cn(
                "flex items-center h-16 px-4 border-b border-border",
                collapsed ? "justify-center" : "gap-3"
            )}>
                <Image
                    src={logoSrc}
                    alt="K2M"
                    width={collapsed ? 36 : 120}
                    height={36}
                    className="object-contain"
                />
            </div>

            {/* Client Company Badge (for clients only) */}
            {!isAdmin && user?.companyName && !collapsed && (
                <div className="px-3 mb-4 mt-2">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10 shadow-sm">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-background border border-primary/10 shadow-inner">
                            <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Workspace</span>
                            <span className="text-sm font-bold text-foreground truncate max-w-[140px]">{user.companyName}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Command Menu */}
            {!collapsed && (
                <div className="px-3 mb-2">
                    <CommandMenu />
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/5 dark:hover:bg-white/5",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {/* Active Indicator */}
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#7c5cfc] rounded-r-full" />
                                )}

                                <Icon className={cn(
                                    "w-5 h-5 transition-colors flex-shrink-0",
                                    isActive ? "text-[#7c5cfc]" : "group-hover:text-zinc-300"
                                )} />

                                {!collapsed && (
                                    <span className="font-medium text-sm">{item.label}</span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {collapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 border border-white/10">
                                        {item.label}
                                    </div>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* AI Assistant Quick Access */}
            {!collapsed && (
                <div className="px-3 pb-3">
                    <Link href="/insights">
                        <div className="p-3 rounded-xl bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 hover:border-primary/40 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-6 h-6 rounded-lg bg-primary/20 flex items-center justify-center">
                                    <MessageSquareText className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <span className="text-xs font-medium text-foreground">AI Assistant</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground">Ask questions about your data</p>
                        </div>
                    </Link>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-border">
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors",
                        collapsed ? "px-0" : "px-3"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm">Collapse</span>
                        </>
                    )}
                </button>
            </div>
            {/* Bottom Actions / Stats */}
        </aside>
    )
}

export function MobileSidebar() {
    const pathname = usePathname()
    const { user, isAdmin } = useAuth()
    const { resolvedTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const navItems = isAdmin ? adminNavItems : clientNavItems

    useEffect(() => {
        setMounted(true)
    }, [])

    const logoSrc = mounted && resolvedTheme === "light" ? "/logo-light.png" : "/k2m-logo-new.png"

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white">
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 bg-sidebar border-r border-border w-[280px]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Logo */}
                <div className="flex items-center gap-3 h-16 px-5 border-b border-border">
                    <Image
                        src={logoSrc}
                        alt="K2M"
                        width={100}
                        height={32}
                        className="object-contain"
                    />
                </div>

                {/* Client Company Badge */}
                {!isAdmin && user?.companyName && (
                    <div className="px-4 py-3 border-b border-border">
                        <div className="px-3 py-2 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-xs text-muted-foreground">Your Company</p>
                            <p className="text-sm font-medium text-foreground">{user.companyName}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="py-6 px-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                    )}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#7c5cfc] rounded-r-full" />
                                    )}
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </div>
                            </Link>
                        )
                    })}
                </nav>
            </SheetContent>
        </Sheet>
    )
}
