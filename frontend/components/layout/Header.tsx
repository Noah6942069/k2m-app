"use client"

import { MobileSidebar } from "./Sidebar"
import { NotificationPanel } from "./NotificationPanel"
import { Button } from "@/components/ui/button"
import { ModifierKey } from "@/components/ui/modifier-key"
import { MagnifyingGlass, User, SignOut, CaretDown, Gear } from "@phosphor-icons/react"
import { useAuth } from "@/lib/auth-context"
import { useState } from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { LanguageSwitcher } from "@/components/ui/language-switcher"
import { cn } from "@/lib/utils"

export function Header() {
    const { user, logout, isAdmin } = useAuth()
    const [showUserMenu, setShowUserMenu] = useState(false)

    return (
        <header className="sticky top-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border/40">
            <div className="flex items-center justify-between h-full px-4 md:px-6">
                {/* Left: Mobile Menu */}
                <div className="flex items-center gap-3">
                    <MobileSidebar />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1.5">

                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <NotificationPanel />

                    {/* Divider */}
                    <div className="hidden md:block w-px h-6 bg-border/50 mx-1" />

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-lg hover:bg-muted/50 transition-colors group"
                        >
                            <div className="hidden md:block text-right">
                                <p className="text-[13px] font-medium text-foreground leading-none mb-0.5">
                                    {user?.displayName || "User"}
                                </p>
                                <p className="text-[11px] text-muted-foreground leading-none">
                                    {isAdmin ? "Admin" : "Client"}
                                </p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-sm font-medium text-white">
                                {user?.displayName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <CaretDown className={cn(
                                "w-3.5 h-3.5 text-muted-foreground hidden md:block transition-transform duration-150",
                                showUserMenu && "rotate-180"
                            )} weight="duotone" />
                        </button>

                        {/* Dropdown */}
                        {showUserMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowUserMenu(false)}
                                />
                                <div className="absolute right-0 top-full mt-1.5 w-56 p-1.5 rounded-xl bg-popover border border-border shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {/* User Info */}
                                    <div className="px-3 py-2.5 border-b border-border/50 mb-1.5">
                                        <p className="text-sm font-medium text-foreground">{user?.displayName}</p>
                                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                    </div>

                                    {/* Menu Items */}
                                    <Link
                                        href="/settings"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                                    >
                                        <Gear className="w-4 h-4" weight="duotone" />
                                        Settings
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logout()
                                            setShowUserMenu(false)
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                    >
                                        <SignOut className="w-4 h-4" weight="duotone" />
                                        Sign out
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
