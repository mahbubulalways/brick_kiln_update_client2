"use client";
import { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { showToast } from "@/components/Toast/CustomToast";
import {
  useGetSingleClassAndRateQuery,
  useUpdateClassAndRateMutation,
} from "@/redux/features/classAndRate.features";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineError } from "react-icons/md";
import { TClassAndRate } from "@/types/types";
import CustomLoader from "@/components/Reusable/CustomLoader";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
};

const EditClassAndRateModal = ({ isOpen, onClose, id }: TCustomModal) => {
  const { data, isLoading } = useGetSingleClassAndRateQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [mutateAsync, { isLoading: updateLoading }] =
    useUpdateClassAndRateMutation();

  const { register, handleSubmit, control, reset } = useForm<TClassAndRate>({});

  useEffect(() => {
    if (data?.data) {
      reset({
        className: data?.data?.className || "",
        classType: data?.data?.classType || "",
        rate: data?.data?.rate || "",
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<TClassAndRate> = async (data) => {
    try {
      data.rate = Number(data.rate);
      const payload = {
        id: id,
        payload: data,
      };
      const result = await mutateAsync(payload).unwrap();
      if (result?.success) {
        showToast({
          title: "আপডেট সফল হয়েছে!",
          type: "success",
          options: {
            duration: 4000,
            icon: <FaCircleCheck className="h-5 w-5" />,
          },
        });
        onClose();
      }
    } catch (error) {
      showToast({
        title: "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="শ্রেণি আপডেট"
      width="sm"
    >
      {isLoading ? (
        <CustomLoader cls="h-[10vh]" />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <CustomSelect
              name="classType"
              label="শ্রেণির ধরণ"
              placeholder="ধরণ নির্বাচন করুন"
              control={control}
              options={[{label:"ইট",value:"ইট"},{label: "আধলা",value:"আধলা"},{label: "অন্যান্য",value:"অন্যান্য"}]}
            />

            <CustomInputLabel
              name="className"
              label="শ্রেণির নাম"
              placeholder="শ্রেণির নাম লিখুন"
              register={register}
              type="text"
            />

            <CustomInputLabel
              name="rate"
              label="রেট"
              placeholder="৳"
              register={register}
              type="text"
            />
          </div>

          <div className="flex items-center justify-between pt-5">
            <button
              type="submit"
              className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer w-full"
              disabled={updateLoading}
            >
              {updateLoading ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </div>
        </form>
      )}
    </CustomModal>
  );
};

export default EditClassAndRateModal;
