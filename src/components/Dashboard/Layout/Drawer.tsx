"use client";

import { useMemo, useState } from "react";

import { dashboardItems1, dashboardItems2 } from "./dashboardItem";
import ShowSidebarItems from "./ShowSidebarItems";
import SidebarSkeleton from "./SidebarSkeleton";

import { useGetMyVataNavbarFeaturesQuery } from "@/redux/features/vata.features";
import { TDashboardItem } from "@/types/project";
import { TFeatureKey } from "@/components/Platform/PlatformPages/SubscriptionPage/CreateSubscriptionPage/subscription.features";

interface DrawerProps {
  isOpen: boolean;
}

const Drawer = ({ isOpen }: DrawerProps) => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const { data, isLoading } =
    useGetMyVataNavbarFeaturesQuery(undefined);

  const toggleItem = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  const allowedFeatures: TFeatureKey[] =
    data?.data?.subscriptionPlan?.features ?? [];

  const filterItems = (items: TDashboardItem[]) => {
    return items
      .filter((item) => {
        if (!item.feature) return true;

        return allowedFeatures.includes(
          item.feature as TFeatureKey
        );
      })
      .map((item) => {
        if (!item.children) {
          return item;
        }

        const filteredChildren = item.children.filter((child) => {
          if (!child.feature) return true;

          return allowedFeatures.includes(
            child.feature as TFeatureKey
          );
        });

        return {
          ...item,
          children: filteredChildren,
        };
      })
      .filter((item) => {
        if (item.children) {
          return item.children.length > 0;
        }

        return true;
      });
  };

  const filteredDashboardItems1 = useMemo(
    () => filterItems(dashboardItems1),
    [allowedFeatures]
  );

  const filteredDashboardItems2 = useMemo(
    () => filterItems(dashboardItems2),
    [allowedFeatures]
  );

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-44 bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 ease-in-out z-40
        ${
          isOpen
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }
      `}
    >
      {/* Header */}
      <div className="h-12 flex flex-col items-center justify-center">
        <span className="font-semibold text-gray-700 text-xl pt-2 tracking-wide">
          এডমিন প্যানেল
        </span>
      </div>

      {/* Sidebar */}
      {isLoading ? (
        <SidebarSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
          {/* First section */}
          <ul className="flex flex-col gap-0.5 mt-2">
            {filteredDashboardItems1.map((item) => {
              const Icon = item.icon;

              return (
                <ShowSidebarItems
                  key={item.id}
                  item={item}
                  toggleItem={toggleItem}
                  Icon={Icon}
                  isOpen={openItem === item.id}
                />
              );
            })}
          </ul>

          {/* Divider */}
          {filteredDashboardItems1.length > 0 &&
            filteredDashboardItems2.length > 0 && (
              <p className="pl-3 pb-2 text-gray-300 select-none">
                _ _
              </p>
            )}

          {/* Second section */}
          <ul className="flex flex-col gap-0.5 mb-3">
            {filteredDashboardItems2.map((item) => {
              const Icon = item.icon;

              return (
                <ShowSidebarItems
                  key={item.id}
                  item={item}
                  toggleItem={toggleItem}
                  Icon={Icon}
                  isOpen={openItem === item.id}
                />
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Drawer;