"use client";

import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import SmsSwitch from "@/components/Reusable/SmsSwitch";
import { showToast } from "@/components/Toast/CustomToast";
import { TDueCollection } from "@/interface/due";
import {
  useCollectionDueMutation,
  useSearchCustomerForDeuQuery,
} from "@/redux/features/dueCollection.features";
import { useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import {
  MdOutlineError,
  MdSearch,
} from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TCustomerSearchResult = {
  id: string;
  customerCode: string;
  name: string;
  address: string;
  totalDue: number;
  season: string
};

const NewDueCollectionModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [collectionDue, { isLoading }] =
    useCollectionDueMutation();

  const [date, setDate] = useState<Date | undefined>(
    undefined
  );

  const [sendSms, setSendSms] = useState(false);

  const [searchCustomerId, setSearchCustomerId] =
    useState("");

  const [searchValue, setSearchValue] =
    useState("");

  const [showSearchResult, setShowSearchResult] =
    useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TDueCollection>({
    defaultValues: {
      customerId: "",
      name: "",
      address: "",
      due: "",
      collect: "",
    },
  });

  const customerId = watch("customerId");
  const collect = watch("collect");
  const due = Number(watch("due") || 0);

  const newDue = useMemo(() => {
    return due - (Number(collect) || 0);
  }, [due, collect]);

  const {
    data: searchData,
    isFetching: isSearching,
    isError: isSearchError,
    error: searchError,
  } = useSearchCustomerForDeuQuery({ search: searchValue }, {
    skip: !searchValue,
  });

  const customers: TCustomerSearchResult[] =
    searchData?.data || [];

  const handleCustomerSearch = () => {
    const value = searchCustomerId.trim();

    if (!value) {
      showToast({
        title: "কাস্টমার আইডি, নাম অথবা ঠিকানা লিখুন",
        type: "info",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 3000,
        },
      });
      return;
    }

    setSearchValue(value);
    setShowSearchResult(true);
  };

  const handleSelectCustomer = (
    customer: TCustomerSearchResult
  ) => {
    setValue("customerId", customer.customerCode);
    setValue("name", customer.name || "");
    setValue("address", customer.address || "");
    setValue("due", Number(customer.totalDue || 0));
    setValue("season", customer.season);
    setValue("collect", "");

    setSearchCustomerId(
      customer.customerCode || customer.id
    );

    setShowSearchResult(false);
  };

  const handleClear = () => {
    setSearchCustomerId("");
    setSearchValue("");
    setShowSearchResult(false);
    setDate(undefined);
    setSendSms(false);

    reset({
      customerId: "",
      name: "",
      address: "",
      due: "",
      collect: "",
    });
  };

  const handleClose = () => {
    setSearchCustomerId("");
    setSearchValue("");
    setShowSearchResult(false);
    setDate(undefined);
    setSendSms(false);

    reset({
      customerId: "",
      name: "",
      address: "",
      due: "",
      collect: "",
    });

    onClose();
  };

  const onSubmit: SubmitHandler<TDueCollection> = async (
    formData
  ) => {
    const collection = Number(formData.collect || 0);
    const currentDue = Number(formData.due || 0);

    if (!formData.customerId) {
      showToast({
        title: "প্রথমে কাস্টমার নির্বাচন করুন",
        type: "info",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 3000,
        },
      });
      return;
    }

    if (collection < 0) {
      showToast({
        title: "সঠিক জমার পরিমাণ লিখুন",
        type: "info",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 3000,
        },
      });
      return;
    }

    if (collection > currentDue) {
      showToast({
        title:
          "জমার পরিমাণ মোট বাকার চেয়ে বেশি হতে পারবে না",
        type: "error",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 4000,
        },
      });
      return;
    }

    const remainingDue = currentDue - collection;

    if (remainingDue > 0 && !date) {
      showToast({
        title: "নতুন তারিখ সেট করুন",
        type: "info",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 4000,
        },
      });
      return;
    }

    const payload = {
      ...formData,
      customerId: formData.customerId,
      due: currentDue,
      collect: collection,
      newDue: remainingDue,
      nextDate: date,
      sendSms,
    };

    try {
      const result =
        await collectionDue(payload).unwrap();

      if (result?.success) {
        handleClose();

        showToast({
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
      showToast({
        title:
          error?.data?.message ||
          "দুঃখিত! বাকি জমা নেওয়া যায়নি",
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

  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={handleClose}
      title="বাকি জমা 😍"
      width="xxl"
    >
      <div className="relative">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2.5"
        >
          {/* Customer Search */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-[#039A63]">
                <MdSearch size={19} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  কাস্টমার খুঁজুন
                </h3>

                <p className="text-xs text-gray-500">
                  আইডি, নাম অথবা ঠিকানা দিয়ে কাস্টমার খুঁজুন
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchCustomerId}
                    onChange={(e) => {
                      setSearchCustomerId(e.target.value);
                      setShowSearchResult(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleCustomerSearch();
                      }
                    }}
                    placeholder="কাস্টমার আইডি / নাম / ঠিকানা লিখুন"
                    className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#039A63] focus:ring-1 focus:ring-[#039A63]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCustomerSearch}
                  disabled={isSearching}
                  className="flex h-9 items-center justify-center gap-1.5 rounded-md bg-[#039A63] px-5 text-sm font-medium text-white transition hover:bg-[#028a58] disabled:cursor-not-allowed disabled:bg-gray-400"
                >
                  <MdSearch size={18} />

                  {isSearching ? "খুঁজছে..." : "সার্চ"}
                </button>
              </div>

              {/* Search Dropdown */}
              {showSearchResult && (
                <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  {isSearching ? (
                    <div className="flex h-20 items-center justify-center text-sm text-gray-500">
                      কাস্টমার খোঁজা হচ্ছে...
                    </div>
                  ) : isSearchError ? (
                    <div className="px-4 py-5 text-center text-sm text-red-500">
                      কাস্টমার খুঁজতে সমস্যা হয়েছে
                    </div>
                  ) : customers.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                      {customers.map((customer) => (
                        <button
                          key={customer.id}
                          type="button"
                          onClick={() =>
                            handleSelectCustomer(customer)
                          }
                          className="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-green-50"
                        >
                          {/* Left Side */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate text-sm font-semibold text-gray-800">
                                {customer.name || "নাম নেই"}
                              </p>

                              <span className="shrink-0 rounded bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                                {customer.customerCode ||
                                  customer.id}
                              </span>
                            </div>

                            <p className="mt-1 truncate text-xs text-gray-500">
                              {customer.address || "ঠিকানা নেই"}
                            </p>
                          </div>

                          {/* Right Side */}
                          <div className="shrink-0 rounded-md bg-red-50 px-3 py-2 text-right">
                            <p className="text-[11px] text-red-400">
                              মোট বাকি
                            </p>

                            <p className="text-base font-bold text-red-600">
                              ৳ {Number(customer.totalDue || 0)}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-6 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        কোনো কাস্টমার পাওয়া যায়নি
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        অন্য আইডি, নাম অথবা ঠিকানা দিয়ে চেষ্টা করুন
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-[#039A63]">
                <span className="text-base font-bold">৳</span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  কাস্টমার তথ্য
                </h3>

                <p className="text-xs text-gray-500">
                  নির্বাচিত কাস্টমারের তথ্য
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <CustomInput
                name="customerId"
                label="কাস্টমার আইডি"
                placeholder="কাস্টমার আইডি"
                register={register}
                type="text"
                readonly
              />

              <CustomInput
                name="name"
                label="কাস্টমারের নাম"
                placeholder="কাস্টমারের নাম"
                register={register}
                readonly
                type="text"
              />

              <CustomInput
                name="address"
                label="কাস্টমারের ঠিকানা"
                placeholder="কাস্টমারের ঠিকানা"
                register={register}
                readonly
                type="text"
              />

              <CustomInput
                name="season"
                label="সিজন"
                placeholder="সিজন"
                register={register}
                readonly
                type="text"
              />
            </div>
          </div>

          {/* Due Collection */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  বাকি জমার তথ্য
                </h3>

                <p className="text-xs text-gray-500">
                  জমার পর নতুন বাকি হিসাব হবে
                </p>
              </div>

              <div className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                বাকি হিসাব
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
              {/* Total Due */}
              <div className="rounded-lg border border-red-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    মোট বাকি
                  </span>

                  <span className="rounded bg-red-50 px-2 py-0.5 text-[11px] text-red-500">
                    বাকি
                  </span>
                </div>

                <CustomInput
                  name="due"
                  label=""
                  placeholder="৳ মোট বাকি"
                  register={register}
                  readonly
                  type="text"
                />
              </div>

              {/* Collection */}
              <div className="rounded-lg border border-green-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    আজকের জমা
                  </span>

                  <span className="rounded bg-green-50 px-2 py-0.5 text-[11px] text-green-600">
                    জমা
                  </span>
                </div>

                <CustomInput
                  name="collect"
                  label=""
                  placeholder="৳ আজকের জমা"
                  register={register}
                  type="text"
                  rules={{
                    required: "আজকের জমা লিখুন",
                  }}
                  error={errors.collect}
                />
              </div>

              {/* New Due */}
              <div className="rounded-lg border border-orange-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">
                    নতুন বাকি
                  </span>

                  <span className="rounded bg-orange-50 px-2 py-0.5 text-[11px] text-orange-600">
                    অবশিষ্ট
                  </span>
                </div>

                <div className="flex h-[42px] items-center justify-center rounded-md border border-orange-100 bg-orange-50/40">
                  {customerId ? (
                    <p className="text-2xl font-bold tracking-tight text-red-600">
                      ৳ {newDue < 0 ? 0 : newDue}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-400">
                      নতুন বাকি
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Date + SMS */}
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-2.5">
                <CustomDatePickerState
                  disablePastDates
                  height="8"
                  onChange={setDate}
                  value={date}
                  label="পরবর্তী পরিশোধের তারিখ"
                  placeholder="পরবর্তী তারিখ নির্বাচন করুন"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    কাস্টমারকে এসএমএস
                  </p>

                  <p className="mt-0.5 text-[11px] text-gray-400">
                    জমার পর SMS পাঠান
                  </p>
                </div>

                <SmsSwitch
                  sendSms={sendSms}
                  setSendSms={setSendSms}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex w-full justify-between gap-2 border-t border-gray-200 pt-2.5">
            <button
              type="button"
              onClick={handleClear}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500"
            >
              ক্লিয়ার
            </button>

            <button
              type="submit"
              disabled={isLoading || !customerId}
              className="w-full rounded-lg bg-[#039A63] px-7 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#028a58] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading
                ? "জমা হচ্ছে..."
                : "বাকি জমা করুন"}
            </button>
          </div>
        </form>
      </div>
    </CustomModalBottom>
  );
};

export default NewDueCollectionModal;