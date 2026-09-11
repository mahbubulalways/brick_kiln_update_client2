import { TPaymentReport } from "@/interface/dashboard";

interface PaymentProps {
  payments: TPaymentReport[];
}

export default function Payment({ payments }: PaymentProps) {
  const totalAmount =
    payments?.reduce(
      (total, item) =>
        total + Number(item?.amount ?? 0),
      0,
    ) ?? 0;

  const totalPaymentGiven =
    payments?.reduce(
      (total, item) =>
        total + Number(item?.paymentGiven ?? 0),
      0,
    ) ?? 0;

  const formatNumber = (value: number) =>
    value.toLocaleString("bn-BD");

  return (
    <div className="h-[375px] w-full overflow-hidden rounded-xl border border-orange-100 bg-white shadow-sm">
      {/* Header */}
      <div className="flex h-[60px] shrink-0 items-center justify-between bg-[#FB923C] px-3">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-white">
            পেমেন্ট
          </h3>

          <p className="mt-0.5 text-[10px] text-orange-100">
            খরচ ও পেমেন্টের হিসাব
          </p>
        </div>

        <div className="ml-2 shrink-0 rounded-lg bg-white/15 px-2.5 py-1 text-right">
          <p className="text-[9px] text-orange-100">
            মোট পেমেন্ট
          </p>

          <p className="text-sm font-bold text-white">
            ৳ {formatNumber(totalPaymentGiven)}
          </p>
        </div>
      </div>

      {/* Table Header */}
      <div className="overflow-hidden">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <thead>
            <tr className="h-[38px] border-b border-orange-100 bg-orange-50">
              <th className="w-[40%] px-3 text-left font-semibold text-orange-700">
                খরচ
              </th>

              <th className="w-[27%] px-2 text-right font-semibold text-orange-700">
                পরিমাণ
              </th>

              <th className="w-[33%] px-3 text-right font-semibold text-orange-700">
                পেমেন্ট দেওয়া
              </th>
            </tr>
          </thead>
        </table>
      </div>

      {/* Scrollable Body */}
      <div className="h-[230px] overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-[11px]">
          <tbody>
            {payments?.length > 0 ? (
              <>
                {payments.map((p, index) => (
                  <tr
                    key={index}
                    className="h-[39px] border-b border-orange-50 transition-colors hover:bg-orange-50/60"
                  >
                    <td className="w-[40%] px-3 text-left font-medium text-slate-700">
                      {p?.ledger}
                    </td>

                    <td className="w-[27%] px-2 text-right text-slate-600">
                      ৳{" "}
                      {formatNumber(
                        Number(p?.amount ?? 0),
                      )}
                    </td>

                    <td className="w-[33%] px-3 text-right font-semibold text-orange-600">
                      ৳{" "}
                      {formatNumber(
                        Number(p?.paymentGiven ?? 0),
                      )}
                    </td>
                  </tr>
                ))}

                <tr className="h-[39px] bg-orange-50">
                  <td className="px-3 text-left font-bold text-orange-800">
                    সর্বমোট
                  </td>

                  <td className="px-2 text-right font-bold text-orange-700">
                    ৳ {formatNumber(totalAmount)}
                  </td>

                  <td className="px-3 text-right font-bold text-orange-700">
                    ৳ {formatNumber(totalPaymentGiven)}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-3 py-10 text-center"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50">
                      <span className="text-base text-orange-400">
                        —
                      </span>
                    </div>

                    <p className="mt-2 text-xs font-medium text-slate-500">
                      কোনো পেমেন্ট তথ্য নেই
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-400">
                      পেমেন্ট যোগ হলে এখানে তথ্য দেখা যাবে
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex h-[47px] items-center justify-between border-t border-orange-100 bg-slate-50/70 px-3">
        <div>
          <p className="text-[9px] text-slate-400">
            মোট খরচ
          </p>

          <p className="mt-0.5 text-xs font-bold text-slate-700">
            ৳ {formatNumber(totalAmount)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] text-slate-400">
            মোট পেমেন্ট
          </p>

          <p className="mt-0.5 text-xs font-bold text-[#FB923C]">
            ৳ {formatNumber(totalPaymentGiven)}
          </p>
        </div>
      </div>
    </div>
  );
}