"use client";

import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { TDeliveryResponse } from "@/interface/delivery";
import { TVataInformation } from "@/interface/vata";
import { useGetSingleDeliveryQuery } from "@/redux/features/delivery.features";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import moment from "moment";
import { Dispatch, SetStateAction } from "react";

export type TDeliveryDetailsModal = {
    isOpen: boolean;
    onClose: () => void;
    setDeliveryId: Dispatch<SetStateAction<number | undefined>>;
    deliveryId: number | undefined;
};

const DeliveryDetailsModal = ({
    isOpen,
    onClose,
    deliveryId,
    setDeliveryId,
}: TDeliveryDetailsModal) => {
    const { data, isLoading, isError } = useGetSingleDeliveryQuery(deliveryId!, {
        refetchOnMountOrArgChange: true,
    });

    const { data: vataInfo, isLoading: vataLoading, isError: vataError } = useGetVataInfoQuery(undefined)
    const handleClose = () => {
        setDeliveryId(undefined);
        onClose();
    };

    const invoice: TDeliveryResponse = data?.data || ({} as TDeliveryResponse);
    const vataInformation = vataInfo?.data as TVataInformation

    // Date format
    const formatDate = (date: string | undefined) => {
        if (!date) return "-";

        return moment(date).format("DD-MM-YYYY").replace(/\d/g, (digit) => {
            return "০১২৩৪৫৬৭৮৯"[+digit];
        });
    };

    const formatTime = (date: string | undefined) => {
        if (!date) return "-";

        return moment(date).format("hh:mm A");
    };

    return (
        <CustomModalBottom
            isOpen={isOpen}
            onClose={handleClose}
            title="ডেলিভারি বিস্তারিত"
            width="xxl"
        >
            {isLoading || vataLoading ? (
                <CustomStatus type="loading" />
            ) : isError || vataError ? (<CustomStatus type="error" />) : (
                <div className="w-full">
                    {/* ================= HEADER ================= */}
                    <div className="mb-4 flex items-center justify-between">
                        <div>
                            <h2 className="text-[22px] font-medium text-emerald-600">
                                ডেলিভারি নং: {toBanglaNumber(invoice.deliveryNo)}
                            </h2>

                            <p className="mt-1 text-[15px] text-gray-500">
                                ডেলিভারি দিয়েছেন{" "}
                                <span className="font-medium text-orange-500">{invoice.deliveryBy.name}</span>
                            </p>
                        </div>

                        <div className="text-right">
                            <h2 className="text-[20px] font-medium text-emerald-500">
                                {vataInformation?.nameBangla}
                            </h2>

                            <p className="mt-1 text-[15px] text-gray-500">
                                {vataInformation?.address}
                            </p>
                        </div>
                    </div>

                    {/* ================= CUSTOMER INFO ================= */}
                    <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-2">
                        {/* Left Card */}
                        <div className="rounded-xl border border-gray-200 px-4 py-4">
                            <div className="grid grid-cols-[1fr_auto] gap-y-2 text-[15px]">
                                <span className="font-medium text-gray-700">নাম</span>
                                <span className="font-medium text-gray-800  text-end">
                                    {invoice?.invoice?.customer.name}
                                </span>

                                <span className="text-gray-500">ঠিকানা</span>
                                <span className="text-gray-700  text-end">    {invoice?.invoice?.customer.address}</span>

                                <span className="text-gray-500">মোবাইল</span>
                                <span className="text-gray-700  text-end"> {invoice?.invoice?.customer.phoneNumber}</span>
                            </div>
                        </div>

                        {/* Right Card */}
                        <div className="rounded-xl border border-gray-200 px-4 py-4">
                            <div className="grid grid-cols-[1fr_auto] gap-y-2 text-[15px]">
                                <span className="text-gray-500">চালান নং</span>
                                <span className="text-gray-700 text-end">
                                    {toBanglaNumber(invoice?.invoice?.serial)}
                                </span>

                                <span className="text-gray-500">চালানের তারিখ</span>
                                <span className="text-gray-700  text-end" >
                                    {formatDate(invoice.invoice?.challanDate)}
                                </span>

                                <span className="text-gray-500">ডেলিভারির তারিখ</span>
                                <span className="text-gray-700  text-end">
                                    {formatDate(invoice.invoice.deliveryDate)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ================= DELIVERY TABLE ================= */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 mt-5">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-200 text-[15px] text-gray-800">
                                    <th className="px-4 py-3 text-left font-normal">
                                        শ্রেণি
                                    </th>

                                    <th className="px-4 py-3 text-right font-normal">
                                        ইট ক্রয়
                                    </th>

                                    <th className="px-4 py-3 text-right font-normal">
                                        ডেলিভারি
                                    </th>

                                    <th className="px-4 py-3 text-right font-normal">
                                        বাকি
                                    </th>

                                    <th className="px-4 py-3 text-right font-normal">
                                        সময়
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t border-gray-200">
                                    <td className="px-4 py-3 text-left text-[15px] font-medium text-gray-700">
                                        {invoice.class || "-"}
                                    </td>

                                    <td className="px-4 py-3 text-right text-[15px] text-gray-700">
                                        {toBanglaNumber(invoice.quantity)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-[15px] font-semibold text-emerald-600">
                                        {toBanglaNumber(invoice.deliveryReceived)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-[15px] font-medium text-orange-500">
                                        {toBanglaNumber(invoice.deliveryRemaining)}
                                    </td>

                                    <td className="px-4 py-3 text-right text-[15px] text-gray-500">
                                        {formatTime(invoice.deliveryDate)}
                                    </td>
                                </tr>

                                {/* Total */}
                                <tr className="border-t border-gray-200">
                                    <td
                                        colSpan={2}
                                        className="px-4 py-3 text-right text-[15px] text-gray-600"
                                    >
                                        সর্বমোট
                                    </td>

                                    <td className="px-4 py-3 text-right text-[15px] font-semibold text-emerald-600">
                                        {toBanglaNumber(invoice.deliveryReceived)}
                                    </td>

                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* ================= DRIVER & CAR ================= */}
                    <div className="mt-5 rounded-xl border border-gray-200 px-4 py-4">
                        <h3 className="border-b border-gray-200 pb-2 text-[15px] font-semibold text-gray-700">
                            ড্রাইভার ও গাড়ি
                        </h3>

                        <div className="mt-3 flex items-center justify-between gap-6 text-[15px]">
                            {/* Driver Name */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">নাম:</span>
                                <span className="font-medium text-gray-700">
                                    {invoice?.driver?.name || "-"}
                                </span>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">ফোন:</span>
                                <span className="font-medium text-gray-700">
                                    {invoice?.driver?.PhoneNumber || "-"}
                                </span>
                            </div>

                            {/* Car No */}
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">গাড়ি নং:</span>
                                <span className="rounded-md bg-gray-100 px-3 py-1 font-medium text-gray-700">
                                    {invoice.carNo ? toBanglaNumber(invoice.carNo) : "-"}
                                </span>
                            </div>
                        </div>
                    </div>


                </div>
            )}
        </CustomModalBottom>
    );
};

export default DeliveryDetailsModal;