"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomStatus from "@/components/Reusable/CustomStatus";

import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";

import {
  useGetLedgerOptionQuery,
  useGetSingleLedgerQuery,
  useUpdateLedgerMutation,
} from "@/redux/features/ledger.features";

import formatLabelValuePair from "@/utils/formatLabelValuePair";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";

type TUpdateKhotiyanModal = {
  isOpen: boolean;
  onClose: () => void;
  ledgerId: number | null;
};

type TUpdateKhotiyan = {
  serial: string;
  name: string;
  parentId: number;
  rate: number;
  quantity: number;
  phoneNumber: string,
  startDate: string
};

const UpdateKhotiyanModal = ({
  isOpen,
  onClose,
  ledgerId,
}: TUpdateKhotiyanModal) => {
  const {
    data: singleData,
    isLoading: singleLoading,
    isError: singleError,
  } = useGetSingleLedgerQuery(ledgerId!, {
    skip: !ledgerId || !isOpen,
  });

  const {
    data: optionData,
    isLoading: optionLoading,
    isError: optionError,
  } = useGetLedgerOptionQuery(undefined);

  const [updateLedger, { isLoading: updateLoading }] =
    useUpdateLedgerMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TUpdateKhotiyan>({

  });

  // =========================
  // GROUP OPTIONS
  // =========================

  const labelValuePairArray = formatLabelValuePair({
    data: optionData?.data,
    label: "name",
    value: "id",
  });

  // =========================
  // SET DEFAULT VALUE
  // =========================

  useEffect(() => {
    if (singleData?.data) {
      const ledger = singleData.data;
      console.log(ledger)
      reset({
        serial: String(ledger.serial ?? ""),
        name: ledger.name ?? "",
        parentId: ledger.parentId || null,
        rate: Number(ledger.rate ?? 0),
        quantity: Number(ledger.quantity ?? 0),
        startDate: ledger.startDate,
        phoneNumber: ledger.phoneNumber,
      });
    }
  }, [singleData, reset]);

  // =========================
  // SUBMIT UPDATE
  // =========================

  const onSubmit: SubmitHandler<TUpdateKhotiyan> = async (formData) => {
    if (!ledgerId) return;

    const payload = {
      ...formData,
      parentId: formData.parentId || null,
      rate: Number(formData.rate || 0),
      quantity: Number(formData.quantity || 0),
    };

    try {
      const result = await updateLedger({
        id: ledgerId,
        data: payload,
      }).unwrap();

      if (result?.success) {
        showToast({
          title: result.message || "খতিয়ান সফলভাবে আপডেট করা হয়েছে।",
          type: "success",
        });

        handleClose();
      } else {
        showToast({
          title: result?.message || SERVER_ERROR_MESSAGE,
          type: "error",
        });
      }
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message || SERVER_ERROR_MESSAGE,
        type: "error",
      });
    }
  };

  // =========================
  // CLOSE
  // =========================

  const handleClose = () => {
    reset({
      serial: "",
      name: "",
      parentId: 0,
      rate: 0,
      quantity: 0,
    });

    onClose();
  };

  const isLoading = singleLoading || optionLoading;
  const isError = singleError || optionError;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="খতিয়ান আপডেট করুন"
      width="xl"
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
          <div className="grid grid-cols-2 gap-4">

            {/* Serial */}
            <CustomInput
              name="serial"
              label="সিরিয়াল"
              placeholder="সিরিয়াল"
              register={register}
              readonly
              type="text"
              error={errors.serial}
            />

            {/* Name */}
            <CustomInput
              name="name"
              label="খতিয়ানের নাম"
              placeholder="খতিয়ানের নাম"
              register={register}
              type="text"
              error={errors.name}
              rules={{
                required: "এই ফিল্ডটি আবশ্যক",
              }}
            />

            <CustomInput
              name="phoneNumber"
              label="ফোন নম্বর"
              placeholder="ফোন নম্বর"
              register={register}
              type="number"
            />
            <CustomDatePicker
              control={control}
              name="startDate"
              label="শুরুর তারিখ"
              disablePastDates
              placeholder="শুরুর তারিখ"
            />

            {/* Group */}
            <CustomSelect
              name="parentId"
              label="খতিয়ানের গ্রুপ"
              placeholder="খতিয়ানের গ্রুপ"
              control={control}
              options={labelValuePairArray}
            />

            {/* Rate & Quantity */}
            <div className="grid grid-cols-2 gap-2">
              <CustomInput
                name="rate"
                label="খতিয়ানের রেট"
                placeholder="খতিয়ানের রেট"
                register={register}
                type="number"
              />

              <CustomInput
                name="quantity"
                label="পরিমাণ ভাজক"
                placeholder="পরিমাণ ভাজক"
                register={register}
                type="number"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={updateLoading}
              className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer disabled:bg-gray-500"
            >
              {updateLoading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </div>
        </form>
      )}
    </CustomModal>
  );
};

export default UpdateKhotiyanModal;