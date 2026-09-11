import { FiPlus } from "react-icons/fi";

interface CustomNewButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
}

const CustomNewButton = ({
  title,
  className = "",
  ...props
}: CustomNewButtonProps) => {
  return (
    <button
      type="button"
      className={`bg-[#039A63] text-white px-2 lg:px-3 py-[5px] text-[15px] rounded font-medium hover:bg-[#028a58] transition w-auto flex items-center justify-center gap-2 cursor-pointer ${className}`}
      {...props}
    >
      <FiPlus className="h-5 w-5 lg:hidden" />
      <span className="hidden lg:block">{title}</span>
    </button>
  );
};

export default CustomNewButton;