"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "@/components/Toast/CustomToast";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useCreateNewUserMutation } from "@/redux/features/user.features";
import { useCreateNewCarMutation } from "@/redux/features/car.features";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TNewCarCreate = {
  carNo: string;

};

const CreateNewCarModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [createNewCar, { isLoading }] = useCreateNewCarMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TNewCarCreate>();


  const onSubmit: SubmitHandler<TNewCarCreate> = async (data) => {
  try {
    const result = await createNewCar({
      carNo: data.carNo,
    }).unwrap();

    showToast({
      title: result?.message || "গাড়ি সফলভাবে তৈরি হয়েছে।",
      type: "success",
    });

    reset();
    onClose();
  } catch (error: any) {
    showToast({
      title:
        error?.data?.message ||
        "গাড়ি তৈরি করতে সমস্যা হয়েছে।",
      type: "error",
    });
  }
};



  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন গাড়ি অ্যাড"
      width="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          name="carNo"
          label="গাড়ির নাম"
          placeholder="গাড়ির নাম লিখুন"
          register={register}
          type="number"
          error={errors.carNo}
          rules={{
            required: "গাড়ির নাম লিখুন",
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-5 cursor-pointer rounded bg-[#039A63] px-6 py-2 text-[14px] font-medium text-gray-100 transition duration-300 hover:bg-[#028653] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
        </button>
      </form>
    </CustomModal>
  );
};

export default CreateNewCarModal;