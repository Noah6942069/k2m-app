"use client"

import React from "react"
import {
    LayoutDashboard,
    BarChart3,
    FileText,
    Users,
    Settings,
    Mail,
    Phone,
    MessageSquare,
    Download
} from "lucide-react"

// --- Data ---
const lineChartData = [
    { month: "Jan", created: 45, solved: 25 },
    { month: "Feb", created: 52, solved: 35 },
    { month: "Mar", created: 48, solved: 45 },
    { month: "Apr", created: 70, solved: 62 },
    { month: "May", created: 55, solved: 58 },
    { month: "Jun", created: 58, solved: 48 },
    { month: "Jul", created: 45, solved: 42 },
]

const pieData = [
    { label: "Enterprise", value: 35, color: "#7C5CFC" },
    { label: "SMB", value: 28, color: "#00D9C0" },
    { label: "Startup", value: 22, color: "#5E43D8" },
    { label: "Other", value: 15, color: "#9F84FD" },
]

const barData = [
    { day: "Po", new: 45, returned: 32 },
    { day: "Út", new: 52, returned: 28 },
    { day: "St", new: 38, returned: 42 },
    { day: "Čt", new: 65, returned: 35 },
    { day: "Pá", new: 48, returned: 38 },
    { day: "So", new: 25, returned: 18 },
    { day: "Ne", new: 15, returned: 12 },
]

const statusItems = [
    { label: "Vytvořeno", count: 156 },
    { label: "Otevřeno", count: 42 },
    { label: "Odpovězeno", count: 89 },
    { label: "Vyřešeno", count: 234, badge: "new" },
    { label: "Ostatní", count: 12 },
]

const channels = [
    { icon: Mail, label: "Email" },
    { icon: Phone, label: "Telefon" },
    { icon: MessageSquare, label: "Chat" },
]

// --- Helper for smooth SVG paths ---
function getSmoothPath(points: { x: number; y: number }[]) {
    if (points.length < 2) return ""

    const command = (point: { x: number; y: number }, i: number, a: { x: number; y: number }[]) => {
        const cps = controlPoint(a[i - 1], a[i - 2], point)
        const cpe = controlPoint(point, a[i - 1], a[i + 1], true)
        return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`
    }

    const controlPoint = (current: { x: number; y: number }, previous: { x: number; y: number }, next: { x: number; y: number }, reverse?: boolean) => {
        const p = previous || current
        const n = next || current
        const smoothing = 0.2
        const o = line(p, n)
        const angle = o.angle + (reverse ? Math.PI : 0)
        const length = o.length * smoothing
        const x = current.x + Math.cos(angle) * length
        const y = current.y + Math.sin(angle) * length
        return { x, y }
    }

    const line = (pointA: { x: number; y: number }, pointB: { x: number; y: number }) => {
        const lengthX = pointB.x - pointA.x
        const lengthY = pointB.y - pointA.y
        return {
            length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
            angle: Math.atan2(lengthY, lengthX)
        }
    }

    const d = points.reduce((acc, point, i, a) => i === 0
        ? `M ${point.x},${point.y}`
        : `${acc} ${command(point, i, a)}`
        , "")

    return d
}

export default function FotkyDemoPage() {
    const maxLine = 80 // Fixed scale
    const maxBar = 80

    // Data prep for line chart
    const solvedPoints = lineChartData.map((d, i) => ({
        x: (i / (lineChartData.length - 1)) * 100,
        y: 100 - (d.solved / maxLine) * 100
    }))
    const createdPoints = lineChartData.map((d, i) => ({
        x: (i / (lineChartData.length - 1)) * 100,
        y: 100 - (d.created / maxLine) * 100
    }))

    // Generate paths - multiply X by width % and Y by height % in SVG logic
    // Actually for SVG viewBox 0 0 100 100, these points work directly

    // Custom logic to scale points for specific SVG aspect ratio if needed,
    // but preserving aspectRatio="none" on svg allows 0-100 coordinates to work.

    return (
        <div className="h-screen w-full bg-[#0a0e17] flex overflow-hidden font-sans text-white">
            {/* Sidebar */}
            <div className="w-64 bg-[#0f1420] border-r border-white/5 flex flex-col p-6 shrink-0">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#5E43D8] flex items-center justify-center shadow-lg shadow-[#7C5CFC]/20">
                        <span className="text-white font-bold text-lg">K2</span>
                    </div>
                    <span className="text-xl font-bold tracking-tight">CRM Dashboard</span>
                </div>

                <div className="space-y-8">
                    {/* Menu Group 1 */}
                    <div>
                        <p className="text-xs text-[#5E43D8] font-bold uppercase tracking-widest mb-4 pl-3">Profile</p>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                                <Users className="w-5 h-5" />
                                <span className="font-medium">Overview</span>
                            </div>
                        </div>
                    </div>

                    {/* Menu Group 2 */}
                    <div>
                        <p className="text-xs text-[#5E43D8] font-bold uppercase tracking-widest mb-4 pl-3">Channels</p>
                        <div className="space-y-1">
                            {channels.map((ch, i) => {
                                const Icon = ch.icon
                                return (
                                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer group">
                                        <Icon className="w-5 h-5 group-hover:text-[#00D9C0] transition-colors" />
                                        <span className="font-medium">{ch.label}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Menu Group 3 */}
                    <div>
                        <p className="text-xs text-[#5E43D8] font-bold uppercase tracking-widest mb-4 pl-3">Tickets Status</p>
                        <div className="space-y-1">
                            {statusItems.map((item, i) => (
                                <div key={i} className="flex items-center justify-between px-3 py-2.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer">
                                    <span className="font-medium">{item.label}</span>
                                    {item.badge && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C5CFC] text-white font-bold uppercase">
                                            {item.badge}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#5E43D8] text-white font-semibold shadow-lg shadow-[#7C5CFC]/25 hover:shadow-[#7C5CFC]/40 transition-all">
                        <Download className="w-5 h-5" />
                        Download Report
                    </button>
                </div>
            </div>

            {/* Main Dashboard Panel */}
            <div className="flex-1 p-8 grid grid-rows-[auto_1fr_auto] gap-6 overflow-hidden h-full">

                {/* Top Row: KPIs + Top-Right Chart */}
                <div className="grid grid-cols-4 gap-6 h-[160px]">
                    {/* KPI 1 - Redesigned */}
                    <div className="rounded-3xl bg-[#161d2d] border border-[#7C5CFC]/20 p-6 relative overflow-hidden flex flex-col justify-center shadow-lg group hover:border-[#7C5CFC]/40 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C5CFC]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#7C5CFC]/20 transition-all" />
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="p-2 rounded-lg bg-[#7C5CFC]/10 text-[#7C5CFC]">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <p className="text-zinc-400 font-medium text-sm">Avg First Reply Time</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1 relative z-10">
                            <span className="text-5xl font-bold tracking-tight text-white">30</span>
                            <span className="text-xl font-semibold text-zinc-500">h</span>
                            <span className="text-4xl font-bold tracking-tight text-white ml-2">15</span>
                            <span className="text-xl font-semibold text-zinc-500">min</span>
                        </div>
                    </div>

                    {/* KPI 2 - Redesigned */}
                    <div className="rounded-3xl bg-[#161d2d] border border-[#00D9C0]/20 p-6 relative overflow-hidden flex flex-col justify-center shadow-lg group hover:border-[#00D9C0]/40 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9C0]/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#00D9C0]/20 transition-all" />
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className="p-2 rounded-lg bg-[#00D9C0]/10 text-[#00D9C0]">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-zinc-400 font-medium text-sm">Avg Full Resolve Time</p>
                        </div>
                        <div className="flex items-baseline gap-2 mt-1 relative z-10">
                            <span className="text-5xl font-bold tracking-tight text-white">22</span>
                            <span className="text-xl font-semibold text-zinc-500">h</span>
                            <span className="text-4xl font-bold tracking-tight text-white ml-2">40</span>
                            <span className="text-xl font-semibold text-zinc-500">min</span>
                        </div>
                    </div>

                    {/* Stats List */}
                    <div className="flex flex-col gap-4 justify-center">
                        <div className="bg-[#161d2d] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-[#7C5CFC]/20 flex items-center justify-center">
                                <MessageSquare className="w-6 h-6 text-[#7C5CFC]" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Messages</p>
                                <p className="text-white font-bold text-lg">1,248</p>
                            </div>
                            <span className="ml-auto text-xs font-bold text-[#7C5CFC] bg-[#7C5CFC]/10 px-2 py-1 rounded">-20%</span>
                        </div>
                        <div className="bg-[#161d2d] rounded-2xl p-4 flex items-center gap-4 border border-white/5">
                            <div className="w-12 h-12 rounded-xl bg-[#00D9C0]/20 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-[#00D9C0]" />
                            </div>
                            <div>
                                <p className="text-zinc-400 text-sm">Emails</p>
                                <p className="text-white font-bold text-lg">8,542</p>
                            </div>
                            <span className="ml-auto text-xs font-bold text-[#00D9C0] bg-[#00D9C0]/10 px-2 py-1 rounded">+33%</span>
                        </div>
                    </div>

                    {/* Top Right Chart - Area Wave */}
                    <div className="rounded-3xl bg-[#161d2d] border border-white/5 p-0 relative overflow-hidden flex flex-col group">
                        <div className="p-5 relative z-10 w-full">
                            <p className="text-white font-medium text-sm">Response Time Trend</p>
                        </div>

                        {/* Tooltip Overlay - HTML for crisp text */}
                        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                            <div className="bg-[#00D9C0] text-[#0a0e17] px-4 py-1.5 rounded-lg font-bold text-sm shadow-lg shadow-[#00D9C0]/20 whitespace-nowrap">
                                2.5 h
                            </div>
                            <div className="w-2.5 h-2.5 bg-[#00D9C0] rotate-45 -mt-1" />
                            <div className="w-3 h-3 bg-[#00D9C0] rounded-full mt-1 border-2 border-[#161d2d]" />
                        </div>

                        <div className="absolute inset-0 pt-10">
                            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="waveGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#7C5CFC" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#7C5CFC" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M0,100 L0,65 Q25,45 50,65 T100,55 L100,100 Z"
                                    fill="url(#waveGradient)"
                                />
                                <path
                                    d="M0,65 Q25,45 50,65 T100,55"
                                    fill="none"
                                    stroke="#7C5CFC"
                                    strokeWidth="3"
                                    vectorEffect="non-scaling-stroke"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Large Charts */}
                <div className="grid grid-cols-3 gap-6">
                    {/* Main Line Chart */}
                    <div className="col-span-2 rounded-3xl bg-[#161d2d] border border-white/5 p-8 flex flex-col shadow-xl relative">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold text-white">Tickets Created vs Solved</h3>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#7C5CFC] shadow-[0_0_8px_#7C5CFC]" />
                                    <span className="text-zinc-400 text-sm font-medium">Solved</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-[#00D9C0] shadow-[0_0_8px_#00D9C0]" />
                                    <span className="text-zinc-400 text-sm font-medium">Created</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 relative w-full h-full min-h-[250px]">
                            {/* Chart Grid */}
                            <div className="absolute inset-0 flex flex-col justify-between text-zinc-600 text-xs font-medium pb-8 pl-10">
                                {[80, 60, 40, 20, 0].map((val) => (
                                    <div key={val} className="w-full flex items-center gap-4">
                                        <span className="w-6 text-right font-mono opacity-50">{val}</span>
                                        <div className="flex-1 h-px bg-white/5 border-t border-dashed border-white/5" />
                                    </div>
                                ))}
                            </div>

                            {/* HTML Overlay for "Max 68" Label - Crisp rendering */}
                            <div className="absolute left-[60%] top-[20%] -translate-x-1/2 z-10 flex flex-col items-center">
                                <div className="bg-[#7C5CFC] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-[#7C5CFC]/30 whitespace-nowrap">
                                    Max 68
                                </div>
                                <div className="w-3 h-3 bg-[#7C5CFC] rounded-full border-4 border-[#161d2d] -mt-1.5" />
                            </div>

                            {/* Lines */}
                            <div className="absolute left-10 right-0 top-2 bottom-8">
                                <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
                                    {/* Created Line (Cyan) */}
                                    <path
                                        d={getSmoothPath(createdPoints.map(p => ({ x: p.x * 10, y: p.y * 5 })))}
                                        fill="none"
                                        stroke="#00D9C0"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                        style={{ filter: 'drop-shadow(0 0 8px rgba(0,217,192,0.4))' }}
                                    />
                                    {/* Solved Line (Purple) */}
                                    <path
                                        d={getSmoothPath(solvedPoints.map(p => ({ x: p.x * 10, y: p.y * 5 })))}
                                        fill="none"
                                        stroke="#7C5CFC"
                                        strokeWidth="3"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        vectorEffect="non-scaling-stroke"
                                        style={{ filter: 'drop-shadow(0 0 8px rgba(124,92,252,0.4))' }}
                                    />
                                </svg>
                            </div>

                            {/* X Labels */}
                            <div className="absolute bottom-0 left-10 right-0 flex justify-between text-zinc-500 text-xs font-medium px-2">
                                {lineChartData.map(d => <span key={d.month}>{d.month}</span>)}
                            </div>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="rounded-3xl bg-[#161d2d] border border-white/5 p-8 flex flex-col shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-6">Tickets / Week Day</h3>
                        <div className="flex-1 flex items-end gap-3">
                            {barData.map((d, i) => {
                                const heightPercent = (d.new / maxBar) * 100
                                const isMax = d.new > 60
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                        <div className="w-full relative h-[200px] flex items-end rounded-xl bg-white/5 overflow-hidden">
                                            <div
                                                className={`w-full transition-all duration-500 rounded-t-xl group-hover:opacity-80 ${isMax ? 'bg-[#00D9C0] shadow-[0_0_20px_rgba(0,217,192,0.4)]' : 'bg-[#7C5CFC]'}`}
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-zinc-500 group-hover:text-white transition-colors">{d.day}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Donuts */}
                <div className="grid grid-cols-2 gap-6 h-[220px]">
                    {/* Donut 1 */}
                    <div className="rounded-3xl bg-[#161d2d] border border-white/5 p-6 flex flex-col shadow-xl">
                        <h3 className="text-white font-bold mb-4">Tickets By Type</h3>
                        <div className="flex-1 flex items-center gap-12">
                            {/* Big Donut */}
                            <div className="relative h-40 w-40 shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {pieData.reduce((acc, item, i) => {
                                        const circumference = 2 * Math.PI * 40
                                        const strokeDasharray = (item.value / 100) * circumference
                                        acc.elements.push(
                                            <circle
                                                key={i}
                                                cx="50"
                                                cy="50"
                                                r="40"
                                                fill="none"
                                                stroke={item.color}
                                                strokeWidth="12"
                                                strokeDasharray={`${strokeDasharray} ${circumference}`}
                                                strokeDashoffset={-acc.offset}
                                                strokeLinecap="round"
                                                className="hover:opacity-90 transition-opacity cursor-pointer"
                                            />
                                        )
                                        acc.offset += strokeDasharray
                                        return acc
                                    }, { elements: [], offset: 0 } as { elements: React.ReactElement[], offset: number }).elements}
                                </svg>
                                {/* Center Text */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-bold text-white tracking-tighter">45%</span>
                                </div>
                            </div>
                            {/* Custom Grid Legend */}
                            <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                                {pieData.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full ring-2 ring-offset-2 ring-offset-[#161d2d]" style={{ backgroundColor: item.color, '--tw-ring-color': item.color } as any} />
                                        <span className="text-sm text-zinc-300 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Donut 2 */}
                    <div className="rounded-3xl bg-[#161d2d] border border-white/5 p-6 flex flex-col shadow-xl">
                        <h3 className="text-white font-bold mb-4">New vs Returned</h3>
                        <div className="flex-1 flex items-center gap-12">
                            {/* Big Donut */}
                            <div className="relative h-40 w-40 shrink-0">
                                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                                    {/* Track - Dark Blue/Purple Mix */}
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#252b42" strokeWidth="12" />
                                    <circle
                                        cx="50" cy="50" r="40" fill="none"
                                        stroke="#00D9C0" strokeWidth="12"
                                        strokeDasharray={`${0.65 * 2 * Math.PI * 40} ${2 * Math.PI * 40}`}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_15px_rgba(0,217,192,0.4)]"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total</span>
                                    <span className="text-3xl font-bold text-white tracking-tight">1,200</span>
                                </div>
                            </div>

                            {/* Detailed Legend */}
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#00D9C0] shadow-[0_0_8px_#00D9C0]" />
                                        <span className="text-sm font-medium text-white">New Tickets</span>
                                    </div>
                                    <span className="text-lg font-bold text-[#00D9C0]">65.3%</span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2.5 h-2.5 rounded-full bg-[#5E43D8]" />
                                        <span className="text-sm font-medium text-white">Returned</span>
                                    </div>
                                    <span className="text-lg font-bold text-[#5E43D8]">34.7%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
