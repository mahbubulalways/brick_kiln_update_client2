"use client";

import { Dispatch, SetStateAction, useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";

import {
    useGetSingleCarRentQuery,
    useUpdateCarRentMutation,
} from "@/redux/features/carRent.features";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: number | undefined;
    setSelectCarRenttId: Dispatch<SetStateAction<number | undefined>>
};

type TCarRent = {
    address: string;
    area: string;
    rent: number;
};

const UpdateCarRentModal = ({
    isOpen,
    onClose,
    id,
    setSelectCarRenttId
}: TCustomModal) => {
    const {
        data: carRentData,
        isLoading: isFetching,
        isError
    } = useGetSingleCarRentQuery(id!, {
        skip: !id || !isOpen,
    });

    const [updateCarRent, { isLoading: isUpdating }] =
        useUpdateCarRentMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TCarRent>({
        defaultValues: {
            address: "",
            area: "",
            rent: 0,
        },
    });

    // Set fetched data into form
    useEffect(() => {
        const data = carRentData?.data;

        if (data) {
            reset({
                address: data?.address || "",
                area: data?.area || "",
                rent: Number(data?.rent) || 0,
            });
        }
    }, [carRentData, reset]);

    const onSubmit: SubmitHandler<TCarRent> = async (data) => {
        if (!id) return;

        try {
            const payload = {
                address: data.address,
                area: data.area,
                rent: Number(data.rent),
            };

            const result = await updateCarRent({
                id,
                data: payload,
            }).unwrap();

            if (result?.success) {
                reset();
                onClose();
                setSelectCarRenttId(undefined)
                return showToast({
                    title: result?.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: (
                            <FaCircleCheck className="h-5 w-5" />
                        ),
                    },
                });
            }
        } catch (error: any) {
            return showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
                options: {
                    duration: 4000,
                    icon: (
                        <MdOutlineError className="h-5 w-5" />
                    ),
                },
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="গাড়ি ভাড়া আপডেট করুন"
            width="sm"
        >
            {isFetching ? (
                 <CustomStatus type="loading"/>
            ) : isError ?   <CustomStatus type="error"/>: (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-2">

                        {/* Address */}
                        <CustomInput
                            name="address"
                            label="ঠিকানা"
                            placeholder="ঠিকানা লিখুন"
                            register={register}
                            type="text"
                            error={errors.address}
                            rules={{
                                required: "ঠিকানা লিখুন",
                            }}
                        />

                        {/* Area */}
                        <CustomInput
                            name="area"
                            label="এরিয়া"
                            placeholder="এরিয়া লিখুন"
                            register={register}
                            type="text"
                            error={errors.area}
                            rules={{
                                required: "এরিয়া লিখুন",
                            }}
                        />

                        {/* Rent */}
                        <CustomInput
                            name="rent"
                            label="ভাড়া"
                            placeholder="ভাড়া (৳)"
                            register={register}
                            type="number"
                            error={errors.rent}
                            rules={{
                                required: "ভাড়ার পরিমাণ লিখুন",
                            }}
                        />
                    </div>

                    <div className="flex items-center justify-between pt-5">
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                        >
                            ক্লিয়ার
                        </button>

                        <button
                            type="submit"
                            disabled={isUpdating || isFetching}
                            className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isUpdating
                                ? "আপডেট হচ্ছে..."
                                : "আপডেট করুন"}
                        </button>
                    </div>
                </form>
            )}
        </CustomModal>
    );
};

export default UpdateCarRentModal;