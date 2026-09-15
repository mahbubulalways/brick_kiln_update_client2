"use client";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { useGetSinglePaymentReportQuery } from "@/redux/features/payment.features";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { numberToBanglaWords } from "@/utils/numberToBanglaWord";
import { toBanglaNumber } from "@/utils/toBanglaNumber";


interface A4LedgerPrintProps {
    ledger: TPaymentResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

const A4LedgerPrint = ({
    ledger,
    vataInformation,
    copyType = "customer",
    compact = false,
}: A4LedgerPrintProps) => {
    return (
        <div className="delivery-print-wrapper  w-full bg-[#FFFDF9] text-[#241209]">
            <div
                className={`delivery-paper relative mx-auto w-full overflow-hidden   ${compact
                    ? "px-3 py-2"
                    : "px-5 py-4 sm:px-7 sm:py-5"
                    }`}
            >
                <div className="pointer-events-none absolute inset-[6px] border border-[#d9a7bd]" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-[82px] items-center justify-center border-[3px] border-[#8b3158] bg-[#f8e9ef] text-[22px] font-extrabold leading-none text-[#8b3158] sm:h-12 sm:w-[100px] sm:text-[28px]">
                                {vataInformation?.shortForm
                                    ?.split("")
                                    .join(".")}
                            </div>
                        </div>

                        <div className="rounded-full bg-[#8b3158] px-5 py-1 text-center text-sm font-bold text-white sm:px-8 sm:text-lg">
                            ক্যাশ ভাউচার
                        </div>

                        <div className="text-right leading-tight">
                            <p className="text-[11px] font-bold text-[#8b3158] sm:text-sm">
                                প্রোঃ {vataInformation?.ownerName}
                            </p>
                            <p className="text-[13px] font-bold text-[#555] sm:text-lg">
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        </div>
                    </div>

                    <div className="mt-2 text-center">
                        <h1 className="text-[25px] font-extrabold leading-none tracking-tight text-[#8b3158] sm:text-[43px] md:text-[42px]">
                            {vataInformation?.nameBangla}
                        </h1>

                        <p className="mt-2 text-[9px] font-medium text-[#8b3158] sm:text-[13px]">
                            {vataInformation?.shortDescription}
                        </p>
                    </div>

                    <div className="mt-2 rounded-sm bg-[#8b3158] px-3 py-2 text-center text-[8px] font-semibold leading-tight text-white sm:text-[12px]">
                        {vataInformation?.additionalAddress}, {vataInformation?.address}
                    </div>

                    <div className="mt-1.5 flex flex-wrap items-center text-[17px] justify-center gap-x-2 gap-y-0.5 text-center  font-semibold text-[#8b3158] ">
                        <span>
                            {vataInformation?.challanPersonOneName}:{" "}
                            {vataInformation?.challanManagerPhoneNumber}
                        </span>

                        <span>
                            {vataInformation?.challanPersonTwoName}:{" "}
                            {vataInformation?.challanPersonTwoPhoneNumber}
                        </span>

                        <span>
                            ম্যানেজারঃ {vataInformation?.challanManagerPhoneNumber}
                        </span>
                    </div>

                    <div className="mt-1 flex items-center justify-end text-[8px] sm:text-[12px]">
                        <div>
                            <span className="font-semibold text-[#8b3158]">তারিখঃ</span>{" "}
                            <span className="font-medium">{formatBanglaDate({ date: ledger?.paymentDate })}</span>
                        </div>

                    </div>

                    <div className="mt-1 grid grid-cols-[70px_1fr_55px_110px] items-end  text-[9px] sm:grid-cols-[90px_1fr_65px_150px] sm:text-[12px]">
                        <div className="">ক্রমিক নংঃ</div>
                        <div className="pb-0.5 font-medium">
                            {toBanglaNumber(ledger?.serial)}
                        </div>

                    </div>

                    <div className="grid grid-cols-[70px_1fr] items-end  text-[9px] sm:grid-cols-[90px_1fr] sm:text-[12px]">
                        <div className="font-semibold text-[#555]">নামঃ</div>
                        <div className="min-h-[22px] border-b border-dotted border-[#777] font-semibold">
                            {ledger?.ledger?.name}
                        </div>
                    </div>

                    <div className="grid grid-cols-[70px_1fr] items-end  text-[9px] sm:grid-cols-[90px_1fr] sm:text-[12px]">
                        <div className="font-semibold text-[#555]">ঠিকানাঃ</div>
                        <div className="min-h-[22px] border-b border-dotted border-[#777] font-semibold">
                            {ledger?.address}
                        </div>
                    </div>

                    <div className="mt-1 overflow-hidden border border-[#777]">
                        <div className="grid grid-cols-[1fr_105px_75px] bg-[#8b3158] text-center text-[9px] font-bold text-white sm:grid-cols-[1fr_145px_100px] sm:text-[13px]">
                            <div className="border-r border-[#c995aa] py-1">
                                বিবরণ
                            </div>
                            <div className="border-r border-[#c995aa] py-1">
                                টাকা
                            </div>
                            <div className="py-1">
                                পয়সা
                            </div>
                        </div>

                        <div className="grid min-h-[115px] grid-cols-[1fr_105px_75px] sm:min-h-[190px] sm:grid-cols-[1fr_145px_100px]">
                            <div
                                className="border-r border-[#777] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_28px,#999_29px,#999_30px)] p-2 text-[10px] font-semibold sm:text-[14px]"
                            >
                                <div className="mt-1">
                                    {ledger?.paymentDetails}
                                </div>
                            </div>

                            <div className="border-r border-[#777] bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_28px,#999_29px,#999_30px)] text-right text-[11px] font-semibold sm:text-[15px]">
                                <div className="pr-3 pt-1">
                                    ৳{toBanglaNumber(ledger?.payment)}
                                </div>
                            </div>

                            <div className="bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_28px,#999_29px,#999_30px)] text-right text-[11px] font-semibold sm:text-[15px]">
                                <div className="pr-2 pt-1">

                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-[1fr_105px_75px]  sm:grid-cols-[1fr_145px_100px]">
                            <div className="border-r border-[#777] px-2 py-1 text-[9px] font-bold sm:text-[13px]">
                                মোট
                            </div>

                            <div className="border-r border-[#777] px-2 py-1 text-right text-[11px] font-bold sm:text-[15px]">
                                ৳{toBanglaNumber(ledger?.payment)}
                            </div>

                            <div className="px-2 py-1 text-right text-[11px] font-bold sm:text-[15px]">

                            </div>
                        </div>
                    </div>
                    <div className="pt-4">
                        <div className="text-xs font-semibold text-[#8b3158]">
                            কথায়: {numberToBanglaWords(ledger?.payment)} টাকা মাত্র
                        </div>

                        <div className="mt-1 border-b border-dotted border-gray-500" />
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-3">
                        <div className="flex-1 text-center">
                            <div className="mx-auto h-7 max-w-[180px] border-b border-dotted border-[#555] sm:h-10 sm:max-w-[250px]" />
                            <p className="mt-1 text-[8px] font-semibold text-[#555] sm:text-[11px]">
                                গ্রহীতার স্বাক্ষর
                            </p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="mx-auto h-7 max-w-[180px] border-b border-dotted border-[#555] sm:h-10 sm:max-w-[250px]" />
                            <p className="mt-1 text-[8px] font-semibold text-[#555] sm:text-[11px]">
                                ম্যানেজার
                            </p>
                        </div>

                        <div className="flex-1 text-center">
                            <div className="mx-auto h-7 max-w-[180px] border-b border-dotted border-[#555] sm:h-10 sm:max-w-[250px]" />
                            <p className="mt-1 text-[8px] font-semibold text-[#555] sm:text-[11px]">
                                মালিক
                            </p>
                        </div>
                    </div>

                    <div className="mt-1 border-t border-[#8b3158] pt-1 text-center">
                        <p className="text-[7px] font-semibold text-[#777] sm:text-[10px]">
                            টাকা বুঝিয়া পাইলাম
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .ledger-paper {
          font-family:
            "Anek Bangla",
            "Noto Sans Bengali",
            "Hind Siliguri",
            sans-serif;
        }

        @media screen and (max-width: 480px) {
          .ledger-print-wrapper {
            padding: 4px;
          }

          .ledger-paper {
            border-width: 2px;
            padding: 8px;
          }

          .ledger-paper h1 {
            font-size: 19px;
          }
        }
      `}</style>
        </div>
    );
};

export default A4LedgerPrint;