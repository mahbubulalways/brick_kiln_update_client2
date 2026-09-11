"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import { Plus, Trash } from "lucide-react";
import { Label } from "@radix-ui/react-dropdown-menu";
import SmsSwitch from "@/components/Reusable/SmsSwitch";
import { useGetAllClassAndRateQuery } from "@/redux/features/classAndRate.features";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { TChallanCreate, TClassAndRate } from "@/types/types";
import {
  useCreateInvoiceMutation,
  useGetInvoiceSerialQuery,
} from "@/redux/features/invoice.features";
import { showToast } from "@/components/Toast/CustomToast";
import { MdOutlineError } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";
import { RiErrorWarningFill } from "react-icons/ri";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomStatus from "@/components/Reusable/CustomStatus";
import OldCustomerModal from "./OldCustomerModal";
import { generateDeliveryDateRange } from "@/utils/generateDeliveryDateRange";
type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};
type TCustomer = {
  id: string;
  customerCode: string;
  name: string;
  phoneNumber: string;
  address?: string;
};

const NewChalanModal = ({ isOpen, onClose }: TCustomModal) => {
  const [challanDate, setChallanDate] = useState<Date | undefined>(new Date());
  const [duePayDate, setDuepayDate] = useState<Date | undefined>();
  const [sendSms, setSendSms] = useState<boolean>(false);
  const [openOlodCustomerModal, setOpenOldCustomerModal] = useState<boolean>(false);
  // GET INVOICE SERIAL FOR INVOICE NO
  const { data: invoiceSerial, isLoading: serialLoading, isError: invoiceError } =
    useGetInvoiceSerialQuery({ refetchOnMountOrArgChange: true });
  // GET CLASS AND RATE FOR DROPDOWN
  const { isLoading: classRateLoading, data: fetchedData, isError: classError } =
    useGetAllClassAndRateQuery({ limit: 100000, page: 1 });
  const classAndRate = fetchedData?.data?.data || [];

  // CREATE NEW INVOICE
  const [mutateAsync, { isLoading: createInvoiceLoading }] =
    useCreateInvoiceMutation();
  const classOptions = classAndRate?.map((cls: TClassAndRate) => ({
    label: `${cls?.className}`,
    value: cls?.className,
  }));
  // REACT HOOK FORM
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TChallanCreate>({
    defaultValues: {
      invoiceItems: {
        items: [{ class: "", rate: 0, quantity: 0, price: 0, }],
      },
      invoice: {
        discount: 0,
        carRent: 0
      }
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems.items",
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchItems = watch("invoiceItems.items");
  const carRent = watch("invoice.carRent");
  const discount = watch("invoice.discount");
  const cash = watch("invoice.cash");
  const chalanType = watch("invoice.chalanType");
  // Update price instantly whenever rate or quantity changes
  watchItems.forEach((item, index) => {
    const selectedClassName = item.class;
    const rateFromClass =
      classAndRate.find(
        (cls: TClassAndRate) => cls.className === selectedClassName,
      )?.rate || 0;

    const quantity = Number(item.quantity) || 0;
    const price = rateFromClass * quantity;

    // Update rate if it's different
    if (Number(item.rate) !== rateFromClass) {
      setValue(`invoiceItems.items.${index}.rate`, rateFromClass);
    }

    // Update price if it's different
    if (Number(item.price) !== price) {
      setValue(`invoiceItems.items.${index}.price`, price);
    }
  });

  const totalProductPrice = watchItems.reduce(
    (acc, current) => acc + Number(current.price),
    0,
  );
  const totalPrice =
    totalProductPrice + Number(carRent || 0) - Number(discount || 0);

  const due = totalPrice - Number(cash || 0);

  // HANDLE CALCULATIONS
  useEffect(() => {
    setValue("invoice.productPrice", totalProductPrice);
    setValue("invoice.totalPrice", totalPrice);
    setValue("invoice.due", due);
  }, [due, setValue, totalPrice, totalProductPrice]);

  // MIN MAX DATE OF CHALLANS
  const deliverySeason = watch("invoice.deliverySeason");

  const isAdvanceChalan = chalanType === "অগ্রিম চালান";

  const { minDate, maxDate } = generateDeliveryDateRange(
    deliverySeason!,
    isAdvanceChalan,
  );


  //* FORM SUBMIT
  const onSubmit: SubmitHandler<TChallanCreate> = async (data) => {
    const allValid = watchItems.every((item) =>
      Object.values(item).every((value) => value !== 0 && value !== ""),
    );
    if (allValid === false) {
      return showToast({
        title: "আইটেমের শ্রেণি/পরিমাণ/রেট ঠিক করে দিন",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }
    data.invoice.challanDate = challanDate as Date;
    data.invoice.duePaymentDate = duePayDate as Date;
    data.invoice.serial = Number(data.invoice.serial);
    data.invoice.carRent = Number(data.invoice.carRent);
    data.invoice.cash = Number(data.invoice.cash);
    data.invoice.discount = Number(data.invoice.discount);
    data.invoice.totalPrice = Number(data.invoice.totalPrice);
    data.invoice.due = Number(data.invoice.due);


    if (data.invoice.due < 0) {
      return showToast({
        title: "মোট টাকার চেয়ে বেশি টাকা দেওয়া হয়েছে",
        type: "error",
        options: {
          duration: 4000,
          icon: <RiErrorWarningFill className="h-5 w-5" />,
        },
      });
    }
    if (data.invoice.due && !duePayDate) {
      return showToast({
        title: "বাকি পরিশোধের তারিখ সেট করুন",
        type: "error",
        options: {
          duration: 4000,
          icon: <RiErrorWarningFill className="h-5 w-5" />,
        },
      });
    }
    try {
      const result = await mutateAsync(data).unwrap();

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
      showToast({
        title: error?.data?.message,
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }
  };


  const handleSelectOldCustomer = (customer: TCustomer) => {
    setValue("customer.phoneNumber", customer.phoneNumber || "");
    setValue("customer.name", customer.name || "");
    setValue("customer.address", customer.address || "");
    setOpenOldCustomerModal(false);
  };




  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন চালান"
      width="xxl"
    >
      {classRateLoading || serialLoading ? (
        <CustomStatus type="loading" />
      ) : invoiceError ? (
        <CustomStatus type="error" />
      ) : classError ? (
        <CustomStatus
          type="error"
          description="চালান তৈরির জন্য কোনো শ্রেণি পাওয়া যায়নি।"
        />
      )
        : (
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm justify-between">

              <div className="flex w-full  gap-2">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#039A63] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#028a58] sm:w-auto"
                >
                  নতুন কাস্টমার
                </button>

                <button
                  type="button"
                  onClick={() => setOpenOldCustomerModal(true)}
                  className="w-full rounded-lg border border-orange-400 bg-orange-50 px-5 py-2 text-sm font-semibold text-orange-600 transition hover:bg-orange-500 hover:text-white sm:w-auto"
                >
                  পুরাতন কাস্টমার
                </button>
              </div>

              <div className="flex w-full gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex w-full items-center rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
                    <label className="mr-2 whitespace-nowrap text-sm font-medium text-gray-700">
                      চালান নম্বর:
                    </label>

                    <input
                      type="text"
                      className="min-w-0 flex-1 bg-transparent pl-1 text-sm font-medium text-gray-800 outline-none"
                      placeholder="000"
                      {...register("invoice.serial")}
                      defaultValue={
                        invoiceSerial?.data?.invoiceSerial
                          ? invoiceSerial.data.invoiceSerial
                          : 1
                      }
                    />
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <CustomDatePickerState
                    value={challanDate!}
                    onChange={setChallanDate!}
                    disablePastDates
                  />
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                    👤
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-gray-800">
                      কাস্টমারের তথ্য
                    </h3>
                    <p className="text-xs text-gray-500">
                      কাস্টমারের প্রয়োজনীয় তথ্য পূরণ করুন
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  <CustomInput
                    name="customer.phoneNumber"
                    label="ফোন নম্বর"
                    placeholder="ফোন নম্বর"
                    register={register}
                    type="text"
                    rules={{ required: "ফোন নম্বর লিখুন" }}
                    error={errors.customer?.phoneNumber}
                  />

                  <CustomInput
                    name="customer.name"
                    label="কাস্টমারের নাম"
                    placeholder="কাস্টমারের নাম"
                    register={register}
                    type="text"
                    rules={{ required: "কাস্টমারের নাম লিখুন" }}
                    error={errors.customer?.name}
                  />

                  <CustomInput
                    name="customer.address"
                    label="কাস্টমারের ঠিকানা"
                    placeholder="কাস্টমারের ঠিকানা"
                    register={register}
                    type="text"
                    rules={{ required: "কাস্টমারের ঠিকানা লিখুন" }}
                    error={errors.customer?.address}
                  />

                  <CustomSelect
                    name="invoice.chalanType"
                    label="চালানের ধরণ"
                    placeholder="চালানের ধরণ"
                    error={errors.invoice?.chalanType}
                    rules={{ required: "চালানের ধরণ নির্বাচন করুন" }}
                    control={control}
                    options={[
                      {
                        label: "রেগুলার চালান",
                        value: "রেগুলার চালান",
                      },
                      {
                        label: "অগ্রিম চালান",
                        value: "অগ্রিম চালান",
                      },
                    ]}
                  />

                  {chalanType === "অগ্রিম চালান" && (
                    <CustomSelect
                      name="invoice.deliverySeason"
                      label="ডেলিভারি সিজন"
                      placeholder="ডেলিভারি সিজন নির্বাচন করুন"
                      control={control}
                      options={[
                        { label: "2026-2027", value: "2026-2027" },
                        { label: "2027-2028", value: "2027-2028" },
                        { label: "2028-2029", value: "2028-2029" },
                        { label: "2029-2030", value: "2029-2030" },
                        { label: "2030-2031", value: "2030-2031" },
                        { label: "2031-2032", value: "2031-2032" },
                        { label: "2032-2033", value: "2032-2033" },
                        { label: "2033-2034", value: "2033-2034" },
                        { label: "2034-2035", value: "2034-2035" },
                        { label: "2035-2036", value: "2035-2036" },
                      ]}
                      error={errors.invoice?.deliverySeason}
                      rules={{
                        required: "ডেলিভারি সিজন নির্বাচন করুন",
                      }}
                    />
                  )}

                  <CustomDatePicker
                    control={control}
                    name="invoice.deliveryDate"
                    placeholder="ডেলিভারি তারিখ"
                    label="ডেলিভারি তারিখ"
                    disablePastDates
                    minDate={minDate}
                    maxDate={maxDate}
                    error={errors.invoice?.deliveryDate}
                    rules={{
                      required: "ডেলিভারি তারিখ নির্বাচন করুন",
                    }}
                  />

                  <CustomInput
                    name="invoice.note"
                    label="নোট"
                    placeholder="নোট লিখুন"
                    register={register}
                    type="text"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-2 shadow-sm">
                <div className="mb-3 flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                      📦
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        পণ্যের তথ্য
                      </h3>

                      <p className="text-xs text-gray-500">
                        শ্রেণি, রেট ও পরিমাণ নির্বাচন করুন
                      </p>
                    </div>
                  </div>

                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-[#039A63]">
                    {fields.length} টি আইটেম
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-2 transition hover:border-green-200"
                    >
                      <div className="flex flex-col gap-1 md:flex-row md:items-end">
                        <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4">
                          <CustomSelect
                            name={`invoiceItems.items.${index}.class`}
                            label="শ্রেণি"
                            placeholder="শ্রেণি নির্বাচন করুন"
                            control={control}
                            options={classOptions || []}
                            error={errors.invoiceItems?.items?.[index]?.class}
                            rules={{
                              required: "শ্রেণি নির্বাচন করুন",
                            }}
                          />

                          <CustomInput
                            name={`invoiceItems.items.${index}.rate`}
                            label="রেট"
                            placeholder="0"
                            register={register}
                            type="text"
                            error={errors.invoiceItems?.items?.[index]?.rate}
                            rules={{
                              required: "রেট আবশ্যক",
                            }}
                          />

                          <CustomInput
                            name={`invoiceItems.items.${index}.quantity`}
                            label="পরিমাণ"
                            placeholder="0"
                            register={register}
                            type="number"
                            error={errors.invoiceItems?.items?.[index]?.quantity}
                            rules={{
                              required: "পরিমাণ আবশ্যক",
                            }}
                          />

                          <CustomInput
                            name={`invoiceItems.items.${index}.price`}
                            label="মূল্য"
                            placeholder="0"
                            register={register}
                            type="number"
                            readonly
                            error={errors.invoiceItems?.items?.[index]?.price}
                            rules={{
                              required: "মূল্য আবশ্যক",
                            }}
                          />
                        </div>

                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              append({
                                class: "",
                                rate: 0,
                                quantity: 0,
                                price: 0,
                              })
                            }
                            title="নতুন সারি যোগ করুন"
                            className="flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white active:scale-95"
                          >
                            <Plus size={14} strokeWidth={2.5} />
                          </button>

                          <button
                            type="button"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                            title="সারি মুছে ফেলুন"
                            className={`flex h-10 w-8 shrink-0 items-center justify-center rounded-lg border transition active:scale-95 ${fields.length === 1
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                              : "border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                              }`}
                          >
                            <Trash size={14} strokeWidth={2.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Payment Information */}
                <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-lg">
                      📅
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        পেমেন্ট তথ্য
                      </h3>
                      <p className="text-xs text-gray-500">
                        বাকি থাকলে পরবর্তী পরিশোধের তারিখ দিন
                      </p>
                    </div>
                  </div>

                  <div>
                    {due > 0 ? (
                      <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-3">
                        <div className="mb-2">
                          <p className="text-sm font-semibold text-orange-600">
                            বাকি পরিশোধের তারিখ
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            কাস্টমার কখন বাকি পরিশোধ করবে সেই তারিখ নির্বাচন করুন
                          </p>
                        </div>

                        <CustomDatePickerState
                          disablePastDates
                          value={duePayDate}
                          onChange={setDuepayDate}
                        />
                      </div>
                    ) : due < 0 ? (
                      <div className="rounded-xl border border-blue-100 bg-blue-50 p-1">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center 
                          rounded-full bg-white">
                            X
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-red-700">
                              অতিরিক্ত টাকা প্রদান করা হয়েছে
                            </p>

                            <p className="mt-1 text-xs text-red-600">
                              কাস্টমার মোট মূল্যের চেয়ে{" "}
                              <span className="font-semibold">
                                ৳ {Math.abs(due).toLocaleString("bn-BD")}
                              </span>{" "}
                              বেশি টাকা দিয়েছেন
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-green-600 shadow-sm">
                            ✓
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-green-700">
                              কোনো বাকি নেই
                            </p>

                            <p className="mt-1 text-xs text-green-600">
                              এই কাস্টমারের কোনো বাকি নেই
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* SMS */}
                    <div className="mt-3 flex items-center justify-between
                   rounded-xl border border-gray-100 bg-white px-3 
                   shadow py-2.5">
                      <div>
                        <p className="text-sm font-semibold text-gray-700">
                          কাস্টমারকে SMS পাঠান
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          চালান তৈরি হওয়ার পর SMS পাঠানো হবে
                        </p>
                      </div>

                      <SmsSwitch
                        sendSms={sendSms}
                        setSendSms={setSendSms}
                        showBorder={false}
                        showLabel={false}
                        title="SMS"
                      />
                    </div>
                  </div>
                </div>

                {/* হিসাবের তথ্য */}
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-lg font-bold text-[#039A63]">
                      ৳
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-800">
                        হিসাবের তথ্য
                      </h3>
                      <p className="text-xs text-gray-500">
                        চালানের মোট হিসাব
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <CustomInput
                      name="invoice.productPrice"
                      label="মূল্য"
                      placeholder="0"
                      register={register}
                      type="number"
                      readonly
                      error={errors.invoice?.productPrice}
                      rules={{ required: "মূল্য আবশ্যক" }}
                    />

                    <CustomInput
                      name="invoice.discount"
                      label="ছাড়"
                      placeholder="0"
                      register={register}
                      type="number"
                      error={errors.invoice?.discount}
                      rules={{ required: "ছাড় আবশ্যক" }}
                    />

                    <CustomInput
                      name="invoice.carRent"
                      label="গাড়ি ভাড়া"
                      placeholder="৳ 0"
                      register={register}
                      type="number"
                      error={errors.invoice?.carRent}
                      rules={{ required: "গাড়ি ভাড়া আবশ্যক" }}
                    />

                    <CustomInput
                      name="invoice.totalPrice"
                      label="মোট"
                      placeholder="৳ 0"
                      register={register}
                      type="number"
                      readonly
                      error={errors.invoice?.totalPrice}
                      rules={{ required: "মোট মূল্য আবশ্যক" }}
                    />

                    <CustomInput
                      name="invoice.cash"
                      label="নগদ"
                      placeholder="৳ 0"
                      register={register}
                      type="number"
                      error={errors.invoice?.cash}
                      rules={{ required: "নগদ পরিমাণ আবশ্যক" }}
                    />

                    <CustomInput
                      name="invoice.due"
                      label="বাকি"
                      placeholder="৳ 0"
                      register={register}
                      type="number"
                      readonly
                      error={errors.invoice?.due}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 border-t border-gray-200 pt-4">
                <button
                  type="button"
                  onClick={() => reset()}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-600 transition hover:border-[#039A63] hover:text-[#039A63]"
                >
                  ক্লিয়ার
                </button>

                <button
                  type="submit"
                  disabled={createInvoiceLoading}
                  className="rounded-lg cursor-pointer bg-[#039A63] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#028a58] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  {createInvoiceLoading ? "সেভ হচ্ছে..." : "সেভ করুন"}
                </button>
              </div>
            </form>

            {openOlodCustomerModal && (
              <OldCustomerModal
                setCustomer={handleSelectOldCustomer}
                isOpen={openOlodCustomerModal}
                onClose={() => setOpenOldCustomerModal(false)}
              />
            )}
          </div>
        )}
    </CustomModalBottom>
  );
};

export default NewChalanModal;
