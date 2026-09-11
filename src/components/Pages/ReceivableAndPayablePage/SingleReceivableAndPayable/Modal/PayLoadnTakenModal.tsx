"use client";

import { useEffect } from "react";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import { useCreateTransactionMutation, useGetCurrentAmountQuery } from "@/redux/features/due_mate.features";
import { showToast } from "@/components/Toast/CustomToast";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TNewTransactionGiven = {
  remaining: string;
  amount: string;
  currentAmount: string;
  transactionDate: string;
  description: string;
  type: "GIVEN" | "TAKEN" | "PAYMENT"
};

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

const PayLoanTakenModal = ({
  isOpen,
  onClose,
  id,
}: TCustomModal) => {
  const {
    data,
    isLoading,
    isError,
  } = useGetCurrentAmountQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [createTransaction, { isLoading: transactionLoading }] = useCreateTransactionMutation()

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
  } = useForm<TNewTransactionGiven>({
    defaultValues: {
      remaining: "",
      amount: "",
      currentAmount: "",
      transactionDate: "",
      description: "",
    },
  });

  useEffect(() => {
    if (data?.data !== undefined) {
      setValue("remaining", String(data.data?.currentAmount));
    }
  }, [data, setValue]);

  const amount = watch("amount");
  const remaining = watch("remaining");

  // নতুন টাকা দেওয়ার পর মোট কত হবে
  useEffect(() => {
    const oldAmount = Number(remaining) || 0;
    const newAmount = Number(amount) || 0;

    setValue(
      "currentAmount",
      String(oldAmount - newAmount)
    );
  }, [amount, remaining, setValue]);

  const onSubmit: SubmitHandler<TNewTransactionGiven> = async (formData) => {
    formData.type = "PAYMENT"

    const payload = {
      id,
      data: formData
    }
    try {
      const result = await createTransaction(payload).unwrap()
      if (result?.success) {
        onClose();
        return showToast({
          title: result?.message,
          type: "success",
          options: {
            duration: 4000,
            icon: <FaCircleCheck className="h-5 w-5" />,
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return showToast({
        title:
          error?.data?.message ||
          "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="টাকা ফেরত দেওয়ার হিসাব"
      width="md"
    >{
        isLoading ? <CustomStatus type="loading" /> :
          isError ? <CustomStatus type="error" /> :
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-3">

                <CustomInput
                  name="remaining"
                  label="মোট টাকা পাওনা"
                  placeholder="মোট টাকা পাওনা"
                  register={register}
                  type="number"
                />

                <CustomInput
                  name="amount"
                  label="টাকা ফেরত দিলাম"
                  placeholder="টাকা ফেরত দিলাম"
                  register={register}
                  type="number"
                />

                <CustomInput
                  name="currentAmount"
                  label="পাওনা টাকা বাকি রইল"
                  placeholder="পাওনা টাকা বাকি রইল"
                  register={register}
                  type="number"
                />

                <CustomDatePicker
                  control={control}
                  name="transactionDate"
                  label="পরবর্তি পরিশোধের তারিখ"
                  placeholder="পরবর্তী পরিশোধের তারিখ"
                />

                <CustomTextArea
                  name="description"
                  register={register}
                  placeholder="টাকা দেওয়ার সময়ের কিছু বর্ণনা লিখে রাখুন যা পরবর্তিতে আপনাকে মনে করিয়ে দিতে সাহায্য করবে"
                  label="বর্ণনা"
                />
              </div>

              <div className="flex items-center justify-between pt-5">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
                >
                  ক্লিয়ার
                </button>

                <button
                  type="submit"
                  disabled={transactionLoading}
                  className={`text-[14px] disabled:bg-gray-500 disabled:cursor-default bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer`}
                >
                  যোগ করুন
                </button>
              </div>
            </form>
      }
    </CustomModal>
  );
};

export default PayLoanTakenModal;