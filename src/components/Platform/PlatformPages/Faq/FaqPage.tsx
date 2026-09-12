"use client";

import { useState } from "react";
import { FiEdit, FiPlus } from "react-icons/fi";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetFaqQuery } from "@/redux/system.features/system.faq.features";
import FaqModal from "../../PlatformModals/FaqModal";
import UpdateFaqModal from "../../PlatformModals/UpdateFaqModal";

export interface TFaq {
    id: string;
    title: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function FaqPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedFaq, setSelectedFaq] = useState<TFaq | null>(null);

    const { data: faqData, isLoading } = useGetFaqQuery(undefined);

    const faqs: TFaq[] = faqData?.data || [];

    const handleCreate = () => {
        setIsCreateModalOpen(true);
    };

    const handleEdit = (faq: TFaq) => {
        setSelectedFaq(faq);
        setIsUpdateModalOpen(true);
    };

    const handleCloseUpdate = () => {
        setIsUpdateModalOpen(false);
        setSelectedFaq(null);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[300px] items-center justify-center">
                <CustomLoader cls="h-[20vh]" />
            </div>
        );
    }

    return (
        <>
            <div className="w-full space-y-5">
                <div className="flex items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">
                            FAQ
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            সাধারণ প্রশ্ন ও উত্তরগুলো পরিচালনা করুন
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="flex items-center gap-2 rounded-md bg-[#039A63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#027f52]"
                    >
                        <FiPlus size={17} />
                        FAQ যোগ করুন
                    </button>
                </div>

                <div className="space-y-4">
                    {faqs.length === 0 ? (
                        <div className="rounded-lg bg-white px-5 py-12 text-center shadow-sm">
                            <CustomStatus
                                type="empty"
                                description="কোনো FAQ পাওয়া যায়নি"
                            />
                        </div>
                    ) : (
                        faqs.map((faq, index) => (
                            <div
                                key={faq.id}
                                className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm"
                            >
                                <div className="flex items-start justify-between gap-5">
                                    <div className="flex min-w-0 flex-1 gap-4">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#039A63]/10 text-sm font-bold text-[#039A63]">
                                            {index + 1}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-base font-semibold text-gray-800">
                                                {faq.title}
                                            </h2>

                                            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-600">
                                                {faq.description}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => handleEdit(faq)}
                                        className="flex shrink-0 items-center gap-2 rounded-md border border-[#039A63] px-3 py-2 text-xs font-semibold text-[#039A63] transition hover:bg-[#039A63] hover:text-white"
                                    >
                                        <FiEdit size={14} />
                                        Edit
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create FAQ Modal */}
            <FaqModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Update FAQ Modal */}
            {selectedFaq && (
                <UpdateFaqModal
                    isOpen={isUpdateModalOpen}
                    onClose={handleCloseUpdate}
                    faqData={selectedFaq}
                />
            )}
        </>
    );
}