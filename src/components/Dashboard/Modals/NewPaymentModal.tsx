"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import SelectLedgerModal from "./SelectLedgerModal";
import { useCreatePaymentMutation } from "@/redux/features/payment.features";
import { FaCircleCheck } from "react-icons/fa6";
import { showToast } from "@/components/Toast/CustomToast";
import { toast } from "sonner";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { modifyPayload } from "@/utils/modifyPayload";
import CustomFilePicker from "@/components/Reusable/CustomImagePicker/CustomFilePicker";
type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TKhatiyan = {
  ledger: string;
  paymentType: string;
  paymentDetails: string;
  quantity: number;
  rate: number;
  totalBill: number;
  cutting: number;
  payment: number;
  paymentDifference: number;
  address: string;
  file: File;
};
const NewPaymentModal = ({ isOpen, onClose }: TCustomModal) => {
  const [mutateAsync, { isLoading }] = useCreatePaymentMutation();
  const [openLedgerModal, setOpenLedgerModal] = useState(false);
  const [ledger, setLedger] = useState<string>("");
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TKhatiyan>({
    defaultValues: {},
  });

  useEffect(() => {
    if (ledger) {
      reset({
        ledger: ledger,
      });
    }
  }, [ledger, reset]);

  // CALCULATIONS
  // eslint-disable-next-line react-hooks/incompatible-library
  const quantity = Number(watch("quantity") || 0);
  const rate = Number(watch("rate") || 0);
  const cutting = Number(watch("cutting") || 0);

  useEffect(() => {
    const totalBill = quantity * rate;
    const expectedPayment = totalBill - cutting;
    setValue("totalBill", totalBill);
    setValue("payment", expectedPayment);
  }, [quantity, rate, cutting, setValue]);

  const paymentState = Number(watch("payment") || 0);
  useEffect(() => {
    const totalBill = quantity * rate;
    const expectedPayment = totalBill - cutting;
    const difference = paymentState - expectedPayment;
    setValue("paymentDifference", difference);
  }, [quantity, rate, cutting, setValue, paymentState]);

  const onSubmit: SubmitHandler<TKhatiyan> = async (data) => {
    const formdata = modifyPayload(data);
    try {
      const result = await mutateAsync(formdata).unwrap();
      if (result?.success) {
        onClose();
        reset();
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
      toast.error(error?.data?.message || SERVER_ERROR_MESSAGE);
    }
  };

  const paymentDifference = watch("paymentDifference");
  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন পেমেন্ট"
      width="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className=" mt-2">
          <div className=" pt-2 pb-4 rounded-b-md flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-2">
              <div onClick={() => setOpenLedgerModal(true)}>
                <CustomInput
                  name="ledger"
                  label="খতিয়ান"
                  placeholder="খতিয়ান নির্বাচন করুন"
                  register={register}
                  readonly
                  type="text"
                  error={errors.ledger}
                  rules={{
                    required: "খতিয়ান নির্বাচন করুন",
                  }}
                />
              </div>
              <CustomSelect
                name="paymentType"
                label="পেমেন্টের ধরণ"
                placeholder="পেমেন্টের ধরণ"
                control={control}
                options={[
                  {
                    label: "রেগুলার পেমেন্ট",
                    value: "রেগুলার পেমেন্ট",
                  },
                  {
                    label: "অগ্রিম পেমেন্ট",
                    value: "অগ্রিম পেমেন্ট",
                  },
                  {
                    label: "বাকি পেমেন্ট",
                    value: "বাকি পেমেন্ট",
                  },
                ]}
                error={errors.paymentType}
                rules={{
                  required: "পেমেন্টের ধরণ",
                }}
              />
            </div>
            <CustomInput
              name="paymentDetails"
              label="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
              placeholder="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
              register={register}
              type="text"
              error={errors.paymentDetails}
              rules={{
                required: "পেমেন্টের বিস্তারিত বর্ণনা লিখুন",
              }}
            />
          </div>
        </div>

        <div className=" mt-2">
          <div className=" pt-2 pb-2 rounded-b-md grid grid-cols-3 gap-2">
            <CustomInput
              name="quantity"
              label="পরিমান"
              placeholder="পরিমান লিখুন"
              register={register}
              type="number"
              error={errors.quantity}
              rules={{
                required: "পরিমান লিখুন",
              }}
            />
            <CustomInput
              name="rate"
              label="রেট"
              placeholder="রেট লিখুন"
              register={register}
              type="number"
              error={errors.rate}
              rules={{
                required: "রেট লিখুন",
              }}
            />
            <CustomInput
              name="totalBill"
              label="মোট বিল"
              placeholder="মোট বিল"
              register={register}
              type="number"
              error={errors.totalBill}
              rules={{
                required: "মোট বিল",
              }}
            />
            <CustomInput
              name="cutting"
              label="কর্তন"
              placeholder="কেটে রাখা হল"
              register={register}
              type="number"
            // error={errors.cutting}
            // rules={{
            //   required: "কর্তন লিখুন",
            // }}
            />
            <CustomInput
              name="payment"
              label="পেমেন্ট"
              placeholder="পেমেন্ট দেওয়া হল"
              register={register}
              type="number"
              error={errors.payment}
              rules={{
                required: "পেমেন্ট লিখুন",
              }}
            />

            <CustomInput
              name="paymentDifference"
              label={
                paymentDifference === 0
                  ? "পেমেন্ট কম/বেশি"
                  : paymentDifference < 0
                    ? "পেমেন্ট বাকি"
                    : "বেশি পেমেন্ট"
              }
              register={register}
              type="number"
              placeholder="পেমেন্ট কম/বেশি"
              error={errors.paymentDifference}
              rules={{
                required: "পেমেন্ট কম/বেশি লিখুন",
              }}
            />
          </div>

          <div className="pb-2">
            <CustomInput
              name="address"
              label="ঠিকানা"
              register={register}
              type="text"
              placeholder="ঠিকানা লিখুন"
            // error={errors.address}
            // rules={{
            //   required: "ঠিকানা লিখুন",
            // }}
            />
          </div>
        </div>
        <CustomFilePicker
          control={control}
          name="file"
          label="ডকুমেন্ট / মানি রিসিপ্ট"
        // required
        // error={errors.file}
        // rules={{ required: "ফাইল আপলোড করুন" }}
        />
        <div className="flex items-center justify-between pt-5">
          <div className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5  text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer">
            ক্লিয়ার
          </div>
          <button
            disabled={isLoading}
            className="text-[14px] disabled:cursor-default  bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer disabled:bg-gray-500"
          >
            অ্যাড করুন
          </button>
        </div>
      </form>
      {openLedgerModal && (
        <SelectLedgerModal
          isOpen={openLedgerModal}
          ledger={ledger}
          setLedger={setLedger}
          onClose={() => setOpenLedgerModal(false)}
        />
      )}
    </CustomModalBottom>
  );
};

export default NewPaymentModal;
