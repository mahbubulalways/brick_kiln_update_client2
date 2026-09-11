"use client";

import { Globe, Mail, Phone } from "lucide-react";
import Image from "next/image";

const SupportPage = () => {
    return (
        <div className="min-h-screen w-full bg-white px-4 py-6">
            {/* Support Image */}
            <div className="flex justify-center">
                <div className="relative h-[180px] w-full max-w-[750px] overflow-hidden rounded-[20px] sm:h-[250px] lg:h-[300px]">
                    <Image
                        src="https://client.itvata.com/assets/helpline-4a3ae01c.jpg"
                        alt="Customer Support"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Title */}
            <div className="mt-10 flex flex-col items-center">
                <h1 className="text-center text-[25px] font-normal leading-[36px] sm:text-[34px] sm:leading-[48px]">
                    <span className="text-[#1F2937]">
                        যে কোন প্রয়োজনে{" "}
                    </span>

                    <span className="text-[#039A63]">
                        যোগাযোগ করুন
                    </span>
                </h1>

                <div className="mt-2 h-[4px] w-[80px] rounded-full bg-[#039A63]" />
            </div>

            {/* Contact Information */}
            <div className="mx-auto mt-10 flex w-fit flex-col gap-4">
                {/* Phone */}
                <div className="flex items-center">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#ECFDF5]">
                        <Phone
                            size={25}
                            strokeWidth={2}
                            className="text-[#00A76F]"
                        />
                    </div>

                    <span className="ml-[15px] text-[17px] text-[#26354A] sm:text-[20px]">
                        +8801918-908070
                    </span>
                </div>

                {/* Website */}
                <div className="flex items-center">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                        <Globe
                            size={25}
                            strokeWidth={2}
                            className="text-[#4385F5]"
                        />
                    </div>

                    <span className="ml-[15px] text-[17px] text-[#26354A] sm:text-[20px]">
                        www.payratech.com
                    </span>
                </div>

                {/* Email */}
                <div className="flex items-center">
                    <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FFF7ED]">
                        <Mail
                            size={24}
                            strokeWidth={2}
                            className="text-[#FF7900]"
                        />
                    </div>

                    <span className="ml-[15px] text-[17px] text-[#26354A] sm:text-[20px]">
                        support@payratech.com
                    </span>
                </div>
            </div>

            {/* Office Time */}
            <div className="mt-7 text-center">
                <p className="text-[15px] text-[#FF7900] sm:text-[17px]">
                    সকাল ৯টা হতে রাত ৮টা
                </p>
            </div>
        </div>
    );
};

export default SupportPage;