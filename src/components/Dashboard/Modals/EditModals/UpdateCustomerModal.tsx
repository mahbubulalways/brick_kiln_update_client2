"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import {
    useGetSingleCutomerInfoQuery,
    useUpdateCustomerMutation,
} from "@/redux/features/customer.features";
import { Dispatch, SetStateAction, useEffect } from "react";
import {
    SubmitHandler,
    useForm,
} from "react-hook-form";

type TCustomer = {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
};

type TUpdateCustomer = {
    isOpen: boolean;
    onClose: () => void;
    id: string;
    setId: Dispatch<SetStateAction<undefined | string>>
}

const UpdateCustomerModal = ({ id, isOpen, onClose, setId }: TUpdateCustomer) => {
    // =========================
    // GET CUSTOMER
    // =========================
    const {
        data,
        isLoading,
        isError, error
    } = useGetSingleCutomerInfoQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    // =========================
    // UPDATE CUSTOMER
    // =========================
    const [updateCustomer, { isLoading: isUpdating }] =
        useUpdateCustomerMutation();

    // =========================
    // FORM
    // =========================
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TCustomer>({
        defaultValues: {
            id: "",
            name: "",
            address: "",
            phoneNumber: "",
        },
    });

    // =========================
    // SET CUSTOMER DATA
    // =========================
    useEffect(() => {
        if (!data?.data) return;

        const customer = data.data;

        reset({
            id: customer.customerCode ?? id,
            name: customer.name ?? "",
            address: customer.address ?? "",
            phoneNumber: customer.phoneNumber ?? "",
        });
    }, [data, id, reset]);

    // =========================
    // SUBMIT
    // =========================
    const handleFormSubmit: SubmitHandler<TCustomer> = async (
        formData
    ) => {
        try {
            const payload = {
                name: formData.name,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
            };
            const response = await updateCustomer({
                id,
                data: payload,
            }).unwrap();

            if (response?.success) {
                handleClose()
                showToast({ title: response?.message, type: "success", })
            }
        } catch (error: any) {
            showToast({ title: error?.data?.message || SERVER_ERROR_MESSAGE, type: "error", })
        }
    };

    // =========================
    // CLEAR
    // =========================
    const handleClear = () => {
        if (!data?.data) {
            reset({
                id,
                name: "",
                address: "",
                phoneNumber: "",
            });

            return;
        }

        reset({
            id: data.data.id ?? id,
            name: data.data.name ?? "",
            address: data.data.address ?? "",
            phoneNumber: data.data.phoneNumber ?? "",
        });
    };

    const handleClose = () => {
        onClose()
        setId(undefined)
    }

    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title="আপডেট কাস্টমার">
            {
                isLoading ? <CustomStatus type="loading" /> : isError ? <CustomStatus type="error" /> :
                    <form onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            {/* ================= NAME ================= */}
                            <CustomInput
                                name="id"
                                label="আইডি"
                                placeholder="কাস্টমারের আইডি"
                                register={register}
                                type="text"
                                readonly
                            />
                            <CustomInput
                                name="name"
                                label="কাস্টমারের নাম"
                                placeholder="কাস্টমারের নাম লিখুন"
                                register={register}
                                type="text"
                                error={errors.name}
                                rules={{
                                    required: "কাস্টমারের নাম লিখুন",
                                }}
                            />

                            {/* ================= MOBILE ================= */}
                            <CustomInput
                                name="phoneNumber"
                                label="মোবাইল নম্বর"
                                placeholder="মোবাইল নম্বর লিখুন"
                                register={register}
                                type="text"
                                error={errors.phoneNumber}
                                rules={{
                                    required: "মোবাইল নম্বর লিখুন",
                                }}
                            />


                            <CustomInput
                                name="address"
                                label="ঠিকানা"
                                placeholder="কাস্টমারের ঠিকানা লিখুন"
                                register={register}
                                type="text"
                                error={errors.address}
                                rules={{
                                    required: "ঠিকানা লিখুন",
                                }}
                            />

                        </div>

                        {/* ================= BUTTONS ================= */}
                        <div className="flex items-center justify-between pt-5">

                            <button
                                type="button"
                                onClick={handleClear}
                                disabled={isUpdating}
                                className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                ক্লিয়ার
                            </button>

                            <button
                                type="submit"
                                disabled={isUpdating}
                                className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 duration-300 hover:bg-[#028653] disabled:cursor-not-allowed disabled:bg-gray-500"
                            >
                                {isUpdating
                                    ? "আপডেট হচ্ছে..."
                                    : "আপডেট করুন"}
                            </button>
                        </div>
                    </form>
            }

        </CustomModal>
    );
};

export default UpdateCustomerModal;