"use client"

import { useState, useRef, useEffect } from "react"
import {
    MessageSquareText,
    Send,
    Sparkles,
    TrendingUp,
    AlertCircle,
    Lightbulb,
    Copy,
    Check,
    Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
    id: string
    role: "user" | "ai"
    content: string
    timestamp: Date
}

interface Insight {
    type: "trend" | "alert" | "recommendation"
    title: string
    description: string
    metric?: string
    change?: number
}

// Simulated AI insights based on typical business data patterns
const generateInsights = (): Insight[] => [
    {
        type: "trend",
        title: "Revenue Growth Detected",
        description: "Q4 sales are 18% higher than the same period last year, driven by increased online orders.",
        metric: "Revenue",
        change: 18
    },
    {
        type: "alert",
        title: "June Performance Dip",
        description: "June showed the lowest sales volume this year. Consider seasonal marketing campaigns for summer months.",
        metric: "Sales",
        change: -23
    },
    {
        type: "recommendation",
        title: "Focus on Product Category A",
        description: "Products in Category A have the highest profit margin at 34%. Consider expanding this product line.",
        metric: "Margin",
        change: 34
    },
    {
        type: "trend",
        title: "Customer Acquisition Up",
        description: "New customer signups increased by 12% this quarter compared to the previous quarter.",
        metric: "Customers",
        change: 12
    }
]

// Simulated AI responses
const aiResponses: Record<string, string> = {
    "default": "Based on your data, I can see several interesting patterns. Would you like me to analyze sales trends, profit margins, or customer behavior?",
    "sales": "Looking at your sales data, December was your strongest month with $420K in revenue, likely due to holiday shopping. June was the weakest at $280K. I recommend focusing marketing efforts on the summer months to address this seasonal dip.",
    "profit": "Your overall profit margin is 28.5%, which is above industry average. Product Category A contributes the most to profits at 34% margin, while Category C is underperforming at just 12% margin. Consider reviewing pricing or costs for Category C.",
    "best": "Your best performing month was December with $420K in sales and 32% profit margin. The key drivers were: 1) Holiday promotions, 2) New product launches, 3) Increased repeat customer purchases.",
    "worst": "June was your weakest month with $280K in sales, 23% below average. This appears to be a seasonal pattern. I recommend: 1) Summer-specific promotions, 2) Product bundles, 3) Email campaigns to existing customers.",
    "trend": "I see an upward trend in your data. Year-over-year growth is 15%, and the trajectory suggests you could reach $5M annual revenue by maintaining current momentum.",
    "recommend": "Based on my analysis, here are my top 3 recommendations: 1) Invest more in Category A products (highest margin), 2) Launch summer marketing campaigns to address June dip, 3) Focus on customer retention - repeat customers have 40% higher order values."
}

export default function InsightsPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [insights] = useState<Insight[]>(generateInsights())
    const [copied, setCopied] = useState<string | null>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const getAIResponse = (userMessage: string): string => {
        const lower = userMessage.toLowerCase()

        if (lower.includes("sales") || lower.includes("revenue")) return aiResponses.sales
        if (lower.includes("profit") || lower.includes("margin")) return aiResponses.profit
        if (lower.includes("best") || lower.includes("highest")) return aiResponses.best
        if (lower.includes("worst") || lower.includes("lowest") || lower.includes("bad")) return aiResponses.worst
        if (lower.includes("trend") || lower.includes("growth")) return aiResponses.trend
        if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("should")) return aiResponses.recommend

        return aiResponses.default
    }

    const sendMessage = async () => {
        if (!input.trim()) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInput("")
        setIsTyping(true)

        // Simulate AI thinking
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

        const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: getAIResponse(input),
            timestamp: new Date()
        }

        setIsTyping(false)
        setMessages(prev => [...prev, aiMessage])
    }

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    const insightIcons = {
        trend: TrendingUp,
        alert: AlertCircle,
        recommendation: Lightbulb
    }

    const insightColors = {
        trend: { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary" },
        alert: { bg: "bg-yellow-500/10", border: "border-yellow-500/20", text: "text-yellow-500" },
        recommendation: { bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-500" }
    }

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6">
            {/* Left Sidebar - History & Suggestions */}
            <div className="w-80 border-r border-border flex flex-col bg-card/50 backdrop-blur-xl">
                <div className="p-4 border-b border-border">
                    <Button
                        onClick={() => {
                            setMessages([])
                        }}
                        className="w-full justify-start gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                    >
                        <Plus className="w-4 h-4" />
                        New Chat
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Recent Chats */}
                    <div>
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Recent
                        </h3>
                        <div className="space-y-1">
                            {["Sales Q3 Analysis", "Customer Churn Prediction", "Inventory Optimization"].map((topic, i) => (
                                <div
                                    key={i}
                                    className="px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground cursor-pointer transition-colors flex items-center gap-2 group"
                                >
                                    <MessageSquareText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                    <span className="truncate">{topic}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pro Tip Card */}
                    <div className="p-4 rounded-xl bg-muted/50 border border-border">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-foreground mb-1">Pro Tip</h4>
                                <p className="text-xs text-muted-foreground">
                                    Ask about specific date ranges to get more accurate trend analysis.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Chat Interface */}
            <div className="flex-1 flex flex-col rounded-2xl bg-card border border-border overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center ai-pulse">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-foreground">K2M AI Assistant</h2>
                        <p className="text-xs text-muted-foreground">Ask questions about your data</p>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center px-8">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                <MessageSquareText className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-lg font-medium text-foreground mb-2">Ask me anything</h3>
                            <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                                I can analyze your client data and provide insights on sales, profits, trends, and recommendations.
                            </p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["What were the best sales months?", "Show me profit trends", "Any recommendations?"].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        className="px-3 py-1.5 text-xs rounded-full bg-muted border border-border text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[80%] ${msg.role === "user" ? "order-2" : ""}`}>
                                {msg.role === "ai" && (
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center">
                                            <Sparkles className="w-3 h-3 text-white" />
                                        </div>
                                        <span className="text-xs text-muted-foreground">K2M AI</span>
                                    </div>
                                )}
                                <div
                                    className={`p-4 rounded-2xl ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted border border-border text-foreground"
                                        }`}
                                >
                                    <p className={`text-sm ${msg.role === "ai" ? "text-foreground" : ""}`}>
                                        {msg.content}
                                    </p>
                                </div>
                                {msg.role === "ai" && (
                                    <button
                                        onClick={() => copyToClipboard(msg.content, msg.id)}
                                        className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {copied === msg.id ? (
                                            <>
                                                <Check className="w-3 h-3" />
                                                Copied
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3 h-3" />
                                                Copy
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-2 p-4 rounded-2xl bg-muted border border-border">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex gap-2"
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about sales, profits, trends..."
                            className="flex-1 px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder:text-muted-foreground"
                        />
                        <Button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="px-4 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
