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
        <div className="divide-y divide-gray-100 px-4 bg-white shadow rounded border border-gray-200">
            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">রেট</p>
                <p className="text-sm">
                    ৳ {toBanglaNumber(ledger?.rate ?? 0)}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">পরিমাণ</p>
                <p className="text-sm">
                    {toBanglaNumber(ledger?.quantity ?? 0)}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">বেতন</p>
                <p className="text-sm">
                    ৳ {toBanglaNumber(ledger?.salary ?? 0)}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">সাপ্তাহিক খোরাকি</p>
                <p className="text-sm">
                    ৳ {toBanglaNumber(ledger?.weeklyFood ?? 0)}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">যোগদানের তারিখ</p>
                <p className="text-sm">

                    {ledger?.startDate
                        ? formatBanglaDate({ date: ledger.startDate })
                        : "-"}
                </p>
            </div>

            <div className="flex items-center justify-between gap-3 py-2.5">
                <p className="text-sm ">ওপেনিং ব্যালেন্স</p>
                <p className="text-sm">
                    ৳ {toBanglaNumber(ledger?.openingBalance ?? 0)}{" "}
                    {ledger?.openingBalanceType}
                </p>
            </div>
        </div>
    );
}