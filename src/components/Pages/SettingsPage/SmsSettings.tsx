"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    MessageCircle,
    MoreHorizontal,
    Save,
} from "lucide-react";

import {
    useCreateOrUpdateVataSmsSettingsMutation,
    useGetVataSmsSittingsQuery,
} from "@/redux/features/vata.sms.sittings";

import { showToast } from "@/components/Toast/CustomToast";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TSmsSettingsForm = {
    newInvoice: boolean;
    updateInvoice: boolean;
    deleteInvoice: boolean;
    newDelivery: boolean;
    newDueCollection: boolean;
    deuCollectionUpdate: boolean;
};

const settings = [
    {
        name: "newInvoice" as const,
        title: "নতুন ইনভয়েস",
        description: "কাস্টমার ইনভয়েস প্রিন্ট করার সময় এসএমএস যাবে",
    },
    {
        name: "updateInvoice" as const,
        title: "ইনভয়েস আপডেট",
        description: "কোনো ইনভয়েস এডিট বা আপডেট করলে এসএমএস যাবে",
    },
    {
        name: "deleteInvoice" as const,
        title: "ইনভয়েস ডিলিট",
        description: "ইনভয়েস ডিলিট করলে কাস্টমার বা এডমিন এসএমএস পাবে",
    },
    {
        name: "newDelivery" as const,
        title: "নতুন ডেলিভারি",
        description: "নতুন ডেলিভারি এন্ট্রি দেওয়ার সময় এসএমএস যাবে",
    },
    {
        name: "newDueCollection" as const,
        title: "নতুন বাকি কালেকশন",
        description: "বকেয়া টাকা জমা সময় এসএমএস যাবে",
    },
    {
        name: "deuCollectionUpdate" as const,
        title: "বাকি কালেকশন আপডেট",
        description: "জমা বকেয়া এন্ট্রি আপডেট করলে এসএমএস যাবে",
    },
];

const defaultValues: TSmsSettingsForm = {
    newInvoice: false,
    updateInvoice: false,
    deleteInvoice: false,
    newDelivery: false,
    newDueCollection: false,
    deuCollectionUpdate: false,
};

export default function SmsSettings() {
    const [
        createOrUpdate,
        { isLoading: isSaving },
    ] = useCreateOrUpdateVataSmsSettingsMutation();

    const {
        data: response,
        isLoading: isGetting,
        isError: isGetError,
    } = useGetVataSmsSittingsQuery(undefined);

    const {
        control,
        handleSubmit,
        reset,
    } = useForm<TSmsSettingsForm>({
        defaultValues,
    });

    useEffect(() => {
        if (response) {
            const settingsData = response?.data ?? response;

            reset({
                newInvoice: Boolean(settingsData?.newInvoice),
                updateInvoice: Boolean(settingsData?.updateInvoice),
                deleteInvoice: Boolean(settingsData?.deleteInvoice),
                newDelivery: Boolean(settingsData?.newDelivery),
                newDueCollection: Boolean(settingsData?.newDueCollection),
                deuCollectionUpdate: Boolean(
                    settingsData?.deuCollectionUpdate,
                ),
            });
        }
    }, [response, reset]);

    const onSubmit = async (formData: TSmsSettingsForm) => {
        try {
            const result = await createOrUpdate(formData).unwrap();
            showToast(
                {
                    title: result?.message || "SMS সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে",
                    type: "success",
                }
            );
        } catch (error: any) {
            showToast(
                {
                    title: error?.data?.message || "SMS সেটিংস সংরক্ষণ করা যায়নি",
                    type: "error",
                }
            );
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="bg-[#f8fafc] px-4 py-5 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-[1450px]">
                    <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#00a86b] text-white shadow-sm">
                            <MessageCircle
                                size={23}
                                strokeWidth={2.3}
                            />
                        </div>

                        <div>
                            <h1 className="text-[21px] font-bold leading-tight text-gray-900">
                                এসএমএস সেটিংস
                            </h1>

                            <p className="mt-1 text-[13px] text-[#94a3b8]">
                                কোন অ্যাকশনের সময় স্বয়ংক্রিয়ভাবে এসএমএস পাঠাতে চান তা ঠিক করুন
                            </p>
                        </div>
                    </div>

                    {isGetting ? (
                        <CustomLoader cls="h-[40vh]" />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                                {settings.map((item) => (
                                    <div
                                        key={item.name}
                                        className="flex min-h-[76px] items-center justify-between rounded-xl border border-[#e7edf3] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)]"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#f1f5f9]">
                                                <MoreHorizontal
                                                    size={18}
                                                    strokeWidth={3}
                                                    className="text-[#94a3b8]"
                                                />
                                            </div>

                                            <div className="min-w-0">
                                                <h2 className="text-[15px] font-bold leading-5 text-[#111827]">
                                                    {item.title}
                                                </h2>

                                                <p className="mt-0.5 text-[13px] leading-5 text-[#94a3b8]">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>

                                        <Controller
                                            name={item.name}
                                            control={control}
                                            render={({ field }) => (
                                                <button
                                                    type="button"
                                                    disabled={isSaving}
                                                    onClick={() =>
                                                        field.onChange(!field.value)
                                                    }
                                                    className={`relative ml-4 h-[29px] w-[65px] shrink-0 rounded-full transition-all duration-200 ${field.value
                                                        ? "bg-[#00a86b]"
                                                        : "bg-[#cbd5e1]"
                                                        } ${isSaving
                                                            ? "cursor-not-allowed opacity-70"
                                                            : ""
                                                        }`}
                                                >
                                                    <span
                                                        className={`absolute top-[3px] flex h-[23px] w-[23px] items-center justify-center rounded-full bg-white shadow-sm transition-all duration-200 ${field.value
                                                            ? "right-[3px]"
                                                            : "left-[3px]"
                                                            }`}
                                                    />

                                                    <span
                                                        className={`absolute top-1/2 -translate-y-1/2 text-[11px] font-semibold ${field.value
                                                            ? "left-[9px] text-white"
                                                            : "right-[8px] text-white"
                                                            }`}
                                                    >
                                                        {field.value ? "চালু" : "বন্ধ"}
                                                    </span>
                                                </button>
                                            )}
                                        />
                                    </div>
                                ))}
                            </div>

                            <button
                                type="submit"
                                disabled={isSaving}
                                className="mt-6 flex h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#00a86b] text-[15px] font-bold text-white shadow-[0_6px_16px_rgba(0,168,107,0.12)] transition hover:bg-[#009661] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <Save
                                    size={17}
                                    strokeWidth={2.5}
                                />

                                {isSaving
                                    ? "সেভ হচ্ছে..."
                                    : "সেটিংস সেভ করুন"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}