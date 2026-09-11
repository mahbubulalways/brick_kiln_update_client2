"use client";

import { useGetSingleCustomerDeliveryQuery } from "@/redux/features/customer.features";

import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MoreVertical,
    Printer,
    Truck,
} from "lucide-react";

import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";

import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

import {
    TDeliveryWithCustomer,
} from "@/interface/delivery";

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";

import DeliveryDetailsModal from "@/components/Dashboard/Modals/DeliveryDetailsModal";
import DeliveryPrintModal from "@/components/Dashboard/PrintModal/DeliveryPrint/DeliveryPrintModal";

interface DeliveryHistoryProps {
    customerId: number;
    formatDate: string,
    query: TQuery;
    setDeliveryInfo: Dispatch<
        SetStateAction<TDeliveryWithCustomer[] | undefined>
    >;
}

const DeliveryHistory = ({
    customerId,
    formatDate,
    query,
    setDeliveryInfo,
}: DeliveryHistoryProps) => {
    const [openPrintModal, setOpenPrintModal] =
        useState<boolean>(false);

    const [deliveryId, setDeliveryId] =
        useState<number | undefined>();

    const [openDeliveryDetailsModal, setOpenDeliveryDetailsModal] =
        useState<boolean>(false);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetSingleCustomerDeliveryQuery(
        {
            customerId,
            formatDate,
            query,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const deliveries = useMemo(
        () =>
            (data?.data?.data as TDeliveryWithCustomer[]) ?? [],
        [data?.data?.data]
    );

    const meta = data?.data?.meta as TMetaConfig;

    useEffect(() => {
        setDeliveryInfo(deliveries);
    }, [deliveries, setDeliveryInfo]);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* ================= Header ================= */}
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">
                            <TableHead th="#" />
                            <TableHead th="চালান নং" />
                            <TableHead th="কাস্টমার" />
                            <TableHead th="ঠিকানা" />
                            <TableHead th="শ্রেণি" />
                            <TableHead th="ক্রয়" />
                            <TableHead th="ডেলিভারি" />
                            <TableHead th="ডে. বাকি" />
                            <TableHead th="মোট ডেলিভারি" />
                            <TableHead th="ড্রাইভার" />
                            <TableHead th="তারিখ" />
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    {/* ================= Body ================= */}
                    <tbody className="text-center">

                        {/* Loading */}
                        {isLoading || isFetching ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="py-10"
                                >
                                    <CustomLoader cls="h-[20vh]" />
                                </td>
                            </tr>
                        ) : !deliveries.length ? (
                            /* Empty */
                            <tr>
                                <td
                                    colSpan={12}
                                    className="py-8 text-gray-500"
                                >
                                    কোনো ডেলিভারি পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            deliveries.map(
                                (
                                    row: TDeliveryWithCustomer,
                                    index: number
                                ) => (
                                    <tr
                                        key={row?.id}
                                        className="transition-colors hover:bg-gray-50"
                                    >


                                        {/* ================= Delivery No ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.deliveryNo
                                            )}
                                        />

                                        {/* ================= Invoice No ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.invoice?.serial
                                            )}
                                        />

                                        {/* ================= Customer ================= */}
                                        <TableData
                                            td={
                                                row?.invoice?.customer?.name ||
                                                "-"
                                            }
                                        />

                                        {/* ================= Address ================= */}
                                        <TableData
                                            td={
                                                row?.invoice?.customer?.address ||
                                                "-"
                                            }
                                        />

                                        {/* ================= Class ================= */}
                                        <TableData
                                            td={row?.class || "-"}
                                        />

                                        {/* ================= Purchase ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.quantity
                                            )}
                                        />

                                        {/* ================= Delivery ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.deliveryReceived
                                            )}
                                            cls="text-green-600"
                                        />

                                        {/* ================= Delivery Remaining ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.deliveryRemaining
                                            )}
                                            cls={
                                                row?.deliveryRemaining > 0
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                            }
                                        />

                                        {/* ================= Total Delivery ================= */}
                                        <TableData
                                            td={toBanglaNumber(
                                                row?.deliveryReceived
                                            )}
                                            cls="text-green-600"
                                        />

                                        {/* ================= Driver ================= */}
                                        <TableData
                                            td={
                                                row?.driverName ||
                                                "-"
                                            }
                                        />

                                        {/* ================= Date ================= */}
                                        <TableData
                                            td={formatBanglaDate({
                                                date: row?.deliveryDate,
                                                showTime: false,
                                            })}
                                        />

                                        {/* ================= Actions ================= */}
                                        <td className="border p-2">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger
                                                    asChild
                                                >
                                                    <button className="cursor-pointer rounded p-1.5 hover:bg-gray-100">
                                                        <MoreVertical
                                                            size={17}
                                                            className="text-gray-600"
                                                        />
                                                    </button>
                                                </DropdownMenuTrigger>

                                                <DropdownMenuContent
                                                    align="end"
                                                    className="rounded-md border bg-white shadow-md"
                                                >
                                                    {/* ================= Print ================= */}
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setOpenPrintModal(
                                                                true
                                                            );
                                                            setDeliveryId(
                                                                row?.id
                                                            );
                                                        }}
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={Printer}
                                                            title="প্রিন্ট"
                                                        />
                                                    </DropdownMenuItem>

                                                    {/* ================= Details ================= */}
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setOpenDeliveryDetailsModal(
                                                                true
                                                            );
                                                            setDeliveryId(
                                                                row?.id
                                                            );
                                                        }}
                                                    >
                                                        <CustomDropDownMenuItem
                                                            Icon={Truck}
                                                            title="ডেলিভারি বিস্তারিত"
                                                        />
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= Pagination ================= */}
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={deliveries.length}
                title="ডেলিভারি"
            />

            {/* ================= Delivery Details Modal ================= */}
            {openDeliveryDetailsModal && (
                <DeliveryDetailsModal
                    isOpen={openDeliveryDetailsModal}
                    onClose={() =>
                        setOpenDeliveryDetailsModal(false)
                    }
                    deliveryId={deliveryId}
                    setDeliveryId={setDeliveryId}
                />
            )}

            {/* ================= Print Modal ================= */}
            {openPrintModal && (
                <DeliveryPrintModal
                    isOpen={openPrintModal}
                    onClose={() =>
                        setOpenPrintModal(false)
                    }
                    deliveryId={deliveryId}
                    setDeliveryId={setDeliveryId}
                />
            )}
        </div>
    );
};

export default DeliveryHistory;