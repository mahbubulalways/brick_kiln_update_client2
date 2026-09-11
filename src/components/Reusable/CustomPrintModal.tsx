"use client";

import { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

type TModalWidth = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

export type TCustomPrintModal = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
    width?: TModalWidth;
};

const widthClasses: Record<TModalWidth, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    xxl: "max-w-3xl",
    full: "max-w-[95vw]",
};

const CustomPrintModal = ({
    isOpen,
    onClose,
    children,
    title = "চালান প্রিন্ট",
    width = "xxl",
}: TCustomPrintModal) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-2 sm:p-4"
            onClick={onClose}
        >
            <div
                className={`
                    relative
                    flex
                    max-h-[94vh]
                    w-full
                    ${widthClasses[width]}
                    flex-col
                    overflow-hidden
                    rounded
                    bg-white
                    shadow-2xl
                `}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b 
                border-slate-200 bg-white px-4 py-3 sm:px-5">
                    <h2 className="text-base font-bold text-slate-800 sm:text-lg">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="বন্ধ করুন"
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            transition
                            hover:bg-red-50
                            hover:text-red-500
                        "
                    >
                        <HiXMark size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="min-h-0 flex-1 overflow-y-auto bg-[#F8FAFC] p-2 
                thin-green-scrollbar sm:p-2">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomPrintModal;