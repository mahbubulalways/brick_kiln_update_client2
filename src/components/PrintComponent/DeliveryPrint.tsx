"use client";

import { TDeliveryWithCustomer } from "@/interface/delivery";
import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TDeliveryPrintProps = {
    deliveries: TDeliveryWithCustomer[];
    date?: Date;
    vataInformation: TVataInformation;
};

const DeliveryPrint = ({
    deliveries = [],
    date = new Date(),
    vataInformation,
}: TDeliveryPrintProps) => {

    const formatNumber = (
        value: number | null | undefined,
    ) => {
        return toBanglaNumber(
            Number(value ?? 0).toLocaleString(),
        );
    };


    const totalDelivery = deliveries.reduce(
        (total, row) =>
            total + Number(row.deliveryReceived ?? 0),
        0,
    );



    return (
        <div
            id="payment-page-print"
            className="w-full bg-white text-black"
        >

            <div className="text-center">
                <h1 className="text-[24px] font-bold leading-tight">
                    {vataInformation?.nameBangla}
                </h1>

                <p className="text-[14px] font-medium mt-1">
                    {vataInformation?.address}
                </p>

                <p className="text-[13px] mt-1">
                    {toBanglaNumber(
                        vataInformation?.challanManagerPhoneNumber || ""
                    )}
                </p>

                <p className="text-[12px]">
                    প্রোপ্রাইটরঃ {vataInformation?.ownerName}
                </p>
            </div>

            <div className="relative mt-4 flex min-h-[28px] items-center justify-between">
                <p className="text-[10px] font-semibold">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>

                <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#E5E7EB] px-12 py-1.5">
                    <p className="whitespace-nowrap text-[12px] font-bold leading-none">
                        দৈনিক ডেলিভারি তালিকা
                    </p>
                </div>


                <p className="text-[10px] font-bold">
                    মোট ডেলিভারি :{" "}
                    {formatNumber(totalDelivery)} টাকা
                </p>
            </div>



            <div className="mt-3">
                <table className="w-full border-collapse text-[9px] text-black">
                    <thead>
                        <tr className="bg-[#F1F2F3]">
                            <th className="w-[40px] border border-gray-300 px-1 py-1.5 text-center font-semibold">
                                ডে. নং
                            </th>

                            <th className="w-[75px] border border-gray-300 px-1 py-1.5 text-left font-semibold">
                                চালান
                            </th>

                            <th className="w-[120px] border border-gray-300 px-1 py-1.5 text-left font-semibold">
                                কাস্টমার
                            </th>

                            <th className="w-[120px] border border-gray-300 px-1 py-1.5 text-left font-semibold">
                                ঠিকানা
                            </th>

                            <th className="w-[60px] border border-gray-300 px-1 py-1.5 text-center font-semibold">
                                শ্রেণি
                            </th>

                            <th className="w-[70px] border border-gray-300 px-1 py-1.5 text-center font-semibold">
                                পরিমাণ
                            </th>

                            <th className="w-[80px] border border-gray-300 px-1 py-1.5 text-center font-semibold">
                                ডেলিভারি বাকি
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {deliveries.length > 0 ? (
                            deliveries.map(
                                (row: TDeliveryWithCustomer) => (
                                    <tr
                                        key={row.id}
                                        className="align-middle"
                                    >
                                        {/* Delivery No */}
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {toBanglaNumber(
                                                String(row.deliveryNo ?? "-"),
                                            )}
                                        </td>

                                        {/* Invoice */}
                                        <td className="border border-gray-300 px-1 py-1.5">
                                            {row.invoice?.serial ?? "-"}
                                        </td>

                                        {/* Customer */}
                                        <td className="border border-gray-300 px-1 py-1.5 font-medium">
                                            {row.invoice?.customer?.name ?? "-"}
                                        </td>

                                        {/* Address */}
                                        <td className="border border-gray-300 px-1 py-1.5">
                                            {row.invoice?.customer?.address ?? "-"}
                                        </td>

                                        {/* Class */}
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row.class ?? "-"}
                                        </td>

                                        {/* Delivered Quantity */}
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {formatNumber(row.deliveryReceived)}
                                        </td>

                                        {/* Remaining Quantity */}
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {formatNumber(row.deliveryRemaining)}
                                        </td>
                                    </tr>
                                ),
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={7}
                                    className="border border-gray-300 py-5 text-center text-gray-500"
                                >
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}

                        {/* Total */}
                        {deliveries.length > 0 && (
                            <tr className="bg-[#F1F2F3] font-semibold">
                                <td
                                    colSpan={5}
                                    className="border border-gray-300 px-1 py-1.5 text-right"
                                >
                                    সর্বমোট ডেলিভারি:
                                </td>

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    {formatNumber(totalDelivery)}
                                </td>

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    {formatNumber(
                                        deliveries.reduce(
                                            (total, row) =>
                                                total +
                                                Number(
                                                    row.deliveryRemaining ?? 0,
                                                ),
                                            0,
                                        ),
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>


            <div className="mt-12 grid grid-cols-2">
                <div className="text-center">
                    <div className="mx-auto w-[88px] border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[88px] border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        মালিক
                    </p>
                </div>
            </div>


            {/* <div className="mt-7 border-t border-gray-300 pt-2 text-center">
                <p className="text-[7px] text-gray-400">
                    রিপোর্ট প্রিন্টঃ{" "}
                    {formatBanglaDate({
                        date: new Date(),
                    })}{" "}
                    | Software by: Payratech.com
                </p>
            </div> */}
        </div>
    );
};

export default DeliveryPrint;