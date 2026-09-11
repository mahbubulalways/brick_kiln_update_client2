import { TSingleGoodStock } from "@/interface/good_stock";

export function PurchaseHistoryTab({
    good,
}: {
    good: TSingleGoodStock;
}) {
    const product = good || {};
 const formatBanglaDateShort = ({ date }: { date: string }) =>
    new Date(date).toLocaleDateString("bn-BD");


    return (
        <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="grid grid-cols-6 bg-[#039A63] text-sm font-semibold text-white">
                <div className="px-4 py-3">তারিখ</div>
                <div className="px-4 py-3">ভেন্ডর</div>
                <div className="px-4 py-3">একক মূল্য</div>
                <div className="px-4 py-3">পরিমাণ</div>
                <div className="px-4 py-3">মোট খরচ</div>
                <div className="px-4 py-3">ওয়ারেন্টি</div>
            </div>

            <div
                className="grid grid-cols-6 items-center border-t border-gray-100 text-sm"
            >
                <div className="px-4 py-2 font-medium text-gray-700">
                    {formatBanglaDateShort({ date: product?.createdAt })}
                </div>

                <div className="px-4 py-2 text-gray-600">
                    {product?.shop || "-"}
                </div>
                <div className="px-4 py-2 text-gray-600">
                    {product?.price || "-"}
                </div>
                <div className="px-4 py-2 text-gray-600">
                    {product?.quantity || "-"}
                </div>
                <div className="px-4 py-2 text-gray-600">
                    {product?.quantity * product?.price || "-"}
                </div>
                <div className="px-4 py-2 text-gray-600">
                    {product?.warranty
                        ? formatBanglaDateShort({ date: product?.warranty })
                        : "-"}
                </div>
            </div>
        </div>
    );
}