/* eslint-disable @typescript-eslint/no-explicit-any */
import { Label } from "@radix-ui/react-dropdown-menu";
import { FieldError, UseFormRegister } from "react-hook-form";
import { Input } from "../ui/input";
type TCustomInputClickable = {
  name: string;
  placeholder: string;
  label: string;
  required?: boolean;
  type?: string;
  error?: FieldError;
  register: UseFormRegister<any>;
  readonly?: boolean;
  value?: string;
};
const CustomInputClickable = ({
  error,
  label,
  name,
  placeholder,
  register,
  readonly,
  required,
  type,
  value = "",
}: TCustomInputClickable) => {
  return (
    <div>
      <Label className="pb-1 lg:pb-0.5 flex items-center text-sm font-medium text-gray-600">
        {label}
        <span className="text-red-600">{required ? "*" : ""}</span>
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        readOnly={readonly}
        value={value ?? ""}
        {...register(name)}
        className="w-full h-8 rounded border border-gray-300 shadow-none placeholder:text-xs"
      />

      {error && (
        <p className="text-[14px] text-red-500 pt-2">{error.message}</p>
      )}
    </div>
  );
};

export default CustomInputClickable;
