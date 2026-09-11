"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  useGetSinglePaymentReportQuery,
  useUpdatePaymentMutation,
} from "@/redux/features/payment.features";
import { FaCircleCheck } from "react-icons/fa6";
import { showToast } from "@/components/Toast/CustomToast";
import { toast } from "sonner";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { modifyPayload } from "@/utils/modifyPayload";
import CustomFilePicker from "@/components/Reusable/CustomImagePicker/CustomFilePicker";
import { TPaymentResponse } from "@/interface/payment";
import SelectLedgerModal from "../SelectLedgerModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import UpdatePaymentModalPart2 from "./UpdatePaymentModalPart2";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: number | null;
  setId: React.Dispatch<React.SetStateAction<number | null>>;
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
  file?: File;
  paymentDate: string;
};

const UpdatePaymentModal = ({
  isOpen,
  onClose,
  id,
  setId,
}: TCustomModal) => {
  const [mutateAsync, { isLoading }] = useUpdatePaymentMutation();

  const {
    data,
    isError,
    isLoading: getLoading,
  } = useGetSinglePaymentReportQuery(String(id), {
    skip: !id,
    refetchOnMountOrArgChange: true,
  });

  const paymentData = data?.data as TPaymentResponse;

  const [openLedgerModal, setOpenLedgerModal] = useState(false);
  const [ledger, setLedger] = useState<string>("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TKhatiyan>({
    defaultValues: {
      ledger: "",
      paymentType: "",
      paymentDetails: "",
      quantity: 0,
      rate: 0,
      totalBill: 0,
      cutting: 0,
      payment: 0,
      paymentDifference: 0,
    },
  });

  // ================================
  // SET API DATA INTO FORM
  // ================================
  useEffect(() => {
    if (!paymentData) return;

    setIsInitialLoad(true);

    reset({
      ledger: paymentData?.ledger?.name || "",
      cutting: paymentData?.cutting ?? 0,
      payment: paymentData?.payment ?? 0,
      paymentDifference: paymentData?.paymentDifference ?? 0,
      paymentDetails: paymentData?.paymentDetails || "",
      paymentType: paymentData?.paymentType || "",
      quantity: paymentData?.quantity ?? 0,
      rate: paymentData?.rate ?? 0,
      totalBill: paymentData?.totalBill ?? 0,
      paymentDate:paymentData?.paymentDate || "",
    });

    setLedger(paymentData?.ledger?.name || "");

    // API data set হওয়ার পর calculation enable
    const timer = setTimeout(() => {
      setIsInitialLoad(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [paymentData, reset]);

  // ================================
  // WATCH VALUES
  // ================================
  // eslint-disable-next-line react-hooks/incompatible-library
  const quantity = Number(watch("quantity") || 0);
  const rate = Number(watch("rate") || 0);
  const cutting = Number(watch("cutting") || 0);
  const payment = Number(watch("payment") || 0);
  const paymentDifference = Number(
    watch("paymentDifference") || 0,
  );

  // ================================
  // TOTAL BILL CALCULATION
  // quantity × rate
  // ================================
  useEffect(() => {
    if (isInitialLoad) return;

    const totalBill = quantity * rate;

    setValue("totalBill", totalBill, {
      shouldDirty: true,
    });
  }, [
    quantity,
    rate,
    isInitialLoad,
    setValue,
  ]);

  // ================================
  // PAYMENT AUTO CALCULATION
  //
  // quantity / rate change হলে payment
  // সেই অনুযায়ী auto update হবে।
  // (cutting এখানে বিয়োগ হবে না —
  //  cutting শুধু difference-এ প্রভাব ফেলবে)
  //
  // Payment = Total Bill
  // ================================
  useEffect(() => {
    if (isInitialLoad) return;

    const totalBill = quantity * rate - cutting + paymentDifference;

    setValue("payment", totalBill, {
      shouldDirty: true,
    });
  }, [
    quantity,
    rate,
    isInitialLoad, cutting,
    setValue,
  ]);

  // ================================
  // PAYMENT DIFFERENCE CALCULATION
  //
  // Expected Payment = Total Bill - Cutting
  // Difference = Actual Payment - Expected Payment
  // ================================
  useEffect(() => {
    if (isInitialLoad) return;

    const totalBill = quantity * rate;

    const expectedPayment =
      totalBill - cutting;

    const difference =
      payment - expectedPayment;

    setValue("paymentDifference", difference, {
      shouldDirty: true,
    });
  }, [
    quantity,
    rate,
    cutting,
    payment,
    isInitialLoad,
    setValue,
  ]);

  // ================================
  // SUBMIT
  // ================================
  const onSubmit: SubmitHandler<TKhatiyan> = async (
    data,
  ) => {
    const formdata = modifyPayload(data);

    const payload = {
      id: id,
      data: formdata,
    };

    try {
      const result = await mutateAsync(payload).unwrap();

      if (result?.success) {
        handleCloseModal();

        showToast({
          title: result?.message,
          type: "success",
          options: {
            duration: 4000,
            icon: (
              <FaCircleCheck className="h-5 w-5" />
            ),
          },
        });
      }
    } catch (error: any) {
      toast.error(
        error?.data?.message ||
        SERVER_ERROR_MESSAGE,
      );
    }
  };

  // ================================
  // CLOSE MODAL
  // ================================
  const handleCloseModal = () => {
    setId(null);
    setLedger("");
    setOpenLedgerModal(false);
    setIsInitialLoad(true);

    reset({
      ledger: "",
      paymentType: "",
      paymentDetails: "",
      quantity: 0,
      rate: 0,
      totalBill: 0,
      cutting: 0,
      payment: 0,
      paymentDifference: 0,
    });

    onClose();
  };

  // ================================
  // CLEAR FORM
  // ================================
  const handleClear = () => {
    if (!paymentData) return;

    reset({
      ledger: paymentData?.ledger?.name || "",
      cutting: paymentData?.cutting ?? 0,
      payment: paymentData?.payment ?? 0,
      paymentDifference:
        paymentData?.paymentDifference ?? 0,
      paymentDetails:
        paymentData?.paymentDetails || "",
      paymentType:
        paymentData?.paymentType || "",
      quantity: paymentData?.quantity ?? 0,
      rate: paymentData?.rate ?? 0,
      totalBill: paymentData?.totalBill ?? 0,
      paymentDate: paymentData?.paymentDate || "",
    });

    setLedger(
      paymentData?.ledger?.name || "",
    );
  };

  console.log("paymentData", paymentData?.payment);
  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={handleCloseModal}
      title="পেমেন্ট আপডেট"
      width="lg"
    >
      {getLoading ? (
        <CustomStatus type="loading" />
      ) : isError ? (
        <CustomStatus type="error" />
      ) : (
        <>

          {
            paymentData?.paymentType === "অগ্রিম পেমেন্ট" ?

              <UpdatePaymentModalPart2
                paymentData={paymentData}
                onSubmit={onSubmit} />
              : <>
                <form
                  onSubmit={handleSubmit(onSubmit)}
                >
                  {/* ================================
                BASIC INFORMATION
            ================================= */}
                  <div className="mt-2">
                    <div className="flex flex-col gap-5 rounded-b-md pb-4 pt-2">
                      <div className="grid grid-cols-2 gap-2">
                        {/* Ledger */}
                        <div
                          onClick={() =>
                            setOpenLedgerModal(true)
                          }
                        >
                          <CustomInput
                            name="ledger"
                            label="খতিয়ান"
                            placeholder="খতিয়ান নির্বাচন করুন"
                            register={register}
                            readonly
                            type="text"
                            error={errors.ledger}
                            rules={{
                              required:
                                "খতিয়ান নির্বাচন করুন",
                            }}
                          />
                        </div>

                        {/* Payment Type */}
                        <CustomSelect
                          name="paymentType"
                          label="পেমেন্টের ধরণ"
                          placeholder="পেমেন্টের ধরণ"
                          control={control}
                          options={[
                            {
                              label:
                                "রেগুলার পেমেন্ট",
                              value:
                                "রেগুলার পেমেন্ট",
                            },
                            {
                              label:
                                "অগ্রিম পেমেন্ট",
                              value:
                                "অগ্রিম পেমেন্ট",
                            },
                            {
                              label:
                                "বাকি পেমেন্ট",
                              value:
                                "বাকি পেমেন্ট",
                            },
                          ]}
                          error={errors.paymentType}
                          rules={{
                            required:
                              "পেমেন্টের ধরণ",
                          }}
                        />
                      </div>

                      {/* Payment Details */}
                      <CustomInput
                        name="paymentDetails"
                        label="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
                        placeholder="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
                        register={register}
                        type="text"
                        error={errors.paymentDetails}
                        rules={{
                          required:
                            "পেমেন্টের বিস্তারিত বর্ণনা লিখুন",
                        }}
                      />
                    </div>
                  </div>

                  {/* ================================
                PAYMENT CALCULATION
            ================================= */}
                  <div className="mt-2">
                    <div className="grid grid-cols-3 gap-2 rounded-b-md pb-4 pt-2">
                      {/* Quantity */}
                      <CustomInput
                        name="quantity"
                        label="পরিমাণ"
                        placeholder="পরিমাণ লিখুন"
                        register={register}
                        type="number"
                        error={errors.quantity}
                        rules={{
                          required:
                            "পরিমাণ লিখুন",
                        }}
                      />

                      {/* Rate */}
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

                      {/* Total Bill */}
                      <CustomInput
                        name="totalBill"
                        label="মোট বিল"
                        placeholder="মোট বিল"
                        register={register}
                        type="number"
                        readonly
                        error={errors.totalBill}
                        rules={{
                          required: "মোট বিল",
                        }}
                      />

                      {/* Cutting */}
                      <CustomInput
                        name="cutting"
                        label="কর্তন"
                        placeholder="কেটে রাখা হল"
                        register={register}
                        type="number"
                        error={errors.cutting}
                        rules={{
                          required:
                            "কর্তন লিখুন",
                        }}
                      />

                      {/* Payment */}
                      <CustomInput
                        name="payment"
                        label="পেমেন্ট"
                        placeholder="পেমেন্ট দেওয়া হল"
                        register={register}
                        type="number"
                        error={errors.payment}
                        rules={{
                          required:
                            "পেমেন্ট লিখুন",
                        }}
                      />

                      {/* Payment Difference */}
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
                        readonly
                        placeholder="পেমেন্ট কম/বেশি"
                        error={
                          errors.paymentDifference
                        }
                        rules={{
                          required:
                            "পেমেন্ট কম/বেশি লিখুন",
                        }}
                      />
                    </div>
                  </div>

                  {/* ================================
                FILE
            ================================= */}
                 <div className="pt-2 space-y-3">
                   <CustomFilePicker
                    control={control}
                    name="file"
                    label="ডকুমেন্ট / মানি রিসিপ্ট"
                    error={errors.file}

                  />

                  <CustomDatePicker
                    control={control}
                    name="paymentDate"
                    label="পেমেন্টের তারিখ"
                    placeholder="পেমেন্টের তারিখ"
                  />
                 </div>
                  {/* ================================
                BUTTONS
            ================================= */}
                  <div className="flex items-center justify-between pt-5">
                    <button
                      type="button"
                      onClick={handleClear}
                      className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                    >
                      ক্লিয়ার
                    </button>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:bg-gray-500"
                    >
                      {isLoading
                        ? "আপডেট হচ্ছে..."
                        : "আপডেট করুন"}
                    </button>
                  </div>
                </form>

                {/* ================================
              LEDGER MODAL
          ================================= */}
                {openLedgerModal && (
                  <SelectLedgerModal
                    isOpen={openLedgerModal}
                    ledger={ledger}
                    setLedger={setLedger}
                    onClose={() =>
                      setOpenLedgerModal(false)
                    }
                  />
                )}
              </>
          }
        </>

      )}
    </CustomModalBottom>
  );
};

export default UpdatePaymentModal;