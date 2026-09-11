"use client";

import { useState } from "react";

import ButtonGroup from "./ButtonGroup";
import CalculationsCard from "./CalculationsCard";
import Chalan from "./Chalan";
import Payment from "./Payment";
import Production from "./Production";
import DashboardStock from "./DashboardStock";
import ClassWiseSellChart from "./SellsGraph";
import ClassWiseDeliveryChart from "./ClassWiseDelivery";
import DashboardStockPieChart from "./DashboardStockPieChart";
import NoticeMarquee from "./NoticeMarquee";

import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

import { useDashboardReportQuery } from "@/redux/features/report,features";
import { useGetNoteQuery } from "@/redux/system.features/system.note.features";

import { TDashboardReport } from "@/interface/dashboard";
import { formatDateRange } from "@/utils/formatDateRange";

const DashboardPage = () => {
  const [filterDate, setDateFiter] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const formatDate = formatDateRange({
    start: filterDate.startDate,
    end: filterDate.endDate,
  });

  const {
    isError,
    isLoading,
    data,
  } = useDashboardReportQuery({ date: formatDate }, {
    refetchOnMountOrArgChange: true
  });

  const {
    data: noteData,
    isLoading: isNoteLoading,
  } = useGetNoteQuery(undefined);

  const reports = data?.data as TDashboardReport;

  const totalSell = reports?.challan?.summary?.totalSaleWithRent;
  const cashSell = reports?.challan?.summary?.cash;
  const dueSell = reports?.challan?.summary?.due;
  const payment = reports?.payment?.total;
  const due = reports?.due;
  const cash = reports?.cash;
  const challanItems = reports?.challan?.items;

  /* ---------------- Loading ---------------- */

  if (isLoading || isNoteLoading) {
    return (
      <div className="space-y-5 pb-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-[110px] animate-pulse rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="mt-4 h-7 w-32 rounded bg-slate-200" />
              <div className="mt-3 h-2 w-20 rounded bg-slate-100" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="h-[360px] animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
          <div className="h-[360px] animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
          <div className="h-[360px] animate-pulse rounded-xl bg-slate-100 lg:col-span-4" />
        </div>

        <div className="h-[500px] animate-pulse rounded-xl bg-slate-100" />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="h-[430px] animate-pulse rounded-xl bg-slate-100" />
          <div className="h-[430px] animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  /* ---------------- Error ---------------- */

  if (isError || !reports) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="text-lg text-red-500">!</span>
          </div>

          <h2 className="mt-4 text-base font-bold text-slate-800">
            ড্যাশবোর্ড তথ্য লোড করা যায়নি
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            সার্ভার থেকে ড্যাশবোর্ডের তথ্য পাওয়া যায়নি।
            কিছুক্ষণ পর আবার চেষ্টা করুন।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">
      {noteData?.data?.message ? (
        <NoticeMarquee message={noteData.data.message} />
      ) : null}

      {/* Date Filter */}
      <div className="flex w-full justify-end">
        <div className="w-fit">
          <CustomDateFilter
            value={filterDate}
            onChange={setDateFiter}
            placeholder="তারিখ ফিল্টার করুন"

          />
        </div>
      </div>

      {/* Calculations */}
      <section>
        <CalculationsCard
          cashSell={cashSell}
          dueSell={dueSell}
          totalSell={totalSell}
          payment={payment}
          due={due}
          cash={cash}
        />
      </section>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <Chalan
            summary={reports?.challan?.summary}
            items={challanItems}
          />
        </div>

        <div className="min-w-0 lg:col-span-4">
          <Payment
            payments={reports?.payment?.payments}
          />
        </div>

        <div className="min-w-0 lg:col-span-4">
          <Production
            delivery={reports?.delivery}
          />
        </div>
      </section>

      {/* Stock Distribution */}
      <section className="w-full">
        <DashboardStockPieChart
          report={reports?.stockSummary}
        />
      </section>

      {/* Class Wise Graphs */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="min-w-0">
          <ClassWiseSellChart
            data={reports?.sellGraph ?? []}
          />
        </div>

        <div className="min-w-0">
          <ClassWiseDeliveryChart
            data={reports?.deliveryGraph ?? []}
          />
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;