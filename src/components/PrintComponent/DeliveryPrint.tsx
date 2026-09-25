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

            {/* Watermark */}
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
                            {vataInformation?.shortDescription}
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
                                        {vataInformation?.challanPersonOneName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonOnePhoneNumber}
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


            <div className="mt-12 grid grid-cols-3">
                <div className="text-center">
                    <div className="mx-auto w-[150px]  border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[150px]  border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        মালিক
                    </p>
                </div>

                <div className="text-center">
                    <div className="border-t border-black w-[150px] mx-auto" />
                    <p className="text-[10px] font-semibold mt-1">
                        অপারেটর
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