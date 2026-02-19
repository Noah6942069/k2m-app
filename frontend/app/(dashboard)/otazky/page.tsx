"use client"

import { useState, useEffect, useRef } from "react"
import { Sparkle, CaretDown, DotsThree, SidebarSimple } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChatSidebar } from "./components/chat-sidebar"
import { ChatBubble } from "./components/chat-bubble"
import { ChatInput } from "./components/chat-input"
import { INITIAL_MESSAGES } from "./data"
import { apiGet, apiPost } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Dataset {
    id: number
    filename: string
}

export default function OtazkyPage() {
    const { user, loading } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [inputValue, setInputValue] = useState("")
    const [isThinking, setIsThinking] = useState(false)
    const [isInputCentered, setIsInputCentered] = useState(true)
    const [activeChatId, setActiveChatId] = useState<number | null>(null)
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [datasetId, setDatasetId] = useState<number | null>(null)
    const [datasets, setDatasets] = useState<Dataset[]>([])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Fetch available datasets once user is logged in
    useEffect(() => {
        if (loading || !user) return
        apiGet<Dataset[]>("/datasets/")
            .then((data) => {
                setDatasets(data)
                if (data.length > 0) {
                    setDatasetId(data[0].id)
                }
            })
            .catch((err) => console.error("Failed to load datasets:", err))
    }, [user, loading])

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isThinking])

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        const userMsg = { id: Date.now(), role: "user", content: inputValue }
        setMessages(prev => [...prev, userMsg])
        const messageText = inputValue
        setInputValue("")
        setIsInputCentered(false)
        setIsThinking(true)

        try {
            if (!datasetId) {
                throw new Error("Žádný dataset není k dispozici.")
            }
            const result = await apiPost<{ response: string }>(
                `/analytics/${datasetId}/chat`,
                { message: messageText }
            )
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "assistant",
                content: result.response
            }])
        } catch (err: any) {
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                role: "assistant",
                content: `Chyba: ${err.message || "Nepodařilo se spojit s AI službou."}`
            }])
        } finally {
            setIsThinking(false)
        }
    }

    return (
        <div className="absolute top-14 left-0 right-0 bottom-0 flex bg-background text-foreground font-sans overflow-hidden">

            {/* Sidebar */}
            <ChatSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                activeChatId={activeChatId}
                setActiveChatId={setActiveChatId}
                onNewChat={() => {
                    setMessages([])
                    setIsInputCentered(true)
                    setActiveChatId(null)
                }}
            />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative h-full max-w-full bg-background">
                {/* Header / Model Selector */}
                <div className="absolute top-0 left-0 w-full p-2 flex items-center justify-between z-10 bg-background border-b border-border/10">
                    <div className="flex items-center">
                        {!sidebarOpen && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSidebarOpen(true)}
                                className="mr-2 text-muted-foreground hover:text-foreground"
                            >
                                <SidebarSimple className="w-5 h-5" weight="duotone" />
                            </Button>
                        )}
                        <Button variant="ghost" className="text-lg font-semibold text-foreground gap-1 hover:bg-muted rounded-xl px-3 ml-2">
                            K2M AI <CaretDown className="w-4 h-4 text-muted-foreground" weight="duotone" />
                        </Button>
                        {datasets.length > 1 && (
                            <select
                                value={datasetId ?? ""}
                                onChange={(e) => setDatasetId(Number(e.target.value))}
                                className="ml-2 text-sm bg-muted border border-border rounded-lg px-2 py-1 text-foreground"
                            >
                                {datasets.map((ds) => (
                                    <option key={ds.id} value={ds.id}>{ds.filename}</option>
                                ))}
                            </select>
                        )}
                    </div>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                        <DotsThree className="w-5 h-5" weight="duotone" />
                    </Button>
                </div>

                {/* Messages Container */}
                <div className={cn(
                    "flex-1 overflow-y-auto w-full pt-16 pb-32 flex justify-center scrollbar-thin scrollbar-thumb-border/40 transition-opacity duration-500",
                    isInputCentered ? "opacity-0 invisible" : "opacity-100 visible"
                )}>
                    <div className="w-full max-w-full px-4 md:px-8 space-y-6">
                        {messages.map((msg) => (
                            <ChatBubble key={msg.id} role={msg.role} content={msg.content} />
                        ))}

                        {isThinking && (
                            <div className="flex gap-4 justify-start w-full">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shrink-0 mt-0.5 animate-pulse shadow-lg shadow-primary/20">
                                    <Sparkle className="w-5 h-5 text-white" weight="duotone" />
                                </div>
                                <div className="flex items-center gap-1 mt-3 ml-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                </div>

                {/* Centered Hero Section */}
                <div className={cn(
                    "absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-4 transition-all duration-500 ease-in-out pointer-events-none z-10",
                    isInputCentered ? "opacity-100 visible scale-100" : "opacity-0 invisible scale-95"
                )}>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent tracking-tight">Jak Vám mohu pomoci?</h2>
                </div>

                {/* Input Area */}
                <ChatInput
                    inputValue={inputValue}
                    setInputValue={setInputValue}
                    isInputCentered={isInputCentered}
                    setIsInputCentered={setIsInputCentered}
                    isThinking={isThinking}
                    onSendMessage={handleSendMessage}
                />
            </div>
        </div>
    )
}
