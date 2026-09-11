"use client";

import { useState } from "react";
import { MdLogout } from "react-icons/md";
import LogoutModal from "./LogoutModal";

import { useLogoutFromTheSystemMutation } from "@/redux/features/auth.features";
import { getDeviceInfo } from "@/utils/getClientInfo";
import { deleteCookie } from "@/service/deleteCookie";
import { logoutUserFromSystem } from "@/service/auth.services";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
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
            // API fail হলে loading বন্ধ
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
                type="button"
                disabled={logoutLoading}
                className="mt-5 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 font-semibold text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
                <MdLogout className="h-5 w-5" />

                <span>লগ আউট</span>
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