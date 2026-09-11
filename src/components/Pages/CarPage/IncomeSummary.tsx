"use client";

import {
  CalendarDays,
  Settings,
  Wallet,
  ArrowDown,
  ArrowUp,
  Banknote,
} from "lucide-react";

interface IncomeSummaryProps {
  totalIncome?: number;
  totalExpense?: number;
  totalCash?: number;
  currentGiven?: number;
  currentDue?: number;
  cashBalance?: number;
}

const IncomeSummary = ({
  totalIncome = 80,
  totalExpense = 0,
  totalCash = 0,
  currentGiven = 0,
  currentDue = 8100,
  cashBalance = 8100,
}: IncomeSummaryProps) => {
  const summaryItems = [
    {
      title: "মোট আয়",
      value: totalIncome,
      bg: "bg-gradient-to-br from-blue-700 to-blue-500",
      icon: Wallet,
    },
    {
      title: "মোট ব্যয়",
      value: totalExpense,
      bg: "bg-gradient-to-br from-orange-600 to-orange-400",
      icon: ArrowDown,
    },
    {
      title: "মোট ক্যাশ",
      value: totalCash,
      bg: "bg-gradient-to-br from-purple-700 to-purple-500",
      icon: Banknote,
    },
    {
      title: "মজুদ নেওয়া",
      value: currentGiven,
      bg: "bg-gradient-to-br from-green-700 to-green-500",
      icon: ArrowDown,
    },
    {
      title: "মজুদ দেওয়া",
      value: currentDue,
      bg: "bg-gradient-to-br from-pink-600 to-pink-500",
      icon: ArrowUp,
    },
    {
      title: "ক্যাশ জের",
      value: cashBalance,
      bg: "bg-gradient-to-br from-indigo-700 to-indigo-500",
      icon: Wallet,
    },
  ];

  const toBanglaNumber = (value: number) =>
    new Intl.NumberFormat("bn-BD").format(value);

  return (
    <div className="rounded-lg bg-white p-3 shadow-sm">
      {/* Top Filter */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md bg-cyan-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-cyan-700">
            আজকের হিসাব
          </button>

          <button className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
            গত ৭ দিনের হিসাব
          </button>

          <button className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
            গত ১৫ দিনের হিসাব
          </button>

          <button className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-emerald-700">
            সর্বমোট হিসাব
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="মাস"
              className="h-9 w-36 rounded-md border border-gray-300 px-3 pr-9 text-sm outline-none focus:border-emerald-500"
            />
            <CalendarDays className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="তারিখ"
              className="h-9 w-36 rounded-md border border-gray-300 px-3 pr-9 text-sm outline-none focus:border-emerald-500"
            />
            <CalendarDays className="absolute right-3 top-2 h-4 w-4 text-gray-400" />
          </div>

          <button className="flex h-9 w-11 items-center justify-center rounded-md bg-purple-600 text-white transition hover:bg-purple-700">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`${item.bg} relative min-h-[108px] overflow-hidden rounded-md p-4 text-white`}
            >
              <div className="relative z-10">
                <p className="text-sm font-medium">{item.title}</p>

                <p className="mt-4 text-2xl font-semibold">
                  {toBanglaNumber(item.value)}
                </p>
              </div>

              <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IncomeSummary;