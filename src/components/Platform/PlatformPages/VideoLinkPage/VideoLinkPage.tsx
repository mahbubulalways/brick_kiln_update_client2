"use client";

import React, { useState } from "react";
import { FiExternalLink, FiPlus, FiTrash2 } from "react-icons/fi";

import {
    useDeleteYoutubeLinkApiMutation,
    useGetAllYoutubeLinksApiQuery,
} from "@/redux/system.features/system.youtube.link.features";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import { showToast } from "@/components/Toast/CustomToast";
import VideoLinkModal from "../../PlatformModals/VideoLinkModal";


const getYoutubeEmbedUrl = (url: string) => {
    try {
        const youtubeUrl = new URL(url);

        if (youtubeUrl.hostname.includes("youtu.be")) {
            const videoId = youtubeUrl.pathname.slice(1);

            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (youtubeUrl.hostname.includes("youtube.com")) {
            const videoId = youtubeUrl.searchParams.get("v");

            if (videoId) {
                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (youtubeUrl.pathname.startsWith("/shorts/")) {
                const videoId = youtubeUrl.pathname.split("/shorts/")[1];

                return `https://www.youtube.com/embed/${videoId}`;
            }

            if (youtubeUrl.pathname.startsWith("/embed/")) {
                return url;
            }
        }

        return url;
    } catch {
        return url;
    }
};

export default function VideoLinkPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetAllYoutubeLinksApiQuery({});

    const [deleteYoutubeLink, { isLoading: isDeleteLoading }] =
        useDeleteYoutubeLinkApiMutation();

    const youtubeLinks = data?.data || [];

    const handleDelete = async (id: string) => {
        try {
            const result = await deleteYoutubeLink(id).unwrap();

            if (result?.success) {
                showToast({
                    title: result.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }
        } catch (error: any) {
            ;

            showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
                type: "error",
                options: {
                    duration: 4000,
                    icon: <MdOutlineError className="h-5 w-5" />,
                },
            });
        }
    };

    return (
        <>
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800">
                            ভিডিও লিংক
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            সংরক্ষিত ইউটিউব ভিডিওগুলো দেখুন
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-[#039A63] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#027d50]"
                    >
                        <FiPlus className="h-4 w-4" />
                        ভিডিও যোগ করুন
                    </button>
                </div>

                {isLoading || isFetching ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#039A63]" />
                    </div>
                ) : youtubeLinks.length === 0 ? (
                    <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white">
                        <div className="text-center">
                            <p className="text-sm text-gray-500">
                                কোনো ভিডিও লিংক পাওয়া যায়নি
                            </p>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="mt-3 cursor-pointer text-sm font-medium text-[#039A63] hover:underline"
                            >
                                ভিডিও লিংক যোগ করুন
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {youtubeLinks.map((item: any) => (
                            <div
                                key={item.id}
                                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                            >
                                <div className="aspect-video w-full overflow-hidden bg-black">
                                    <iframe
                                        src={getYoutubeEmbedUrl(item.link)}
                                        title="YouTube video"
                                        className="h-full w-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>

                                <div className="space-y-3 p-4">
                                    <p
                                        className="truncate text-sm text-gray-500"
                                        title={item.link}
                                    >
                                        {item.link}
                                    </p>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-1 items-center justify-center gap-2 rounded-md border border-[#039A63] px-3 py-2 text-sm font-medium text-[#039A63] transition hover:bg-[#039A63] hover:text-white"
                                        >
                                            <FiExternalLink className="h-4 w-4" />
                                            ইউটিউবে দেখুন
                                        </a>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            disabled={isDeleteLoading}
                                            className="flex h-[38px] w-[42px] cursor-pointer items-center justify-center rounded-md bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <FiTrash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <VideoLinkModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
}