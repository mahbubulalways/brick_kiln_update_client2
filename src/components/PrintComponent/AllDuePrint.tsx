"use client";

import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { IGetAllDueList } from "../Pages/DuePage/AllDueListPage/AllDueListPage";

type TAllDuePrintProps = {
    dues: IGetAllDueList[];
    date?: Date;
    vataInformation: TVataInformation;
};

const AllDuePrint = ({
    dues = [],
    date = new Date(),
    vataInformation,
}: TAllDuePrintProps) => {
    const formatNumber = (
        value: number | null | undefined,
    ) => {
        return toBanglaNumber(
            Number(value ?? 0).toLocaleString(),
        );
    };

    const totalDeliveryDue = dues.reduce(
        (total, row) =>
            total + Number(row?.remainingDelivery ?? 0),
        0,
    );

    const totalDue = dues.reduce(
        (total, row) =>
            total + Number(row?.remainingDue ?? 0),
        0,
    );

    return (
        <div
            id="payment-page-print"
            className="relative w-full bg-white text-black"
        >
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none pt-[500px]"
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

            <div className="relative z-10 text-black">
                <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </div>

                    <div className="min-w-[150px] text-right leading-tight">
                        {vataInformation?.ownerName && (
                            <p className="text-[13px] font-bold">
                                প্রোঃ{" "}
                                {vataInformation.ownerName}
                            </p>
                        )}

                        {vataInformation?.ownerPhoneNumber && (
                            <p className="mt-0.5 text-[14px] font-bold">
                                {
                                    vataInformation.ownerPhoneNumber
                                }
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-3 text-center">
                    <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
                        {vataInformation?.nameBangla}
                    </h1>

                    {vataInformation?.shortDescription && (
                        <p className="mt-1 text-[12px] font-semibold">
                            {
                                vataInformation.shortDescription
                            }
                        </p>
                    )}
                </div>

                {(vataInformation?.additionalAddress ||
                    vataInformation?.address) && (
                        <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
                            {vataInformation.additionalAddress}

                            {vataInformation.additionalAddress &&
                                vataInformation.address
                                ? " • "
                                : ""}

                            {vataInformation.address}
                        </div>
                    )}

                {(vataInformation?.challanPersonOneName ||
                    vataInformation?.challanPersonTwoName ||
                    vataInformation?.challanManagerPhoneNumber) && (
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                            {vataInformation?.challanPersonOneName && (
                                <span>
                                    <span className="font-bold">
                                        {
                                            vataInformation.challanPersonOneName
                                        }
                                    </span>
                                    :{" "}
                                    {
                                        vataInformation.challanPersonOnePhoneNumber
                                    }
                                </span>
                            )}

                            {vataInformation?.challanPersonTwoName && (
                                <span>
                                    <span className="font-bold">
                                        {
                                            vataInformation.challanPersonTwoName
                                        }
                                    </span>
                                    :{" "}
                                    {
                                        vataInformation.challanPersonTwoPhoneNumber
                                    }
                                </span>
                            )}

                            {vataInformation?.challanManagerPhoneNumber && (
                                <span>
                                    <span className="font-bold">
                                        ম্যানেজার
                                    </span>
                                    :{" "}
                                    {
                                        vataInformation.challanManagerPhoneNumber
                                    }
                                </span>
                            )}
                        </div>
                    )}
            </div>

            <div className="relative mt-4 flex min-h-[28px] items-center justify-between">
                <p className="text-[10px] font-semibold">
                    তারিখঃ{" "}
                    {formatBanglaDate({
                        date,
                    })}
                </p>

                <div className="absolute left-1/2 -translate-x-1/2 rounded-full bg-[#E5E7EB] px-12 py-1.5">
                    <p className="whitespace-nowrap text-[12px] font-bold leading-none">
                        সকল বাকি রিপোর্ট
                    </p>
                </div>

                <p className="text-[10px] font-bold">
                    মোট বাকিঃ{" "}
                    {formatNumber(totalDue)} টাকা
                </p>
            </div>

            <div className="relative z-10 mt-2">
                <table className="w-full border-collapse text-[9px] text-black">
                    <thead>
                        <tr className="bg-[#F1F2F3]">
                            <th className="w-[35px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                নং
                            </th>

                            <th className="w-[75px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                কা.আইডি
                            </th>

                            <th className="w-[100px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                নাম
                            </th>

                            <th className="border border-gray-300 px-1 py-1.5 text-center font-normal">
                                ঠিকানা
                            </th>

                            <th className="w-[95px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                ফোন নম্বর
                            </th>
                            <th className="w-[95px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                পরিশোধের তারিখ
                            </th>

                            <th className="w-[100px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                নোট
                            </th>

                            <th className="w-[65px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                সিজন
                            </th>

                            <th className="w-[75px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                ডেলিভারি বাকি
                            </th>

                            <th className="w-[80px] border border-gray-300 px-1 py-1.5 text-center font-normal">
                                টাকা বাকি
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {dues.length > 0 ? (
                            dues.map(
                                (
                                    row: IGetAllDueList,
                                    index: number,
                                ) => (
                                    <tr key={row?.id}>
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {toBanglaNumber(
                                                String(index + 1),
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.customerCode || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.name || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.address || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.phoneNumber || "-"}
                                        </td>
                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {formatBanglaDate({ date: row?.nextDate! }) || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.note || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {row?.season || "-"}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center">
                                            {formatNumber(
                                                row?.remainingDelivery,
                                            )}
                                        </td>

                                        <td className="border border-gray-300 px-1 py-1.5 text-center font-semibold">
                                            ৳{" "}
                                            {formatNumber(
                                                row?.remainingDue,
                                            )}
                                        </td>
                                    </tr>
                                ),
                            )
                        ) : (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="border border-gray-300 py-5 text-center text-gray-500"
                                >
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        )}

                        {dues.length > 0 && (
                            <tr className="bg-[#F1F2F3] font-semibold">
                                <td
                                    colSpan={8}
                                    className="border border-gray-300 px-1 py-1.5 text-right"
                                >
                                    সর্বমোটঃ
                                </td>

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    {formatNumber(
                                        totalDeliveryDue,
                                    )}
                                </td>

                                <td className="border border-gray-300 px-1 py-1.5 text-center">
                                    ৳ {formatNumber(totalDue)}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="relative z-10 mt-12 grid grid-cols-3">
                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        ম্যানেজার
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        মালিক
                    </p>
                </div>

                <div className="text-center">
                    <div className="mx-auto w-[150px] border-t border-black" />

                    <p className="mt-1 text-[9px] font-semibold">
                        অপারেটর
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AllDuePrint;