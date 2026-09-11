"use client";

import React from "react";
import { Download, MoreVertical, Trash2 } from "lucide-react";
import FileSaver from "file-saver";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import documentUrl from "@/utils/documentUrl";
import Swal from "sweetalert2";
import { useDeleteFileMutation } from "@/redux/features/document.features";

interface FileData {
    id: number | string;
    name: string;
    url?: string;
    path?: string;
}

interface CommonActionMenuProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    file: FileData;
}

export const CommonActionMenu = ({
    file,
    className,
    ...props
}: CommonActionMenuProps) => {
    const [deleteFile, { isLoading,error }] = useDeleteFileMutation()
    const handleDownload = () => {
        if (!file.name) return;

        const url = documentUrl(file.name);

        FileSaver.saveAs(
            url,
            file.name.split("-").pop() || file.name
        );
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই ফাইলটি ডিলেট করলে এটি আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteFile(file.id).unwrap();

            await Swal.fire({
                title: "ডিলেট হয়েছে!",
                text: "ফাইলটি সফলভাবে ডিলেট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error: any) {
            await Swal.fire({
                title: "ব্যর্থ!",
                text:
                    error?.data?.message ||
                    "ফাইলটি ডিলেট করা সম্ভব হয়নি।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className={className}
                    {...props}
                >
                    <MoreVertical
                        size={18}
                        className="opacity-100"
                    />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40"
            >
                <DropdownMenuItem
                    onClick={handleDownload}
                    className="cursor-pointer gap-2"
                >
                    <Download size={16} />
                    <span>Download</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={handleDelete}
                    className="cursor-pointer gap-2 text-red-600 focus:bg-red-50 focus:text-red-600"
                >
                    <Trash2 size={16} />
                    <span>Delete</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};