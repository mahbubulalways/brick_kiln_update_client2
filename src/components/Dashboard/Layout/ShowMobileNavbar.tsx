"use client";

import { useEffect, useState } from "react";
import {
    ChevronDown,
    ChevronUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    dashboardItemsForMobile1,
    dashboardItemsForMobile2,
} from "./mobileItems";

import LogoutButton from "./LogoutButton";
import { useTitleStore } from "@/zustand/store/titleStore";

export default function ShowMobileNavbar() {
    const [openItemId, setOpenItemId] = useState<string | null>(null);

    const pathname = usePathname();
    const { setTitle } = useTitleStore();

    const handleToggle = (id: string) => {
        setOpenItemId((prev) =>
            prev === id ? null : id
        );
    };

    // Split array into chunks of 3
    const chunkArray = <T,>(
        arr: T[],
        size: number
    ): T[][] => {
        const chunks: T[][] = [];

        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }

        return chunks;
    };

    // Update title according to current pathname
    useEffect(() => {
        const allItems = [
            ...dashboardItemsForMobile1,
            ...dashboardItemsForMobile2,
        ];

        for (const item of allItems) {
            // Parent path
            if (item.path === pathname) {
                setTitle(item.title);
                return;
            }

            // Child path
            const activeChild = item.children?.find(
                (child) => child.path === pathname
            );

            if (activeChild) {
                setTitle(activeChild.title);
                return;
            }
        }
    }, [pathname, setTitle]);

    return (
        <div className="z-[9999] mx-auto mt-4 w-full max-w-5xl pb-8">

            {/* =========================
                Top Summary Section
            ========================== */}
            <div className="grid grid-cols-2 overflow-hidden rounded bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-sm">

                <div className="flex flex-col items-center justify-center border-r border-white/20 py-8">
                    <span className="text-gray-200">
                        বিক্রি
                    </span>

                    <span className="text-4xl font-bold">
                        0
                    </span>
                </div>

                <div className="flex flex-col items-center justify-center py-5">
                    <span className="text-gray-200">
                        ক্যাশ
                    </span>

                    <span className="text-4xl font-bold">
                        0
                    </span>
                </div>

            </div>

            {/* =========================
                Main Grid
            ========================== */}
            <div className="pt-5">

                {chunkArray(
                    dashboardItemsForMobile1,
                    3
                ).map((row, rowIndex) => (

                    <div
                        key={rowIndex}
                        className="mb-2"
                    >

                        <div className="grid grid-cols-3 gap-3">

                            {row.map((item) => {

                                const hasChildren =
                                    !!item.children?.length;

                                const hasLink =
                                    !!item.path;

                                /*
                                 * Item without children
                                 * and has direct link
                                 */
                                if (
                                    !hasChildren &&
                                    hasLink
                                ) {
                                    return (
                                        <Link
                                            key={item.id}
                                            href={
                                                item.path as string
                                            }
                                            onClick={() =>
                                                setTitle(
                                                    item.title
                                                )
                                            }
                                            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                                        >
                                            <item.icon
                                                className="h-6 w-6"
                                                style={{
                                                    color:
                                                        item.iconColor ||
                                                        "#374151",
                                                }}
                                            />

                                            <span className="mt-2 text-center text-[15px] font-medium text-gray-800">
                                                {item.title}
                                            </span>
                                        </Link>
                                    );
                                }

                                /*
                                 * Parent item with children
                                 */
                                return (
                                    <div
                                        key={item.id}
                                        className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleToggle(
                                                    item.id
                                                )
                                            }
                                            className="flex w-full flex-col items-center justify-center"
                                        >

                                            <item.icon
                                                className="h-6 w-6"
                                                style={{
                                                    color:
                                                        item.iconColor ||
                                                        "#374151",
                                                }}
                                            />

                                            <span className="mt-2 text-center text-[15px] font-medium text-gray-800">
                                                {item.title}
                                            </span>

                                            {openItemId ===
                                            item.id ? (
                                                <ChevronUp className="mt-1 h-4 w-4 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="mt-1 h-4 w-4 text-gray-400" />
                                            )}

                                        </button>
                                    </div>
                                );
                            })}

                        </div>

                        {/* =========================
                            Children
                        ========================== */}

                        {row
                            .filter(
                                (item) =>
                                    item.id ===
                                        openItemId &&
                                    item.children?.length
                            )
                            .map((item) => (

                                <div
                                    key={item.id}
                                    className="mt-2 grid grid-cols-3 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2"
                                >

                                    {item.children?.map(
                                        (child) => (

                                            <Link
                                                key={child.id}
                                                href={
                                                    child.path!
                                                }
                                                onClick={() =>
                                                    setTitle(
                                                        child.title
                                                    )
                                                }
                                                className="flex items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white py-2 font-medium text-gray-700 transition hover:bg-green-50"
                                            >

                                                <child.icon
                                                    className="h-4 w-4"
                                                    style={{
                                                        color:
                                                            child.iconColor ||
                                                            "#6B7280",
                                                    }}
                                                />

                                                <span className="text-[13px]">
                                                    {
                                                        child.title
                                                    }
                                                </span>

                                            </Link>

                                        )
                                    )}

                                </div>
                            ))}

                    </div>
                ))}

            </div>

            {/* =========================
                Other Section
            ========================== */}

            <div className="flex items-center gap-3 px-8 py-5">

                <div className="h-px flex-1 bg-gray-200" />

                <h1 className="whitespace-nowrap text-center text-sm text-gray-600">
                    অন্যান্য
                </h1>

                <div className="h-px flex-1 bg-gray-200" />

            </div>

            {/* =========================
                Other Items
            ========================== */}

            <div className="grid grid-cols-3 gap-3">

                {dashboardItemsForMobile2.map(
                    (item) => (

                        <Link
                            href={item.path!}
                            key={item.id}
                            onClick={() =>
                                setTitle(item.title)
                            }
                            className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                        >

                            <item.icon
                                className="h-6 w-6"
                                style={{
                                    color:
                                        item.iconColor ||
                                        "#374151",
                                }}
                            />

                            <span className="mt-2 text-center text-[15px] font-medium text-gray-800">
                                {item.title}
                            </span>

                        </Link>

                    )
                )}

            </div>

            {/* =========================
                Logout
            ========================== */}

            <LogoutButton />

        </div>
    );
}