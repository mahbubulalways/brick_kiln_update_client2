"use client";

import React, { useState } from "react";

import { FiEdit3, FiMail, FiPhone, FiGlobe, FiPlus } from "react-icons/fi";

import CustomLoader from "@/components/Reusable/CustomLoader";


import { useGetHelpLineQuery } from "@/redux/system.features/syste.helpline.features";
import HelpLineModal from "../../PlatformModals/HelpLineModal";

interface THelpLine {
    id?: string;
    phoneNumber: string;
    website: string;
    email: string;
}

const HelpLinePage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetHelpLineQuery(undefined);

    const helpLine: THelpLine | null = data?.data || null;

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    if (isLoading || isFetching) {
        return <CustomLoader cls="h-[30vh]" />;
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">
                            হেল্পলাইন
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            আপনার সিস্টেমের হেল্পলাইন তথ্য পরিচালনা করুন
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpenModal}
                        className="flex cursor-pointer items-center gap-2 rounded-lg bg-[#039A63] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#027d50]"
                    >
                        {helpLine ? (
                            <>
                                <FiEdit3 size={17} />
                                আপডেট করুন
                            </>
                        ) : (
                            <>
                                <FiPlus size={17} />
                                হেল্পলাইন যোগ করুন
                            </>
                        )}
                    </button>
                </div>

                {helpLine ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-semibold text-gray-800">
                                হেল্পলাইন তথ্য
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                কাস্টমার সাপোর্টের জন্য ব্যবহৃত যোগাযোগের তথ্য
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-[#039A63]">
                                    <FiPhone size={20} />
                                </div>

                                <p className="text-xs font-medium text-gray-500">
                                    ফোন নম্বর
                                </p>

                                <p className="mt-1 text-base font-semibold text-gray-800">
                                    {helpLine.phoneNumber}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-[#039A63]">
                                    <FiMail size={20} />
                                </div>

                                <p className="text-xs font-medium text-gray-500">
                                    ইমেইল
                                </p>

                                <p className="mt-1 break-all text-base font-semibold text-gray-800">
                                    {helpLine.email}
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 p-5">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-[#039A63]">
                                    <FiGlobe size={20} />
                                </div>

                                <p className="text-xs font-medium text-gray-500">
                                    ওয়েবসাইট
                                </p>

                                <p className="mt-1 break-all text-base font-semibold text-gray-800">
                                    {helpLine.website}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-[#039A63]">
                            <FiPhone size={25} />
                        </div>

                        <h2 className="mt-4 text-lg font-semibold text-gray-800">
                            কোনো হেল্পলাইন তথ্য নেই
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            হেল্পলাইন তথ্য যোগ করতে নিচের বাটনে ক্লিক করুন।
                        </p>

                        <button
                            type="button"
                            onClick={handleOpenModal}
                            className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#039A63] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#027d50]"
                        >
                            <FiPlus size={17} />
                            হেল্পলাইন যোগ করুন
                        </button>
                    </div>
                )}
            </div>

            <HelpLineModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={helpLine}
            />
        </>
    );
};

export default HelpLinePage;