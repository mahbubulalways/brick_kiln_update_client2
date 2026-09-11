"use client";

import { useState } from "react";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateSubscriptionPaymentMutation } from "@/redux/features/subscription_payment";
import { useForm } from "react-hook-form";
import SoftwarePaymentHistory from "./SoftwarePaymentHistory";

type TPaymentForm = {
  paymentMethod: string;
  phoneNumber: string;
  transactionId: string;
  amount: string;
};

const SoftwarePaymentPage = () => {
  const [showHistory, setShowHistory] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TPaymentForm>({
    defaultValues: {
      paymentMethod: "",
      phoneNumber: "",
      transactionId: "",
      amount: "",
    },
  });

  const [createPayment, { isLoading }] =
    useCreateSubscriptionPaymentMutation();

  const onSubmit = async (data: TPaymentForm) => {
    try {
      const result = await createPayment({
        paymentMethod: data.paymentMethod,
        phoneNumber: data.phoneNumber,
        transactionId: data.transactionId,
        amount: Number(data.amount),
      }).unwrap();

      if (result?.success) {
        showToast({
          title:
            result?.message ||
            "সাবস্ক্রিপশন পেমেন্ট সফলভাবে জমা হয়েছে।",
          type: "success",
        });

        reset();
      }
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "পেমেন্ট জমা দিতে সমস্যা হয়েছে।",
        type: "error",
      });
    }
  };

  const providerOptions = [
    {
      label: "বিকাশ",
      value: "bkash",
    },
    {
      label: "নগদ",
      value: "nagad",
    },
    {
      label: "রকেট",
      value: "rocket",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-white pb-8">
      {/* ================= HEADER ================= */}
      <div className="mx-1 rounded-b-md bg-red-50 py-3 shadow-[0_10px_20px_rgba(255,0,0,0.08)]">
        <h1 className="text-center text-[28px] font-normal leading-[42px] text-orange-600">
          সফটওয়্যারের ফি জমা দিন
        </h1>
      </div>

      {/* ================= PAYMENT METHOD ================= */}
      <div className="mx-auto mt-[22px] w-[493px] max-w-[calc(100%-30px)]">
        <p className="mb-[8px] text-center text-[15px] font-normal text-gray-500">
          পেমেন্টের মাধ্যম সিলেক্ট করুন
        </p>

        <CustomSelect
          name="paymentMethod"
          placeholder="পেমেন্টের মাধ্যম নির্বাচন করুন"
          options={providerOptions}
          control={control}
          rules={{
            required: "পেমেন্টের মাধ্যম নির্বাচন করুন",
          }}
        />

        {errors.paymentMethod && (
          <p className="mt-1 text-sm text-red-500">
            {errors.paymentMethod.message}
          </p>
        )}
      </div>

      {/* ================= FORM CARD ================= */}
      <div className="mx-auto mt-[34px] w-[575px] max-w-[calc(100%-30px)] rounded-[9px] border border-gray-200 bg-white px-[30px] py-[27px] shadow-[0_3px_8px_rgba(0,0,0,0.16)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-[14px]">
            {/* PHONE NUMBER */}
            <CustomInput
              name="phoneNumber"
              label="যে অ্যাকাউন্ট/নম্বর থেকে টাকা পাঠিয়েছেন"
              placeholder="017xxxxxxxx"
              register={register}
              type="text"
              error={errors.phoneNumber}
              rules={{
                required:
                  "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি প্রদান করুন",
              }}
            />

            {/* TRANSACTION ID */}
            <CustomInput
              name="transactionId"
              label="Transaction ID (TrxID)"
              placeholder="TXN123456"
              register={register}
              type="text"
              error={errors.transactionId}
              rules={{
                required: "Transaction ID প্রদান করুন",
              }}
            />

            {/* AMOUNT */}
            <CustomInput
              name="amount"
              label="টাকার পরিমাণ"
              placeholder="টাকার পরিমাণ লিখুন"
              register={register}
              type="number"
              error={errors.amount}
              rules={{
                required: "টাকার পরিমাণ প্রদান করুন",
                min: {
                  value: 1,
                  message: "টাকার পরিমাণ ১ টাকার কম হতে পারবে না",
                },
              }}
            />
          </div>

          {/* BUTTONS */}
          <div className="mt-[15px] grid grid-cols-2 gap-[10px]">
            <button
              type="button"
              onClick={() => reset()}
              disabled={isLoading}
              className="cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 text-[18px] font-medium text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              ক্লিয়ার
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="cursor-pointer rounded-md bg-[#039A63] py-1.5 text-[18px] font-medium text-white transition-colors hover:bg-[#028957] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "জমা হচ্ছে..." : "সাবমিট"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= HISTORY BUTTON ================= */}
      <div className="mt-[24px] flex justify-center">
        <button
          type="button"
          onClick={() => setShowHistory((prev) => !prev)}
          className="rounded-[8px] border border-gray-300 bg-white px-[18px] py-[7px] text-[15px] font-normal text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          {showHistory
            ? "পেমেন্ট হিস্টোরি বন্ধ করুন"
            : "ফি (পেমেন্ট রিসিট দেখুন)"}
        </button>
      </div>

      {/* ================= PAYMENT HISTORY ================= */}
      {showHistory && (
        <div className="mt-6">
          <SoftwarePaymentHistory />
        </div>
      )}
    </div>
  );
};

export default SoftwarePaymentPage;