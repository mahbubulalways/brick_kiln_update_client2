/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useState } from "react";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import CustomSelect from "../Reusable/CustomSelect";
import {
  useGetSingleInvoiceItemsQuery,
  useUpdateInvoiceItemDeliveryDateMutation,
} from "@/redux/features/invoice.features";
import CustomLoader from "../Reusable/CustomLoader";
import { IChallanItem } from "@/types/types";
import moment from "moment";
import { showToast } from "../Toast/CustomToast";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { getQueryIds } from "@/utils/getQueryIds";
import CustomDatePickerState from "../Reusable/CustomDatePickerState";

const UpdateItemDate = ({
  invoiceId,
  itemIds,
  handleCloseModal,
}: {
  invoiceId: number;
  itemIds: string[];
  handleCloseModal: () => void;
}) => {
  const ids = getQueryIds(itemIds);
  const { isLoading, data,error } = useGetSingleInvoiceItemsQuery({
    invoiceId,
    ids,
  });


  const { handleSubmit, control, reset, watch } = useForm<any>({});
  const [newDeliveryDate, setNewDeliveryDate] = useState<Date>();
  const [updateItemsDeliveryDate, { isLoading: updateLoading }] =
    useUpdateInvoiceItemDeliveryDateMutation();
  // eslint-disable-next-line react-hooks/incompatible-library
  const itemClass = watch("class");

  const filterClass = useMemo(() => {
    return data?.data?.map((item: IChallanItem) => item?.class) || [];
  }, [data]);

  // 🔥 Fix: Set default class so targetClass always exists
  useEffect(() => {
    if (filterClass?.length) {
      reset({ class: filterClass[0] });
    }
  }, [filterClass, reset]);


  const labelValue = filterClass?.map((cls: string) => ({ label: cls, value: cls })) || [];

  const targetClass = data?.data?.find(
    (item: IChallanItem) => item?.class == itemClass
  ) as IChallanItem;

  const onSubmit: SubmitErrorHandler<any> = async (data) => {
    if (!newDeliveryDate) {
      return showToast({
        title: "নতুন তারিখ সেট করুন",
        type: "info",
        options: {
          icon: <PiWarningCircleFill className="h-5 w-5" />,
        },
      });
    }
    const updatedData = {
      payload: {
        updatedDate: newDeliveryDate,
      },
      id: targetClass?.id,
    };

    try {
      const result = await updateItemsDeliveryDate(updatedData).unwrap();
      if (result?.success) {
        // handleCloseModal()
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
        title: error?.data?.message,
        type: "error",
        options: {
          icon: <MdOutlineError className="h-5 w-5" />,
          duration: 4000,
        },
      });
    }
  };
  return (
    <div>
      {isLoading ? (
        <>
          <CustomLoader cls="h-[20vh]" />
        </>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomSelect
            control={control}
            label="শ্রেণি নির্বাচন"
            name="class"
            options={labelValue}
          />

          <p className="text-sm pt-6 pb-7">
            বর্তমান ডেলিভারি তারিখ:{" "}
            <span className="text-orange-500">
              {targetClass?.deliveryDate &&
                moment(targetClass?.deliveryDate).format("DD-MM-YYYY",)}
            </span>
          </p>

          <div>
            <h1 className="pb-1 lg:pb-0.5 flex items-center text-sm font-medium text-gray-600">
              নতুন ডেলিভারি তারিখ
            </h1>
            <CustomDatePickerState value={newDeliveryDate} onChange={setNewDeliveryDate} placeholder="ডেলিভারি তারিখ"/>
          </div>
          <div className="flex items-center gap-2 justify-end pt-8">
            <div
              onClick={() => reset()}
              className="text-sm border border-gray-300 bg-white hover:border-[#039A63] px-2 py-1 text-gray-500 duration-500 hover:text-[#039A63]  rounded cursor-pointer"
            >
              ক্লিয়ার
            </div>
            <button
              disabled={updateLoading}
              className="bg-[#039A63] px-2 text-sm py-1 rounded text-white gap-2 cursor-pointer"
            >
              {updateLoading ? "পরিবর্তন হচ্ছে..." : "পরিবর্তন"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default UpdateItemDate;
