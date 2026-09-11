"use client";

import { TCustomer } from "@/interface/customer";
import { TQuery } from "@/interface/query";
import { useGetSingleCustomerInfoQuery } from "@/redux/features/customer.features";
import { Printer } from "lucide-react";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CustomerTabs from "./Tabs/CustomerTab";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

interface InfoRowProps {
  label: string;
  value: string | number;
  labelClassName?: string;
  valueClassName?: string;
}

const InfoRow = ({
  label,
  value,
  labelClassName = "",
  valueClassName = "",
}: {
  label: string;
  value: string | number;
  labelClassName?: string;
  valueClassName?: string;
}) => {
  return (
    <div className="grid grid-cols-[max-content_minmax(0,1fr)] items-center gap-3">
      <span
        className={`
          inline-flex w-fit shrink-0 whitespace-nowrap
          rounded-md bg-slate-100
          px-2.5 py-1.5
          text-xs font-medium
          sm:text-[13px]
          ${labelClassName}
        `}
      >
        {label}
      </span>

      <span
        className={`
          min-w-0 truncate
          text-sm text-slate-700
          sm:text-[14px]
          ${valueClassName}
        `}
        title={String(value)}
      >
        {value}
      </span>
    </div>
  );
};

const SectionTitle = ({
  title,
  color,
}: {
  title: string;
  color: string;
}) => {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`h-6 w-1 rounded-full ${color}`} />
      <h3 className="text-sm font-bold text-slate-800">{title}</h3>
    </div>
  );
};

const CustomerDetailsPage = ({
  id,
  query,
}: {
  id: string;
  query: TQuery;
}) => {
  const {
    data,
    isError,
    isLoading,
    isFetching,
  } = useGetSingleCustomerInfoQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const customer = data?.data as TCustomer | undefined;

  if (isLoading) {
    return <CustomLoader cls="h-[70vh]" />;
  }

  if (isError || !customer) {
    return <CustomStatus type="error" />;
  }

  return (
    <div className="w-full bg-white p-2 sm:p-3 md:p-4">
      <div className="rounded-2xl bg-white">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Customer Information */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald-50" />

            <SectionTitle
              title="গ্রাহকের তথ্য"
              color="bg-[#079B67]"
            />

            <div className="relative mt-5 space-y-3">
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">
                  নাম
                </p>

                <p className="mt-1 truncate text-sm font-bold text-slate-900">
                  {customer.name}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs font-medium leading-5 text-slate-600">
                  {customer.address || "-"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-3">
                  <p className="text-[11px] font-medium text-emerald-600">
                    কাস্টমার আইডি
                  </p>

                  <p className="mt-1 truncate text-sm font-bold text-emerald-700">
                    {toBanglaNumber(customer.customerCode)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-3">
                  <p className="text-[11px] font-medium text-slate-500">
                    ফোন নম্বর
                  </p>

                  <p className="mt-1 truncate text-sm font-semibold text-slate-800">
                    {toBanglaNumber(customer.phoneNumber)}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2.5">
                <span className="text-xs text-slate-500">
                  যোগদানের তারিখ
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {formatBanglaDate({
                    date: customer.createdAt,
                    showTime: false,
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Brick & Delivery */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50" />

            <SectionTitle
              title="ইট ও ডেলিভারি"
              color="bg-blue-600"
            />

            <div className="relative mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <p className="text-xs font-medium text-blue-600">
                  মোট ইট ক্রয়
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-blue-700">
                  {toBanglaNumber(customer.totalPurchasedQuantity)}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  টি ইট
                </p>
              </div>

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                <p className="text-xs font-medium text-emerald-600">
                  ডেলিভারি
                </p>

                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">
                  {toBanglaNumber(customer.totalDeliveredQuantity)}
                </p>

                <p className="mt-1 text-[10px] text-slate-400">
                  টি ইট
                </p>
              </div>

              <div className="col-span-2 mt-2 flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50/60 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-amber-700">
                    ডেলিভারি বাকি
                  </p>

                  <p className="mt-0.5 text-[10px] text-amber-500">
                    এখনও সরবরাহ করা হয়নি
                  </p>
                </div>

                <span className="text-xl font-bold text-amber-700">
                  {toBanglaNumber(customer.totalRemainingQuantity)}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-sky-50" />

            <SectionTitle
              title="আর্থিক হিসাব"
              color="bg-sky-500"
            />

            <div className="relative mt-5 space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                <div>
                  <p className="text-xs text-slate-500">
                    মোট মূল্য
                  </p>

                  <p className="mt-0.5 text-[10px] text-slate-400">
                    সর্বমোট বিক্রয়
                  </p>
                </div>

                <span className="text-lg font-bold text-slate-900">
                  ৳ {toBanglaNumber(customer.totalAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/60 px-4 py-3">
                <div>
                  <p className="text-xs font-medium text-emerald-700">
                    পরিশোধ
                  </p>

                  <p className="mt-0.5 text-[10px] text-emerald-500">
                    মোট জমা
                  </p>
                </div>

                <span className="text-lg font-bold text-emerald-700">
                  ৳ {toBanglaNumber(customer.totalPaid)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-amber-100 bg-amber-50/60 px-3 py-3">
                  <p className="text-[11px] font-medium text-amber-700">
                    চলতি মৌসুমের বাকি 
                  </p>

                  <p className="mt-1 text-base font-bold text-amber-700">
                    ৳ {toBanglaNumber(customer.currentSeasonDue)}
                  </p>
                </div>

                <div className="rounded-xl border border-violet-100 bg-violet-50/60 px-3 py-3">
                  <p className="text-[11px] font-medium text-violet-700">
                    আগের মৌসুমের বাকি 
                  </p>

                  <p className="mt-1 text-base font-bold text-violet-700">
                    ৳ {toBanglaNumber(customer.previousDue)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Other Information */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-violet-50" />

            <SectionTitle
              title="অন্যান্য তথ্য"
              color="bg-violet-500"
            />

            <div className="relative mt-5 space-y-3">
              <div className="rounded-xl border border-violet-100 bg-violet-50/50 px-4 py-3">
                <p className="text-xs font-medium text-violet-600">
                  পরবর্তী পরিশোধের তারিখ
                </p>

                <p className="mt-1 text-sm font-bold text-violet-800">
                  {formatBanglaDate({
                    date: customer.nextPaymentDate,
                    showTime: false,
                  })}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                <p className="text-[11px] text-slate-400">
                  নোট
                </p>

                <p className="mt-1 line-clamp-2 text-xs font-medium leading-5 text-slate-600">
                  {customer.note || "কোনো নোট নেই"}
                </p>
              </div>

              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-red-600">
                      সর্বমোট বাকি
                    </p>

                    <p className="mt-1 text-[10px] text-red-400">
                      পরিশোধযোগ্য মোট
                    </p>
                  </div>

                  <span className="text-2xl font-bold tracking-tight text-red-600">
                    ৳ {toBanglaNumber(customer.totalDue)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isFetching && !isLoading && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-[#079B67]" />
          </div>
        )}
      </div>

      <div className="mt-3">
        <CustomerTabs
          id={customer.id}
          customer={customer}
          query={query}
        />
      </div>
    </div>
  );
};

export default CustomerDetailsPage;