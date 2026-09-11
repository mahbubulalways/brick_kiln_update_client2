"use client";

import { UploadCloud } from "lucide-react";
import { useId, useState } from "react";
import { toast } from "sonner";

type UploadBoxProps = {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
};

const ALLOWED_EXTENSIONS = ["jpg", "png", "pdf"];

export default function UploadBox({
  onFileSelect,
  disabled = false,
  className = "",
}: UploadBoxProps) {
  const inputId = useId();

  const [dragging, setDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (!extension || !ALLOWED_EXTENSIONS.includes(extension)) {
      toast.error("শুধুমাত্র JPG, PNG এবং PDF ফাইল আপলোড করা যাবে।");
      return;
    }

    onFileSelect(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);

    // Select same file again
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (disabled) return;

    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    setDragging(false);

    if (disabled) return;

    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <>
      <input
        id={inputId}
        hidden
        type="file"
        disabled={disabled}
        accept=".jpg,.png,.pdf"
        onChange={handleChange}
      />

      <label htmlFor={inputId} className={`block h-full ${className}`}>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            flex h-36 cursor-pointer flex-col items-center justify-center
            rounded-2xl border-2 border-dashed p-5 transition-all duration-300

            ${
              dragging
                ? "border-green-600 bg-green-50"
                : "border-gray-300 hover:border-green-600 hover:bg-green-50"
            }

            ${disabled ? "cursor-not-allowed opacity-60" : ""}
          `}
        >
          <div className="rounded-full bg-white p-3 shadow-sm">
            <UploadCloud className="h-8 w-8 text-green-600" />
          </div>

          <h3 className="mt-2 text-center text-sm font-semibold text-gray-800">
            ফাইল আপলোড করুন বা ড্রপ করুন
          </h3>

          {/* <span className="mt-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-gray-600 shadow-sm">
            JPG • PNG • PDF
          </span> */}
        </div>
      </label>
    </>
  );
}
