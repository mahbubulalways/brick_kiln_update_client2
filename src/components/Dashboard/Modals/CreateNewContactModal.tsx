"use client";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateNewContactMutation } from "@/redux/features/contact.,features";


type TContact = {
  name: string;
  address: string;
  occupation: string;
  phone: string;
};

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

const CreateNewContactModal = ({
  isOpen,
  onClose,
}: TCustomModal) => {
  const [createContact, { isLoading }] =
    useCreateNewContactMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TContact>({
    defaultValues: {
      name: "",
      address: "",
      occupation: "",
      phone: "",
    },
  });

  const onSubmit: SubmitHandler<TContact> = async (data) => {
    try {
      const result = await createContact(data).unwrap();

      if (result?.success) {
        reset();
        onClose();

        return showToast({
          title:
            result?.message ||
            "ফোন নম্বর সফলভাবে যোগ করা হয়েছে",
          type: "success",
          options: {
            duration: 4000,
            icon: (
              <FaCircleCheck className="h-5 w-5" />
            ),
          },
        });
      }

      return showToast({
        title: "ফোন নম্বর যোগ করা যায়নি",
        type: "error",
        options: {
          duration: 4000,
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);

      return showToast({
        title:
          error?.data.message ||
          "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
        type: "error",
        options: {
          duration: 4000,
          icon: (
            <MdOutlineError className="h-5 w-5" />
          ),
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
        <div className="flex flex-col gap-3">
          {/* Name */}
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

          {/* Address */}
          <CustomInput
            name="address"
            label="ঠিকানা"
            placeholder="ঠিকানা লিখুন"
            register={register}
            type="text"
            rules={{
              required: "ঠিকানা প্রদান করুন",
            }}
            error={errors.address}
          />

          {/* Occupation */}
          <CustomInput
            name="occupation"
            label="পেশা"
            placeholder="পেশা লিখুন"
            register={register}
            type="text"
            rules={{
              required: "পেশা প্রদান করুন",
            }}
            error={errors.occupation}
          />

          {/* Phone */}
          <CustomInput
            name="phone"
            label="ফোন নম্বর"
            placeholder="ফোন নম্বর লিখুন"
            register={register}
            type="text"
            rules={{
              required: "ফোন নম্বর প্রদান করুন",
            }}
            error={errors.phone}
          />
        </div>

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

export default CreateNewContactModal;