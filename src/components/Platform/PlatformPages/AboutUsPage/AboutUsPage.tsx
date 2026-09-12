"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { FiEdit3, FiSave } from "react-icons/fi";
import {
    useCreateAboutUsMutation,
    useGetAboutUsQuery,
} from "@/redux/system.features/system.about.features";

const AboutUsPage = () => {
    const editor = useRef(null);

    const [content, setContent] = useState("");

    const { data: aboutUsData, isLoading: isAboutUsLoading } =
        useGetAboutUsQuery(undefined);

    const [mutateAsync, { isLoading: isSaving }] =
        useCreateAboutUsMutation();

    useEffect(() => {
        if (aboutUsData?.data?.description) {
            setContent(aboutUsData.data.description);
        }
    }, [aboutUsData]);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "এখানে আমাদের সম্পর্কে লিখুন...",
            height: 400,
            toolbarAdaptive: false,
            showCharsCounter: true,
            showWordsCounter: true,
            showXPathInStatusbar: false,
            buttons: [
                "bold",
                "italic",
                "underline",
                "|",
                "ul",
                "ol",
                "|",
                "font",
                "fontsize",
                "brush",
                "|",
                "paragraph",
                "align",
                "|",
                "link",
                "image",
                "|",
                "undo",
                "redo",
                "|",
                "eraser",
                "fullsize",
            ],
        }),
        [],
    );

    const handleSubmit = async () => {
        try {
            await mutateAsync({
                description: content,
            }).unwrap();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAF9] p-4">
            <div className="mx-auto">
                <div className="mb-6">
                    <div className="mb-2 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63]">
                            <FiEdit3 className="text-xl" />
                        </div>

                        <div>
                            <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">
                                About Us
                            </h1>

                            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                                আপনার প্রতিষ্ঠানের সম্পর্কে বিস্তারিত তথ্য লিখুন
                            </p>
                        </div>
                    </div>
                </div>

                {aboutUsData?.data?.description && (
                    <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4 sm:px-6">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-[#039A63]" />

                                <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
                                    বর্তমান About Us
                                </h2>
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                                বর্তমানে যেই তথ্যটি প্রকাশিত আছে
                            </p>
                        </div>

                        <div className="px-5 py-5 sm:px-6">
                            <div
                                className="prose prose-sm max-w-none text-gray-600"
                                dangerouslySetInnerHTML={{
                                    __html: aboutUsData.data.description,
                                }}
                            />
                        </div>
                    </div>
                )}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4 sm:px-6">
                        <h2 className="text-sm font-semibold text-gray-800 sm:text-base">
                            {aboutUsData?.data ? "About Us আপডেট করুন" : "About Us Content"}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            নিচের editor ব্যবহার করে আপনার তথ্য লিখুন বা পরিবর্তন করুন।
                        </p>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="overflow-hidden rounded-xl border border-gray-200 focus-within:border-[#039A63]/50 focus-within:ring-2 focus-within:ring-[#039A63]/10">
                            {isAboutUsLoading ? (
                                <div className="flex h-[400px] items-center justify-center">
                                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#039A63]/20 border-t-[#039A63]" />
                                </div>
                            ) : (
                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    config={config}
                                    tabIndex={1}
                                    onBlur={(newContent) => setContent(newContent)}
                                    onChange={() => { }}
                                />
                            )}
                        </div>

                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSaving || isAboutUsLoading}
                                className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#039A63] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#028755] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        সংরক্ষণ হচ্ছে...
                                    </>
                                ) : (
                                    <>
                                        <FiSave className="text-base" />
                                        {aboutUsData?.data ? "আপডেট করুন" : "সংরক্ষণ করুন"}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;