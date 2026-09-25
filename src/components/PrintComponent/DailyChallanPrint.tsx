"use client"
import { TVataInformation } from "@/interface/vata";
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
            {/* Watermark */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
            >
                <span
                    className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
                    style={{
                        fontSize: "170px",
                    }}
                >
                    {vataInformation?.shortForm
                        ?.split("")
                        .join(".")}
                </span>
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-black">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    {/* Short Form */}
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </div>

                    {/* Owner Information */}
                    <div className="min-w-[150px] text-right leading-tight">
                        {vataInformation?.ownerName && (
                            <p className="text-[13px] font-bold">
                                প্রোঃ {vataInformation?.ownerName}
                            </p>
                        )}

                        {vataInformation?.ownerPhoneNumber && (
                            <p className="mt-0.5 text-[14px] font-bold">
                                {vataInformation?.ownerPhoneNumber}
                            </p>
                        )}
                    </div>
                </div>

                {/* Vata Name */}
                <div className="mt-3 text-center">
                    <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
                        {vataInformation?.nameBangla}
                    </h1>

                    {vataInformation?.shortDescription && (
                        <p className="mt-1 text-[12px] font-semibold">
                            {vataInformation?.shortDescription}
                        </p>
                    )}
                </div>

                {/* Address */}
                {(vataInformation?.additionalAddress ||
                    vataInformation?.address) && (
                        <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
                            {vataInformation?.additionalAddress}

                            {vataInformation?.additionalAddress &&
                                vataInformation?.address
                                ? " • "
                                : ""}

                            {vataInformation?.address}
                        </div>
                    )}

                {/* Contact Information */}
                {(vataInformation?.challanPersonOneName ||
                    vataInformation?.challanPersonTwoName ||
                    vataInformation?.challanManagerPhoneNumber) && (
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                            {vataInformation?.challanPersonOneName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonOneName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonOnePhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {vataInformation?.challanPersonTwoName}
                                    </span>
                                    :{" "}
                                    {vataInformation?.challanPersonTwoPhoneNumber}
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">
                                        ম্যানেজার
                                    </span>
                                    : {vataInformation?.challanManagerPhoneNumber}
                                </span>
                            )}
                        </div>
                    )}
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
                            ধরন
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
                                                <td
                                                    rowSpan={items.length}
                                                    className="border border-gray-300 py-1 px-1 text-center whitespace-nowrap"
                                                >
                                                    {row?.chalanType || "-"}
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
                                    colSpan={4}
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

            <div className="grid grid-cols-3 mt-14">
                {/* MANAGER */}

                <div className="text-center">
                    <div className="border-t border-black w-[150px] mx-auto" />

                    <p className="text-[11px] font-semibold mt-1">
                        ম্যানেজার
                    </p>
                </div>

                {/* OWNER */}

                <div className="text-center">
                    <div className="border-t border-black w-[150px] mx-auto" />

                    <p className="text-[11px] font-semibold mt-1">
                        মালিক
                    </p>
                </div>


                <div className="text-center">
                    <div className="border-t border-black w-[150px] mx-auto" />
                    <p className="text-[10px] font-semibold mt-1">
                        অপারেটর
                    </p>
                </div>
            </div>

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