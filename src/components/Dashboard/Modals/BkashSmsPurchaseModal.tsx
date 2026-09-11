"use client";

import { useForm } from "react-hook-form";
import { X, MessageSquare } from "lucide-react";

type TBkashSmsPurchaseModalProps = {
    isOpen: boolean;
    onClose: () => void;
    smsPrice?: number;
};

type TFormData = {
    smsQuantity: number;
};

const BkashSmsPurchaseModal = ({
    isOpen,
    onClose,
    smsPrice = 0.35,
}: TBkashSmsPurchaseModalProps) => {
    const { register, handleSubmit, watch } = useForm<TFormData>({
        defaultValues: {
            smsQuantity: 100,
        },
    });

    const smsQuantity = Number(watch("smsQuantity")) || 0;
    const totalPrice = smsQuantity * smsPrice;

    const onSubmit = (data: TFormData) => {
        console.log({
            smsQuantity: data.smsQuantity,
            totalPrice: data.smsQuantity * smsPrice,
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 px-4 backdrop-blur-[2px]">
            <div className="w-full max-w-[420px] overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-50">
                            <MessageSquare className="h-5 w-5 text-pink-500" />
                        </div>

                        <div>
                            <h2 className="text-[17px] font-semibold text-gray-800">
                                bKash SMS Purchase
                            </h2>
                            <p className="text-[12px] text-gray-400">
                                SMS কিনুন
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-200"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-5">

                    {/* SMS Price */}
                    <div className="mb-4 rounded-xl border border-pink-100 bg-pink-50 p-4">
                        <p className="text-[12px] font-medium text-gray-500">
                            প্রতি SMS মূল্য
                        </p>

                        <div className="mt-1 flex items-end gap-1">
                            <span className="text-[25px] font-bold text-pink-500">
                                ৳{smsPrice}
                            </span>

                            <span className="mb-1 text-[12px] text-gray-400">
                                / SMS
                            </span>
                        </div>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="mb-2 block text-[13px] font-semibold text-gray-600">
                            কতটি SMS কিনবেন?
                        </label>

                        <input
                            {...register("smsQuantity", {
                                required: true,
                                min: 1,
                                valueAsNumber: true,
                            })}
                            type="number"
                            min={1}
                            placeholder="SMS সংখ্যা লিখুন"
                            className="h-[48px] w-full rounded-xl border border-gray-300 px-4 text-[15px] outline-none transition focus:border-pink-500 focus:ring-1 focus:ring-pink-100"
                        />
                    </div>

                    {/* Total */}
                    <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                        <span className="text-[13px] text-gray-500">
                            মোট মূল্য
                        </span>

                        <span className="text-[17px] font-bold text-gray-800">
                            ৳{totalPrice.toFixed(2)}
                        </span>
                    </div>

                    {/* bKash Button */}
                    <button
                        type="submit"
                        className="mt-5 h-[48px] w-full rounded-xl bg-[#E2136E] text-[15px] font-semibold text-white shadow-[0_6px_18px_rgba(226,19,110,0.22)] transition hover:bg-[#c90f62] active:scale-[0.99]"
                    >
                        bKash দিয়ে কিনুন
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BkashSmsPurchaseModal;