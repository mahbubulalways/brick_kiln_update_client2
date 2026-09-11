"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { showToast } from "@/components/Toast/CustomToast";

import {
    useCreateOrUpdateSmsRateApiMutation,
    useGetSmsRateQuery,
} from "@/redux/system.features/system.sms.features";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TSmsRate = {
    ratePerSms: number;
    bkash: string;
    rocket: string;
    nogod: string;
};

const SmsRateModal = ({ isOpen, onClose }: TCustomModal) => {
    const {
        data: smsRateData,
        isLoading: isSmsRateLoading,
        isError: isSmsRateError,
    } = useGetSmsRateQuery(undefined);

    const [mutateAsync, { isLoading: isCreateLoading }] =
        useCreateOrUpdateSmsRateApiMutation();

    const { register, handleSubmit, reset, formState: { errors } } = useForm<TSmsRate>({
        defaultValues: {
            ratePerSms: 0,
            bkash: "",
            rocket: "",
            nogod: "",
        },
    });

    const smsRateInfo = smsRateData?.data;

    useEffect(() => {
        if (smsRateInfo) {
            reset({
                ratePerSms: Number(smsRateInfo.ratePerSms) || 0,
                bkash: smsRateInfo.bkash || "",
                rocket: smsRateInfo.rocket || "",
                nogod: smsRateInfo.nogod || "",
            });
        }
    }, [smsRateInfo, reset]);

    const onSubmit: SubmitHandler<TSmsRate> = async (data) => {
        try {
            const result = await mutateAsync({
                ratePerSms: data.ratePerSms,
                bkash: data.bkash,
                rocket: data.rocket,
                nogod: data.nogod,
            }).unwrap();

            if (result?.success) {
                onClose();

                return showToast({
                    title: result?.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }
        } catch (error: any) {
            console.log(error);

            return showToast({
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
            onClose={onClose}
            title="এসএমএস রেট ও ব্যাংকিং সেটিংস"
            width="md"
        >
            {isSmsRateLoading ? (
                <CustomLoader cls="h-[30vh]" />
            ) : isSmsRateError ? (
                <CustomStatus type="error" />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-2 gap-4">
                        <CustomInput
                            name="ratePerSms"
                            label="প্রতি এসএমএস রেট"
                            placeholder="প্রতি এসএমএস রেট"
                            register={register}
                            type="number"
                        />

                        <CustomInput
                            name="bkash"
                            label="বিকাশ"
                            placeholder="বিকাশ নম্বর"
                            register={register}
                            type="number"
                            rules={{
                                validate: (value) => {
                                    if (!value) return true;

                                    const phone = String(value).replace(/\s+/g, "");

                                    return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone)
                                        ? true
                                        : "সঠিক মোবাইল নম্বর দিন";
                                },
                            }}
                            error={errors?.bkash}
                        />

                        <CustomInput
                            name="rocket"
                            label="রকেট"
                            placeholder="রকেট নম্বর"
                            register={register}
                            type="number"
                            rules={{
                                validate: (value) => {
                                    if (!value) return true;

                                    const phone = String(value).replace(/\s+/g, "");

                                    return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone)
                                        ? true
                                        : "সঠিক মোবাইল নম্বর দিন";
                                },
                            }}
                            error={errors?.rocket}
                        />

                        <CustomInput
                            name="nogod"
                            label="নগদ"
                            placeholder="নগদ নম্বর"
                            register={register}
                            type="number"
                            rules={{
                                validate: (value) => {
                                    if (!value) return true;

                                    const phone = String(value).replace(/\s+/g, "");

                                    return /^(?:\+8801|8801|01)[3-9]\d{8}$/.test(phone)
                                        ? true
                                        : "সঠিক মোবাইল নম্বর দিন";
                                },
                            }}
                            error={errors?.nogod}
                        />
                    </div>

                    <div className="flex w-full items-center gap-2 justify-between pt-5">
                        <div
                            onClick={onClose}
                            className="cursor-pointer text-center w-full rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                        >
                            বাতিল
                        </div>

                        <button
                            type="submit"
                            className="cursor-pointer w-full rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100"
                            disabled={isCreateLoading || isSmsRateLoading}
                        >
                            {isCreateLoading
                                ? "সংরক্ষণ হচ্ছে..."
                                : "সংরক্ষণ করুন"}
                        </button>
                    </div>
                </form>
            )}
        </CustomModal>
    );
};

export default SmsRateModal;