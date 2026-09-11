"use client"
import { TVataInformation } from "@/interface/vata";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { IChallanForDataShow, IChallanItem, TClassAndRate } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TDailyChallanPrintProps = {
    invoices: IChallanForDataShow[];
    date?: Date;
    vataInformation: TVataInformation
};

const DailyChallanPrint = ({
    invoices = [],
    date = new Date(),
    vataInformation
}: TDailyChallanPrintProps) => {



    return (
        <div
            id="unload-page-print"
            className="w-full bg-white text-black"
        >
            <div className="text-center">
                <h1 className="text-[24px] font-bold leading-tight">
                    {vataInformation?.nameBangla}
                </h1>

                <p className="text-[14px] font-medium mt-1">
                    {vataInformation?.address}
                </p>

                <p className="text-[13px] mt-1">
                    {toBanglaNumber(
                        vataInformation?.challanPersonOneName || ""
                    )}
                </p>

                <p className="text-[12px]">
                    প্রোপ্রাইটরঃ {vataInformation?.ownerName}
                </p>
            </div>

            <div className="relative flex items-center justify-between mt-4 min-h-[30px]">
                <p className="text-[12px] font-semibold leading-none">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>

                <div className="absolute left-1/2 -translate-x-1/2 bg-[#E5E7EB] rounded-full px-6 py-1 flex items-center justify-center">
                    <p className="text-[15px] font-bold leading-none whitespace-nowrap">
                        দৈনিক চালান তালিকা
                    </p>
                </div>
                <p className="text-[12px] font-bold leading-none">
                    মোট চালানঃ{" "}
                    {toBanglaNumber(invoices?.length)}
                </p>
            </div>

            <table className="w-full border-collapse mt-2 text-[10px] text-black">
                <thead>
                    <tr className="bg-[#F1F2F3]">
                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            চালান
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            কাস্টমার
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            শ্রেণি
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            পরিমাণ
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            দর
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            মূল্য
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            মোট মূল্য
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            ছাড়
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            ভাড়া
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            সর্বমোট
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            নগদ
                        </th>

                        <th className="border border-gray-300 font-normal text-nowrap py-1 px-1">
                            বাকি
                        </th>
                    </tr>
                </thead>

                <tbody className="font-normal">
                    {invoices?.length > 0 ? (
                        <>
                            {invoices.map((row: IChallanForDataShow) => {
                                const items = row?.items || [];

                                return items.map((item: IChallanItem, index: number) => (
                                    <tr
                                        key={`${row?.id}-${item?.id}`}
                                        className="font-normal"
                                    >
                                        {/* চালান */}
                                        {index === 0 && (
                                            <>
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center whitespace-nowrap"
                                                >
                                                    {toBanglaNumber(String(row?.serial || "-"))}
                                                </td>

                                                {/* কাস্টমার */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    {row?.customer?.name || "-"}
                                                </td>
                                            </>
                                        )}

                                        {/* শ্রেণি */}
                                        <td className="border border-gray-300 py-1 px-1 text-center whitespace-nowrap">
                                            {item?.class || "-"}
                                        </td>

                                        {/* পরিমাণ */}
                                        <td className="border border-gray-300 py-1 px-1 text-center">
                                            {toBanglaNumber(
                                                Number(item?.quantity || 0).toLocaleString()
                                            )}
                                        </td>

                                        {/* দরমূল্য */}
                                        <td className="border border-gray-300 py-1 px-1 text-center">
                                            {toBanglaNumber(
                                                Number(item?.rate || 0).toLocaleString()
                                            )}
                                        </td>

                                        {/* মূল্য */}
                                        <td className="border border-gray-300 py-1 px-1 text-center">
                                            ৳{" "}
                                            {toBanglaNumber(
                                                Number(item?.price || 0).toLocaleString()
                                            )}
                                        </td>

                                        {index === 0 && (
                                            <>
                                                {/* মোট মূল্য */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.productPrice || 0).toLocaleString()
                                                    )}
                                                </td>

                                                {/* ছাড় */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.discount || 0).toLocaleString()
                                                    )}
                                                </td>

                                                {/* ভাড়া */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.carRent || 0).toLocaleString()
                                                    )}
                                                </td>

                                                {/* সর্বমোট */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.totalPrice || 0).toLocaleString()
                                                    )}
                                                </td>

                                                {/* নগদ */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.cash || 0).toLocaleString()
                                                    )}
                                                </td>

                                                {/* বাকি */}
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center"
                                                >
                                                    ৳{" "}
                                                    {toBanglaNumber(
                                                        Number(row?.due || 0).toLocaleString()
                                                    )}
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ));
                            })}

                            {/* TOTAL */}
                            <tr className="bg-[#F1F2F3]">
                                <td
                                    colSpan={3}
                                    className="border border-gray-300 py-1 px-1 text-right"
                                >
                                    মোট যোগ
                                </td>

                                {/* পরিমাণ */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total +
                                                    (row?.items || []).reduce(
                                                        (sum, item) =>
                                                            sum + Number(item?.quantity || 0),
                                                        0
                                                    ),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* দরমূল্য */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    -
                                </td>

                                {/* মূল্য */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total +
                                                    (row?.items || []).reduce(
                                                        (sum, item) =>
                                                            sum + Number(item?.price || 0),
                                                        0
                                                    ),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* মোট মূল্য */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.productPrice || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* ছাড় */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.discount || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* ভাড়া */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.carRent || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* সর্বমোট */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.totalPrice || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* নগদ */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.cash || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>

                                {/* বাকি */}
                                <td className="border border-gray-300 py-1 px-1 text-center">
                                    ৳{" "}
                                    {toBanglaNumber(
                                        invoices
                                            .reduce(
                                                (total, row) =>
                                                    total + Number(row?.due || 0),
                                                0
                                            )
                                            .toLocaleString()
                                    )}
                                </td>
                            </tr>
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={12}
                                className="border border-gray-300 py-3 text-center"
                            >
                                কোনো তথ্য পাওয়া যায়নি
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="grid grid-cols-2 mt-14">
                {/* MANAGER */}

                <div className="text-center">
                    <div className="border-t border-black w-[85px] mx-auto" />

                    <p className="text-[11px] font-semibold mt-1">
                        ম্যানেজার
                    </p>
                </div>

                {/* OWNER */}

                <div className="text-center">
                    <div className="border-t border-black w-[85px] mx-auto" />

                    <p className="text-[11px] font-semibold mt-1">
                        মালিক
                    </p>
                </div>
            </div>

            {/* =================================================
          FOOTER
      ================================================= */}

            {/* <div className="border-t border-gray-300 mt-7 pt-2 text-center">
        <p className="text-[7px] text-gray-400">
          রিপোর্ট প্রিন্টঃ{" "}
          {formatBanglaDate({
            date: new Date(),
          })}{" "}
          | Software by: Payratech.com
        </p>
      </div> */}
        </div>
    );
};

export default DailyChallanPrint;