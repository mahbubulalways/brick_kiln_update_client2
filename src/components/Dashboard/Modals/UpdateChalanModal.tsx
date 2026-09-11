"use client";

import { useEffect, useRef, useState } from "react";

import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

import { Plus, Trash } from "lucide-react";
import { MdOutlineError } from "react-icons/md";
import { FaCircleCheck } from "react-icons/fa6";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomStatus from "@/components/Reusable/CustomStatus";
import SmsSwitch from "@/components/Reusable/SmsSwitch";

import { useGetAllClassAndRateQuery } from "@/redux/features/classAndRate.features";

import {
  useGetSingleInvoiceQuery,
  useUpdateInvoiceMutation,
} from "@/redux/features/invoice.features";

import {
  TChallanCreate,
  TClassAndRate,
  TCustomInvoiceModal,
} from "@/types/types";

import { showToast } from "@/components/Toast/CustomToast";
import { generateDeliveryDateRange } from "@/utils/generateDeliveryDateRange";

const UpdateChalanModal = ({
  isOpen,
  onClose,
  invoiceId,
  setInvoiceId,
}: TCustomInvoiceModal) => {
  const [challanDate, setChallanDate] = useState<Date | undefined>(
    new Date(),
  );

  const [sendSms, setSendSms] = useState(false);

  // ---------------------------------------------------------
  // IMPORTANT:
  // This prevents deliverySeason from being cleared during
  // initial API reset().
  // ---------------------------------------------------------
  const isInitialLoad = useRef(true);

  const {
    data: invoice,
    isLoading: invoiceLoading,
    isError: invoiceError,
  } = useGetSingleInvoiceQuery(invoiceId, {
    refetchOnMountOrArgChange: true,
    skip: !invoiceId,
  });

  const {
    isLoading: classRateLoading,
    data: fetchedData,
    isError: classError,
  } = useGetAllClassAndRateQuery({ limit: 1000000, page: 1 });

  const classAndRate: TClassAndRate[] = fetchedData?.data?.data || [];

  const [mutateAsync, { isLoading: updateLoading }] =
    useUpdateInvoiceMutation();

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
      invoice: {
        note: "",
        serial: 0,
        discount: 0,
        carRent: 0,
        due: 0,
        cash: 0,
        chalanType: "",
        challanDate: null,
        deliveryDate: null,
        duePaymentDate: null,
        deliverySeason: null,
        productPrice: 0,
        totalPrice: 0,
      },

      invoiceItems: {
        items: [
          {
            class: "",
            rate: 0,
            quantity: 0,
            price: 0,
          },
        ],
      },
    },
  });




  const { fields, append, remove } = useFieldArray({
    control,
    name: "invoiceItems.items",
  });

  const chalanType = watch("invoice.chalanType");
  const watchItems = watch("invoiceItems.items") || [];

  const carRent = Number(watch("invoice.carRent")) || 0;
  const discount = Number(watch("invoice.discount")) || 0;
  const cash = Number(watch("invoice.cash")) || 0;
  const due = Number(watch("invoice.due")) || 0;

  const classOptions = classAndRate.map((cls) => ({
    label: cls.className,
    value: cls.className,
  }));

  // =========================================================
  // LOAD INVOICE DATA
  // =========================================================

  useEffect(() => {
    if (!invoice?.data) return;

    const data = invoice.data;

    // Very important:
    // API data is being loaded, so don't clear deliverySeason.
    isInitialLoad.current = true;

    reset({
      customer: {
        phoneNumber: data.customer?.phoneNumber || "",
        name: data.customer?.name || "",
        address: data.customer?.address || "",
      },

      invoice: {
        note: data.note || "",
        serial: Number(data.serial) || 0,

        discount: Number(data.discount) || 0,
        carRent: Number(data.carRent) || 0,
        due: Number(data.due) || 0,
        cash: Number(data.cash) || 0,

        chalanType: data.chalanType || "",

        challanDate: data.challanDate
          ? new Date(data.challanDate)
          : null,

        deliveryDate: data.deliveryDate
          ? new Date(data.deliveryDate)
          : null,

        duePaymentDate: data.duePaymentDate
          ? new Date(data.duePaymentDate)
          : null,

        // =====================================================
        // IMPORTANT
        // If API says advance challan, keep deliverySeason.
        // =====================================================
        deliverySeason:
          data.chalanType === "অগ্রিম চালান"
            ? data.deliverySeason || null
            : null,

        productPrice: Number(data.productPrice) || 0,
        totalPrice: Number(data.totalPrice) || 0,
      },

      invoiceItems: {
        items:
          data.items?.length > 0
            ? data.items.map((item: any) => ({
              class: item.class || "",
              rate: Number(item.rate) || 0,
              quantity: Number(item.quantity) || 0,
              price: Number(item.price) || 0,

              ...(item.delivered !== undefined
                ? { delivered: item.delivered }
                : {}),
            }))
            : [
              {
                class: "",
                rate: 0,
                quantity: 0,
                price: 0,
              },
            ],
      },
    });

    if (data.challanDate) {
      setChallanDate(new Date(data.challanDate));
    } else {
      setChallanDate(new Date());
    }

    // Allow the reset/render cycle to finish.
    // After this, changing challan type manually will work normally.
    setTimeout(() => {
      isInitialLoad.current = false;
    }, 0);
  }, [invoice?.data, reset]);

  // =========================================================
  // CLEAR DELIVERY SEASON ONLY WHEN USER CHANGES CHALLAN TYPE
  // =========================================================

  useEffect(() => {
    // Don't run while invoice API data is being loaded/reset.
    if (isInitialLoad.current) return;

    // If user changes from Advance -> Regular,
    // then delivery season should be removed.
    if (chalanType !== "অগ্রিম চালান") {
      setValue("invoice.deliverySeason", null, {
        shouldDirty: true,
        shouldValidate: false,
      });
    }
  }, [chalanType, setValue]);

  // =========================================================
  // ITEM RATE + PRICE CALCULATION
  // =========================================================

  useEffect(() => {
    watchItems.forEach((item, index) => {
      const selectedClass = item?.class;

      const rate =
        classAndRate.find(
          (cls) => cls.className === selectedClass,
        )?.rate || 0;

      const quantity = Number(item?.quantity) || 0;

      const price = Number(rate) * quantity;

      if (Number(item?.rate) !== Number(rate)) {
        setValue(
          `invoiceItems.items.${index}.rate`,
          Number(rate),
        );
      }

      if (Number(item?.price) !== Number(price)) {
        setValue(
          `invoiceItems.items.${index}.price`,
          price,
        );
      }
    });
  }, [watchItems, classAndRate, setValue]);

  // =========================================================
  // TOTAL CALCULATION
  // =========================================================

  const totalProductPrice = watchItems.reduce(
    (total, item) =>
      total + (Number(item?.price) || 0),
    0,
  );

  const totalPrice = Math.max(
    totalProductPrice + carRent - discount,
    0,
  );

  const safeCash = Math.min(
    Math.max(cash, 0),
    totalPrice,
  );

  const calculatedDue = Math.max(
    totalPrice - safeCash,
    0,
  );

  useEffect(() => {
    setValue(
      "invoice.productPrice",
      totalProductPrice,
    );

    setValue(
      "invoice.totalPrice",
      totalPrice,
    );

    setValue(
      "invoice.due",
      calculatedDue,
    );
  }, [
    totalProductPrice,
    totalPrice,
    calculatedDue,
    setValue,
  ]);




  const deliverySeason = watch("invoice.deliverySeason");

  const isAdvanceChalan = chalanType === "অগ্রিম চালান";

  const { minDate, maxDate } = generateDeliveryDateRange(
    deliverySeason!,
    isAdvanceChalan,
  );



  // =========================================================
  // SUBMIT
  // =========================================================

  const onSubmit: SubmitHandler<TChallanCreate> = async (
    data,
  ) => {
    const allValid = watchItems.every((item) =>
      Object.entries(item)
        .filter(([key]) => key !== "delivered")
        .every(
          ([, value]) =>
            value !== null &&
            value !== undefined &&
            value !== "",
        ),
    );

    if (!allValid) {
      showToast({
        title: "আইটেমের শ্রেণি/পরিমাণ/রেট ঠিক করে দিন",
        type: "error",
        options: {
          duration: 4000,
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
        },
      });

      return;
    }

    if (
      data.invoice.chalanType === "অগ্রিম চালান" &&
      !data.invoice.deliverySeason
    ) {
      showToast({
        title: "ডেলিভারি সিজন নির্বাচন করুন",
        type: "error",
        options: {
          duration: 4000,
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
        },
      });

      return;
    }

    const selectedChalanType =
      data.invoice.chalanType;

    const invoicePayload = {
      ...data.invoice,

      serial: Number(data.invoice.serial) || 0,

      productPrice:
        Number(data.invoice.productPrice) || 0,

      carRent:
        Number(data.invoice.carRent) || 0,

      cash:
        Number(data.invoice.cash) || 0,

      discount:
        Number(data.invoice.discount) || 0,

      totalPrice:
        Number(data.invoice.totalPrice) || 0,

      due:
        Number(data.invoice.due) || 0,

      chalanType: selectedChalanType,

      challanDate: challanDate
        ? new Date(challanDate)
        : null,

      deliveryDate:
        data.invoice.deliveryDate
          ? new Date(data.invoice.deliveryDate)
          : null,

      duePaymentDate:
        data.invoice.duePaymentDate
          ? new Date(data.invoice.duePaymentDate)
          : null,

      deliverySeason:
        selectedChalanType === "অগ্রিম চালান"
          ? data.invoice.deliverySeason || null
          : null,
    };

    const updatedData = {
      payload: {
        invoice: invoicePayload,
        invoiceItems: data.invoiceItems.items,
      },

      id: invoiceId,
    };

    try {
      const result =
        await mutateAsync(updatedData).unwrap();

      if (result?.success) {
        onClose();
        setInvoiceId(undefined);
        reset();

        showToast({
          title: result.message,
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
      showToast({
        title:
          error?.data?.message ||
          "চালান আপডেট করা সম্ভব হয়নি",

        type: "error",

        options: {
          duration: 4000,
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
        },
      });
    }
  };

  // =========================================================
  // CLOSE
  // =========================================================

  const handleClose = () => {
    onClose();
    setInvoiceId(undefined);
    reset();

    // Reset initialization state for next invoice.
    isInitialLoad.current = true;
  };

  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={handleClose}
      title="আপডেট চালান 🧐"
      width="xxl"
    >
      {classRateLoading || invoiceLoading ? (
        <CustomStatus type="loading" />
      ) : invoiceError || classError ? (
        <CustomStatus type="error" />
      ) : (
        <div className="space-y-4">

          {/* Header */}
          <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm lg:flex-row">

            <div className="flex w-full gap-2">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#039A63] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#028a58] sm:w-auto"
              >
                নতুন কাস্টমার
              </button>

              <button
                type="button"
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
                    readOnly
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

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >

            {/* Customer Information */}
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
                    কাস্টমারের প্রয়োজনীয় তথ্য
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
                  readonly
                />

                <CustomInput
                  name="customer.name"
                  label="কাস্টমারের নাম"
                  placeholder="কাস্টমারের নাম"
                  register={register}
                  type="text"
                  readonly
                />

                <CustomInput
                  name="customer.address"
                  label="কাস্টমারের ঠিকানা"
                  placeholder="কাস্টমারের ঠিকানা"
                  register={register}
                  type="text"
                  readonly
                />

                <CustomSelect
                  name="invoice.chalanType"
                  label="চালানের ধরণ"
                  placeholder="চালানের ধরণ"
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
                      {
                        label: "2026-2027",
                        value: "2026-2027",
                      },
                      {
                        label: "2027-2028",
                        value: "2027-2028",
                      },
                      {
                        label: "2028-2029",
                        value: "2028-2029",
                      },
                      {
                        label: "2029-2030",
                        value: "2029-2030",
                      },
                      {
                        label: "2030-2031",
                        value: "2030-2031",
                      },
                      {
                        label: "2031-2032",
                        value: "2031-2032",
                      },
                      {
                        label: "2032-2033",
                        value: "2032-2033",
                      },
                      {
                        label: "2033-2034",
                        value: "2033-2034",
                      },
                      {
                        label: "2034-2035",
                        value: "2034-2035",
                      },
                      {
                        label: "2035-2036",
                        value: "2035-2036",
                      },
                    ]}
                    rules={{
                      required:
                        "ডেলিভারি সিজন নির্বাচন করুন",
                    }}
                  />
                )}

                <CustomDatePicker
                  control={control}
                  name="invoice.deliveryDate"
                  placeholder="ডেলিভারি তারিখ"
                  label="ডেলিভারি তারিখ"
                  minDate={minDate}
                  maxDate={maxDate}
                  disablePastDates
                  rules={{
                    required:
                      "ডেলিভারি তারিখ নির্বাচন করুন",
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

            {/* Product Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">

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
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3 transition hover:border-green-200"
                  >

                    <div className="flex flex-col gap-3 md:flex-row md:items-end">

                      <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4">

                        <CustomSelect
                          name={`invoiceItems.items.${index}.class`}
                          label="শ্রেণি"
                          placeholder="শ্রেণি নির্বাচন করুন"
                          control={control}
                          options={classOptions || []}
                        />

                        <CustomInput
                          name={`invoiceItems.items.${index}.rate`}
                          label="রেট"
                          placeholder="0"
                          register={register}
                          type="text"
                          readonly
                        />

                        <CustomInput
                          name={`invoiceItems.items.${index}.quantity`}
                          label="পরিমাণ"
                          placeholder="0"
                          register={register}
                          type="number"
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
                        />

                      </div>

                      <div className="flex gap-2">

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
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-green-200 bg-green-50 text-green-600 transition hover:bg-green-600 hover:text-white active:scale-95"
                        >
                          <Plus
                            size={16}
                            strokeWidth={2.5}
                          />
                        </button>

                        <button
                          type="button"
                          disabled={fields.length === 1}
                          onClick={() => remove(index)}
                          title="সারি মুছে ফেলুন"
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition active:scale-95 ${fields.length === 1
                            ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                            : "border-red-200 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white"
                            }`}
                        >
                          <Trash
                            size={16}
                            strokeWidth={2.5}
                          />
                        </button>

                      </div>

                    </div>
                  </div>
                ))}

              </div>
            </div>

            {/* Payment + Calculation */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

              {/* Payment */}
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

                      <CustomDatePicker
                        control={control}
                        name="invoice.duePaymentDate"
                        placeholder="বাকি পরিশোধের তারিখ লিখুন"
                        label="বাকি পরিশোধের তারিখ লিখুন"
                        disablePastDates
                        rules={{
                          required:
                            "বাকি পরিশোধের তারিখ লিখুন",
                        }}
                      />

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

                  <div className="mt-3 flex items-center justify-between rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow">

                    <div>

                      <p className="text-sm font-semibold text-gray-700">
                        কাস্টমারকে SMS পাঠান
                      </p>

                      <p className="mt-0.5 text-xs text-gray-400">
                        চালান আপডেট হওয়ার পর SMS পাঠানো হবে
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

              {/* Calculation */}
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
                  />

                  <CustomInput
                    name="invoice.discount"
                    label="ছাড়"
                    placeholder="0"
                    register={register}
                    type="number"
                    error={errors.invoice?.discount}
                    rules={{
                      required: "ছাড় আবশ্যক",
                    }}
                  />

                  <CustomInput
                    name="invoice.carRent"
                    label="গাড়ি ভাড়া"
                    placeholder="৳ 0"
                    register={register}
                    type="number"
                    error={errors.invoice?.carRent}
                    rules={{
                      required: "গাড়ি ভাড়া আবশ্যক",
                    }}
                  />

                  <CustomInput
                    name="invoice.totalPrice"
                    label="মোট"
                    placeholder="৳ 0"
                    register={register}
                    type="number"
                    readonly
                    error={errors.invoice?.totalPrice}
                  />

                  <CustomInput
                    name="invoice.cash"
                    label="নগদ"
                    placeholder="৳ 0"
                    register={register}
                    type="number"
                    error={errors.invoice?.cash}
                    rules={{
                      required: "নগদ পরিমাণ আবশ্যক",
                    }}
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

            {/* Actions */}
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
                disabled={updateLoading}
                className="rounded-lg bg-[#039A63] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#028a58] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {updateLoading
                  ? "আপডেট হচ্ছে..."
                  : "আপডেট করুন"}
              </button>

            </div>

          </form>
        </div>
      )}
    </CustomModalBottom>
  );
};

export default UpdateChalanModal;