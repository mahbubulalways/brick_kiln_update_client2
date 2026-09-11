"use client";

import React from "react";
import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { useGetAllClassAndRateOptionsQuery } from "@/redux/features/classAndRate.features";
import { TClassAndRate } from "@/types/types";
import { useGetAllRoundQuery } from "@/redux/features/round.features";
import {
  useCreateUnloadInfoMutation,
  useGetAllUnloadInfoQuery,
  useGetAllUnloadReportQuery,
} from "@/redux/features/unload.features";
import { TUnloadItem, TUnloadResponse } from "@/interface/unload";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { fi } from "date-fns/locale";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

export interface TLoadInfo {
  date: Date;
  round: string;
  quantity: number;
  className: string;
}

const NewUnloadModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const {
    data: roundData,
    isError: roundError,
    isLoading: roundLoading,
  } = useGetAllRoundQuery(undefined);

  const formatRoundLabelValue =
    roundData?.data?.map(
      (dt: { name: string }) => ({
        label: dt.name,
        value: dt.name,
      })
    ) || [];

  const {
    isLoading: classLoading,
    data: classData,
    isError: classError,
  } = useGetAllClassAndRateOptionsQuery(undefined);

  const formatClassLabelValue =
    classData?.data?.map(
      (dt: TClassAndRate) => ({
        label: dt.className,
        value: dt.className,
      })
    ) || [];

  const {
    data: unloadData,
    isLoading: unloadLoading,
  } = useGetAllUnloadReportQuery(
    undefined,
    {
      skip: !isOpen,
    }
  );

  const unloads =
    unloadData?.data as TUnloadResponse[] ?? [];

  const [
    mutateAsync,
    { isLoading },
  ] = useCreateUnloadInfoMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<TLoadInfo>({
    defaultValues: {
      date: new Date(),
      round: "",
      className: "",
      quantity: 0,
    },
  });

  const selectedRound = watch("round");
  const selectedClass = watch("className");
  const selectedDate = watch("date");

  const existingQuantity = React.useMemo(() => {
    if (!selectedDate || !selectedRound || !selectedClass) {
      return 0;
    }

    const getDateOnly = (date: Date | string) => {
      const d = new Date(date);

      return `${d.getFullYear()}-${String(
        d.getMonth() + 1
      ).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };

    const selectedDateKey = getDateOnly(selectedDate);

    return unloads.reduce(
      (total: number, unload: TUnloadResponse) => {
        if (!unload.date || !unload.round) {
          return total;
        }

        const unloadDateKey = getDateOnly(unload.date);

        if (
          unloadDateKey !== selectedDateKey ||
          unload.round.name !== selectedRound
        ) {
          return total;
        }

        const classQuantity =
          unload.items?.reduce(
            (sum: number, item: TUnloadItem) => {
              if (
                item.class?.className ===
                selectedClass
              ) {
                return (
                  sum +
                  Number(item.quantity ?? 0)
                );
              }

              return sum;
            },
            0
          ) ?? 0;

        return total + classQuantity;
      },
      0
    );
  }, [
    unloads,
    selectedDate,
    selectedRound,
    selectedClass,
  ]);

  React.useEffect(() => {
    setValue(
      "quantity",
      existingQuantity
    );
  }, [
    existingQuantity,
    setValue,
  ]);

  const onSubmit: SubmitHandler<TLoadInfo> =
    async (data) => {
      try {
        const result =
          await mutateAsync(
            data
          ).unwrap();

        showToast({
          title: result?.message,
          type: "success",
        });

        onClose();

        reset({
          date: new Date(),
          round: "",
          className: "",
          quantity: 0,
        });
      } catch (error: any) {
        showToast({
          title:
            error?.data?.message ||
            SERVER_ERROR_MESSAGE,
          type: "error",
        });
      }
    };

  const handleClear = () => {
    reset({
      date: new Date(),
      round: "",
      className: "",
      quantity: 0,
    });
  };

  const isInitialLoading =
    classLoading || roundLoading;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন আনলোড"
    >
      {isInitialLoading ? (
        <CustomStatus type="loading" />
      ) : (
        <form
          onSubmit={handleSubmit(
            onSubmit
          )}
        >
          <div className="grid grid-cols-2 gap-2">
            <CustomSelect
              name="round"
              label="রাউন্ড"
              placeholder="রাউন্ড"
              control={control}
              options={
                formatRoundLabelValue
              }
              isError={
                roundError
              }
              isLoading={
                roundLoading
              }
              error={
                errors.round
              }
              rules={{
                required:
                  "রাউন্ড নির্বাচন করুন",
              }}
            />

            <CustomDatePicker
              control={control}
              name="date"
              label="আনলোডের তারিখ"
              error={
                errors.date
              }
              rules={{
                required:
                  "আনলোডের তারিখ নির্বাচন করুন",
              }}
            />

            <CustomSelect
              name="className"
              label="শ্রেণি"
              placeholder="শ্রেণি"
              control={control}
              options={
                formatClassLabelValue
              }
              error={
                errors.className
              }
              isError={
                classError
              }
              isLoading={
                classLoading
              }
              rules={{
                required:
                  "শ্রেণি নির্বাচন করুন",
              }}
            />

            <CustomInput
              name="quantity"
              label="পরিমাণ"
              placeholder="পরিমাণ"
              register={register}
              type="number"
              error={
                errors.quantity
              }
              rules={{
                required:
                  "পরিমাণ লিখুন",
                min: {
                  value: 1,
                  message:
                    "পরিমাণ ১ এর কম হতে পারবে না",
                },
              }}
            />
          </div>

          {selectedRound &&
            selectedClass &&
            selectedDate &&
            existingQuantity > 0 && (
              <div className="mt-2 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                এই রাউন্ড, তারিখ ও
                শ্রেণির পূর্বের
                আনলোড পরিমাণ:{" "}
                <span className="font-semibold">
                  {existingQuantity}
                </span>
              </div>
            )}

          <div className="flex items-center justify-between pt-5">
            <button
              type="button"
              onClick={
                handleClear
              }
              className="rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
            >
              ক্লিয়ার
            </button>

            <button
              type="submit"
              disabled={
                isLoading ||
                unloadLoading
              }
              className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:opacity-50"
            >
              {isLoading
                ? "অ্যাড হচ্ছে..."
                : "অ্যাড করুন"}
            </button>
          </div>
        </form>
      )}
    </CustomModal>
  );
};

export default NewUnloadModal;