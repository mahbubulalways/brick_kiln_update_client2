"use client";

import { useMemo, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import KhotiyanModal from "@/components/Dashboard/Modals/KhatiyanModal";
import UpdateKhotiyanModal from "@/components/Dashboard/Modals/EditModals/UpdateKhotiyanModal";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import { TablePagination } from "@/components/Reusable/TablePagination";
import {
  useDeleteleLedgerMutation,
  useGetAllLedgerPaginationQuery,
} from "@/redux/features/ledger.features";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import SearchBar from "@/components/Reusable/SearchBar";
import { TApprovalStatus } from "@/interface/approval";
import approvalButtonDisable from "@/utils/approvalButtonDisable";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TLedger = {
  id: number;
  name: string;
  parentId?: number | null;

  parent?: {
    id: number;
    name: string;
    phoneNumber: string;
    startDate: string;
  } | null;

  rate?: number;
  quantity?: number;
  salary?: number;
  weeklyFood?: number;
  openingBalance?: number;
  openingBalanceType?: string;

  serial: number;
  phoneNumber: string;
  startDate: string;
  deleteStatus: TApprovalStatus;
  updateStatus: TApprovalStatus;
};

type TSortOption =
  | "default"
  | "name_asc"
  | "name_desc"
  | "id_asc"
  | "id_desc";

const sortOptions: {
  label: string;
  value: TSortOption;
}[] = [
    { label: "ডিফল্ট", value: "default" },
    { label: "নাম (A-Z)", value: "name_asc" },
    { label: "নাম (Z-A)", value: "name_desc" },
    { label: "ID (ছোট-বড়)", value: "id_asc" },
    { label: "ID (বড়-ছোট)", value: "id_desc" },
  ];

const Khotiyan = ({
  limit = 10,
  page = 1,
  search = "",
}: TQuery = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [searchItems, setSearchItem] = useState("");
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(
    null,
  );
  const [sortBy, setSortBy] = useState<TSortOption>("default");

  const { data, isLoading, isError } = useGetAllLedgerPaginationQuery(
    {
      limit,
      page,
      search,
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [deleteLedger, { isLoading: deleteLoading }] =
    useDeleteleLedgerMutation();

  const ledgers = (data?.data?.data ?? []) as TLedger[];
  const meta = data?.data?.meta as TMetaConfig;

  const sortedLedgers = useMemo(() => {
    if (sortBy === "default") return ledgers;

    const [field, order] = sortBy.split("_");
    const multiplier = order === "asc" ? 1 : -1;

    return [...ledgers].sort((a, b) => {
      if (field === "name") {
        return a.name.localeCompare(b.name, "bn") * multiplier;
      }

      return (a.serial - b.serial) * multiplier;
    });
  }, [ledgers, sortBy]);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই খতিয়ানটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলেট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteLedger(id).unwrap();

      await Swal.fire({
        title: "ডিলেট হয়েছে!",
        text: response?.message,
        icon: "success",
        confirmButtonColor: "#039A63",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      await Swal.fire({
        title: "ব্যর্থ!",
        text: error?.data?.message || "খতিয়ানটি ডিলেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  const handleEdit = (id: number) => {
    setSelectedLedgerId(id);
    setUpdateOpen(true);
  };

  const handleUpdateClose = () => {
    setUpdateOpen(false);
    setSelectedLedgerId(null);
  };

  return (
    <div className="w-full rounded-lg bg-white pb-5">
      <div className="mb-4 flex w-full flex-nowrap items-center gap-3 p-2">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as TSortOption)}
          className="h-9 shrink-0 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none transition focus:border-[#039A63]"
        >
          {sortOptions.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>

        <div className="min-w-0 flex-1">
          <SearchBar
            value={searchItems}
            onChange={(e) => setSearchItem(e.target.value)}
            onClear={() => setSearchItem("")}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-9 shrink-0 cursor-pointer rounded bg-[#039A63] px-4 text-sm font-medium text-white transition hover:bg-[#028554]"
        >
          + নতুন খতিয়ান
        </button>
      </div>

      <div className="overflow-x-auto rounded-md border bg-white">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#039A63] text-center text-white">
              <TableHead th="#" />
              <TableHead th="খতিয়ানের নাম" />
              <TableHead th="গ্রুপ" />
              <TableHead th="ফোন নম্বর" />
              <TableHead th="তারিখ" />
              <TableHead th="রেট" />
              <TableHead th="পরিমাণ" />
              <TableHead th="বেতন" />
              <TableHead th="সাপ্তাহিক খোরাকি" />
              <TableHead th="ওপেনিং ব্যালেন্স" />
              <TableHead th="ধরন" />
              <TableHead th="বাটন" />
            </tr>
          </thead>

          <tbody className="text-center">
            {isLoading ? (
              <TableLazyLoading
                smallColumns={12}
                largeColumns={12}
                rows={6}
              />
            ) : isError ? (
              <tr>
                <td colSpan={12}>
                  <CustomStatus type="error" />
                </td>
              </tr>
            ) : !sortedLedgers.length ? (
              <tr>
                <td colSpan={12}>
                  <CustomStatus type="empty" />
                </td>
              </tr>
            ) : (
              sortedLedgers.map((row) => {
                const phoneNumber =
                  row.phoneNumber || row.parent?.phoneNumber || "-";

                const startDate =
                  row.startDate || row.parent?.startDate || null;

                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableData td={row.serial} />

                    <TableData td={row.name} cls="font-medium" />

                    <TableData td={row.parent?.name || "-"} />

                    <TableData td={phoneNumber} />

                    <TableData
                      td={
                        startDate
                          ? formatBanglaDate({ date: startDate })
                          : "-"
                      }
                    />

                    <TableData td={row.rate ?? 0} />

                    <TableData td={row.quantity ?? 0} />

                    <TableData td={row.salary ?? 0} />

                    <TableData td={row.weeklyFood ?? 0} />

                    <TableData td={row.openingBalance ?? 0} />

                    <TableData td={row.openingBalanceType || "-"} />

                    <td className="border p-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          title="এডিট করুন"
                          disabled={approvalButtonDisable(
                            row?.updateStatus,
                          )}
                          onClick={() => handleEdit(row.id)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        <button
                          type="button"
                          title="ডিলেট করুন"
                          disabled={
                            deleteLoading ||
                            approvalButtonDisable(row?.deleteStatus)
                          }
                          onClick={() => handleDelete(row.id)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        page={meta?.page ?? 1}
        totalPages={meta?.totalPages ?? 1}
        dataLength={sortedLedgers.length}
        title="খতিয়ান"
      />

      {isOpen && (
        <KhotiyanModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      <UpdateKhotiyanModal
        isOpen={updateOpen}
        onClose={handleUpdateClose}
        ledgerId={selectedLedgerId}
      />
    </div>
  );
};

export default Khotiyan;
