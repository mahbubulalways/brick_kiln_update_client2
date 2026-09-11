"use client";

import Marquee from "react-fast-marquee";
import { Megaphone } from "lucide-react";

interface NoticeMarqueeProps {
    message?: string | null;
}

const NoticeMarquee = ({ message }: NoticeMarqueeProps) => {
    if (!message?.trim()) return null;

    return (
        <div className="mb-3 flex h-9 w-full overflow-hidden  border border-[#039A63]/20 bg-[#039A63]/5">
            <div className="z-10 flex h-9 shrink-0 items-center gap-2 bg-[#039A63] px-3 text-white shadow-sm">
                <Megaphone className="h-4 w-4" />

                <span className="whitespace-nowrap text-xs font-semibold">
                    নোটিশ
                </span>
            </div>

            <div className="min-w-0 flex-1 overflow-hidden">
                <Marquee
                    direction="left"
                    speed={40}
                    pauseOnHover
                    gradient={false}
                    className="h-9"
                >
                    <span className="px-6 text-[12px] font-medium text-gray-700">
                        {message}
                    </span>
                </Marquee>
            </div>
        </div>
    );
};

export default NoticeMarquee;