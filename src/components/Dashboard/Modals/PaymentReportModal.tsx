"use client";

import { useState } from "react";
import CustomReportModal from "@/components/Reusable/CustomReportModal";
import { useGetPaymentReportQuery } from "@/redux/features/payment.features";
import TableHead from "@/components/Reusable/TableHead";
import { NO_DATA_FOUND_MESSAGE } from "@/constant";
import TableData from "@/components/Reusable/TableData";
import { TPaymentReportResponse } from "@/interface/payment";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { formatDateRange } from "@/utils/formatDateRange";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};


const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${toBanglaNumber(day)}-${toBanglaNumber(
    month,
  )}-${toBanglaNumber(year)}`;
};

const PaymentReportModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [activeTab, setActiveTab] = useState<"date" | "all">(
    "date",
  );
  const [todayDate] = useState(new Date());
  const date =
    activeTab === "date" ?
      formatDateRange({ start: todayDate, end: null })
      : undefined;
  const {
    data,
    isLoading,
    isError,
  } = useGetPaymentReportQuery(date!, {
    refetchOnMountOrArgChange: true,
  });

  const paymentReports = data?.data as TPaymentReportResponse[] | []
  const summary = paymentReports?.reduce(
    (acc, row) => {
      acc.totalBill += row.totalBill || 0;
      acc.advancePayment += row.advancePayment || 0;
      acc.cutting += row.cutting || 0;
      acc.payment += row.payment || 0;
      acc.paymentDifference += row.paymentDifference || 0;

      return acc;
    },
    {
      totalBill: 0,
      advancePayment: 0,
      cutting: 0,
      payment: 0,
      paymentDifference: 0,
    },
  );
  return (
    <CustomReportModal
      isOpen={isOpen}
      onClose={onClose}
      width="xxl"
      title="গ্রুপ অনুযায়ি পেমেন্ট রিপোর্ট"
    >
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {/* Date Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("date")}
            className={`
              h-9 rounded-md border px-3
              text-sm font-medium transition
              ${activeTab === "date"
                ? "border-[#039A63] bg-[#039A63] text-white"
                : "border-[#039A63] bg-white text-[#039A63] hover:bg-[#039A63] hover:text-white"
              }
            `}
          >
            {formatDate(todayDate)} এর রিপোর্ট
          </button>

          {/* All Payment Tab */}
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`
              h-9 rounded-md border px-3
              text-sm font-medium transition
              ${activeTab === "all"
                ? "border-[#039A63] bg-[#039A63] text-white"
                : "border-[#039A63] bg-white text-[#039A63] hover:bg-[#039A63] hover:text-white"
              }
            `}
          >
            সব পেমেন্ট রিপোর্ট
          </button>
        </div>



        <div className="pt-4">
          {isLoading ? <CustomStatus type="loading" /> :
            isError ? <CustomStatus type="error" /> :
              (
                <div className="overflow-x-auto">
                  <table className="min-w-full   text-center border-t">
                    <thead className="bg-[#039A63] text-white">
                      <tr>

                        <TableHead th="খতিয়ান" cls="hidden lg:table-cell" />
                        <TableHead th="পরিমাণ" />
                        <TableHead th="মোট বিল" cls="hidden lg:table-cell" />
                        <TableHead th="অগ্রিম" cls="hidden lg:table-cell" />
                        <TableHead th="কর্তন" cls="hidden lg:table-cell" />
                        <TableHead th="পেমেন্ট" />
                        <TableHead th="কম/বেশি" cls="hidden lg:table-cell" />

                      </tr>
                    </thead>
                    <tbody>
                      {paymentReports?.length ? (
                        <>
                          {paymentReports?.map((row: TPaymentReportResponse, index) => (

                            <tr
                              key={row?.ledgerId}
                              className="hover:bg-gray-50"

                            >

                              <TableData
                                td={row?.ledger}
                                cls="hidden lg:table-cell"
                              />
                              <TableData
                                td={toBanglaNumber(row?.quantity)}
                                cls="hidden lg:table-cell"
                              />


                              <TableData
                                td={`৳ ${toBanglaNumber(row?.totalBill)}`}
                                cls="hidden lg:table-cell"
                              />
                              <TableData
                                td={`৳ ${toBanglaNumber(row?.advancePayment)}`}
                                cls="border p-2 text-red-500 hidden lg:table-cell"
                              />
                              <TableData
                                cls="border p-2 text-green-600 hidden lg:table-cell"
                                td={`৳ ${toBanglaNumber(row?.cutting)}`}
                              />
                              <TableData
                                cls="border p-2 text-green-600"
                                td={`৳ ${toBanglaNumber(row?.payment)}`}
                              />
                              <TableData
                                cls={`border hidden lg:table-cell p-2 ${row?.paymentDifference < 0
                                  ? "text-red-500"
                                  : row?.paymentDifference > 0
                                    ? "text-green-600"
                                    : "text-gray-600"
                                  }`}
                                td={
                                  row?.paymentDifference < 0
                                    ? `৳ ${toBanglaNumber(Math.abs(row?.paymentDifference))} (কম)`
                                    : row?.paymentDifference > 0
                                      ? `৳ ${toBanglaNumber(row?.paymentDifference)} (বেশি)`
                                      : "৳ 0"
                                }
                              />


                            </tr>


                          ))}
                        </>
                      ) : (
                        <tr>
                          <td className="text-center py-5" colSpan={9}>
                            {NO_DATA_FOUND_MESSAGE}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  {/* Summary */}
                  <div className="mt-4 overflow-hidden rounded-md border border-gray-200 bg-gray-50">
                    {/* Total Bill */}
                    <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-2.5">
                      <span className="font-medium text-gray-700">
                        মোট বিল
                      </span>

                      <span className="font-medium text-gray-800">
                        ৳ {toBanglaNumber(summary?.totalBill ?? 0)}
                      </span>
                    </div>

                    {/* Advance */}
                    <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-2.5">
                      <span className="font-medium text-orange-500">
                        অগ্রিম
                      </span>

                      <span className="font-medium text-orange-500">
                        ৳ {toBanglaNumber(summary?.advancePayment ?? 0)}
                      </span>
                    </div>

                    {/* Cutting */}
                    <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-2.5">
                      <span className="font-medium text-orange-500">
                        কর্তন
                      </span>

                      <span className="font-medium text-orange-500">
                        ৳ {toBanglaNumber(summary?.cutting ?? 0)}
                      </span>
                    </div>

                    {/* Payment */}
                    <div className="grid grid-cols-2 border-b border-gray-200 px-4 py-2.5">
                      <span className="font-medium text-[#039A63]">
                        পেমেন্ট
                      </span>

                      <span className="font-medium text-[#039A63]">
                        ৳ {toBanglaNumber(summary?.payment ?? 0)}
                      </span>
                    </div>

                    {/* Difference */}
                    <div className="grid grid-cols-2 px-4 py-2.5">
                      <span
                        className={`font-semibold ${summary?.paymentDifference < 0
                          ? "text-red-500"
                          : summary?.paymentDifference > 0
                            ? "text-[#039A63]"
                            : "text-gray-600"
                          }`}
                      >
                        কম/বেশি
                      </span>

                      <span
                        className={`font-semibold ${summary?.paymentDifference < 0
                          ? "text-red-500"
                          : summary?.paymentDifference > 0
                            ? "text-[#039A63]"
                            : "text-gray-600"
                          }`}
                      >
                        {summary?.paymentDifference < 0
                          ? `৳ ${toBanglaNumber(
                            Math.abs(summary.paymentDifference),
                          )} (কম)`
                          : summary?.paymentDifference > 0
                            ? `৳ ${toBanglaNumber(
                              summary.paymentDifference,
                            )} (বেশি)`
                            : "৳ ০"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
        </div>

      </div>
    </CustomReportModal>
  );
};

export default PaymentReportModal;