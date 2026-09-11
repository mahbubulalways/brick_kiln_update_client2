"use client";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateNewGoodsCategoryMutation } from "@/redux/features/goods_stock_category.features";


type TAssetCategory = {
  name: string;

};

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateNewAssetsCategoryModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [createAssetCategory, { isLoading }] =
    useCreateNewGoodsCategoryMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TAssetCategory>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit: SubmitHandler<TAssetCategory> = async (data) => {
  try {
    const result = await createAssetCategory(data).unwrap();

    if (result?.success) {
      reset();
      onClose();

      return showToast({
        title:
          result?.message ||
          "মালামালের ক্যাটাগরি সফলভাবে যোগ করা হয়েছে",
        type: "success",
        options: {
          duration: 4000,
          icon: <FaCircleCheck className="h-5 w-5" />,
        },
      });
    }

    return showToast({
      title: "মালামালের ক্যাটাগরি যোগ করা যায়নি",
      type: "error",
      options: {
        duration: 4000,
        icon: <MdOutlineError className="h-5 w-5" />,
      },
    });
  } catch (error: any) {
    console.log(error);

    return showToast({
      title:
        error?.data?.message ||
        "দুঃখিত! মালামালের ক্যাটাগরি যোগ করতে সার্ভারে ত্রুটি হয়েছে",
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
      title="নতুন নম্বর যোগ করুন"
      width="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
       <CustomInput
            name="name"
            label="নাম"
            placeholder="নাম লিখুন"
            register={register}
            type="text"
            rules={{
              required: "নাম প্রদান করুন",
            }}
            error={errors.name}
          />
      

        {/* Buttons */}
        <div className="flex items-center justify-between pt-5">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
          >
            ক্লিয়ার
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading
              ? "অ্যাড হচ্ছে..."
              : "অ্যাড করুন"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default CreateNewAssetsCategoryModal;