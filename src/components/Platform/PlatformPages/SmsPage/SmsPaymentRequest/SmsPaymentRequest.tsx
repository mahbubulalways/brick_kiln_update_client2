"use client";

import { useGetSmsPurchaseRequestQuery, useUpdateSmsPurchaseStatusMutation } from "@/redux/features/sms.features";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import { Ban, CheckCircle, MoreVertical, Trash2, XCircle } from "lucide-react";
import Swal from "sweetalert2";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { TQuery } from "@/interface/query";
export type TSmsPurchaseRequest = {
    id: string;
    vataId: string;
    smsQuantity: number;
    ratePerSms: number | string;
    totalAmount: number | string;
    paymentMethod: string | null;
    transactionId: string | null;
    phoneNumber: string | null;
    type: "MANUAL" | "BKASH";
    status: "PENDING" | "PAID" | "CANCELLED" | "FAILED";
    createdAt: string;
    updatedAt: string;

    vata: {
        vataId: string;
        nameBangla: string;
    };
};
export default function SmsPaymentRequest({ limit, page }: TQuery) {
    const {
        data,
        isLoading,
        isError,
        error
    } = useGetSmsPurchaseRequestQuery({ limit, page });

    const [updateStatusAsync, { isLoading: updateLoading }] = useUpdateSmsPurchaseStatusMutation()
    const requests = data?.data?.data as TSmsPurchaseRequest[] ?? [];
    const meta = data?.data?.meta;

    if (isLoading) {
        return <CustomLoader cls="h-[30vh]" />;
    }

    if (isError) {
        return (
            <div className="flex min-h-[300px] items-center justify-center text-red-500">
                SMS ক্রয় রিকোয়েস্ট লোড করা সম্ভব হয়নি।
            </div>
        );
    }



    const handleUpdateStatus = async (
        id: string,
        status: "PAID" | "CANCELLED",
    ) => {
        const statusText =
            status === "PAID"
                ? "গ্রহণ"
                : "ক্যানসেল";

        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: `এই SMS পেমেন্ট রিকোয়েস্টটি ${statusText} করতে চান?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, নিশ্চিত করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            const payload = {
                id,
                data: { status, }
            }
            await updateStatusAsync(payload).unwrap();

            await Swal.fire({
                title: "সফল হয়েছে!",
                text: `SMS পেমেন্ট রিকোয়েস্টটি সফলভাবে ${statusText} করা হয়েছে।`,
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "SMS পেমেন্টের স্ট্যাটাস আপডেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };
    return (
        <div className="bg-white rounded-md p-3 min-h-screen">
            <div>
                <h2 className="text-xl font-semibold text-gray-800">
                    SMS ক্রয় রিকোয়েস্ট
                </h2>
                <p className="text-sm text-gray-500">
                    বিভিন্ন ভাটার SMS ক্রয় রিকোয়েস্টসমূহ
                </p>
            </div>

            <div className="overflow-x-auto mt-5 border rounded-t-md">
                <table className="min-w-full border-collapse rounded-t-md">
                    <thead className="rounded-t-md">
                        <tr className="bg-[#039A63] rounded-t-md text-center text-white">
                            <TableHead th="#" />
                            <TableHead th="ভাটা ID" />
                            <TableHead th="ভাটার নাম" />
                            <TableHead th="SMS সংখ্যা" />
                            <TableHead th="প্রতি SMS" />
                            <TableHead th="মোট টাকা" />
                            <TableHead th="পেমেন্ট মাধ্যম" />
                            <TableHead th="পেমেন্ট নম্বর" />
                            <TableHead th="ট্রানজেকশন ID" />
                            <TableHead th="স্ট্যাটাস" />
                            <TableHead th="তারিখ" />
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    <tbody className="text-center">
                        {requests.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={11}
                                    className="py-10 text-gray-500"
                                >
                                    কোনো SMS ক্রয় রিকোয়েস্ট পাওয়া যায়নি।
                                </td>
                            </tr>
                        ) : (
                            requests.map((row: any, index: number) => (
                                <tr
                                    key={row?.id}
                                    className="h-[48px] border-b border-gray-200
                                     hover:bg-gray-100 duration-200"
                                >
                                    <TableData td={index + 1} />

                                    <TableData
                                        td={row?.vata?.vataId ?? row?.vataId ?? "-"}
                                    />

                                    <TableData
                                        td={
                                            row?.vata?.nameBangla ??
                                            row?.nameBangla ??
                                            "-"
                                        }
                                        cls="font-medium"
                                    />

                                    <TableData
                                        td={toBanglaNumber(row?.smsQuantity)}
                                    />

                                    <TableData
                                        td={`৳ ${toBanglaNumber(row?.ratePerSms)}`}
                                    />

                                    <TableData
                                        td={`৳ ${toBanglaNumber(row?.totalAmount,)}`}
                                    />

                                    <TableData
                                        td={row?.paymentMethod ?? "-"}
                                    />

                                    <TableData
                                        td={row?.phoneNumber ?? "-"}
                                    />

                                    <TableData
                                        td={row?.transactionId ?? "-"}
                                    />

                                    <TableData
                                        td={
                                            row?.status === "PENDING"
                                                ? "অপেক্ষমান"
                                                : row?.status === "PAID"
                                                    ? "সফল"
                                                    : row?.status === "CANCELLED"
                                                        ? "বাতিল"
                                                        : row?.status === "FAILED"
                                                            ? "ব্যর্থ"
                                                            : row?.status ?? "-"
                                        }
                                        cls={
                                            row?.status === "PENDING"
                                                ? "font-medium text-yellow-600"
                                                : row?.status === "PAID"
                                                    ? "font-medium text-green-600"
                                                    : row?.status === "CANCELLED"
                                                        ? "font-medium text-red-600"
                                                        : row?.status === "FAILED"
                                                            ? "font-medium text-red-500"
                                                            : "font-medium text-gray-600"
                                        }
                                    />

                                    <TableData
                                        td={
                                            row?.createdAt
                                                ? new Date(
                                                    row.createdAt,
                                                ).toLocaleDateString("bn-BD", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })
                                                : "-"
                                        }
                                    />


                                    <td>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <button className="p-1.5 rounded hover:bg-gray-100 transition">
                                                    <MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer" />
                                                </button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="rounded-md border bg-white shadow-md"
                                            >
                                                <DropdownMenuItem
                                                    disabled={updateLoading}
                                                    onClick={() => handleUpdateStatus(row?.id, "PAID")}
                                                >
                                                    <CustomDropDownMenuItem
                                                        Icon={CheckCircle}
                                                        title="গ্রহণ করুন"
                                                    />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    disabled={updateLoading}
                                                    onClick={() =>
                                                        handleUpdateStatus(row?.id, "CANCELLED")}
                                                >
                                                    <CustomDropDownMenuItem
                                                        Icon={Ban}
                                                        title="ক্যানসেল করুন"
                                                    />
                                                </DropdownMenuItem>

                                                <DropdownMenuItem
                                                    // onClick={() => {
                                                    //     setDeleteId(row?.id);
                                                    //     setOpenDeleteModal(true);
                                                    // }}
                                                    className="text-red-600 focus:text-red-600"
                                                >
                                                    <CustomDropDownMenuItem
                                                        Icon={Trash2}
                                                        title="ডিলিট করুন"
                                                    />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={requests.length}
                title="SMS"
            />
        </div>
    );
}