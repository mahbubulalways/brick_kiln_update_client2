"use client";

import {
    useGetSingleCustomerDueCollectionQuery,
} from "@/redux/features/customer.features";

import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";

import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

import { TDueData } from "@/interface/due";

import {
    Dispatch,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    MessageSquare,
    MoreVertical,
    Wallet2Icon,
} from "lucide-react";

import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";

import NewDueCollectionModalId from "@/components/Dashboard/Modals/NewDueCollectionModalId";
import SendCustomerSmsModal from "@/components/Dashboard/Modals/SendCustomerSmsModal";

interface DueProps {
    customerId: number;
    formatDate: string;
    query: TQuery;
    setDueInfo: Dispatch<
        SetStateAction<TDueData[] | undefined>
    >;
}

const DueCollection = ({
    customerId,
    formatDate,
    query,
    setDueInfo,
}: DueProps) => {
    const [openDueModal, setOpenDeuModal] =
        useState<boolean>(false);

    const [openSmsModal, setOpenSmsModal] =
        useState<boolean>(false);

    const [customerCode, setCustomerCode] =
        useState<string>();

    const {
        data,
        isLoading,
        isFetching,
    } = useGetSingleCustomerDueCollectionQuery(
        {
            customerId,
            formatDate,
            query,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const dues: TDueData[] = useMemo(
        () => data?.data?.data ?? [],
        [data?.data?.data]
    );

    const meta = data?.data?.meta as TMetaConfig;

    useEffect(() => {
        setDueInfo(dues);
    }, [dues, setDueInfo]);

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full">

                    {/* ================= Header ================= */}
                    <thead>
                        <tr className="bg-[#039A63] text-center text-white">

                            {/* তারিখ */}
                            <TableHead th="তারিখ" />

                            {/* আইডি */}
                            <TableHead th="আইডি" />

                            {/* টাকা বাকি ছিল */}
                            <TableHead th="টাকা বাকি ছিল" />

                            {/* জমা দেওয়া */}
                            <TableHead th="জমা দেওয়া" />

                            {/* অবশিষ্ট বাকি */}
                            <TableHead th="অবশিষ্ট বাকি" />

                            {/* নোট */}
                            <TableHead th="নোট" />

                            {/* নতুন তারিখ */}
                            <TableHead th="নতুন তারিখ" />

                            {/* Button */}
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    {/* ================= Body ================= */}
                    <tbody className="text-center">

                        {/* ================= Loading ================= */}
                        {isLoading || isFetching ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="py-10"
                                >
                                    <CustomLoader cls="h-[20vh]" />
                                </td>
                            </tr>
                        ) : !dues.length ? (

                            /* ================= Empty ================= */
                            <tr>
                                <td
                                    colSpan={8}
                                    className="py-8 text-gray-500"
                                >
                                    কোনো বাকি পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (

                            /* ================= Data ================= */
                            dues.map((row: TDueData) => (
                                <tr
                                    key={row.id}
                                    className="transition-colors hover:bg-gray-50"
                                >

                                    {/* ================= তারিখ ================= */}
                                    <TableData
                                        td={formatBanglaDate({
                                            date: row.createdAt,
                                            showTime: false,
                                        })}
                                    />

                                    {/* ================= আইডি ================= */}
                                    <TableData
                                        td={toBanglaNumber(
                                            row?.customer?.customerCode
                                        )}
                                    />

                                    {/* ================= টাকা বাকি ছিল ================= */}
                                    <TableData
                                        td={toBanglaNumber(
                                            row.due
                                        )}
                                        cls="text-orange-500"
                                    />

                                    {/* ================= জমা দেওয়া ================= */}
                                    <TableData
                                        td={toBanglaNumber(
                                            row.collect
                                        )}
                                        cls="text-green-600"
                                    />

                                    {/* ================= অবশিষ্ট বাকি ================= */}
                                    <TableData
                                        td={toBanglaNumber(
                                            row.newDue
                                        )}
                                        cls={
                                            row.newDue > 0
                                                ? "text-orange-500"
                                                : "text-green-600"
                                        }
                                    />

                                    {/* ================= নোট ================= */}
                                    <TableData
                                        td={
                                            row?.customer?.note ||
                                            "-"
                                        }
                                    />

                                    {/* ================= নতুন তারিখ ================= */}
                                    <TableData
                                        td={formatBanglaDate({
                                            date: row.nextDate,
                                            showTime: false,
                                        })}
                                    />

                                    {/* ================= Actions ================= */}
                                    <td className="border p-2">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                asChild
                                            >
                                                <button className="cursor-pointer rounded p-1.5 transition hover:bg-gray-100">
                                                    <MoreVertical
                                                        className="h-4 w-4 text-gray-600"
                                                    />
                                                </button>
                                            </DropdownMenuTrigger>

                                            <DropdownMenuContent
                                                align="end"
                                                className="rounded-md border bg-white shadow-md"
                                            >

                                                {/* ================= জমা করুন ================= */}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setCustomerCode(
                                                            row?.customer
                                                                ?.customerCode
                                                        );

                                                        setOpenDeuModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <CustomDropDownMenuItem
                                                        Icon={
                                                            Wallet2Icon
                                                        }
                                                        title="জমা করুন"
                                                    />
                                                </DropdownMenuItem>

                                                {/* ================= মেসেজ করুন ================= */}
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setCustomerCode(
                                                            row?.customer
                                                                ?.customerCode
                                                        );

                                                        setOpenSmsModal(
                                                            true
                                                        );
                                                    }}
                                                >
                                                    <CustomDropDownMenuItem
                                                        Icon={
                                                            MessageSquare
                                                        }
                                                        title="মেসেজ করুন"
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

            {/* ================= Pagination ================= */}
            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={dues.length}
                title="বাকি"
            />

            {/* ================= Due Collection Modal ================= */}
            {openDueModal && (
                <NewDueCollectionModalId
                    onClose={() =>
                        setOpenDeuModal(false)
                    }
                    isOpen={openDueModal}
                    id={String(customerCode)}
                />
            )}

            {/* ================= SMS Modal ================= */}
            {openSmsModal && (
                <SendCustomerSmsModal
                    onClose={() =>
                        setOpenSmsModal(false)
                    }
                    isOpen={openSmsModal}
                    customerId={String(customerCode)}
                />
            )}
        </div>
    );
};

export default DueCollection;