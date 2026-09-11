"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomSelectAdd from "@/components/Reusable/CustomSelectWithAdd";

import {
    useGetSingleLoadInfoQuery,
    useUpdateLoadInfoMutation,
} from "@/redux/features/load.features";

import { SERVER_ERROR_MESSAGE } from "@/constant";

import { useGetAllClassAndRateOptionsQuery, useGetAllClassAndRateQuery } from "@/redux/features/classAndRate.features";
import { TClassAndRate } from "@/types/types";
import { Dispatch, SetStateAction, useEffect } from "react";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string | undefined;
    setId: Dispatch<SetStateAction<string | undefined>>
};

export interface TLoadInfo {
    date: Date;
    round: number;
    quantity: number;
    loadType: string;
    classType?: string;
}

const UpdateLoadModal = ({
    isOpen,
    onClose,
    id, setId
}: TCustomModal) => {
    // ================= API =================

    const {
        data: singleData,
        isLoading: singleLoading,
        isError: singleError,
        error,
    } = useGetSingleLoadInfoQuery(id, {
        skip: !id || !isOpen,
    });
    console.log(error)
    const [updateLoadInfo, { isLoading: updateLoading }] =
        useUpdateLoadInfoMutation();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,
    } = useForm<TLoadInfo>();

    // ================= CLASS & RATE =================

    const isPaka =
        watch("loadType") === "পাকা ইট লোড হয়েছে";

    const {
        isLoading: classLoading,
        data: fetchedData,
        isError
    } = useGetAllClassAndRateOptionsQuery(undefined);

    const formatLabelValue =
        fetchedData?.data?.map(
            (dt: TClassAndRate) => ({
                label: dt.className,
                value: dt.className,
            })
        ) || [];

    // ================= SINGLE DATA =================

    const loadData = singleData?.data;

    // ================= SET DATA =================

    useEffect(() => {
        if (!loadData) return;

        reset({
            date: new Date(loadData.date),
            round: loadData.round?.name,
            quantity: Number(loadData.quantity),
            loadType: loadData.loadType,
            classType: loadData.classType || undefined,
        });
    }, [loadData, reset]);

    // ================= SUBMIT =================

    const onSubmit: SubmitHandler<TLoadInfo> = async (
        data
    ) => {
        if (!id) return;

        try {
            const result = await updateLoadInfo({
                id,
                data,
            }).unwrap();

            showToast({
                title: result?.message,
                type: "success",
            });

            handleClose();
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    SERVER_ERROR_MESSAGE,
                type: "error",
            });
        }
    };

    // ================= LOADING =================

    if (singleLoading) {
        return (
            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                title="নতুন লোড (আপডেট)"
            >
                <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-gray-500">
                        লোডের তথ্য লোড হচ্ছে...
                    </p>
                </div>
            </CustomModal>
        );
    }

    // ================= ERROR =================

    if (singleError || !loadData) {
        return (
            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                title="লোড আপডেট"
            >
                <div className="flex items-center justify-center py-10">
                    <p className="text-sm text-red-500">
                        লোডের তথ্য পাওয়া যায়নি
                    </p>
                </div>
            </CustomModal>
        );
    }

    // ================= UI =================

    const handleClose = () => {
        setId(undefined)
        onClose()
    }
    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="লোড আপডেট"
        >{
                singleLoading || classLoading ? <CustomStatus type="loading" /> :
                    isError || singleError ? <CustomStatus type="error" /> :
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid grid-cols-2 gap-2">

                                {/* DATE */}
                                <CustomDatePicker
                                    control={control}
                                    name="date"
                                    label="তারিখ"
                                />

                                {/* ROUND */}
                                <CustomSelectAdd
                                    name="round"
                                    label="রাউন্ড"
                                    placeholder="রাউন্ড নির্বাচন করুন"
                                    control={control}
                                    clearable={false}
                                    searchable={false}
                                />

                                {/* LOAD TYPE */}
                                <CustomSelect
                                    name="loadType"
                                    label="লোডের ধরণ"
                                    placeholder="লোডের ধরণ"
                                    control={control}
                                    options={[
                                        {
                                            label: "কাঁচা ইট এন্ট্রি",
                                            value: "RAWENTRY",
                                        },
                                        {
                                            label: "কাঁচা ইট মাঠে লোড",
                                            value: "RAW_TO_FIELD",
                                        },
                                        {
                                            label: "মাঠ থেকে চুল্লিতে লোড",
                                            value: "FIELD_TO_CHULLI",
                                        },
                                        {
                                            label: "স্টক থেকে চুল্লিতে লোড",
                                            value: "STOCK_TO_CHULLI",
                                        },
                                        {
                                            label: "মাঠ থেকে স্টকে লোড",
                                            value: "FIELD_TO_STOCK",
                                        },
                                        {
                                            label: "পাকা ইট লোড",
                                            value: "PAKA_IT_LOAD",
                                        },
                                    ]}
                                />

                                {/* CLASS TYPE */}
                                {isPaka && (
                                    <CustomSelect
                                        name="classType"
                                        label="শ্রেণি"
                                        placeholder="শ্রেণি"
                                        control={control}
                                        isLoading={classLoading}
                                        options={formatLabelValue}
                                    />
                                )}

                                {/* QUANTITY */}
                                <CustomInput
                                    name="quantity"
                                    label="পরিমান"
                                    placeholder="লোডের পরিমাণ"
                                    register={register}
                                    type="text"
                                />
                            </div>

                            {/* BUTTONS */}
                            <div className="flex items-center justify-between pt-5">

                                {/* CLEAR / RESET */}
                                <div
                                    onClick={() => {
                                        reset({
                                            date: new Date(loadData.date),
                                            round: loadData.roundId,
                                            quantity: Number(loadData.quantity),
                                            loadType: loadData.loadType,
                                            classType:
                                                loadData.classType || undefined,
                                        });
                                    }}
                                    className="
              text-[14px]
              border
              border-gray-300
              bg-white
              hover:border-[#039A63]
              px-10
              py-1.5
              text-gray-500
              duration-500
              hover:text-[#039A63]
              font-medium
              rounded
              cursor-pointer
            "
                                >
                                    রিসেট
                                </div>

                                {/* UPDATE */}
                                <button
                                    type="submit"
                                    disabled={updateLoading}
                                    className="
              text-[14px]
              bg-[#039A63]
              px-8
              py-1.5
              text-gray-100
              font-medium
              rounded
              cursor-pointer
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
                                >
                                    {updateLoading
                                        ? "আপডেট হচ্ছে..."
                                        : "আপডেট করুন"}
                                </button>
                            </div>
                        </form>
            }
        </CustomModal>
    );
};

export default UpdateLoadModal;