"use client";

import React, { useRef, useState } from "react";
import {
    CheckCircle2,
    UploadCloud,
    X,
    AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { getToken } from "@/service/auth.services";

export default function UploadDocument({ refetch }: any) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const params = useParams();
    const id = params?.id as string | undefined;
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);

    // =========================
    // Open File Picker
    // =========================
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    // =========================
    // File Select + Upload
    // =========================
    const handleFileChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFile = e.target.files?.[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setProgress(0);
        setUploading(true);
        setUploadError(null);
        setUploadMessage(null);

        const formData = new FormData();

        formData.append("file", selectedFile);

        if (id) {
            formData.append("parentId", id);
        }

        try {
            const token = getToken()
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_BACKEND_API}/document/upload`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    onUploadProgress: (progressEvent) => {
                        if (!progressEvent.total) return;

                        const percentage = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        setProgress(percentage);
                    },
                }
            );

            setProgress(100);
            refetch()
            setUploadMessage(
                response.data?.message ||
                "ফাইল সফলভাবে আপলোড হয়েছে।"
            );


            // Auto hide success message
            setTimeout(() => {
                setUploadMessage(null);
                setFile(null);
                setProgress(0);
            }, 3000);
        } catch (error) {
            // ❌ console.error বাদ
            // এতে Next.js dev error overlay আসবে না

            if (axios.isAxiosError(error)) {
                setUploadError(
                    error.response?.data?.message ||
                    "ফাইল আপলোড করা যায়নি।"
                );
            } else {
                setUploadError(
                    "ফাইল আপলোড করা যায়নি।"
                );
            }

            // Error toast 4 sec পরে চলে যাবে
            setTimeout(() => {
                setUploadError(null);
                setFile(null);
                setProgress(0);
            }, 4000);
        } finally {
            setUploading(false);
        }

        e.target.value = "";
    };

    // =========================
    // Close
    // =========================
    const handleClose = () => {
        setFile(null);
        setProgress(0);
        setUploading(false);
        setUploadError(null);
        setUploadMessage(null);
    };

    return (
        <>
            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Upload Button */}
            <button
                type="button"
                onClick={handleUploadClick}
                disabled={uploading}
                className="flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-[#009b70] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[#008a63] disabled:cursor-not-allowed disabled:opacity-60 sm:h-10 sm:gap-2 sm:px-5 sm:text-sm"
            >
                <UploadCloud
                    size={17}
                    strokeWidth={1.9}
                />

                <span>
                    {uploading
                        ? "আপলোড হচ্ছে..."
                        : "আপলোড"}
                </span>
            </button>

            {/* =================================
                Upload Status Toast
            ================================= */}
            {(uploadError || uploadMessage) && (
                <div
                    className={`fixed bottom-5 right-5 z-[99999] w-[360px] max-w-[calc(100vw-24px)] rounded-xl border bg-white p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.15)]`}
                >
                    <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${uploadError
                                ? "bg-red-50"
                                : "bg-green-50"
                                }`}
                        >
                            {uploadError ? (
                                <AlertCircle
                                    size={19}
                                    className="text-red-500"
                                />
                            ) : (
                                <CheckCircle2
                                    size={19}
                                    className="text-[#039A63]"
                                />
                            )}
                        </div>

                        {/* Message */}
                        <div className="min-w-0 flex-1">
                            <p
                                className={`text-sm font-semibold ${uploadError
                                    ? "text-red-600"
                                    : "text-[#039A63]"
                                    }`}
                            >
                                {uploadError
                                    ? "আপলোড ব্যর্থ হয়েছে"
                                    : "আপলোড সম্পন্ন"}
                            </p>

                            <p
                                className={`mt-0.5 break-words text-xs ${uploadError
                                    ? "text-red-500"
                                    : "text-gray-500"
                                    }`}
                            >
                                {uploadError ||
                                    uploadMessage}
                            </p>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="shrink-0 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>
            )}

            {/* =================================
                Upload Progress
            ================================= */}
            {uploading && !uploadError && (
                <div className="fixed bottom-5 right-5 z-[99999] w-[360px] max-w-[calc(100vw-24px)] rounded-xl border border-gray-200 bg-white p-3.5 shadow-[0_10px_40px_rgba(0,0,0,0.15)]">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f7f1]">
                            <UploadCloud
                                size={19}
                                className="text-[#039A63]"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                                <p className="truncate text-xs font-semibold text-gray-600">
                                    {file?.name}
                                </p>

                                <span className="shrink-0 text-xs font-semibold text-[#039A63]">
                                    {progress}%
                                </span>
                            </div>

                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-[#039A63] transition-all duration-200"
                                    style={{
                                        width: `${progress}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}