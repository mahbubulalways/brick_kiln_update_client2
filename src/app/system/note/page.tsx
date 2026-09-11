"use client";

import { useState } from "react";
import { Bell, Edit3, FileText } from "lucide-react";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetNoteQuery } from "@/redux/system.features/system.note.features";
import NoteModal from "@/components/Platform/PlatformModals/NoteCreateModal";

export default function Page() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data: noteData,
        isLoading,
        isError,
    } = useGetNoteQuery(undefined);

    const note = noteData?.data;

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#039A63]/10 text-[#039A63]">
                        <Bell size={19} />
                    </div>

                    <div>
                        <h1 className="text-[16px] font-semibold text-gray-800">
                            অ্যাডমিন নোট
                        </h1>
                        <p className="text-[12px] text-gray-500">
                            ক্লায়েন্টের জন্য নোট পরিচালনা করুন
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="flex cursor-pointer items-center gap-1.5 rounded bg-[#039A63] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[#028755]"
                >
                    <Edit3 size={15} />
                    {note ? "নোট আপডেট করুন" : "নোট লিখুন"}
                </button>
            </div>

            {isLoading ? (
                <CustomLoader cls="h-[30vh]" />
            ) : isError ? (
                <CustomStatus type="error" />
            ) : note ? (
                <div className="rounded-lg border border-[#d8eee6] bg-white shadow-sm">
                    <div className="border-b border-[#e5eee9] bg-[#f5fbf8] px-4 py-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#039A63] text-white">
                                <FileText size={16} />
                            </div>

                            <div>
                                <span className="text-[11px] text-[#039A63]">
                                    ক্লায়েন্ট নোট
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-5">
                        <p className="whitespace-pre-line text-[14px] leading-7 text-gray-600">
                            {note.message}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex min-h-[250px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                        <FileText size={22} />
                    </div>

                    <h2 className="text-[14px] font-semibold text-gray-700">
                        কোনো নোট নেই
                    </h2>

                    <p className="mt-1 text-[12px] text-gray-400">
                        ক্লায়েন্টের জন্য একটি নোট লিখুন
                    </p>
                </div>
            )}

            <NoteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}