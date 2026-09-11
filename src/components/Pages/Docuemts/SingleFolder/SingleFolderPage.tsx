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
import {  useGetSingleFolderDocumentsQuery } from "@/redux/features/document.features";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomLoader from "@/components/Reusable/CustomLoader";
import UploadDocument from "../UploadDocument";
import ShowAllDocuments from "../ShowAllDocuments";
import { useRouter } from "next/navigation";

const SingleFolderPage = ({ id }: { id: string }) => {
    const [searchItems, setSearchItem] = useState("");
    const [openFolderModal, setOpenFolderModal] = useState<boolean>(false)
    const [orientation, setOrientation] = useState<
        "grid" | "list" | "image"
    >("grid");

    const {
        data,
        isLoading,
        isError,
        refetch,
  
    } = useGetSingleFolderDocumentsQuery(id, { refetchOnMountOrArgChange: true });
    const router = useRouter();

    const handleHome = () => {
        if (data?.data?.name) {
            router.back();
        }
    };

    const filteredDocuments = data?.data?.children?.filter((document: any) =>
    document?.name
        ?.toLowerCase()
        .includes(searchItems.toLowerCase())
);

    return (
        <div className="w-full bg-white rounded min-h-screen p-3">
            <div className="flex  w-full flex-col justify-center gap-3 rounded-2xl border border-[#e2e8f0] bg-white px-3 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:h-[74px] sm:min-h-0 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-0">
                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <button
                      onClick={handleHome}
                        className="flex cursor-pointer h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dfe3e8] bg-[#f8f9fa] text-[#a0a5ab] transition hover:bg-gray-100 sm:h-10 sm:w-10"
                    >
                        <ArrowLeft
                            size={19}

                        />
                    </button>
                    <button
                        onClick={handleHome}
                        className={`shrink-0 cursor-pointer rounded-full ${data?.data?.name ? "bg-green-600 text-white" : "bg-[#e8eef5]"} px-4 py-2 text-xs font-medium text-[#526174] sm:px-5 sm:text-sm`}
                    >
                        Home
                    </button>

                    {
                        data?.data?.name && <button
                            className="shrink-0 rounded-full bg-[#e8eef5] px-4 py-2 text-xs font-medium text-[#526174] sm:px-5 sm:text-sm"
                        >
                            {data?.data?.name}
                        </button>
                    }
                </div>

                {/* Bottom / Right Section */}
                <div className="flex w-full shrink-0 items-center gap-2 overflow-x-auto sm:w-auto sm:gap-3">
                    <SearchBar
                        value={searchItems}
                        onChange={(e) => setSearchItem(e.target.value)}
                        onClear={() => setSearchItem("")}
                    />

                    <div className="flex h-9 shrink-0 items-center rounded-xl bg-[#f1f4f8] p-1 sm:h-10">
                        <button
                            onClick={() => setOrientation("grid")}
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "grid"
                                ? "bg-white text-[#00a474] shadow-sm"
                                : "text-[#8290a1]"
                                }`}
                        >
                            <Grid2X2 size={16} />
                        </button>

                        {/* List */}
                        <button
                            onClick={() => setOrientation("list")}
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "list"
                                ? "bg-white text-[#00a474] shadow-sm"
                                : "text-[#8290a1]"
                                }`}
                        >
                            <List size={17} />
                        </button>

                        {/* Image */}
                        <button
                            onClick={() => setOrientation("image")}
                            className={`flex h-7 w-8 items-center justify-center rounded-lg sm:h-8 sm:w-9 ${orientation === "image"
                                ? "bg-white text-[#00a474] shadow-sm"
                                : "text-[#8290a1]"
                                }`}
                        >
                            <ImageIcon size={17} />
                        </button>
                    </div>

                    <UploadDocument refetch={refetch} />
                </div>
            </div>

            {
                isLoading ?
                    <CustomLoader cls="h-[50vh]" />
                    : isError ?
                        <CustomStatus type="error" />
                        : <ShowAllDocuments orientation={orientation} documents={filteredDocuments||[]} />
            }

            {openFolderModal &&
                <CreateFolderModal isOpen={openFolderModal} onClose={() => setOpenFolderModal(false)} />
            }
        </div>
    );
};

export default SingleFolderPage;