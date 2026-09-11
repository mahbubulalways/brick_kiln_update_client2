"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import {
    useGetSingleVataInforQuery,
    useUpdateVataInformationMutation,
} from "@/redux/system.features/system.vata.features";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type TVataInformationForm = {
    address: string;
    nameBangla: string;
    nameEnglish: string;
    ownerName: string;
    challansPhoneNumber: string;
    ownerPhoneNumber: string;
    subdomain: string;
};

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string;
};

const UpdateVataInformation = ({
    isOpen,
    onClose,
    id,
}: TCustomModal) => {
    const {
        isError,
        isLoading,
        data,
    } = useGetSingleVataInforQuery(id, {
        skip: !id || !isOpen,
        refetchOnMountOrArgChange: true,
    });

    const [updateVata, { isLoading: updateLoading }] =
        useUpdateVataInformationMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TVataInformationForm>({
        defaultValues: {
            address: "",
            nameBangla: "",
            nameEnglish: "",
            ownerName: "",
            challansPhoneNumber: "",
            ownerPhoneNumber: "",
            subdomain: "",

        },
    });

    // Set API data into form
    useEffect(() => {
        if (data?.data) {
            const vata = data.data;

            reset({
                address: vata.address || "",
                nameBangla: vata.nameBangla || "",
                nameEnglish: vata.nameEnglish || "",
                ownerName: vata.ownerName || "",
                challansPhoneNumber:
                    vata.challansPhoneNumber || "",
                ownerPhoneNumber:
                    vata.ownerPhoneNumber || "",
                subdomain: vata.subdomain || "",

            });
        }
    }, [data, reset]);

    // Submit
    const onSubmit: SubmitHandler<TVataInformationForm> = async (
        formData
    ) => {
        try {
            const payload = {
                address: formData.address,
                nameBangla: formData.nameBangla,
                nameEnglish: formData.nameEnglish,
                ownerName: formData.ownerName,
                challansPhoneNumber:
                    formData.challansPhoneNumber,
                ownerPhoneNumber:
                    formData.ownerPhoneNumber,
                subdomain: formData.subdomain,


            };

            const result = await updateVata({
                id,
                data: payload,
            }).unwrap();

            if (result?.success) {
                showToast({
                    title:
                        result?.message ||
                        "তথ্য সফলভাবে আপডেট হয়েছে",
                    type: "success",
                });

                handleClose();
            } else {
                showToast({
                    title:
                        result?.message ||
                        "তথ্য আপডেট করা সম্ভব হয়নি",
                    type: "error",
                });
            }
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
            });
        }
    };

    // Close modal
    const handleClose = () => {
        onClose();

        reset({
            address: "",
            nameBangla: "",
            nameEnglish: "",
            ownerName: "",
            challansPhoneNumber: "",
            ownerPhoneNumber: "",
            subdomain: "",

        });
    };

    // Reset to current API data
    const handleReset = () => {
        if (!data?.data) return;

        const vata = data.data;

        reset({
            address: vata.address || "",
            nameBangla: vata.nameBangla || "",
            nameEnglish: vata.nameEnglish || "",
            ownerName: vata.ownerName || "",
            challansPhoneNumber:
                vata.challansPhoneNumber || "",
            ownerPhoneNumber:
                vata.ownerPhoneNumber || "",
            subdomain: vata.subdomain || "",

        });
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="ভাটা তথ্য আপডেট"
            width="md"
        >
            {isLoading ? (
                <CustomStatus
                    type="loading"
                    fullScreen={false}
                />
            ) : isError ? (
                <CustomStatus
                    type="error"
                    fullScreen={false}
                />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Vata Name Bangla */}
                        <CustomInput
                            name="nameBangla"
                            label="ভাটার নাম (বাংলা)"
                            placeholder="ভাটার নাম (বাংলা)"
                            register={register}
                            type="text"
                            error={errors.nameBangla}
                            rules={{
                                required:
                                    "ভাটার বাংলা নাম আবশ্যক",
                            }}
                        />

                        {/* Vata Name English */}
                        <CustomInput
                            name="nameEnglish"
                            label="ভাটার নাম (ইংরেজি)"
                            placeholder="ভাটার নাম (ইংরেজি)"
                            register={register}
                            type="text"
                            error={errors.nameEnglish}
                            rules={{
                                required:
                                    "ভাটার ইংরেজি নাম আবশ্যক",
                            }}
                        />

                        {/* Owner Name */}
                        <CustomInput
                            name="ownerName"
                            label="মালিকের নাম"
                            placeholder="মালিকের নাম"
                            register={register}
                            type="text"
                            error={errors.ownerName}
                            rules={{
                                required:
                                    "মালিকের নাম আবশ্যক",
                            }}
                        />

                        {/* Owner Phone */}
                        <CustomInput
                            name="ownerPhoneNumber"
                            label="মালিকের মোবাইল নম্বর"
                            placeholder="মালিকের মোবাইল নম্বর"
                            register={register}
                            type="text"
                            error={errors.ownerPhoneNumber}
                            rules={{
                                required:
                                    "মালিকের মোবাইল নম্বর আবশ্যক",
                            }}
                        />

                        {/* Challan Phone */}
                        <CustomInput
                            name="challansPhoneNumber"
                            label="চালানের মোবাইল নম্বর"
                            placeholder="চালানের মোবাইল নম্বর"
                            register={register}
                            type="text"
                            error={errors.challansPhoneNumber}
                            rules={{
                                required:
                                    "চালানের মোবাইল নম্বর আবশ্যক",
                            }}
                        />

                        {/* Subdomain */}
                        <CustomInput
                            name="subdomain"
                            label="সাবডোমেইন"
                            placeholder="সাবডোমেইন"
                            register={register}
                            type="text"
                            error={errors.subdomain}
                            rules={{
                                required:
                                    "সাবডোমেইন আবশ্যক",
                            }}
                        />



                        <div className="md:col-span-2">
                            <CustomInput
                                name="address"
                                label="ঠিকানা"
                                placeholder="ঠিকানা"
                                register={register}
                                type="text"
                                error={errors.address}
                                rules={{
                                    required:
                                        "ঠিকানা আবশ্যক",
                                }}
                            />
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-between pt-6">
                        <button
                            type="button"
                            onClick={handleReset}
                            disabled={updateLoading}
                            className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-8 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer disabled:opacity-50"
                        >
                            রিসেট
                        </button>

                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer disabled:bg-gray-500"
                        >
                            {updateLoading
                                ? "আপডেট হচ্ছে..."
                                : "আপডেট করুন"}
                        </button>
                    </div>
                </form>
            )}
        </CustomModal>
    );
};

export default UpdateVataInformation;