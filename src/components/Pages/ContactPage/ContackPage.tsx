"use client";

import { useMemo, useState } from "react";
import {
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Pencil,
    Search,
    Trash2,
} from "lucide-react";

import { TQuery } from "@/interface/query";
import { useDeleteContactMutation, useGetAllContactsQuery } from "@/redux/features/contact.,features";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import SearchBar from "@/components/Reusable/SearchBar";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import CreateNewContactModal from "@/components/Dashboard/Modals/CreateNewContactModal";
import UpdateContactModal from "@/components/Dashboard/Modals/EditModals/UpdateContactModa";
import Swal from "sweetalert2";
import CustomLoader from "@/components/Reusable/CustomLoader";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { SERVER_ERROR_MESSAGE } from "@/constant";


type TContact = {
    id: string;
    name: string;
    address: string;
    occupation: string;
    phone: string;
};

export default function ContackPage({
    search,
    limit,
    page,
}: TQuery) {
    const [searchItems, setSearchItem] = useState("");
    const { data, isLoading, isError } = useGetAllContactsQuery({ search, limit, page });
    const contacts: TContact[] = data?.data?.data || [];
    const meta = data?.data?.meta as TMetaConfig;
    const [openContactModal, setOpenContactModal] = useState<boolean>(false)
    const [openUpdateContactModal, setOpenUpdateContactModal] = useState<boolean>(false)
    const [selectedContactId, setSelectedContactId] =
        useState<string | null>(null);
    const [deleteContact, { isLoading: isDeleting }] =
        useDeleteContactMutation();

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "আপনি কি নিশ্চিত?",
            text: "এই ফোন নম্বরটি ডিলিট করলে আর ফিরে পাওয়া যাবে না!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#039A63",
            cancelButtonColor: "#d33",
            confirmButtonText: "হ্যাঁ, ডিলেট করুন",
            cancelButtonText: "বাতিল",
        });

        if (!result.isConfirmed) return;

        try {
            await deleteContact(id).unwrap();

            await Swal.fire({
                title: "ডিলিট হয়েছে!",
                text: "ফোন নম্বরটি সফলভাবে ডিলিট করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#039A63",
                confirmButtonText: "ঠিক আছে",
            });
        } catch (error) {
            await Swal.fire({
                title: "দুঃখিত!",
                text: "ফোন নম্বরটি ডিলিট করা যায়নি। আবার চেষ্টা করুন।",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ঠিক আছে",
            });
        }
    };

    return (
        <div className="bg-white rounded-md shadow border">
            <div className="mb-3 flex items-center justify-between p-2">
                <div className="flex-1">
                    <button
                        type="button"
                        onClick={() => setOpenContactModal(true)}
                        className="flex h-9 items-center gap-1 rounded-md bg-[#079b68] px-5 text-[16px] font-medium text-white hover:bg-[#078b5e]"
                    >
                        নতুন নম্বর
                    </button>
                </div>

                <SearchBar
                    value={searchItems}
                    onChange={(e) => setSearchItem(e.target.value)}
                    onClear={() => setSearchItem("")}
                />

            </div>

            {/* Reusable Table */}
            <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] border-collapse">
                    <thead>
                        <tr className="bg-[#079b68] text-white">
                            <TableHead th="#" />
                            <TableHead th="নাম" />
                            <TableHead th="ঠিকানা" />
                            <TableHead th="পেশা" />
                            <TableHead th="ফোন নম্বর" />
                            <TableHead th="বাটন" />
                        </tr>
                    </thead>

                    <tbody>
                        {isLoading ? (
                            <TableLazyLoading
                                smallColumns={6}
                                largeColumns={6}
                                rows={6}
                            />
                        ) : isError ?
                            (
                                <tr>
                                    <td colSpan={6}>
                                        <CustomStatus
                                            type="error"
                                            description={SERVER_ERROR_MESSAGE}
                                        />
                                    </td>
                                </tr>
                            )

                            : !contacts?.length ? (
                                <tr>
                                    <td colSpan={6}>
                                        <CustomStatus
                                            type="empty"
                                            description="কোনো ফোন নম্বর পাওয়া যায়নি"
                                        />
                                    </td>
                                </tr>
                            ) :
                                contacts.map(
                                    (contact, index) => (
                                        <tr
                                            key={contact.id}
                                            className="border-b border-[#e8e8e8]"
                                        >
                                            <TableData
                                                td={index + 1}
                                            />

                                            <TableData
                                                td={contact.name}
                                            />

                                            <TableData
                                                td={contact.address}
                                            />

                                            <TableData
                                                td={
                                                    contact.occupation
                                                }
                                            />

                                            <TableData
                                                td={contact.phone}
                                            />

                                            <td className="px-3 py-3">
                                                <div className="flex items-center justify-center gap-4">
                                                    {/* Edit */}
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setOpenUpdateContactModal(true)
                                                            setSelectedContactId(contact.id)
                                                        }}
                                                        className="text-[#039A63] transition-all duration-200 hover:scale-110"
                                                    >
                                                        <Pencil size={18} strokeWidth={2} />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        disabled={isDeleting}
                                                        onClick={() => handleDelete(contact.id)}
                                                        className="text-[#ff4d4f] transition-all duration-200 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        <Trash2 size={18} strokeWidth={2} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                )
                        }
                    </tbody>
                </table>
            </div>

            <TablePagination
                page={meta?.page ?? 1}
                totalPages={meta?.totalPages ?? 1}
                dataLength={contacts?.length}
                title="নম্বর"
            />

            {openContactModal &&
                <CreateNewContactModal
                    isOpen={openContactModal}
                    onClose={() => setOpenContactModal(false)}
                />
            }
            {openUpdateContactModal &&
                <UpdateContactModal
                    isOpen={openUpdateContactModal}
                    onClose={() => setOpenUpdateContactModal(false)}
                    id={selectedContactId!}
                />
            }
        </div>
    );
}