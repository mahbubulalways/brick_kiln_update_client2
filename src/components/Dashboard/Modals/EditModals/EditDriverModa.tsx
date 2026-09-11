"use client";

import { useEffect } from "react";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";

import { SubmitHandler, useForm } from "react-hook-form";

import {
  useGetSingleDriverQuery,
  useUpdateDriverMutation,
} from "@/redux/features/driver.features";

import { showToast } from "@/components/Toast/CustomToast";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

type TDriverForm = {
  name: string;
  PhoneNumber: string;
  salary: number;
};

const EditDriverModal = ({
  isOpen,
  onClose,
  id,
}: TCustomModal) => {
  const {
    data: driverData,
    isLoading: isGettingDriver,
    isError
  } = useGetSingleDriverQuery(id, {
    skip: !id || !isOpen,
  });

  const [updateDriver, { isLoading: isUpdating }] =
    useUpdateDriverMutation();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<TDriverForm>({
    defaultValues: {
      name: "",
      PhoneNumber: "",
      salary: 0,
    },
  });

  // Single Driver Data Form এ Set
  useEffect(() => {
    if (driverData?.data) {
      reset({
        name: driverData.data.name || "",
        PhoneNumber: driverData.data.PhoneNumber || "",
        salary: Number(driverData.data.salary) || 0,
      });
    }
  }, [driverData, reset]);

  // Update Driver
  const onSubmit: SubmitHandler<TDriverForm> = async (
    data
  ) => {
    try {
      const result = await updateDriver({
        id,
        payload: {
          name: data.name,
          PhoneNumber: data.PhoneNumber,
          salary: data.salary,
        },
      }).unwrap();

      showToast({
        title:
          result?.message ||
          "ড্রাইভারের তথ্য সফলভাবে আপডেট হয়েছে",
        type: "success",
      });

      reset();
      onClose();
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "ড্রাইভারের তথ্য আপডেট করতে সমস্যা হয়েছে",
        type: "error",
      });
    }
  };

  // Clear Form
  const handleClear = () => {
    if (driverData?.data) {
      reset({
        name: driverData.data.name || "",
        PhoneNumber: driverData.data.PhoneNumber || "",
        salary: Number(driverData.data.salary) || 0,
      });
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="ড্রাইভারের তথ্য পরিবর্তন"
    >
      {isGettingDriver ? (
      <CustomStatus type="loading"/>
      ) : isError? <CustomStatus type="loading"/>: (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
        >
          {/* Driver Name */}
          <div className="mb-5">
            <label className="mb-2 block text-[15px] font-semibold text-[#526078]">
              ড্রাইভারের নাম
            </label>

            <CustomInput
              name="name"
              placeholder="ড্রাইভারের নাম লিখুন"
              register={register}
              type="text"
            />
          </div>

          {/* Phone Number */}
          <div className="mb-5">
            <label className="mb-2 block text-[15px] font-semibold text-[#526078]">
              ফোন নম্বর
            </label>

            <CustomInput
              name="PhoneNumber"
              placeholder="ফোন নম্বর লিখুন"
              register={register}
              type="text"
            />
          </div>

          {/* Salary */}
          <div className="mb-6">
            <label className="mb-2 block text-[15px] font-semibold text-[#526078]">
              মাসিক বেতন (৳)
            </label>

            <input
              type="number"
              min="0"
              {...register("salary", {
                valueAsNumber: true,
              })}
              placeholder="বেতন লিখুন"
              className="
                h-12
                w-full
                rounded-[10px]
                border
                border-gray-300
                bg-white
                px-4
                text-[16px]
                font-medium
                text-[#111]
                outline-none
                focus:border-[#039A63]
              "
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleClear}
              disabled={isUpdating}
              className="
                w-full
                cursor-pointer
                rounded-lg
                border
                border-gray-300
                bg-white
                px-6
                py-2
                text-sm
                font-medium
                text-gray-600
                hover:bg-gray-50
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              ক্লিয়ার
            </button>

            <button
              disabled={isUpdating}
              type="submit"
              className="
                w-full
                cursor-pointer
                rounded-lg
                bg-[#039A63]
                px-6
                py-2
                text-sm
                font-medium
                text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
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

export default EditDriverModal;