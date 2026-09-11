import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateFolderMutation } from "@/redux/features/document.features";
import { CheckCircle } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TFolder = {
    name: string
}
export default function CreateFolderModal({ isOpen, onClose }: TCustomModal) {
    const [mutateAsync, { isLoading }] = useCreateFolderMutation()
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<TFolder>();

    const onSubmit: SubmitHandler<TFolder> = async (data) => {
        try {
            const result = await mutateAsync(data).unwrap()
            if (result?.success) {
                onClose()
                showToast({
                    title: result?.message,
                    type: "success",
                    options: {
                        icon: <CheckCircle />
                    }
                })
            }
        } catch (error: any) {
            console.log(error);
            showToast({
                title: error?.data?.message,
                type: "success",

            })
        }
    }

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="নতুন ফোল্ডার"
            width="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <CustomInput
                    name="name"
                    label="ফোল্ডারের নাম"
                    placeholder="ফোল্ডারের নাম"
                    register={register}
                    type="text"
                    rules={{ required: "ফোল্ডারের নাম লিখুন" }}
                    error={errors?.name}
                />

                <div className="flex items-center justify-between gap-4 pt-5 w-full">
                    <button
                        onClick={onClose}
                        type="button"
                        className="w-full cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                    >
                        বাতিল
                    </button>

                    <button
                        disabled={isLoading}
                        type="submit"
                        className="w-full disabled:bg-gray-500 cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100"
                    >
                        সেভ করুন
                    </button>
                </div>
            </form>
        </CustomModal>
    )
}
