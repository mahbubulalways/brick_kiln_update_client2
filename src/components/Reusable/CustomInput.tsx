/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";

type TCustomInput = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  rules?: RegisterOptions;
  readonly?: boolean;
};

const CustomInput = ({
  name,
  type,
  label,
  placeholder,
  rules,
  register,
  error,
  readonly = false,
}: TCustomInput) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col">
      {label && (
        <label className="text-gray-600 mb-1 font-medium text-[14px]" htmlFor={name}>
          {label}
          {rules && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={name}
          type={inputType}
          step={type === "number" ? "any" : undefined}
          readOnly={readonly}
          placeholder={placeholder}
          {...register(name, rules)}
          className={`w-full px-4 h-9  bg-white border-gray-300 rounded-lg ${error ? "border-red-500 border-2" : "border-gray-300 border"} focus:outline-none focus:ring-2 focus:ring-[#00664A] transition ${isPassword ? "pr-12" : ""
            } placeholder:text-gray-400 text-[14px]`}
        />

        {/* Show/Hide Icon */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-600 pt-0.5">{error.message}</p>}
    </div>
  );
};

export default CustomInput;
