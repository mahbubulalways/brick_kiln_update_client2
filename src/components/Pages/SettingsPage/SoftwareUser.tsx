"use client";

import { useState } from "react";
import { LockIcon, Pencil, Trash2 } from "lucide-react";

import SoftwareUserModal from "@/components/Dashboard/Modals/SoftwareUserModal";
import SoftwareUserUpdateModal from "@/components/Dashboard/Modals/EditModals/SoftwareUserUpdateModal";

import CustomLoader from "@/components/Reusable/CustomLoader";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";

import { useDeleteUserMutation, useGetAllUsersQuery, useUnblockUserMutation } from "@/redux/features/user.features";
import { IUser } from "@/interface/user";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import Swal from "sweetalert2";
import approvalButtonDisable from "@/utils/approvalButtonDisable";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { getUserInformation } from "@/service/auth.services";

const SoftwareUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery(undefined);

  const [deleteUser, { isLoading: isDeleting }] =
    useDeleteUserMutation();
  const [unblockUser, { isLoading: isUnblocking }] =
    useUnblockUserMutation();


  const users = (data?.data ?? []) as IUser[];

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  // =========================
  // Add User
  // =========================
  const handleAddUser = () => {
    setSelectedUser(null);
    setIsOpen(true);
  };

  // =========================
  // Edit User
  // =========================
  const handleEditUser = (user: IUser) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  // =========================
  // Close Modal
  // =========================
  const handleCloseModal = () => {
    setIsOpen(false);
    setSelectedUser(null);
  };

  // =========================
  // Delete User
  // =========================

  const handleDeleteUser = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ইউজারটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলেট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteUser(id).unwrap();

      await Swal.fire({
        title: "ডিলেট হয়েছে!",
        text: response?.message,
        icon: "success",
        confirmButtonColor: "#039A63",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      await Swal.fire({
        title: "ব্যর্থ!",
        text:
          error?.data?.message ||
          "ইউজারটি ডিলেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };


  // 
  const handleUnblockUser = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ইউজারের অ্যাকাউন্ট আনব্লক করতে চান?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, আনব্লক করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await unblockUser(id).unwrap();

      await Swal.fire({
        title: "সফল হয়েছে!",
        text: response?.message || "অ্যাকাউন্ট আনব্লক করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#039A63",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      await Swal.fire({
        title: "ব্যর্থ!",
        text:
          error?.data?.message ||
          "অ্যাকাউন্ট আনব্লক করা যায়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };
  // =========================
  // Role Label
  // =========================
  const getRoleLabel = (role: IUser["role"]) => {
    switch (role) {
      case "OWNER":
        return "মালিক";

      case "ADMIN":
        return "অ্যাডমিন";

      case "MANAGER":
        return "ম্যানেজার";
      case "OPERATOR":
        return "অপারেটর";

      default:
        return role;
    }
  };

  const currentUserRole = getUserInformation().role

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <h1 className="text-xl font-semibold text-gray-900">
          সফটওয়্যার ইউজার
        </h1>

        <button
          type="button"
          onClick={handleAddUser}
          className="cursor-pointer rounded bg-[#039A63] px-4 py-1.5 font-medium text-white transition hover:bg-[#028653]"
        >
          + নতুন ইউজার
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#039A63] text-center text-white">
              <TableHead th="#" />
              <TableHead th="নাম" />
              <TableHead th="ইউজারনেম" />
              <TableHead th="ইমেইল" />
              <TableHead th="ইউজারের ধরন" />
              <TableHead th="স্ট্যাটাস" />
              <TableHead th="ব্লক টাইম" />
              <TableHead th="মোট চেষ্টা" />
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
            ) : isError ? (
              <tr>
                <td
                  colSpan={5}
                >
                  <CustomStatus
                    type="error"
                  />
                </td>
              </tr>
            ) : !users.length ? (
              <tr>
                <td
                  colSpan={5}
                >
                  <CustomStatus
                    type="empty"
                  />
                </td>
              </tr>
            ) : (
              users.map((row, index) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  {/* Serial */}
                  <TableData td={index + 1} />

                  {/* Name */}
                  <TableData td={row.name} />

                  {/* Username */}
                  <TableData td={row.username} />
                  <TableData td={row.email} />

                  {/* Role */}
                  <TableData td={getRoleLabel(row.role)} />
                  <TableData
                    td={
                      row?.loginLimits?.status === true
                        ? "ব্লক"
                        : row?.loginLimits?.status === false
                          ? "চালু"
                          : "-"
                    }
                  />
                  <TableData td={row?.loginLimits?.blockTime ?
                    formatBanglaDate({ date: row?.loginLimits?.blockTime, showTime: true }) : "-"} />
                  <TableData td={row?.loginLimits?.totalTry || "-"} />


                  {/* Actions */}
                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        disabled={approvalButtonDisable(row?.updateStatus)}
                        type="button"
                        onClick={() => handleEditUser(row)}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-blue-200 bg-blue-50 text-blue-600 transition-all duration-200 hover:border-blue-300 hover:bg-blue-100 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        disabled={isDeleting
                          || approvalButtonDisable(row?.deleteStatus)
                        }
                        onClick={() => handleDeleteUser(row.id)}
                        className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-red-200 bg-red-50 text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                      {row?.loginLimits?.status === true &&
                        (currentUserRole === "ADMIN" || currentUserRole === "OWNER") ? (
                        <button
                          type="button"
                          disabled={isUnblocking}
                          onClick={() => handleUnblockUser(row.id)}
                          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-green-200 bg-green-50 text-[#039A63] transition-all duration-200 hover:border-green-300 hover:bg-green-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <LockIcon size={16} />
                        </button>
                      ) : ""}

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================
          Add User Modal
      ========================= */}
      {isOpen && !selectedUser && (
        <SoftwareUserModal
          isOpen={isOpen}
          onClose={handleCloseModal}
        />
      )}

      {/* =========================
          Update User Modal
      ========================= */}
      {isOpen && selectedUser && (
        <SoftwareUserUpdateModal
          isOpen={isOpen}
          onClose={handleCloseModal}
          userId={selectedUser.id}
        />
      )}
    </div>
  );
};

export default SoftwareUser;