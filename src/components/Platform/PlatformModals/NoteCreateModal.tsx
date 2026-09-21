"use client";

import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { showToast } from "@/components/Toast/CustomToast";

import {
    useCreateOrUpdateNoteApiMutation,
    useGetNoteQuery,
} from "@/redux/system.features/system.note.features";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TNote = {
    id?: string;
    message: string;
};

const NoteModal = ({ isOpen, onClose }: TCustomModal) => {
    const {
        data: noteData,
        isLoading: isNoteLoading,
        isError: isNoteError,
    } = useGetNoteQuery(undefined, {
        skip: !isOpen,
    });

    const [mutateAsync, { isLoading: isCreateLoading }] =
        useCreateOrUpdateNoteApiMutation();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<TNote>({
        defaultValues: {
            id: undefined,
            message: "",
        },
    });

    const noteInfo = noteData?.data;

    useEffect(() => {
        if (!isOpen) return;

        if (noteInfo) {
            reset({
                id: noteInfo.id,
                message: noteInfo.message ?? "",
            });
        } else {
            reset({
                id: undefined,
                message: "",
            });
        }
    }, [isOpen, noteInfo, reset]);

    const onSubmit: SubmitHandler<TNote> = async (data) => {
        try {
            const result = await mutateAsync({
                id: data.id,
                message: data.message,
            }).unwrap();

            if (result?.success) {
                onClose();

                showToast({
                    title: result.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }
        } catch (error: any) {
            ;

            showToast({
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

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="অ্যাডমিন নোট"
            width="md"
        >
            {isNoteLoading ? (
                <CustomLoader cls="h-[30vh]" />
            ) : isNoteError ? (
                <CustomStatus type="error" />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CustomTextArea
                        name="message"
                        register={register}
                    />

                    {errors.message && (
                        <p className="mt-1 text-xs text-red-500">
                            {errors.message.message}
                        </p>
                    )}

                    <div className="flex w-full items-center justify-between gap-2 pt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full cursor-pointer rounded border border-gray-300 bg-white px-8 py-1.5 text-center text-[14px] font-medium text-gray-500 duration-300 hover:border-[#039A63] hover:text-[#039A63]"
                        >
                            বাতিল
                        </button>

                        <button
                            type="submit"
                            disabled={isCreateLoading || isNoteLoading}
                            className="w-full cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {isCreateLoading
                                ? "সংরক্ষণ হচ্ছে..."
                                : "সংরক্ষণ করুন"}
                        </button>
                    </div>
                </form>
            )}
        </CustomModal>
    );
};

export default NoteModal;