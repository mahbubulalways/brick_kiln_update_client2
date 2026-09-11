"use client";

import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { AlertTriangle, PackageMinus, Wrench } from "lucide-react";

import {
    useGetSingleGoodsLossQuery,
    useUpdateGoodsLossMutation,
} from "@/redux/features/good_stock.features";

import CustomModal from "@/components/Reusable/CustomModal";

import CustomInput from "@/components/Reusable/CustomInput";

import CustomStatus from "@/components/Reusable/CustomStatus";

import { showToast } from "@/components/Toast/CustomToast";

type TGoodLossType = "LOST" | "DEMAGE";

type TCreateGoodLossUpdateModalProps = {
    id: string;
    type: TGoodLossType;
    open: boolean;
    onClose: () => void;
};

type TFormValues = {
    quantity: number;
};

export default function CreateGoodLossUpdateModal({
    id,
    type,
    open,
    onClose,
}: TCreateGoodLossUpdateModalProps) {
    const { data, isLoading, isError } = useGetSingleGoodsLossQuery(id, {
        skip: !id || !open,
        refetchOnMountOrArgChange: true,
    });

    const [updateAsync, { isLoading: updateLoading }] =
        useUpdateGoodsLossMutation();

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm<TFormValues>({
        mode: "onChange",
        defaultValues: {
            quantity: 0,
        },
    });

    useEffect(() => {
        if (data?.data) {
            reset({
                quantity: Number(data.data.quantity || 0),
            });
        }
    }, [data, reset]);

    const isLost = type === "LOST";

    const title = isLost
        ? "মালামাল হারানো রেকর্ড"
        : "মালামাল নষ্ট রেকর্ড";

    const updateTitle = isLost
        ? "হারানো মালামাল আপডেট"
        : "নষ্ট মালামাল মেরামত";

    const description = isLost
        ? "হারানো মালামালের পরিমাণ আপডেট করুন"
        : "নষ্ট মালামালের পরিমাণ আপডেট করুন";

    const Icon = isLost ? AlertTriangle : PackageMinus;

    const good = data?.data;

    const totalQuantity = Number(good?.quantity || 0);

    const onSubmit = async (values: TFormValues) => {
        const payload = {
            id,
            data: {
                quantity: Number(values.quantity),
            },
        };

        try {
            const result = await updateAsync(payload).unwrap();
            if (result) {
                showToast({
                    title: result?.message || "মালামাল সফলভাবে আপডেট করা হয়েছে।",
                    type: "success"
                });
                onClose();
            }
        } catch (error: any) {
            showToast(
                {
                    title: error?.data?.message ||
                        "মালামাল আপডেট করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
                    type: "error"
                }
            );
        }
    };

    return (
        <CustomModal
            isOpen={open}
            onClose={onClose}
            title={title}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Icon className="h-5 w-5 text-gray-700" />
                    </div>

                    <div>
                        <h3 className="text-base font-semibold text-gray-800">
                            {updateTitle}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {description}
                        </p>
                    </div>
                </div>

                {isLoading && <CustomStatus type="loading" />}

                {isError && <CustomStatus type="error" />}

                {!isLoading && !isError && data?.data && (
                    <>
                        <div className="rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-500">
                                বর্তমানে
                            </p>

                            <div className="mt-2 flex items-center justify-between">
                                <span className="font-medium text-gray-800">
                                    {good?.good?.name || "মালামাল"}
                                </span>

                                <span className="rounded-md bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                                    {totalQuantity} টি
                                </span>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                মোট {isLost ? "হারানো" : "নষ্ট"} স্টকে আছে:{" "}
                                {totalQuantity} টি
                            </p>
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {isLost
                                    ? "হারানোর পরিমাণ"
                                    : "মেরামতের পরিমাণ"}
                            </label>

                            <CustomInput
                                type="number"
                                name="quantity"
                                register={register}
                                placeholder={
                                    isLost
                                        ? "হারানোর পরিমাণ লিখুন"
                                        : "মেরামতের পরিমাণ লিখুন"
                                }
                                rules={{
                                    required: "পরিমাণ লিখুন",
                                    min: {
                                        value: 1,
                                        message:
                                            "পরিমাণ ১ এর কম হতে পারবে না",
                                    },
                                    max: {
                                        value: totalQuantity,
                                        message: `সর্বোচ্চ ${totalQuantity} টি দিতে পারবেন`,
                                    },
                                    validate: (value) => {
                                        const inputQuantity = Number(
                                            value || 0
                                        );

                                        if (
                                            inputQuantity > totalQuantity
                                        ) {
                                            return `সর্বোচ্চ ${totalQuantity} টি দিতে পারবেন`;
                                        }

                                        return true;
                                    },
                                }}
                            />

                            {errors.quantity && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.quantity.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#006A4E] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#00553F] disabled:cursor-not-allowed disabled:bg-gray-500"
                        >
                            {isLost ? (
                                <AlertTriangle className="h-4 w-4" />
                            ) : (
                                <Wrench className="h-4 w-4" />
                            )}

                            {updateLoading
                                ? "আপডেট হচ্ছে..."
                                : isLost
                                    ? "হারানো মালামাল আপডেট করুন"
                                    : "নষ্ট মালামাল মেরামত করুন"}
                        </button>
                    </>
                )}
            </form>
        </CustomModal>
    );
}