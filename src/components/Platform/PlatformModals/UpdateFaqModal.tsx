"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomTextArea from "@/components/Reusable/CustomTextArea";

import { showToast } from "@/components/Toast/CustomToast";

import { useUpdateFaqApiMutation } from "@/redux/system.features/system.faq.features";

type TFaq = {
    id: string;
    title: string;
    description: string;
};

type TUpdateFaqModal = {
    isOpen: boolean;
    onClose: () => void;
    faqData: TFaq;
};

const UpdateFaqModal = ({
    isOpen,
    onClose,
    faqData,
}: TUpdateFaqModal) => {
    const [mutateAsync, { isLoading: isUpdateLoading }] =
        useUpdateFaqApiMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TFaq>({
        defaultValues: {
            id: "",
            title: "",
            description: "",
        },
    });

    useEffect(() => {
        if (faqData) {
            reset({
                id: faqData.id,
                title: faqData.title,
                description: faqData.description,
            });
        }
    }, [faqData, reset]);

    const handleClose = () => {
        if (isUpdateLoading) return;

        reset({
            id: "",
            title: "",
            description: "",
        });

        onClose();
    };

    const onSubmit: SubmitHandler<TFaq> = async (data) => {
        try {
            const result = await mutateAsync({
                id: data.id,
                title: data.title.trim(),
                description: data.description.trim(),
            }).unwrap();

            if (result?.success) {
                handleClose();

                showToast({
                    title: result.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }
        } catch (error: any) {
            console.log(error);

            showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
                type: "error",
                options: {
                    duration: 4000,
                    icon: <MdOutlineError className="h-5 w-5" />,
                },
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="FAQ আপডেট"
            width="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="hidden" {...register("id")} />

                <div className="space-y-4">
                    <CustomInput
                        name="title"
                        label="টাইটেল"
                        placeholder="FAQ টাইটেল লিখুন"
                        register={register}
                        type="text"
                    />

                    {errors.title && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.title.message}
                        </p>
                    )}

                    <CustomTextArea
                        name="description"
                        label="ডেসক্রিপশন"
                        placeholder="FAQ এর বিস্তারিত লিখুন"
                        register={register}
                    />

                    {errors.description && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="flex w-full items-center justify-between gap-2 pt-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isUpdateLoading}
                        className="w-full cursor-pointer rounded border border-gray-300 bg-white px-8 py-1.5 text-center text-[14px] font-medium text-gray-500 duration-300 hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        বাতিল
                    </button>

                    <button
                        type="submit"
                        disabled={isUpdateLoading}
                        className="flex w-full cursor-pointer items-center justify-center rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isUpdateLoading
                            ? "আপডেট হচ্ছে..."
                            : "আপডেট করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default UpdateFaqModal;