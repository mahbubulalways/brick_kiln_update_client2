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
        >{/* Watermark */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
            >
                <span
                    className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
                    style={{
                        fontSize: "170px",
                    }}
                >
                    {vataInformation?.shortForm
                        ?.split("")
                        .join(".")}
                </span>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-black">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    {/* Short Form */}
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </div>

                    {/* Owner Information */}
                    <div className="min-w-[150px] text-right leading-tight">
                        {vataInformation?.ownerName && (
                            <p className="text-[13px] font-bold">
                                প্রোঃ {vataInformation?.ownerName}
                            </p>
                        )}

                        {vataInformation?.ownerPhoneNumber && (
                            <p className="mt-0.5 text-[14px] font-bold">
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Vata Name */}
                <div className="mt-3 text-center">
                    <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
                        {vataInformation?.nameBangla}
                    </h1>

                    {vataInformation?.shortDescription && (
                        <p className="mt-1 text-[12px] font-semibold">
                            {vataInformation.shortDescription}
                        </p>
                    )}
                </div>

                {/* Address */}
                {(vataInformation?.additionalAddress ||
                    vataInformation?.address) && (
                        <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
                            {vataInformation?.additionalAddress}

                            {vataInformation?.additionalAddress &&
                                vataInformation?.address
                                ? " • "
                                : ""}

                            {vataInformation?.address}
                        </div>
                    )}

                {/* Contact Information */}
                {(vataInformation?.challanPersonOneName ||
                    vataInformation?.challanPersonTwoName ||
                    vataInformation?.challanManagerPhoneNumber) && (
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                            {vataInformation?.challanPersonOneName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation.challanPersonOneName}
                                    </span>
                                    :{" "}
                                    {vataInformation.challanPersonOnePhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonTwoName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonTwoPhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">
                                        ম্যানেজার
                                    </span>
                                    : {vataInformation?.challanManagerPhoneNumber}
                                </span>
                            )}
                        </div>
                    )}
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