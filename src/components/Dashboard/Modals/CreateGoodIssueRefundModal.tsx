"use client";

import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Camera, CheckCircle2, X } from "lucide-react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { showToast } from "@/components/Toast/CustomToast";

import {
    useGetSingleGoodIssueQuery,
} from "@/redux/features/goods_issue.features";

import { TGoodsIssue } from "@/interface/good_stock";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { modifyPayload } from "@/utils/modifyPayload";
import { useCreateNewGoodIssueRefundMutation } from "@/redux/features/goog_issue_refund.features";

type TRefundForm = {
    name: string;
    goodQuantity: number;
    damagedQuantity: number;
    lostQuantity: number;
    date: string;
    note: string;
    file: File | null;
    issueId: string
};

type TCreateGoodIssueRefundModalProps = {
    id: string | null;
    isOpen: boolean;
    onClose: () => void;
};

const CreateGoodIssueRefundModal = ({
    id,
    isOpen,
    onClose,
}: TCreateGoodIssueRefundModalProps) => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const {
        data,
        isLoading,
        isError,
    } = useGetSingleGoodIssueQuery(id ?? "", {
        skip: !id || !isOpen,
    });

    const [mutateAsync, { isLoading: createLoading }] = useCreateNewGoodIssueRefundMutation()

    const issue = data?.data as TGoodsIssue | undefined;

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TRefundForm>({
        defaultValues: {
            name: "",
            goodQuantity: 0,
            damagedQuantity: 0,
            lostQuantity: 0,
            note: "",
            file: null,
        },
    });

    const goodQuantity = Number(watch("goodQuantity") || 0);
    const damagedQuantity = Number(
        watch("damagedQuantity") || 0
    );
    const lostQuantity = Number(watch("lostQuantity") || 0);

    const totalRefund =
        goodQuantity +
        damagedQuantity +
        lostQuantity;

    const issuedQuantity = Number(issue?.quantity || 0);

    const isQuantityExceeded =
        totalRefund > issuedQuantity;

    useEffect(() => {
        if (!issue || !isOpen) return;

        reset({
            name: issue.name || "",
            goodQuantity: 0,
            damagedQuantity: 0,
            lostQuantity: 0,
            note: "",
            file: null,
        });

        setImage(null);
        setImagePreview("");
    }, [issue, isOpen, reset]);

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(null);
        setImagePreview("");
    };

    const handleClose = () => {
        reset();
        clearErrors();
        removeImage();
        onClose();
    };

    const onSubmit: SubmitHandler<TRefundForm> = async (formData) => {
        if (!issue) return;

        const good = Number(formData.goodQuantity || 0);
        const damaged = Number(formData.damagedQuantity || 0);
        const lost = Number(formData.lostQuantity || 0);

        const totalRefund = good + damaged + lost;

        if (!formData.name.trim()) {
            setError("name", {
                type: "manual",
                message: "ফেরতকারী কর্মীর নাম লিখুন।",
            });
            return;
        }

        if (totalRefund !== issuedQuantity) {
            showToast({
               title: `মোট পরিমাণ ${issuedQuantity} হতে হবে। বর্তমানে ${totalRefund} টি।`,
                type: "info"
            })

            return;
        }

        clearErrors("goodQuantity");

        try {
            const payload = {
                issueId: issue.id,
                name: formData.name,
                goodQuantity: good,
                damagedQuantity: damaged,
                lostQuantity: lost,
                date: formData.date,
                note: formData.note,
                file: image,
            };

            const modifyData = modifyPayload(payload);

            const result = await mutateAsync(modifyData);

            console.log(result);

            reset();
            removeImage();
            onClose();

            showToast({
                title: "মালামাল ফেরত নেওয়া হয়েছে।",
                type: "success",
                options: {
                    duration: 4000,
                    icon: <FaCircleCheck className="h-5 w-5" />,
                },
            });
        } catch (error: any) {
            console.log(error);

            showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! মালামাল ফেরত নিতে সমস্যা হয়েছে।",
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
            onClose={handleClose}
            title="মালামাল ফেরত নেওয়া"
            width="md"
        >
            {isLoading ? (
                <CustomStatus
                    type="loading"
                    description="ইস্যুর তথ্য লোড হচ্ছে..."
                />
            ) : isError || !issue ? (
                <CustomStatus
                    type="error"
                    description="ইস্যুর তথ্য লোড করা সম্ভব হয়নি।"
                />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <div className="rounded-2xl bg-[#F1F5F9] p-2">
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="h-14 w-1.5 shrink-0 rounded-full bg-[#22C55E]" />

                                <div className="min-w-0">
                                    <h3 className="truncate text-lg font-bold text-gray-700">
                                        {issue.good?.name || "-"}
                                    </h3>

                                    <p className="mt-1 text-xs text-gray-400">
                                        📅 ইস্যু ডেট:{" "}
                                        {issue.date
                                            ? formatBanglaDate({
                                                date: issue.date,
                                            })
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="shrink-0 rounded-xl bg-white px-5 py-2 text-center shadow-sm">
                                <span className="block text-xs font-semibold text-gray-400">
                                    মোট ইস্যু
                                </span>

                                <span className="text-2xl font-bold text-green-600">
                                    {issuedQuantity}
                                </span>
                            </div>
                        </div>
                    </div>

                    <CustomInput
                        name="name"
                        label="ফেরতকারী কর্মীর নাম"
                        placeholder="কর্মীর নাম লিখুন"
                        register={register}
                        type="text"
                        rules={{
                            required:
                                "ফেরতকারী কর্মীর নাম লিখুন",
                        }}
                        error={errors.name}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <CustomInput
                            label="ভালো (স্টক)"
                            name="goodQuantity"
                            placeholder="0"
                            register={register}
                            type="number"
                        />
                        <CustomInput
                            label="  নষ্ট (ড্যামেজ)"
                            name="damagedQuantity"
                            placeholder="0"
                            register={register}
                            type="number"
                        />
                        <CustomInput
                            label=" হারানো (লস)"
                            name="lostQuantity"
                            placeholder="0"
                            register={register}
                            type="number"
                        />

                    </div>

                    {isQuantityExceeded && (
                        <p className="-mt-3 text-xs font-medium text-red-500">
                            মোট ফেরতের পরিমাণ ইস্যু করা
                            পরিমাণের চেয়ে বেশি হতে পারবে না।
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomDatePicker
                            name="date"
                            label="ফেরতের তারিখ"
                            control={control}
                            rules={{
                                required:
                                    "ফেরতের তারিখ নির্বাচন করুন",
                            }}
                            error={errors.date}
                        />

                        <div>
                            <label className="mb-1 block text-sm ">
                                প্রমাণ (ছবি)
                            </label>

                            <label
                                htmlFor="refund-image"
                                className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border
                                 border-dashed border-gray-300 bg-white px-8 text-sm font-medium text-gray-600
                                  transition hover:border-gray-400 hover:bg-gray-50"
                            >
                                <Camera size={17} />

                                <span>
                                    {image
                                        ? "ছবি পরিবর্তন করুন"
                                        : "ছবি তুলুন"}
                                </span>
                            </label>

                            <input
                                id="refund-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imagePreview && (
                                <div className="relative mt-3 h-20 w-20">
                                    <img
                                        src={imagePreview}
                                        alt="Refund preview"
                                        className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white shadow"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <button

                        type="submit"
                        disabled={isQuantityExceeded || createLoading}
                        className="flex h-11 w-full items-center justify-center gap-2 
                        rounded-lg bg-[#16A34A] text-base font-semibold text-white 
                        shadow-sm transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <CheckCircle2 size={18} />
                        ফেরত সম্পন্ন করুন
                    </button>
                </form>
            )}
        </CustomModal>
    );
};

export default CreateGoodIssueRefundModal;