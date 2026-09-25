"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";

import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";

import {
  useGetLedgerOptionQuery,
  useGetSingleLedgerQuery,
  useUpdateLedgerMutation,
} from "@/redux/features/ledger.features";

import formatLabelValuePair from "@/utils/formatLabelValuePair";

type TUpdateKhotiyanModal = {
  isOpen: boolean;
  onClose: () => void;
  ledgerId: number | null;
};

type TUpdateKhotiyan = {
  serial: string;
  name: string;
  parentId: string | null;
  rate: number;
  quantity: number;
  phoneNumber: string;
  startDate: string;
  salary: number;
  weeklyFood: number;
  openingBalance: number;
  openingBalanceType: string | null;
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
    refetchOnMountOrArgChange: true
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
  } = useForm<TUpdateKhotiyan>();

  const labelValuePairArray = formatLabelValuePair({
    data: optionData?.data,
    label: "name",
    value: "id",
  });

  useEffect(() => {
    if (singleData?.data) {
      const ledger = singleData.data;

      reset({
        serial: String(ledger.serial ?? ""),
        name: ledger.name ?? "",
        parentId: ledger.parentId ?? null,
        rate: Number(ledger.rate ?? 0),
        quantity: Number(ledger.quantity ?? 0),
        phoneNumber: ledger.phoneNumber ?? "",
        startDate: ledger.startDate ?? "",
        salary: Number(ledger.salary ?? 0),
        weeklyFood: Number(ledger.weeklyFood ?? 0),
        openingBalance: Number(ledger.openingBalance ?? 0),
        openingBalanceType: ledger.openingBalanceType ?? null,
      });
    }
  }, [singleData, reset]);

  const onSubmit: SubmitHandler<TUpdateKhotiyan> = async (formData) => {
    if (!ledgerId) return;

    const payload = {
      ...formData,
      parentId: formData.parentId || null,
      rate: Number(formData.rate || 0),
      quantity: Number(formData.quantity || 0),
      salary: Number(formData.salary || 0),
      weeklyFood: Number(formData.weeklyFood || 0),
      openingBalance: Number(formData.openingBalance || 0),
      openingBalanceType: formData.openingBalanceType || null,
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
        title: error?.data?.message || SERVER_ERROR_MESSAGE,
        type: "error",
      });
    }
  };

  const handleClose = () => {
    reset({
      serial: "",
      name: "",
      parentId: null,
      rate: 0,
      quantity: 0,
      phoneNumber: "",
      startDate: "",
      salary: 0,
      weeklyFood: 0,
      openingBalance: 0,
      openingBalanceType: null,
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
        <CustomStatus type="loading" fullScreen={false} />
      ) : isError ? (
        <CustomStatus type="error" fullScreen={false} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CustomInput
              name="serial"
              label="সিরিয়াল"
              placeholder="সিরিয়াল"
              register={register}
              readonly
              type="text"
              error={errors.serial}
            />

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

            <CustomSelect
              name="parentId"
              label="খতিয়ানের গ্রুপ"
              placeholder="খতিয়ানের গ্রুপ"
              control={control}
              options={labelValuePairArray}
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

            <CustomInput
              name="rate"
              label="খতিয়ানের রেট"
              placeholder="খতিয়ানের রেট"
              register={register}
              type="number"
            />

            <CustomInput
              name="quantity"
              label="পরিমাণ"
              placeholder="পরিমাণ ভাজক"
              register={register}
              type="number"
            />

            <CustomInput
              name="salary"
              label="বেতন"
              placeholder="বেতনের পরিমাণ"
              register={register}
              type="number"
            />

            <CustomInput
              name="weeklyFood"
              label="সাপ্তাহিক খোরাকি"
              placeholder="সাপ্তাহিক খোরাকির পরিমাণ"
              register={register}
              type="number"
            />

            <CustomInput
              name="openingBalance"
              label="ওপেনিং ব্যালেন্স"
              placeholder="ওপেনিং ব্যালেন্স লিখুন"
              register={register}
              type="number"
            />

            <CustomSelect
              name="openingBalanceType"
              label="ওপেনিং ব্যালেন্সের ধরন"
              placeholder="ওপেনিং ব্যালেন্সের ধরন নির্বাচন করুন"
              control={control}
              options={[
                {
                  label: "পাওনা",
                  value: "পাওনা",
                },
                {
                  label: "দেনা",
                  value: "দেনা",
                },
              ]}
            />
          </div>

          <div className="flex w-full items-center justify-between gap-2 pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="w-full cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:bg-gray-500"
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