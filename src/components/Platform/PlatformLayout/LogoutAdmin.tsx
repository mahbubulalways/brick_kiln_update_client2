"use client";

import { useState } from "react";

import { useLogoutFromTheSystemMutation } from "@/redux/features/auth.features";
import { getDeviceInfo } from "@/utils/getClientInfo";
import { deleteCookie } from "@/service/deleteCookie";
import { logoutUserFromSystem } from "@/service/auth.services";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import LogoutModal from "@/components/Dashboard/Layout/LogoutModal";

export default function LogoutAdminButton() {
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);

    const [logout] = useLogoutFromTheSystemMutation();

    const router = useRouter();

    const handleLogout = async () => {
        // একদম প্রথমেই loading true
        setLogoutLoading(true);

        const info = getDeviceInfo();

        try {
            const result = await logout(info).unwrap();

            if (result?.success) {
                deleteCookie();
                logoutUserFromSystem();

                router.push("/login");
            }
        } catch (error: any) {
            console.log(error)
            setLogoutLoading(false);

            showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
            });

            // Modal আবার দেখাবে
            setLogoutOpen(true);
        }
    };

    return (
        <>
            <button
                onClick={() => setLogoutOpen(true)}
                disabled={logoutLoading}
                type="button"
                className="
                                flex w-full items-center gap-3
                                px-3.5 py-2.5
                                text-sm
                                font-medium
                                text-red-500
                                transition-colors
                                hover:bg-red-50
                            "
            >
                <LogOut
                    size={17}
                    strokeWidth={1.8}
                />
                <span>লগআউট</span>
            </button>


            <LogoutModal
                isOpen={logoutOpen}
                onClose={() => {
                    if (!logoutLoading) {
                        setLogoutOpen(false);
                    }
                }}
                onConfrqam={handleLogout}
                isLoading={logoutLoading}
            />
        </>
    );
}