"use client";

import { useEffect } from "react";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";

import { showToast } from "@/components/Toast/CustomToast";

import { useUpdateGoodsCategoryMutation } from "@/redux/features/goods_stock_category.features";

type TAssetCategory = {
    name: string;
};

type TCategoryData = {
    id: string;
    name: string;
};

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    data: TCategoryData | null;
};

const UpdateAssetsCategoryModal = ({
    isOpen,
    onClose,
    data,
}: TCustomModal) => {
    const [updateAssetCategory, { isLoading }] =
        useUpdateGoodsCategoryMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TAssetCategory>({
        defaultValues: {
            name: "",
        },
    });

    useEffect(() => {
        if (isOpen && data) {
            reset({
                name: data.name || "",
            });
        }
    }, [isOpen, data, reset]);

    const onSubmit: SubmitHandler<TAssetCategory> = async (formData) => {
        if (!data?.id) return;

        try {
            const result = await updateAssetCategory({
                id: data.id,
                data: formData,
            }).unwrap();

            if (result?.success) {
                reset();
                onClose();

                return showToast({
                    title:
                        result?.message ||
                        "মালামালের ক্যাটাগরি সফলভাবে আপডেট করা হয়েছে",
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }

            return showToast({
                title: "মালামালের ক্যাটাগরি আপডেট করা যায়নি",
                type: "error",
                options: {
                    duration: 4000,
                    icon: <MdOutlineError className="h-5 w-5" />,
                },
            });
        } catch (error: any) {
            ;

            return showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! মালামালের ক্যাটাগরি আপডেট করতে সার্ভারে ত্রুটি হয়েছে",
                type: "error",
                options: {
                    duration: 4000,
                    icon: <MdOutlineError className="h-5 w-5" />,
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="ক্যাটাগরি আপডেট করুন"
            width="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <CustomInput
                    name="name"
                    label="নাম"
                    placeholder="নাম লিখুন"
                    register={register}
                    type="text"
                    rules={{
                        required: "নাম প্রদান করুন",
                    }}
                    error={errors.name}
                />

                <div className="flex items-center justify-between pt-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                    >
                        বাতিল
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default UpdateAssetsCategoryModal;