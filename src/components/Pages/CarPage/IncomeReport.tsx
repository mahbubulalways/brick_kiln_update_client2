"use client";

interface ReportItem {
  id: string;
  vehicleName: string;
  income: number;
  expense: number;
  netIncome: number;
}

interface IncomeReportProps {
  data?: ReportItem[];
}

const IncomeReport = ({ data = [] }: IncomeReportProps) => {
  const toBanglaNumber = (value: number) =>
    new Intl.NumberFormat("bn-BD").format(value);

  return (
    <div className="h-full overflow-hidden rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="bg-emerald-600 px-4 py-3 text-center">
        <h2 className="text-lg font-semibold text-white">ইনকাম রিপোর্ট</h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-emerald-50">
              <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700">
                গাড়ির নাম
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-blue-600">
                আয়
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-red-500">
                ব্যয়
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right text-sm font-medium text-emerald-600">
                ইনকাম
              </th>
            </tr>
          </thead>

          <tbody>
            {data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border-b border-gray-100 px-4 py-3 text-sm text-gray-700">
                    {item.vehicleName}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right text-sm text-blue-600">
                    {toBanglaNumber(item.income)}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right text-sm text-red-500">
                    {toBanglaNumber(item.expense)}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right text-sm font-medium text-emerald-600">
                    {toBanglaNumber(item.netIncome)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
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