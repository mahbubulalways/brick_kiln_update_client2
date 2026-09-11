import { TCash } from "@/interface/cash";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TCashPagePrintProps = {
  cashData: TCash[];
  date?: Date;
  vataInfo: TVataInformation
};

const CashPagePrint = ({
  cashData = [],
  date = new Date(),
  vataInfo
}: TCashPagePrintProps) => {
  const totalIncome = cashData
    .filter((item) => item.type === "INCOME")
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const totalExpense = cashData
    .filter((item) => item.type === "EXPENSE")
    .reduce(
      (total, item) => total + Number(item.amount),
      0
    );

  const balance = totalIncome - totalExpense;

  return (
    <div
      id="cash-page-print"
      className="w-full bg-white text-black"
    >
      {/* ================= HEADER ================= */}
      <div className="text-center">
        <h1 className="text-[24px] font-bold leading-tight">
          {vataInfo?.nameBangla}
        </h1>

        <p className="text-[14px] font-medium mt-1">
          {vataInfo?.address}
        </p>

        <p className="text-[13px] mt-1">
          {vataInfo?.challanManagerPhoneNumber}
        </p>

        <p className="text-[13px]">
          {vataInfo?.ownerName}
        </p>
      </div>

      {/* ================= DATE + TITLE + BALANCE ================= */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-[12px] font-semibold">
          তারিখঃ{" "}
          {formatBanglaDate({
            date,
          })}
        </p>

        <div className="bg-[#E5E7EB] rounded-full px-12 py-1">
          <p className="text-[15px] font-bold">
            দৈনিক ক্যাশ রিপোর্ট
          </p>
        </div>

        <p className="text-[12px] font-bold">
          মোট জেরঃ {toBanglaNumber(balance.toLocaleString())} টাকা
        </p>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="grid grid-cols-3 gap-3 mt-2">
        {/* Income */}
        <div className="border border-gray-200 bg-[#F5F6F7] text-center py-2">
          <p className="text-[11px] font-semibold">
            মোট ক্যাশ ইন
          </p>

          <p className="text-[14px] font-bold text-green-600 mt-1">
            {toBanglaNumber(
              totalIncome.toLocaleString()
            )}
          </p>
        </div>

        {/* Expense */}
        <div className="border border-gray-200 bg-[#F5F6F7] text-center py-2">
          <p className="text-[11px] font-semibold">
            মোট ক্যাশ আউট
          </p>

          <p className="text-[14px] font-bold text-red-600 mt-1">
            {toBanglaNumber(
              totalExpense.toLocaleString()
            )}
          </p>
        </div>

        {/* Balance */}
        <div className="border border-gray-200 bg-[#F5F6F7] text-center py-2">
          <p className="text-[11px] font-semibold">
            নেট ব্যালেন্স
          </p>

          <p className="text-[14px] font-bold text-blue-600 mt-1">
            {toBanglaNumber(
              balance.toLocaleString()
            )}
          </p>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border-collapse mt-2 text-[11px]">
        <thead>
          <tr className="bg-[#F1F2F3]">
            <th className="border border-gray-300 py-1 px-2 w-[6%]">
              নং
            </th>

            <th className="border border-gray-300 py-1 px-2 w-[18%]">
              উৎস
            </th>

            <th className="border border-gray-300 py-1 px-2 w-[30%]">
              বিবরণ
            </th>

            <th className="border border-gray-300 py-1 px-2 w-[13%]">
              ক্যাশ ইন
            </th>

            <th className="border border-gray-300 py-1 px-2 w-[13%]">
              ক্যাশ আউট
            </th>

            <th className="border border-gray-300 py-1 px-2 w-[20%]">
              সময়
            </th>
          </tr>
        </thead>

        <tbody>
          {cashData.length > 0 ? (
            cashData.map((row, index) => (
              <tr key={row.id}>
                <td className="border border-gray-300 py-1 px-2 text-center">
                  {toBanglaNumber(index + 1)}
                </td>

                <td className="border border-gray-300 py-1 px-2">
                  {row.source || "-"}
                </td>

                <td className="border border-gray-300 py-1 px-2">
                  {row.description || "-"}
                </td>

                <td className="border border-gray-300 py-1 px-2 text-center">
                  {row.type === "INCOME"
                    ? toBanglaNumber(
                      Number(row.amount).toLocaleString()
                    )
                    : "-"}
                </td>

                <td className="border border-gray-300 py-1 px-2 text-center">
                  {row.type === "EXPENSE"
                    ? toBanglaNumber(
                      Number(row.amount).toLocaleString()
                    )
                    : "-"}
                </td>

                <td className="border text-[10px] border-gray-300 py-1 px-2 text-center">
                  {formatBanglaDate({
                    date: row.createdAt,
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={6}
                className="border border-gray-300 py-3 text-center"
              >
                কোনো তথ্য পাওয়া যায়নি
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= SIGNATURE ================= */}
      <div className="grid grid-cols-2 mt-14">
        <div className="text-center">
          <div className="border-t border-gray-300 w-[100px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            ম্যানেজার
          </p>
        </div>

        <div className="text-center">
          <div className="border-t border-gray-300 w-[100px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            মালিক
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      {/* <div className="border-t border-gray-300 mt-6 pt-2 text-center">
        <p className="text-[7px] text-gray-400">
          প্রিন্টের সময়ঃ{" "}
          {formatBanglaDate({
            date: new Date(),
            showTime: true,
          })}{" "}
          | Software by Payratech.com
        </p>
      </div> */}
    </div>
  );
};

export default CashPagePrint;