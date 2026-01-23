"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <ProtectedRoute>
            <div className="flex h-screen bg-background overflow-hidden">
                {/* Subtle gradient overlay for dark mode */}
                <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-blue-500/[0.02] dark:from-primary/[0.03] dark:via-transparent dark:to-blue-500/[0.02] pointer-events-none" />

                {/* Grid pattern overlay */}
                <div className="fixed inset-0 bg-grid-pattern opacity-30 dark:opacity-20 pointer-events-none" />

                {/* Sidebar */}
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />

                {/* Main Content */}
                <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Header />
                    <main className="flex-1 overflow-y-auto">
                        <div className="p-6 md:p-8 max-w-[1600px] mx-auto page-enter">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
