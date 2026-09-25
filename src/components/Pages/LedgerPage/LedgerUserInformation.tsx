import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TLedgerDetails = {
    id: string;
    name: string;
    parentId: string | null;
    phoneNumber: string | null;
    rate: number | null;
    quantity: number | null;
    salary: number | null;
    serial: number | null;
    startDate: Date | null;
    openingBalance: number | null;
    openingBalanceType: string | null;
    weeklyFood: number | null;
    season: {
        name: string;
    } | null;
    _count: {
        payments: number;
    };
};

export default function LedgerUserInformation({
    ledger,
}: {
    ledger: TLedgerDetails;
}) {
    return (
        <div className="mb-2 overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#039A63] text-base font-semibold text-white">
                        {ledger?.name?.charAt(0) || "-"}
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-gray-800">
                            {ledger?.name || "-"}
                        </h2>

                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            {ledger?.phoneNumber && (
                                <span>{ledger.phoneNumber}</span>
                            )}

                            {ledger?.phoneNumber && ledger?.season?.name && (
                                <span className="text-gray-300">•</span>
                            )}

                            {ledger?.season?.name && (
                                <span className="font-medium text-[#039A63]">
                                    {ledger.season.name}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {ledger?.serial !== null && (
                        <div className="rounded border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-600">
                            সিরিয়াল:{" "}
                            <span className="font-semibold text-gray-800">
                                {toBanglaNumber(ledger?.serial)}
                            </span>
                        </div>
                    )}

                    <div className="rounded border border-[#B5F1D5] bg-[#E9FFF5] px-3 py-1 text-xs text-[#039A63]">
                        পেমেন্ট:{" "}
                        <span className="font-semibold">
                            {toBanglaNumber(
                                ledger?._count?.payments ?? 0
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 sm:grid-cols-3 lg:grid-cols-6 lg:divide-y-0">
                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        রেট
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        ৳ {toBanglaNumber(ledger?.rate ?? 0)}
                    </p>
                </div>

                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        পরিমাণ
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        {toBanglaNumber(ledger?.quantity ?? 0)}
                    </p>
                </div>

                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        বেতন
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        ৳ {toBanglaNumber(ledger?.salary ?? 0)}
                    </p>
                </div>

                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        সাপ্তাহিক খোরাকি
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        ৳ {toBanglaNumber(ledger?.weeklyFood ?? 0)}
                    </p>
                </div>

                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        যোগদানের তারিখ
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        {ledger?.startDate
                            ? formatBanglaDate({
                                date: ledger.startDate,
                            })
                            : "-"}
                    </p>
                </div>

                <div className="px-4 py-2.5">
                    <p className="text-[11px] text-gray-400">
                        ওপেনিং ব্যালেন্স
                    </p>

                    <p className="mt-1 text-sm font-semibold text-gray-700">
                        ৳ {toBanglaNumber(
                            ledger?.openingBalance ?? 0
                        )} {ledger?.openingBalanceType}
                    </p>
                </div>
            </div>

            {ledger?.openingBalanceType && (
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs">
                    <span className="text-gray-400">
                        প্রারম্ভিক ব্যালেন্সের ধরন
                    </span>

                    <span className="font-semibold text-gray-700">
                        {ledger.openingBalanceType}
                    </span>
                </div>
            )}
        </div>
    );
}