import { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";

type TModalWidth = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

const widthClasses: Record<TModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  xxl:" max-w-3xl",
  full: "max-w-5xl",
};

type TCustomModalBottom = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: TModalWidth;
  title?: string;
};

const CustomModalBottom = ({
  isOpen,
  onClose,
  children,
  width = "md",
  title,
}: TCustomModalBottom) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className={`relative bg-white w-full ${widthClasses[width]} 
        md:rounded-md rounded-t-2xl shadow-xl
        h-[90vh] md:h-auto md:max-h-[90vh]
        flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-4 bg-slate-50 border-b">
          <h1 className="text-2xl font-semibold">{title}</h1>

          <button
            onClick={onClose}
            className="p-2 cursor-pointer rounded-full bg-gray-200 hover:bg-red-600 hover:text-white transition"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
};

export default CustomModalBottom;
