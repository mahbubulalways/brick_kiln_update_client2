import { TDeliveryResponse } from "@/interface/delivery";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

interface A4DeliveryPrintProps {
    delivery: TDeliveryResponse;
    vataInformation: TVataInformation;
    copyType?: "customer" | "office";
    compact?: boolean;
}

export default function A4DeliveryPrint({
    delivery,
    vataInformation,
    compact = false,
    copyType = "customer",
}: A4DeliveryPrintProps) {
    const isOffice = copyType === "office";

    const deliveryQuantity = Number(delivery?.deliveryReceived ?? 0);

    return (
        <div className="delivery-print-wrapper  w-full bg-[#FFFDF9] text-[#241209]">
            <div
                className={`delivery-paper relative mx-auto w-full overflow-hidden   ${compact
                    ? "px-3 py-2"
                    : "px-5 py-4 sm:px-7 sm:py-5"
                    }`}
            >
                {/* Watermark */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
                >
                    <span
                        className="rotate-[-18deg] whitespace-nowrap font-bold text-[#6E1D14] opacity-[0.04]"
                        style={{
                            fontSize: compact ? "110px" : "170px",
                        }}
                    >
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </span>
                </div>

                {/* Inner Border */}
                <div className="pointer-events-none absolute inset-[5px] border border-[#EFE3D0]" />

                <div className="relative z-10">
                    {/* Top Header */}
                    <div
                        className={`flex items-center justify-between ${compact ? "mb-1" : "mb-2"
                            }`}
                    >
                        <div
                            className={`flex items-center justify-center rounded border-2 border-[#8B3158] bg-[#F8E9EF] font-extrabold leading-none text-[#8B3158] ${compact
                                ? "h-8 w-[68px] text-[18px]"
                                : "h-10 w-[82px] text-[22px]"
                                }`}
                        >
                            {vataInformation?.shortForm
                                ?.split("")
                                .join(".")}
                        </div>

                        <div
                            className={`rounded-full bg-[#8B3158] text-center font-bold text-white ${compact
                                ? "px-5 py-1 text-[11px]"
                                : "px-6 py-1 text-sm sm:px-8 sm:text-lg"
                                }`}
                        >
                            ডেলিভারি
                        </div>

                        <div className="text-right leading-tight">
                            <p
                                className={`font-bold text-[#8B3158] ${compact
                                    ? "text-[8px]"
                                    : "text-[10px] sm:text-sm"
                                    }`}
                            >
                                প্রোঃ {vataInformation?.ownerName}
                            </p>

                            <p
                                className={`font-bold text-[#555] ${compact
                                    ? "text-[10px]"
                                    : "text-[12px] sm:text-lg"
                                    }`}
                            >
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        </div>
                    </div>

                    {/* Vata Name */}
                    <div
                        className={`text-center ${compact ? "mt-1" : "mt-2"
                            }`}
                    >
                        <h1
                            className={`font-extrabold leading-none tracking-tight text-[#8B3158] ${compact
                                ? "text-[26px]"
                                : "text-[30px] sm:text-[43px]"
                                }`}
                        >
                            {vataInformation?.nameBangla}
                        </h1>

                        <p
                            className={`font-medium text-[#8B3158] ${compact
                                ? "mt-0.5 text-[8px]"
                                : "mt-1 text-[9px] sm:text-[13px]"
                                }`}
                        >
                            {vataInformation?.shortDescription}
                        </p>
                    </div>

                    {/* Address */}
                    <div
                        className={`rounded-sm bg-[#8B3158] text-center font-semibold leading-tight text-white ${compact
                            ? "mt-1 px-3 py-1.5 text-[8px]"
                            : "mt-2 px-3 py-2 text-[9px] sm:text-[12px]"
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
                        className={`flex flex-wrap items-center justify-center text-center font-semibold text-[#8B3158] ${compact
                            ? "mt-1 gap-x-4 gap-y-0.5 text-[8px]"
                            : "mt-1.5 gap-x-5 gap-y-1 text-[9px] sm:text-[12px]"
                            }`}
                    >
                        {vataInformation?.challanPersonOneName && (
                            <span>
                                {vataInformation.challanPersonOneName}:{" "}
                                {
                                    vataInformation?.challanPersonOnePhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanPersonTwoName && (
                            <span>
                                {vataInformation.challanPersonTwoName}:{" "}
                                {
                                    vataInformation?.challanPersonTwoPhoneNumber
                                }
                            </span>
                        )}

                        {vataInformation?.challanManagerPhoneNumber && (
                            <span>
                                ম্যানেজারঃ{" "}
                                {vataInformation.challanManagerPhoneNumber}
                            </span>
                        )}
                    </div>

                    {/* Delivery Information */}
                    <div
                        className={`flex items-center justify-between border-y border-[#6E1D14] font-semibold text-[#6E1D14] ${compact
                            ? "mt-1 mb-1.5 py-1 text-[8px]"
                            : "mt-2 mb-2.5 py-1.5 text-[10px] sm:text-[12px]"
                            }`}
                    >
                        <div>
                            <span className="font-bold">চালান নং</span>
                            <span className="mx-1 text-[#A9793D]">|</span>
                            <span>
                                {toBanglaNumber(
                                    delivery?.invoice?.serial ?? "-",
                                )}
                            </span>
                        </div>

                        <div>
                            <span className="font-bold">ডেলিভারি নং</span>
                            <span className="mx-1 text-[#A9793D]">|</span>
                            <span>
                                {toBanglaNumber(
                                    delivery?.deliveryNo ?? "-",
                                )}
                            </span>
                        </div>

                        <div>
                            <span className="font-bold">তারিখ</span>
                            <span className="mx-1 text-[#A9793D]">|</span>
                            <span>
                                {delivery?.deliveryDate
                                    ? formatBanglaDate({
                                        date: delivery.deliveryDate,
                                    })
                                    : "-"}
                            </span>
                        </div>
                    </div>

                    {/* Customer / Driver Information */}
                    <div
                        className={`border border-[#E7D8C4] ${compact
                            ? "mb-1.5 p-1.5"
                            : "mb-3 p-2.5"
                            }`}
                    >
                        <div
                            className={`grid grid-cols-[55px_10px_1fr] items-end ${compact
                                ? "gap-y-1 text-[8px]"
                                : "gap-y-1.5 text-[10px] sm:text-[12px]"
                                }`}
                        >
                            <span className="font-bold text-[#6E1D14]">
                                নাম
                            </span>

                            <span className="text-center font-bold text-[#A9793D]">
                                :
                            </span>

                            <span className="min-h-[18px] border-b border-dotted border-[#B98858] font-semibold leading-[14px] text-[#3A150E]">
                                {delivery?.invoice?.customer?.name || "-"}
                            </span>

                            <span className="font-bold text-[#6E1D14]">
                                ঠিকানা
                            </span>

                            <span className="text-center font-bold text-[#A9793D]">
                                :
                            </span>

                            <span className="min-h-[18px] border-b border-dotted border-[#B98858] font-semibold leading-[14px] text-[#3A150E]">
                                {delivery?.invoice?.customer?.address || "-"}
                            </span>

                            <span className="font-bold text-[#6E1D14]">
                                মোবাইল
                            </span>

                            <span className="text-center font-bold text-[#A9793D]">
                                :
                            </span>

                            <span className="min-h-[18px] border-b border-dotted border-[#B98858] font-semibold leading-[14px] text-[#3A150E]">
                                {delivery?.invoice?.customer?.phoneNumber
                                    ? toBanglaNumber(
                                        delivery.invoice.customer.phoneNumber,
                                    )
                                    : "-"}
                            </span>

                            <span className="font-bold text-[#6E1D14]">
                                ড্রাইভার
                            </span>

                            <span className="text-center font-bold text-[#A9793D]">
                                :
                            </span>

                            <span className="min-h-[18px] border-b border-dotted border-[#B98858] font-semibold leading-[14px] text-[#3A150E]">
                                {delivery?.driver?.name || "-"}
                            </span>

                            <span className="font-bold text-[#6E1D14]">
                                গাড়ি নং
                            </span>

                            <span className="text-center font-bold text-[#A9793D]">
                                :
                            </span>

                            <span className="min-h-[18px] border-b border-dotted border-[#B98858] font-semibold leading-[14px] text-[#3A150E]">
                                {delivery?.carNo
                                    ? toBanglaNumber(delivery.carNo)
                                    : "-"}
                            </span>
                        </div>
                    </div>

                    {/* Delivery Table */}
                    <table
                        className={`w-full border-collapse border border-[#6E1D14] ${compact ? "text-[8px]" : "text-[10px] sm:text-[12px]"
                            }`}
                    >
                        <thead>
                            <tr className="bg-[#6E1D14] font-bold text-white">
                                <th
                                    className={`border border-[#6E1D14] text-center ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    চালান নং
                                </th>

                                <th
                                    className={`border border-[#6E1D14] text-center ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    শ্রেণি
                                </th>

                                <th
                                    className={`border border-[#6E1D14] text-center ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    পরিমাণ
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr>
                                <td
                                    className={`border border-[#E7D8C4] text-center font-semibold ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    {toBanglaNumber(
                                        delivery?.invoice?.serial ?? "-",
                                    )}
                                </td>

                                <td
                                    className={`border border-[#E7D8C4] text-center font-semibold ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    {delivery?.class || "-"}
                                </td>

                                <td
                                    className={`border border-[#E7D8C4] text-center font-bold text-[#6E1D14] ${compact
                                        ? "px-1.5 py-1"
                                        : "px-2.5 py-1.5"
                                        }`}
                                >
                                    {toBanglaNumber(deliveryQuantity)}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Quantity Highlight */}
                    <div
                        className={`flex justify-end ${compact ? "mt-1" : "mt-2"
                            }`}
                    >
                        <div
                            className={`border border-[#6E1D14] bg-[#F8E9EF] text-center font-bold text-[#6E1D14] ${compact
                                ? "px-4 py-1 text-[8px]"
                                : "px-6 py-1.5 text-[10px] sm:text-[12px]"
                                }`}
                        >
                            মোট ডেলিভারি:{" "}
                            <span className="text-[#8B3158]">
                                {toBanglaNumber(deliveryQuantity)}
                            </span>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div
                        className={`grid grid-cols-3 gap-5 ${compact ? "mt-5" : "mt-8"
                            }`}
                    >
                        <div className="text-center">
                            <div
                                className={`border-t border-dotted border-[#8C3A22] font-semibold text-[#6E1D14] ${compact
                                    ? "pt-0.5 text-[7px]"
                                    : "pt-1.5 text-[9px] sm:text-[11px]"
                                    }`}
                            >
                                কাস্টমারের স্বাক্ষর
                            </div>
                        </div>

                        <div className="text-center">
                            <div
                                className={`border-t border-dotted border-[#8C3A22] font-semibold text-[#6E1D14] ${compact
                                    ? "pt-0.5 text-[7px]"
                                    : "pt-1.5 text-[9px] sm:text-[11px]"
                                    }`}
                            >
                                ড্রাইভারের স্বাক্ষর
                            </div>
                        </div>

                        <div className="text-center">
                            <div
                                className={`border-t border-dotted border-[#8C3A22] font-semibold text-[#6E1D14] ${compact
                                    ? "pt-0.5 text-[7px]"
                                    : "pt-1.5 text-[9px] sm:text-[11px]"
                                    }`}
                            >
                                ম্যানেজারের স্বাক্ষর
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        className={`border-t border-[#E7D8C4] text-center ${compact
                            ? "mt-1.5 pt-0.5"
                            : "mt-2.5 pt-1.5"
                            }`}
                    >
                        <p
                            className={`font-medium italic text-[#8C3A22] ${compact ? "text-[7px]" : "text-[9px] sm:text-[10px]"
                                }`}
                        >
                            উপরোক্ত চালান অনুযায়ী মালামাল বুঝিয়া পাইলাম
                        </p>
                    </div>

                    <div
                        className={`mb-1 text-center  text-[#8B3158] ${compact
                            ? "px-2 py-0.5 text-[8px]"
                            : "px-2.5 py-1 text-[10px]"
                            }`}
                    >
                        {isOffice ? "অফিস কপি" : "কাস্টমার কপি"}
                    </div>
                </div>
            </div>

            <style jsx global>{`
    .delivery-paper {
        font-family:
            "Anek Bangla",
            "Noto Sans Bengali",
            "Hind Siliguri",
            sans-serif;
        box-sizing: border-box;
    }

    .delivery-print-wrapper {
        width: 100%;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
    }

    @media print {
        .delivery-print-wrapper,
        .delivery-paper {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
        }

        .delivery-paper {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
        }
    }
`}</style>
        </div>
    );
}