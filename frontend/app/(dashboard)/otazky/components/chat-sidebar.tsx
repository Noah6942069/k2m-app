"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Plus, SidebarSimple } from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { PAST_CHATS } from "../data"

interface ChatSidebarProps {
    sidebarOpen: boolean
    setSidebarOpen: (open: boolean) => void
    activeChatId: number | null
    setActiveChatId: (id: number | null) => void
    onNewChat: () => void
}

export function ChatSidebar({
    sidebarOpen,
    setSidebarOpen,
    activeChatId,
    setActiveChatId,
    onNewChat
}: ChatSidebarProps) {
    const { resolvedTheme } = useTheme()
    const isDark = resolvedTheme === 'dark'

    return (
        <div
            className={cn(
                "flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out",
                sidebarOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-0 overflow-hidden",
                !isDark && "bg-sidebar border-r border-border/40",
            )}
            style={isDark ? {
                backgroundColor: 'rgba(6, 2, 18, 0.5)',
                backdropFilter: 'blur(12px)',
                borderRight: '1px solid rgba(124, 92, 252, 0.15)',
            } : undefined}
        >
            {/* New Chat & Toggle */}
            <div className="p-3 flex items-center justify-between bg-background/50 backdrop-blur-sm border-b border-border/20 z-50">
                <Button
                    onClick={onNewChat}
                    variant="ghost"
                    className="flex-1 justify-start gap-2 border border-border/40 hover:bg-muted text-foreground rounded-lg h-10 px-3 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" weight="duotone" />
                    <span>Nový chat</span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="ml-2 text-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                >
                    <SidebarSimple className="w-5 h-5" weight="duotone" />
                </Button>
            </div>

            {/* History List */}
            <div className="flex-1 overflow-y-auto px-3 py-2 scrollbar-thin scrollbar-thumb-border/40">
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3 pt-2">Dnes</h3>
                    {PAST_CHATS.filter(c => c.date === "Dnes").map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors",
                                activeChatId === chat.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>
                <div className="mb-6">
                    <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-3 pt-2">Včera</h3>
                    {PAST_CHATS.filter(c => c.date === "Včera").map(chat => (
                        <button
                            key={chat.id}
                            onClick={() => setActiveChatId(chat.id)}
                            className={cn(
                                "w-full text-left px-3 py-2 text-sm rounded-lg truncate transition-colors",
                                activeChatId === chat.id
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                        >
                            {chat.title}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}
