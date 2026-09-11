"use client";

import { Banknote, CalendarDays, Store } from "lucide-react";

type TVataSummaryCardsProps = {
  totalVata: number;
  activeVata: number;
  totalDueVata: number;
  totalPaymentDue: number;
};

const formatNumber = (value: number) => {
  return value.toLocaleString("bn-BD");
};

const VataSummaryCards = ({
  totalVata,
  activeVata,
  totalDueVata,
  totalPaymentDue,
}: TVataSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Total Vata */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">মোট ভাটা</p>

            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              {formatNumber(totalVata)}
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
            <Store size={20} className="text-blue-600" />
          </div>
        </div>
      </div>

      {/* Active Vata */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">সক্রিয় ভাটা</p>

            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              {formatNumber(activeVata)}
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </div>
        </div>
      </div>

      {/* Due Vata */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              পেমেন্ট বাকি ভাটা
            </p>

            <h2 className="mt-1 text-2xl font-bold text-gray-800">
              {formatNumber(totalDueVata)}
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <CalendarDays size={20} className="text-red-500" />
          </div>
        </div>
      </div>

      {/* Total Due */}
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">
              মোট পেমেন্ট বাকি
            </p>

            <h2 className="mt-1 text-2xl font-bold text-red-600">
              ৳{formatNumber(totalPaymentDue)}
            </h2>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <Banknote size={20} className="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VataSummaryCards;