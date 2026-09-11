"use client";

import React, { useState } from "react";
import {
    FilePen,
    MoreVertical,
    Trash2,
} from "lucide-react";
import Swal from "sweetalert2";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateFolderNameModal from "@/components/Dashboard/Modals/EditModals/UpdateFolderNameModal";
import { useDeleteFolderMutation } from "@/redux/features/document.features";

interface FolderData {
    id: string;
    name: string;
}

interface CommonFolderActionMenuProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    folder: FolderData;
}

export const CommonFolderActionMenu = ({
    folder,
    className,
    ...props
}: CommonFolderActionMenuProps) => {
    const [openEditModal, setEditModal] = useState<boolean>(false)

    const [deleteFolder, { isLoading }] =
        useDeleteFolderMutation();


    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: `"${folder.name}" ফোল্ডারটি ডিলেট করলে এর তথ্য আর ফিরে পাওয়া যাবে না!`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteFolder(folder.id).unwrap();
            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "ফোল্ডারটি সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "ফোল্ডারটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        {...props}
                        className={className}
                    >
                        <MoreVertical
                            size={18}
                            className="opacity-100"
                        />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-48"
                >
                    {/* Update */}
                    <DropdownMenuItem
                        onClick={() => setEditModal(true)}
                        className="cursor-pointer gap-2"
                    >
                        <FilePen size={16} />
                        <span className="text-sm">নাম পরিবর্তন</span>
                    </DropdownMenuItem>

                    {/* Delete */}
                    <DropdownMenuItem
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                    >
                        <Trash2 size={16} />
                        <span className="text-sm">
                            {isLoading ? "ডিলেট হচ্ছে..." : "ডিলেট করুন"}
                        </span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {
                openEditModal &&
                <UpdateFolderNameModal
                    id={folder.id}
                    isOpen={openEditModal}
                    onClose={() => setEditModal(false)}
                />
            }
        </div>
    );
};