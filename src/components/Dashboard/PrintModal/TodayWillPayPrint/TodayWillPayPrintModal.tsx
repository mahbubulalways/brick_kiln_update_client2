"use client";

import CustomNormalModal from "@/components/Reusable/CustomNormalModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { TVataInformation } from "@/interface/vata";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { IChallanForDataShow, ICustomer } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { FileText } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type PaymentRow = {
    challans: IChallanForDataShow[];
} & ICustomer;

export type TTodayWillPayPrintModal = {
    isOpen: boolean;
    onClose: () => void;
    dues: PaymentRow[];
};

const TodayWillPayPrintModal = ({
    isOpen,
    onClose,
    dues,
}: TTodayWillPayPrintModal) => {
    const {
        data: vataInfo,
        isLoading,
        isError,
    } = useGetVataInfoQuery(undefined);

    const vataInformation =
        vataInfo?.data as TVataInformation;

    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: "বাকি জমা দেওয়ার লিস্ট",
    });

    const totalCredit =
        dues?.reduce(
            (sum: number, row: PaymentRow) =>
                sum +
                (Number(row?.totalPurchased || 0) -
                    Number(row?.totalPaid || 0)),
            0
        ) || 0;

    const totalDeliveryDue =
        dues?.reduce(
            (total: number, row: PaymentRow) => {
                const deliveryDue =
                    row?.challans?.reduce(
                        (accChallan, challan) => {
                            const itemsSum =
                                challan?.items?.reduce(
                                    (accItem, curr) =>
                                        accItem +
                                        ((curr?.quantity ?? 0) -
                                            (curr?.delivered ?? 0)),
                                    0
                                ) ?? 0;

                            return accChallan + itemsSum;
                        },
                        0
                    ) || 0;

                return total + deliveryDue;
            },
            0
        ) || 0;

    const handleClose = () => {
        onClose();
    };

    return (
        <CustomNormalModal
            isOpen={isOpen}
            onClose={handleClose}
            width="xxl"
        >
            {isLoading ? (
                <CustomStatus type="loading" />
            ) : isError ? (
                <CustomStatus type="error" />
            ) : (
                <>
                    <div className="mb-3 flex justify-end gap-2 print:hidden">
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm text-white"
                        >
                            <FileText size={16} />
                            প্রিন্ট করুন
                        </button>

                        <button
                            onClick={handleClose}
                            className="rounded-md bg-red-500 px-4 py-2 text-sm text-white"
                        >
                            বন্ধ করুন
                        </button>
                    </div>

                    <div
                        ref={printRef}
                        className="w-full bg-white p-5 text-black"
                    >
                        <div className="text-center">
                            <h1 className="text-[24px] font-bold">
                                {vataInformation?.nameBangla}
                            </h1>

                            <p className="text-[13px]">
                                {vataInformation?.address}
                            </p>

                            <p className="text-[12px]">
                                মোবাইলঃ{" "}
                                {toBanglaNumber(
                                    vataInformation?.challanManagerPhoneNumber ||
                                    ""
                                )}
                            </p>

                            <p className="text-[12px]">
                                প্রোপ্রাইটরঃ{" "}
                                {vataInformation?.ownerName}
                            </p>
                        </div>

                        <div className="mt-4 flex items-end justify-between border-b pb-2">
                            <p className="text-sm font-medium">
                                তারিখঃ{" "}
                                {formatBanglaDate({
                                    date: new Date(),
                                })}
                            </p>

                            <div className="text-center">
                                <h2 className="text-[28px] font-bold">
                                    REPORT
                                </h2>

                                <p className="border-b border-black text-sm font-semibold">
                                    বাকি জমা দেওয়ার লিস্ট (২৫-২৬)
                                </p>

                                <p className="text-[10px]">
                                    প্রিন্টঃ{" "}
                                    {formatBanglaDate({
                                        date: new Date(),
                                        showTime: true,
                                    })}
                                </p>
                            </div>

                            <div className="text-right text-sm">
                                <p>সর্বমোট বকেয়া</p>

                                <p className="text-xl font-bold">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalCredit.toLocaleString(
                                            "en-BD"
                                        )
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex justify-between rounded border bg-gray-50 px-4 py-3 text-sm">
                            <p>
                                মোট কাস্টমারঃ{" "}
                                <b>
                                    {toBanglaNumber(
                                        String(dues?.length || 0)
                                    )}{" "}
                                    জন
                                </b>
                            </p>

                            <p>
                                মোট ডেলিভারি বাকি:{" "}
                                <b>
                                    {toBanglaNumber(
                                        String(totalDeliveryDue)
                                    )}
                                </b>
                            </p>

                            <p>
                                সর্বমোট বকেয়াঃ{" "}
                                <b>
                                    ৳{" "}
                                    {toBanglaNumber(
                                        totalCredit.toLocaleString(
                                            "en-BD"
                                        )
                                    )}
                                </b>
                            </p>
                        </div>

                        <table className="mt-5 w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 text-center">
                                        নং
                                    </th>

                                    <th className="border p-2 text-left">
                                        কা.আইডি
                                    </th>

                                    <th className="border p-2 text-left">
                                        নাম
                                    </th>

                                    <th className="border p-2 text-left">
                                        ঠিকানা
                                    </th>

                                    <th className="border p-2 text-left">
                                        মোবাইল
                                    </th>

                                    <th className="border p-2 text-right">
                                        ডেলিভারি বাকি
                                    </th>

                                    <th className="border p-2 text-right">
                                        টাকা বাকি
                                    </th>

                                    <th className="border p-2 text-center">
                                        সিজন
                                    </th>

                                    <th className="border p-2 text-left">
                                        মন্তব্য
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {dues?.map(
                                    (
                                        row: PaymentRow,
                                        index: number
                                    ) => {
                                        const deliveryDue =
                                            row?.challans?.reduce(
                                                (
                                                    accChallan,
                                                    challan
                                                ) => {
                                                    const itemsSum =
                                                        challan?.items?.reduce(
                                                            (
                                                                accItem,
                                                                curr
                                                            ) =>
                                                                accItem +
                                                                ((curr?.quantity ??
                                                                    0) -
                                                                    (curr?.delivered ??
                                                                        0)),
                                                            0
                                                        ) ?? 0;

                                                    return (
                                                        accChallan +
                                                        itemsSum
                                                    );
                                                },
                                                0
                                            ) || 0;

                                        const customerDue =
                                            Number(
                                                row?.totalPurchased || 0
                                            ) -
                                            Number(
                                                row?.totalPaid || 0
                                            );

                                        return (
                                            <tr
                                                key={row?.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="border p-2 text-center">
                                                    {toBanglaNumber(
                                                        String(
                                                            index + 1
                                                        )
                                                    )}
                                                </td>

                                                <td className="border p-2">
                                                    {row?.customerCode}
                                                </td>

                                                <td className="border p-2">
                                                    {row?.name}
                                                </td>

                                                <td className="border p-2">
                                                    {row?.address || "-"}
                                                </td>

                                                <td className="border p-2">
                                                    {toBanglaNumber(
                                                        row?.phoneNumber ||
                                                        ""
                                                    )}
                                                </td>

                                                <td className="border p-2 text-right">
                                                    {toBanglaNumber(
                                                        String(
                                                            deliveryDue
                                                        )
                                                    )}
                                                </td>

                                                <td className="border p-2 text-right font-semibold">
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        customerDue.toLocaleString(
                                                            "en-BD"
                                                        )
                                                    )}
                                                </td>

                                                <td className="border p-2 text-center">
                                                    ২৫-২৬
                                                </td>

                                                <td className="border p-2">
                                                    {row?.note || "-"}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>

                            <tfoot>
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="border p-2 text-right font-semibold"
                                    >
                                        সর্বমোট:
                                    </td>

                                    <td className="border p-2 text-right font-bold">
                                        {toBanglaNumber(
                                            String(totalDeliveryDue)
                                        )}
                                    </td>

                                    <td className="border p-2 text-right font-bold">
                                        ৳{" "}
                                        {toBanglaNumber(
                                            totalCredit.toLocaleString(
                                                "en-BD"
                                            )
                                        )}
                                    </td>

                                    <td
                                        colSpan={2}
                                        className="border"
                                    />
                                </tr>
                            </tfoot>
                        </table>

                        {!dues?.length && (
                            <div className="py-10 text-center text-gray-500">
                                আজকের জন্য কোনো বাকি নেই।
                            </div>
                        )}

                        <div className="mt-20 grid grid-cols-2">
                            <div className="text-center">
                                <div className="mx-auto w-40 border-t border-black" />

                                <p className="mt-1 text-sm">
                                    প্রস্তুতকারক
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="mx-auto w-40 border-t border-black" />

                                <p className="mt-1 text-sm">
                                    ম্যানেজারের স্বাক্ষর
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 border-t pt-3 text-center text-[10px] text-gray-400">
                            Software By - PAYRATECH.COM
                        </div>
                    </div>
                </>
            )}
        </CustomNormalModal>
    );
};

export default TodayWillPayPrintModal;