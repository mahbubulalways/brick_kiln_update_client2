import { ButtonHTMLAttributes } from "react";
import { FiPrinter } from "react-icons/fi";

type CustomPrintButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const CustomPrintButton = ({
  className = "",
  ...props
}: CustomPrintButtonProps) => {
  return (
    <button
      {...props}
      type="button"
      className={`
        flex
        w-full
        items-center
        justify-center
        gap-2
        bg-white
        text-[#039A63]
        px-2
        lg:px-3
        py-1.5
        rounded
        border
        border-[#039A63]
        hover:bg-[#039A63]
        hover:text-white
        transition
        cursor-pointer
        ${className}
      `}
    >
      <FiPrinter className="h-4 w-4" />
      <span className="hidden lg:block text-[15px]">প্রিন্ট</span>
    </button>
  );
};

export default CustomPrintButton;