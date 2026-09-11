"use client";

import { useEffect, useState } from "react";

import { SubmitHandler, useForm } from "react-hook-form";

import {
  CalendarDays,
  Car,
  FileText,
  Package,
  Search,
  Truck,
  UserRound,
  X,
} from "lucide-react";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import { Input } from "@/components/ui/input";
import SmsSwitch from "@/components/Reusable/SmsSwitch";

import {
  useLazyGetSingleInvoiceQuery,
  useSearchInvoiceForDeliveryQuery,
} from "@/redux/features/invoice.features";

import CustomSelect from "@/components/Reusable/CustomSelect";

import {
  useCreateDeliveryMutation,
  useGetNextDeliveryNoQuery,
} from "@/redux/features/delivery.features";

import { showToast } from "@/components/Toast/CustomToast";

import { RiErrorWarningFill } from "react-icons/ri";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError, MdSms } from "react-icons/md";

import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { useGetDriverOptionsQuery } from "@/redux/features/driver.features";
import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { TDriver } from "@/interface/driver";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TDeliveryItem = {
  id: string;
  class: string;
  quantity: number;
  delivered: number;
  deliveryDate?: string;
};

type TCustomer = {
  name?: string;
  address?: string;
  customerCode?: string;
  phoneNumber?: string;
};

type TSearchResult = {
  createdAt?: string;
  customer?: TCustomer;
  items?: TDeliveryItem[];
  note?: string;
  serial?: number;
};

type TDelivery = {
  deliveryNo: string;
  invoiceId: number | string;
  deliveryDate: Date | undefined;
  nextDeliveryDate: Date | undefined;

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
};

const NewDeliveryModalForInput = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [nextDeliveryDate, setNextDeliveryDate] =
    useState<Date | undefined>();

  const [sendSms, setSendSms] = useState(false);

  const [date, setDate] = useState<Date | undefined>(
    new Date(),
  );

  const [saveType, setSaveType] = useState("");

  const [customerSearch, setCustomerSearch] =
    useState("");

  const [searchTriggered, setSearchTriggered] =
    useState(false);

  const [selectedCustomer, setSelectedCustomer] =
    useState<TSearchResult | null>(null);

  const [
    createDelivery,
    { isLoading: createDeliveryLoading },
  ] = useCreateDeliveryMutation();

  const {
    data: nextDeliveryNo,
    isLoading: deliveryNoLoading,
  } = useGetNextDeliveryNoQuery(undefined);

  const { data: drivers, isLoading: driverLoading, isError: driverError } =
    useGetDriverOptionsQuery(undefined)




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
      invoiceId: "",
    },
  });

  const {
    data: customerSearchData,
    isFetching: customerSearchLoading,
  } = useSearchInvoiceForDeliveryQuery(
    {
      search: customerSearch,
    },
    {
      skip:
        !searchTriggered ||
        customerSearch.trim().length < 2,
    },
  );

  const searchResults: TSearchResult[] =
    customerSearchData?.data || [];

  const targetClass = watch("items.class");
  const driverId = watch("driverId");

  // FOR DRIVER=====================================================
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


  const deliveryToday = Number(
    watch("items.todaysDelivery") || 0,
  );

  const willReceiveDelivery = Number(
    watch("items.quantity") || 0,
  );


  const customerItems =
    selectedCustomer?.items ||
    [];

  const itemOptions = customerItems.map(
    (item: TDeliveryItem) => ({
      label: item.class,
      value: item.class,
    }),
  );

  const selectedItem = customerItems.find(
    (item: TDeliveryItem) =>
      item.class === targetClass,
  );

  const getRemainingQuantity = (
    item?: TDeliveryItem,
  ) => {
    if (!item) return 0;

    return Math.max(
      Number(item.quantity || 0) -
      Number(item.delivered || 0),
      0,
    );
  };

  const handleSearch = () => {
    const value = customerSearch.trim();

    if (value.length < 2) {
      setSearchTriggered(false);
      return;
    }

    setSearchTriggered(true);
  };

  const handleSelectCustomer = (
    result: TSearchResult,
  ) => {
    const customer = result.customer;
    const items = result.items || [];
    const firstItem = items[0];

    setSelectedCustomer(result);
    setCustomerSearch("");
    setSearchTriggered(false);

    setValue(
      "invoiceId",
      result?.serial || "",
    );
    setValue(
      "customer.name",
      customer?.name || "",
    );

    setValue(
      "customer.phoneNumber",
      customer?.phoneNumber || "",
    );

    setValue(
      "customer.address",
      customer?.address || "",
    );

    setValue(
      "note",
      result.note || "",
    );

    setValue(
      "items.class",
      firstItem?.class || "",
    );

    const remainingQuantity =
      getRemainingQuantity(firstItem);

    setValue(
      "items.quantity",
      remainingQuantity,
    );

    setValue(
      "items.todaysDelivery",
      0,
    );

    setValue(
      "items.remainingDelivery",
      remainingQuantity,
    );
  };

  useEffect(() => {
    if (!selectedItem) {
      return;
    }

    const remainingQuantity =
      getRemainingQuantity(selectedItem);

    setValue(
      "items.quantity",
      remainingQuantity,
    );

    setValue(
      "items.remainingDelivery",
      Math.max(
        remainingQuantity - deliveryToday,
        0,
      ),
    );
  }, [
    targetClass,
    selectedItem?.id,
    selectedItem?.quantity,
    selectedItem?.delivered,
    setValue,
  ]);

  useEffect(() => {
    if (!selectedItem) return;

    setValue(
      "items.remainingDelivery",
      Math.max(
        willReceiveDelivery - deliveryToday,
        0,
      ),
    );
  }, [
    deliveryToday,
    willReceiveDelivery,
    selectedItem,
    setValue,
  ]);

  // useEffect(() => {
  //   if (!invoiceData?.data) return;

  //   const firstItem =
  //     invoiceData.data.items?.[0];

  //   const remainingQuantity = Math.max(
  //     Number(firstItem?.quantity || 0) -
  //     Number(firstItem?.delivered || 0),
  //     0,
  //   );

  //   setValue(
  //     "customer.name",
  //     invoiceData.data.customer?.name || "",
  //   );

  //   setValue(
  //     "customer.phoneNumber",
  //     invoiceData.data.customer?.phoneNumber ||
  //     "",
  //   );

  //   setValue(
  //     "customer.address",
  //     invoiceData.data.customer?.address || "",
  //   );

  //   setValue(
  //     "items.class",
  //     firstItem?.class || "",
  //   );

  //   setValue(
  //     "items.quantity",
  //     remainingQuantity,
  //   );

  //   setValue(
  //     "items.todaysDelivery",
  //     0,
  //   );

  //   setValue(
  //     "items.remainingDelivery",
  //     remainingQuantity,
  //   );

  //   setValue(
  //     "note",
  //     invoiceData.data.note || "",
  //   );
  // }, [invoiceData, setValue]);

  // useEffect(() => {
  //   if (!invoiceId) return;

  //   const invoiceNumber = Number(invoiceId);

  //   if (!Number.isNaN(invoiceNumber)) {
  //     getSingleInvoice(invoiceNumber);
  //   }
  // }, [
  //   invoiceId,
  //   getSingleInvoice,
  // ]);

  useEffect(() => {
    if (nextDeliveryNo?.data) {
      setValue(
        "deliveryNo",
        nextDeliveryNo.data,
      );
    }
  }, [
    nextDeliveryNo?.data,
    setValue,
  ]);

  const onSubmit: SubmitHandler<
    Partial<TDelivery>
  > = async (formData) => {
    formData.itemId =
      selectedItem?.id;

    formData.savingType =
      saveType;

    formData.deliveryDate =
      date;

    formData.nextDeliveryDate =
      nextDeliveryDate;

    if (formData.items) {
      formData.items.quantity =
        selectedItem?.quantity || 0;
    }

    if (
      Number(
        formData.items?.remainingDelivery || 0,
      ) > 0 &&
      !nextDeliveryDate
    ) {
      return showToast({
        title:
          "পরবর্তী ডেলিভারি ডেট সেট করুন",
        type: "info",
        options: {
          icon: (
            <RiErrorWarningFill />
          ),
          duration: 4000,
        },
      });
    }

    try {
      const result =
        await createDelivery(
          formData,
        ).unwrap();

      if (result?.success) {
        onClose();

        return showToast({
          title: result?.message,
          type: "success",
          options: {
            icon: (
              <FaCircleCheck className="h-5 w-5" />
            ),
            duration: 4000,
          },
        });
      }
    } catch (error: any) {
      return showToast({
        title:
          error?.data?.message ||
          "Something went wrong",
        type: "error",
        options: {
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
          duration: 4000,
        },
      });
    }
  };

  const handleClear = () => {
    setCustomerSearch("");
    setSearchTriggered(false);
    setSelectedCustomer(null);

    reset({
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

      deliveryNo:
        nextDeliveryNo?.data || "",

      invoiceId: "",
    });

    setDate(new Date());
    setNextDeliveryDate(undefined);
  };

  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন ডেলিভারি 🚚"
      width="xxl"
    >
      <div className="relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* =====================================================
              SEARCH SECTION
          ===================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#039A63]/10 text-[#039A63]">
                <Search size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  চালান / কাস্টমার খুঁজুন
                </h3>

                <p className="text-[11px] text-gray-400">
                  নাম, ফোন নম্বর অথবা কাস্টমার কোড দিয়ে সার্চ করুন
                </p>
              </div>
            </div>

            <div className="relative p-4">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => {
                      setCustomerSearch(e.target.value);
                      setSearchTriggered(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                      }
                    }}
                    placeholder="নাম / ফোন নম্বর / কাস্টমার কোড"
                    className="h-9 w-full rounded-lg border border-gray-200 bg-white pl-9 pr-9 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#039A63] focus:ring-1 focus:ring-[#039A63]/10"
                  />

                  {customerSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setCustomerSearch("");
                        setSearchTriggered(false);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleSearch}
                  disabled={
                    customerSearchLoading ||
                    customerSearch.trim().length < 2
                  }
                  className="h-9 rounded-lg bg-[#039A63] px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-[#028a58] disabled:cursor-not-allowed disabled:opacity-50 sm:shrink-0"
                >
                  {customerSearchLoading ? "খোঁজা হচ্ছে..." : "সার্চ"}
                </button>
              </div>

              {/* SEARCH RESULT */}

              {searchTriggered && (
                <div className="absolute left-4 right-4 top-[calc(100%-8px)] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl">
                  {customerSearchLoading && (
                    <div className="flex items-center gap-2 px-4 py-4 text-sm text-gray-500">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#039A63]" />
                      কাস্টমার খোঁজা হচ্ছে...
                    </div>
                  )}

                  {!customerSearchLoading &&
                    searchResults.length === 0 && (
                      <div className="px-4 py-6 text-center">
                        <Search
                          size={25}
                          className="mx-auto mb-2 text-gray-300"
                        />

                        <p className="text-sm font-medium text-gray-600">
                          কোনো কাস্টমার পাওয়া যায়নি
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          অন্য তথ্য দিয়ে আবার চেষ্টা করুন
                        </p>
                      </div>
                    )}

                  {!customerSearchLoading &&
                    searchResults.length > 0 && (
                      <div className="max-h-80 overflow-y-auto">
                        {searchResults.map(
                          (
                            result: TSearchResult,
                            index: number,
                          ) => {
                            const customer =
                              result.customer;

                            const items =
                              result.items || [];

                            return (
                              <button
                                type="button"
                                key={`${result.serial || "customer"}-${index}`}
                                onClick={() =>
                                  handleSelectCustomer(
                                    result,
                                  )
                                }
                                className="w-full border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-green-50"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex min-w-0 items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#039A63]">
                                      <UserRound size={17} />
                                    </div>

                                    <div className="min-w-0">
                                      <p className="truncate text-sm font-semibold text-gray-800">
                                        {customer?.name ||
                                          "নাম নেই"}
                                      </p>

                                      <p className="mt-0.5 text-xs text-gray-500">
                                        {customer?.phoneNumber ||
                                          "ফোন নেই"}
                                      </p>

                                      <p className="mt-1 truncate text-[11px] text-gray-400">
                                        {customer?.address ||
                                          "ঠিকানা নেই"}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex shrink-0 flex-col items-end gap-1">
                                    {customer?.customerCode && (
                                      <span className="rounded-full bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-600">
                                        {customer.customerCode}
                                      </span>
                                    )}

                                    {result.serial && (
                                      <span className="rounded-full bg-green-50 px-2 py-1 text-[10px] font-medium text-[#039A63]">
                                        চালান #{result.serial}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* ITEMS PREVIEW */}

                                {items.length > 0 && (
                                  <div className="mt-3 flex flex-wrap gap-1.5 pl-12">
                                    {items.map(
                                      (
                                        item,
                                        itemIndex,
                                      ) => {
                                        const remaining =
                                          getRemainingQuantity(
                                            item,
                                          );

                                        return (
                                          <span
                                            key={
                                              item.id ||
                                              itemIndex
                                            }
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[10px]"
                                          >
                                            <Package
                                              size={11}
                                              className="text-gray-400"
                                            />

                                            <span className="font-semibold text-gray-600">
                                              {item.class}
                                            </span>

                                            <span className="text-gray-300">
                                              |
                                            </span>

                                            <span className="text-gray-400">
                                              মোট{" "}
                                              {
                                                item.quantity
                                              }
                                            </span>

                                            <span className="font-semibold text-orange-600">
                                              বাকি{" "}
                                              {remaining}
                                            </span>
                                          </span>
                                        );
                                      },
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>

          {/* =====================================================
              BASIC DELIVERY INFORMATION
          ===================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <FileText size={18} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  ডেলিভারি তথ্য
                </h3>

                <p className="text-[11px] text-gray-400">
                  ডেলিভারির মূল তথ্য
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
              />

              <CustomInput
                name="invoiceId"
                label="চালান নং"
                placeholder="চালান নং"
                register={register}
                type="text"
                rules={{ required: "" }}
              />

              <div>
                <CustomDatePickerState
                  label="ডেলিভারি তারিখ"
                  onChange={setDate}
                  value={date}
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              CUSTOMER INFORMATION
          ===================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-[#039A63]">
                  <UserRound size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    কাস্টমারের তথ্য
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    নির্বাচিত চালান থেকে তথ্য
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-[#039A63]">
                Auto Filled
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              <CustomInput
                name="customer.name"
                label="কাস্টমারের নাম"
                placeholder="কাস্টমারের নাম"
                register={register}
                type="text"
                error={errors?.customer?.name}
                rules={{
                  required:
                    "কাস্টমারের নাম লিখুন",
                }}
              />

              <CustomInput
                name="customer.phoneNumber"
                label="ফোন নম্বর"
                placeholder="ফোন নম্বর"
                register={register}
                type="text"
                error={
                  errors?.customer
                    ?.phoneNumber
                }
                rules={{
                  required:
                    "ফোন নম্বর লিখুন",
                }}
              />

              <CustomInput
                name="customer.address"
                label="ডেলিভারি ঠিকানা"
                placeholder="ডেলিভারি ঠিকানা"
                register={register}
                type="text"
                error={
                  errors?.customer?.address
                }
                rules={{
                  required:
                    "ঠিকানা লিখুন",
                }}
              />
            </div>
          </div>

          {/* =====================================================
              NOTE + NEXT DELIVERY
          ===================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_280px] md:items-end">
              <CustomInput
                name="note"
                label="নোট"
                placeholder="চালানের নোট"
                register={register}
                type="text"
                rules={{ required: "" }}
              />

              <div>
                <CustomDatePickerState
                  label="পরবর্তী ডেলিভারি তারিখ"
                  value={nextDeliveryDate}
                  onChange={setNextDeliveryDate}
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              ITEMS
          ===================================================== */}

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                  <Package size={18} />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-800">
                    পণ্যের তথ্য
                  </h3>

                  <p className="text-[11px] text-gray-400">
                    চালান অনুযায়ী ডেলিভারি পরিমাণ
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-medium text-purple-600">
                Item Details
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <CustomSelect
                name="items.class"
                label="শ্রেণি"
                placeholder="শ্রেণি নির্বাচন করুন"
                control={control}
                options={itemOptions}
              />

              <CustomInput
                name="items.quantity"
                label="ডেলিভারি পাবে"
                placeholder="ডেলিভারি পাবে"
                register={register}
                type="number"
                readonly
                rules={{
                  required: "",
                }}
              />

              <CustomInput
                name="items.todaysDelivery"
                label="আজকের ডেলিভারি"
                placeholder="আজকের ডেলিভারি"
                register={register}
                type="number"
                rules={{
                  required: "",
                  min: {
                    value: 0,
                    message:
                      "সঠিক পরিমাণ দিন",
                  },
                  validate: (
                    value,
                  ) =>
                    Number(value || 0) <=
                    willReceiveDelivery ||
                    "ডেলিভারি পাওয়ার পরিমাণের বেশি দেওয়া যাবে না",
                }}
              />

              <CustomInput
                name="items.remainingDelivery"
                label="ডেলিভারি বাকি"
                placeholder="ডেলিভারি বাকি"
                register={register}
                type="number"
                readonly
                rules={{
                  required: "",
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            {/* Vehicle & Driver Information */}
            <div className="rounded-2xl border  border-gray-200 bg-white shadow-sm">
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
                      onClick={handleClear}
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
        {
          deliveryNoLoading || driverLoading && (
            <div className="absolute inset-0 z-40 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-[2px]">
              <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-lg">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#039A63]" />

                <span className="text-sm font-medium text-gray-600">
                  তথ্য লোড হচ্ছে...
                </span>
              </div>
            </div>
          )}
      </div>
    </CustomModalBottom>
  );
};

export default NewDeliveryModalForInput;