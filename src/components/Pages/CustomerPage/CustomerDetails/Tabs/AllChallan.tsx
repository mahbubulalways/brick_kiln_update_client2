"use client";

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    MoreVertical,
    Notebook,
    Printer,
    Truck,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useGetSingleCustomerInvoiceQuery } from "@/redux/features/customer.features";

import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import { TablePagination } from "@/components/Reusable/TablePagination";

import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";

import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

import ChalanPrintModal from "@/components/Dashboard/PrintModal/ChalanPrint/ChalanPrintModal";
import NewDeliveryModal from "@/components/Dashboard/Modals/NewDeliveryModal";
import ChalanDetailsModal from "@/components/Dashboard/Modals/ChalanDetailsModal";

import {
    IChallanForDataShow,
    IChallanItem,
} from "@/types/types";
import { TVataInformation } from "@/interface/vata";

interface AllChallanProps {
    customerId: number;
    formatDate: string,
    query: TQuery;
    setInvoiceInfo: Dispatch<SetStateAction<any>>;
    vataInformation: TVataInformation
}

const AllChallan = ({
    customerId,
    formatDate,
    query,
    vataInformation,
    setInvoiceInfo,
}: AllChallanProps) => {
    const [openPrintModal, setOpenPrintModal] =
        useState<boolean>(false);

    const [isDeliveryModalOpen, setIsDeliveryModalOpen] =
        useState<boolean>(false);

    const [invoiceId, setInvoiceId] =
        useState<number>();

    const [openChalanDetailsModal, setOpenChalanDetailsModal] =
        useState<boolean>(false);

    const {
        data,
        isLoading,
        isFetching,
    } = useGetSingleCustomerInvoiceQuery(
        {
            customerId,
            formatDate,
            query,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const invoices: IChallanForDataShow[] = useMemo(
        () => data?.data?.data ?? [],
        [data?.data?.data]
    );

    const meta = data?.data?.meta as TMetaConfig;

    useEffect(() => {
        setInvoiceInfo(invoices);
    }, [invoices, setInvoiceInfo]);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* ================= Header ================= */}
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">
                            <TableHead th="#" />

                            <TableHead th="তারিখ" />

                            <TableHead th="শ্রেণি" />

                            <TableHead th="পরিমাণ" />

                            <TableHead
                                th="রেট"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead
                                th="মূল্য"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead
                                th="মোট মূল্য"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead
                                th="ছাড়"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead
                                th="ভাড়া"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead th="সর্বমোট" />

                            <TableHead
                                th="নগদ"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead
                                th="বাকি"
                                cls="hidden lg:table-cell"
                            />

                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    {/* ================= Body ================= */}
                    <tbody className="text-center">

                        {/* ================= Loading ================= */}
                        {isLoading || isFetching ? (
                            <tr>
                                <td
                                    colSpan={12}
                                    className="py-10"
                                >
                                    <CustomLoader cls="h-[20vh]" />
                                </td>
                            </tr>
                        ) : !invoices.length ? (
                            /* ================= Empty ================= */
                            <tr>
                                <td
                                    colSpan={12}
                                    className="py-8 text-gray-500"
                                >
                                    কোনো চালান পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            /* ================= Data ================= */
                            invoices.map(
                                (
                                    row: IChallanForDataShow,
                                    index: number
                                ) => {
                                    const items: IChallanItem[] =
                                        row?.items ?? [];

                                    return items.map(
                                        (
                                            item: IChallanItem,
                                            itemIndex: number
                                        ) => (
                                            <tr
                                                key={`${row?.id}-${item?.id}`}
                                                className="transition-colors hover:bg-gray-50"
                                            >

                                                {/* ================= Serial ================= */}
                                                {itemIndex === 0 && (
                                                    <TableData
                                                        td={toBanglaNumber(
                                                            row?.serial
                                                        )}
                                                        rowSpan={
                                                            items.length
                                                        }
                                                    />
                                                )}

                                                {/* ================= Date ================= */}
                                                <TableData
                                                    td={formatBanglaDate({
                                                        date: item?.createdAt,
                                                    })}
                                                />

                                                {/* ================= Class ================= */}
                                                <TableData
                                                    td={item?.class}
                                                />

                                                {/* ================= Quantity ================= */}
                                                <TableData
                                                    td={toBanglaNumber(
                                                        item?.quantity
                                                    )}
                                                />

                                                {/* ================= Rate ================= */}
                                                <TableData
                                                    td={toBanglaNumber(
                                                        item?.rate
                                                    )}
                                                    cls="hidden lg:table-cell"
                                                />

                                                {/* ================= Item Price ================= */}
                                                <TableData
                                                    td={`৳ ${toBanglaNumber(
                                                        item?.price
                                                    )}`}
                                                    cls="hidden lg:table-cell"
                                                />

                                                {/* ================= Challan Info ================= */}
                                                {itemIndex === 0 && (
                                                    <>
                                                        {/* Product Price */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.productPrice
                                                            )}`}
                                                            cls="hidden lg:table-cell text-green-600"
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* Discount */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.discount
                                                            )}`}
                                                            cls="hidden lg:table-cell text-orange-500"
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* Car Rent */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.carRent
                                                            )}`}
                                                            cls="hidden lg:table-cell text-blue-600"
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* Total Price */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.totalPrice
                                                            )}`}
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* Cash */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.cash
                                                            )}`}
                                                            cls="hidden lg:table-cell text-green-600"
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* Due */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row?.due
                                                            )}`}
                                                            cls={`hidden lg:table-cell ${Number(
                                                                row?.due ?? 0
                                                            ) > 0
                                                                ? "text-red-500"
                                                                : "text-green-600"
                                                                }`}
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        />

                                                        {/* ================= Actions ================= */}
                                                        <td
                                                            className="border p-2"
                                                            rowSpan={
                                                                items.length
                                                            }
                                                        >
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger
                                                                    asChild
                                                                >
                                                                    <button className="cursor-pointer rounded p-1.5 hover:bg-gray-100">
                                                                        <MoreVertical
                                                                            size={
                                                                                17
                                                                            }
                                                                            className="text-gray-600"
                                                                        />
                                                                    </button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="rounded-md border bg-white shadow-md"
                                                                >
                                                                    {/* Print */}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setOpenPrintModal(
                                                                                true
                                                                            );

                                                                            setInvoiceId(
                                                                                row?.serial
                                                                            );
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={
                                                                                Printer
                                                                            }
                                                                            title="প্রিন্ট চালান"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Delivery */}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setIsDeliveryModalOpen(
                                                                                true
                                                                            );

                                                                            setInvoiceId(
                                                                                row?.serial
                                                                            );
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={
                                                                                Truck
                                                                            }
                                                                            title="ডেলিভারি দিন"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Details */}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setInvoiceId(
                                                                                row?.serial
                                                                            );

                                                                            setOpenChalanDetailsModal(
                                                                                true
                                                                            );
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={
                                                                                Notebook
                                                                            }
                                                                            title="চালান বিস্তারিত"
                                                                        />
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        )
                                    );
                                }
                            )
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= Pagination ================= */}
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={invoices?.length}
                title="চালান"
            />

            {/* ================= Print Modal ================= */}
            {openPrintModal && (
                <ChalanPrintModal
                    vataInformation={vataInformation}
                    isOpen={openPrintModal}
                    onClose={() =>
                        setOpenPrintModal(false)
                    }
                    invoiceId={invoiceId!}
                    setInvoiceId={setInvoiceId}
                />
            )}

            {/* ================= Delivery Modal ================= */}
            {isDeliveryModalOpen && (
                <NewDeliveryModal
                    isOpen={isDeliveryModalOpen}
                    onClose={() =>
                        setIsDeliveryModalOpen(false)
                    }
                    invoiceId={invoiceId!}
                />
            )}

            {/* ================= Challan Details Modal ================= */}
            {openChalanDetailsModal && (
                <ChalanDetailsModal
                    invoiceId={invoiceId!}
                    setInvoiceId={setInvoiceId}
                    isOpen={openChalanDetailsModal}
                    onClose={() =>
                        setOpenChalanDetailsModal(false)
                    }
                />
            )}
        </div>
    );
};

export default AllChallan;