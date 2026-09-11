"use client";

import {
    CalendarDays,
    FileText,
    UserRound,
} from "lucide-react";

interface DueDetailsCardProps {
    transactionDate: string;
    paymentDate: string;
    witnessOne?: string;
    witnessTwo?: string;
}

const formatDate = (date: string) => {
    if (!date) return "-";

    return new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(date));
};

const DueDetailsCard = ({
    transactionDate,
    paymentDate,
    witnessOne,
    witnessTwo,
}: DueDetailsCardProps) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5eaf0] px-7 py-6">
                <FileText
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#009bc2]"
                />

                <h2 className="text-[19px] font-semibold text-[#344054]">
                    ঋণ বিবরণ
                </h2>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-7 p-7 md:grid-cols-2">
                <DetailItem
                    icon={<CalendarDays size={18} />}
                    label="ঋণের তারিখ"
                    value={formatDate(transactionDate)}
                />

                <DetailItem
                    icon={<UserRound size={18} />}
                    label="সাক্ষী ১"
                    value={witnessOne || "-"}
                />

                <DetailItem
                    icon={<CalendarDays size={18} />}
                    label="পরিশোধের তারিখ"
                    value={formatDate(paymentDate)}
                />

                <DetailItem
                    icon={<UserRound size={18} />}
                    label="সাক্ষী ২"
                    value={witnessTwo || "-"}
                />
            </div>
        </div>
    );
};

const DetailItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2 text-[14px] font-medium text-[#91a4bf]">
                {icon}

                <span>{label}</span>
            </div>

            <p className="pl-7 text-[15px] text-[#344054]">
                {value}
            </p>
        </div>
    );
};

export default DueDetailsCard;