"use client";

import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import SmsSwitch from "@/components/Reusable/SmsSwitch";
import { showToast } from "@/components/Toast/CustomToast";
import {
  useGetSingleDueQuery,
  useUpdateDueCollectionMutation,
} from "@/redux/features/dueCollection.features";
import { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError, MdPayments } from "react-icons/md";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: string;
};

type TDueCollection = {
  customerCode: string;
  name: string;
  address: string;
  season: string;
  due: number | string;
  collect?: number | string;
  newDue?: number;
  nextDate?: Date;
  invoiceId: number;
};

const UpdateDueCollection = ({
  isOpen,
  onClose,
  id,
}: TCustomModal) => {
  const { isLoading, data } = useGetSingleDueQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [updateDueCollection, { isLoading: updateLoading }] =
    useUpdateDueCollectionMutation();

  const [date, setDate] = useState<Date | undefined>();
  const [sendSms, setSendSms] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TDueCollection>({
    defaultValues: {},
  });

  const collect = watch("collect");

  useEffect(() => {
    if (!data?.data) return;

    reset({
      name: data.data.customer?.name,
      address: data.data.customer?.address,
      customerCode: data.data.customer?.customerCode,
      due: data.data.due,
      collect: data.data.collect,
      season: data.data.season?.name,
    });

    setDate(
      data.data.nextDate ? new Date(data.data.nextDate) : undefined,
    );
  }, [data, reset]);

  const newDue = useMemo(
    () =>
      Math.max(
        Number(data?.data?.due || 0) - (Number(collect) || 0),
        0,
      ),
    [data?.data?.due, collect],
  );

  const onSubmit: SubmitHandler<TDueCollection> = async (formData) => {
    formData.newDue = newDue;
    formData.nextDate = date;

    try {
      const result = await updateDueCollection({
        payload: formData,
        id,
      }).unwrap();

      if (result?.success) {
        onClose();
        reset();

        showToast({
          title: result?.message,
          type: "success",
          options: {
            duration: 4000,
            icon: <FaCircleCheck className="h-5 w-5" />,
          },
        });
      }
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "দুঃখিত! বাকি আপডেট করা যায়নি",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }
  };

  const handleClear = () => {
    setDate(undefined)
    reset({
      customerCode: data?.data?.customer?.customerCode || "",
      name: data?.data?.customer?.name || "",
      address: data?.data?.customer?.address || "",
      season: data?.data?.season || "",
      due: data?.data?.due || "",
      collect: "",
    });
  };


  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="বাকি জমা (আপডেট) 😍"
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
                  বাকি জমার তথ্য আপডেট করুন
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
              <CustomInput
                name="customerCode"
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

            <div className="grid  gap-2 grid-cols-3">
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
                  type="text"
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
                  type="text"
                  rules={{
                    required: "আজকের জমা লিখুন",
                    validate: (value) =>
                      Number(value) <= Number(data?.data?.due || 0) ||
                      "জমার পরিমাণ মোট বাকি থেকে বেশি হতে পারবে না",
                  }}
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
                    <p
                      className={`text-2xl font-bold tracking-tight ${newDue > 0 ? "text-red-600" : "text-[#039A63]"
                        }`}
                    >
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

            <div className="mt-2 grid gap-2 grid-cols-2">
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
                    আপডেটের পর SMS পাঠান
                  </p>
                </div>

                <SmsSwitch
                  sendSms={sendSms}
                  setSendSms={setSendSms}
                />
              </div>
            </div>
          </div>

          <div className="flex w-full gap-2 border-t border-gray-200 pt-3 justify-between">
            <button
              type="button"
              onClick={() => {
                setDate(
                  data?.data?.nextDate
                    ? new Date(data.data.nextDate)
                    : undefined
                );

                reset({
                  customerCode:
                    data?.data?.customer?.customerCode || "",
                  name: data?.data?.customer?.name || "",
                  address: data?.data?.customer?.address || "",
                  due: data?.data?.due || "",
                  collect: data?.data?.collect || "",
                  season: data?.data?.season || "",
                });
              }}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-1.5 text-sm font-medium text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 sm:w-auto"
            >
              রিসেট
            </button>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full rounded-lg bg-[#039A63] px-7 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#028a58] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-500 sm:w-auto"
            >
              {updateLoading ? "আপডেট হচ্ছে..." : "বাকি আপডেট করুন"}
            </button>
          </div>
        </form>

        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/60 backdrop-blur-[2px]">
            <div className="rounded-lg bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-md">
              তথ্য লোড হচ্ছে...
            </div>
          </div>
        )}
      </div>
    </CustomModalBottom>
  );
};

export default UpdateDueCollection;