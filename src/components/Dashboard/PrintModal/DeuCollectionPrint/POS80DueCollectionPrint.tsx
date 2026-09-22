"use client";

import { IDueResponse } from "@/interface/due";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface POS80DueCollectionPrintProps {
    dueInfo: IDueResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
}

export default function POS80DueCollectionPrint({
    dueInfo,
    vataInformation,
    copyType = "customer",
}: POS80DueCollectionPrintProps) {
    const due = Number(dueInfo?.due ?? 0);
    const collect = Number(dueInfo?.collect ?? 0);
    const currentDue = due - collect;

    return (
        <div className="pos-due-print w-full bg-white text-black">
            <div className="mx-auto w-[80mm] px-3 py-3">
                <div className="text-center">
                    <div className="text-lg font-black text-emerald-700">
                        {vataInformation?.shortForm?.split("").join(".")}
                    </div>

                    <h1 className="mt-1 text-xl font-black">
                        {vataInformation?.nameBangla}
                    </h1>

                    <p className="mt-1 text-[10px]">
                        {vataInformation?.shortDescription}
                    </p>

                    <p className="mt-1 text-[10px]">
                        {vataInformation?.additionalAddress}
                        {vataInformation?.additionalAddress &&
                            vataInformation?.address
                            ? ", "
                            : ""}
                        {vataInformation?.address}
                    </p>

                    <p className="mt-1 text-[10px]">
                        {vataInformation?.ownerPhoneNumber}
                    </p>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                <div className="text-center">
                    <h2 className="text-lg font-black">জমা রশিদ</h2>
                    <p className="text-[10px] font-bold">
                        {copyType === "office" ? "অফিস কপি" : "কাস্টমার কপি"}
                    </p>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between">
                        <span>কাস্টমার আইডি</span>
                        <span>
                            {toBanglaNumber(
                                dueInfo?.customer?.customerCode ?? "-"
                            )}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>নাম</span>
                        <span>{dueInfo?.customer?.name || "-"}</span>
                    </div>

                    <div className="flex justify-between">
                        <span>মোবাইল</span>
                        <span>
                            {dueInfo?.customer?.phoneNumber
                                ? toBanglaNumber(
                                    dueInfo.customer.phoneNumber
                                )
                                : "-"}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>জমার তারিখ</span>
                        <span>
                            {formatBanglaDate({
                                date: dueInfo?.createdAt,
                                showTime: false,
                            })}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>সময়</span>
                        <span>
                            {formatBanglaDate({
                                date: dueInfo?.createdAt,
                                showTime: true,
                                showDate: false,
                            })}
                        </span>
                    </div>
                </div>

                <div className="my-2 border-t border-dashed border-black" />

                <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                        <span>মোট বাকি ছিল</span>
                        <span>
                            ৳ {toBanglaNumber(due.toLocaleString("en-IN"))}
                        </span>
                    </div>

                    <div className="flex justify-between font-bold">
                        <span>জমা দেওয়া</span>
                        <span>
                            ৳ {toBanglaNumber(collect.toLocaleString("en-IN"))}
                        </span>
                    </div>

                    <div className="border-t border-black" />

                    <div className="flex justify-between font-black">
                        <span>বর্তমান বাকি</span>
                        <span>
                            ৳{" "}
                            {toBanglaNumber(
                                currentDue.toLocaleString("en-IN")
                            )}
                        </span>
                    </div>
                </div>

                <div className="my-3 border-2 border-emerald-700 px-2 py-2 text-center">
                    <p className="text-[10px] font-bold">
                        জমা দেওয়া হয়েছে
                    </p>

                    <p className="text-xl font-black text-emerald-700">
                        ৳ {toBanglaNumber(collect.toLocaleString("en-IN"))}
                    </p>
                </div>

                <div className="text-[9px] leading-4">
                    <p className="font-bold underline">
                        বিশেষ দ্রষ্টব্যঃ
                    </p>

                    <p>
                        ১। চালান অথবা রশিদ ছাড়া কোনো লেনদেন করবেন না।
                    </p>

                    <p>
                        ২। স্বাক্ষর করার পূর্বে টাকার পরিমাণ ও তারিখ দেখে নিন।
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-4 text-center text-[9px]">
                    <div>
                        <div className="border-t border-black" />
                        <p className="mt-1">গ্রাহকের স্বাক্ষর</p>
                    </div>

                    <div>
                        <div className="border-t border-black" />
                        <p className="mt-1">ম্যানেজারের স্বাক্ষর</p>
                    </div>
                </div>

                <div className="mt-3 border-t border-dashed border-black pt-2 text-center text-[9px]">
                    লেনদেনের জন্য এই রশিদটি সংরক্ষণ করুন
                </div>
            </div>

            <style jsx global>{`
        .pos-due-print {
          font-family:
            "Anek Bangla",
            "Noto Sans Bengali",
            "Hind Siliguri",
            sans-serif;
        }

        @media print {
          .pos-due-print {
            width: 80mm !important;
            max-width: 80mm !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
        </div>
    );
}