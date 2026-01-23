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
    PieChart
} from "lucide-react"
import { CommandMenu } from "./CommandMenu"

interface SidebarProps {
    collapsed?: boolean
    onToggle?: () => void
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
    const { user, isAdmin } = useAuth()
    const { theme, setTheme } = useTheme()
    const { t } = useTranslation()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

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
        { href: "/reports", label: t.navigation.reports, icon: FileText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const navItems = isAdmin ? adminNavItems : clientNavItems

    if (!mounted) {
        return <div className="w-[280px] h-screen bg-card border-r border-border/50" />
    }

    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen sticky top-0 bg-card/50 backdrop-blur-xl border-r border-border/50 transition-all duration-300 z-50",
                collapsed ? "w-[80px]" : "w-[280px]"
            )}
        >
            {/* Logo Area */}
            <div className="h-20 flex items-center px-6 border-b border-border/50">
                <Link href="/dashboard" className="flex items-center gap-3">
                    {/* Theme-aware logo */}
                    <img
                        src={theme === 'dark' ? '/k2m-logo-new.png' : '/logo-light.png'}
                        alt="K2M Analytics"
                        className={cn(
                            "transition-all duration-300",
                            collapsed ? "h-10 w-auto" : "h-14 w-auto"
                        )}
                    />
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto custom-scrollbar">
                {navItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 px-3 py-6 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
                                )}
                                <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "fill-current")} />
                                {!collapsed && <span className="font-medium">{item.label}</span>}
                            </Button>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-border/50">
                {!collapsed ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-blue-500/10 border border-border/50">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary">
                                    {user?.name?.[0] || "U"}
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="font-semibold text-sm truncate">{user?.name || t.common.user}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button variant="ghost" className="w-full justify-start gap-2 h-8 text-xs hover:bg-background/50" onClick={onToggle}>
                            {collapsed ? <ChevronRight className="w-4 h-4 ml-auto" /> : <ChevronLeft className="w-4 h-4 ml-auto" />}
                            <span>{t.common.back}</span>
                        </Button>
                    </div>
                ) : (
                    <Button variant="ghost" size="icon" className="w-full h-12 rounded-xl" onClick={onToggle}>
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                )}
            </div>
        </aside>
    )
}

export function MobileSidebar() {
    const { user, isAdmin, logout } = useAuth()
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
        { href: "/reports", label: t.navigation.reports, icon: FileText },
        { href: "/settings", label: t.navigation.settings, icon: Settings },
    ]

    const navItems = isAdmin ? adminNavItems : clientNavItems

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-border/50">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 flex items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/20">
                                <span className="text-white font-bold text-lg">K</span>
                            </div>
                            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                K2M Analytics
                            </span>
                        </div>
                    </div>

                    <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                >
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 px-3 py-6 rounded-xl transition-all duration-200 group relative overflow-hidden",
                                            isActive
                                                ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )}
                                    >
                                        {isActive && (
                                            <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
                                        )}
                                        <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", isActive && "fill-current")} />
                                        <span className="font-medium">{item.label}</span>
                                    </Button>
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="p-4 border-t border-border/50">
                        <div className="flex items-center gap-3 mb-4 px-2">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="font-bold text-primary">
                                    {user?.name?.[0] || "U"}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm">{user?.name || t.common.user}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                        </div>
                        <CommandMenu />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
