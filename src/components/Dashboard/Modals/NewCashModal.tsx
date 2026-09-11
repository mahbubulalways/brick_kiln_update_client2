"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { useCreateCashMutation } from "@/redux/features/cash.features";
import { showToast } from "@/components/Toast/CustomToast";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TCashForm = {
  type: "INCOME" | "EXPENSE";
  source: string;
  description: string;
  amount: number;
};

const NewCashModal = ({ isOpen, onClose }: TCustomModal) => {
  const [cashType, setCashType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [mutateAsync, { isLoading }] = useCreateCashMutation()
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

  const isIncome = cashType === "INCOME";

  const onSubmit: SubmitHandler<TCashForm> = async (data) => {
    const payload = {
      ...data,
      type: cashType,
    };

    try {
      const result = await mutateAsync(payload).unwrap();
      showToast({
        title: result?.message || "ক্যাশ সফলভাবে তৈরি হয়েছে",
        type: "success",
      });

      reset();
      onClose();
    } catch (error: any) {
      showToast({
        title: error?.data?.message || "ক্যাশ তৈরি করতে সমস্যা হয়েছে",
        type: "error",
      });
    }
  };

  const handleTypeChange = (type: "INCOME" | "EXPENSE") => {
    setCashType(type);

    reset({
      type,
      source: "",
      description: "",
      amount: 0,
    });
  };

  const handleClear = () => {
    reset({
      type: cashType,
      source: "",
      description: "",
      amount: 0,
    });
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="ক্যাশের হিসাব"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="w-full rounded-[15px] bg-[#EEF2F6] p-2 flex items-center gap-1 mb-5">
          <button
            type="button"
            onClick={() => handleTypeChange("INCOME")}
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
            onClick={() => handleTypeChange("EXPENSE")}
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClear}
            className="px-6 py-2 cursor-pointer rounded-lg w-full border border-gray-300 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            ক্লিয়ার
          </button>

          <button
            disabled={isLoading}
            type="submit"
            className={`disabled:bg-gray-500 disabled:cursor-pointer px-6 py-2 cursor-pointer rounded-lg w-full text-sm font-medium text-white ${isIncome ? "bg-[#039A63]" : "bg-[#FF480D]"
              }`}
          >
            সেভ করুন
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default NewCashModal;