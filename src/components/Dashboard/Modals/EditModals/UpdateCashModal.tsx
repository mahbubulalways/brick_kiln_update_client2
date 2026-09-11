"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { showToast } from "@/components/Toast/CustomToast";
import {
    useGetSingleCashQuery,
    useUpdateCashMutation,
} from "@/redux/features/cash.features";
import { SubmitHandler, useForm } from "react-hook-form";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TUpdateCashModal = {
    isOpen: boolean;
    onClose: () => void;
    id: number | undefined;
    setId: Dispatch<SetStateAction<number | undefined>>
};

type TCashForm = {
    type: "INCOME" | "EXPENSE";
    source: string;
    description: string;
    amount: number;
};

const UpdateCashModal = ({
    isOpen,
    onClose,
    id,
    setId
}: TUpdateCashModal) => {
    const [cashType, setCashType] =
        useState<"INCOME" | "EXPENSE">("INCOME");

    const isIncome = cashType === "INCOME";

    // =========================
    // GET SINGLE CASH
    // =========================
    const {
        data: singleCashResponse,
        isLoading: isSingleLoading,
        isError
    } = useGetSingleCashQuery(id, {
        skip: !id || !isOpen,
    });

    const singleCash = singleCashResponse?.data;

    // =========================
    // UPDATE CASH
    // =========================
    const [updateCash, { isLoading: isUpdating }] =
        useUpdateCashMutation();

    // =========================
    // FORM
    // =========================
    const {
        register,
        handleSubmit,
        reset,
    } = useForm<TCashForm>({
        defaultValues: {
            type: "INCOME",
            source: "",
            description: "",
            amount: 0,
        },
    });

    const isLoading =
        isSingleLoading || isUpdating;

    // =========================
    // SET SINGLE DATA
    // =========================
    useEffect(() => {
        if (!isOpen || !singleCash) return;

        const type =
            singleCash.type === "EXPENSE"
                ? "EXPENSE"
                : "INCOME";

        setCashType(type);

        reset({
            type,
            source: singleCash.source || "",
            description: singleCash.description || "",
            amount: Number(singleCash.amount) || 0,
        });
    }, [singleCash, isOpen, reset]);

    // =========================
    // SUBMIT UPDATE
    // =========================
    const onSubmit: SubmitHandler<TCashForm> = async (
        data
    ) => {
        const payload = {
            ...data,
            type: cashType,
            amount: Number(data.amount),
        };

        const info = {
            id,
            data: payload
        }
        try {
            const result = await updateCash(info).unwrap();
            showToast({
                title:
                    result?.message ||
                    "ক্যাশ সফলভাবে আপডেট হয়েছে",
                type: "success",
            });
            handleClose()
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    "ক্যাশ আপডেট করতে সমস্যা হয়েছে",
                type: "error",
            });
        }
    };

    // =========================
    // TYPE CHANGE
    // =========================
    const handleTypeChange = (
        type: "INCOME" | "EXPENSE"
    ) => {
        setCashType(type);

        reset({
            type,
            source: "",
            description: "",
            amount: 0,
        });
    };

    // =========================
    // CLEAR
    // =========================
    const handleClear = () => {
        if (!singleCash) return;

        reset({
            type: cashType,
            source: singleCash.source || "",
            description: singleCash.description || "",
            amount: Number(singleCash.amount) || 0,
        });
    };

    // =========================
    // CLOSE
    // =========================
    const handleClose = () => {
        reset();
        setId(undefined)
        setCashType("INCOME");
        onClose();
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="ক্যাশের হিসাব আপডেট"
        >{
            isLoading ?
            <CustomStatus type="loading"/>:
            isError ?   <CustomStatus type="error"/>
            :
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full relative"
            >
                {/* ================= TYPE ================= */}
                <div className="w-full rounded-[15px] bg-[#EEF2F6] p-2 flex items-center gap-1 mb-5">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                            handleTypeChange("INCOME")
                        }
                        className={`
              flex-1
              h-[36px]
              rounded-[10px]
              text-[14px]
              font-semibold
              transition-all
              duration-300
              ${isIncome
                                ? "bg-[#039A63] text-white shadow-sm"
                                : "text-[#687994] hover:text-[#039A63]"
                            }
            `}
                    >
                        ক্যাশ ইন (Income)
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={() =>
                            handleTypeChange("EXPENSE")
                        }
                        className={`
              flex-1
              h-[36px]
              rounded-[10px]
              text-[14px]
              font-semibold
              transition-all
              duration-300
              ${!isIncome
                                ? "bg-[#FF480D] text-white shadow-sm"
                                : "text-[#687994] hover:text-[#FF480D]"
                            }
            `}
                    >
                        ক্যাশ আউট (Expense)
                    </button>
                </div>

                <input
                    type="hidden"
                    value={cashType}
                    {...register("type")}
                />

                {/* ================= SOURCE ================= */}
                <div className="mb-5">
                    <label className="block text-[15px] font-semibold text-[#526078] mb-2">
                        {isIncome
                            ? "উৎস (কোথা থেকে টাকা আসলো?)"
                            : "খাত (কোথায় খরচ হলো?)"}
                    </label>

                    <CustomInput
                        name="source"
                        placeholder={
                            isIncome
                                ? "টাকা কে দিয়েছে"
                                : "কাকে টাকা দেওয়া হলো"
                        }
                        register={register}
                        type="text"
                    />
                </div>

                {/* ================= DESCRIPTION ================= */}
                <div className="mb-6">
                    <label className="block text-[15px] font-semibold text-[#526078] mb-2">
                        হিসাবের বিবরণ
                    </label>

                    <CustomTextArea
                        name="description"
                        placeholder="বিবরণ লিখুন (যেমন: মজুরি দেওয়া-নেওয়া)"
                        register={register}
                        rows={3}
                    />
                </div>

                {/* ================= AMOUNT ================= */}
                <div
                    className={`
            rounded-[15px]
            p-3
            mb-4
            ${isIncome
                            ? "bg-[#D0F7E5]"
                            : "bg-[#FFE1E1]"
                        }
          `}
                >
                    <label
                        className={`
              block
              text-[15px]
              font-bold
              mb-3
              ${isIncome
                                ? "text-[#039A63]"
                                : "text-[#FF3D68]"
                            }
            `}
                    >
                        পরিমাণ (৳)
                    </label>

                    <input
                        type="number"
                        min="0"
                        disabled={isLoading}
                        {...register("amount", {
                            valueAsNumber: true,
                        })}
                        className={`
              w-full
              h-[60px]
              rounded-[12px]
              bg-white
              px-4
              text-[20px]
              font-semibold
              text-[#111]
              outline-none
              border
              ${isIncome
                                ? "border-[#9DE7C8] focus:border-[#039A63]"
                                : "border-[#FFC2C2] focus:border-[#FF480D]"
                            }
            `}
                    />
                </div>

                {/* ================= BUTTONS ================= */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={handleClear}
                        className="
              px-6
              py-2
              cursor-pointer
              rounded-lg
              w-full
              border
              border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-600
              hover:bg-gray-50
              disabled:opacity-50
            "
                    >
                        রিসেট
                    </button>

                    <button
                        disabled={isUpdating}
                        type="submit"
                        className={`
              px-6
              py-2
              cursor-pointer
              rounded-lg
              w-full
              text-sm
              font-medium
              text-white
              disabled:opacity-50
              ${isIncome
                                ? "bg-[#039A63]"
                                : "bg-[#FF480D]"
                            }
            `}
                    >
                        {isUpdating
                            ? "আপডেট হচ্ছে..."
                            : "আপডেট করুন"}
                    </button>
                </div>
                {isSingleLoading && (
                    <div className="absolute inset-0 w-full  bg-gray-100/60 blur-md"></div>
                )}
            </form>
        }

        </CustomModal>
    );
};

export default UpdateCashModal;