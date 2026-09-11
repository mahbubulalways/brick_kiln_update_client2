"use client";

import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError } from "react-icons/md";
import { Camera, X } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomInput from "@/components/Reusable/CustomInput";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import CustomStatus from "@/components/Reusable/CustomStatus";

import { showToast } from "@/components/Toast/CustomToast";
import { useGetGoodsStockOptionsQuery } from "@/redux/features/good_stock.features";
import { useCreateNewGoodIssueMutation } from "@/redux/features/goods_issue.features";
import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { modifyPayload } from "@/utils/modifyPayload";

type TCreateAsset = {
    goodId: string;
    name: string;
    location: string;
    quantity: number;
    date: string;
    note: string;
    file: File | null;
};

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

const CreateNewIGoodsIssueModal = ({
    isOpen,
    onClose,
}: TCustomModal) => {
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState("");

    const {
        isError,
        isLoading,
        data,
    } = useGetGoodsStockOptionsQuery(undefined);

    const [mutateAsync, { isLoading: createLoading }] =
        useCreateNewGoodIssueMutation();

    const formatProducts = formatLabelValuePair({
        data: data?.data,
        label: "name",
        value: "id",
        extra: "currentQuantity",
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<TCreateAsset>({
        defaultValues: {
            goodId: "",
            name: "",
            location: "",
            quantity: 0,
            date: "",
            note: "",
            file: null,
        },
    });

    const selectedGoodId = watch("goodId");
    const enteredQuantity = Number(watch("quantity") || 0);

    const selectedProduct = data?.data?.find(
        (item: any) => item.id === selectedGoodId
    );

    const currentQuantity = Number(
        selectedProduct?.currentQuantity || 0
    );

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview("");
    };

    const onSubmit: SubmitHandler<TCreateAsset> = async (
        formData
    ) => {
        if (!selectedGoodId) {
            setError("goodId", {
                type: "manual",
                message: "প্রোডাক্ট নির্বাচন করুন",
            });

            return;
        }

        if (Number(formData.quantity) > currentQuantity) {
            setError("quantity", {
                type: "manual",
                message: `বর্তমানে এই প্রোডাক্টের ${currentQuantity} টি মজুদ আছে। এর বেশি ইস্যু করা যাবে না।`,
            });

            return;
        }

        try {
            formData.file = image;

            const payload = modifyPayload(formData);

            const result = await mutateAsync(payload).unwrap();

            if (result?.success) {
                reset();
                removeImage();
                onClose();

                showToast({
                    title: "মালামাল সফলভাবে ইস্যু হয়েছে।",
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
            console.log(error)
            showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! মালামাল ইস্যু করতে সার্ভারে ত্রুটি হয়েছে।",
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

    const handleClose = () => {
        reset();
        removeImage();
        clearErrors();
        onClose();
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={handleClose}
            title="নতুন ইস্যু"
            width="lg"
        >
            {isLoading ? (
                <CustomStatus
                    type="loading"
                    description="মালামালের তথ্য লোড হচ্ছে..."
                />
            ) : isError ? (
                <CustomStatus
                    type="error"
                    description="মালামালের তথ্য লোড করা সম্ভব হয়নি।"
                />
            ) : (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    <CustomSelect
                        label="প্রোডাক্ট"
                        placeholder="প্রোডাক্ট নির্বাচন করুন"
                        control={control}
                        name="goodId"
                        options={formatProducts}
                    />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <CustomInput
                            name="name"
                            label="নাম"
                            placeholder="কার কাছে?"
                            register={register}
                            type="text"
                            rules={{
                                required: "নাম প্রদান করুন",
                            }}
                            error={errors.name}
                        />

                        <CustomInput
                            name="location"
                            label="লোকেশন"
                            placeholder="লোকেশন"
                            register={register}
                            type="text"
                            rules={{
                                required: "লোকেশন প্রদান করুন",
                            }}
                            error={errors.location}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <CustomInput
                                name="quantity"
                                label="পরিমাণ"
                                placeholder="পরিমাণ"
                                register={register}
                                type="number"
                                rules={{
                                    required: "পরিমাণ প্রদান করুন",
                                    min: {
                                        value: 1,
                                        message:
                                            "পরিমাণ ১ এর কম হতে পারবে না",
                                    },
                                    validate: (value: number) => {
                                        if (!selectedGoodId) {
                                            return "প্রথমে প্রোডাক্ট নির্বাচন করুন";
                                        }

                                        if (
                                            Number(value) >
                                            currentQuantity
                                        ) {
                                            return `বর্তমানে এই প্রোডাক্টের ${currentQuantity} টি মজুদ আছে। এর বেশি ইস্যু করা যাবে না।`;
                                        }

                                        return true;
                                    },
                                }}
                                error={errors.quantity}
                            />

                            {selectedGoodId &&
                                enteredQuantity > currentQuantity && (
                                    <p className="mt-1 text-xs font-medium text-red-500">
                                     ইস্যু করার পরিমাণ বর্তমান মজুদের চেয়ে বেশি।
                                    </p>
                                )}
                        </div>

                        <CustomDatePicker
                            name="date"
                            label="তারিখ"
                            control={control}
                            rules={{
                                required: "তারিখ নির্বাচন করুন",
                            }}
                            error={errors.date}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="asset-image"
                            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-600 transition hover:border-gray-400 hover:bg-gray-50"
                        >
                            <Camera size={16} />

                            <span>
                                {image
                                    ? "ছবি পরিবর্তন করুন"
                                    : "ছবি আপলোড করুন"}
                            </span>
                        </label>

                        <input
                            id="asset-image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />

                        {imagePreview && (
                            <div className="relative mt-3 h-20 w-20">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="h-20 w-20 rounded-lg border border-gray-200 object-cover"
                                />

                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-gray-700 text-white"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        )}
                    </div>

                    <CustomTextArea
                        name="note"
                        register={register}
                        error={errors.note}
                        label="মন্তব্য"
                        placeholder="মন্তব্য"
                    />

                    <button
                        type="submit"
                        disabled={
                            createLoading ||
                            (Boolean(selectedGoodId) &&
                                enteredQuantity > currentQuantity)
                        }
                        className="mt-1 h-11 w-full rounded-lg bg-[#F4510B] text-base font-semibold text-white shadow-sm transition hover:bg-[#df4508] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {createLoading
                            ? "প্রসেসিং..."
                            : "কনফার্ম"}
                    </button>
                </form>
            )}
        </CustomModal>
    );
};

export default CreateNewIGoodsIssueModal;