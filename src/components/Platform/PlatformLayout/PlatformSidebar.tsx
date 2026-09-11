"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    LogOut,
    Settings,
    X,
} from "lucide-react";

import { navigationItems } from "./platformItems";
import LogoutAdminButton from "./LogoutAdmin";

type TPlatformSidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: (value: boolean) => void;
};

export default function PlatformSidebar({
    sidebarOpen,
    setSidebarOpen,
}: TPlatformSidebarProps) {
    const pathname = usePathname();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        চালান: pathname.startsWith("/system/chalan"),
    });

    const toggleMenu = (label: string) => {
        setOpenMenus((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    const isActive = (href: string) => {
        return (
            pathname === href 
        );
    };

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`
                    fixed inset-y-0 left-0 z-50
                    w-[222px]
                    border-r border-gray-200
                    bg-white
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >
                <div className="flex h-full flex-col">
                    {/* Header */}
                    <div className="relative flex h-[64px] shrink-0 items-center justify-center border-b border-gray-200">
                        <h1 className="text-xl font-bold tracking-tight text-[#34495e]">
                            এডমিন প্যানেল
                        </h1>

                        <button
                            type="button"
                            onClick={() => setSidebarOpen(false)}
                            className="
                                absolute right-3
                                rounded-md p-1.5
                                text-gray-500
                                hover:bg-gray-100
                                lg:hidden
                            "
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto">
                        <nav className="py-2">
                            {navigationItems.map((item) => {
                                const Icon = item.icon;

                                const hasChildren =
                                    !!item.children?.length;

                                return (
                                    <div key={item.label}>
                                        {/* Main Item */}
                                        {hasChildren ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleMenu(item.label)
                                                }
                                                className="
                                                    flex w-full
                                                    items-center justify-between
                                                    px-3.5 py-2.5
                                                    text-sm
                                                    font-medium
                                                    text-[#34495e]
                                                    transition-colors
                                                    hover:bg-[#E8F5F0]
                                                    hover:text-[#006A4E]
                                                "
                                            >
                                                <span className="flex items-center gap-3">
                                                    <Icon
                                                        size={17}
                                                        strokeWidth={1.8}
                                                    />

                                                    <span>
                                                        {item.label}
                                                    </span>
                                                </span>

                                                {openMenus[item.label] ? (
                                                    <ChevronDown
                                                        size={15}
                                                        strokeWidth={1.8}
                                                    />
                                                ) : (
                                                    <ChevronRight
                                                        size={15}
                                                        strokeWidth={1.8}
                                                    />
                                                )}
                                            </button>
                                        ) : (
                                            <Link
                                                href={item.href!}
                                                onClick={() =>
                                                    setSidebarOpen(false)
                                                }
                                                className={`
                                                    flex items-center gap-3
                                                    px-3.5 py-2.5
                                                    text-sm
                                                    font-medium
                                                    transition-colors
                                                    ${
                                                        isActive(item.href!)
                                                            ? "bg-[#006A4E] text-white"
                                                            : "text-[#34495e] hover:bg-[#E8F5F0] hover:text-[#006A4E]"
                                                    }
                                                `}
                                            >
                                                <Icon
                                                    size={17}
                                                    strokeWidth={1.8}
                                                />

                                                <span>{item.label}</span>
                                            </Link>
                                        )}

                                        {/* Sub Menu */}
                                        {hasChildren &&
                                            openMenus[item.label] && (
                                                <div className="bg-[#F8FAF9] py-1">
                                                    {item.children?.map(
                                                        (child) => {
                                                            const childIsActive =
                                                                isActive(
                                                                    child.href,
                                                                );

                                                            return (
                                                                <Link
                                                                    key={
                                                                        child.href
                                                                    }
                                                                    href={
                                                                        child.href
                                                                    }
                                                                    onClick={() =>
                                                                        setSidebarOpen(
                                                                            false,
                                                                        )
                                                                    }
                                                                    className={`
                                                                        flex items-center
                                                                        gap-2
                                                                        px-4 py-2
                                                                        text-[13px]
                                                                        font-medium
                                                                        transition-colors
                                                                        ${
                                                                            childIsActive
                                                                                ? "bg-[#006A4E] text-white"
                                                                                : "text-[#4d5966] hover:bg-[#E8F5F0] hover:text-[#006A4E]"
                                                                        }
                                                                    `}
                                                                >
                                                                    <ChevronRight
                                                                        size={
                                                                            13
                                                                        }
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                    />

                                                                    <span>
                                                                        {
                                                                            child.label
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            );
                                                        },
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Bottom */}
                    <div className="shrink-0 border-t border-gray-200 bg-white">
                        {/* Settings */}
                        <Link
                            href="/system/settings"
                            onClick={() => setSidebarOpen(false)}
                            className={`
                                flex items-center gap-3
                                px-3.5 py-2.5
                                text-sm
                                font-medium
                                transition-colors
                                ${
                                    isActive("/system/settings")
                                        ? "bg-[#006A4E] text-white"
                                        : "text-[#34495e] hover:bg-[#E8F5F0] hover:text-[#006A4E]"
                                }
                            `}
                        >
                            <Settings
                                size={17}
                                strokeWidth={1.8}
                            />

                            <span>সেটিংস</span>
                        </Link>

                        {/* Logout */}
                        <LogoutAdminButton/>
                        
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="
                        fixed inset-0 z-40
                        bg-black/30
                        lg:hidden
                    "
                />
            )}
        </>
    );
}