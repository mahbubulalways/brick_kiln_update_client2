"use client";

import CreateFolderModal from "@/components/Dashboard/Modals/CreateFolderModal";
import SearchBar from "@/components/Reusable/SearchBar";
import {
    ArrowLeft,
    Grid2X2,
    List,
    Image as ImageIcon,
    FolderPlus,
} from "lucide-react";
import { useState } from "react";
import ShowAllDocuments from "./ShowAllDocuments";
import UploadDocument from "./UploadDocument";
import { useGetAllDocumentsQuery } from "@/redux/features/document.features";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { useRouter } from "next/navigation";

const DocumentPage = () => {
    const [searchItems, setSearchItem] = useState("");
    const [openFolderModal, setOpenFolderModal] =
        useState<boolean>(false);

    const [orientation, setOrientation] = useState<
        "grid" | "list" | "image"
    >("grid");

    const router = useRouter();

    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetAllDocumentsQuery(undefined);

    const filteredDocuments = data?.data?.documents?.filter(
        (document: any) =>
            document?.name
                ?.toLowerCase()
                .includes(searchItems.toLowerCase()),
    );

    const storage = data?.data?.storage;

    const usedGB = Number(storage?.usedGB ?? 0);
    const limitGB = Number(storage?.limitGB ?? 0);
    const remainingGB = Number(storage?.remainingGB ?? 0);

    const storagePercentage =
        limitGB > 0
            ? Math.min((usedGB / limitGB) * 100, 100)
            : 0;

    return (
        <div className="min-h-screen w-full rounded bg-white p-3">
            <div className="flex w-full flex-col gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-[74px] sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-0">
                <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
                    <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                        <button
                            onClick={() => router.back()}
                            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#dfe3e8] bg-[#f8f9fa] text-[#a0a5ab] transition hover:bg-gray-100 sm:h-10 sm:w-10"
                        >
                            <ArrowLeft size={19} />
                        </button>

                        <button className="shrink-0 rounded-full bg-[#e8eef5] px-4 py-2 text-xs font-medium text-[#526174] sm:px-5 sm:text-sm">
                            Home
                        </button>
                    </div>

                    <div className="min-w-0 flex-1 sm:hidden">
                        <SearchBar
                            value={searchItems}
                            onChange={(e) =>
                                setSearchItem(e.target.value)
                            }
                            onClear={() => setSearchItem("")}
                        />
                    </div>
                </div>

                <div className="flex w-full shrink-0 items-center gap-2 overflow-x-auto sm:w-auto sm:gap-3">
                    <div className="hidden sm:block">
                        <SearchBar
                            value={searchItems}
                            onChange={(e) =>
                                setSearchItem(e.target.value)
                            }
                            onClear={() => setSearchItem("")}
                        />
                    </div>

                    <div className="flex h-9 shrink-0 items-center rounded-xl bg-[#f1f4f8] p-1 sm:h-10">
                        <button
                            onClick={() =>
                                setOrientation("grid")
                            }
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "grid"
                                    ? "bg-white text-[#00a474] shadow-sm"
                                    : "text-[#8290a1]"
                                }`}
                        >
                            <Grid2X2 size={16} />
                        </button>

                        <button
                            onClick={() =>
                                setOrientation("list")
                            }
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "list"
                                    ? "bg-white text-[#00a474] shadow-sm"
                                    : "text-[#8290a1]"
                                }`}
                        >
                            <List size={17} />
                        </button>

                        <button
                            onClick={() =>
                                setOrientation("image")
                            }
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "image"
                                    ? "bg-white text-[#00a474] shadow-sm"
                                    : "text-[#8290a1]"
                                }`}
                        >
                            <ImageIcon size={17} />
                        </button>
                    </div>

                    <button
                        onClick={() =>
                            setOpenFolderModal(true)
                        }
                        className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-[#d9dde3] bg-white px-3 text-xs font-medium text-[#4b5563] transition hover:bg-gray-50 sm:h-10 sm:gap-2 sm:px-4 sm:text-sm"
                    >
                        <FolderPlus size={16} />
                        <span>ফোল্ডার</span>
                    </button>

                    <UploadDocument refetch={refetch} />
                </div>
            </div>

            {!isLoading && !isError && (
                <div className="mt-3 rounded-2xl border border-[#e2e8f0] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-semibold text-[#263238]">
                                    স্টোরেজ ব্যবহার
                                </h3>

                                <span className="rounded-full bg-[#e9f8f2] px-2 py-0.5 text-[11px] font-semibold text-[#039A63]">
                                    {storagePercentage.toFixed(0)}%
                                </span>
                            </div>

                            <p className="mt-1 text-xs text-[#8290a1]">
                                {usedGB.toFixed(2)} GB ব্যবহৃত /{" "}
                                {limitGB.toFixed(2)} GB
                            </p>
                        </div>

                        <div className="text-left sm:text-right">
                            <p className="text-sm font-semibold text-[#039A63]">
                                {remainingGB.toFixed(2)} GB
                            </p>

                            <p className="text-[11px] text-[#8290a1]">
                                অবশিষ্ট
                            </p>
                        </div>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#edf1f4]">
                        <div
                            className="h-full rounded-full bg-[#039A63] transition-all duration-500"
                            style={{
                                width: `${storagePercentage}%`,
                            }}
                        />
                    </div>
                </div>
            )}

            {isLoading ? (
                <CustomLoader cls="h-[50vh]" />
            ) : isError ? (
                <CustomStatus type="error" />
            ) : (
                <ShowAllDocuments
                    orientation={orientation}
                    documents={filteredDocuments || []}
                />
            )}

            {openFolderModal && (
                <CreateFolderModal
                    isOpen={openFolderModal}
                    onClose={() =>
                        setOpenFolderModal(false)
                    }
                />
            )}
        </div>
    );
};

export default DocumentPage;