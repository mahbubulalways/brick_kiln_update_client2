"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import { useChangePasswordMutation } from "@/redux/features/auth.features";
import { SubmitHandler, useForm } from "react-hook-form";

type TPasswordChange = {
  oldPassword: string;
  newPassword: string;
};

const PasswordChange = () => {
  const [changePassword, { isLoading }] =
    useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<TPasswordChange>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onSubmit: SubmitHandler<TPasswordChange> = async (data) => {
    try {
      const result = await changePassword(data).unwrap();
      if (result?.success) {
        showToast({
          title: "আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।",
          type: "success",
        });

        reset();
      }
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "পাসওয়ার্ড পরিবর্তন করা সম্ভব হয়নি। অনুগ্রহ করে আবার চেষ্টা করুন।",
        type: "error",
      });
    }
  };

  return (
    <div className="w-sm mx-auto flex items-center justify-center flex-col h-[80vh]">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <h1 className="text-xl font-semibold text-gray-900 py-3">
          পাসওয়ার্ড পরিবর্তন
        </h1>
        <div className="flex flex-col gap-3">
          <CustomInput
            name="oldPassword"
            label="পুরাতন পাসওয়ার্ড"
            placeholder="পুরাতন পাসওয়ার্ড লিখুন"
            register={register}
            type="password"
          />

          <CustomInput
            name="newPassword"
            label="নতুন পাসওয়ার্ড"
            placeholder="নতুন পাসওয়ার্ড লিখুন"
            register={register}
            type="password"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer mt-3 w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? "পরিবর্তন হচ্ছে..." : "কনফার্ম"}
        </button>

        <p className="text-[11px] text-center mt-4 text-orange-400">
          নোটঃ পাসওয়ার্ড পরিবর্তন হলে অটোমেটিক লগআউট হয়ে যাবে
        </p>
      </form>
    </div>
  );
};

export default PasswordChange;