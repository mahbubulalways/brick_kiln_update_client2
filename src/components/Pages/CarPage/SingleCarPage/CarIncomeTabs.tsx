"use client";

import { useState } from "react";
import {
    HandCoins,
    ReceiptText,
    Wallet,
    BadgeDollarSign,
    History,
} from "lucide-react";

import CarIncome from "./Tabs/CarIncome";

const tabs = [
    {
        id: "income",
        name: "আয়",
        icon: HandCoins,
    },
    {
        id: "expense",
        name: "ব্যয়",
        icon: ReceiptText,
    },
    {
        id: "cash",
        name: "ক্যাশ",
        icon: Wallet,
    },
    {
        id: "due",
        name: "বাকি",
        icon: BadgeDollarSign,
    },
    {
        id: "history",
        name: "হিস্ট্রি",
        icon: History,
    },
];

const CarIncomeTabs = ({ id }: { id: string }) => {
    const [activeTab, setActiveTab] = useState("income");

    const renderContent = () => {
        switch (activeTab) {
            case "income":
                return <CarIncome id={id} />;

            case "expense":
                return <CarIncome id={id} />;

            case "cash":
                return <CarIncome id={id} />;

            case "due":
                return <CarIncome id={id} />;

            case "history":
                return <CarIncome id={id} />;

            default:
                return <CarIncome id={id} />;
        }
    };

    return (
        <div className="flex min-h-[70vh] h-full gap-4">
            {/* LEFT TABS */}
            <div className="w-[175px] shrink-0 self-stretch ">
                <div className="flex flex-col gap-2.5">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`group flex h-[92px] w-full shrink-0 items-center justify-center gap-3 rounded-xl border transition-all duration-200 ${isActive
                                        ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                                    }`}
                            >
                                <Icon
                                    className={`h-7 w-7 shrink-0 transition-colors ${isActive
                                            ? "text-white"
                                            : "text-slate-500 group-hover:text-emerald-600"
                                        }`}
                                    strokeWidth={2}
                                />

                                <span className="text-[21px] font-bold leading-none">
                                    {tab.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="min-w-0 flex-1">
                {renderContent()}
            </div>
        </div>
    );
};

export default CarIncomeTabs;