"use client";

import { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

const NetworkStatusProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
        };

        const handleOffline = () => {
            setIsOnline(false);
        };

        // প্রথমবার network status check
        setIsOnline(navigator.onLine);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    return (
        <>
            {children}

            {!isOnline && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">
                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                            <WifiOff
                                size={32}
                                className="text-red-500"
                            />
                        </div>

                        <h2 className="mb-2 text-xl font-semibold text-gray-900">
                            ইন্টারনেট সংযোগ নেই
                        </h2>

                        <p className="text-sm leading-6 text-gray-500">
                            আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।
                            ইন্টারনেট সংযোগ ফিরে না আসা পর্যন্ত
                            অ্যাপ্লিকেশন ব্যবহার করা যাবে না।
                        </p>

                        <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
                            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                            সংযোগের জন্য অপেক্ষা করা হচ্ছে...
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default NetworkStatusProvider;