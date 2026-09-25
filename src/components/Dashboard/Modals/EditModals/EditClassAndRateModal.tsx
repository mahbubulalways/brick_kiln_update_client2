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
import CustomInput from "@/components/Reusable/CustomInput";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
};

const EditClassAndRateModal = ({ isOpen, onClose, id }: TCustomModal) => {
  const { data, isLoading, isError } = useGetSingleClassAndRateQuery(id, {
    refetchOnMountOrArgChange: true,
  });
  const [mutateAsync, { isLoading: updateLoading }] =
    useUpdateClassAndRateMutation();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TClassAndRate>({});

  useEffect(() => {
    if (data?.data) {
      reset({
        className: data?.data?.className || "",
        classType: data?.data?.classType || "",
        rate: data?.data?.rate || "",
        advanceRate: data?.data?.advanceRate || "",
      });
    }
  }, [data, reset]);

  const onSubmit: SubmitHandler<TClassAndRate> = async (data) => {
    try {
      data.rate = Number(data.rate);
      data.advanceRate = Number(data.advanceRate) || 0;
      const payload = {
        id: id,
        payload: data,
      };
      const result = await mutateAsync(payload).unwrap();
      if (result?.success) {
        showToast({
          title: result?.message || "আপডেট সফল হয়েছে!",
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
      width="lg"
    >
      {isLoading ? (
        <CustomStatus type="loading" />
      ) : isError ? <CustomStatus type="error" /> : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CustomSelect
              name="classType"
              label="শ্রেণির ধরণ"
              placeholder="শ্রেণির ধরণ"
              control={control}
              error={errors.classType}
              rules={{
                required: "শ্রেণির ধরণ নির্বাচন করুন",
              }}
              options={[
                {
                  label: "ইট",
                  value: "ইট",
                },
                {
                  label: "আধলা",
                  value: "আধলা",
                },
                {
                  label: "অন্যান্য",
                  value: "অন্যান্য",
                },
              ]}
            />

            <CustomInput
              name="className"
              label="শ্রেণির নাম"
              placeholder="শ্রেণির নাম"
              register={register}
              type="text"
              error={errors.className}
              rules={{
                required: "শ্রেণির নাম লিখুন",
                minLength: {
                  value: 2,
                  message: "শ্রেণির নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                },
                maxLength: {
                  value: 50,
                  message: "শ্রেণির নাম সর্বোচ্চ ৫০ অক্ষরের হতে হবে",
                },
              }}
            />

            <CustomInput
              name="rate"
              label="রেগুলার/সিজন রেট"
              placeholder="রেগুলার/সিজন রেট (৳)"
              register={register}
              type="text"
              error={errors.rate}
              rules={{
                required: "রেগুলার/সিজন রেট লিখুন",
                validate: (value: string) => {
                  const rate = Number(value);

                  if (isNaN(rate)) {
                    return "সঠিক রেগুলার/সিজন রেট লিখুন";
                  }

                  if (rate <= 0) {
                    return "রেগুলার/সিজন রেট ০ এর চেয়ে বেশি হতে হবে";
                  }

                  return true;
                },
              }}
            />

            <CustomInput
              name="advanceRate"
              label="আনসিজন রেট"
              placeholder="আনসিজন রেট (৳)"
              register={register}
              type="text"
              error={errors.advanceRate}
              rules={{
                required: "আনসিজন রেট লিখুন",
                validate: (value: string) => {
                  const rate = Number(value);

                  if (isNaN(rate)) {
                    return "সঠিক আনসিজন রেট লিখুন";
                  }

                  if (rate <= 0) {
                    return "আনসিজন রেট ০ এর চেয়ে বেশি হতে হবে";
                  }

                  return true;
                },
              }}
            />
          </div>

          <div className="flex items-center gap-2 w-full justify-between pt-5">
            <div
              onClick={() => reset({ advanceRate: "", className: "", classType: "", rate: "" })}
              className="text-[14px] border text-center w-full border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
            >
              ক্লিয়ার
            </div>
            <button
              type="submit"
              className="text-[14px] disabled:bg-gray-500 disabled:cursor-default  w-full bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer"
              disabled={isLoading}
            >
              {updateLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
            </button>
          </div>
        </form>
      )}
    </CustomModal>
  );
};

export default EditClassAndRateModal;
