"use client";

import { useMemo } from "react";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TCalculateAssetsProps = {
    goods: any[];
};

const CalculateAssets = ({ goods }: TCalculateAssetsProps) => {
    const assetSummary = useMemo(() => {
        let totalAsset = 0;
        let currentStock = 0;
        let damagedItems = 0;
        let lostItems = 0;

        let totalAssetValue = 0;
        let currentStockValue = 0;
        let damagedItemsValue = 0;
        let lostItemsValue = 0;

        goods.forEach((item) => {
            const total = Number(item.quantity || 0);
            const price = Number(item.price || 0);

            const issue = Number(item.totalIssue || 0);
            const damage = Number(item.totalDamage || 0);
            const lost = Number(item.totalLost || 0);

            const current = Math.max(
                total - issue - damage - lost,
                0
            );

            totalAsset += total;
            currentStock += current;
            damagedItems += damage;
            lostItems += lost;

            totalAssetValue += total * price;
            currentStockValue += current * price;
            damagedItemsValue += damage * price;
            lostItemsValue += lost * price;
        });

        return {
            totalAsset,
            currentStock,
            damagedItems,
            lostItems,
            totalAssetValue,
            currentStockValue,
            damagedItemsValue,
            lostItemsValue,
        };
    }, [goods]);

    return (
        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    মোট অ্যাসেট
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    ৳ {toBanglaNumber(assetSummary.totalAssetValue)}
                </h2>

                <span className="mt-2 inline-block rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    পরিমাণ: {toBanglaNumber(assetSummary.totalAsset)} টি
                </span>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    বর্তমান স্টক
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    ৳ {toBanglaNumber(assetSummary.currentStockValue)}
                </h2>

                <span className="mt-2 inline-block rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    পরিমাণ: {toBanglaNumber(assetSummary.currentStock)} টি
                </span>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    নষ্ট আইটেম
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    ৳ {toBanglaNumber(assetSummary.damagedItemsValue)}
                </h2>

                <span className="mt-2 inline-block rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    পরিমাণ: {toBanglaNumber(assetSummary.damagedItems)} টি
                </span>
            </div>

            <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                <p className="text-sm font-medium text-gray-500">
                    হারানো আইটেম
                </p>

                <h2 className="mt-2 text-2xl font-bold text-gray-800">
                    ৳ {toBanglaNumber(assetSummary.lostItemsValue)}
                </h2>

                <span className="mt-2 inline-block rounded-md bg-gray-100 px-3 py-1 text-xs text-gray-600">
                    পরিমাণ: {toBanglaNumber(assetSummary.lostItems)} টি
                </span>
            </div>
        </div>
    );
};

export default CalculateAssets;