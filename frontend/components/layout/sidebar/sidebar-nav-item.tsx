"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button" // Unused as per old version?
import { IconProps } from "@phosphor-icons/react"

interface SidebarNavItemProps {
    href: string
    label: string
    icon: React.ComponentType<IconProps>
    collapsed: boolean
    isSubItem?: boolean
    isActive?: boolean
}

export function SidebarNavItem({
    href,
    label,
    icon: Icon,
    collapsed,
    isSubItem = false,
    isActive: externalIsActive
}: SidebarNavItemProps) {
    const pathname = usePathname()
    const isActive = externalIsActive ?? pathname === href

    return (
        <Link
            href={href}
            className={cn(
                "group flex items-center gap-3 px-3 h-10 rounded-lg transition-all duration-150 relative",
                isActive
                    ? "bg-primary/10 text-primary" // Old styling
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                collapsed && "justify-center px-0",
                isSubItem && !collapsed && "pl-10"
            )}
        >
            {/* Active indicator - Restored */}
            {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
            )}

            <Icon className={cn(
                "w-[18px] h-[18px] shrink-0 transition-transform duration-150",
                isActive && "text-primary",
                !collapsed && "group-hover:scale-105" // Restored bounce/scale
            )} />

            {!collapsed && (
                <span className={cn(
                    "text-[13px] font-medium truncate",
                    isActive && "text-primary"
                )}>
                    {label}
                </span>
            )}
        </Link>
    )
}
