"use client";

import Link from "next/link";
import {
    Settings,
    BarChart3,
    BadgeDollarSign,
    Map,
    UsersRound,
    UserRoundCog,
    TriangleAlert,
    ShieldCheck,
    Printer,
    BrickWall,
    ChevronRight,
    Download,
} from "lucide-react";

const menuItems = [
    {
        title: "ভ্যাটের তথ্য",
        href: "/settings/vat-information",
        icon: BarChart3,
        iconColor: "text-blue-500",
        bgColor: "bg-blue-50",
    },
    {
        title: "শ্রেণি এবং রেট",
        href: "/settings/class-rate",
        icon: BadgeDollarSign,
        iconColor: "text-green-500",
        bgColor: "bg-green-50",
    },
    {
        title: "খতিয়ান অ্যাড",
        href: "/settings/khotiyan",
        icon: Map,
        iconColor: "text-orange-500",
        bgColor: "bg-orange-50",
    },
    {
        title: "সফটওয়্যার ইউজার",
        href: "/settings/software-user",
        icon: UsersRound,
        iconColor: "text-purple-500",
        bgColor: "bg-purple-50",
    },
    {
        title: "পাসওয়ার্ড পরিবর্তন",
        href: "/settings/password-change",
        icon: UserRoundCog,
        iconColor: "text-red-500",
        bgColor: "bg-red-50",
    },
    {
        title: "ইউজার লিমিট",
        href: "/settings/user-limit",
        icon: TriangleAlert,
        iconColor: "text-indigo-500",
        bgColor: "bg-indigo-50",
    },
    {
        title: "ইউজার পারমিশন",
        href: "/settings/user-permission",
        icon: ShieldCheck,
        iconColor: "text-teal-500",
        bgColor: "bg-teal-50",
    },
    {
        title: "প্রিন্টার সেটিং",
        href: "/settings",
        icon: Printer,
        iconColor: "text-slate-500",
        bgColor: "bg-slate-100",
    },
     {
        title: "অ্যাপ ইনস্টল করুন",
        href: "/settings/install-app",
        icon: Download,
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-50",
    },
];

export default function SettingsMenu() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* Header */}
            <header className="h-[112px] bg-[#101827] px-4">
                <div className="mx-auto flex h-full max-w-[690px] items-center justify-between">
                    <div>
                        <h1 className="text-[20px] font-bold leading-none text-white">
                            সেটিংস
                        </h1>

                        <p className="mt-2 text-[10px] text-gray-400">
                            সফটওয়্যার কনফিগারেশন
                        </p>
                    </div>

                    <button
                        type="button"
                        className="
                            flex h-[46px] w-[46px]
                            items-center justify-center
                            rounded-[15px]
                            border border-white/10
                            bg-white/10
                            transition
                            hover:bg-white/15
                            active:scale-95
                        "
                    >
                        <Settings
                            size={24}
                            strokeWidth={2}
                            className="text-gray-300"
                        />
                    </button>
                </div>
            </header>

            {/* Menu */}
            <main className="mx-auto max-w-[690px] px-1 py-4">
                <div className="space-y-3">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.title}
                                href={`/dashboard${item.href}`}
                                className="
                                    group
                                    flex h-[65px] w-full
                                    items-center
                                    rounded-[16px]
                                    border border-slate-200/80
                                    bg-white
                                    px-3
                                    shadow-[0_1px_3px_rgba(15,23,42,0.04)]
                                    transition-all
                                    hover:border-slate-300
                                    hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)]
                                    active:scale-[0.99]
                                "
                            >
                                {/* Icon */}
                                <div
                                    className={`
                                        flex h-[42px] w-[42px]
                                        shrink-0
                                        items-center justify-center
                                        rounded-[14px]
                                        ${item.bgColor}
                                    `}
                                >
                                    <Icon
                                        size={21}
                                        strokeWidth={2}
                                        className={item.iconColor}
                                    />
                                </div>

                                {/* Title */}
                                <span
                                    className="
                                        ml-4
                                        flex-1
                                        text-left
                                        text-[14px]
                                        font-medium
                                        text-[#24304a]
                                    "
                                >
                                    {item.title}
                                </span>

                                {/* Arrow */}
                                <div
                                    className="
                                        flex h-[30px] w-[30px]
                                        items-center justify-center
                                        rounded-full
                                        bg-slate-50
                                        transition
                                        group-hover:bg-slate-100
                                    "
                                >
                                    <ChevronRight
                                        size={17}
                                        strokeWidth={1.7}
                                        className="text-slate-300"
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </main>
        </div>
    );
}