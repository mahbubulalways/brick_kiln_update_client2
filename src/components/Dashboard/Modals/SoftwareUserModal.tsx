"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "@/components/Toast/CustomToast";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { useCreateNewUserMutation } from "@/redux/features/user.features";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

type TSoftwareUserForm = {
  name: string;
  username: string;
  role: "OWNER" | "ADMIN" | "MANAGER";
  password: string;

};

const SoftwareUserModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [createUser, { isLoading }] = useCreateNewUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TSoftwareUserForm>();

  const userTypeOptions = [
    {
      label: "মালিক",
      value: "OWNER",
    },
    {
      label: "অ্যাডমিন",
      value: "ADMIN",
    },
    {
      label: "ম্যানেজার",
      value: "MANAGER",
    },
  ];

  const onSubmit: SubmitHandler<TSoftwareUserForm> = async (data) => {
    try {
      const result = await createUser({
        name: data.name,
        username: data.username,
        role: data.role,
        password: data.password,
      }).unwrap();

      showToast({
        title: result?.message || "ইউজার সফলভাবে তৈরি হয়েছে।",
        type: "success",
      });

      reset();
      onClose();
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "ইউজার তৈরি করতে সমস্যা হয়েছে।",
        type: "error",
      });
    }
  };



  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="নতুন ইউজার অ্যাড"
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-3">
          {/* Name */}
          <CustomInput
            name="name"
            label="নাম"
            placeholder="নাম লিখুন"
            register={register}
            type="text"
            error={errors.name}
            rules={{
              required: "নাম লিখুন",
            }}
          />

          {/* Username */}
          <CustomInput
            name="username"
            label="ইউজারনেম"
            placeholder="ইউজারনেম লিখুন"
            register={register}
            type="text"
            error={errors.username}
            rules={{
              required: "ইউজারনেম লিখুন",
            }}
          />

          {/* User Type */}
          <CustomSelect
            name="role"
            label="ইউজারের ধরন"
            control={control}
            options={userTypeOptions}
            placeholder="টাইপ সিলেক্ট করুন"
            error={errors.role}
            rules={{
              required: "ইউজারের ধরন নির্বাচন করুন",
            }}
          />

          {/* Password */}
          <CustomInput
            name="password"
            label="পাসওয়ার্ড"
            placeholder="পাসওয়ার্ড লিখুন"
            register={register}
            type="password"
            error={errors.password}
            rules={{
              required: "পাসওয়ার্ড লিখুন",
            }}
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between gap-3 pt-5">
          <button
            type="button"
            onClick={() => reset()}
            disabled={isLoading}
            className="w-full cursor-pointer rounded border border-gray-300 bg-white px-6 py-2 text-[14px] font-medium text-gray-500 transition duration-300 hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-50"
          >
            ক্লিয়ার
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded bg-[#039A63] px-6 py-2 text-[14px] font-medium text-gray-100 transition duration-300 hover:bg-[#028653] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default SoftwareUserModal;