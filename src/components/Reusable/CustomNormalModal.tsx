import { ReactNode } from "react";
type TModalWidth = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

const widthClasses: Record<TModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  xxl:" max-w-3xl",
  full: "max-w-5xl",
};

type TCustomNormalModal = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: TModalWidth;
};

const CustomNormalModal = ({
  isOpen,
  onClose,
  children,
  width="lg",
}: TCustomNormalModal) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 px-3 z-50 flex items-center justify-center bg-black/40 "
      onClick={onClose}
    >
      <div
          className={`relative bg-white w-full ${widthClasses[width]} 
        md:rounded-md rounded-2xl shadow-xl
        h-auto max-h-[90vh]
        flex flex-col overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* <div className="flex px-3 pt-2 items-center justify-between sticky top-0 bg-[#F8FAFC] border-b shadow-sm pb-2">
          <button
            className="text-black bg-gray-200 p-1 rounded-full duration-200 cursor-pointer hover:bg-red-600 hover:text-white"
            onClick={onClose}
          >
            <HiXMark size={20} />
          </button>
        </div> */}

        {/* Body */}
        <div className="p-3 max-h-[90vh] overflow-scroll">{children}</div>
      </div>
    </div>
  );
};

export default CustomNormalModal;
