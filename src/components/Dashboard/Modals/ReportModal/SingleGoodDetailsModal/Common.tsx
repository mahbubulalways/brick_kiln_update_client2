import { PackageOpen } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
                <PackageOpen className="h-7 w-7 text-gray-300" />
            </div>

            <p className="text-sm text-gray-400">No data</p>
        </div>
    );
}
