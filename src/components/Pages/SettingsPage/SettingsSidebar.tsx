"use client";

import { Dispatch, SetStateAction, useState } from "react";
import {
  FiUser,
  FiList,
  FiBookOpen,
  FiUsers,
  FiLock,
  FiInfo,
  FiCheckSquare,
  FiPrinter,
  FiGrid,
  FiMessageCircle,
  FiSettings,
  FiDownload,
} from "react-icons/fi";

const menuItems = [
  {
    id: 1,
    label: "ভাটার তথ্য",
    icon: FiUser,
  },
  {
    id: 2,
    label: "শ্রেণি এবং রেট",
    icon: FiList,
  },
  {
    id: 3,
    label: "খতিয়ান অ্যাড",
    icon: FiBookOpen,
  },
  {
    id: 4,
    label: "সফটওয়্যার ইউজার",
    icon: FiUsers,
  },
  {
    id: 5,
    label: "পাসওয়ার্ড পরিবর্তন",
    icon: FiLock,
  },
  {
    id: 6,
    label: "ইউজার পারমিশন",
    icon: FiCheckSquare,
  },
  {
    id: 7,
    label: "প্রিন্টার সেটিং",
    icon: FiPrinter,
  },
  {
    id: 8,
    label: "এসএমএস সেটিং",
    icon: FiMessageCircle,
  },
  {
    id: 9,
    label: "অ্যাপ ইনস্টল করুন",
    icon: FiDownload,
  }
];

type TSidebarMenu = {
  setPage: Dispatch<SetStateAction<number>>;
};

const SidebarMenu = ({ setPage }: TSidebarMenu) => {
  const [activeId, setActiveId] = useState(1);

  const handleMenuClick = (id: number) => {
    setActiveId(id);
    setPage(id);
  };

  return (
    <aside
      className="
                w-full
                shrink-0
                bg-white
                border
                border-gray-200
                rounded-md
                p-3
                select-none

                md:w-[230px]
                md:min-h-[calc(100vh-100px)]
            "
    >
      {/* ================= HEADER ================= */}
      <div
        className="
                    hidden
                    md:flex
                    items-center
                    gap-3
                    px-1
                    pb-4
                    mb-3
                    border-b
                    border-gray-200
                "
      >
        {/* Settings Icon */}
        <div
          className="
                        flex
                        h-14
                        w-14
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#111827]
                        text-white
                        shadow-sm
                    "
        >
          <FiSettings className="h-7 w-7" />
        </div>

        {/* Title */}
        <div className="leading-none">
          <h1 className="text-[20px] font-bold text-[#111827]">
            সেটিংস
          </h1>

          <p className="mt-2 text-[11px] font-semibold tracking-wide text-gray-400">
            CONTROL PANEL
          </p>
        </div>
      </div>

      {/* ================= MENU ================= */}
      <nav
        className="
        flex
        flex-col
        gap-1
        overflow-visible
    "
      >
        {menuItems.map(({ id, label, icon: Icon }) => {
          const isActive = id === activeId;

          return (
            <button
              key={id}
              type="button"
              onClick={() => handleMenuClick(id)}
              className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-4
                    py-3
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    cursor-pointer
                    md:py-3.5
                    ${isActive
                  ? `
                                bg-[#039A63]
                                text-white
                                shadow-[0_8px_20px_rgba(3,154,99,0.18)]
                            `
                  : `
                                bg-transparent
                                text-[#64748B]
                                hover:bg-[#F0FDF8]
                                hover:text-[#039A63]
                            `
                }
                `}
            >
              <Icon
                className={`
                        h-[20px]
                        w-[20px]
                        shrink-0
                        transition-colors
                        ${isActive
                    ? "text-white"
                    : "text-[#64748B] group-hover:text-[#039A63]"
                  }
                    `}
              />

              <span className="whitespace-nowrap text-left">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarMenu;