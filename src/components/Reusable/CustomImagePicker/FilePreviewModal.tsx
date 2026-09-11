"use client";

import Image from "next/image";
import { FileText, X } from "lucide-react";
import { useEffect } from "react";

type FilePreviewModalProps = {
  open: boolean;
  file: File | null;
  preview?: string | null;
  onClose: () => void;
};

export default function FilePreviewModal({
  open,
  file,
  preview,
  onClose,
}: FilePreviewModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || !file) return null;

  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;

    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold">File Preview</h2>
            <p className="mt-1 text-xs text-gray-500">
              {formatFileSize(file.size)}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 transition bg-red-100 text-red-600 cursor-pointer hover:bg-red-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="relative flex h-72 items-center justify-center overflow-hidden rounded-xl border bg-gray-50">
            {isImage && preview ? (
              <Image
                src={preview}
                alt={file.name}
                fill
                className="object-contain"
              />
            ) : isPdf ? (
              <div className="flex flex-col items-center">
                <FileText className="h-24 w-24 text-red-500" />
                <span className="mt-3 font-medium text-red-500">
                  PDF Document
                </span>
              </div>
            ) : (
              <span>Preview unavailable</span>
            )}
          </div>

          <div className="mt-5 rounded-xl border bg-gray-50 p-4">
            <p className="text-xs text-gray-500">File Name</p>

            <p
              className="mt-1 break-all font-medium text-gray-800"
              title={file.name}
            >
              {file.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
