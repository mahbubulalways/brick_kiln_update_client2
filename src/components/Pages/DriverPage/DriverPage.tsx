"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { Pencil, Trash2 } from "lucide-react";
import CreateDriverModal from "@/components/Dashboard/Modals/CreateDriverModal";
import {
  useDeleteDriverMutation,
  useGetAllDriversQuery,
} from "@/redux/features/driver.features";



import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TDriver } from "@/interface/driver";
import { TQuery } from "@/interface/query";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import EditDriverModal from "@/components/Dashboard/Modals/EditModals/EditDriverModa";
import approvalButtonDisable from "@/utils/approvalButtonDisable";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";

const DriverPage = ({ limit, page, search }: TQuery) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEditModal, setIsOpenEditModal] = useState(false);

  const [driverId, setDriverId] = useState<string>();

  const [deleteDriver, { isLoading: isDeleting, isError }] =
    useDeleteDriverMutation();

  // Get All Drivers
  const { isLoading, data: fetchedData } =
    useGetAllDriversQuery({ page, limit, search });

  const drivers: TDriver[] = fetchedData?.data?.data as TDriver[] || [];
  const meta = fetchedData?.data?.meta as TMetaConfig


  // Delete Driver
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ড্রাইভারটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলেট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      const result = await deleteDriver(id).unwrap();
      await Swal.fire({
        title: "ডিলেট হয়েছে!",
        text: result?.message,
        icon: "success",
        confirmButtonColor: "#039A63",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      await Swal.fire({
        title: "ডিলেট ব্যর্থ হয়েছে!",
        text:
          error?.data?.message ||
          "ড্রাইভারটি ডিলেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-2">
        <h1 className="py-3 text-xl font-semibold text-gray-900">
          ড্রাইভার ম্যানেজমেন্ট
        </h1>

        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer rounded bg-[#039A63] px-4 py-1.5 font-medium text-gray-100"
        >
          + নতুন ড্রাইভার
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-center border-t">
          <thead>
            <tr className="bg-[#039A63] text-center text-white">
              <TableHead th="#" />
              <TableHead th="ড্রাইভারের নাম" />
              <TableHead th="ফোন নম্বর" />
              <TableHead th="বেতন" />
              <TableHead th="বাটন" />
            </tr>
          </thead>

          <tbody className="text-center">
            {isLoading ? (
              <TableLazyLoading
                smallColumns={5}
                largeColumns={5}
                rows={6}
              />
            ) : !drivers?.length ? (
              <tr>
                <td
                  colSpan={5}
                >
                  <CustomStatus
                    type="empty"
                    description="কোনো ড্রাইভারের ডাটা পাওয়া যায়নি"
                  />

                </td>
              </tr>
            ) : isError ? <tr>
              <td
                colSpan={5}
              >
                <CustomStatus
                  type="error"
                />

              </td>
            </tr> : (
              drivers?.map(
                (row: TDriver, index: number) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <TableData
                      td={index + 1}
                    />

                    <TableData td={row.name} />

                    <TableData td={row.PhoneNumber} />

                    <TableData
                      td={`৳ ${row.salary}`}
                    />

                    <td className="border p-2">
                      <div className="flex justify-center gap-3">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpenEditModal(true);
                            setDriverId(row.id);
                          }}

                          disabled={approvalButtonDisable(row?.updateStatus)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          disabled={isDeleting || approvalButtonDisable(row?.deleteStatus)}
                          onClick={() =>
                            handleDelete(row.id)
                          }
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
        dataLength={drivers?.length}
        title="ড্রাইভার"
      />

      {/* Create Modal */}
      {isOpen && (
        <CreateDriverModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      {/* Edit Modal */}
      {isOpenEditModal && (
        <EditDriverModal
          isOpen={isOpenEditModal}
          onClose={() => setIsOpenEditModal(false)}
          id={driverId!}
        />
      )}
    </div>
  );
};

export default DriverPage;