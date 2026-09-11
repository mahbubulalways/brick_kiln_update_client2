"use client";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomFilePicker from "@/components/Reusable/CustomImagePicker/CustomFilePicker";
import SelectLedgerModal from "../SelectLedgerModal";

import { useEffect, useState } from "react";
import {
    SubmitHandler,
    useForm,
} from "react-hook-form";

import { TPaymentResponse } from "@/interface/payment";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";

type TKhatiyan = {
    ledger: string;
    paymentType: string;
    paymentDetails: string;
    payment: number;
    file?: File;
    createdAt: string
    totalBill: number
    paymentDate: string
};

type TUpdatePaymentModalPart2Props = {
    paymentData: TPaymentResponse | undefined;
    onSubmit?: any;
};

const UpdatePaymentModalPart2 = ({
    paymentData,
    onSubmit,
}: TUpdatePaymentModalPart2Props) => {
    const [openLedgerModal, setOpenLedgerModal] =
        useState(false);
    const [ledger, setLedger] = useState("");

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<TKhatiyan>({
        defaultValues: {
            ledger: "",
            paymentType: "",
            paymentDetails: "",
            payment: 0,
            file: undefined,
            paymentDate:""
        },
    });

    // ==========================================
    // SET PAYMENT DATA INTO FORM
    // ==========================================
    useEffect(() => {
        if (!paymentData) return;

        const initialLedger =
            paymentData.ledger?.name || "";

        // Set ledger state
        setLedger(initialLedger);

        // Set all form values
        reset({
            ledger: initialLedger,
            paymentType:
                paymentData.paymentType || "",
            paymentDetails:
            paymentData.paymentDetails || "",
            payment: paymentData.payment ?? 0,
            paymentDate: paymentData.paymentDate,
            file: undefined,
        });
    }, [paymentData, reset]);

    // ==========================================
    // UPDATE FORM LEDGER WHEN NEW LEDGER SELECTED
    // ==========================================
    useEffect(() => {
        if (!ledger) return;

        setValue("ledger", ledger, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [ledger, setValue]);

    // ==========================================
    // CLEAR / RESET FORM
    // ==========================================
    const handleClear = () => {
        if (!paymentData) return;

        const initialLedger =
            paymentData.ledger?.name || "";

        setLedger(initialLedger);

        reset({
            ledger: initialLedger,
            paymentType:
                paymentData.paymentType || "",
            paymentDetails:
                paymentData.paymentDetails || "",
            payment: paymentData.payment ?? 0,
            createdAt: paymentData.createdAt
        });
    };

    // ==========================================
    // SUBMIT
    // ==========================================
    const handleFormSubmit: SubmitHandler<TKhatiyan> = (
        data
    ) => {
        if (onSubmit) {
            onSubmit(data);
        }
    };

    return (
        <div>
            <form
                onSubmit={handleSubmit(handleFormSubmit)}
            >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                    {/* ================= LEDGER ================= */}
                    <div
                        onClick={() =>
                            setOpenLedgerModal(true)
                        }
                    >
                        <CustomInput
                            name="ledger"
                            label="খতিয়ান"
                            placeholder="খতিয়ান নির্বাচন করুন"
                            register={register}
                            readonly
                            type="text"
                            error={errors.ledger}
                            rules={{
                                required:
                                    "খতিয়ান নির্বাচন করুন",
                            }}
                        />
                    </div>

                    {/* ================= PAYMENT TYPE ================= */}
                    <CustomSelect
                        name="paymentType"
                        label="পেমেন্টের ধরণ"
                        placeholder="পেমেন্টের ধরণ"
                        control={control}
                        options={[
                            {
                                label: "রেগুলার পেমেন্ট",
                                value: "রেগুলার পেমেন্ট",
                            },
                            {
                                label: "অগ্রিম পেমেন্ট",
                                value: "অগ্রিম পেমেন্ট",
                            },
                            {
                                label: "বাকি পেমেন্ট",
                                value: "বাকি পেমেন্ট",
                            },
                        ]}
                        error={errors.paymentType}
                        rules={{
                            required:
                                "পেমেন্টের ধরণ নির্বাচন করুন",
                        }}
                    />

                    {/* ================= PAYMENT DETAILS ================= */}
                    <CustomInput
                        name="paymentDetails"
                        label="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
                        placeholder="পেমেন্টের বিস্তারিত বর্ণনা লিখুন"
                        register={register}
                        type="text"
                        error={errors.paymentDetails}
                        rules={{
                            required:
                                "পেমেন্টের বিস্তারিত বর্ণনা লিখুন",
                        }}
                    />

                    {/* ================= PAYMENT ================= */}
                    <CustomInput
                        name="payment"
                        label="অগ্রিম টাকা"
                        placeholder="অগ্রিম টাকা"
                        register={register}
                        type="number"
                        error={errors.payment}
                        rules={{
                            required: "অগ্রিম টাকা লিখুন",
                            valueAsNumber: true,
                        }}
                    />
                </div>

                {/* ================= FILE ================= */}
                <div className="mt-4 space-y-3">
                    <CustomFilePicker
                        control={control}
                        name="file"
                        label="ডকুমেন্ট / মানি রিসিপ্ট"
                        error={errors.file}
                    />

                    <CustomDatePicker
                        control={control}
                        name="paymentDate"
                        label="পেমেন্টের তারিখ"
                        placeholder="পেমেন্টের তারিখ"
                    />
                </div>


                {/* ================= BUTTONS ================= */}
                <div className="flex items-center justify-between pt-5">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="cursor-pointer rounded border border-gray-300 bg-white px-10 py-1.5 text-[14px] font-medium text-gray-500 duration-500 hover:border-[#039A63] hover:text-[#039A63]"
                    >
                        ক্লিয়ার
                    </button>

                    <button
                        type="submit"
                        className="cursor-pointer rounded bg-[#039A63] px-8 py-1.5 text-[14px] font-medium text-gray-100"
                    >
                        আপডেট করুন
                    </button>
                </div>
            </form>

            {/* ================= LEDGER MODAL ================= */}
            {openLedgerModal && (
                <SelectLedgerModal
                    isOpen={openLedgerModal}
                    ledger={ledger}
                    setLedger={setLedger}
                    onClose={() =>
                        setOpenLedgerModal(false)
                    }
                />
            )}
        </div>
    );
};

export default UpdatePaymentModalPart2;