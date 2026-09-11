"use client";


import { useCreateSeasonMutation } from "@/redux/features/season.features";
import { showToast } from "@/components/Toast/CustomToast";


export default function SeasonCreate() {
    const [createSeason, { isLoading }] = useCreateSeasonMutation();

    const handleCreateSeason = async () => {
        try {
            const res = await createSeason({}).unwrap();

            if (res?.success) {
                showToast({
                    title: res?.message || "সিজন সফলভাবে তৈরি হয়েছে",
                    type: "success",
                });
            }
        } catch (error: any) {
            showToast({
                title: error?.data?.message || "সিজন তৈরি করা যায়নি",
                type: "error",
            });
        }
    };

    return (
        <button
            type="button"
            onClick={handleCreateSeason}
            disabled={isLoading}
            className="rounded-md bg-[#039A63] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#028653] disabled:cursor-not-allowed disabled:opacity-50"
        >
            {isLoading ? "তৈরি হচ্ছে..." : "সিজন তৈরি করুন"}
        </button>
    );
}