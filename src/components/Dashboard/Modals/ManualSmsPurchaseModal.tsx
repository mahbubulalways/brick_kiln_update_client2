"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    AlertTriangle,
} from "lucide-react";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";

import { usePurchaseSmsMutation } from "@/redux/features/sms.features";
import { showToast } from "@/components/Toast/CustomToast";

type TData = {
    smsRate: number;
    bkash: string;
    nogod: string;
    rocket: string;
};

type TPaymentModal = {
    isOpen: boolean;
    onClose: () => void;
    info: TData;
};

type TPaymentForm = {
    smsQuantity: number;
    ratePerSms: number;
    paymentMethod: string;
    phoneNumber: string;
    transactionId: string;
    totalAmount: number;
};

const ManualSmsPurchaseModal = ({
    isOpen,
    onClose,
    info,
}: TPaymentModal) => {
    const [purchaseAsync, { isLoading }] = usePurchaseSmsMutation();

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors }
    } = useForm<TPaymentForm>({});

    const amount = watch("totalAmount");
    const paymentMethod = watch("paymentMethod");

    const smsRate = Number(info?.smsRate || 0);

    const smsCount =
        amount && smsRate > 0
            ? Math.floor(Number(amount) / smsRate)
            : 0;


    // Keep calculated values updated
    useEffect(() => {
        setValue("smsQuantity", smsCount);
        setValue("ratePerSms", smsRate);
    }, [smsCount, smsRate, setValue]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            reset({
                smsQuantity: 0,
                ratePerSms: smsRate,
                paymentMethod: "",
                phoneNumber: "",
                transactionId: "",
                totalAmount: 0,
            });
        }
    }, [isOpen, reset, smsRate]);

    const onSubmit = async (data: TPaymentForm) => {
        if (smsCount <= 0) {
            showToast({
                type: "error",
                title: "সঠিক পরিমাণ লিখুন।",
            });
            return;
        }
        const payload = {
            smsQuantity: smsCount,
            ratePerSms: smsRate,
            paymentMethod: data.paymentMethod,
            phoneNumber: data.phoneNumber,
            transactionId: data.transactionId,
            totalAmount: data.totalAmount,
        };

        try {
            await purchaseAsync(payload).unwrap();

            showToast({
                type: "success",
                title: "SMS কেনার আবেদন সফলভাবে জমা হয়েছে।",
            });

            reset();
            onClose();
        } catch (error: any) {
            console.error("SMS purchase failed:", error);

            showToast({
                type: "error",
                title:
                    error?.data?.message ||
                    "SMS কেনার আবেদন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="SMS রিচার্জ"
            width="xxl"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {/* Warning */}
                <div className="mb-5 flex items-center gap-2 rounded-lg border border-[#f5df93] bg-[#fffbed] p-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#e5b800]" />

                    <p className="text-[12px] leading-5 text-gray-500">
                        নিচের নম্বরে টাকা পাঠিয়ে{" "}
                        <span className="font-semibold text-[#039a63]">
                            TrxID
                        </span>{" "}
                        কপি করুন।
                        <br />
                        SMS রেট :{" "}
                        <span className="font-semibold">
                            {info?.smsRate} টাকা প্রতি এসএমএস।
                        </span>
                    </p>
                </div>

                {/* Main Content */}
                <div className="mb-5 grid grid-cols-1 gap-5 rounded-xl border border-gray-100 bg-white p-4 shadow-sm md:grid-cols-[290px_1fr]">
                    {/* Payment Numbers */}
                    <div className="border-b border-gray-200 pb-4 md:border-b-0 md:border-r md:pr-4">
                        {/* bKash */}
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[12px] font-semibold text-gray-500">
                                    বিকাশ
                                </span>

                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                                    সেন্ড মানি
                                </span>
                            </div>

                            <p className="text-[15px] font-semibold tracking-wide text-[#039a63]">
                                {info?.bkash}
                            </p>
                        </div>

                        {/* Rocket */}
                        <div className="mb-3 rounded-xl border border-gray-200 bg-white p-3">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[12px] font-semibold text-gray-500">
                                    রকেট
                                </span>

                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                                    সেন্ড মানি
                                </span>
                            </div>

                            <p className="text-[15px] font-semibold tracking-wide text-[#039a63]">
                                {info?.rocket}
                            </p>
                        </div>

                        {/* Nagad */}
                        <div className="rounded-xl border border-gray-200 bg-white p-3">
                            <div className="mb-1 flex items-center justify-between">
                                <span className="text-[12px] font-semibold text-gray-500">
                                    নগদ
                                </span>

                                <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-400">
                                    সেন্ড মানি
                                </span>
                            </div>

                            <p className="text-[15px] font-semibold tracking-wide text-[#039a63]">
                                {info?.nogod}
                            </p>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="flex flex-col justify-center">
                        {/* Payment Method */}
                        <div className="mb-4">
                            <CustomSelect
                                name="paymentMethod"
                                label="পেমেন্ট মেথড"
                                placeholder="সিলেক্ট করুন"
                                control={control}
                                options={[
                                    {
                                        value: "bkash",
                                        label: "বিকাশ",
                                    },
                                    {
                                        value: "rocket",
                                        label: "রকেট",
                                    },
                                    {
                                        value: "nogod",
                                        label: "নগদ",
                                    },
                                ]}
                            />
                        </div>

                        {/* Phone + Transaction ID */}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                name="phoneNumber"
                                label="প্রেরকের নম্বর"
                                placeholder="017..."
                                register={register}
                                type="text"
                                error={errors.phoneNumber}
                                rules={{
                                    required: "মোবাইল নম্বর দিন",
                                    validate: (value) => {
                                        if (!value) return true;

                                        const phone = String(value).replace(/\s+/g, "");

                                        return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone)
                                            ? true
                                            : "সঠিক মোবাইল নম্বর দিন";
                                    },
                                }}
                            />

                            <CustomInput
                                name="transactionId"
                                label="Transaction ID"
                                placeholder="XDF..."
                                register={register}
                                type="text"
                                error={errors.transactionId}
                                rules={{
                                    validate: (value) => {
                                        if (!value) return true;

                                        return String(value).trim().length >= 3
                                            ? true
                                            : "সঠিক Transaction ID দিন";
                                    },
                                }}
                            />
                        </div>

                        {/* Amount + SMS */}
                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <CustomInput
                                name="totalAmount"
                                label="টাকার পরিমাণ"
                                placeholder="500"
                                register={register}
                                type="number"
                                error={errors.totalAmount}
                                rules={{
                                    required: "টাকার পরিমাণ দিন",
                                    validate: (value) =>
                                        Number(value) > 0 || "টাকার পরিমাণ ০-এর বেশি হতে হবে",
                                }}
                            />

                            <div>
                                <label className="mb-1 block text-[13px] font-semibold text-gray-500">
                                    SMS পাবেন
                                </label>

                                <div className="flex h-[38px] items-center justify-center rounded-lg border border-[#b8f0da] bg-[#effdf7] text-[14px] font-semibold text-[#039a63]">
                                    {smsCount} টি SMS
                                </div>
                            </div>
                        </div>


                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                isLoading ||
                                smsCount <= 0 ||
                                !paymentMethod
                            }
                            className="mt-4 h-[44px] w-full cursor-pointer rounded-lg bg-[#039a63] text-[15px] font-semibold text-white shadow-[0_5px_15px_rgba(3,154,99,0.18)] transition hover:bg-[#028957] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isLoading
                                ? "পেমেন্ট প্রসেস হচ্ছে..."
                                : "পেমেন্ট কনফার্ম করুন"}
                        </button>
                    </div>
                </div>
            </form>
        </CustomModal>
    );
};

export default ManualSmsPurchaseModal;