"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Search,
    BookOpen,
    ChevronRight,
    Loader2,
    CircleChevronDown,
} from "lucide-react";

import { useGetAllLedgerWithAmountQuery } from "@/redux/features/ledger.features";
import CustomLoader from "@/components/Reusable/CustomLoader";

interface LedgerChild {
    id: number;
    name: string;
    total: number;
}

interface Ledger {
    id: number;
    name: string;
    total: number;
    children?: LedgerChild[];
}

const LedgerPage = () => {
    const router = useRouter();

    const [search, setSearch] = useState("");

    // Hover করা parent
    const [hoveredLedgerId, setHoveredLedgerId] = useState<number | null>(
        null
    );

    // Click করা parent
    const [clickedLedgerId, setClickedLedgerId] = useState<number | null>(
        null
    );

    const { data, isLoading, isFetching } =
        useGetAllLedgerWithAmountQuery(undefined);

    const ledgers: Ledger[] = data?.data || [];

    // ================= SEARCH =================

    const filteredLedgers = useMemo(() => {
        if (!search.trim()) return ledgers;

        const searchText = search.toLowerCase();

        return ledgers.filter((ledger) => {
            const parentMatch = ledger.name
                .toLowerCase()
                .includes(searchText);

            const childMatch = ledger.children?.some((child) =>
                child.name.toLowerCase().includes(searchText)
            );

            return parentMatch || childMatch;
        });
    }, [ledgers, search]);

    // ================= BANGLA NUMBER =================

    const banglaNumber = (value: number) => {
        return value
            .toLocaleString("en-IN")
            .replace(/\d/g, (digit) => "০১২৩৪৫৬৭৮৯"[Number(digit)]);
    };

    // ================= NAVIGATION =================

    const handleLedgerClick = (id: number) => {
        router.push(`/dashboard/ledger/details/${id}`);
    };

    // ================= PARENT CLICK =================

    const handleParentClick = (id: number) => {
        setClickedLedgerId((prev) => (prev === id ? null : id));
    };

    // ================= OPEN STATE =================

    const isLedgerOpen = (id: number) => {
        return hoveredLedgerId === id || clickedLedgerId === id;
    };

    return (
        <div className="min-h-screen bg-[#e8eef5] p-2">
            <div className="w-full rounded-[10px] bg-white p-3">

                {/* ================= HEADER ================= */}

                <div className="mb-4 flex items-center gap-2">

                    {/* Total */}

                    <div className="flex h-[40px] items-center rounded-[8px] border border-[#00a86b] px-5 text-[17px] font-medium whitespace-nowrap text-[#00a86b]">
                        মোট: {banglaNumber(filteredLedgers.length)} টি
                    </div>

                    {/* Search */}

                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="গ্রুপ বা খতিয়ান নাম দিয়ে সার্চ করুন"
                            className="
                h-[40px]
                w-full
                rounded-[8px]
                border
                border-[#d5d5d5]
                bg-white
                pl-4
                pr-12
                text-[15px]
                text-[#333]
                outline-none
                placeholder:text-[#b9b9b9]
                focus:border-[#00a86b]
              "
                        />

                        <div
                            className="
                absolute
                right-0
                top-0
                flex
                h-[40px]
                w-[40px]
                items-center
                justify-center
                border-l
                border-[#d5d5d5]
              "
                        >
                            <Search
                                size={21}
                                strokeWidth={1.8}
                                className="text-[#777]"
                            />
                        </div>
                    </div>
                </div>

                {/* ================= LOADING ================= */}

                {isLoading || isFetching ? (
                   <CustomLoader cls="h-40vh"/>
                ) : (
                    <>
                        {/* ================= CARDS ================= */}

                        {filteredLedgers.length > 0 ? (
                            <div
                                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                  md:grid-cols-3
                  lg:grid-cols-4
                  xl:grid-cols-5
                "
                            >
                                {filteredLedgers.map((ledger) => {
                                    const hasChildren =
                                        !!ledger.children &&
                                        ledger.children.length > 0;

                                    const isOpen = isLedgerOpen(ledger.id);

                                    return (
                                        /*
                                         * IMPORTANT:
                                         * group এখানে wrapper-এ থাকবে
                                         */
                                        <div
                                            key={ledger.id}
                                            className="group relative"
                                            onMouseEnter={() => {
                                                if (hasChildren) {
                                                    setHoveredLedgerId(ledger.id);
                                                }
                                            }}
                                            onMouseLeave={() => {
                                                setHoveredLedgerId(null);
                                            }}
                                        >

                                            {/* ================= CARD ================= */}

                                            <div
                                                onClick={() => {
                                                    if (hasChildren) {
                                                        // Parent হলে child open/close
                                                        handleParentClick(ledger.id);
                                                    } else {
                                                        // Child না থাকলে সরাসরি ভিতরে যাবে
                                                        handleLedgerClick(ledger.id);
                                                    }
                                                }}
                                                className={`
                          flex
                          h-[96px]
                          items-center
                          gap-3
                          rounded-[15px]
                          px-4
                          transition-all
                          duration-200

                          ${isOpen
                                                        ? "border border-[#00a86b] bg-white shadow-md"
                                                        : "border border-transparent bg-[#f7f9fb]"
                                                    }

                          ${hasChildren || !hasChildren
                                                        ? "cursor-pointer"
                                                        : ""
                                                    }
                        `}
                                            >

                                                {/* Icon */}

                                                <div
                                                    className={`
                            flex
                            h-[58px]
                            w-[58px]
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            transition-all
                            ${isOpen
                                                            ? "bg-[#dff5ed]"
                                                            : "bg-[#e0f4ee]"
                                                        }
                          `}
                                                >
                                                    <BookOpen
                                                        size={30}
                                                        strokeWidth={1.8}
                                                        className="text-[#00a86b]"
                                                    />
                                                </div>

                                                {/* Content */}

                                                <div className="min-w-0 flex-1">
                                                    <h3
                                                        className={`
                              truncate
                              text-[18px]
                              font-semibold
                              transition-colors
                              ${isOpen
                                                                ? "text-[#00a86b]"
                                                                : "text-[#252525]"
                                                            }
                            `}
                                                    >
                                                        {ledger.name}
                                                    </h3>

                                                    <p
                                                        className="
                              mt-1
                              text-[15px]
                              font-medium
                              text-[#8da0b8]
                            "
                                                    >
                                                        ৳ {banglaNumber(ledger.total)}
                                                    </p>
                                                </div>

                                                {/* Right icon */}

                                                {hasChildren ? (
                                                    <CircleChevronDown
                                                        size={20}
                                                        className={`
                              shrink-0
                              text-[#00a86b]
                              transition-transform
                              duration-200
                              ${isOpen
                                                                ? "rotate-180"
                                                                : "rotate-0"
                                                            }
                            `}
                                                    />
                                                ) : (
                                                    <ChevronRight
                                                        size={18}
                                                        className="
                              shrink-0
                              text-[#aeb8c4]
                              opacity-0
                              transition-all
                              duration-200
                              group-hover:translate-x-1
                              group-hover:opacity-100
                            "
                                                    />
                                                )}
                                            </div>

                                            {/* ================= CHILD DROPDOWN ================= */}

                                            {hasChildren && isOpen && (
                                                <div
                                                    className="
                            absolute
                            left-0
                            top-[102px]
                            z-[100]
                            w-full
                            rounded-[12px]
                            border
                            border-[#e1e7ed]
                            bg-white
                            p-2
                            shadow-[0_12px_35px_rgba(0,0,0,0.15)]
                            animate-in
                            fade-in
                            slide-in-from-top-1
                            duration-200
                          "
                                                >

                                                    {/* Small Arrow */}

                                                    <div
                                                        className="
                              absolute
                              -top-[6px]
                              left-1/2
                              h-3
                              w-3
                              -translate-x-1/2
                              rotate-45
                              border-l
                              border-t
                              border-[#e1e7ed]
                              bg-white
                            "
                                                    />

                                                    {/* Header */}

                                                    <div
                                                        className="
                              relative
                              border-b
                              border-[#edf0f3]
                              px-3
                              pb-2
                              pt-1
                            "
                                                    >
                                                        <p className="text-[13px] font-medium text-[#929ca8]">
                                                            খতিয়ানসমূহ
                                                        </p>
                                                    </div>

                                                    {/* Children */}

                                                    <div className="relative mt-1 space-y-1">
                                                        {ledger.children?.map((child) => (
                                                            <button
                                                                key={child.id}
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleLedgerClick(child.id);
                                                                }}
                                                                className="
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-[8px]
                                  px-3
                                  py-2.5
                                  text-left
                                  transition-all
                                  duration-150
                                  hover:bg-[#eaf8f3]
                                "
                                                            >
                                                                <div className="flex min-w-0 items-center gap-2">

                                                                    <div
                                                                        className="
                                      flex
                                      h-[25px]
                                      w-[25px]
                                      shrink-0
                                      items-center
                                      justify-center
                                      rounded-[6px]
                                      bg-[#e0f4ee]
                                    "
                                                                    >
                                                                        <BookOpen
                                                                            size={14}
                                                                            strokeWidth={2}
                                                                            className="text-[#00a86b]"
                                                                        />
                                                                    </div>

                                                                    <span
                                                                        className="
                                      truncate
                                      text-[14px]
                                      font-medium
                                      text-[#333]
                                    "
                                                                    >
                                                                        {child.name}
                                                                    </span>
                                                                </div>

                                                                <span
                                                                    className="
                                    ml-2
                                    shrink-0
                                    text-[13px]
                                    font-medium
                                    text-[#8da0b8]
                                  "
                                                                >
                                                                    ৳ {banglaNumber(child.total)}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ================= EMPTY ================= */

                            <div className="flex min-h-[250px] items-center justify-center">
                                <div className="text-center">
                                    <BookOpen
                                        size={45}
                                        strokeWidth={1.5}
                                        className="mx-auto text-[#b7c1cb]"
                                    />

                                    <p className="mt-3 text-[16px] font-medium text-[#8995a3]">
                                        কোনো খতিয়ান পাওয়া যায়নি
                                    </p>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default LedgerPage;