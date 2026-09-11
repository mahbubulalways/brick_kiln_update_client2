"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";
import { showToast } from "@/components/Toast/CustomToast";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { useGetAllClassAndRateQuery } from "@/redux/features/classAndRate.features";
import { TClassAndRate } from "@/types/types";
import { useCreateLoadInfoMutation } from "@/redux/features/load.features";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useCreateNewStockBookMutation } from "@/redux/features/stock_book.features";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

export interface TUpdateStock {
    description: string;
    class: string;
    stockIn: number;
    stockOut: number;
}

const CreateNewUpdateStockModal = ({
    isOpen,
    onClose,
}: TCustomModal) => {
    const [mutateAsync, { isLoading }] =
        useCreateNewStockBookMutation();

    const {
        register,
        handleSubmit,
        reset,
        control,
    } = useForm<TUpdateStock>({
        defaultValues: {
            description: "",
            class: "",
            stockIn: 0,
            stockOut: 0,
        },
    });

    const {
        isLoading: classLoading,
        isError: classError,
        data: fetchedData,
        error: classErrorDetails,
    } = useGetAllClassAndRateQuery({
        limit: 100000,
        page: 1,
    });

    const formatLabelValue = fetchedData?.data?.data
        ?.map((dt: TClassAndRate) => ({
            label: dt.className,
            value: dt.className,
        }));

    const onSubmit: SubmitHandler<TUpdateStock> = async (
        data,
    ) => {
        data.stockIn=Number(data.stockIn)
        data.stockOut=Number(data.stockOut)
        try {
            const result = await mutateAsync(data as any).unwrap();
            if (result?.success) {
                showToast({
                    title: result?.message,
                    type: "success",
                });
                reset();
                onClose();
            }
        } catch (error: any) {
            console.log(error)
            showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="স্টক পরিবর্তন"
        >
            {
                classLoading ?
                    <CustomStatus
                        type="loading"
                    /> :
                    classError ?
                        <CustomStatus
                            type="error"
                            description="শ্রেণি লোড করতে সমস্যা হয়েছে।"
                        /> :
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                <CustomInput
                                    name="description"
                                    label="স্টক পরিবর্তনের কারণ"
                                    placeholder="স্টক পরিবর্তনের বিস্তারিত কারণ"
                                    register={register}
                                    type="text"
                                />
                                <CustomSelect
                                    name="class"
                                    label="শ্রেণি"
                                    placeholder="শ্রেণি নির্বাচন করুন"
                                    control={control}
                                    isLoading={classLoading}
                                    options={formatLabelValue || []}
                                    clearable={false}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <CustomInput
                                            name="stockIn"
                                            label="স্টক ইন"
                                            placeholder="স্টক (+)"
                                            register={register}
                                            type="number"
                                        />
                                    </div>
                                    <div>
                                        <CustomInput
                                            name="stockOut"
                                            label="স্টক আউট"
                                            placeholder="স্টক (-)"
                                            register={register}
                                            type="number"
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 pt-5">
                                <button
                                    type="button"
                                    onClick={() => reset()}
                                    className="flex-1 rounded border border-gray-300 bg-white px-10 py-2 text-[14px] font-medium text-gray-500 transition duration-300 hover:border-[#039A63] hover:text-[#039A63]"
                                >
                                    ক্লিয়ার
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex-1 cursor-pointer rounded bg-[#039A63] px-10 py-2 text-[14px] font-medium text-white transition duration-300 hover:bg-[#028a58] disabled:cursor-default disabled:bg-gray-500"
                                >
                                    {isLoading
                                        ? "সেভ হচ্ছে..."
                                        : "সেভ করুন"}
                                </button>
                            </div>
                        </form>
            }

        </CustomModal>
    );
};

export default CreateNewUpdateStockModal;