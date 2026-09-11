"use client";
import { TDashboardItem } from "@/types/project";
import { useTitleStore } from "@/zustand/store/titleStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { IconType } from "react-icons";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";

type TShowSideItem = {
  item: TDashboardItem;
  toggleItem: (id: string) => void;
  isOpen: boolean;
  Icon: IconType;
};

const ShowSidebarItems = ({
  item,
  toggleItem,
  Icon,
  isOpen,
}: TShowSideItem) => {
  const { setTitle } = useTitleStore();
  const pathname = usePathname();

  const active =
    pathname === item.path ||
    item.children?.some((child) => child.path === pathname);

  // Automatically update title when path matches
  useEffect(() => {
    if (active) {
      // if it's a parent item
      if (pathname === item.path) {
        setTitle(item.title);
      }
      // if it's a child item
      else {
        const activeChild = item.children?.find(
          (child) => child.path === pathname
        );
        if (activeChild) setTitle(activeChild.title);
      }
    }
  }, [pathname, item, active, setTitle]);

  return (
    <div>
      <li>
        {item.children ? (
          <>
            <div
              className={` hover:bg-gray-200 hover:pl-2 hover:border-l-4 border-gray-500 `}
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full flex justify-between items-center p-2  transition cursor-pointer    hover:translate-x-2 "
              >
                <div className="flex items-center space-x-2 text-gray-700 transition">
                  <Icon className="text-[14px]" />
                  <span className="text-[14px]">{item.title}</span>
                </div>
                {isOpen ? (
                  <MdKeyboardArrowDown className="text-[14px]" />
                ) : (
                  <MdKeyboardArrowRight className="text-[14px]" />
                )}
              </button>
            </div>
            {isOpen && (
              <ul className="mt-1 bg-gray-100">
                {item.children.map((child) => {
                  const ChildIcon = child.icon;
                  const childActive = pathname === child.path;

                  return (
                    <li
                      key={child.id}
                      className={`border-l-4 transition-all duration-200 ${
                        childActive
                          ? "border-green-500 bg-[#039A63] text-white"
                          : "border-gray-200 hover:border-gray-500 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Link
                        href={child.path || "#"}
                        // onClick={() => setTitle(child.title)}
                        className={`flex items-center space-x-2 p-2`}
                      >
                        <ChildIcon className="text-base" />
                        <span className="text-[14px]">{child.title}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <div
            className={`
    group transition-all duration-200 cursor-pointer
    ${
      active
        ? "bg-[#039A63] border-l-4 border-green-500 text-white"
        : "text-gray-700 hover:bg-gray-200 hover:border-l-4 hover:border-gray-500 hover:pl-2"
    }
  `}
          >
            <Link
              href={item.path || "#"}
              // onClick={() => setTitle(item.title)}
              className={`flex items-center gap-2 p-2 transition-transform duration-200
     group-hover:translate-x-2
    `}
            >
              <Icon className="text-[14px]" />
              <span className="text-[14px]">{item.title}</span>
            </Link>
          </div>
        )}
      </li>
    </div>
  );
};

export default ShowSidebarItems;
