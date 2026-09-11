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

type TLedger = {
  id: number;
  name: string;
  parentId?: number | null;
  parent?: {
    id: number;
    name: string;
  } | null;
  rate?: number;
  quantity?: number;
  serial: number;
};

const Khotiyan = ({
  limit = 10,
  page = 1,
  search = "",
}: TQuery = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);
  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(
    null,
  );

  const {
    data,
    isLoading,
    isError,
  } = useGetAllLedgerPaginationQuery(
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
        text:
          error?.data?.message || "খতিয়ানটি ডিলেট করা সম্ভব হয়নি।",
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
    <div className="rounded-lg bg-white p-2">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="py-3 text-xl font-semibold text-gray-900">
          খতিয়ান অ্যাড/আপডেট
        </h1>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded bg-[#039A63] px-4 py-1.5 font-medium text-gray-100"
        >
          + নতুন খতিয়ান
        </button>
      </div>

      <div className=" rounded-lg border border-gray-200">
        <table className="min-w-full border-collapse overflow-x-auto">
          <thead>
            <tr className="bg-[#119f70] text-center text-white">
              <TableHead th="#" />
              <TableHead th="খতিয়ানের নাম" />
              <TableHead th="গ্রুপ" />
              <TableHead th="রেট" />
              <TableHead th="পরিমাণ" />
              <TableHead th="বাটন" />
            </tr>
          </thead>

          <tbody className="text-center">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="border p-8">
                  <CustomLoader cls="h-[30vh]" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={6}
                  className="border p-8 text-center text-sm text-gray-500"
                >
                  {SERVER_ERROR_MESSAGE}
                </td>
              </tr>
            ) : !ledgers.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="border p-8 text-center text-sm text-gray-500"
                >
                  কোনো খতিয়ান পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              ledgers.map((row) => (
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

                  <TableData td={row.rate ?? 0} />

                  <TableData td={row.quantity ?? 0} />

                  <td className="border p-2">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        className="cursor-pointer text-blue-600 transition hover:text-blue-800"
                        onClick={() => handleEdit(row.id)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        disabled={deleteLoading}
                        className="cursor-pointer text-red-600 transition hover:text-red-800 disabled:opacity-50"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

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
          showRateQuantity={true}
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