"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useGetAllCustomerQuery } from "@/redux/features/customer.features";

import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

import { TCustomer } from "@/interface/customer";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import SearchBar from "@/components/Reusable/SearchBar";
import { TablePagination } from "@/components/Reusable/TablePagination";

import UpdateCustomerModal from "@/components/Dashboard/Modals/EditModals/UpdateCustomerModal";
import UpdateDuePayDateModal from "@/components/Dashboard/Modals/EditModals/UpdateDuePayDateModal";

// =========================================================
// Format Date
// =========================================================

const formatDate = (date: string | null) => {
    if (!date) return "-";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${toBanglaNumber(day)}-${toBanglaNumber(
        month
    )}-${toBanglaNumber(year)}`;
};

// =========================================================
// Format Amount
// =========================================================

const formatAmount = (amount: number) => {
    return toBanglaNumber(amount.toLocaleString("en-IN"));
};

// =========================================================
// Customer Page
// =========================================================

const CustomerPage = ({ limit, page, search }: TQuery) => {
    const [searchItems, setSearchItem] = useState("");

    const [openUpdateCustomer, setOpenUpdateCustomer] =
        useState<boolean>(false);

    const [openUpdateDateModal, setOpenUpdateDateModal] =
        useState<boolean>(false);

    const [customerId, setCustomerId] =
        useState<string | undefined>(undefined);

    const router = useRouter();

    const {
        data: response,
        isError,
        isLoading,
    } = useGetAllCustomerQuery({
        limit,
        search,
        page,
    });

    const customers: TCustomer[] = response?.data?.data ?? [];

    const meta = response?.data?.meta as TMetaConfig;

    // =========================================================
    // Loading
    // =========================================================

    if (isLoading) {
        return <CustomLoader cls="h-[30vh]" />;
    }

    // =========================================================
    // Error
    // =========================================================

    if (isError) {
        return <CustomStatus type="error" />;
    }

    // =========================================================
    // Customer Profile
    // =========================================================

    const handleCustomerProfile = (customerCode: string) => {
        router.push(
            `/dashboard/customer/profile/${customerCode}`
        );
    };

    return (
        <div className="w-full">
            <div className="w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">

                {/* =================================================
                    Header
                ================================================= */}

                <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">

                    {/* Customer Count */}

                    <div className="flex-1">
                        <div className="flex w-fit items-center gap-2 rounded-lg border border-[#079B67] bg-white px-2 py-1.5 md:px-5">
                            <span className="text-[13px] font-medium text-[#079B67] md:text-[15px]">
                                কাস্টমারঃ
                            </span>

                            <span className="text-[13px] font-semibold text-[#079B67] md:text-[17px]">
                                {toBanglaNumber(customers.length)} জন
                            </span>
                        </div>
                    </div>

                    {/* Search */}

                    <div className="w-full flex-1 md:max-w-md">
                        <SearchBar
                            value={searchItems}
                            onChange={(e) =>
                                setSearchItem(e.target.value)
                            }
                            onClear={() => setSearchItem("")}
                        />
                    </div>
                </div>

                {/* =================================================
                    Table
                ================================================= */}

                <div className="w-full overflow-x-auto">
                    <table className="w-full min-w-[1250px] table-fixed border-collapse">

                        {/* =================================================
                            Table Head
                        ================================================= */}

                        <thead>
                            <tr className="bg-[#079B67] text-white">

                                <th className="w-[120px] px-4 py-4 text-left text-sm font-semibold">
                                    আইডি
                                </th>

                                <th className="w-[280px] px-4 py-4 text-left text-sm font-semibold">
                                    নাম, ঠিকানা, ফোন নম্বর
                                </th>

                                <th className="w-[280px] px-4 py-4 text-left text-sm font-semibold">
                                    ডেলিভারি
                                </th>

                                <th className="w-[280px] px-4 py-4 text-left text-sm font-semibold">
                                    টাকার হিসাব
                                </th>

                                <th className="w-[300px] px-4 py-4 text-left text-sm font-semibold">
                                    বাকি পরিশোধের তথ্য
                                </th>
                            </tr>
                        </thead>

                        {/* =================================================
                            Table Body
                        ================================================= */}

                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="py-16 text-center text-gray-500"
                                    >
                                        কোনো কাস্টমার পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="cursor-pointer border-b border-gray-200 transition-colors hover:bg-gray-50"
                                    >

                                        {/* =================================================
                                            ID
                                        ================================================= */}

                                        <td
                                            onClick={() =>
                                                handleCustomerProfile(
                                                    customer.customerCode
                                                )
                                            }
                                            className="p-3 align-middle"
                                        >
                                            <div className="flex min-h-45 flex-col items-center justify-center rounded-lg bg-[#FCE4DE]">
                                                <span className="text-[30px] font-medium leading-none text-[#FF4B12]">
                                                    {toBanglaNumber(
                                                        customer.customerCode
                                                    )}
                                                </span>

                                                <span className="mt-2 text-sm font-medium text-[#FF7448]">
                                                    কাস্টমার
                                                </span>
                                            </div>
                                        </td>

                                        {/* =================================================
                                            Customer Info
                                        ================================================= */}

                                        <td
                                            onClick={() =>
                                                handleCustomerProfile(
                                                    customer.customerCode
                                                )
                                            }
                                            className="p-4 align-middle"
                                        >
                                            <div className="flex min-h-45 flex-col justify-center gap-3">

                                                <InfoRow
                                                    label="নাম"
                                                    value={customer.name}
                                                />

                                                <InfoRow
                                                    label="ঠিকানা"
                                                    value={customer.address}
                                                />

                                                <InfoRow
                                                    label="ফোন নম্বর"
                                                    value={toBanglaNumber(
                                                        customer.phoneNumber
                                                    )}

                                                />

                                                <InfoRow
                                                    label="যোগদানের তারিখ"
                                                    value={formatBanglaDate({
                                                        date: customer.createdAt,
                                                    })}

                                                />
                                            </div>
                                        </td>

                                        {/* =================================================
                                            Delivery
                                        ================================================= */}

                                        <td
                                            onClick={() =>
                                                handleCustomerProfile(
                                                    customer.customerCode
                                                )
                                            }
                                            className="p-4 align-middle"
                                        >
                                            <div className="flex min-h-[180px] flex-col justify-center gap-3">

                                                <InfoRow
                                                    label="মোট ইট ক্রয়"
                                                    value={formatAmount(
                                                        customer.totalPurchasedQuantity
                                                    )}
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />

                                                <InfoRow
                                                    label="ডেলিভারি"
                                                    value={formatAmount(
                                                        customer.totalDeliveredQuantity
                                                    )}
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />

                                                <InfoRow
                                                    label="ডেলিভারি বাকি"
                                                    value={formatAmount(
                                                        customer.totalRemainingQuantity
                                                    )}
                                                    labelClassName="text-[#FF6B00]"
                                                    valueClassName="font-semibold text-[#FF6B00]"
                                                />

                                                <InfoRow
                                                    label="আগের মৌসুমের বাকি"
                                                    value={"৳ "+ formatAmount(
                                                        customer.previousDue
                                                    )}
                                                    labelClassName="text-[#8B5CF6]"
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />
                                            </div>
                                        </td>

                                        {/* =================================================
                                            Money
                                        ================================================= */}

                                        <td
                                            onClick={() =>
                                                handleCustomerProfile(
                                                    customer.customerCode
                                                )
                                            }
                                            className="p-4 align-middle"
                                        >
                                            <div className="flex min-h-[180px] flex-col justify-center gap-3">

                                                <InfoRow
                                                    label="মোট মূল্য"
                                                    value={"৳ "+formatAmount(
                                                        customer.totalAmount
                                                    )}
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />

                                                <InfoRow
                                                    label="পরিশোধ"
                                                    value={"৳ "+formatAmount(
                                                        customer.totalPaid
                                                    )}
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />

                                                <InfoRow
                                                    label="চলতি মৌসুমের বাকি"
                                                    value={"৳ "+formatAmount(
                                                        customer.currentSeasonDue
                                                    )}
                                                    labelClassName="text-[#F59E0B]"
                                                    valueClassName="font-semibold text-[#8B5CF6]"
                                                />

                                                <InfoRow
                                                    label="সর্বমোট বাকি"
                                                    value={"৳ "+formatAmount(
                                                        customer.totalDue
                                                    )}
                                                    labelClassName="bg-[#FCE4DE] text-[#FF4B12]"
                                                    valueClassName="font-bold text-[#FF4B12]"
                                                />
                                            </div>
                                        </td>

                                        {/* =================================================
                                            Payment Information
                                        ================================================= */}

                                        <td className="p-4 align-middle">
                                            <div className="flex min-h-[180px] flex-col justify-center gap-3">

                                                <InfoRow
                                                    label="পরিশোধের তারিখ"
                                                    value={formatDate(
                                                        customer.nextPaymentDate
                                                    )}
                                                />

                                                <InfoRow
                                                    label="নোট"
                                                    value={
                                                        customer.note || "-"
                                                    }
                                                />

                                                <div className="mt-1 flex flex-wrap gap-2">

                                                    {/* Update Customer */}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setOpenUpdateCustomer(
                                                                true
                                                            );

                                                            setCustomerId(
                                                                customer.customerCode
                                                            );
                                                        }}
                                                        type="button"
                                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#079B67] hover:bg-[#079B67] hover:text-white"
                                                    >
                                                        আপডেট কাস্টমার
                                                    </button>

                                                    {/* Update Date */}

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            setOpenUpdateDateModal(
                                                                true
                                                            );

                                                            setCustomerId(
                                                                customer.customerCode
                                                            );
                                                        }}
                                                        type="button"
                                                        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:border-[#079B67] hover:bg-[#079B67] hover:text-white"
                                                    >
                                                        আপডেট তারিখ
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* =================================================
                    Pagination
                ================================================= */}

                <TablePagination
                    page={meta?.page ?? 1}
                    totalPages={meta?.totalPages ?? 1}
                    dataLength={customers.length}
                    title="কাস্টমার"
                />
            </div>

            {/* =================================================
                Update Customer Modal
            ================================================= */}

            {openUpdateCustomer && (
                <UpdateCustomerModal
                    id={customerId!}
                    isOpen={openUpdateCustomer}
                    onClose={() =>
                        setOpenUpdateCustomer(false)
                    }
                    setId={setCustomerId}
                />
            )}

            {/* =================================================
                Update Payment Date Modal
            ================================================= */}

            {openUpdateDateModal && (
                <UpdateDuePayDateModal
                    setId={setCustomerId}
                    id={customerId!}
                    isOpen={openUpdateDateModal}
                    onClose={() =>
                        setOpenUpdateDateModal(false)
                    }
                />
            )}
        </div>
    );
};

// =========================================================
// Reusable Info Row
// =========================================================

interface InfoRowProps {
    label: string;
    value: string | number;
    labelClassName?: string;
    valueClassName?: string;
}

const InfoRow = ({
    label,
    value,
    labelClassName = "",
    valueClassName = "",
}: InfoRowProps) => {
    return (
        <div className="grid grid-cols-[145px_minmax(0,1fr)] items-center gap-3">

            <span
                className={`
                    inline-flex
                    min-h-[34px]
                    items-center
                    rounded-lg
                    bg-[#F0F4F8]
                    px-3
                    py-1.5
                    text-sm
                    text-gray-700
                    ${labelClassName}
                `}
            >
                {label}
            </span>

            <span
                className={`
                    min-w-0
                    break-words
                    text-[14px]
                    leading-5
                    text-gray-800
                    ${valueClassName}
                `}
            >
                {value}
            </span>
        </div>
    );
};

export default CustomerPage;