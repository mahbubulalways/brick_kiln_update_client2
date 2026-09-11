"use client";

import { useState } from "react";
import {
    LayoutDashboard,
    Grid2X2,
    MapPin,
    TriangleAlert,
    CircleMinus,
    History,
    ExternalLink,
    Plus,
} from "lucide-react";
import AssetList from "./AssetList";
import AssetIssueList from "./AssetIssueList";
import DamagedAssetList from "./DamagedAssetList";
import LostAssetList from "./LostAssetList";
import AssetHistory from "./AssetHistory";
import NewProductEntryModal from "@/components/Dashboard/Modals/NewProductEntryModal";
import CreateNewIGoodsIssueModal from "@/components/Dashboard/Modals/CreateNewIGoodsIssueModal";
import { TQuery } from "@/interface/query";

const tabs = [
    // {
    //     id: "dashboard",
    //     title: "ড্যাশবোর্ড",
    //     icon: LayoutDashboard,
    // },
    {
        id: "assets",
        title: "স্টক তালিকা",
        icon: Grid2X2,
    },
    {
        id: "issues",
        title: "ইস্যু লিস্ট",
        icon: MapPin,
    },
    {
        id: "damaged",
        title: "নষ্ট আইটেম",
        icon: TriangleAlert,
        danger: true,
    },
    {
        id: "lost",
        title: "হারানো আইটেম",
        icon: CircleMinus,
        danger: true,
    },
    {
        id: "history",
        title: "হিস্ট্রি লগ",
        icon: History,
    },
];

export default function AssetsPage({ limit, page }: TQuery) {
    const [activeTab, setActiveTab] = useState("assets");
    const [openNewProduct, setOpenNewProduct] = useState<boolean>(false)
    const [openNewIssueModal, setOpenNewIssueModal] = useState<boolean>(false)
    const renderTabContent = () => {
        switch (activeTab) {
            // case "dashboard":
            //     return <AssetDashboard />;

            case "assets":
                return <AssetList />;

            case "issues":
                return <AssetIssueList />;

            case "damaged":
                return <DamagedAssetList />;

            case "lost":
                return <LostAssetList />;

            case "history":
                return <AssetHistory
                    limit={limit}
                    page={page}
                />;

            default:
                return <AssetList />;
        }
    };

    return (
        <div>

            {/* Main Container */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

                {/* ================= HEADER ================= */}
                <div className="flex flex-col gap-3 border-b border-gray-200 px-3 py-3 sm:px-5 sm:py-4 md:flex-row md:items-center md:justify-between">
                    {/* Logo / Title */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e9f8f2] sm:h-9 sm:w-9">
                            <Grid2X2 className="h-4 w-4 text-[#039A63] sm:h-5 sm:w-5" />
                        </div>

                        <h1 className="text-lg font-bold text-[#039A63] sm:text-2xl">
                            অ্যাসেট ম্যানেজমেন্ট
                        </h1>
                    </div>

                    {/* Header Buttons */}
                    <div className="flex w-full items-center gap-2 sm:gap-3 md:w-auto">
                        <button
                            onClick={() => setOpenNewIssueModal(true)}
                            type="button"
                            className="
        flex w-full items-center justify-center
        gap-2 rounded-lg
        border border-gray-300
        bg-white px-3 py-2
        text-xs font-medium text-gray-700
        transition hover:bg-gray-50
        sm:px-4 sm:text-sm
        md:w-auto
      "
                        >
                            <ExternalLink className="h-4 w-4" />
                            ইস্যু করুন
                        </button>

                        <button
                            onClick={() => setOpenNewProduct(true)}
                            type="button"
                            className="
        flex w-full items-center justify-center
        gap-2 rounded-lg
        bg-[#039A63]
        px-3 py-2
        text-xs font-medium text-white
        transition hover:bg-[#028653]
        sm:px-4 sm:text-sm
        md:w-auto
      "
                        >
                            <Plus className="h-4 w-4" />
                            নতুন স্টক
                        </button>
                    </div>
                </div>

                {/* ================= NAVIGATION ================= */}
                <div className="border-b border-gray-200 px-5">

                    <div className="flex items-center gap-1 overflow-x-auto">

                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive =
                                activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(tab.id)
                                    }
                                    className={`
                                        group relative flex shrink-0
                                        items-center gap-2
                                        px-4 py-3
                                        text-sm font-medium
                                        transition-all duration-200
                                        ${isActive
                                            ? "text-[#039A63]"
                                            : tab.danger
                                                ? "text-red-500 hover:text-red-600"
                                                : "text-gray-600 hover:text-gray-900"
                                        }
                                    `}
                                >
                                    <Icon
                                        className={`
                                            h-[17px] w-[17px]
                                            ${isActive
                                                ? "text-[#039A63]"
                                                : ""
                                            }
                                        `}
                                    />

                                    {tab.title}

                                    {/* Active underline */}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-[#039A63]" />
                                    )}
                                </button>
                            );
                        })}

                    </div>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-5">

                    {renderTabContent()}

                </div>

            </div>
            {openNewProduct &&
                <NewProductEntryModal
                    isOpen={openNewProduct}
                    onClose={() => setOpenNewProduct(false)}
                />
            }

            {openNewIssueModal &&
                <CreateNewIGoodsIssueModal
                    isOpen={openNewIssueModal}
                    onClose={() => setOpenNewIssueModal(false)}
                />
            }
        </div>
    );
}