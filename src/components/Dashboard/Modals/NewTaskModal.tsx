
"use client";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { showToast } from "@/components/Toast/CustomToast";
import { useGetUserOptionsQuery } from "@/redux/features/user.features";
import { IUser } from "@/interface/user";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useCreateTaskMutation } from "@/redux/features/task.features";


export type TTask = {
    description: string;
    repeat: string;
    userId: string;
    date: string;
};

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

const NewTaskModal = ({
    isOpen,
    onClose,
}: TCustomModal) => {
    const [mutateAsync, { isLoading: taskLoading }] =
        useCreateTaskMutation();
    const { data, isLoading, isError } = useGetUserOptionsQuery(undefined)
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

    const labelValue = data?.data?.map((dt: IUser) => ({ label: dt.name, value: dt.id }))

    const onSubmit: SubmitHandler<TTask> = async (data) => {
        try {
            const result = await mutateAsync(data).unwrap();

            if (result?.success) {
                reset();
                onClose();

                return showToast({
                    title: result?.message || "কাজ সফলভাবে যোগ হয়েছে",
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

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="নতুন কাজ যোগ করুন"
            width="lg"
        >
            {
                isLoading ?
                    <CustomLoader cls="h-[30vh]" /> :
                    isError ?
                        <CustomStatus type="error" /> :
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-3">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                                    <CustomSelect
                                        name="repeat"
                                        label="পুনরাবৃত্তি"
                                        placeholder="পুনরাবৃত্তি নির্বাচন করুন"
                                        control={control}
                                        rules={{
                                            required: "পুনরাবৃত্তি নির্বাচন করুন",
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

                                    <CustomSelect
                                        name="userId"
                                        label="ব্যক্তি"
                                        placeholder="ব্যক্তি নির্বাচন করুন"
                                        control={control}
                                        rules={{
                                            required: "ব্যক্তি নির্বাচন করা আবশ্যক",
                                        }}

                                        error={errors.userId}
                                        options={labelValue || []}
                                    />

                                    <CustomDatePicker
                                        control={control}
                                        name="date"
                                        disablePastDates
                                        label="তারিখ"
                                        placeholder="কাজের তারিখ"
                                        rules={{
                                            required: "তারিখ নির্বাচন করা আবশ্যক",
                                        }}
                                        error={errors.date}
                                    />
                                </div>
                                <CustomTextArea
                                    name="description"
                                    register={register}
                                    placeholder="কাজের বিবরণ লিখুন"
                                    rules={{
                                        required: "কাজের বিবরণ আবশ্যক",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "কাজের বিবরণ কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                    }}
                                    error={errors.description}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-5">
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                                >
                                    ক্লিয়ার
                                </button>
                                <button
                                    type="submit"
                                    disabled={taskLoading}
                                    className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100 transition hover:bg-[#028756] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {taskLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
                                </button>
                            </div>
                        </form>
            }

        </CustomModal>
    );
};

export default NewTaskModal;

function mutateAsync(data: TTask) {
    throw new Error("Function not implemented.");
}
