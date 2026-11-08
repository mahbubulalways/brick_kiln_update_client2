"use client";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import ChalanDetailsModal from "@/components/Dashboard/Modals/ChalanDetailsModal";
import NewDeliveryModal from "@/components/Dashboard/Modals/NewDeliveryModal";
import SellingModal from "@/components/Dashboard/Modals/SellingModal";
import ChalanPrintModal from "@/components/Dashboard/PrintModal/ChalanPrint/ChalanPrintModal";
import PrintThermalInvoice from "@/components/Dashboard/PrintModal/PrintThermalInvoice";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
import CustomDateRangePicker from "@/components/Reusable/CustomDateRangePicker";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import CustomStatus from "@/components/Reusable/CustomStatus";
import SearchBar from "@/components/Reusable/SearchBar";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { TablePagination } from "@/components/Reusable/TablePagination";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TMetaConfig } from "@/interface/meta";
import { TQuery } from "@/interface/query";
import { useGetAllInvoicesQuery } from "@/redux/features/invoice.features";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { IChallanForDataShow, IChallanItem } from "@/types/types";
import { formatDateRange } from "@/utils/formatDateRange";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { MoreVertical, Printer, Truck, Notebook, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const AllInvoicePage = ({ limit, page, search }: TQuery) => {
    const [openReportModal, setOpenReportModal] = useState<boolean>(false);
    const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
    const [openThermalModal, setOpenThermalModal] = useState<boolean>(false);
    const [isDeliveryModalOpen, setIsDeliveryModalOpen] =
        useState<boolean>(false);
    const [searchItems, setSearchItem] = useState("");
    const [invoiceId, setInvoiceId] = useState<number | undefined>(undefined);
    const [openChalanDetailsModal, setOpenChalanDetailsModal] =
        useState<boolean>(false);


    const [filterDate, setDateFiter] = useState<{
        startDate: Date | null,
        endDate: Date | null,
    }>({
        startDate: null,
        endDate: null,
    });

    const formatDate = formatDateRange({
        start: filterDate.startDate,
        end: filterDate.endDate
    })
    const { isLoading: fetchInvoiceLoading, data } =
        useGetAllInvoicesQuery(
            { limit, page, search, date: formatDate }
            , { refetchOnMountOrArgChange: true });
    // VATA INFO
    const { data: vata } = useGetVataInfoQuery(undefined)
    const invoices = data?.data?.data || []
    const meta = data?.data?.meta as TMetaConfig;
    return (
        <div className="bg-white rounded-md shadow border">
            <div className="flex w-full flex-col gap-2 bg-gray-50 p-1.5 md:flex-row md:items-center md:justify-between lg:p-3">

                {/* Search */}
                <div className="flex w-full min-w-0 items-center gap-2 md:flex-1">

                    <div className="min-w-0 flex-1">
                        <SearchBar
                            value={searchItems}
                            onChange={(e) => setSearchItem(e.target.value)}
                            onClear={() => setSearchItem("")}
                        />
                    </div>

                    {/* Mobile Report */}
                    <div className="shrink-0 md:hidden">
                        <CustomReportButton
                            onClick={() => setOpenReportModal(true)}
                        />
                    </div>

                </div>

                {/* Date + Desktop Report */}
                <div className="flex w-full min-w-0 items-center gap-2 md:w-max md:gap-4">

                    <div className="min-w-0 flex-1 md:flex-none">
                        <CustomDateFilter
                            value={filterDate}
                            onChange={setDateFiter}
                            placeholder="তারিখ ফিল্টার করুন"
                            className="w-full"
                        />
                    </div>

                    {/* Desktop Report */}
                    <div className="hidden md:block md:flex-none">
                        <CustomReportButton
                            onClick={() => setOpenReportModal(true)}
                        />
                    </div>

                </div>

            </div>
            <div >
                <div className="overflow-x-auto mt-2  ">
                    <table className="min-w-full border-collapse ">
                        <thead>
                            <tr className="bg-[#039A63] text-white text-center">
                                <TableHead th={"চালান নং"} />
                                <TableHead th={"ধরন"} />
                                <TableHead th={"কাস্টমার"} />
                                <TableHead th={"ঠিকানা"} />
                                <TableHead th={"শ্রেণি"} />
                                <TableHead th={"পরিমাণ"} />
                                <TableHead th={"রেট"} />
                                <TableHead th={"মূল্য"} />
                                <TableHead th={"মোট মূল্য"} />
                                <TableHead th={"ছাড়"} />
                                <TableHead th={"ভাড়া"} />
                                <TableHead th={"সর্বমোট"} />
                                <TableHead th={"নগদ"} />
                                <TableHead th={"বাকি"} />
                                <TableHead th={"বাটন"} />
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            {fetchInvoiceLoading ? (
                                <TableLazyLoading
                                    smallColumns={15}
                                    largeColumns={15}
                                    rows={6}
                                />
                            ) : !invoices?.length ? (
                                <tr>
                                    <td colSpan={15}>
                                        <CustomStatus
                                            type="empty"
                                            description="কোনো চালান পাওয়া যায়নি"
                                        />
                                    </td>
                                </tr>
                            ) : (
                                invoices?.map((row: IChallanForDataShow, idx: number) =>
                                    row?.items?.length > 1 ? (
                                        row?.items?.map((item: IChallanItem, index: number) => (
                                            <tr
                                                key={`${row?.id}-${item?.id}`}
                                                className="transition-colors hover:bg-gray-50"
                                            >
                                                {index === 0 && (
                                                    <>
                                                        <TableData
                                                            td={toBanglaNumber(row?.serial)}
                                                            rowSpan={row?.items?.length}
                                                        />
                                                        <TableData
                                                            td={row?.chalanType}
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        <TableData
                                                            td={row?.customer?.name}
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        <TableData
                                                            td={row?.customer?.address}
                                                            rowSpan={row?.items?.length}
                                                        />
                                                    </>
                                                )}

                                                {/* Class */}
                                                <TableData
                                                    td={item?.class}
                                                />

                                                {/* Quantity */}
                                                <TableData
                                                    td={toBanglaNumber(item?.quantity)}
                                                />

                                                {/* Rate */}
                                                <TableData
                                                    td={toBanglaNumber(item?.rate)}

                                                />

                                                {/* Item Price */}
                                                <TableData
                                                    td={`৳ ${toBanglaNumber(item?.price)}`}

                                                />

                                                {index === 0 && (
                                                    <>
                                                        {/* Product Price */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.productPrice)}`}
                                                            cls="text-green-600"
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Discount */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.discount)}`}
                                                            cls="text-orange-500"
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Car Rent */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.carRent)}`}
                                                            cls="text-blue-600"
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Total Price */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.totalPrice)}`}
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Cash */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.cash)}`}
                                                            cls="text-green-600"
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Due */}
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(row?.due)}`}
                                                            cls={`border p-2 ${row?.due > 0
                                                                ? "text-red-500"
                                                                : "text-green-600"
                                                                }`}
                                                            rowSpan={row?.items?.length}
                                                        />

                                                        {/* Action */}
                                                        <td
                                                            className="border p-2"
                                                            rowSpan={row?.items?.length}
                                                        >
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <button className="rounded p-1.5 transition hover:bg-gray-100">
                                                                        <MoreVertical className="h-4 w-4 cursor-pointer text-gray-600" />
                                                                    </button>
                                                                </DropdownMenuTrigger>

                                                                <DropdownMenuContent
                                                                    align="end"
                                                                    className="rounded-md border bg-white shadow-md"
                                                                >
                                                                    {/* Desktop Print */}
                                                                    <DropdownMenuItem
                                                                        className="hidden lg:block"
                                                                        onClick={() => {
                                                                            setOpenPrintModal(true);
                                                                            setInvoiceId(row?.serial);
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={Printer}
                                                                            title="প্রিন্ট চালান"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Mobile Print */}
                                                                    <DropdownMenuItem
                                                                        className="block lg:hidden"
                                                                        onClick={() => {
                                                                            setOpenThermalModal(true);
                                                                            setInvoiceId(row?.serial);
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={Printer}
                                                                            title="প্রিন্ট চালান"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Delivery */}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setIsDeliveryModalOpen(true);
                                                                            setInvoiceId(row?.serial);
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={Truck}
                                                                            title="ডেলিভারি দিন"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Details */}
                                                                    <DropdownMenuItem
                                                                        onClick={() => {
                                                                            setInvoiceId(row?.serial);
                                                                            setOpenChalanDetailsModal(true);
                                                                        }}
                                                                    >
                                                                        <CustomDropDownMenuItem
                                                                            Icon={Notebook}
                                                                            title="চালান বিস্তারিত"
                                                                        />
                                                                    </DropdownMenuItem>

                                                                    {/* Profile */}
                                                                    <DropdownMenuItem>
                                                                        <CustomDropDownMenuItem
                                                                            Icon={User}
                                                                            title="প্রোফাইলে যান"
                                                                        />
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </td>
                                                    </>
                                                )}
                                            </tr>
                                        ))
                                    ) : (
                                        <tr
                                            key={row?.id}
                                            className="transition-colors hover:bg-gray-50"
                                        >
                                            <TableData td={toBanglaNumber(row?.serial)} />
                                            <TableData
                                                td={row?.chalanType}
                                            />
                                            <TableData
                                                td={row?.customer?.name}
                                            />

                                            <TableData
                                                td={row?.customer?.address}

                                            />

                                            <TableData
                                                td={row?.items[0]?.class}
                                            />

                                            <TableData
                                                td={toBanglaNumber(row?.items[0]?.quantity)}
                                            />

                                            <TableData
                                                td={toBanglaNumber(row?.items[0]?.rate)}

                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.items[0]?.price?.toLocaleString()
                                                )}`}

                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.productPrice?.toLocaleString()
                                                )}`}
                                                cls="text-green-600"
                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.discount?.toLocaleString()
                                                )}`}
                                                cls="text-orange-500"
                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.carRent?.toLocaleString()
                                                )}`}
                                                cls="text-blue-600"
                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.totalPrice?.toLocaleString()
                                                )}`}
                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.cash?.toLocaleString()
                                                )}`}
                                                cls="text-green-600"
                                            />

                                            <TableData
                                                td={`৳ ${toBanglaNumber(
                                                    row?.due?.toLocaleString()
                                                )}`}
                                                cls={`border p-2 ${row?.due > 0
                                                    ? "text-red-500"
                                                    : "text-green-600"
                                                    }`}
                                            />

                                            <td className="border p-2">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="rounded p-1.5 transition hover:bg-gray-100">
                                                            <MoreVertical className="h-4 w-4 cursor-pointer text-gray-600" />
                                                        </button>
                                                    </DropdownMenuTrigger>

                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="rounded-md border bg-white shadow-md"
                                                    >
                                                        {/* Desktop Print */}
                                                        <DropdownMenuItem
                                                            className="hidden lg:block"
                                                            onClick={() => {
                                                                setOpenPrintModal(true);
                                                                setInvoiceId(row?.serial);
                                                            }}
                                                        >
                                                            <CustomDropDownMenuItem
                                                                Icon={Printer}
                                                                title="প্রিন্ট চালান"
                                                            />
                                                        </DropdownMenuItem>

                                                        {/* Mobile Print */}
                                                        <DropdownMenuItem
                                                            className="block lg:hidden"
                                                            onClick={() => {
                                                                setOpenThermalModal(true);
                                                                setInvoiceId(row?.serial);
                                                            }}
                                                        >
                                                            <CustomDropDownMenuItem
                                                                Icon={Printer}
                                                                title="প্রিন্ট চালান"
                                                            />
                                                        </DropdownMenuItem>

                                                        {/* Delivery */}
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setIsDeliveryModalOpen(true);
                                                                setInvoiceId(row?.serial);
                                                            }}
                                                        >
                                                            <CustomDropDownMenuItem
                                                                Icon={Truck}
                                                                title="ডেলিভারি দিন"
                                                            />
                                                        </DropdownMenuItem>

                                                        {/* Details */}
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setOpenChalanDetailsModal(true);
                                                                setInvoiceId(row?.serial);
                                                            }}
                                                        >
                                                            <CustomDropDownMenuItem
                                                                Icon={Notebook}
                                                                title="চালান বিস্তারিত"
                                                            />
                                                        </DropdownMenuItem>

                                                        {/* Profile */}
                                                        <DropdownMenuItem>
                                                            <Link
                                                                href={`/dashboard/customer/profile/${row?.customer?.customerCode}`}
                                                            >
                                                                <CustomDropDownMenuItem
                                                                    Icon={User}
                                                                    title="প্রোফাইলে যান"
                                                                />
                                                            </Link>
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
                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={invoices?.length}
                    title="চালান"
                />
            </div>

            {openReportModal && (
                <SellingModal
                    isOpen={openReportModal}
                    onClose={() => setOpenReportModal(false)}
                    date={formatDate}
                />
            )}

            {openPrintModal && (
                <ChalanPrintModal
                    isOpen={openPrintModal}
                    onClose={() => setOpenPrintModal(false)}
                    invoiceId={invoiceId!}
                    setInvoiceId={setInvoiceId}
                    vataInformation={vata?.data}
                />
            )}
            {openChalanDetailsModal && (
                <ChalanDetailsModal
                    invoiceId={invoiceId!}
                    setInvoiceId={setInvoiceId}
                    isOpen={openChalanDetailsModal}
                    onClose={() => setOpenChalanDetailsModal(false)}
                />
            )}
            {openThermalModal && (
                <PrintThermalInvoice
                    invoiceId={invoiceId!}
                    setInvoiceId={setInvoiceId}
                    isOpen={openThermalModal}
                    onClose={() => setOpenThermalModal(false)}
                />
            )}
            {isDeliveryModalOpen && (
                <NewDeliveryModal
                    isOpen={isDeliveryModalOpen}
                    onClose={() => setIsDeliveryModalOpen(false)}
                    invoiceId={invoiceId!}
                />
            )}
        </div>
    );
};

export default AllInvoicePage;
