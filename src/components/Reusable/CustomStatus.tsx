"use client";

import React from "react";
import { AlertTriangle, Inbox, LoaderCircle, RefreshCcw } from "lucide-react";

interface CustomStatusProps {
  type: "error" | "empty" | "loading";
  title?: string;
  description?: string;
  fullScreen?: boolean;
  showReload?: boolean
}

const CustomStatus: React.FC<CustomStatusProps> = ({
  type,
  title,
  description,
  fullScreen = true,
  showReload = false
}) => {
  const defaults = {
    loading: {
      title: "লোড হচ্ছে...",
      description: "অনুগ্রহ করে অপেক্ষা করুন, তথ্য লোড করা হচ্ছে।",
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <LoaderCircle size={40} className="animate-spin" />
        </div>
      ),
    },

    error: {
      title: "কিছু সমস্যা হয়েছে",
      description: "তথ্য লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-full
         bg-red-50 text-red-600">
          <AlertTriangle size={40} className="animate-pulse" />
        </div>
      ),
    },

    empty: {
      title: "কোনো তথ্য পাওয়া যায়নি",
      description: "বর্তমানে প্রদর্শনের জন্য কোনো তথ্য নেই।",
      icon: (
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <Inbox size={40} />
        </div>
      ),
    },
  };

  const current = defaults[type];

  return (
    <div
      className={`flex ${fullScreen ? "min-h-[40vh]" : "min-h-[30vh]"
        } flex-col items-center justify-center px-6 text-center`}
    >
      <div className="mb-3">{current.icon}</div>

      {/* <h2 className="font-bold text-gray-900">
        {title || current.title}
      </h2> */}

      <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
        {description || current.description}
      </p>

      {
        showReload ?
          <>
            {type === "error" && (
              <button
                onClick={() => window.location.reload()}
                className="mt-6 flex items-center gap-2 rounded-xl bg-[#006A4E] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#006A4E]/20 transition hover:bg-[#00563f] hover:shadow-xl active:scale-95"
              >
                <RefreshCcw size={18} />
                পুনরায় চেষ্টা করুন
              </button>
            )}
          </> : ""
      }


      <p className="mt-8 text-xs text-gray-400">ইটভাটা ব্যবস্থাপনা সিস্টেম</p>
    </div>
  );
};

export default CustomStatus;
