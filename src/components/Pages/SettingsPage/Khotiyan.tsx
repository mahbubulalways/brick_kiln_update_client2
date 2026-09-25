"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

import KhotiyanModal from "@/components/Dashboard/Modals/KhatiyanModal";
import UpdateKhotiyanModal from "@/components/Dashboard/Modals/EditModals/UpdateKhotiyanModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import { TablePagination } from "@/components/Reusable/TablePagination";
import {
  useDeleteleLedgerMutation,
  useGetAllLedgerPaginationQuery,
} from "@/redux/features/ledger.features";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import SearchBar from "@/components/Reusable/SearchBar";

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
};

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
      await deleteLedger(id).unwrap();

      await Swal.fire({
        title: "ডিলেট হয়েছে!",
        text: "খতিয়ানটি সফলভাবে ডিলেট করা হয়েছে।",
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
    <div className="w-full rounded-lg bg-white p-2 pb-5">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="py-3 text-xl font-semibold text-gray-900">
          খতিয়ান অ্যাড/আপডেট
        </h1>

        <SearchBar
          value={searchItems}
          onChange={(e) => setSearchItem(e.target.value)}
          onClear={() => setSearchItem("")}
        />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded bg-[#039A63] px-4 py-1.5 font-medium text-gray-100 transition hover:bg-[#028554]"
        >
          + নতুন খতিয়ান
        </button>
      </div>

      <div className="w-full">
        <div className="mt-2 w-full overflow-x-auto">
          <table className="min-w-[1200px] border-collapse">
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
                <tr>
                  <td colSpan={12} className="border p-8">
                    <CustomLoader cls="h-[30vh]" />
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td
                    colSpan={12}
                    className="border p-8 text-center text-sm text-gray-500"
                  >
                    {SERVER_ERROR_MESSAGE}
                  </td>
                </tr>
              ) : !ledgers.length ? (
                <tr>
                  <td
                    colSpan={12}
                    className="border p-8 text-center text-sm text-gray-500"
                  >
                    কোনো খতিয়ান পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                ledgers.map((row) => {
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

                      <TableData
                        td={row.name}
                        cls="font-medium"
                      />

                      <TableData td={row.parent?.name || "-"} />

                      <TableData td={phoneNumber} />

                      <TableData
                        td={
                          startDate
                            ? formatBanglaDate({
                              date: startDate,
                            })
                            : "-"
                        }
                      />

                      <TableData td={row.rate ?? 0} />

                      <TableData td={row.quantity ?? 0} />

                      <TableData td={row.salary ?? 0} />

                      <TableData td={row.weeklyFood ?? 0} />

                      <TableData td={row.openingBalance ?? 0} />

                      <TableData
                        td={row.openingBalanceType || "-"}
                      />

                      <td className="border p-2">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            title="এডিট করুন"
                            onClick={() => handleEdit(row.id)}
                            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            title="ডিলেট করুন"
                            disabled={deleteLoading}
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
          dataLength={ledgers.length}
          title="খতিয়ান"
        />
      </div>

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