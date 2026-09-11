"use client";

import {
  Ban,
  CalendarDays,
  CalendarPlus,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  MapPin,
  MoreVertical,
  Pencil,
  Power,
  Store,
  UserRound,
} from "lucide-react";

import Link from "next/link";
import { useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";

type TVata = {
  id: string;
  vataId: string;
  nameBangla: string;
  nameEnglish: string;
  nextPaymentDate: string | null;
  ownerName: string;
  address: string;
  createdAt: string;
  status: string;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  subscriptionPlan: {
    name: string;
    price: number | string;
  } | null;
};

type TVataTableProps = {
  vatas: TVata[];
  search: string;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  isFetching: boolean;

  onSearch: (value: string) => void;
  onPageChange: (page: number) => void;

  onUpdateVata: (id: string) => void;
  onUpdateSubscription: (id: string) => void;
  onExtendSubscription: (id: string) => void;
  onDeactivateVata: (id: string) => void;
  onSuspendVata: (id: string) => void;
};

const formatDate = (date: string | null) => {
  if (!date) return "-";

  return new Intl.DateTimeFormat("bn-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const formatAmount = (amount: number | string) => {
  return Number(amount || 0).toLocaleString("bn-BD");
};

const getPaymentStatus = (
  nextPaymentDate: string | null,
  status: string,
) => {
  if (status !== "ACTIVE") {
    return {
      label: status === "SUSPENDED" ? "সাসপেন্ড" : "নিষ্ক্রিয়",
      className: "bg-gray-100 text-gray-600",
    };
  }

  if (!nextPaymentDate) {
    return {
      label: "তারিখ নেই",
      className: "bg-gray-100 text-gray-600",
    };
  }

  const today = new Date();
  const paymentDate = new Date(nextPaymentDate);

  today.setHours(0, 0, 0, 0);
  paymentDate.setHours(0, 0, 0, 0);

  if (paymentDate < today) {
    return {
      label: "পেমেন্ট বাকি",
      className: "bg-red-50 text-red-600",
    };
  }

  const diffTime =
    paymentDate.getTime() - today.getTime();

  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24),
  );

  if (diffDays <= 7) {
    return {
      label: "শীঘ্রই পেমেন্ট",
      className: "bg-amber-50 text-amber-600",
    };
  }

  return {
    label: "সক্রিয়",
    className: "bg-emerald-50 text-emerald-600",
  };
};

const getPaymentDue = (
  nextPaymentDate: string | null,
  softwareFee: number | string,
  status: string,
) => {
  if (status !== "ACTIVE") return 0;
  if (!nextPaymentDate) return 0;

  const today = new Date();
  const paymentDate = new Date(nextPaymentDate);

  today.setHours(0, 0, 0, 0);
  paymentDate.setHours(0, 0, 0, 0);

  if (paymentDate < today) {
    return Number(softwareFee || 0);
  }

  return 0;
};

const VataTable = ({
  vatas,
  search,
  currentPage,
  itemsPerPage,
  isLoading,
  isFetching,
  onSearch,
  onPageChange,
  onUpdateVata,
  onUpdateSubscription,
  onExtendSubscription,
  onDeactivateVata,
  onSuspendVata,
}: TVataTableProps) => {
  const filteredVatas = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return vatas;
    }

    return vatas.filter((vata) => {
      return (
        vata.vataId?.toLowerCase().includes(searchValue) ||
        vata.nameBangla
          ?.toLowerCase()
          .includes(searchValue) ||
        vata.nameEnglish
          ?.toLowerCase()
          .includes(searchValue) ||
        vata.ownerName
          ?.toLowerCase()
          .includes(searchValue) ||
        vata.address
          ?.toLowerCase()
          .includes(searchValue) ||
        vata.subscriptionPlan?.name
          ?.toLowerCase()
          .includes(searchValue)
      );
    });
  }, [vatas, search]);

  const totalPages = Math.ceil(
    filteredVatas.length / itemsPerPage,
  );

  const paginatedVatas = filteredVatas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-800">
            ভাটার তালিকা
          </h2>

          <p className="mt-0.5 text-xs text-gray-500">
            মোট {filteredVatas.length.toLocaleString("bn-BD")} টি
            ভাটা পাওয়া গেছে
          </p>
        </div>

        <div className="relative w-full md:w-[300px]">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="ভাটা, মালিক বা ঠিকানা খুঁজুন..."
            className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#039A63] focus:bg-white focus:ring-1 focus:ring-[#039A63]"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="space-y-3 p-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : paginatedVatas.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center">
          <Store size={30} className="text-gray-300" />

          <p className="mt-3 text-sm font-medium text-gray-500">
            কোনো ভাটা পাওয়া যায়নি
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1250px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500">
                    ভাটার তথ্য
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    মালিক
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    ঠিকানা
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    সাবস্ক্রিপশন
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    সফটওয়্যার ফি
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    পরবর্তী পেমেন্ট
                  </th>

                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500">
                    পেমেন্ট বাকি
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">
                    স্ট্যাটাস
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500">
                    অ্যাকশন
                  </th>
                </tr>
              </thead>

              <tbody>
                {paginatedVatas.map((vata) => {
                  const paymentStatus = getPaymentStatus(
                    vata.nextPaymentDate,
                    vata.status,
                  );

                  const softwareFee =
                    vata.subscriptionPlan?.price ?? 0;

                  const paymentDue = getPaymentDue(
                    vata.nextPaymentDate,
                    softwareFee,
                    vata.status,
                  );

                  return (
                    <tr
                      key={vata.id}
                      className="border-b border-gray-100 transition hover:bg-gray-50/70"
                    >
                      {/* Vata Info */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10 text-sm font-bold text-[#039A63]">
                            {vata.nameBangla?.charAt(0) || "ভ"}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {vata.nameBangla}
                            </p>

                            <div className="mt-0.5 flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {vata.nameEnglish}
                              </span>

                              <span className="text-gray-300">
                                •
                              </span>

                              <span className="text-[11px] text-gray-400">
                                {vata.vataId}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <UserRound
                            size={15}
                            className="text-gray-400"
                          />

                          <span className="text-sm text-gray-700">
                            {vata.ownerName}
                          </span>
                        </div>
                      </td>

                      {/* Address */}
                      <td className="px-4 py-3.5">
                        <div className="flex max-w-[190px] items-center gap-2">
                          <MapPin
                            size={15}
                            className="shrink-0 text-gray-400"
                          />

                          <span className="truncate text-sm text-gray-600">
                            {vata.address}
                          </span>
                        </div>
                      </td>

                      {/* Subscription */}
                      <td className="px-4 py-3.5">
                        {vata.subscriptionPlan ? (
                          <div>
                            <p className="text-sm font-medium text-gray-700">
                              {vata.subscriptionPlan.name}
                            </p>

                            {vata.subscriptionStart && (
                              <p className="mt-0.5 text-[11px] text-gray-400">
                                শুরু:{" "}
                                {formatDate(
                                  vata.subscriptionStart,
                                )}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            প্ল্যান নেই
                          </span>
                        )}
                      </td>

                      {/* Software Fee */}
                      <td className="px-4 py-3.5 text-right">
                        <span className="text-sm font-semibold text-gray-700">
                          ৳{formatAmount(softwareFee)}
                        </span>
                      </td>

                      {/* Next Payment */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={15}
                            className="text-gray-400"
                          />

                          <span className="text-sm text-gray-700">
                            {formatDate(
                              vata.nextPaymentDate,
                            )}
                          </span>
                        </div>
                      </td>

                      {/* Payment Due */}
                      <td className="px-4 py-3.5 text-right">
                        {paymentDue > 0 ? (
                          <span className="text-sm font-bold text-red-600">
                            ৳{formatAmount(paymentDue)}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-emerald-600">
                            ৳০
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${paymentStatus.className}`}
                        >
                          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />

                          {paymentStatus.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/system/bricks/${vata.id}`}
                            className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-[#039A63]/10 hover:text-[#039A63]"
                          >
                            <Eye size={16} />
                          </Link>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="rounded p-1.5 transition hover:bg-gray-100"
                              >
                                <MoreVertical className="h-4 w-4 cursor-pointer text-gray-600" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="rounded-md border bg-white shadow-md"
                            >
                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateVata(vata.id)
                                }
                              >
                                <CustomDropDownMenuItem
                                  Icon={Pencil}
                                  title="তথ্য আপডেট করুন"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onUpdateSubscription(vata.id)
                                }
                              >
                                <CustomDropDownMenuItem
                                  Icon={CreditCard}
                                  title="সাবস্ক্রিপশন পরিবর্তন করুন"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onExtendSubscription(vata.id)
                                }
                              >
                                <CustomDropDownMenuItem
                                  Icon={CalendarPlus}
                                  title="সাবস্ক্রিপশন মেয়াদ বাড়ান"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onDeactivateVata(vata.id)
                                }
                              >
                                <CustomDropDownMenuItem
                                  Icon={Power}
                                  title="ভাটা Deactivate করুন"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onSuspendVata(vata.id)
                                }
                              >
                                <CustomDropDownMenuItem
                                  Icon={Ban}
                                  title="ভাটা Suspend করুন"
                                />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3.5">
            <p className="text-xs text-gray-500">
              মোট{" "}
              {filteredVatas.length.toLocaleString("bn-BD")} টি
              ভাটা
            </p>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() =>
                  onPageChange(currentPage - 1)
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="px-2 text-xs font-medium text-gray-600">
                {currentPage} / {totalPages || 1}
              </span>

              <button
                type="button"
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  onPageChange(currentPage + 1)
                }
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 disabled:opacity-40"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {isFetching && !isLoading && (
        <div className="border-t border-gray-100 px-5 py-2 text-right text-[11px] text-gray-400">
          তথ্য আপডেট হচ্ছে...
        </div>
      )}
    </div>
  );
};

export default VataTable;