"use client";

import Link from "next/link";
import { CircleHelpIcon, CircleIcon, LogOut, User } from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { deleteCookie } from "@/service/deleteCookie";
import { logoutUserFromSystem } from "@/service/auth.services";
import { useRouter } from "next/navigation";
import LogoutModal from "../Layout/LogoutModal";
import { useState } from "react";
import { getDeviceInfo } from "@/utils/getClientInfo";
import { useLogoutFromTheSystemMutation } from "@/redux/features/auth.features";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";

export function ProfileMenu() {
    const router = useRouter();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logout] = useLogoutFromTheSystemMutation();
    const handleLogout = async () => {
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
            setLogoutLoading(false);
            showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
            });
            setLogoutOpen(true);
        }
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer">
                        <AvatarImage src="/avatar.jpg" alt="User Avatar" />

                        <AvatarFallback className="bg-gray-200">
                            <User className="h-5 w-5 text-gray-600" />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    className="w-52 rounded-lg bg-white p-2 shadow-md"
                >
                    {/* সাধারণ জিজ্ঞাসা */}
                    <DropdownMenuItem asChild>
                        <Link
                            href="/dashboard/faq"
                            className="flex w-full cursor-pointer items-center gap-2"
                        >
                            <CircleHelpIcon size={17} />
                            <span>সাধারণ জিজ্ঞাসা</span>
                        </Link>
                    </DropdownMenuItem>

                    {/* আমাদের সম্পর্কে জানুন */}
                    <DropdownMenuItem asChild>
                        <Link
                            href="/dashboard/about"
                            className="flex w-full cursor-pointer items-center gap-2"
                        >
                            <CircleIcon size={17} />
                            <span>আমাদের সম্পর্কে জানুন</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* লগআউট */}
                    <DropdownMenuItem asChild>
                        <button
                            type="button"
                            onClick={() => setLogoutOpen(true)}
                            className="flex w-full cursor-pointer items-center gap-2 text-red-500 hover:text-red-600"
                        >
                            <LogOut size={17} className="text-red-500" />
                            <span>লগআউট</span>
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

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
        </div>
    );
}