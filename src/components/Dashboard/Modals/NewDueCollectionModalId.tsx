"use client";
import { DatePicker } from "@/components/Others/DatePicker";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import SmsSwitch from "@/components/Reusable/SmsSwitch";
import { showToast } from "@/components/Toast/CustomToast";
import { TCustomer } from "@/interface/customer";
import { TDueCollection } from "@/interface/due";
import {
  useCollectionDueMutation,
  useGetCustomerDueQuery,
} from "@/redux/features/dueCollection.features";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id?: string
};


type TCustomerDue = {
  dueAmount: number,
  season: string,
} & TCustomer

const NewDueCollectionModalId = ({ isOpen, onClose, id }: TCustomModal) => {
  const [collectionDue, { isLoading }] = useCollectionDueMutation();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sendSms, setSendSms] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TDueCollection>({
    defaultValues: {},
  });


  const { data, isFetching, isError } = useGetCustomerDueQuery(
    id!,
    {
      skip: !id,
      refetchOnMountOrArgChange: true,
    }
  );


  const collect = watch("collect");
  const customer = data?.data as TCustomerDue
  const due = customer?.dueAmount;
  const newDue = useMemo(() => due - (Number(collect) || 0), [due, collect]) || 0;
  // Populate customer info when data loads
  useEffect(() => {
    if (isError) {
      reset();
      setDate(undefined);
      return;
    }
    if (!data?.data) return;
    reset((prev) => ({
      ...prev,
      customerId: data.data?.customerCode as any,
      name: data.data.name || "",
      address: data.data.address || "",
      due: customer?.dueAmount,
      season: customer?.season,
    }));
  }, [data?.data, isError, reset, id]);

  const onSubmit: SubmitHandler<TDueCollection> = async (data) => {
    const payload = {
      newDue: newDue,
      nextDate: date,
      collect: Number(data.collect),
      due: Number(data.due),
      customerId: data.customerId
    }
    if (newDue <= 0) {
      return showToast({
        title: "বকেয়ার পরিমাণ ০ বা তার কম।",
        type: "error",
        options: {
          icon: <RiErrorWarningFill />,
          duration: 4000,
        },
      });
    }
    const check = payload.due > payload.collect;
    try {
      if (!payload.nextDate && check) {
        return showToast({
          title: "নতুন তারিখ সেট করুন",
          type: "info",
          options: {
            icon: <RiErrorWarningFill />,
            duration: 4000,
          },
        });
      }
      const result = await collectionDue(payload).unwrap();
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      return showToast({
        title: error.data?.message,
        type: "success",
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
      title="বাকি জমা 😍"
      width="xxl"
    >
      <div className="relative">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-green-50 text-[#039A63]">
                <span className="text-base font-bold">৳</span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  কাস্টমার তথ্য
                </h3>
                <p className="text-[11px] text-gray-500">
                  বাকি জমার জন্য কাস্টমারের তথ্য
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
                rules={{ required: "কাস্টমার আইডি" }}
                error={errors.customerId}
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

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  বাকি জমার তথ্য
                </h3>
                <p className="text-[11px] text-gray-500">
                  জমার পর নতুন বাকি হিসাব হবে
                </p>
              </div>

              <div className="rounded-md bg-red-50 px-2 py-1 text-[11px] font-semibold text-red-600">
                বাকি হিসাব
              </div>
            </div>

            <div className="grid gap-2 grid-cols-3">
              <div className="rounded-lg border border-red-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500">
                    মোট বাকি
                  </span>

                  <span className="rounded bg-red-50 px-1.5 py-0.5 text-[10px] text-red-500">
                    বাকি
                  </span>
                </div>

                <CustomInput
                  name="due"
                  label=""
                  placeholder="৳ মোট বাকি"
                  register={register}
                  readonly
                  type="number"
                />
              </div>

              <div className="rounded-lg border border-green-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500">
                    আজকের জমা
                  </span>

                  <span className="rounded bg-green-50 px-1.5 py-0.5 text-[10px] text-green-600">
                    জমা
                  </span>
                </div>

                <CustomInput
                  name="collect"
                  label=""
                  placeholder="৳ আজকের জমা"
                  register={register}
                  type="number"
                  rules={{ required: "আজকের জমা লিখুন" }}
                  error={errors.collect}
                />
              </div>

              <div className="rounded-lg border border-orange-100 bg-white p-2.5 shadow-sm">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-gray-500">
                    নতুন বাকি
                  </span>

                  <span className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] text-orange-600">
                    অবশিষ্ট
                  </span>
                </div>

                <div className="flex h-[42px] items-center justify-center rounded-md border border-orange-100 bg-orange-50/40">
                  {id && newDue !== undefined ? (
                    <p className="text-2xl font-bold tracking-tight text-red-600">
                      ৳ {newDue}
                    </p>
                  ) : (
                    <span className="text-xs text-gray-400">
                      নতুন বাকি
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-2 grid  gap-2 grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-white p-2.5">
                <CustomDatePickerState
                  height="8"
                  onChange={setDate}
                  value={date}
                  label="পরবর্তী পরিশোধের তারিখ"
                  placeholder="পরবর্তী তারিখ নির্বাচন করুন"
                />
              </div>

              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                <div>
                  <p className="text-xs font-semibold text-gray-700">
                    কাস্টমারকে এসএমএস
                  </p>

                  <p className="mt-0.5 text-[10px] text-gray-400">
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

          <div className="flex w-full gap-2 border-t border-gray-200 pt-3  sm:justify-between">
            <button
              disabled={isLoading}
              type="button"
              onClick={() => {
                setDate(undefined);
                reset((prev) => ({
                  ...prev,
                  customerId: "",
                  name: "",
                  address: "",
                  due: "",
                  season: "",
                  collect: "",
                }));
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-1.5 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 cursor-pointer"
            >
              ক্লিয়ার
            </button>

            <button
              disabled={isLoading}
              type="submit"
              className="disabled:cursor-default disabled:bg-gray-600 w-full rounded-lg bg-[#039A63] px-7 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#028a58] active:scale-[0.98] cursor-pointer"
            >
              বাকি জমা করুন
            </button>
          </div>
        </form>

        {isFetching && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]">
            <div className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-md">
              কাস্টমারের তথ্য লোড হচ্ছে...
            </div>
          </div>
        )}
      </div>
    </CustomModalBottom>
  );
};

export default NewDueCollectionModalId;
