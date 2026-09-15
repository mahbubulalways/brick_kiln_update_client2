"use client";

import { useGetMyVataSubcriptionStatusQuery } from "@/redux/features/vata.features";
import { useEffect, useState } from "react";
import SubscriptionExpiredModal from "./SubscriptionExpiredModal";

const SubscriptionGuard = () => {
    const [isExpiredModalOpen, setIsExpiredModalOpen] = useState(false);

    const { data } = useGetMyVataSubcriptionStatusQuery(undefined);
    useEffect(() => {
        if (data?.data?.isExpired) {
            setIsExpiredModalOpen(true);
        }
    }, [data?.data?.isExpired]);

    return (
        <SubscriptionExpiredModal
            isOpen={isExpiredModalOpen}
            onClose={() => setIsExpiredModalOpen(false)}
        />
    );
};

export default SubscriptionGuard;