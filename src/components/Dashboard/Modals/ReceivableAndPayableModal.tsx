"use client";

import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { showToast } from "@/components/Toast/CustomToast";
import { useCreateDueMutation } from "@/redux/features/due_mate.features";

type TReceivableAndPayable = {
    transactionType: "GIVEN" | "TAKEN";
    amount: string;
    name: string;
    transactionDate: string;
    address: string;
    paymentDate: string;
    phone: string;
    witnessOne: string;
    witnessTwo: string;
    description: string;
};

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

const ReceivableAndPayableModal = ({
    isOpen,
    onClose,
}: TCustomModal) => {
    const [createDue, { isLoading }] = useCreateDueMutation();

    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<TReceivableAndPayable>();

    const onSubmit: SubmitHandler<TReceivableAndPayable> = async (
        data
    ) => {
        try {
            await createDue(data).unwrap();

            showToast({
                title: "লেনদেনের হিসাব সফলভাবে যোগ হয়েছে",
                type: "success",
                options: {
                    duration: 4000,
                    icon: <FaCircleCheck className="h-5 w-5" />,
                },
            });

            reset();
            onClose();
        } catch (error) {
            console.log(error);

            showToast({
                title: "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
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
            title="লেনদেনের নতুন হিসাব"
            width="xl"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                    <CustomSelect
                        name="transactionType"
                        label="লেনদেনের ধরণ"
                        placeholder="লেনদেনের ধরণ নির্বাচন করুন"
                        control={control}
                        rules={{
                            required:
                                "লেনদেনের ধরণ নির্বাচন করুন",
                        }}
                        error={errors.transactionType}
                        options={[
                            {
                                label: "দেওয়া",
                                value: "GIVEN",
                            },
                            {
                                label: "নেওয়া",
                                value: "TAKEN",
                            },
                        ]}
                    />

                    <CustomInput
                        name="amount"
                        label="টাকার পরিমাণ"
                        placeholder="টাকার পরিমাণ লিখুন"
                        register={register}
                        type="number"
                        rules={{
                            required: "টাকার পরিমাণ লিখুন",
                            min: {
                                value: 1,
                                message:
                                    "টাকার পরিমাণ ১-এর কম হতে পারবে না",
                            },
                        }}
                        error={errors.amount}
                    />

                    <CustomInput
                        name="name"
                        label="নাম"
                        placeholder="ব্যক্তির নাম লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required: "নাম লিখুন",
                            minLength: {
                                value: 2,
                                message:
                                    "নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                            },
                        }}
                        error={errors.name}
                    />

                    <CustomDatePicker
                        control={control}
                        name="transactionDate"
                        label="লেনদেনের তারিখ"
                        placeholder="লেনদেনের তারিখ নির্বাচন করুন"
                        rules={{
                            required:
                                "লেনদেনের তারিখ নির্বাচন করুন",
                        }}
                        error={errors.transactionDate}
                    />

                    <CustomInput
                        name="address"
                        label="ঠিকানা"
                        placeholder="ঠিকানা লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required: "ঠিকানা লিখুন",
                        }}
                        error={errors.address}
                    />

                    <CustomDatePicker
                        control={control}
                        name="paymentDate"
                        label="পরিশোধের তারিখ"
                        placeholder="পরিশোধের তারিখ নির্বাচন করুন"
                        rules={{
                            required:
                                "পরিশোধের তারিখ নির্বাচন করুন",
                        }}
                        error={errors.paymentDate}
                    />

                    <CustomInput
                        name="phone"
                        label="ফোন নম্বর"
                        placeholder="ফোন নম্বর লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required: "ফোন নম্বর লিখুন",
                            pattern: {
                                value:
                                    /^(?:\+88|88)?01[3-9]\d{8}$/,
                                message:
                                    "সঠিক ফোন নম্বর দিন",
                            },
                        }}
                        error={errors.phone}
                    />

                    <CustomInput
                        name="witnessOne"
                        label="সাক্ষী ১"
                        placeholder="সাক্ষী ১-এর নাম লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required:
                                "সাক্ষী ১-এর নাম লিখুন",
                        }}
                        error={errors.witnessOne}
                    />

                    <CustomInput
                        name="witnessTwo"
                        label="সাক্ষী ২"
                        placeholder="সাক্ষী ২-এর নাম লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required:
                                "সাক্ষী ২-এর নাম লিখুন",
                        }}
                        error={errors.witnessTwo}
                    />

                    <CustomTextArea
                        name="description"
                        label="লেনদেনের কারণ"
                        placeholder="লেনদেনের কারণ বিস্তারিত লিখুন"
                        register={register}
                        rules={{
                            required:
                                "লেনদেনের কারণ লিখুন",
                            minLength: {
                                value: 2,
                                message:
                                    "কারণ কমপক্ষে ২ অক্ষরের হতে হবে",
                            },
                        }}
                        error={errors.description}
                    />
                </div>

                <div className="flex items-center justify-between pt-3">
                    <button
                        type="button"
                        onClick={() => reset()}
                        disabled={isLoading}
                        className="cursor-pointer rounded border border-gray-300 bg-white px-8 py-1.5 text-[13px] font-medium text-gray-500 transition hover:border-[#039A63] hover:text-[#039A63] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ক্লিয়ার
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="cursor-pointer rounded bg-[#039A63] px-7 py-1.5 text-[13px] font-medium text-white transition hover:bg-[#028756] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isLoading ? "যোগ হচ্ছে..." : "অ্যাড করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default ReceivableAndPayableModal;