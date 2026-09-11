"use client";

import CustomModal from "@/components/Reusable/CustomModal";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import CustomInput from "@/components/Reusable/CustomInput";
import { showToast } from "@/components/Toast/CustomToast";
import CustomImagePicker from "@/components/Reusable/CustomImagePicker/CustomImagePicker";
import CustomWarrantyCheckbox from "@/components/Reusable/CustomWarrantyCheckbox";
import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomStatus from "@/components/Reusable/CustomStatus";

import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { useGetGoodsCategoryOptionsQuery } from "@/redux/features/goods_stock_category.features";
import {
    useGetSingleGoodsStockInfoForUpdateQuery,
    useUpdateGoodsStockMutation,
} from "@/redux/features/good_stock.features";
import { modifyPayload } from "@/utils/modifyPayload";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
    id: string;
};

type TProductForm = {
    name: string;
    categoryId: string;
    shop: string;
    quantity: number;
    price: number;
    file: File | null;
    warranty: Date | null;
};

const UpdateProductEntryModal = ({
    isOpen,
    onClose,
    id,
}: TCustomModal) => {
    const [hasWarranty, setHasWarranty] = useState(false);

    const [updateGoodsStock, { isLoading: isUpdateLoading }] =
        useUpdateGoodsStockMutation();

    const {
        data: singleData,
        isLoading: isSingleLoading,
        isError: isSingleError,
    } = useGetSingleGoodsStockInfoForUpdateQuery(id, {
        skip: !id || !isOpen,
        refetchOnMountOrArgChange: true,
    });

    const {
        isError: isCategoryError,
        isLoading: isCategoryLoading,
        data: categoryData,
    } = useGetGoodsCategoryOptionsQuery(undefined);

    const categoryOptions = categoryData?.data || [];

    const formatOptions = formatLabelValuePair({
        data: categoryOptions,
        label: "name",
        value: "id",
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TProductForm>({
        defaultValues: {
            name: "",
            categoryId: "",
            shop: "",
            quantity: 0,
            price: 0,
            file: null,
            warranty: null,
        },
    });

    const product = singleData?.data;

    // Single product data দিয়ে default value বসানো
    useEffect(() => {
        if (!product || !isOpen) return;

        reset({
            name: product.name || "",
            categoryId: product.category?.id || "",
            shop: product.shop || "",
            quantity: Number(product.quantity || 0),
            price: Number(product.price || 0),
            file: null,
            warranty: product.warranty
                ? new Date(product.warranty)
                : null,
        });

        setHasWarranty(!!product.warranty);
    }, [product, isOpen, reset]);

    const handleWarrantyChange = (value: boolean) => {
        setHasWarranty(value);

        if (!value) {
            reset({
                name: product?.name || "",
                categoryId:
                    product?.categoryId ||
                    product?.category?.id ||
                    "",
                shop: product?.shop || "",
                quantity: Number(product?.quantity || 0),
                price: Number(product?.price || 0),
                file: null,
                warranty: null,
            });
        }
    };

    const onSubmit: SubmitHandler<TProductForm> = async (formData) => {
        try {
            const paylod = modifyPayload(formData)
            const result = await updateGoodsStock({
                id,
                data: paylod,
            }).unwrap();

            if (result?.success) {
                showToast({
                    title:
                        result?.message ||
                        "মালামালের তথ্য সফলভাবে আপডেট হয়েছে।",
                    type: "success",
                });

                onClose();
            }
        } catch (error: any) {
            showToast({
                title:
                    error?.data?.message ||
                    "মালামালের তথ্য আপডেট করা সম্ভব হয়নি।",
                type: "error",
            });
        }
    };

    const handleClear = () => {
        if (!product) return;

        reset({
            name: product.name || "",
            categoryId:
                product.categoryId ||
                product.category?.id ||
                "",
            shop: product.shop || "",
            quantity: Number(product.quantity || 0),
            price: Number(product.price || 0),
            file: null,
            warranty: product.warranty
                ? new Date(product.warranty)
                : null,
        });

        setHasWarranty(!!product.warranty);
    };

    if (isSingleLoading || isCategoryLoading) {
        return (
            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                title="✏️ তথ্য আপডেট করুন"
                width="xl"
            >
                <CustomStatus
                    type="loading"
                    description="মালামালের তথ্য লোড হচ্ছে..."
                />
            </CustomModal>
        );
    }

    if (isSingleError || isCategoryError) {
        return (
            <CustomModal
                isOpen={isOpen}
                onClose={onClose}
                title="✏️ তথ্য আপডেট করুন"
                width="xl"
            >
                <CustomStatus
                    type="error"
                    description="মালামালের তথ্য লোড করা সম্ভব হয়নি।"
                />
            </CustomModal>
        );
    }

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="✏️ তথ্য আপডেট করুন"
            width="xl"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                    {/* Left */}
                    <div className="col-span-3 flex w-full flex-col gap-4">
                        <CustomInput
                            name="name"
                            label="প্রোডাক্টের নাম"
                            placeholder="প্রোডাক্টের নাম লিখুন"
                            register={register}
                            type="text"
                            error={errors.name}
                        />

                        <CustomSelect
                            name="categoryId"
                            label="ক্যাটাগরি"
                            placeholder="ক্যাটাগরি নির্বাচন করুন"
                            control={control}
                            searchable
                            options={formatOptions}
                            error={errors.categoryId}
                        />

                        <CustomInput
                            name="shop"
                            label="ভেন্ডর / দোকান"
                            placeholder="কার কাছ থেকে কেনা হয়েছে?"
                            register={register}
                            type="text"
                            error={errors.shop}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <CustomInput
                                name="quantity"
                                label="পরিমাণ"
                                register={register}
                                type="number"
                                error={errors.quantity}
                                readonly
                            />

                            <CustomInput
                                name="price"
                                label="একক মূল্য"
                                register={register}
                                type="number"
                                error={errors.price}
                                readonly
                            />
                        </div>

                        <div className="rounded-md border border-gray-200 bg-gray-100 py-2 text-center text-sm">
                            মোট মূল্য
                            <p className="mt-0.5 text-[15px] text-violet-600">
                                {Number(product?.quantity || 0) *
                                    Number(product?.price || 0)}
                            </p>
                        </div>
                    </div>

                    {/* Right */}
                    <div className="col-span-2 flex flex-col gap-4">
                        <CustomImagePicker
                            control={control}
                            name="file"
                            label="প্রোডাক্টের ছবি"
                            error={errors.file}
                        />

                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            {!hasWarranty ? (
                                <CustomWarrantyCheckbox
                                    value={hasWarranty}
                                    onChange={handleWarrantyChange}
                                />
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <label className="text-sm font-medium text-gray-700">
                                        ওয়ারেন্টি শেষ হওয়ার তারিখ
                                    </label>

                                    <CustomDatePicker
                                        control={control}
                                        name="warranty"
                                        error={errors.warranty}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-6">
                    <button
                        type="button"
                        onClick={handleClear}
                        disabled={isUpdateLoading}
                        className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        রিসেট
                    </button>

                    <button
                        type="submit"
                        disabled={isUpdateLoading}
                        className="w-full cursor-pointer rounded-lg bg-[#039A63] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#028653] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isUpdateLoading
                            ? "আপডেট হচ্ছে..."
                            : "আপডেট করুন"}
                    </button>
                </div>
            </form>
        </CustomModal>
    );
};

export default UpdateProductEntryModal;