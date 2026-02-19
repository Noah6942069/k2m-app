"use client"

export default function BusinessIntelligencePage() {
    return (
        <div className="flex-1 min-h-screen">
            <div className="px-6 md:px-10 pt-6 space-y-6">
                {/* Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                    <div className="rounded-3xl border border-white/[0.12] bg-white/[0.03] backdrop-blur-sm p-6 md:p-8 min-h-[320px]" />
                </div>
            </div>
        </div>
    )
}
