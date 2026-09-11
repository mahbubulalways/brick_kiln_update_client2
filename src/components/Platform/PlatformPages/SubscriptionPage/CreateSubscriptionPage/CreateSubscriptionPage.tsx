"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useForm } from "react-hook-form";
import { billingCycleOptions, features, planTypeOptions, TFeatureKey } from "./subscription.features";
import { useCreateSubscriptionMutation } from "@/redux/system.features/system.subscription.featurs";
import { showToast } from "@/components/Toast/CustomToast";


type TSubscriptionPlanForm = {
    name: string;
    type:
    | "FREE"
    | "BASIC"
    | "PROFESSIONAL"
    | "ENTERPRISE";
    description: string;
    price: number;
    billingCycle: "MONTHLY" | "YEARLY";
    features: TFeatureKey[];
    maxUsers: number | null;
    maxStorage: number | null;
    maxInvoices: number | null;
    maxTasks: number | null;
    maxSms: number | null;
    isActive: boolean;
};



const CreateSubscriptionPage = () => {
    const [createSubscription, { isLoading }] = useCreateSubscriptionMutation()
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
    } = useForm<TSubscriptionPlanForm>({
        defaultValues: {
            name: "Basic Plan",
            type: "BASIC",
            description: "ছোট ভাটার জন্য প্রাথমিক ফিচারসহ ফ্রি প্ল্যান",
            price: 0,
            billingCycle: "MONTHLY",
            features: [
                "DASHBOARD",
                "INVOICE",
                "PAYMENT",
                "DELIVERY",
                "DUE",
                "CASH",
                "CUSTOMER",
            ],
            maxUsers: 1,
            maxInvoices: 100,
            maxStorage: 1,
            maxTasks: 10,
            maxSms: 0,
            isActive: true,
        },
    });

    const selectedFeatures = watch("features");

    const handleFeatureChange = (
        feature: TFeatureKey,
    ) => {
        const currentFeatures = selectedFeatures || [];

        if (currentFeatures.includes(feature)) {
            setValue(
                "features",
                currentFeatures.filter(
                    (item) => item !== feature,
                ),
                {
                    shouldValidate: true,
                    shouldDirty: true,
                },
            );
        } else {
            setValue(
                "features",
                [...currentFeatures, feature],
                {
                    shouldValidate: true,
                    shouldDirty: true,
                },
            );
        }
    };

    const onSubmit = async (data: TSubscriptionPlanForm) => {
        try {
            const result = await createSubscription(data).unwrap();

            if (result?.success) {
                showToast({
                    title:
                        result?.message ||
                        "সাবস্ক্রিপশন প্ল্যান সফলভাবে তৈরি হয়েছে।",
                    type: "success",
                });
            }
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    "সাবস্ক্রিপশন প্ল্যান তৈরি করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
                type: "error",
            });
        }
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {/* Plan Information */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">
                        প্ল্যানের তথ্য
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        সাবস্ক্রিপশন প্ল্যানের মূল তথ্য দিন
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <CustomInput
                        type="text"
                        name="name"
                        label="প্ল্যানের নাম"
                        register={register}
                        placeholder="যেমন: Professional"
                        error={errors.name}
                        rules={{
                            required:
                                "প্ল্যানের নাম আবশ্যক",
                        }}
                    />

                    <CustomSelect
                        name="type"
                        label="প্ল্যান টাইপ"
                        control={control}
                        options={planTypeOptions}
                        placeholder="প্ল্যান টাইপ নির্বাচন করুন"
                        error={errors.type}
                        rules={{
                            required:
                                "প্ল্যান টাইপ নির্বাচন করুন",
                        }}
                    />

                    <CustomInput
                        type="number"
                        name="price"
                        label="মূল্য"
                        register={register}
                        placeholder="1999"
                        error={errors.price}
                        rules={{
                            required: "মূল্য আবশ্যক",
                            min: {
                                value: 0,
                                message:
                                    "মূল্য ০ এর কম হতে পারবে না",
                            },
                        }}
                    />

                    <CustomSelect
                        name="billingCycle"
                        label="বিলিং সাইকেল"
                        control={control}
                        options={billingCycleOptions}
                        error={errors.billingCycle}
                        rules={{
                            required:
                                "বিলিং সাইকেল নির্বাচন করুন",
                        }}
                    />

                    <div className="md:col-span-2">
                        <CustomInput
                            type="text"
                            name="description"
                            label="বিবরণ"
                            register={register}
                            placeholder="এই প্ল্যান সম্পর্কে সংক্ষিপ্ত বিবরণ"
                            error={errors.description}
                            rules={{
                                required:
                                    "বিবরণ আবশ্যক",
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            ফিচার
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            এই প্ল্যানে কোন কোন ফিচার থাকবে
                            নির্বাচন করুন
                        </p>
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-[#039A63]">
                        {selectedFeatures.length} টি নির্বাচিত
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const isSelected =
                            selectedFeatures.includes(
                                feature.key,
                            );

                        return (
                            <button
                                type="button"
                                key={feature.key}
                                onClick={() =>
                                    handleFeatureChange(
                                        feature.key,
                                    )
                                }
                                className={`flex items-center gap-3 rounded-xl border p-3 text-left transition ${isSelected
                                    ? "border-[#039A63] bg-green-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <span
                                    className={`flex h-5 w-5 items-center justify-center rounded border text-xs ${isSelected
                                        ? "border-[#039A63] bg-[#039A63] text-white"
                                        : "border-gray-300"
                                        }`}
                                >
                                    {isSelected ? "✓" : ""}
                                </span>

                                <span className="text-sm text-gray-700">
                                    {feature.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Limits */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">
                        ব্যবহারের সীমা
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        খালি রাখলে Unlimited হিসেবে গণ্য হবে।
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
                    <CustomInput
                        type="number"
                        name="maxUsers"
                        label="সর্বোচ্চ ইউজার"
                        register={register}
                        placeholder="Unlimited"
                        error={errors.maxUsers}
                        rules={{
                            min: {
                                value: 1,
                                message:
                                    "কমপক্ষে ১ দিতে হবে",
                            },
                        }}
                    />
                    <CustomInput
                        type="number"
                        name="maxInvoices"
                        label="সর্বোচ্চ চালান"
                        register={register}
                        placeholder="Unlimited"
                        error={errors.maxInvoices}
                        rules={{
                            min: {
                                value: 1,
                                message:
                                    "কমপক্ষে ১ দিতে হবে",
                            },
                        }}
                    />

                    <CustomInput
                        type="number"
                        name="maxStorage"
                        label="স্টোরেজ (GB)"
                        register={register}
                        placeholder="Unlimited"
                        error={errors.maxStorage}
                        // rules={{
                        //     min: {
                        //         value: 1,
                        //         message:
                        //             "কমপক্ষে ১ GB দিতে হবে",
                        //     },
                        // }}
                    />

                    <CustomInput
                        type="number"
                        name="maxTasks"
                        label="সর্বোচ্চ টাস্ক"
                        register={register}
                        placeholder="Unlimited"
                        error={errors.maxTasks}
                        // rules={{
                        //     min: {
                        //         value: 1,
                        //         message:
                        //             "কমপক্ষে ১ দিতে হবে",
                        //     },
                        // }}
                    />

                    <CustomInput
                        type="number"
                        name="maxSms"
                        label="SMS Limit"
                        register={register}
                        placeholder="Unlimited"
                        error={errors.maxSms}
                        rules={{
                            min: {
                                value: 0,
                                message:
                                    "SMS limit ০ এর কম হতে পারবে না",
                            },
                        }}
                    />
                </div>
            </div>

            {/* Status */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
                <label className="flex cursor-pointer items-center gap-3">
                    <input
                        type="checkbox"
                        {...register("isActive")}
                        className="h-4 w-4 accent-[#039A63]"
                    />

                    <div>
                        <p className="text-sm font-medium text-gray-800">
                            প্ল্যান Active রাখুন
                        </p>

                        <p className="text-xs text-gray-500">
                            Active না থাকলে নতুন subscription-এ
                            এই প্ল্যান দেখানো হবে না।
                        </p>
                    </div>
                </label>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg disabled:bg-gray-500 bg-[#039A63] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#028653]"
                >
                    প্ল্যান তৈরি করুন
                </button>
            </div>
        </form>
    );
};

export default CreateSubscriptionPage;