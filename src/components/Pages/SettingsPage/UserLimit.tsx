"use client";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import { SubmitHandler, useForm } from "react-hook-form";

type TUserLimit = {
  oldPassword: string;
  newPassword: string;
};

const UserLimit = () => {
  const { register, handleSubmit } = useForm<TUserLimit>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<TUserLimit> = async (data) => {
    console.log(data);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <h1 className="text-xl font-semibold text-gray-900 py-3">
        ইউজার এর লিমিট
      </h1>

      {/* Wider Form Container */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-md">
        <div className="flex flex-col gap-3">
          <CustomInputLabel
            name="oldPassword"
            label=""
            placeholder="ইউজার সিলেক্ট করুন"
            register={register}
            readonly
            type="text"
          />
          <CustomInputLabel
            name="newPassword"
            label=""
            placeholder="লিমিটের ধরন"
            register={register}
            readonly
            type="text"
          />
          <CustomInputLabel
            name="newPassword"
            label=""
            placeholder="লিমিট বসান"
            register={register}
            readonly
            type="text"
          />
        </div>

        <button
          type="submit"
          className="text-[14px] bg-[#039A63] px-8 py-2 text-gray-100 font-medium rounded cursor-pointer mt-4 w-full hover:bg-[#027a4e] transition-all duration-200"
        >
          সেট লিমিট
        </button>
      </form>
    </div>
  );
};

export default UserLimit;
