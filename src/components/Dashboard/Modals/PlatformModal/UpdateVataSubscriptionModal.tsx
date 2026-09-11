"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useForm, SubmitHandler } from "react-hook-form";
import { showToast } from "@/components/Toast/CustomToast";

import {
    useGetVataRunningSubscriptionQuery,
    useGetSubscriptionOptionsQuery,
} from "@/redux/system.features/system.subscription.featurs";
import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { useUpdateVataSubscriptionMutation } from "@/redux/system.features/system.vata.features";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string,
};

type TVataSubscriptionForm = {
    subscriptionPlanId: string;
};

const UpdateVataSubscriptionModal = ({
    isOpen,
    onClose,
    id
}: TCustomModal) => {
    // Current running subscription
    const {
        data: runningSubscriptionData,
        isLoading: runningSubscriptionLoading,
        error,
    } = useGetVataRunningSubscriptionQuery(id, { refetchOnMountOrArgChange: true });

    // All subscription plans
    const {
        isLoading: optionsLoading,
        data: subscriptionData,
    } = useGetSubscriptionOptionsQuery(undefined);

    const [updateSubscription, { isLoading }] =
        useUpdateVataSubscriptionMutation();

    const subscriptionOptions = formatLabelValuePair({
        data: subscriptionData?.data,
        label: "name",
        value: "id",
    });

    const { handleSubmit, reset, control } =
        useForm<TVataSubscriptionForm>({
            defaultValues: {
                subscriptionPlanId: "",
            },
        });

    const onSubmit: SubmitHandler<TVataSubscriptionForm> = async (
        data
    ) => {
        try {
            const payload = {
                id,
                data
            }
            const result = await updateSubscription(payload).unwrap();

            showToast({
                title:
                    result?.message ||
                    "সাবস্ক্রিপশন সফলভাবে আপডেট হয়েছে",
                type: "success",
            });

            reset();
            onClose();
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    "সাবস্ক্রিপশন আপডেট করতে সমস্যা হয়েছে",
                type: "error",
            });
        }
    };

    const handleClear = () => {
        reset({
            subscriptionPlanId: "",
        });
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="সাবস্ক্রিপশন পরিবর্তন"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full"
            >
                {/* Current Subscription */}
                <div className="mb-5 rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <p className="text-xs text-gray-500 mb-1">
                        বর্তমান সাবস্ক্রিপশন
                    </p>

                    <p className="text-sm font-semibold text-gray-700">
                        {runningSubscriptionLoading
                            ? "লোড হচ্ছে..."
                            : runningSubscriptionData?.data
                                ?.subscriptionPlan?.name ||
                            "কোনো সাবস্ক্রিপশন নেই"}
                    </p>
                </div>

                {/* New Subscription */}
                <div className="mb-5">
                    <CustomSelect
                        name="subscriptionPlanId"
                        label="নতুন সাবস্ক্রিপশন প্ল্যান"
                        control={control}
                        options={subscriptionOptions}
                        isLoading={optionsLoading}
                        placeholder={
                            optionsLoading
                                ? "লোড হচ্ছে..."
                                : "সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন"
                        }
                    />
                </div>

                <div className="flex items-center gap-3 pt-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="
                            px-6
                            py-2
                            cursor-pointer
                            rounded-lg
                            w-full
                            border
                            border-gray-300
                            bg-white
                            text-sm
                            font-medium
                            text-gray-600
                            hover:bg-gray-50
                        "
                    >
                        ক্লিয়ার
                    </button>

                    <button
                        disabled={
                            isLoading ||
                            optionsLoading ||
                            runningSubscriptionLoading
                        }
                        type="submit"
                        className="
                            px-6
                            py-2
                            cursor-pointer
                            rounded-lg
                            w-full
                            text-sm
                            font-medium
                            text-white
                            bg-[#039A63]
                            disabled:opacity-50
                            disabled:cursor-not-allowed
                        "
                    >
                        {isLoading
                            ? "আপডেট হচ্ছে..."
                            : "আপডেট করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default UpdateVataSubscriptionModal;