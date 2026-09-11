"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  FileText,
  Repeat2,
  Trash2,
  UserRound,
  Check,
  Zap,
} from "lucide-react";

import {
  useGetPendingTasksQuery,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "@/redux/features/task.features";
import UpdateTaskModal from "@/components/Dashboard/Modals/EditModals/UpdateTaskModal";
import Swal from "sweetalert2";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { showToast } from "@/components/Toast/CustomToast";
import moment from "moment";

export interface Task {
  id: string;
  description: string;
  repeat: string;
  userId: string;
  date: string;
  status: "PENDING" | "COMPLETE";
  user?: {
    id: string;
    name: string;
  };
}

export default function IncompleteTasks({ date }: { date: string }) {
  const {
    data,
    isLoading,
    isError, error
  } = useGetPendingTasksQuery({ date }, { refetchOnMountOrArgChange: true });
  const [selectedTaskId, setSelectedTaskId] =
    useState<string | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] =
    useState(false);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks: Task[] = data?.data ?? [];

  // ==========================================
  // Complete Task
  // ==========================================
  const handleToggle = async (id: string) => {
    try {
      const result = await updateTask({
        id,
        data: {
          status: "COMPLETE",
        },
      }).unwrap();

      if (result?.success) {
        showToast({
          title: "কাজটি সম্পূর্ণ  করা হয়েছে।",
          type: "success",
        });
      }
    } catch (error) {
      showToast({
        title: "কাজটি সম্পূর্ণ করা সম্ভব হয়নি।",
        type: "error",
      });
    }
  };

  // ==========================================
  // Delete Task
  // ==========================================
  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই কাজটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলেট করুন",
      cancelButtonText: "বাতিল",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTask(id).unwrap();

      await Swal.fire({
        title: "ডিলেট হয়েছে!",
        text: "কাজটি সফলভাবে ডিলেট করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#039A63",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      await Swal.fire({
        title: "ডিলেট ব্যর্থ!",
        text:
          error?.data?.message ||
          "কাজটি ডিলেট করা সম্ভব হয়নি।",
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };

  return (
    <section>
      <h2 className="mb-3 text-[18px] font-semibold text-gray-900 sm:mb-4 sm:text-[22px]">
        অসম্পূর্ণ কাজ
      </h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="bg-[#119f70] text-left text-[13px] text-white sm:text-[15px]">
              {/* Description */}
              <th className="border-r border-[#0f8e64] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 font-semibold sm:gap-2">
                  <FileText size={15} className="sm:h-[17px] sm:w-[17px]" />
                  কাজের বিবরণ
                </div>
              </th>

              {/* Repeat */}
              <th className="border-r border-[#0f8e64] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 font-semibold sm:gap-2">
                  <Repeat2 size={15} className="sm:h-[17px] sm:w-[17px]" />
                  পুনরাবৃত্তি পরিয়ড
                </div>
              </th>

              {/* User */}
              <th className="border-r border-[#0f8e64] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 font-semibold sm:gap-2">
                  <UserRound size={15} className="sm:h-[17px] sm:w-[17px]" />
                  ব্যক্তি
                </div>
              </th>

              {/* Date */}
              <th className="border-r border-[#0f8e64] px-3 py-2.5 sm:px-4 sm:py-3">
                <div className="flex items-center gap-1.5 font-semibold sm:gap-2">
                  <CalendarDays size={15} className="sm:h-[17px] sm:w-[17px]" />
                  তারিখ
                </div>
              </th>

              {/* Actions */}
              <th className="px-3 py-2.5 text-center sm:px-4 sm:py-3">
                <div className="flex items-center justify-center gap-1.5 font-semibold sm:gap-2">
                  <Zap size={15} className="sm:h-[17px] sm:w-[17px]" />
                  বাটন
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ?
              <tr>
                <td colSpan={5}>
                  <CustomLoader cls="h-[30vh]" />
                </td>
              </tr>
              : isError ?
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-10 text-center text-sm text-gray-500"
                  >
                    কোনো অসম্পূর্ণ কাজ পাওয়া যায়নি।
                  </td>
                </tr>
                : !tasks.length ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-3 py-8 text-center text-[13px] text-gray-500 sm:px-4 sm:py-10 sm:text-sm"
                    >
                      কোনো অসম্পূর্ণ কাজ পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      {/* Description */}
                      <td className="px-3 py-2.5 sm:py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggle(task.id)}
                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition hover:border-[#039a63]"
                          >
                            {task.status === "COMPLETE" && (
                              <Check size={13} />
                            )}
                          </button>

                          <span className="text-[13px] text-gray-800 sm:text-[15px]">
                            {task.description}
                          </span>
                        </div>
                      </td>

                      {/* Repeat */}
                      <td className="whitespace-nowrap px-3 py-2.5 text-[13px] sm:py-3 sm:text-[15px]">
                        {task.repeat}
                      </td>

                      {/* User */}
                      <td className="px-3 py-2.5 sm:py-3">
                        <div className="relative max-w-[250px]">
                          <select
                            value={task.user?.id ?? task.userId}
                            disabled
                            className="w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 py-1.5 pr-8 text-[13px] outline-none disabled:cursor-not-allowed disabled:bg-gray-50 sm:py-2 sm:text-sm"
                          >
                            <option value={task.user?.id ?? task.userId}>
                              {task.user?.name || "-"}
                            </option>
                          </select>

                          <ChevronDown
                            size={15}
                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 sm:h-[17px] sm:w-[17px]"
                          />
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-3 py-2.5 sm:py-3">
                       {moment(task?.date).format("l")}
                      </td>

                      {/* Actions */}
                      <td className="px-3 py-2.5 sm:py-3">
                        <div className="flex justify-center gap-1.5 sm:gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedTaskId(task.id);
                              setIsUpdateModalOpen(true);
                            }}
                            className="flex h-8 cursor-pointer w-8 items-center justify-center rounded-lg bg-[#dcfce9] text-[#039a63] hover:bg-[#c9f7dc] sm:h-9 sm:w-9"
                          >
                            <Edit size={15} className="sm:h-[17px] sm:w-[17px]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(task.id)}
                            className="flex h-8 cursor-pointer w-8 items-center justify-center rounded-lg bg-[#ffe1e5] text-[#ff3b30] hover:bg-[#ffd3d8] sm:h-9 sm:w-9"
                          >
                            <Trash2 size={15} className="sm:h-[17px] sm:w-[17px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
          </tbody>
        </table>
      </div>
      {
        isUpdateModalOpen && <UpdateTaskModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedTaskId(null);
          }}
          taskId={selectedTaskId}
        />
      }
    </section>
  );
}