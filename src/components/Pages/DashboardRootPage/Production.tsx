import { PackageCheck } from "lucide-react";

interface DeliveryItem {
  class: string;
  quantity: number;
}

interface ProductionProps {
  delivery: DeliveryItem[];
}

export default function Production({
  delivery,
}: ProductionProps) {
  const totalDelivery =
    delivery?.reduce(
      (total, item) =>
        total + Number(item?.quantity ?? 0),
      0,
    ) ?? 0;

  const formatNumber = (value: number) =>
    value.toLocaleString("bn-BD");

  return (
    <div className="h-[375px] w-full overflow-hidden rounded-xl border border-indigo-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between bg-[#818CF8] px-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            ডেলিভারি
          </h3>

          <p className="mt-0.5 text-[10px] text-indigo-100">
            শ্রেণিভিত্তিক ডেলিভারির হিসাব
          </p>
        </div>

        <div className="ml-2 shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-right">
          <p className="text-[9px] text-indigo-100">
            মোট ডেলিভারি
          </p>

          <p className="text-sm font-bold text-white">
            {formatNumber(totalDelivery)}
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <thead>
            <tr className="h-[38px] border-b border-indigo-100 bg-indigo-50">
              <th className="w-[65%] px-3 text-left font-semibold text-indigo-800">
                শ্রেণি
              </th>

              <th className="w-[35%] px-3 text-right font-semibold text-indigo-800">
                ডেলিভারি
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="h-[230px] overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <tbody>
            {delivery?.length > 0 ? (
              <>
                {delivery.map((dt, index) => (
                  <tr
                    key={`${dt?.class}-${index}`}
                    className="h-[39px] border-b border-indigo-50 transition-colors hover:bg-indigo-50/60"
                  >
                    <td className="w-[65%] px-3 text-left font-medium text-slate-700">
                      {dt?.class}
                    </td>

                    <td className="w-[35%] px-3 text-right font-semibold text-indigo-600">
                      {formatNumber(
                        Number(dt?.quantity ?? 0),
                      )}
                    </td>
                  </tr>
                ))}

                <tr className="h-[39px] bg-indigo-50">
                  <td className="px-3 text-left font-bold text-indigo-800">
                    সর্বমোট
                  </td>

                  <td className="px-3 text-right font-bold text-indigo-700">
                    {formatNumber(totalDelivery)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-3 py-10 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50">
                      <PackageCheck className="h-4.5 w-4.5 text-indigo-400" />
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      কোনো ডেলিভারি তথ্য নেই
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      ডেলিভারি যোগ হলে এখানে তথ্য দেখা যাবে
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex h-[47px] items-center justify-between border-t border-indigo-100 bg-slate-50/70 px-3">
        <div>
          <p className="text-[9px] text-slate-400">
            মোট শ্রেণি
          </p>

          <p className="mt-0.5 text-xs font-bold text-slate-700">
            {formatNumber(delivery?.length ?? 0)} টি
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-slate-400">
            মোট ডেলিভারি
          </p>

          <p className="mt-0.5 text-xs font-bold text-[#818CF8]">
            {formatNumber(totalDelivery)} টি
          </p>
        </div>
      </div>
    </div>
  );
}