import { TDeliveryResponse } from "@/interface/delivery";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface POS80DeliveryPrintProps {
    delivery: TDeliveryResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

export default function POS80DeliveryPrint({
    delivery,
    vataInformation,
    compact = false,
    copyType = "customer",
}: POS80DeliveryPrintProps) {
    const isOffice = copyType === "office";

    const deliveryQuantity = Number(delivery?.deliveryReceived ?? 0);

    return (
        <div className="w-[80mm] text-black">
            <div
                className={`mx-auto w-full px-[2.5mm] ${compact ? "py-[1mm]" : "py-[2mm]"
                    }`}
            >
                {/* Header */}
                <div className="text-center">
                    {/* Copy Type */}
                    <div
                        className={`mx-auto inline-block border border-black px-2 py-0.5 font-bold ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        {isOffice ? "অফিস কপি" : "কাস্টমার কপি"}
                    </div>

                    {/* Delivery Title */}
                    <div
                        className={`font-extrabold leading-none ${compact
                            ? "mt-1 text-[15px]"
                            : "mt-1.5 text-[18px]"
                            }`}
                    >
                        ডেলিভারি
                    </div>

                    {/* Vata Name */}
                    <div
                        className={`font-extrabold leading-none ${compact
                            ? "mt-1 text-[15px]"
                            : "mt-1.5 text-[18px]"
                            }`}
                    >
                        {vataInformation?.nameBangla || "-"}
                    </div>

                    {/* Short Description */}
                    {vataInformation?.shortDescription && (
                        <div
                            className={`font-medium leading-none text-[#555] ${compact
                                ? "mt-0.5 text-[7px]"
                                : "mt-1 text-[8px]"
                                }`}
                        >
                            {vataInformation.shortDescription}
                        </div>
                    )}

                    {/* Address */}
                    <div
                        className={`rounded-sm border-y border-black text-center font-semibold leading-tight ${compact
                            ? "mt-1 px-1.5 py-1 text-[7px]"
                            : "mt-1.5 px-2 py-1.5 text-[8px]"
                            }`}
                    >
                        {vataInformation?.additionalAddress}

                        {vataInformation?.additionalAddress &&
                            vataInformation?.address
                            ? ", "
                            : ""}

                        {vataInformation?.address}
                    </div>

                    {/* Contact */}
                    <div
                        className={`flex items-center justify-center whitespace-nowrap text-center font-semibold leading-none ${compact
                            ? "mt-1 gap-x-1.5 text-[6.5px]"
                            : "mt-1.5 gap-x-2 text-[8px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonOneName}:{" "}
                                {
                                    vataInformation.challanPersonOnePhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span className="shrink-0">
                                {vataInformation.challanPersonTwoName}:{" "}
                                {
                                    vataInformation.challanPersonTwoPhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span className="shrink-0">
                                ম্যানেজারঃ{" "}
                                {vataInformation.challanManagerPhoneNumber}
                            </span>
                        )}
                    </div>
                </div>

                {/* Delivery Information */}
                <div
                    className={`border-y border-black ${compact ? "mt-1 py-1" : "mt-1.5 py-1.5"
                        }`}
                >
                    <div
                        className={`grid grid-cols-2 gap-x-2 gap-y-0.5 font-semibold leading-tight ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        <div>
                            চালান নং:{" "}
                            {toBanglaNumber(
                                delivery?.invoice?.serial ?? "-"
                            )}
                        </div>

                        <div className="text-right">
                            ডেলিভারি নং:{" "}
                            {toBanglaNumber(delivery?.deliveryNo ?? "-")}
                        </div>

                        <div className="col-span-2 text-center">
                            তারিখ:{" "}
                            {delivery?.deliveryDate
                                ? formatBanglaDate({
                                    date: delivery.deliveryDate,
                                })
                                : "-"}
                        </div>
                    </div>
                </div>

                {/* Customer / Driver Information */}
                <div
                    className={`border-b border-black ${compact ? "py-1.5" : "py-2"
                        }`}
                >
                    <div
                        className={`grid grid-cols-[38px_6px_1fr] gap-y-0.5 font-semibold leading-tight ${compact ? "text-[7px]" : "text-[8px]"
                            }`}
                    >
                        <span>নাম</span>
                        <span>:</span>
                        <span className="break-words">
                            {delivery?.invoice?.customer?.name || "-"}
                        </span>

                        <span>ঠিকানা</span>
                        <span>:</span>
                        <span className="break-words">
                            {delivery?.invoice?.customer?.address || "-"}
                        </span>

                        <span>মোবাইল</span>
                        <span>:</span>
                        <span>
                            {delivery?.invoice?.customer?.phoneNumber
                                ? toBanglaNumber(
                                    delivery.invoice.customer.phoneNumber
                                )
                                : "-"}
                        </span>

                        <span>ড্রাইভার</span>
                        <span>:</span>
                        <span>
                            {delivery?.driver?.name || "-"}
                        </span>

                        <span>গাড়ি নং</span>
                        <span>:</span>
                        <span>
                            {delivery?.carNo
                                ? toBanglaNumber(delivery.carNo)
                                : "-"}
                        </span>
                    </div>
                </div>

                {/* Delivery Table */}
                <table
                    className={`mt-1 w-full border-collapse border border-black ${compact ? "text-[7px]" : "text-[8px]"
                        }`}
                >
                    <thead>
                        <tr className="font-bold">
                            <th className="border border-black px-1 py-0.5 text-center">
                                চালান নং
                            </th>

                            <th className="border border-black px-1 py-0.5 text-center">
                                শ্রেণি
                            </th>

                            <th className="border border-black px-1 py-0.5 text-center">
                                পরিমাণ
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td className="border border-black px-1 py-1 text-center font-semibold">
                                {toBanglaNumber(
                                    delivery?.invoice?.serial ?? "-"
                                )}
                            </td>

                            <td className="border border-black px-1 py-1 text-center font-semibold">
                                {delivery?.class || "-"}
                            </td>

                            <td className="border border-black px-1 py-1 text-center font-bold">
                                {toBanglaNumber(deliveryQuantity)}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Total Delivery */}
                <div
                    className={`flex justify-end ${compact ? "mt-1" : "mt-1.5"
                        }`}
                >
                    <div
                        className={`border border-black text-center font-bold ${compact
                            ? "px-2 py-1 text-[7px]"
                            : "px-3 py-1 text-[8px]"
                            }`}
                    >
                        মোট ডেলিভারি:{" "}
                        <span className="font-extrabold">
                            {toBanglaNumber(deliveryQuantity)}
                        </span>
                    </div>
                </div>

                {/* Signatures */}
                <div
                    className={`grid grid-cols-3 gap-1 ${compact ? "mt-5" : "mt-7"
                        }`}
                >
                    <div className="text-center">
                        <div
                            className={`border-t border-dotted border-black font-semibold ${compact
                                ? "pt-0.5 text-[5px]"
                                : "pt-1 text-[7px]"
                                }`}
                        >
                            কাস্টমারের স্বাক্ষর
                        </div>
                    </div>

                    <div className="text-center">
                        <div
                            className={`border-t border-dotted border-black font-semibold ${compact
                                ? "pt-0.5 text-[5px]"
                                : "pt-1 text-[7px]"
                                }`}
                        >
                            ড্রাইভারের স্বাক্ষর
                        </div>
                    </div>

                    <div className="text-center">
                        <div
                            className={`border-t border-dotted border-black font-semibold ${compact
                                ? "pt-0.5 text-[5px]"
                                : "pt-1 text-[7px]"
                                }`}
                        >
                            ম্যানেজারের স্বাক্ষর
                        </div>
                    </div>
                </div>

                {/* Confirmation */}
                <div
                    className={`border-t border-black text-center ${compact ? "mt-1 pt-1" : "mt-1.5 pt-1"
                        }`}
                >
                    <p
                        className={`font-medium ${compact ? "text-[6px]" : "text-[7px]"
                            }`}
                    >
                        উপরোক্ত চালান অনুযায়ী মালামাল বুঝিয়া পাইলাম
                    </p>
                </div>

                {/* Footer */}
                <div
                    className={`border-t border-dashed border-black text-center ${compact ? "mt-1 pt-0.5" : "mt-1.5 pt-1"
                        }`}
                >
                    <span
                        className={`font-semibold ${compact ? "text-[6px]" : "text-[7px]"
                            }`}
                    >
                        ধন্যবাদ
                    </span>
                </div>
            </div>
        </div>
    );
}