"use client";
import { TChildren } from "@/types/project";
import Seasons from "../NavbarOptions/Seasons";
import { usePathname } from "next/navigation";
import DashboardNavbar from "./DashboardNavbar";
import { FaIndustry } from "react-icons/fa";
import { useGetMyVataInformationQuery } from "@/redux/features/vata.features";
import { TVataResponse } from "@/interface/vata";

const MobileLayout = ({ children }: TChildren) => {
  const pathname = usePathname();
  const isActive = pathname === "/";
  const { data } = useGetMyVataInformationQuery(undefined)

  const information = data?.data as TVataResponse
  return (
    <div className="pb-2">
      {isActive ? (
        <div className="flex items-center justify-between px-2 py-4 border-b border-gray-300 shadow">
          <div className="flex items-center gap-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg p-2 bg-orange-50">
              <FaIndustry className="h-6 w-6 text-orange-700" />
            </div>

            <h1 className="text-lg font-semibold text-gray-900 pl-1 lg:pl-0">
              {information?.nameBangla}
            </h1>
          </div>
          <Seasons />
        </div>
      ) : (
        <DashboardNavbar />
      )}

      <div className="pt-3 px-2">{children}</div>
    </div>
  );
};

export default MobileLayout;
