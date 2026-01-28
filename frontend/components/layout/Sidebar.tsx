"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth-context"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/language-context"
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
    Zap,
    Home,
    PieChart,
    Calculator,
    LogOut
} from "lucide-react"

interface SidebarProps {
    collapsed?: boolean
    onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const { user, isAdmin, logout } = useAuth()
    const { resolvedTheme } = useTheme()
    const { t } = useTranslation()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Prevent hydration mismatch
    if (!mounted) return null

    const adminNavItems = [
        { href: "/dashboard", label: t.navigation.home, icon: Home },
        { href: "/overview", label: t.navigation.overview, icon: LayoutDashboard },
        { href: "/bi", label: t.navigation.bi, icon: PieChart },
        { href: "/clients", label: t.navigation.clients, icon: Users },
        { href: "/datasets", label: t.navigation.data, icon: Database },
        { href: "/insights", label: t.navigation.insights, icon: MessageSquareText },
        { href: "/analysis", label: t.navigation.analysis, icon: Beaker },
        { href: "/compare", label: t.navigation.compare, icon: ArrowLeftRight },
        { href: "/anomalies", label: t.navigation.anomalies, icon: AlertTriangle },
        { href: "/goals", label: t.navigation.goals, icon: Target },
        { href: "/simulation", label: t.navigation.simulation, icon: Zap },
        { href: "/reports", label: t.navigation.reports, icon: FileText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const clientNavItems = [
        { href: "/dashboard", label: t.navigation.home, icon: Home },
        { href: "/datasets", label: t.navigation.myData, icon: Database },
        { href: "/insights", label: t.navigation.insights, icon: MessageSquareText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const navItems = isAdmin ? adminNavItems : clientNavItems

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen sticky top-0 bg-sidebar border-r border-border/40 transition-all duration-300 ease-out z-50",
                collapsed ? "w-[72px]" : "w-[260px]"
            )}
        >
            {/* Logo Area */}
            <div className={cn(
                "h-16 flex items-center border-b border-border/40",
                collapsed ? "px-4 justify-center" : "px-5"
            )}>
                <Link href="/dashboard" className="flex items-center gap-3">
                    <img
                        src={resolvedTheme === 'dark' ? '/k2m-logo-new.png' : '/logo-light.png'}
                        alt="K2M"
                        className={cn(
                            "transition-all duration-300",
                            resolvedTheme !== 'dark' && "mix-blend-multiply contrast-125 brightness-110",
                            collapsed ? "h-9 w-auto" : "h-11 w-auto"
                        )}
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin">
                <div className="space-y-0.5">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href
                        const Icon = item.icon

                        return (
                            <Link key={item.href} href={item.href}>
                                <div
                                    className={cn(
                                        "group flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-150 relative",
                                        isActive
                                            ? "bg-primary/10 text-primary"
                                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                        collapsed && "justify-center px-0"
                                    )}
                                >
                                    {/* Active indicator */}
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                                    )}

                                    <Icon className={cn(
                                        "w-[18px] h-[18px] shrink-0 transition-transform duration-150",
                                        isActive && "text-primary",
                                        !collapsed && "group-hover:scale-105"
                                    )} />

                                    {!collapsed && (
                                        <span className={cn(
                                            "text-[13px] font-medium truncate",
                                            isActive && "text-primary"
                                        )}>
                                            {item.label}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Footer - User & Collapse */}
            <div className={cn(
                "border-t border-border/40",
                collapsed ? "p-2" : "p-3"
            )}>
                {/* User Card */}
                {!collapsed && (
                    <div className="mb-3 p-3 rounded-xl bg-muted/30 border border-border/40">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-semibold text-white">
                                {user?.displayName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user?.displayName || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Collapse/Expand Button */}
                <button
                    onClick={onToggle}
                    className={cn(
                        "w-full flex items-center gap-2 h-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors",
                        collapsed ? "justify-center" : "px-3"
                    )}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <>
                            <ChevronLeft className="w-4 h-4" />
                            <span className="text-xs font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>
        </aside>
    )
}

// Mobile Sidebar
export function MobileSidebar() {
    const { user, isAdmin, logout } = useAuth()
    const { theme } = useTheme()
    const { t } = useTranslation()
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    const adminNavItems = [
        { href: "/dashboard", label: t.navigation.home, icon: Home },
        { href: "/overview", label: t.navigation.overview, icon: LayoutDashboard },
        { href: "/bi", label: t.navigation.bi, icon: PieChart },
        { href: "/clients", label: t.navigation.clients, icon: Users },
        { href: "/datasets", label: t.navigation.data, icon: Database },
        { href: "/insights", label: t.navigation.insights, icon: MessageSquareText },
        { href: "/analysis", label: t.navigation.analysis, icon: Beaker },
        { href: "/compare", label: t.navigation.compare, icon: ArrowLeftRight },
        { href: "/goals", label: t.navigation.goals, icon: Target },
        { href: "/simulation", label: "Simulation", icon: Calculator },
        { href: "/reports", label: t.navigation.reports, icon: FileText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const clientNavItems = [
        { href: "/dashboard", label: t.navigation.home, icon: Home },
        { href: "/overview", label: t.navigation.overview, icon: LayoutDashboard },
        { href: "/bi", label: t.navigation.bi, icon: PieChart },
        { href: "/datasets", label: t.navigation.myData, icon: Database },
        { href: "/insights", label: t.navigation.insights, icon: MessageSquareText },
        { href: "/chart-builder", label: t.navigation.chartBuilder, icon: BarChart3 },
        { href: "/compare", label: t.navigation.compare, icon: ArrowLeftRight },
        { href: "/goals", label: t.navigation.goals, icon: Target },
        { href: "/simulation", label: "Simulation", icon: Calculator },
        { href: "/reports", label: t.navigation.reports, icon: FileText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const navItems = isAdmin ? adminNavItems : clientNavItems

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-muted-foreground hover:text-foreground"
                >
                    <Menu className="w-5 h-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-r border-border/40">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-border/40">
                    <img
                        src={theme === 'dark' ? '/k2m-logo-new.png' : '/logo-light.png'}
                        alt="K2M"
                        className="h-9 w-auto"
                    />
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-4 px-3">
                    <div className="space-y-0.5">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                >
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-150 relative",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                                        )}
                                        <Icon className="w-[18px] h-[18px] shrink-0" />
                                        <span className="text-[13px] font-medium">{item.label}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </nav>

                {/* User & Logout */}
                <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border/40 bg-sidebar">
                    <div className="mb-3 p-3 rounded-xl bg-muted/30">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-semibold text-white">
                                {user?.displayName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {user?.displayName || "User"}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
                        onClick={() => {
                            logout()
                            setOpen(false)
                        }}
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Sign out</span>
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
}
