"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";

import { showToast } from "@/components/Toast/CustomToast";
import {
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "@/redux/features/user.features";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
};

type TSoftwareUserForm = {
  name: string;
  username: string;
  role: "OWNER" | "ADMIN" | "MANAGER";
};

const SoftwareUserUpdateModal = ({
  isOpen,
  onClose,
  userId,
}: TCustomModal) => {
  const {
    data,
    isLoading: isUserLoading,
    isError,
  } = useGetSingleUserQuery(userId!, {
    skip: !isOpen || !userId,
  });

  const [updateUser, { isLoading: isUpdating }] =
    useUpdateUserMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TSoftwareUserForm>({
    defaultValues: {
      name: "",
      username: "",
      role: "MANAGER",
    },
  });

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

  // Set fetched user data into form
  useEffect(() => {
    const user = data?.data;

    if (!user) return;

    reset({
      name: user.name ?? "",
      username: user.username ?? "",
      role: user.role,
    });
  }, [data, reset]);

  const onSubmit: SubmitHandler<TSoftwareUserForm> = async (formData) => {
    if (!userId) return;

    try {
      const result = await updateUser({
        id: userId,
        data: {
          name: formData.name,
          username: formData.username,
          role: formData.role,
        },
      }).unwrap();

      showToast({
        title: result?.message || "ইউজার সফলভাবে আপডেট হয়েছে।",
        type: "success",
      });

      reset();
      onClose();
    } catch (error: any) {
      showToast({
        title:
          error?.data?.message ||
          "ইউজার আপডেট করতে সমস্যা হয়েছে।",
        type: "error",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="ইউজার আপডেট"
      width="md"
    >
      {isUserLoading ? (
        <div className="flex h-40 items-center justify-center">
          <span className="text-sm text-gray-500">
            ইউজারের তথ্য লোড হচ্ছে...
          </span>
        </div>
      ) : isError ? (
        <div className="py-10 text-center text-sm text-red-500">
          ইউজারের তথ্য লোড করতে সমস্যা হয়েছে।
        </div>
      ) : (
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
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-5">
            <button
              type="button"
              onClick={handleClose}
              disabled={isUpdating}
              className="w-full cursor-pointer rounded border border-gray-300 bg-white px-6 py-2 text-[14px] font-medium text-gray-500 transition duration-300 hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-50"
            >
              বাতিল
            </button>

            <button
              type="submit"
              disabled={isUpdating || isUserLoading}
              className="w-full cursor-pointer rounded bg-[#039A63] px-6 py-2 text-[14px] font-medium text-gray-100 transition duration-300 hover:bg-[#028653] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "আপডেট হচ্ছে..." : "আপডেট করুন"}
            </button>
          </div>
        </form>
      )}
    </CustomModal>
  );
};

export default SoftwareUserUpdateModal;