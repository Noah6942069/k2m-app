"use client"

import { useState } from "react"
import { Bell, Check, CheckCheck, Trash2, Upload, Sparkles, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export type NotificationType = "success" | "info" | "warning" | "insight"

export interface Notification {
    id: string
    type: NotificationType
    title: string
    message: string
    timestamp: Date
    read: boolean
}

interface NotificationPanelProps {
    notifications?: Notification[]
    onMarkAsRead?: (id: string) => void
    onMarkAllRead?: () => void
    onClear?: (id: string) => void
}

const typeConfig = {
    success: {
        icon: Check,
        bgColor: "bg-emerald-500/10",
        iconColor: "text-emerald-400",
        borderColor: "border-emerald-500/20"
    },
    info: {
        icon: Info,
        bgColor: "bg-primary/10",
        iconColor: "text-primary",
        borderColor: "border-primary/20"
    },
    warning: {
        icon: AlertCircle,
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-400",
        borderColor: "border-amber-500/20"
    },
    insight: {
        icon: Sparkles,
        bgColor: "bg-primary/10",
        iconColor: "text-primary",
        borderColor: "border-primary/20"
    }
}

// Demo notifications for initial state
const demoNotifications: Notification[] = [
    {
        id: "1",
        type: "success",
        title: "Dataset uploaded",
        message: "sales_data_2024.xlsx has been processed successfully.",
        timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
        read: false
    },
    {
        id: "2",
        type: "insight",
        title: "New insight available",
        message: "AI detected a 23% increase in Q4 revenue patterns.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false
    },
    {
        id: "3",
        type: "info",
        title: "Weekly report ready",
        message: "Your analytics summary for this week is available.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: true
    }
]

export function NotificationPanel({
    notifications = demoNotifications,
    onMarkAsRead,
    onMarkAllRead,
    onClear
}: NotificationPanelProps) {
    const [localNotifications, setLocalNotifications] = useState(notifications)

    const unreadCount = localNotifications.filter(n => !n.read).length

    const handleMarkAsRead = (id: string) => {
        setLocalNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        onMarkAsRead?.(id)
    }

    const handleMarkAllRead = () => {
        setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })))
        onMarkAllRead?.()
    }

    const handleClear = (id: string) => {
        setLocalNotifications(prev => prev.filter(n => n.id !== id))
        onClear?.(id)
    }

    const formatTime = (date: Date) => {
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMins < 1) return "Just now"
        if (diffMins < 60) return `${diffMins}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        return `${diffDays}d ago`
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center badge-pulse">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 p-0 bg-card border-border rounded-xl shadow-xl tooltip-fade"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <DropdownMenuLabel className="p-0 text-foreground font-semibold">
                        Notifications
                    </DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllRead}
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                        >
                            <CheckCheck className="w-3 h-3 mr-1" />
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="max-h-[320px]">
                    {localNotifications.length === 0 ? (
                        <div className="py-12 text-center">
                            <Bell className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                            <p className="text-muted-foreground text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {localNotifications.map((notification) => {
                                const config = typeConfig[notification.type]
                                const Icon = config.icon

                                return (
                                    <div
                                        key={notification.id}
                                        className={cn(
                                            "group relative flex gap-3 p-3 rounded-lg transition-colors cursor-pointer",
                                            notification.read
                                                ? "opacity-60 hover:opacity-100"
                                                : "bg-muted/30 hover:bg-muted/50"
                                        )}
                                        onClick={() => handleMarkAsRead(notification.id)}
                                    >
                                        {/* Icon */}
                                        <div className={cn(
                                            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                                            config.bgColor
                                        )}>
                                            <Icon className={cn("w-4 h-4", config.iconColor)} />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={cn(
                                                "text-sm font-medium truncate",
                                                notification.read ? "text-muted-foreground" : "text-foreground"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70 mt-1">
                                                {formatTime(notification.timestamp)}
                                            </p>
                                        </div>

                                        {/* Delete button */}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                handleClear(notification.id)
                                            }}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>

                                        {/* Unread indicator */}
                                        {!notification.read && (
                                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {localNotifications.length > 0 && (
                    <div className="p-2 border-t border-border">
                        <Button
                            variant="ghost"
                            className="w-full text-sm text-muted-foreground hover:text-foreground"
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
