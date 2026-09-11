"use client";
import React, { useState } from "react";
import { TChildren } from "@/types/project";
import Drawer from "./Drawer";
import DashboardNavbar from "./DashboardNavbar";

const ComputerLayout = ({ children }: TChildren) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  return (
    <div className="flex flex-col h-full min-h-screen">
      <div
        className={`transition-all z-50 duration-300 sticky top-0 ${
          isDrawerOpen ? "ml-44 w-[calc(100%-11rem)]" : "w-full"
        } `}
      >
        <DashboardNavbar
          isDrawerOpen={isDrawerOpen}
          onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        />
      </div>

      {/* Content area */}
      <div className={`flex flex-1`}>
        <div className="hidden lg:block">
          <Drawer isOpen={isDrawerOpen} />
        </div>
        <div
          className={`transition-all duration-300 ${
            isDrawerOpen ? "ml-44 w-[calc(100%-11rem)]" : "w-full"
          } p-3 bg-[#E2E8F0]`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default ComputerLayout;
