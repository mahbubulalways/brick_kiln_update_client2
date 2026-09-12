"use client";

import React, { useEffect } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";

import { showToast } from "@/components/Toast/CustomToast";

import { useCreateOrUpdateHelpLineMutation } from "@/redux/system.features/syste.helpline.features";

interface THelpLine {
    id?: string;
    phoneNumber: string;
    website: string;
    email: string;
}

interface HelpLineModalProps {
    isOpen: boolean;
    onClose: () => void;
    data?: THelpLine | null;
}

const HelpLineModal = ({
    isOpen,
    onClose,
    data,
}: HelpLineModalProps) => {
    const isEdit = !!data?.id;

    const [createOrUpdateHelpLine, { isLoading }] =
        useCreateOrUpdateHelpLineMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<THelpLine>({
        defaultValues: {
            phoneNumber: "",
            website: "",
            email: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            reset({
                phoneNumber: data?.phoneNumber || "",
                website: data?.website || "",
                email: data?.email || "",
            });
        }
    }, [data, isOpen, reset]);

    const onSubmit: SubmitHandler<THelpLine> = async (formData) => {
        try {
            await createOrUpdateHelpLine({
                ...(data?.id && {
                    id: data.id,
                }),
                phoneNumber: formData.phoneNumber,
                website: formData.website,
                email: formData.email,
            }).unwrap();

            showToast({
                type: "success",
                title: isEdit
                    ? "হেল্পলাইন সফলভাবে আপডেট হয়েছে"
                    : "হেল্পলাইন সফলভাবে তৈরি হয়েছে",
            });

            reset();
            onClose();
        } catch (error: any) {
            showToast({
                type: "error",
                title:
                    error?.data?.message ||
                    "কিছু একটা সমস্যা হয়েছে",
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? "হেল্পলাইন আপডেট" : "হেল্পলাইন তৈরি"}
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <CustomInput
                        label="ফোন নম্বর"
                        placeholder="ফোন নম্বর লিখুন"
                        name="phoneNumber"
                        register={register}
                        type="number"
                        error={errors.phoneNumber}
                    />

                    <CustomInput
                        label="ইমেইল"
                        placeholder="ইমেইল লিখুন"
                        name="email"
                        register={register}
                        type="email"
                        error={errors.email}
                    />

                    <div className="md:col-span-2">
                        <CustomInput
                            label="ওয়েবসাইট"
                            placeholder="https://example.com"
                            name="website"
                            register={register}
                            type="url"
                            error={errors.website}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                    >
                        বাতিল
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer rounded-lg bg-[#039A63] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#027d50] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading
                            ? "সংরক্ষণ হচ্ছে..."
                            : isEdit
                                ? "আপডেট করুন"
                                : "তৈরি করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default HelpLineModal;