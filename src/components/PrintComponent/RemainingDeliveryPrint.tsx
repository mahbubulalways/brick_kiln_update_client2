"use client";

import { TVataInformation } from "@/interface/vata";
import { IChallanForDataShow } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import moment from "moment";

type TRemainingDeliveryPrintProps = {
    deliveries: IChallanForDataShow[];
    date?: Date;
    vataInformation: TVataInformation;
};

const RemainingDeliveryPrint = ({
    deliveries = [],
    date = new Date(),
    vataInformation,
}: TRemainingDeliveryPrintProps) => {
    const formatNumber = (value: number | null | undefined) => {
        return toBanglaNumber(
            Number(value ?? 0).toLocaleString(),
        );
    };

    const totalRemainingDelivery = deliveries.reduce(
        (total, row) =>
            total +
            (row.items?.reduce(
                (itemTotal, item) =>
                    itemTotal +
                    Math.max(
                        Number(item.quantity ?? 0) -
                        Number(item.delivered ?? 0),
                        0,
                    ),
                0,
            ) ?? 0),
        0,
    );

    return (
        <div
            id="remaining-delivery-page-print"
            className="w-full bg-white px-10 text-black"
        >
            <div className="text-center leading-tight">
                <h1 className="text-[18px] font-bold">
                    {vataInformation?.nameBangla}
                </h1>

                <p className="mt-[2px] text-[9px] font-medium">
                    {vataInformation?.address}
                </p>

                <p className="mt-[2px] text-[8px]">
                    মোবাইলঃ{" "}
                    {toBanglaNumber(
                        vataInformation?.challanManagerPhoneNumber || "",
                    )}
                </p>

                <p className="text-[8px]">
                    প্রোপ্রাইটরঃ {vataInformation?.ownerName}
                </p>
            </div>

            <div className="relative mt-3 flex min-h-[25px] items-center justify-between">
                <p className="text-[8px] font-semibold">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>

                <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#E5E7EB] px-8 py-1">
                    <p className="whitespace-nowrap text-[10px] font-bold leading-none">
                        অবশিষ্ট ডেলিভারি তালিকা
                    </p>
                </div>

                <p className="text-[8px] font-bold">
                    মোট ডে.বাকিঃ{" "}
                    {formatNumber(totalRemainingDelivery)}
                </p>
            </div>

            <div className="mt-2">
                <table className="w-full border-collapse text-[7.5px] text-black">
                    <thead>
                        <tr className="bg-[#F1F2F3]">
                            <th className="w-[38px] border border-gray-300 px-1 py-1 font-normal">
                                চালান নং
                            </th>

                            <th className="w-[75px] border border-gray-300 px-1 py-1 text-left font-normal">
                                কাস্টমার
                            </th>

                            <th className="w-[90px] border border-gray-300 px-1 py-1 text-left font-normal">
                                ঠিকানা
                            </th>

                            <th className="w-[55px] border border-gray-300 px-1 py-1 font-normal">
                                টাকা বাকি
                            </th>

                            <th className="border border-gray-300 px-1 py-1 text-left font-normal">
                                নোট
                            </th>

                            <th className="w-[50px] border border-gray-300 px-1 py-1 font-normal">
                                শ্রেণি
                            </th>

                            <th className="w-[50px] border border-gray-300 px-1 py-1 font-normal">
                                ক্রয়
                            </th>

                            <th className="w-[50px] border border-gray-300 px-1 py-1 font-normal">
                                ডেলিভারি
                            </th>

                            <th className="w-[55px] border border-gray-300 px-1 py-1 font-normal">
                                ডে.বাকি
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1 font-normal">
                                মোট ডে.বাকি
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1 font-normal">
                                ডে.তারিখ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {deliveries.length > 0 ? (
                            deliveries.map((row: IChallanForDataShow) => {
                                const totalRowRemaining =
                                    row.items?.reduce(
                                        (total: number, item) =>
                                            total +
                                            Math.max(
                                                Number(item.quantity ?? 0) -
                                                Number(item.delivered ?? 0),
                                                0,
                                            ),
                                        0,
                                    ) ?? 0;

                                return row.items?.map((item, index) => {
                                    const remaining = Math.max(
                                        Number(item.quantity ?? 0) -
                                        Number(item.delivered ?? 0),
                                        0,
                                    );

                                    return (
                                        <tr
                                            key={`${row.id}-${item.id}`}
                                            className="align-middle"
                                        >
                                            {index === 0 && (
                                                <>
                                                    <td
                                                        rowSpan={row.items.length}
                                                        className="border border-gray-300 px-1 py-1 text-center"
                                                    >
                                                        {toBanglaNumber(
                                                            String(
                                                                row.serial ?? "-",
                                                            ),
                                                        )}
                                                    </td>

                                                    <td
                                                        rowSpan={row.items.length}
                                                        className="border border-gray-300 px-1 py-1"
                                                    >
                                                        {row.customer?.name}
                                                    </td>

                                                    <td
                                                        rowSpan={row.items.length}
                                                        className="border border-gray-300 px-1 py-1"
                                                    >
                                                        {row.customer?.address}
                                                    </td>

                                                    <td
                                                        rowSpan={row.items.length}
                                                        className="border border-gray-300 px-1 py-1 text-center"
                                                    >
                                                        {formatNumber(
                                                            Number(
                                                                row.customer
                                                                    ?.totalPurchased ??
                                                                0,
                                                            ) -
                                                            Number(
                                                                row.customer
                                                                    ?.totalPaid ??
                                                                0,
                                                            ),
                                                        )}
                                                    </td>

                                                    <td
                                                        rowSpan={row.items.length}
                                                        className="border border-gray-300 px-1 py-1"
                                                    >
                                                        {row.note || "-"}
                                                    </td>
                                                </>
                                            )}

                                            <td className="border border-gray-300 px-1 py-1 text-center">
                                                {item.class || "-"}
                                            </td>

                                            <td className="border border-gray-300 px-1 py-1 text-center">
                                                {formatNumber(item.quantity)}
                                            </td>

                                            <td className="border border-gray-300 px-1 py-1 text-center">
                                                {formatNumber(item.delivered)}
                                            </td>

                                            <td className="border border-gray-300 px-1 py-1 text-center font-semibold">
                                                {formatNumber(remaining)}
                                            </td>

                                            {index === 0 && (
                                                <td
                                                    rowSpan={row.items.length}
                                                    className="border border-gray-300 px-1 py-1 text-center font-semibold"
                                                >
                                                    {formatNumber(
                                                        totalRowRemaining,
                                                    )}
                                                </td>
                                            )}

                                            <td className="border border-gray-300 px-1 py-1 text-center">
                                                {item.deliveryDate
                                                    ? toBanglaNumber(
                                                        moment(
                                                            item.deliveryDate,
                                                        ).format(
                                                            "DD-MM-YYYY",
                                                        ),
                                                    )
                                                    : "---"}
                                            </td>
                                        </tr>
                                    );
                                });
                            })
                        ) : (
                            <tr>
                                <td
                                    colSpan={11}
                                    className="border border-gray-300 py-5 text-center text-gray-500"
                                >
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}

                        {deliveries.length > 0 && (
                            <tr className="bg-[#F1F2F3] font-semibold">
                                <td
                                    colSpan={8}
                                    className="border border-gray-300 px-1 py-1 text-right"
                                >
                                    সর্বমোট অবশিষ্ট ডেলিভারিঃ
                                </td>

                                <td
                                    colSpan={3}
                                    className="border border-gray-300 px-1 py-1 text-center"
                                >
                                    {formatNumber(totalRemainingDelivery)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-10 grid grid-cols-2">
                <div className="text-center">
                    <div className="mx-auto w-[80px] border-t border-black" />
                    <p className="mt-1 text-[8px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[80px] border-t border-black" />
                    <p className="mt-1 text-[8px] font-semibold">
                        মালিক
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RemainingDeliveryPrint;