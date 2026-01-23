"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    LayoutDashboard,
    Database,
    MessageSquareText,
    Beaker,
    BarChart3,
    Sun,
    Moon,
    Laptop,
    Plus,
    Sparkles,
    AlertTriangle
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"
import { ModifierKey } from "@/components/ui/modifier-key"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)
    const { setTheme } = useTheme()
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="w-full relative flex items-center justify-between px-4 py-2 text-sm text-muted-foreground bg-muted/50 hover:bg-muted/80 border border-border rounded-xl transition-colors mb-2 group"
            >
                <span className="flex items-center gap-2">
                    <SearchIcon className="w-3.5 h-3.5" />
                    <span className="group-hover:text-foreground transition-colors">Search...</span>
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs"><ModifierKey /></span>K
                </kbd>
            </button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Type a command or search..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Dashboard</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/insights'))}>
                            <MessageSquareText className="mr-2 h-4 w-4" />
                            <span>AI Insights</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/datasets'))}>
                            <Database className="mr-2 h-4 w-4" />
                            <span>Datasets</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/chart-builder'))}>
                            <BarChart3 className="mr-2 h-4 w-4" />
                            <span>Chart Builder</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/data-story'))}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            <span>Data Story</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/anomalies'))}>
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            <span>Anomalies</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Actions">
                        <CommandItem onSelect={() => runCommand(() => router.push('/insights?new=true'))}>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>New Chat</span>
                            <CommandShortcut><ModifierKey />N</CommandShortcut>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/analysis'))}>
                            <Beaker className="mr-2 h-4 w-4" />
                            <span>New Analysis</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Theme">
                        <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
                            <Sun className="mr-2 h-4 w-4" />
                            <span>Light Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
                            <Moon className="mr-2 h-4 w-4" />
                            <span>Dark Mode</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
                            <Laptop className="mr-2 h-4 w-4" />
                            <span>System</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Settings">
                        <CommandItem onSelect={() => runCommand(() => router.push('/clients'))}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Clients</span>
                        </CommandItem>
                        <CommandItem onSelect={() => runCommand(() => router.push('/settings'))}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <CommandShortcut><ModifierKey />S</CommandShortcut>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

function SearchIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    )
}
