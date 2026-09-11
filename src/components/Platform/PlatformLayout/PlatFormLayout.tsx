"use client";

import {
    Bell,
    ChevronDown,
    Menu,
} from "lucide-react";
import { ReactNode, useState } from "react";
import PlatformSidebar from "./PlatformSidebar";

type TPlatformLayoutProps = {
    children: ReactNode;
};

export default function PlatformLayout({
    children,
}: TPlatformLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F6F8FA]">
            {/* Sidebar */}
            <PlatformSidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* Main */}
            <div className="lg:pl-56">
                {/* Header */}
                <header className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/95 backdrop-blur">
                    <div className="flex h-full items-center justify-between px-4 sm:px-6">
                        {/* Left */}
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setSidebarOpen(true)
                                }
                                className="cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                            >
                                <Menu size={20} />
                            </button>

                            <div>
                                <h2 className="text-sm font-semibold text-gray-900 sm:text-base">
                                    Platform Management
                                </h2>

                                <p className="hidden text-xs text-gray-500 sm:block">
                                    Manage your It Vata platform
                                </p>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Notification */}
                            <button
                                type="button"
                                className="relative cursor-pointer rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <Bell size={18} />

                                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                            </button>

                            <div className="hidden h-6 w-px bg-gray-200 sm:block" />

                            {/* Profile */}
                            <button
                                type="button"
                                className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-gray-50"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F5F0] text-xs font-semibold text-[#006A4E]">
                                    SA
                                </div>

                                <div className="hidden text-left sm:block">
                                    <p className="text-xs font-semibold text-gray-800">
                                        Super Admin
                                    </p>

                                    <p className="text-[10px] text-gray-500">
                                        Platform Owner
                                    </p>
                                </div>

                                <ChevronDown
                                    size={14}
                                    className="hidden text-gray-400 sm:block"
                                />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="min-h-[calc(100vh-4rem)] p-4 sm:p-6">
                    <div className="mx-auto w-full max-w-[1600px]">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}