import {
  TChallanItemReport,
  TChallanSummary,
} from "@/interface/dashboard";

interface ChalanTableProps {
  items: TChallanItemReport[];
  summary: TChallanSummary;
}

export default function ChalanTable({
  items,
  summary,
}: ChalanTableProps) {
  const itemSummary =
    items?.reduce(
      (acc, item) => {
        acc.totalChallan += Number(item?.totalChallan ?? 0);
        acc.totalQuantity += Number(item?.totalQuantity ?? 0);
        acc.totalPrice += Number(item?.totalPrice ?? 0);

        return acc;
      },
      {
        totalChallan: 0,
        totalQuantity: 0,
        totalPrice: 0,
      },
    ) ?? {
      totalChallan: 0,
      totalQuantity: 0,
      totalPrice: 0,
    };

  const formatNumber = (value: number) =>
    value.toLocaleString("bn-BD");

  return (
    <div className="h-[375px] w-full overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between bg-[#039A63] px-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            চালান
          </h3>

          <p className="mt-0.5 text-[10px] text-emerald-100">
            শ্রেণিভিত্তিক চালান ও বিক্রয়ের হিসাব
          </p>
        </div>

        <div className="ml-2 shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-right">
          <p className="text-[9px] text-emerald-100">
            মোট চালান
          </p>

          <p className="text-sm font-bold text-white">
            {formatNumber(itemSummary.totalChallan)}
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <thead>
            <tr className="h-[38px] border-b border-emerald-100 bg-emerald-50">
              <th className="w-[32%] px-3 text-left font-semibold text-emerald-800">
                শ্রেণি
              </th>

              <th className="w-[18%] px-2 text-right font-semibold text-emerald-800">
                চালান
              </th>

              <th className="w-[22%] px-2 text-right font-semibold text-emerald-800">
                পরিমাণ
              </th>

              <th className="w-[28%] px-3 text-right font-semibold text-emerald-800">
                মোট মূল্য
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="h-[230px] overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <tbody>
            {items?.length > 0 ? (
              <>
                {items.map((row, index) => (
                  <tr
                    key={index}
                    className="h-[39px] border-b border-slate-100 transition-colors hover:bg-emerald-50/50"
                  >
                    <td className="w-[32%] px-3 text-left font-medium text-slate-700">
                      {row?.class}
                    </td>

                    <td className="w-[18%] px-2 text-right text-slate-600">
                      {formatNumber(
                        Number(row?.totalChallan ?? 0),
                      )}
                    </td>

                    <td className="w-[22%] px-2 text-right text-slate-600">
                      {formatNumber(
                        Number(row?.totalQuantity ?? 0),
                      )}
                    </td>

                    <td className="w-[28%] px-3 text-right font-semibold text-slate-700">
                      ৳{" "}
                      {formatNumber(
                        Number(row?.totalPrice ?? 0),
                      )}
                    </td>
                  </tr>
                ))}

                <tr className="h-[39px] bg-emerald-50">
                  <td className="px-3 text-left font-bold text-emerald-800">
                    সর্বমোট
                  </td>

                  <td className="px-2 text-right font-bold text-emerald-700">
                    {formatNumber(itemSummary.totalChallan)}
                  </td>

                  <td className="px-2 text-right font-bold text-emerald-700">
                    {formatNumber(itemSummary.totalQuantity)}
                  </td>

                  <td className="px-3 text-right font-bold text-emerald-700">
                    ৳ {formatNumber(itemSummary.totalPrice)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-3 py-10 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                      <span className="text-base text-emerald-500">
                        —
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      কোনো চালানের তথ্য নেই
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      চালান যোগ হলে এখানে তথ্য দেখা যাবে
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex h-[47px] items-center justify-between border-t border-emerald-100 bg-slate-50/70 px-3">
        <div>
          <p className="text-[9px] text-slate-400">
            মোট পরিমাণ
          </p>

          <p className="mt-0.5 text-xs font-bold text-slate-700">
            {formatNumber(itemSummary.totalQuantity)}{" "}
            <span className="text-[10px] font-medium text-slate-400">
              টি
            </span>
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-slate-400">
            মোট মূল্য
          </p>

          <p className="mt-0.5 text-xs font-bold text-[#039A63]">
            ৳ {formatNumber(itemSummary.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}