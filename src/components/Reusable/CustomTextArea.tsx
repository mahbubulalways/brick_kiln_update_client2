/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  FieldError,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type TCustomTextArea = {
  label?: string;
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  rules?: RegisterOptions;
  readonly?: boolean;
  rows?: number;
};

const CustomTextArea = ({
  name,
  label,
  placeholder,
  rules,
  register,
  error,
  readonly = false,
  rows = 4,
}: TCustomTextArea) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-[14px] font-medium text-gray-700 mb-1"
        >
          {label}
          {rules && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        id={name}
        rows={rows}
        readOnly={readonly}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`
          w-full
          px-4
          py-2
          bg-white
          rounded-lg
          resize-none
          text-[14px]
          placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[#00664A]
          transition
          ${
            error
              ? "border-2 border-red-500"
              : "border border-gray-300"
          }
        `}
      />

      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 pt-0.5">
          {error.message}
        </p>
      )}
    </div>
  );
};

export default CustomTextArea;