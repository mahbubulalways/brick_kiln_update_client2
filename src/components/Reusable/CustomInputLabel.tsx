/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@radix-ui/react-dropdown-menu";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";

type TCustomInputLabel = {
  name: string;
  placeholder: string;
  label: string;
  required?: boolean;
  type?: string;
  error?: FieldError;
  register: UseFormRegister<any>;
  readonly?: boolean;
  cls?: string;
  errMsg?: string;
  value?: string | number | null;
};

const CustomInputLabel = ({
  error,
  label,
  name,
  placeholder,
  register,
  readonly,
  required,
  type = "text",
  cls = "",
  errMsg,
  value,
}: TCustomInputLabel) => {
  return (
    <div className="w-full">
      <Label className="pb-1 lg:pb-0.5 flex items-center text-sm font-medium text-gray-600">
        {label}
        {/* {required && <span className="text-red-600">*</span>} */}
      </Label>

      <Input
        id={name}
        type={type}
        readOnly={readonly}
        placeholder={placeholder}
        {...register(name, required ? { required: errMsg } : {})}
        className={`w-full h-8 rounded border border-gray-300 shadow-none placeholder:text-sm ${cls}`}
      />

      {error && (
        <p className="text-[13px] text-red-500 pt-1">{error.message}</p>
      )}
    </div>
  );
};

export default CustomInputLabel;
