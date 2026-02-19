"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface SidebarLogoProps {
    collapsed: boolean
}

export function SidebarLogo({ collapsed }: SidebarLogoProps) {
    const { resolvedTheme } = useTheme()

    return (
        <div className={cn(
            "h-20 flex items-center shrink-0 relative transition-all duration-300 ease-in-out",
            collapsed ? "justify-center" : "px-6"
        )}>
            <Link href="/dashboard" className="flex items-center gap-3 h-full w-full relative">

                {/* Collapsed Logo - Centered & Absolute */}
                <div
                    className={cn(
                        "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]", // Bouncy effect restored
                        collapsed
                            ? "opacity-100 scale-100 rotate-0 visible delay-100"
                            : "opacity-0 scale-0 -rotate-90 invisible pointer-events-none"
                    )}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <img
                        src={resolvedTheme === 'dark' ? '/k2m-logo-icon.png' : '/k2m-logo-icon-light.png'}
                        alt="K2M"
                        className={cn(
                            "object-contain",
                            resolvedTheme === 'dark' ? "h-14 w-14" : "h-10 w-10 mix-blend-multiply contrast-125 brightness-110"
                        )}
                        style={{
                            backgroundColor: 'transparent',
                            mixBlendMode: resolvedTheme === 'dark' ? 'screen' : 'multiply'
                        }}
                    />
                </div>

                {/* Expanded Logo - Left Aligned */}
                <div className={cn(
                    "flex items-center transition-all duration-300 ease-in-out origin-left",
                    !collapsed
                        ? "opacity-100 scale-100 translate-x-0 visible delay-100"
                        : "opacity-0 scale-90 -translate-x-4 invisible pointer-events-none"
                )}>
                    <img
                        src={resolvedTheme === 'dark' ? '/k2m-logo-new.png' : '/logo-light.png'}
                        alt="K2M"
                        className={cn(
                            "h-14 w-auto transition-all duration-300",
                            resolvedTheme !== 'dark' && "mix-blend-multiply contrast-125 brightness-110"
                        )}
                    />
                </div>
            </Link>
        </div>
    )
}
