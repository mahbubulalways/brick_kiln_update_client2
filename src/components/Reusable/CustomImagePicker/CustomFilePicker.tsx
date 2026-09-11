"use client";

import { useMemo, useState } from "react";
import {
  Controller,
  FieldError,
  RegisterOptions,
  useWatch,
} from "react-hook-form";

import UploadBox from "./UploadBox";
import FilePreviewCard from "./FilePreviewCard";
import FilePreviewModal from "./FilePreviewModal";

type CustomFilePickerProps = {
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

export default function CustomFilePicker({
  control,
  name,
  label,
  required = false,
  disabled = false,
  className = "",
  rules,
  error,
}: CustomFilePickerProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const file = useWatch({
    control,
    name,
  }) as File | null;

  const preview = useMemo(() => {
    if (!file || !file.type?.startsWith("image/")) {
      return null;
    }

    return URL.createObjectURL(file);
  }, [file]);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={null}
      render={({ field }) => {
        return (
          <div className={className}>
            {label && (
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {label}

                {required && <span className="ml-1 text-red-500">*</span>}
              </label>
            )}

            {file ? (
              <>
                <div
                  className="
                    grid
                    grid-cols-2
                    justify-center
                    gap-5
                    rounded-2xl
                    border-2
                    border-dashed
                    p-5
                  "
                >
                  <div>
                    <FilePreviewCard
                      file={file}
                      preview={preview ?? undefined}
                      onView={() => setModalOpen(true)}
                      onDelete={() => {
                        field.onChange(null);
                        setModalOpen(false);
                      }}
                    />
                  </div>

                  <UploadBox
                    className="h-10"
                    disabled={disabled}
                    onFileSelect={(newFile) => {
                      field.onChange(newFile);
                    }}
                  />
                </div>

                <FilePreviewModal
                  open={modalOpen}
                  file={file}
                  preview={preview}
                  onClose={() => setModalOpen(false)}
                />
              </>
            ) : (
              <UploadBox
                disabled={disabled}
                onFileSelect={(newFile) => {
                  field.onChange(newFile);
                }}
              />
            )}

            {error && (
              <p className="mt-2 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
}
