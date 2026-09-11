"use client";

import React from "react";
import { RiMenuFold4Line } from "react-icons/ri";
import Seasons from "../NavbarOptions/Seasons";
import NavbarIcon from "../NavbarOptions/NavbarIcon";
import { MdHistory } from "react-icons/md";
import {
    IoCallOutline,
    IoDocumentTextOutline,
    IoSettingsOutline,
} from "react-icons/io5";
import { CiYoutube } from "react-icons/ci";
import { SiFampay } from "react-icons/si";
import { ProfileMenu } from "../NavbarOptions/Profile";
import { useTitleStore } from "@/zustand/store/titleStore";
import Link from "next/link";

interface DashboardNavbarProps {
    onToggleDrawer?: () => void;
    isDrawerOpen?: boolean;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({
    onToggleDrawer,
    isDrawerOpen,
}) => {
    const { title } = useTitleStore();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <header className="sticky top-0 isolate z-50 bg-white w-full">
            <div className="relative flex w-full items-center justify-between bg-white px-5 py-2 shadow-sm">

                {/* Left */}
                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={onToggleDrawer}
                        className={`ml-2 hidden cursor-pointer rounded bg-gray-100 p-2 duration-300 lg:block ${
                            isDrawerOpen ? "rotate-180" : ""
                        }`}
                    >
                        <RiMenuFold4Line className="h-5 w-5 text-gray-700" />
                    </button>

                    <Link href="/">
                        <h1 className="pl-3 text-lg font-semibold text-gray-900 lg:pl-0">
                            {title}
                        </h1>
                    </Link>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    <Seasons />

                    <div className="hidden lg:block">
                        <div className="flex items-center gap-2">

                            <NavbarIcon
                                Icon={MdHistory}
                                path="/dashboard/history"
                                title="আপডেট হিস্ট্রি"
                            />

                            <NavbarIcon
                                Icon={IoDocumentTextOutline}
                                path="/dashboard/login-record"
                                title="লগইন রেকর্ড"
                            />

                            <NavbarIcon
                                Icon={IoCallOutline}
                                path="/dashboard/help-line"
                                title="হেল্প লাইন"
                            />

                            <NavbarIcon
                                Icon={CiYoutube}
                                path="/dashboard/video"
                                title="ভিডিও"
                            />

                            <NavbarIcon
                                Icon={SiFampay}
                                path="/dashboard/software-payment"
                                title="সফটওয়্যার পেমেন্ট"
                            />

                            <NavbarIcon
                                Icon={IoSettingsOutline}
                                path="/dashboard/settings"
                                title="সেটিং"
                            />

                            <ProfileMenu />

                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;