"use client";

import { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import SmsSwitch from "@/components/Reusable/SmsSwitch";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";

import { Input } from "@/components/ui/input";

import { useLazyGetSingleInvoiceQuery } from "@/redux/features/invoice.features";
import {
  useCreateDeliveryMutation,
  useGetNextDeliveryNoQuery,
} from "@/redux/features/delivery.features";

import { IChallanItem } from "@/types/types";

import { showToast } from "@/components/Toast/CustomToast";
import { RiErrorWarningFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { Truck, UserRound, Car, CalendarDays, FileText } from "lucide-react";
import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { useGetDriverOptionsQuery } from "@/redux/features/driver.features";
import { TDriver } from "@/interface/driver";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  invoiceId: number;
};

type TDelivery = {
  deliveryNo: string;
  invoiceId: number;
  deliveryDate: Date;
  nextDeliveryDate: Date;
  customer: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  items: {
    class: string;
    quantity: number;
    todaysDelivery?: number;
    remainingDelivery?: number;
  };
  itemId?: string | number;
  carRent?: string;
  driverId?: string;
  driverMobileNumber?: string;
  carNo?: string;
  note?: string;
  savingType?: string;
  serial?: number;
};

const NewDeliveryModal = ({
  isOpen,
  onClose,
  invoiceId: invoId,
}: TCustomModal) => {
  const [nextDeliveryDate, setNextDeliveryDate] = useState<
    Date | undefined
  >();

  const [sendSms, setSendSms] = useState<boolean>(false);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const [saveType, setSaveType] = useState<string>("");

  const [createDelivery, { isLoading: createDeliveryLoading }] =
    useCreateDeliveryMutation();

  const { data: drivers, isLoading: driverLoading, isError: driverError } =
    useGetDriverOptionsQuery(undefined)

  const {
    data: nextDeliveryNo,
    isLoading: deliveryNoLoading,
  } = useGetNextDeliveryNoQuery(undefined);

  const [
    getSingleInvoice,
    {
      data,
      isLoading,
    },
  ] = useLazyGetSingleInvoiceQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<Partial<TDelivery>>({
    defaultValues: {
      invoiceId: 0,
      customer: {
        name: "",
        phoneNumber: "",
        address: "",
      },
      items: {
        class: "",
        quantity: 0,
        todaysDelivery: 0,
        remainingDelivery: 0,
      },
      note: "",
      deliveryNo: "",
    },
  });



  // FOR DRIVER=====================================================
  const driverId = watch("driverId");
  const formatDriver = formatLabelValuePair({
    data: drivers?.data,
    label: "name", value: "id"
  })
  const selectedDriver = drivers?.data?.find(
    (driver: TDriver) => driver.id === driverId
  );
  useEffect(() => {
    if (selectedDriver) {
      setValue(
        "driverMobileNumber",
        selectedDriver.PhoneNumber
      );
    } else {
      setValue("driverMobileNumber", "");
    }
  }, [selectedDriver, setValue]);


  const targetClass = watch("items.class");
  const deliveryToday = watch("items.todaysDelivery");
  const willReceiveDelivery = watch("items.quantity");
  const serial = watch("serial");

  const items = data?.data?.items;

  const itemName = items?.map((item: IChallanItem) => ({
    label: item?.class,
    value: item?.class,
  }));

  const selectedItem = data?.data?.items?.find(
    (item: IChallanItem) => item?.class === targetClass,
  );

  useEffect(() => {
    if (!data?.data) return;

    const firstItem = data.data.items?.[0];

    reset({
      serial: data?.data?.serial,

      customer: {
        name: data.data.customer?.name || "",
        phoneNumber: data.data.customer?.phoneNumber || "",
        address: data.data.customer?.address || "",
      },

      items: {
        class: firstItem?.class || "",

        quantity: Math.max(
          Number(firstItem?.quantity || 0) -
          Number(firstItem?.delivered || 0),
          0,
        ),

        todaysDelivery: 0,

        remainingDelivery: Math.max(
          Number(firstItem?.quantity || 0) -
          Number(firstItem?.delivered || 0),
          0,
        ),
      },

      note: data.data.note || "",

      deliveryNo: nextDeliveryNo?.data || "",
    });
  }, [data, reset, nextDeliveryNo?.data]);

  useEffect(() => {
    const id = invoId || serial;

    if (!id) return;

    getSingleInvoice(id);
  }, [invoId, serial, getSingleInvoice]);

  useEffect(() => {
    if (nextDeliveryNo?.data) {
      setValue("deliveryNo", nextDeliveryNo.data);
    }
  }, [nextDeliveryNo?.data, setValue]);

  useEffect(() => {
    setValue(
      "items.quantity",
      Math.max(
        Number(selectedItem?.quantity || 0) -
        Number(selectedItem?.delivered || 0),
        0,
      ),
    );

    setValue(
      "items.remainingDelivery",
      Number(willReceiveDelivery || 0) -
      Number(deliveryToday || 0),
    );
  }, [
    selectedItem?.quantity,
    selectedItem?.delivered,
    willReceiveDelivery,
    deliveryToday,
    setValue,
  ]);

  const onSubmit: SubmitHandler<Partial<TDelivery>> = async (
    formData,
  ) => {
    formData.itemId = selectedItem?.id;
    formData.savingType = saveType;
    formData.deliveryDate = date;
    formData.nextDeliveryDate = nextDeliveryDate;

    if (invoId) {
      formData.invoiceId = invoId;
    }

    (formData.items as IChallanItem).quantity =
      selectedItem?.quantity;

    if (
      Number(formData.items?.remainingDelivery || 0) > 0 &&
      !nextDeliveryDate
    ) {
      return showToast({
        title: "পরবর্তী ডেলিভারি ডেট সেট করুন",
        type: "info",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 4000,
        },
      });
    }

    try {
      const result = await createDelivery(formData).unwrap();

      if (result?.success) {
        onClose();

        return showToast({
          title: result?.message,
          type: "success",
          options: {
            icon: <FaCircleCheck className="h-5 w-5" />,
            duration: 4000,
          },
        });
      }
    } catch (error: any) {
      return showToast({
        title:
          error?.data?.message ||
          "ডেলিভারি তৈরি করা যায়নি",
        type: "error",
        options: {
          icon: <MdOutlineError className="h-5 w-5" />,
          duration: 4000,
        },
      });
    }
  };

  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন ডেলিভারি"
      width="xxl"
    >
      <div className="relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          {/* =====================================================
              DELIVERY INFORMATION
          ====================================================== */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-50 text-[#039A63]">
                <FileText size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  ডেলিভারি তথ্য
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  ডেলিভারি ও কাস্টমারের প্রাথমিক তথ্য
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                name="deliveryNo"
                label="ডেলিভারি নং"
                placeholder="ডেলিভারি নং"
                register={register}
                type="text"
                rules={{ required: "" }}
                readonly
              />

              <CustomInput
                name="serial"
                label="চালান নং"
                placeholder="চালান নং"
                register={register}
                type="text"
                readonly
                rules={{ required: "" }}
              />

              <CustomDatePickerState
                label="ডেলিভারি তারিখ"
                onChange={setDate}
                value={date}
              />

              <CustomInput
                name="customer.name"
                label="কাস্টমারের নাম"
                placeholder="কাস্টমারের নাম"
                register={register}
                type="text"
                readonly={data?.data?.customer}
                error={errors?.customer?.name}
                rules={{
                  required: "কাস্টমারের নাম লিখুন",
                }}
              />

              <CustomInput
                name="customer.phoneNumber"
                label="ফোন নম্বর"
                placeholder="ফোন নম্বর"
                register={register}
                type="text"
                readonly={data?.data?.customer}
                rules={{
                  required: "ফোন নম্বর লিখুন",
                }}
                error={errors?.customer?.phoneNumber}
              />

              <CustomInput
                name="customer.address"
                label="ডেলিভারি ঠিকানা"
                placeholder="ডেলিভারি ঠিকানা"
                register={register}
                type="text"
                readonly={data?.data?.customer}
                rules={{
                  required: "ঠিকানা লিখুন",
                }}
                error={errors?.customer?.address}
              />
            </div>
          </div>

          {/* =====================================================
              NOTE + NEXT DELIVERY
          ====================================================== */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <CustomInput
                name="note"
                label="নোট"
                placeholder="চালানের নোট"
                register={register}
                type="text"
                rules={{ required: "" }}
              />
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <CustomDatePickerState
                label="পরবর্তী ডেলিভারি তারিখ"
                disablePastDates
                value={nextDeliveryDate}
                onChange={setNextDeliveryDate}
              />
            </div>
          </div>

          {/* =====================================================
              DELIVERY ITEM
          ====================================================== */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <Truck size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  ডেলিভারি পরিমাণ
                </h3>

                <p className="mt-0.5 text-[11px] text-gray-400">
                  আজকের ডেলিভারি ও অবশিষ্ট পরিমাণ
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <CustomSelect
                name="items.class"
                label="শ্রেণি"
                placeholder="শ্রেণি নির্বাচন করুন"
                control={control}
                options={itemName || []}

              />

              <CustomInput
                name="items.quantity"
                label="ডেলিভারি পাবে"
                placeholder="ডেলিভারি পাবে"
                register={register}
                type="number"
                readonly
                rules={{ required: "" }}
              />

              <CustomInput
                name="items.todaysDelivery"
                label="আজকের ডেলিভারি"
                placeholder="আজকের ডেলিভারি"
                register={register}
                type="number"
                rules={{ required: "" }}
              />

              <CustomInput
                name="items.remainingDelivery"
                label="ডেলিভারি বাকি"
                placeholder="ডেলিভারি বাকি"
                register={register}
                type="number"
                readonly
                rules={{ required: "" }}
              />
            </div>
          </div>




          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto]">
            {/* Vehicle & Driver Information */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <Truck size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    গাড়ি ও ড্রাইভারের তথ্য
                  </h3>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    ডেলিভারি গাড়ি সম্পর্কিত তথ্য
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 p-4">
                {/* Driver Information */}
                <div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <CustomSelect
                      name="driverId"
                      label=""
                      placeholder="ড্রাইভারের নাম"
                      control={control}
                      options={formatDriver}
                      searchable
                    />

                    <CustomInput
                      name="driverMobileNumber"
                      label=""
                      placeholder="ড্রাইভারের ফোন নম্বর"
                      register={register}
                      type="text"
                    />

                    <CustomInput
                      name="carNumber"
                      label=""
                      placeholder="গাড়ি নম্বর"
                      register={register}
                      type="text"
                    />
                  </div>
                </div>

                {/* Bottom Information */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                  <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <div className="relative">
                      <CustomInput
                        type="number"
                        placeholder="গাড়ি ভাড়া লিখুন    ৳"
                        name="carRent"
                        register={register}
                      />
                    </div>

                    <div className="flex mt-1 items-center justify-between rounded-xl border border-gray-200 bg-white px-3 py-2.5">
                      <div>
                        <p className="text-xs font-semibold text-gray-700">
                          কাস্টমারকে এসএমএস দিন
                        </p>
                        <p className="mt-0.5 text-[10px] text-gray-400">
                          ডেলিভারি সম্পন্ন হলে এসএমএস পাঠানো হবে
                        </p>
                      </div>

                      <SmsSwitch
                        sendSms={sendSms}
                        setSendSms={setSendSms}
                        showBorder={false}
                        showLabel={false}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3">
                    <button
                      type="button"
                      // onClick={handleClear}
                      className="h-10 text-sm rounded-xl border border-gray-300 bg-white px-4  font-semibold text-gray-600 transition-all hover:border-[#039A63] hover:text-[#039A63] active:scale-[0.98]"
                    >
                      ক্লিয়ার
                    </button>

                    <button
                      type="submit"
                      onClick={() => setSaveType("saveAndCreate")}
                      disabled={createDeliveryLoading}
                      className="h-10 text-sm rounded-xl bg-[#039A63] px-4  font-semibold text-white shadow-sm transition-all hover:bg-[#028a58] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {createDeliveryLoading ? "সেভ হচ্ছে..." : "সেভ + নতুন"}
                    </button>

                  </div>
                </div>
              </div>
            </div>

          </div>


        </form>

        {(isLoading || deliveryNoLoading) && (
          <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]">
            <div className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-medium text-gray-600 shadow-lg">
              তথ্য লোড হচ্ছে...
            </div>
          </div>
        )}
      </div>
    </CustomModalBottom>
  );
};

export default NewDeliveryModal;