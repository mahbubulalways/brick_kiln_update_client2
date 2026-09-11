"use client";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateCarRentMutation } from "@/redux/features/carRent.features";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import { SERVER_ERROR_MESSAGE } from "@/constant";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TCarRent = {
    address: string;
    area: string;
    rent: number;
};

const CreateCarRentModal = ({
    isOpen,
    onClose,
}: TCustomModal) => {
    const [mutateAsync, { isLoading, error }] =
        useCreateCarRentMutation();

    const {
        register,
        handleSubmit,
        reset, formState: { errors }
    } = useForm<TCarRent>({
        defaultValues: {
            address: "",
            area: "",
            rent: 0,
        },
    });
    const onSubmit: SubmitHandler<TCarRent> = async (data) => {


        try {
            data.rent = Number(data.rent)
            const result =
                await mutateAsync(data).unwrap();

            if (result?.success) {
                reset();
                onClose();

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
                    error?.data?.message || SERVER_ERROR_MESSAGE,
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
            title="গাড়ি ভাড়া অ্যাড করুন"
            width="sm"
        >
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
                        placeholder="এরিয়া "
                        register={register}
                        type="text"
                        error={errors.area}
                        rules={{
                            required: "পরিমাণ এরিয়া",
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
                        disabled={isLoading}
                        className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading
                            ? "অ্যাড হচ্ছে..."
                            : "অ্যাড করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default CreateCarRentModal;