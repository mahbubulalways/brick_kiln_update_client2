"use client";
import CustomModal from "@/components/Reusable/CustomModal";
import { useCreateClassAndRateMutation } from "@/redux/features/classAndRate.features";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useGetSingleDueDateQuery, useUpdateDueCollectionDateMutation } from "@/redux/features/dueCollection.features";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
type TForm = {
    date: Date,
    note: string,
}
type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string | undefined,
    setId: Dispatch<SetStateAction<string | undefined>>
};

const UpdateDuePayDateModal = ({ isOpen, onClose, id, setId }: TCustomModal) => {
    const [mutateAsync, { isLoading }] = useUpdateDueCollectionDateMutation();
    const { handleSubmit, control, formState: { errors } } = useForm<TForm>({})
    const onSubmit: SubmitHandler<TForm> = async (data) => {
        const payload = {
            id, data
        }
        try {
            const result = await mutateAsync(payload).unwrap();
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


    const handleClose = () => {
        setId(undefined)
        onClose()
    }

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="আপডেট তারিখ"
            width="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                <CustomDatePicker
                    control={control}
                    name="date"
                    placeholder="বাকি পরিশোধের তারিখ"
                    disablePastDates
                    error={errors.date}
                    rules={{ required: "বাকি পরিশোধের তারিখ পরিবর্তন" }}
                />


                <button
                    type="submit"
                    disabled={isLoading}
                    className="rounded-lg w-full bg-[#039A63] px-6 py-2 text-[14px] font-medium text-white shadow-sm transition-all duration-200 hover:bg-[#028653] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isLoading ? "পরিবর্তন হচ্ছে..." : "পরিবর্তন করুন"}
                </button>

            </form>
        </CustomModal >
    );
};

export default UpdateDuePayDateModal;
