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
      className={`flex cursor-pointer items-center justify-center gap-2 text-[15px]
         rounded border border-[#039A63] bg-white px-2 lg:px-3 py-[5px]
          text-[#039A63] font-medium transition hover:bg-[#039A63] hover:text-white 
           ${className}`}
      {...props}
    >
      <FiFileText className="h-4 w-4" />
      {/* hidden lg:block  */}
      <span className="text-[15px]">{children || "রিপোর্ট"}</span>
    </button>
  );
};

export default CustomReportButton;
