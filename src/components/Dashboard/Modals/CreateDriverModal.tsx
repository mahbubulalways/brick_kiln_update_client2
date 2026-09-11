"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateDriverMutation } from "@/redux/features/driver.features";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TDriverForm = {
    name: string;
    PhoneNumber: string;
    salary: number;
};

const CreateDriverModal = ({ isOpen, onClose }: TCustomModal) => {
    const [mutateAsync, { isLoading }] = useCreateDriverMutation();

    const { register, handleSubmit, reset } = useForm<TDriverForm>({
        defaultValues: {
            name: "",
            PhoneNumber: "",
            salary: 0,
        },
    });

    const onSubmit: SubmitHandler<TDriverForm> = async (data) => {
        const payload = {
            name: data.name,
            PhoneNumber: data.PhoneNumber,
            salary: data.salary,
        };

        try {
            const result = await mutateAsync(payload).unwrap();

            showToast({
                title: result?.message || "ড্রাইভার সফলভাবে তৈরি হয়েছে",
                type: "success",
            });

            reset();
            onClose();
        } catch (error: any) {
            console.log(error)
            showToast({
                title:
                    error?.data?.message || "ড্রাইভার তৈরি করতে সমস্যা হয়েছে",
                type: "error",
            });
        }
    };

    const handleClear = () => {
        reset({
            name: "",
            PhoneNumber: "",
            salary: 0,
        });
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="নতুন ড্রাইভার"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full"
            >
                <div className="mb-5">
                    <label className="block text-[15px] font-semibold text-[#526078] mb-2">
                        ড্রাইভারের নাম
                    </label>

                    <CustomInput
                        name="name"
                        placeholder="ড্রাইভারের নাম লিখুন"
                        register={register}
                        type="text"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-[15px] font-semibold text-[#526078] mb-2">
                        ফোন নম্বর
                    </label>

                    <CustomInput
                        name="PhoneNumber"
                        placeholder="ফোন নম্বর লিখুন"
                        register={register}
                        type="text"
                    />
                </div>
                <CustomInput
                    name="salary"
                    placeholder="বেতন লিখুন"
                    register={register}
                    type="number"
                    label="মাসিক বেতন (৳)"
                />

                <div className="flex items-center gap-3 pt-3">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="
              px-6
              py-2
              cursor-pointer
              rounded-lg
              w-full
              border
              border-gray-300
              bg-white
              text-sm
              font-medium
              text-gray-600
              hover:bg-gray-50
            "
                    >
                        ক্লিয়ার
                    </button>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="
              px-6
              py-2
              cursor-pointer
              rounded-lg
              w-full
              text-sm
              font-medium
              text-white
              bg-[#039A63]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
                    >
                        {isLoading ? "সেভ হচ্ছে..." : "সেভ করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default CreateDriverModal;