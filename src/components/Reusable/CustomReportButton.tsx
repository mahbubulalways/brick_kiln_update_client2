import { FiFileText } from "react-icons/fi";
import type { ButtonHTMLAttributes } from "react";

type CustomReportButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const CustomReportButton = ({
  className = "",
  children,
  ...props
}: CustomReportButtonProps) => {
  return (
    <button
      type="button"
      className={`flex cursor-pointer items-center justify-center gap-2 rounded border border-[#039A63] bg-white px-2 py-1.5 text-[#039A63] transition hover:bg-[#039A63] hover:text-white lg:px-2.5 ${className}`}
      {...props}
    >
      <FiFileText className="h-4 w-4" />

      <span className="hidden lg:block text-[15px]">{children || "রিপোর্ট"}</span>
    </button>
  );
};

export default CustomReportButton;
