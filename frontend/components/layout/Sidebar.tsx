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
    AlertTriangle,
    ArrowLeftRight,
    Target,
    FileText,
    Zap
} from "lucide-react"
import { CommandMenu } from "./CommandMenu"

// Different nav items based on role
const adminNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/clients", label: "Clients", icon: Users },
    { href: "/datasets", label: "Data", icon: Database },
    { href: "/insights", label: "AI Insights", icon: MessageSquareText },
    { href: "/analysis", label: "Analysis", icon: Beaker },
    { href: "/compare", label: "Compare", icon: ArrowLeftRight },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/integrations", label: "Integrations", icon: Zap },
    { href: "/settings", label: "Settings", icon: Settings },
]

const clientNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/datasets", label: "My Data", icon: Database },
    { href: "/insights", label: "AI Insights", icon: MessageSquareText },
    { href: "/chart-builder", label: "Chart Builder", icon: BarChart3 },
    { href: "/compare", label: "Compare", icon: ArrowLeftRight },
    { href: "/goals", label: "Goals", icon: Target },
    { href: "/data-story", label: "Data Story", icon: Sparkles },
    { href: "/anomalies", label: "Anomalies", icon: AlertTriangle },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/integrations", label: "Integrations", icon: Zap },
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

    const navItems = isAdmin ? adminNavItems : clientNavItems
    const logoSrc = mounted && resolvedTheme === "light" ? "/logo-light.png" : "/k2m-logo-new.png"

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen bg-sidebar border-r border-border transition-all duration-300 sticky top-0",
                "shadow-xl dark:shadow-2xl dark:shadow-black/20",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "flex items-center h-16 px-4 border-b border-border",
                collapsed ? "justify-center" : "gap-3"
            )}>
                <div className="relative">
                    <Image
                        src={logoSrc}
                        alt="K2M"
                        width={collapsed ? 36 : 120}
                        height={36}
                        className="object-contain transition-all duration-300"
                    />
                    {/* Subtle glow behind logo */}
                    <div className="absolute inset-0 blur-xl opacity-30 bg-primary -z-10" />
                </div>
            </div>

            {/* Client Company Badge */}
            {!isAdmin && user?.companyName && !collapsed && (
                <div className="px-3 mb-2 mt-4">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/10">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/20 border border-primary/20">
                            <Building2 className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex flex-col gap-0.5 min-w-0">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Workspace</span>
                            <span className="text-sm font-semibold text-foreground truncate">{user.companyName}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Command Menu */}
            {!collapsed && (
                <div className="px-3 mb-4 mt-2">
                    <CommandMenu />
                </div>
            )}

            {/* Navigation */}
            <nav className="flex-1 py-2 px-3 space-y-1 overflow-y-auto scrollbar-thin">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                    const Icon = item.icon

                    return (
                        <Link key={item.href} href={item.href}>
                            <div
                                className={cn(
                                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                    collapsed && "justify-center px-0"
                                )}
                                style={{
                                    animationDelay: `${index * 30}ms`
                                }}
                            >
                                {/* Active Indicator - Gradient pill */}
                                {isActive && (
                                    <div
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                        style={{ background: 'linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%)' }}
                                    />
                                )}

                                {/* Icon with subtle animation */}
                                <div className={cn(
                                    "relative transition-transform duration-200",
                                    !collapsed && "group-hover:scale-110"
                                )}>
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors flex-shrink-0",
                                        isActive ? "text-primary" : "group-hover:text-primary"
                                    )} />
                                    {isActive && (
                                        <div className="absolute inset-0 blur-md opacity-50 bg-primary" />
                                    )}
                                </div>

                                {!collapsed && (
                                    <span className={cn(
                                        "font-medium text-sm transition-colors",
                                        isActive && "font-semibold"
                                    )}>
                                        {item.label}
                                    </span>
                                )}

                                {/* Tooltip for collapsed mode */}
                                {collapsed && (
                                    <div className="absolute left-full ml-3 px-3 py-1.5 bg-popover text-popover-foreground text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-border">
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
                        <div className="relative overflow-hidden p-4 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-blue-500/10 border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
                            {/* Animated gradient background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                            <div className="relative flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <MessageSquareText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-foreground block">AI Assistant</span>
                                    <p className="text-[10px] text-muted-foreground">Ask questions about your data</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            )}

            {/* Collapse Toggle */}
            <div className="p-3 border-t border-border">
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200",
                        collapsed ? "px-0" : "px-3"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
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
                <Button variant="ghost" size="icon" className="md:hidden text-muted-foreground hover:text-foreground">
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
                        <div className="px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/10">
                            <p className="text-xs text-muted-foreground">Your Company</p>
                            <p className="text-sm font-semibold text-foreground">{user.companyName}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="py-4 px-4 space-y-1">
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
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                    )}
                                >
                                    {isActive && (
                                        <div
                                            className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                                            style={{ background: 'linear-gradient(180deg, #8b5cf6 0%, #6366f1 100%)' }}
                                        />
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
