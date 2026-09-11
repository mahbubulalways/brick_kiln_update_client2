"use client";
import { useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Search, Trash } from "lucide-react";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import CustomSelect2 from "@/components/Reusable/CustomSelect2";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { TQuery } from "@/interface/query";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { useGetAllRoundQuery } from "@/redux/features/round.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import Swal from "sweetalert2";
import NewUnloadModal from "@/components/Dashboard/Modals/NewUnloadModal";
import { useGetAllClassAndRateOptionsQuery } from "@/redux/features/classAndRate.features";
import { TClassAndRate } from "@/types/types";
import {

    useDeleteUnloadInfoMutation,
    useGetAllUnloadInfoQuery,
} from "@/redux/features/unload.features";

import { TUnloadResponse } from "@/interface/unload";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import UnloadPagePrint from "./UploadPagePrint";
import UnloadReportModal from "@/components/Dashboard/Modals/ReportModal/UnloadReportModal";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { formatDateRange } from "@/utils/formatDateRange";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";

const UnloadPage = ({ limit, page }: TQuery) => {

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [openReportModal, setOpenReOpenModal] = useState<boolean>(false);
    const [selected, setSelected] = useState("");
    const [filterDate, setDateFiter] = useState<{
        startDate: Date | null,
        endDate: Date | null,
    }>({
        startDate: new Date(),
        endDate: null,
    });

    const printRef = useRef<TCommonPrintRef>(null);
    const {
        data: vataInfo,
    } = useGetVataInfoQuery(undefined);

    // =========================
    // GET UNLOAD DATA
    // =========================
    const formatDate = formatDateRange({
        start: filterDate.startDate,
        end: filterDate.endDate
    })
    const {
        isError,
        data,
        isLoading,
    } = useGetAllUnloadInfoQuery(
        {
            date: formatDate,
            search: selected,
            limit,
            page,
        },
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const unloads: TUnloadResponse[] = data?.data?.data ?? [];
    const meta = data?.data?.meta as TMetaConfig
    // =========================
    // ROUND
    // =========================
    const {
        data: rounds,
        isError: roundError,
        isLoading: roundLoading,
    } = useGetAllRoundQuery(undefined);

    const formatRound = rounds?.data?.map(
        (rd: { name: string }) => ({
            label: rd.name,
            value: rd.name,
        })
    );

    // =========================
    // CLASS
    // =========================
    const {
        isLoading: classLoading,
        data: fetchedData,
        isError: classError,
    } = useGetAllClassAndRateOptionsQuery(undefined);

    const filtered =
        fetchedData?.data?.filter(
            (dt: TClassAndRate) =>
                dt.classType !== "অন্যান্য"
        ) ?? [];

    // =========================
    // DELETE
    // =========================
    const [
        deleteUnloadInfo,
        { isLoading: deleteLoading },
    ] = useDeleteUnloadInfoMutation();

    const handleDelete = async (id: number) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই আনলোডের তথ্য ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteUnloadInfo(id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "আনলোডের তথ্য সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "আনলোডের তথ্য ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    // =========================


    const totalColumns =
        filtered?.length + 4;

    return (
        <div className="bg-white rounded-md shadow border">

            <div className="w-full p-2">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
                    {/* New Unload */}
                    <div className="w-full shrink-0 lg:w-auto">
                        <CustomNewButton
                            onClick={() => setIsModalOpen(true)}
                            title="নতুন আনলোড"
                            className="w-full lg:w-auto"
                        />
                    </div>

                    {/* Right Section */}
                    <div className="flex w-full flex-col gap-2 lg:w-auto lg:flex-row lg:items-center lg:justify-end">
                        {/* Date + Round */}
                        <div className="flex w-full items-center gap-2 lg:w-auto">
                            <div className="min-w-0 flex-1 lg:w-auto lg:flex-none">
                                <CustomDateFilter
                                    value={filterDate}
                                    onChange={setDateFiter}
                                    placeholder="তারিখ ফিল্টার করুন"
                                    className="w-full lg:w-auto"
                                />
                            </div>

                            <div className="min-w-0 flex-1 lg:w-[160px] lg:flex-none">
                                <CustomSelect2
                                    options={formatRound || []}
                                    placeholder="রাউন্ড"
                                    onChange={(value) => setSelected(value)}
                                    isError={roundError}
                                    isLoading={roundLoading}
                                />
                            </div>
                        </div>

                        {/* Print + Report */}
                        <div className="grid w-full grid-cols-2 gap-2 lg:flex lg:w-auto lg:items-center">
                            <div className="w-full lg:w-auto">
                                <CustomPrintButton
                                    className="w-full lg:w-auto"
                                    onClick={() => printRef.current?.print()}
                                />
                            </div>

                            <div className="w-full lg:w-auto">
                                <CustomReportButton
                                    className="w-full lg:w-auto"
                                    onClick={() => setOpenReOpenModal(true)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div >
                <div className="overflow-x-auto mt-2  ">
                    <table className="min-w-full border-collapse ">
                        <thead>
                            <tr className="bg-[#039A63] text-white text-center">
                                <TableHead th="তারিখ" />
                                <TableHead
                                    th="রাউন্ড"
                                />
                                {filtered?.map(
                                    (
                                        ft: TClassAndRate
                                    ) => (
                                        <TableHead
                                            key={ft.id}
                                            th={ft.className}
                                        />
                                    )
                                )}
                                <TableHead
                                    th="মোট ইট"
                                />
                                <TableHead
                                    th="বাটন"
                                />

                            </tr>

                        </thead>
                        <tbody>
                            {isLoading ? (
                                <TableLazyLoading
                                    smallColumns={6}
                                    largeColumns={Number(4 + filtered?.length)}
                                    rows={6}
                                />
                            ) : isError ?
                                (
                                    <tr>
                                        <td colSpan={4 + filtered?.length}>
                                            <CustomStatus
                                                type="error"
                                                description={SERVER_ERROR_MESSAGE}
                                            />
                                        </td>
                                    </tr>
                                )

                                : !unloads?.length ? (
                                    <tr>
                                        <td colSpan={4 + filtered?.length}>
                                            <CustomStatus
                                                type="empty"
                                                description="কোনো আনলোড পাওয়া যায়নি"
                                            />
                                        </td>
                                    </tr>
                                ) : (

                                    unloads.map(
                                        (row) => {

                                            const total =
                                                row.items?.reduce(
                                                    (
                                                        sum,
                                                        item
                                                    ) =>
                                                        sum +
                                                        Number(
                                                            item.quantity
                                                        ),
                                                    0
                                                ) ?? 0;

                                            return (

                                                <tr
                                                    key={row.id}
                                                    className="hover:bg-gray-50"
                                                >

                                                    {/* ================= DATE ================= */}
                                                    <TableData
                                                        td={new Date(
                                                            row.date
                                                        ).toLocaleDateString(
                                                            "bn-BD"
                                                        )}
                                                    />

                                                    {/* ================= ROUND ================= */}
                                                    <TableData
                                                        td={toBanglaNumber(
                                                            row.round?.name ||
                                                            "-"
                                                        )}
                                                        cls="hidden lg:table-cell"
                                                    />

                                                    {/* ================= CLASS COLUMNS ================= */}

                                                    {filtered.map(
                                                        (
                                                            ft: TClassAndRate
                                                        ) => {

                                                            /*
                                                             * এই row-এর unloadItems
                                                             * থেকে current classId খুঁজে বের করছি
                                                             */
                                                            const classData =
                                                                row.items?.find(
                                                                    (
                                                                        item
                                                                    ) =>
                                                                        item.classId ===
                                                                        ft.id
                                                                );

                                                            return (

                                                                <TableData
                                                                    key={
                                                                        ft.id
                                                                    }
                                                                    td={toBanglaNumber(
                                                                        Number(
                                                                            classData?.quantity ??
                                                                            0
                                                                        )
                                                                    )}
                                                                />

                                                            );
                                                        }
                                                    )}

                                                    {/* ================= TOTAL ================= */}
                                                    <TableData
                                                        td={toBanglaNumber(
                                                            total
                                                        )}
                                                    />

                                                    {/* ================= ACTION ================= */}
                                                    <td className="border p-2">

                                                        <DropdownMenu>

                                                            <DropdownMenuTrigger
                                                                asChild
                                                            >

                                                                <button
                                                                    className="
                                                                p-1.5
                                                                rounded
                                                                hover:bg-gray-100
                                                                transition
                                                            "
                                                                >

                                                                    <MoreVertical
                                                                        className="
                                                                    w-4
                                                                    h-4
                                                                    text-gray-600
                                                                    cursor-pointer
                                                                "
                                                                    />

                                                                </button>

                                                            </DropdownMenuTrigger>

                                                            <DropdownMenuContent
                                                                align="end"
                                                                className="
                                                            rounded-md
                                                            border
                                                            bg-white
                                                            shadow-md
                                                        "
                                                            >

                                                                {/* DELETE */}
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            row.id
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        deleteLoading
                                                                    }
                                                                >

                                                                    <CustomDropDownMenuItem
                                                                        Icon={
                                                                            Trash
                                                                        }
                                                                        title="ডিলেট"
                                                                    />

                                                                </DropdownMenuItem>

                                                            </DropdownMenuContent>

                                                        </DropdownMenu>

                                                    </td>

                                                </tr>

                                            );
                                        }
                                    )

                                )}

                        </tbody>
                    </table>

                </div>
                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={unloads?.length}
                    title="পেমেন্ট"
                />
            </div>

            {/* PRINT PART */}
            <CommonPrint
                ref={printRef}
                title="load_report"
            >
                <UnloadPagePrint
                    unloadData={unloads}
                    date={new Date()}
                    classes={filtered}
                    vataInfo={vataInfo?.data}
                />
            </CommonPrint>
            {/* ================= NEW UNLOAD MODAL ================= */}

            {isModalOpen && (
                <NewUnloadModal
                    isOpen={
                        isModalOpen
                    }
                    onClose={() =>
                        setIsModalOpen(
                            false
                        )
                    }
                />

            )}

            {openReportModal &&
                <UnloadReportModal
                    classes={filtered}
                    isOpen={openReportModal}
                    onClose={() => setOpenReOpenModal(false)}
                />
            }

        </div>
    );
};

export default UnloadPage;