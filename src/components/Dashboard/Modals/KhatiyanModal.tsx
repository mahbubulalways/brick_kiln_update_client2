"use client";
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
  showRateQuantity: boolean
};

type TKhatiyan = {
  serial: string;
  name: string;
  parentId: number;
  rate: number;
  quantity: number
};
const KhotiyanModal = ({ isOpen, onClose, showRateQuantity }: TCustomModal) => {
  const { isError, isLoading, data } = useGetLedgerCountQuery(undefined);
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

  const count = data?.data?.count;
  useEffect(() => {
    if (count) {
      reset({
        serial: count,
      });
    }
  }, [count, reset]);

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
      title="খতিয়ান অ্যাড/আপডেট"
      width="sm"
    >
      {isLoading || optionLoading ? (
        <CustomStatus type="loading" fullScreen={false} />
      ) : isError || optionError ? (
        <CustomStatus type="error" fullScreen={false} />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4">
            <CustomInput
              name="serial"
              label="সিরিয়াল"
              placeholder="সিরিয়াল"
              register={register}
              readonly
              type="text"
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

            {
              showRateQuantity && <div className="grid grid-cols-2 gap-2">
                <CustomInput
                  name="rate"
                  label="খতিয়ানের রেট"
                  placeholder="খতিয়ানের রেট"
                  register={register}
                  type="number"

                />

                <CustomInput
                  name="quantity"
                  label="পরিমাণ ভাজক (যদি থাকে)"
                  placeholder="পরিমাণ ভাজক"
                  register={register}
                  type="number"

                />
              </div>
            }



          </div>

          <div className="flex items-center justify-between pt-5">
            <div
              onClick={() => reset()}
              className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5  text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
            >
              ক্লিয়ার
            </div>
            <button
              disabled={createLoading}
              className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer disabled:bg-gray-500"
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
