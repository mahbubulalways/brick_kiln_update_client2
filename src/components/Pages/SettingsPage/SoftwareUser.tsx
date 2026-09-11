"use client";

import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import SoftwareUserModal from "@/components/Dashboard/Modals/SoftwareUserModal";
import SoftwareUserUpdateModal from "@/components/Dashboard/Modals/EditModals/SoftwareUserUpdateModal";

import CustomLoader from "@/components/Reusable/CustomLoader";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";

import { useDeleteUserMutation, useGetAllUsersQuery } from "@/redux/features/user.features";
import { IUser } from "@/interface/user";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import Swal from "sweetalert2";

const SoftwareUser = () => {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useGetAllUsersQuery(undefined);

 const [deleteUser, { isLoading: isDeleting }] =
  useDeleteUserMutation();


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
    await deleteUser(id).unwrap();

    await Swal.fire({
      title: "ডিলেট হয়েছে!",
      text: "ইউজারটি সফলভাবে ডিলেট করা হয়েছে।",
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

      default:
        return role;
    }
  };

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
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
      <div className="overflow-x-auto rounded-t-md border">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#039A63] text-center text-white">
              <TableHead th="#" />
              <TableHead th="নাম" />
              <TableHead th="ইউজারনেম" />
              <TableHead th="ইউজারের ধরন" />
              <TableHead th="বাটন" />
            </tr>
          </thead>

          <tbody className="text-center">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="border p-8">
                  <CustomLoader cls="h-[30vh]" />
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td
                  colSpan={5}
                  className="border p-8 text-center text-sm text-gray-500"
                >
                  {SERVER_ERROR_MESSAGE}
                </td>
              </tr>
            ) : !users.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="border p-8 text-center text-sm text-gray-500"
                >
                  কোনো ইউজার পাওয়া যায়নি।
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

                  {/* Role */}
                  <TableData td={getRoleLabel(row.role)} />

                  {/* Actions */}
                  <td className="border px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit */}
                      <button
                        type="button"
                        onClick={() => handleEditUser(row)}
                        className="cursor-pointer rounded p-1.5 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteUser(row.id)}
                        className="cursor-pointer rounded p-1.5 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
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