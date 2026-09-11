"use client";
import { useState } from "react";
import CustomDatePickerState from "../Reusable/CustomDatePickerState";
import { useUpdateInvoiceDeliveryDateMutation } from "@/redux/features/invoice.features";
import { SubmitErrorHandler, useForm } from "react-hook-form";
import { showToast } from "../Toast/CustomToast";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

const UpdateInvoiceDate = ({ invoiceId, handleCloseModal }: { invoiceId: number; handleCloseModal: () => void }) => {
  const [newDeliveryDate, setNewDeliveryDate] = useState<Date | undefined>(
    new Date()
  );
  const { handleSubmit, } = useForm<any>({});
  const [updateInvoiceDeliveryDate, { isLoading }] = useUpdateInvoiceDeliveryDateMutation();

  const onSubmit: SubmitErrorHandler<any> = async () => {
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
      id: invoiceId,
    };

    try {
      const result = await updateInvoiceDeliveryDate(updatedData).unwrap();
      if (result?.success) {
        handleCloseModal()
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
      <div>
        <div className=" text-sm pt-2">
          <h1 className="text-orange-600 pt-2 pb-0.5 underline">সতর্কতাঃ</h1>
          <p className=" text-gray-500 text-xs">
            এই চালানের যদি আরও শ্রেণির ইট ডেলিভারি বাকি থাকে তাহলে সেই ইটের
            ডেলিভারি তারিখ ও এটার সাথে পরিবর্তন হয়ে যাবে । তাই নিশ্চিত হয়ে তারিখ
            পরিবর্তন করুন ।
          </p>


        </div>
        <h1 className="pb-1 lg:pb-0.5 flex items-center text-sm font-medium text-gray-600 pt-8">
          নতুন ডেলিভারি তারিখ
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomDatePickerState value={newDeliveryDate} onChange={setNewDeliveryDate} />
        <div className="flex items-center gap-2 justify-end pt-8">
          <div
            //   onClick={() => reset()}
            className="text-sm border border-gray-300 bg-white hover:border-[#039A63] px-2 py-1 text-gray-500 duration-500 hover:text-[#039A63]  rounded cursor-pointer"
          >
            ক্লিয়ার
          </div>
          <button
            disabled={isLoading}
            className="bg-[#039A63] px-2 text-sm py-1 rounded text-white gap-2 cursor-pointer"
          >
            {isLoading ? "পরিবর্তন হচ্ছে..." : "পরিবর্তন"}
          </button>
        </div>
      </form>
    </div >
  );
};

export default UpdateInvoiceDate;
