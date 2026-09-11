"use client";

import { Plus, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useGetAllVataQuery } from "@/redux/system.features/system.vata.features";

import UpdateVataInformation from "@/components/Dashboard/Modals/PlatformModal/UpdateVataInformation";
import UpdateVataSubscriptionModal from "@/components/Dashboard/Modals/PlatformModal/UpdateVataSubscriptionModal";
import VataSummaryCards from "./VataSummaryCards";
import VataTable from "./VataTable";

type TVata = {
    id: string;
    vataId: string;
    nameBangla: string;
    nameEnglish: string;
    nextPaymentDate: string | null;
    ownerName: string;
    address: string;
    createdAt: string;
    status: string;
    subscriptionStart: string | null;
    subscriptionEnd: string | null;
    subscriptionPlan: {
        name: string;
        price: number | string;
    } | null;
};

const getPaymentDue = (
    nextPaymentDate: string | null,
    softwareFee: number | string,
    status: string,
) => {
    if (status !== "ACTIVE") return 0;
    if (!nextPaymentDate) return 0;

    const today = new Date();
    const paymentDate = new Date(nextPaymentDate);

    today.setHours(0, 0, 0, 0);
    paymentDate.setHours(0, 0, 0, 0);

    if (paymentDate < today) {
        return Number(softwareFee || 0);
    }

    return 0;
};

export default function AllVataPage() {
    const {
        data,
        isLoading,
        isFetching,
    } = useGetAllVataQuery(undefined);

    const vatas: TVata[] = data?.data ?? [];

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [isUpdateVataOpen, setIsUpdateVataOpen] =
        useState(false);

    const [
        isUpdateSubscriptionOpen,
        setIsUpdateSubscriptionOpen,
    ] = useState(false);

    const [selectedVataId, setSelectedVataId] =
        useState("");

    const itemsPerPage = 10;


    const activeVata = vatas.filter(
        (vata) => vata.status === "ACTIVE",
    ).length;

    const totalDueVata = vatas.filter((vata) => {
        const fee = vata.subscriptionPlan?.price ?? 0;

        return (
            getPaymentDue(
                vata.nextPaymentDate,
                fee,
                vata.status,
            ) > 0
        );
    }).length;

    const totalPaymentDue = vatas.reduce(
        (total, vata) => {
            const fee = vata.subscriptionPlan?.price ?? 0;

            return (
                total +
                getPaymentDue(
                    vata.nextPaymentDate,
                    fee,
                    vata.status,
                )
            );
        },
        0,
    );


    const handleSearch = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };


    const handleUpdateVata = (id: string) => {
        setSelectedVataId(id);
        setIsUpdateVataOpen(true);
    };

    const handleCloseUpdateVata = () => {
        setIsUpdateVataOpen(false);
        setSelectedVataId("");
    };


    const handleUpdateSubscription = (id: string) => {
        setSelectedVataId(id);
        setIsUpdateSubscriptionOpen(true);
    };

    const handleCloseUpdateSubscription = () => {
        setIsUpdateSubscriptionOpen(false);
        setSelectedVataId("");
    };


    const handleExtendSubscription = (id: string) => {
        console.log("Extend subscription:", id);
    };

    const handleDeactivateVata = (id: string) => {
        console.log("Deactivate vata:", id);
    };

    const handleSuspendVata = (id: string) => {
        console.log("Suspend vata:", id);
    };

    return (
        <div className="min-h-full space-y-5">
            <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#039A63]/10">
                        <Store
                            size={20}
                            className="text-[#039A63]"
                        />
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">
                            সকল ভাটা
                        </h1>

                        <p className="mt-0.5 text-xs text-gray-500">
                            প্ল্যাটফর্মের সকল ভাটার তথ্য দেখুন ও
                            পরিচালনা করুন
                        </p>
                    </div>
                </div>

                <Link
                    href="/system/bricks/create"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#039A63] px-4 text-sm font-semibold text-white transition hover:bg-[#028653]"
                >
                    <Plus size={17} />
                    নতুন ভাটা
                </Link>
            </div>

            <VataSummaryCards
                totalVata={vatas.length}
                activeVata={activeVata}
                totalDueVata={totalDueVata}
                totalPaymentDue={totalPaymentDue}
            />
            <VataTable
                vatas={vatas}
                search={search}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                isLoading={isLoading}
                isFetching={isFetching}
                onSearch={handleSearch}
                onPageChange={setCurrentPage}
                onUpdateVata={handleUpdateVata}
                onUpdateSubscription={handleUpdateSubscription}
                onExtendSubscription={handleExtendSubscription}
                onDeactivateVata={handleDeactivateVata}
                onSuspendVata={handleSuspendVata}
            />


            {isUpdateVataOpen && (
                <UpdateVataInformation
                    isOpen={isUpdateVataOpen}
                    onClose={handleCloseUpdateVata}
                    id={selectedVataId}
                />
            )}

            {isUpdateSubscriptionOpen && (
                <UpdateVataSubscriptionModal
                    isOpen={isUpdateSubscriptionOpen}
                    onClose={handleCloseUpdateSubscription}
                    id={selectedVataId}
                />
            )}
        </div>
    );
}