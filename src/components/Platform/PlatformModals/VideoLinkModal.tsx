"use client";

import { SubmitHandler, useForm } from "react-hook-form";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";

import { showToast } from "@/components/Toast/CustomToast";
import { useCreateYoutubeLinkApiMutation } from "@/redux/system.features/system.youtube.link.features";


type TVideoLinkModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TVideoLink = {
    link: string;
};

const VideoLinkModal = ({
    isOpen,
    onClose,
}: TVideoLinkModal) => {
    const [mutateAsync, { isLoading: isCreateLoading }] =
        useCreateYoutubeLinkApiMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TVideoLink>({
        defaultValues: {
            link: "",
        },
    });

    const handleClose = () => {
        if (isCreateLoading) return;

        reset({
            link: "",
        });

        onClose();
    };

    const onSubmit: SubmitHandler<TVideoLink> = async (data) => {
        try {
            const result = await mutateAsync({
                link: data.link.trim(),
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
            title="ভিডিও লিংক"
            width="md"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <CustomInput
                        name="link"
                        label="ভিডিও লিংক"
                        placeholder="ইউটিউব ভিডিও লিংক লিখুন"
                        register={register}
                        type="text"
                    />

                    {errors.link && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.link.message}
                        </p>
                    )}
                </div>

                <div className="flex w-full items-center justify-between gap-2 pt-5">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isCreateLoading}
                        className="w-full cursor-pointer rounded border border-gray-300 bg-white px-8 py-1.5 text-center text-[14px] font-medium text-gray-500 duration-300 hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        বাতিল
                    </button>

                    <button
                        type="submit"
                        disabled={isCreateLoading}
                        className="flex w-full cursor-pointer items-center justify-center rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isCreateLoading
                            ? "সংরক্ষণ"
                            : "সংরক্ষণ করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default VideoLinkModal;