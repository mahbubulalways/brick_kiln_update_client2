import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import {
    useGetSingleFolderNameQuery,
    useUpdateFolderNameMutation,
} from "@/redux/features/document.features";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string;
};

type TFolder = {
    name: string;
};

export default function UpdateFolderNameModal({
    isOpen,
    onClose,
    id,
}: TCustomModal) {
    const {
        data,
        isLoading: getLoading,
        isError,
    } = useGetSingleFolderNameQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    const [updateFolder, { isLoading ,error}] =
        useUpdateFolderNameMutation();
console.log(error);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TFolder>({
        defaultValues: {
            name: "",
        },
    });

    // API থেকে folder name আসলে input-এ বসাবে
    useEffect(() => {
        if (data?.data?.name) {
            reset({
                name: data.data.name,
            });
        }
    }, [data, reset]);

    const onSubmit: SubmitHandler<TFolder> = async (formData) => {
        const payload = {
            id,
            data: formData
        }
        try {
            const result = await updateFolder(payload).unwrap();

            if (result?.success) {
                onClose();

                showToast({
                    title:
                        result?.message ||
                        "ফোল্ডারের নাম সফলভাবে আপডেট হয়েছে।",
                    type: "success",
                    options: {
                        icon: <CheckCircle />,
                    },
                });
            }
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    "ফোল্ডারের নাম আপডেট করা যায়নি।",
                type: "error",
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="ফোল্ডারের নাম পরিবর্তন"
            width="sm"
        >
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full"
            >
                <CustomInput
                    name="name"
                    label="ফোল্ডারের নাম"
                    placeholder="ফোল্ডারের নাম"
                    register={register}
                    type="text"
                    rules={{
                        required: "ফোল্ডারের নাম লিখুন",
                    }}
                    error={errors?.name}
                />

                <div className="flex w-full items-center justify-between gap-4 pt-5">
                    <button
                        onClick={onClose}
                        type="button"
                        className="w-full cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                    >
                        বাতিল
                    </button>

                    <button
                        disabled={isLoading || getLoading}
                        type="submit"
                        className="w-full cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "আপডেট হচ্ছে..." : "সেভ করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
}