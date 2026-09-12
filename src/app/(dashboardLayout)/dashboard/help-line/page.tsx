"use client";

import React from "react";

import {
    FiGlobe,
    FiMail,
    FiPhone,
    FiArrowUpRight,
    FiHeadphones,
} from "react-icons/fi";

import CustomLoader from "@/components/Reusable/CustomLoader";

import { useGetHelpLineQuery } from "@/redux/system.features/syste.helpline.features";

interface THelpLine {
    id?: string;
    phoneNumber: string;
    website: string;
    email: string;
}

const HelpLinePage = () => {
    const {
        data,
        isLoading,
        isFetching,
    } = useGetHelpLineQuery(undefined);

    const helpLine: THelpLine | null = data?.data || null;

    if (isLoading || isFetching) {
        return <CustomLoader cls="h-[40vh]" />;
    }

    if (!helpLine) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center px-4">
                <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#039A63]/10 text-[#039A63]">
                        <FiHeadphones size={30} />
                    </div>

                    <h2 className="mt-5 text-xl font-bold text-gray-800">
                        হেল্পলাইন তথ্য পাওয়া যায়নি
                    </h2>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        বর্তমানে আমাদের হেল্পলাইন সংক্রান্ত কোনো তথ্য
                        পাওয়া যাচ্ছে না। প্রয়োজনে পরবর্তীতে আবার চেষ্টা করুন।
                    </p>
                </div>
            </div>
        );
    }

    return (
        <section className="relative overflow-hidden bg-white px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#039A63]/10 text-[#039A63]">
                        <FiHeadphones size={26} />
                    </div>

                    <p className="mt-5 text-sm font-semibold uppercase tracking-wider text-[#039A63]">
                        Customer Support
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        আমরা আছি আপনার পাশে
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
                        যেকোনো প্রশ্ন, সমস্যা বা সহযোগিতার প্রয়োজনে আমাদের
                        সাথে যোগাযোগ করুন। আমাদের টিম আপনাকে সহযোগিতা করতে
                        প্রস্তুত।
                    </p>
                </div>

                {/* Contact Cards */}
                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Phone */}
                    <a
                        href={`tel:${helpLine.phoneNumber}`}
                        className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039A63]/20 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63] transition group-hover:bg-[#039A63] group-hover:text-white">
                                <FiPhone size={22} />
                            </div>

                            <FiArrowUpRight
                                size={19}
                                className="text-gray-300 transition group-hover:text-[#039A63]"
                            />
                        </div>

                        <p className="mt-6 text-sm font-medium text-gray-500">
                            ফোন নম্বর
                        </p>

                        <p className="mt-1 break-all text-lg font-bold text-gray-800">
                            {helpLine.phoneNumber}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            সরাসরি কল করুন
                        </p>
                    </a>

                    {/* Email */}
                    <a
                        href={`mailto:${helpLine.email}`}
                        className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039A63]/20 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63] transition group-hover:bg-[#039A63] group-hover:text-white">
                                <FiMail size={22} />
                            </div>

                            <FiArrowUpRight
                                size={19}
                                className="text-gray-300 transition group-hover:text-[#039A63]"
                            />
                        </div>

                        <p className="mt-6 text-sm font-medium text-gray-500">
                            ইমেইল
                        </p>

                        <p className="mt-1 break-all text-lg font-bold text-gray-800">
                            {helpLine.email}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            ইমেইলে যোগাযোগ করুন
                        </p>
                    </a>

                    {/* Website */}
                    <a
                        href={helpLine.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#039A63]/20 hover:shadow-lg"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63] transition group-hover:bg-[#039A63] group-hover:text-white">
                                <FiGlobe size={22} />
                            </div>

                            <FiArrowUpRight
                                size={19}
                                className="text-gray-300 transition group-hover:text-[#039A63]"
                            />
                        </div>

                        <p className="mt-6 text-sm font-medium text-gray-500">
                            ওয়েবসাইট
                        </p>

                        <p className="mt-1 break-all text-lg font-bold text-gray-800">
                            {helpLine.website}
                        </p>

                        <p className="mt-2 text-xs text-gray-400">
                            ওয়েবসাইট ভিজিট করুন
                        </p>
                    </a>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 overflow-hidden rounded-2xl bg-[#039A63] px-6 py-7 text-center sm:px-10">
                    <div className="relative">
                        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10" />

                        <h2 className="relative text-xl font-bold text-white">
                            সাহায্যের প্রয়োজন?
                        </h2>

                        <p className="relative mx-auto mt-2 max-w-xl text-sm leading-6 text-white/80">
                            আপনার সমস্যার বিস্তারিত জানাতে আমাদের
                            হেল্পলাইনে যোগাযোগ করুন। আমরা দ্রুততম সময়ে
                            আপনাকে সহযোগিতা করার চেষ্টা করব।
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HelpLinePage;