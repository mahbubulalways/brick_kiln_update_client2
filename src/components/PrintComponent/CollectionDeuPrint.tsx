"use client";

import { IDueResponse } from "@/interface/due";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TCollectionDeuPrintProps = {
    dues: IDueResponse[];
    date?: Date;
    vataInformation: TVataInformation;
};

const CollectionDeuPrint = ({
    dues = [],
    date = new Date(),
    vataInformation,
}: TCollectionDeuPrintProps) => {
    // ================= TOTAL =================

    const totalCollect = dues.reduce(
        (sum, item) => sum + Number(item?.collect || 0),
        0
    );



    return (
        <div
            id="unload-page-print"
            className="w-full bg-white text-black px-5 py-4"
        >
            {/* =====================================================
                HEADER
            ====================================================== */}
            <div className="text-center">
                <h1 className="text-[24px] font-bold leading-tight">
                    {vataInformation?.nameBangla}
                </h1>

                <p className="text-[13px] leading-tight mt-1">
                    {vataInformation?.address}
                </p>

                <p className="text-[12px] leading-tight mt-1">
                    {toBanglaNumber(
                        vataInformation?.challanManagerPhoneNumber || ""
                    )}
                </p>

                <p className="text-[11px] leading-tight">
                    প্রোপ্রাইটরঃ {vataInformation?.ownerName}
                </p>
            </div>
            <div className="relative flex items-center justify-between mt-4 min-h-[30px]">
                <p className="text-[11px] font-medium leading-none whitespace-nowrap">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#e5e7eb] rounded-full px-8 py-[5px] min-w-[200px] text-center">
                    <p className="text-[14px] font-bold leading-none whitespace-nowrap">
                        দৈনিক বাকি আদায়
                    </p>
                </div>
                <p className="text-[11px] font-bold leading-none whitespace-nowrap">
                    মোট আদায়ঃ {toBanglaNumber(totalCollect.toLocaleString())}
                </p>
            </div>

            <table className="w-full border-collapse mt-2 text-[10px]">
                <thead>
                    <tr className="bg-[#f1f2f3]">
                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            নং
                        </th>
                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            জমা তারিখ
                        </th>

                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-left whitespace-nowrap">
                            কাস্টমার  নাম
                        </th>

                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-left whitespace-nowrap">
                            ঠিকানা
                        </th>

                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            পূর্বের বাকি
                        </th>

                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            জমা
                        </th>

                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            বাকি
                        </th>
                        <th className="border border-gray-300 font-normal py-[4px] px-1 text-center whitespace-nowrap">
                            নতুন তারিখ
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {dues?.length > 0 ? (
                        <>
                            {dues.map((item, index) => (
                                <tr
                                    key={item?.id}
                                    className="font-normal"
                                >
                                    <td className="border border-gray-300 py-[4px] px-1 text-center whitespace-nowrap">
                                        {toBanglaNumber(index + 1)}
                                    </td>
                                    <td className="border border-gray-300 py-[4px] px-1 text-center whitespace-nowrap">
                                        {formatBanglaDate({ date: item.createdAt })}
                                    </td>

                                    <td className="border border-gray-300 py-[4px] px-1">
                                        {item?.customer?.name || "-"}
                                    </td>
                                    <td className="border border-gray-300 py-[4px] px-1">
                                        {item?.customer.address || "-"}
                                    </td>
                                    <td className="border border-gray-300 py-[4px] px-1 text-center">
                                        {toBanglaNumber(
                                            Number(
                                                item?.due || 0
                                            ).toLocaleString()
                                        )}
                                    </td>

                                    <td className="border border-gray-300 py-[4px] px-1 text-center text-green-600 font-semibold">
                                        {toBanglaNumber(
                                            Number(
                                                item?.collect || 0
                                            ).toLocaleString()
                                        )}
                                    </td>

                                    <td className="border border-gray-300 py-[4px] px-1 text-center text-red-600 font-semibold">
                                        {toBanglaNumber(
                                            Number(
                                                item?.newDue || 0
                                            ).toLocaleString()
                                        )}
                                    </td>
                                    <td className="border border-gray-300 py-[4px] px-1 text-center text-red-600 font-semibold">
                                        {formatBanglaDate({ date: item.nextDate })}
                                    </td>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={6}
                                className="border border-gray-300 py-4 text-center text-gray-500"
                            >
                                কোনো তথ্য পাওয়া যায়নি
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="grid grid-cols-2 mt-14">
                {/* Manager */}
                <div className="text-center">
                    <div className="border-t border-black w-[85px] mx-auto" />

                    <p className="text-[10px] font-semibold mt-1">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="border-t border-black w-[85px] mx-auto" />

                    <p className="text-[10px] font-semibold mt-1">
                        মালিক
                    </p>
                </div>
            </div>
            {/* <div className="border-t border-gray-300 mt-8 pt-2 text-center">
                <p className="text-[7px] text-gray-400">
                    রিপোর্ট প্রিন্টঃ{" "}
                    {formatBanglaDate({
                        date: new Date(),
                        showTime: true,
                    })}{" "}
                    | Software by: Payratech.com
                </p>
            </div> */}
        </div>
    );
};

export default CollectionDeuPrint;