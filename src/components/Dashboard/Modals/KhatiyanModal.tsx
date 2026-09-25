"use client";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import {
  useCreateLedgerMutation,
  useGetLedgerCountQuery,
  useGetLedgerOptionQuery,
} from "@/redux/features/ledger.features";
import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TKhatiyan = {
  serial: string;
  name: string;
  phoneNumber: string;
  parentId: number;
  rate: number;
  quantity: number;
  startDate: string;

  // নতুন ফিল্ড
  salary: number;
  weeklyFood: number;
  openingBalance: number;
  openingBalanceType: string;
};
const KhotiyanModal = ({ isOpen, onClose }: TCustomModal) => {
  // const { isError, isLoading, data } = useGetLedgerCountQuery(undefined);
  const {
    isError: optionError,
    isLoading: optionLoading,
    data: option,
  } = useGetLedgerOptionQuery(undefined);
  const [mutateAsync, { isLoading: createLoading }] = useCreateLedgerMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TKhatiyan>({
    defaultValues: {},
  });

  const labelValuePairArray = formatLabelValuePair({
    data: option?.data,
    label: "name",
    value: "id",
  });

  // const count = data?.data?.count;
  // useEffect(() => {
  //   if (count) {
  //     reset({
  //       serial: count,
  //     });
  //   }
  // }, [count, reset]);

  const onSubmit: SubmitHandler<TKhatiyan> = async (data) => {

    try {
      const result = await mutateAsync(data).unwrap();
      if (result?.success) {
        showToast({
          title: result?.message,
          type: "success"
        })
        handleClose();
      } else {
        showToast({
          title: result?.message,
          type: "error"
        })
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      showToast({
        title: error?.data?.message || SERVER_ERROR_MESSAGE,
        type: "error"
      })

    }
  };

  const handleClose = () => {
    onClose();
    reset();
  };
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="খতিয়ান অ্যাড"
      width="xl"
    >
      {optionLoading ? (
        <CustomStatus type="loading" fullScreen={false} />
      ) : optionError ? (
        <CustomStatus type="error" fullScreen={false} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <CustomInput
              name="serial"
              label="সিরিয়াল"
              placeholder="সিরিয়াল"
              register={register}
              type="number"
              error={errors.serial}
              rules={{ required: "এই ফিল্ডটি আবশ্যক" }}
            />

            <CustomInput
              name="name"
              label="খতিয়ানের নাম"
              placeholder="খতিয়ানের নাম"
              register={register}
              type="text"
              error={errors.name}
              rules={{ required: "এই ফিল্ডটি আবশ্যক" }}
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
              placeholder="শুরুর তারিখ"
            />

            <CustomInput
              name="rate"
              label="খতিয়ানের রেট"
              placeholder="খতিয়ানের রেট"
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
          <div className="flex items-center w-full gap-2 justify-between pt-5">
            <div
              onClick={() => reset()}
              className="text-[14px] border w-full text-center border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5  text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
            >
              ক্লিয়ার
            </div>
            <button
              disabled={createLoading}
              className="text-[14px] bg-[#039A63] w-full px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer disabled:bg-gray-500"
            >
              অ্যাড করুন
            </button>
          </div>
        </form>
      )}




    </CustomModal>
  );
};

export default KhotiyanModal;
