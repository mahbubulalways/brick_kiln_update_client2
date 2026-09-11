"use client";

import { useEffect } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

import { showToast } from "@/components/Toast/CustomToast";

import { useGetUserOptionsQuery } from "@/redux/features/user.features";
import {
    useGetSingleTaskQuery,
    useUpdateTaskMutation,
} from "@/redux/features/task.features";

import { IUser } from "@/interface/user";


// ==========================================
// Task Type
// ==========================================
export type TTask = {
    description: string;
    repeat: string;
    userId: string;
    date: string;
};


// ==========================================
// Props
// ==========================================
type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    taskId: string | null;
};


// ==========================================
// Component
// ==========================================
const UpdateTaskModal = ({
    isOpen,
    onClose,
    taskId,
}: TCustomModal) => {

    // ==========================================
    // Update Mutation
    // ==========================================
    const [updateTask, { isLoading: taskLoading }] =
        useUpdateTaskMutation();


    // ==========================================
    // Get Single Task
    // ==========================================
    const {
        data: taskData,
        isLoading: singleTaskLoading,
        isError: singleTaskError,
    } = useGetSingleTaskQuery(taskId, {
        skip: !taskId || !isOpen,
    });


    // ==========================================
    // Get Users
    // ==========================================
    const {
        data: userData,
        isLoading: userLoading,
        isError: userError,
    } = useGetUserOptionsQuery(undefined);


    // ==========================================
    // Form
    // ==========================================
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TTask>({
        defaultValues: {
            description: "",
            repeat: "",
            userId: "",
            date: "",
        },
    });


    // ==========================================
    // User Options
    // ==========================================
    const labelValue = userData?.data?.map(
        (dt: IUser) => ({
            label: dt.name,
            value: dt.id,
        })
    );


    // ==========================================
    // Set Default Form Value
    // ==========================================
    useEffect(() => {
        if (!taskData?.data) return;

        const task = taskData.data;

        reset({
            description: task.description || "",
            repeat: task.repeat || "",
            userId: task.userId || task.user?.id || "",
            date: task.date
                ? new Date(task.date)
                      .toISOString()
                      .split("T")[0]
                : "",
        });
    }, [taskData, reset]);


    // ==========================================
    // Submit
    // ==========================================
    const onSubmit: SubmitHandler<TTask> = async (data) => {
        if (!taskId) return;

        try {
            const result = await updateTask({
                id: taskId,
                data,
            }).unwrap();

            if (result?.success) {
                reset();
                onClose();

                return showToast({
                    title:
                        result?.message ||
                        "কাজ সফলভাবে আপডেট হয়েছে",
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: (
                            <FaCircleCheck className="h-5 w-5" />
                        ),
                    },
                });
            }
        } catch (error: any) {
            return showToast({
                title:
                    error?.data?.message ||
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


    // ==========================================
    // Loading
    // ==========================================
    const isLoading =
        singleTaskLoading || userLoading;


    // ==========================================
    // Error
    // ==========================================
    const isError =
        singleTaskError || userError;


    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="কাজ আপডেট করুন"
            width="lg"
        >
            {isLoading ? (
              <CustomStatus type="loading" />
            ) : isError ? (
                <CustomStatus type="error" />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>

                    <div className="flex flex-col gap-3">

                        {/* ==================================
                            Select Fields
                        ================================== */}
                        <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">

                            {/* Repeat */}
                            <CustomSelect
                                name="repeat"
                                label="পুনরাবৃত্তি"
                                placeholder="পুনরাবৃত্তি নির্বাচন করুন"
                                control={control}
                                rules={{
                                    required:
                                        "পুনরাবৃত্তি নির্বাচন করুন",
                                }}
                                error={errors.repeat}
                                options={[
                                    {
                                        label: "কোনো পুনরাবৃত্তি নেই",
                                        value: "none",
                                    },
                                    {
                                        label: "প্রতিদিন",
                                        value: "everyday",
                                    },
                                    {
                                        label: "প্রতি সপ্তাহে",
                                        value: "weekly",
                                    },
                                    {
                                        label: "প্রতি মাসে",
                                        value: "monthly",
                                    },
                                ]}
                            />


                            {/* User */}
                            <CustomSelect
                                name="userId"
                                label="ব্যক্তি"
                                placeholder="ব্যক্তি নির্বাচন করুন"
                                control={control}
                                rules={{
                                    required:
                                        "ব্যক্তি নির্বাচন করা আবশ্যক",
                                }}
                                error={errors.userId}
                                options={labelValue || []}
                            />


                            {/* Date */}
                            <CustomDatePicker
                                control={control}
                                name="date"
                                label="তারিখ"
                                disablePastDates
                                placeholder="কাজের তারিখ"
                                rules={{
                                    required:
                                        "তারিখ নির্বাচন করা আবশ্যক",
                                }}
                                error={errors.date}
                            />

                        </div>


                        {/* ==================================
                            Description
                        ================================== */}
                        <CustomTextArea
                            name="description"
                            register={register}
                            placeholder="কাজের বিবরণ লিখুন"
                            rules={{
                                required:
                                    "কাজের বিবরণ আবশ্যক",

                                minLength: {
                                    value: 2,
                                    message:
                                        "কাজের বিবরণ কমপক্ষে ২ অক্ষরের হতে হবে",
                                },
                            }}
                            error={errors.description}
                        />

                    </div>


                    {/* ==================================
                        Buttons
                    ================================== */}
                    <div className="flex items-center justify-between pt-5">

                        {/* Clear */}
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                        >
                            ক্লিয়ার
                        </button>


                        {/* Update */}
                        <button
                            type="submit"
                            disabled={taskLoading}
                            className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 transition hover:bg-[#028756] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {taskLoading
                                ? "আপডেট হচ্ছে..."
                                : "আপডেট করুন"}
                        </button>

                    </div>

                </form>
            )}
        </CustomModal>
    );
};

export default UpdateTaskModal;