"use client";
import { FaCircleCheck } from "react-icons/fa6";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateClassAndRateMutation } from "@/redux/features/classAndRate.features";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineError } from "react-icons/md";
import { TClassAndRate } from "@/types/types";
import CustomInput from "@/components/Reusable/CustomInput";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

const NewClassModal = ({ isOpen, onClose }: TCustomModal) => {
  const [mutateAsync, { isLoading }] = useCreateClassAndRateMutation();
  const { register, handleSubmit, control, reset,formState:{errors} } = useForm<TClassAndRate>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<TClassAndRate> = async (data) => {
    data.rate = Number(data.rate);
    try {
      const result = await mutateAsync(data).unwrap();
      if (result?.success) {
        onClose();
        return showToast({
          title: result?.message,
          type: "success",
          options: {
            duration: 4000,
            icon: <FaCircleCheck className="h-5 w-5" />,
          },
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
      return showToast({
        title:
          error?.data?.message ||
          "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
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
      title="শ্রেণি অ্যাড/আপডেট"
      width="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
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
            label="রেট"
            placeholder="রেট (৳)"
            register={register}
            type="text"
            error={errors.rate}
            rules={{
              required: "রেট লিখুন",
              validate: (value: string) => {
                const rate = Number(value);

                if (isNaN(rate)) {
                  return "সঠিক রেট লিখুন";
                }

                if (rate <= 0) {
                  return "রেট ০ এর চেয়ে বেশি হতে হবে";
                }

                return true;
              },
            }}
          />
        </div>

        <div className="flex items-center justify-between pt-5">
          <div
            onClick={() => reset()}
            className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
          >
            ক্লিয়ার
          </div>
          <button
            type="submit"
            className="text-[14px] disabled:bg-gray-500 bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer"
            disabled={isLoading}
          >
            {isLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default NewClassModal;
