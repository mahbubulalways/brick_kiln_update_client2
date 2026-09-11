"use client";

import { useEffect, useRef } from "react";
import {
    Controller,
    FieldError,
    RegisterOptions,
} from "react-hook-form";
import { ImagePlus } from "lucide-react";

type CustomImagePickerProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    control: any;
    name: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    rules?: RegisterOptions;
    className?: string;
    error?: FieldError;
};

export default function CustomImagePicker({
    control,
    name,
    label,
    required = false,
    disabled = false,
    rules,
    className = "",
    error,
}: CustomImagePickerProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);

    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={null}
            render={({ field }) => {
                const file = field.value as File | null;

                const handleFileChange = (
                    e: React.ChangeEvent<HTMLInputElement>
                ) => {
                    const selectedFile = e.target.files?.[0];

                    if (!selectedFile) return;

                    if (!selectedFile.type.startsWith("image/")) {
                        return;
                    }

                    field.onChange(selectedFile);

                    // Same image আবার select করার জন্য
                    e.target.value = "";
                };

                const handleClick = () => {
                    if (disabled) return;
                    inputRef.current?.click();
                };

                return (
                    <div className={className}>
                        {label && (
                            <label className="mb-2 block text-sm font-medium text-gray-700">
                                {label}

                                {required && (
                                    <span className="ml-1 text-red-500">
                                        *
                                    </span>
                                )}
                            </label>
                        )}

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={disabled}
                            onChange={handleFileChange}
                        />

                        {file ? (
                            <div
                                onClick={handleClick}
                                className={`group relative h-[180px] w-full cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 ${disabled
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                    }`}
                            >
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="Selected image"
                                    className="h-full w-full object-contain"
                                />

                                {!disabled && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-all duration-200 group-hover:opacity-100">
                                        <div className="flex flex-col items-center gap-1 text-white">
                                            <ImagePlus size={20} />

                                            <span className="text-xs font-medium">
                                                ছবি পরিবর্তন করুন
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div
                                onClick={handleClick}
                                className={`group flex h-[180px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-[#f8fafc] transition hover:border-[#00a474] hover:bg-[#f3fbf8] ${disabled
                                        ? "cursor-not-allowed opacity-60"
                                        : ""
                                    }`}
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#9ca8b8] shadow-sm transition group-hover:text-[#00a474]">
                                    <ImagePlus size={22} />
                                </div>

                                <p className="mt-2 text-xs font-medium text-[#9ca8b8] transition group-hover:text-[#00a474]">
                                    ছবি আপলোড করুন
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                    JPG, PNG, WEBP
                                </p>
                            </div>
                        )}

                        {error && (
                            <p className="mt-2 text-sm text-red-500">
                                {error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
}