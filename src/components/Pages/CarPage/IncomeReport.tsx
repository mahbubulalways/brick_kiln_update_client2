"use client";

import { useGetAllCarIncomeHistoryQuery } from "@/redux/features/car.features";

interface ReportItem {
  id: string;
  carNo: string;
  carIncomeDeliveries: {
    amount: number;
  }[];
}

interface IncomeReportResponse {
  data: ReportItem[];
}

const IncomeReport = () => {
  const { data, isLoading } = useGetAllCarIncomeHistoryQuery(undefined);

  const carInfo: ReportItem[] = (data as IncomeReportResponse)?.data ?? [];

  const toBanglaNumber = (value: number) =>
    new Intl.NumberFormat("bn-BD").format(value);

  const getCarTotal = (item: ReportItem) => {
    return item.carIncomeDeliveries.reduce(
      (total, delivery) => total + Number(delivery.amount || 0),
      0,
    );
  };

  const grandTotal = carInfo.reduce(
    (total, item) => total + getCarTotal(item),
    0,
  );

  return (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="bg-emerald-600 px-4 py-3 text-center">
        <h2 className="text-lg font-semibold text-white">
          গাড়ির ইনকাম রিপোর্ট
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-50">
              <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                গাড়ির নাম
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-emerald-600">
                মোট আয়
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <>
                {Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="border-b border-gray-100 px-4 py-3">
                      <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
                    </td>

                    <td className="border-b border-gray-100 px-4 py-3">
                      <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-200" />
                    </td>
                  </tr>
                ))}
              </>
            ) : carInfo.length > 0 ? (
              <>
                {carInfo.map((item) => {
                  const carTotal = getCarTotal(item);

                  return (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                        গাড়ি-{toBanglaNumber(Number(item.carNo))}
                      </td>

                      <td className="border-b border-gray-100 px-4 py-3 text-right text-sm font-medium text-emerald-600">
                        {toBanglaNumber(carTotal)}
                      </td>
                    </tr>
                  );
                })}

                <tr className="bg-emerald-50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-800">
                    সর্বমোট আয়
                  </td>

                  <td className="px-4 py-3 text-right text-sm font-bold text-emerald-700">
                    {toBanglaNumber(grandTotal)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  কোনো তথ্য পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IncomeReport;