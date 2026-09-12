"use client";

import { FiCheckCircle } from "react-icons/fi";

import { useGetAboutUsQuery } from "@/redux/system.features/system.about.features";

const AboutUs = () => {
    const { data, isLoading } = useGetAboutUsQuery(undefined);

    if (isLoading) {
        return (
            <section className="py-16">
                <div className="mx-auto max-w-6xl px-4">
                    <div className="flex justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#039A63]/20 border-t-[#039A63]" />
                    </div>
                </div>
            </section>
        );
    }

    if (!data?.data?.description) {
        return null;
    }

    return (
        <section className="bg-white py-16 sm:py-20 lg:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                    <div>
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#039A63]/10 px-4 py-2">
                            <FiCheckCircle className="text-[#039A63]" />

                            <span className="text-sm font-semibold text-[#039A63]">
                                আমাদের সম্পর্কে
                            </span>
                        </div>

                        <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl lg:text-5xl">
                            আপনার ইট ভাটার
                            <span className="text-[#039A63]"> ব্যবস্থাপনা হোক আরও সহজ</span>
                        </h2>

                        <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
                            আধুনিক প্রযুক্তির মাধ্যমে আপনার ইট ভাটার দৈনন্দিন কার্যক্রমকে
                            আরও সহজ, দ্রুত এবং সুশৃঙ্খলভাবে পরিচালনা করার জন্য আমরা কাজ করছি।
                        </p>

                        <div className="mt-7 flex flex-wrap gap-3">
                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    সহজ ব্যবস্থাপনা
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    সবকিছু এক জায়গায়
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    দ্রুত হিসাব
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    সময় ও পরিশ্রম সাশ্রয়
                                </p>
                            </div>

                            <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                <p className="text-sm font-semibold text-gray-800">
                                    নির্ভরযোগ্য তথ্য
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    সহজে তথ্য খুঁজে পাওয়া
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-3 rounded-3xl bg-[#039A63]/5" />

                        <div className="relative rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#039A63]/10">
                                    <FiCheckCircle className="text-xl text-[#039A63]" />
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Brick Management
                                    </h3>

                                    <p className="text-xs text-gray-500">
                                        Brick Kiln Management Software
                                    </p>
                                </div>
                            </div>

                            <div
                                className="prose prose-sm max-w-none text-gray-600 sm:prose-base
                  prose-headings:text-gray-900
                  prose-p:leading-8
                  prose-strong:text-gray-800
                  prose-li:leading-7"
                                dangerouslySetInnerHTML={{
                                    __html: data.data.description,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUs;