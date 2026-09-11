"use client";

import {
    BadgeInfo,
    FileText,
    MapPin,
    Phone,
    UserRound,
} from "lucide-react";

interface PersonalInfoCardProps {
    id: string;
    name: string;
    phone: string;
    address: string;
    description?: string;
}

const PersonalInfoCard = ({
    id,
    name,
    phone,
    address,
    description,
}: PersonalInfoCardProps) => {
    return (
        <div className="overflow-hidden rounded-2xl bg-white shadow-[0_8px_25px_rgba(0,0,0,0.08)]">
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-[#e5eaf0] px-7 py-6">
                <UserRound
                    size={25}
                    strokeWidth={1.8}
                    className="text-[#009bc2]"
                />

                <h2 className="text-[19px] font-semibold text-[#344054]">
                    ব্যক্তিগত তথ্য
                </h2>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 gap-x-10 gap-y-7 p-7 md:grid-cols-2">
                {/* <InfoItem
                    icon={<BadgeInfo size={18} />}
                    label="আইডি"
                    value={id}
                /> */}

                <InfoItem
                    icon={<UserRound size={18} />}
                    label="নাম"
                    value={name}
                />

                <InfoItem
                    icon={<MapPin size={18} />}
                    label="ঠিকানা"
                    value={address}
                />

                <InfoItem
                    icon={<Phone size={18} />}
                    label="ফোন নম্বর"
                    value={phone}
                />

                <div className="md:col-span-2">
                    <InfoItem
                        icon={<FileText size={18} />}
                        label="বিবরণ"
                        value={description || "-"}
                    />
                </div>
            </div>
        </div>
    );
};

const InfoItem = ({
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

export default PersonalInfoCard;