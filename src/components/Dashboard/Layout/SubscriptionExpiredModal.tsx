"use client";

import { useRouter } from "next/navigation";
import { MdClose, MdOutlineWarningAmber } from "react-icons/md";

type SubscriptionExpiredModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const SubscriptionExpiredModal = ({
    isOpen,
    onClose,
}: SubscriptionExpiredModalProps) => {
    const router = useRouter();

    if (!isOpen) return null;

    const handleRenew = () => {
        onClose();
        router.push("/dashboard/software-payment");
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-[2px]">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute cursor-pointer right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
                >
                    <MdClose size={22} />
                </button>

                <div className="px-6 pb-7 pt-9 text-center">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                        <MdOutlineWarningAmber
                            size={38}
                            className="text-amber-500"
                        />
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">
                        আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়েছে
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-gray-500">
                        আপনার সাবস্ক্রিপশনের মেয়াদ শেষ হয়ে গেছে। পুরোনো তথ্যগুলো
                        দেখতে পারবেন, তবে নতুন তথ্য যোগ, পরিবর্তন বা মুছে ফেলতে
                        সাবস্ক্রিপশন নবায়ন করতে হবে।
                    </p>

                    <button
                        type="button"
                        onClick={handleRenew}
                        className="mt-6 w-full cursor-pointer rounded-xl bg-[#039A63] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#028653] active:scale-[0.98]"
                    >
                        সাবস্ক্রিপশন নবায়ন করুন
                    </button>

                    <p className="mt-3 text-xs text-gray-400">
                        নবায়ন করলে আপনার সকল সুবিধা পুনরায় চালু হবে।
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionExpiredModal;