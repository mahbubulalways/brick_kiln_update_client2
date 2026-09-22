"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import ReceivableAndPayableModal from "@/components/Dashboard/Modals/ReceivableAndPayableModal";
import { useGetAllDueMateQuery } from "@/redux/features/due_mate.features";
import { IReceivablePayable } from "@/interface/due_mate";

import GivenDueList from "./GivenDueList";
import TakenDueList from "./TakenDueList";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

import CommonPrint, {
    TCommonPrintRef,
} from "@/components/Reusable/CommonPrint";

import DueMatePrint from "./DueMatePrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";

export default function ReceivableAndPayablePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [printId, setPrintId] = useState<string | null>(null);

    const printRef = useRef<TCommonPrintRef>(null);

    const { data: vata } = useGetVataInfoQuery(undefined);

    const {
        data,
        isError,
        isLoading,
    } = useGetAllDueMateQuery({});



    const handlePrint = (id: string) => {
        setPrintId(id);
        printRef.current?.print()
    };

    if (isLoading) {
        return (
            <div className="bg-white">
                <CustomLoader cls="h-[30vh]" />
            </div>
        );
    }

    if (isError) {
        return <CustomStatus type="error" />;
    }

    const allDues =
        (data?.data as IReceivablePayable[]) || [];

    const search = searchTerm.trim().toLowerCase();

    const filteredDues = allDues.filter((item) => {
        if (!search) return true;

        return (
            item.name?.toLowerCase().includes(search) ||
            item.phone?.toLowerCase().includes(search) ||
            item.address?.toLowerCase().includes(search)
        );
    });

    const givenDues = filteredDues.filter(
        (item) => item.transactionType === "GIVEN"
    );

    const takenDues = filteredDues.filter(
        (item) => item.transactionType === "TAKEN"
    );

    return (
        <div className="min-h-screen rounded-xl bg-white p-2">
            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="
                        w-full cursor-pointer
                        rounded-md bg-[#039a63]
                        px-5 py-2
                        text-sm font-medium text-white
                        transition hover:bg-[#028756]
                        sm:w-auto
                    "
                >
                    দেনা-পাওনা
                </button>

                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="নাম, ফোন বা ঠিকানা দিয়ে খুঁজুন..."
                        className="
                            h-10 w-full
                            rounded-md border border-gray-300
                            bg-white
                            pl-9 pr-4
                            text-sm
                            outline-none
                            transition
                            focus:border-[#039a63]
                            focus:ring-1 focus:ring-[#039a63]
                        "
                    />
                </div>
            </div>

            <ReceivableAndPayableModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />

            <div className="grid grid-cols-1 gap-10 pt-8 md:gap-5 xl:grid-cols-2">
                <GivenDueList
                    dues={givenDues}
                    onPrint={handlePrint}
                />

                <TakenDueList
                    dues={takenDues}
                    onPrint={handlePrint}
                />
            </div>

            {printId && (
                <CommonPrint
                    ref={printRef}
                    title="দেনা-পাওনা হিসাব"
                >
                    <DueMatePrint
                        key={printId}
                        id={printId}
                        vataInformation={vata?.data}
                    />
                </CommonPrint>
            )}
        </div>
    );
}