import { ReactNode } from "react";
import { HiXMark } from "react-icons/hi2";
type TModalWidth = "sm" | "md" | "lg" | "xl" | "xxl" | "full";

const widthClasses: Record<TModalWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  xxl: "max-w-3xl",
  full: "max-w-5xl",
};

type TCustomReportModal = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  width?: TModalWidth;
  title?: string;
};

const CustomReportModal = ({
  isOpen,
  onClose,
  children,
  width = "md",
  title,
}: TCustomReportModal) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 "
      onClick={onClose}
    >
      <div
        className={`relative bg-white mx-3 w-full ${widthClasses[width]} 
        md:rounded-md rounded-2xl shadow-xl
       h-[70vh] md:h-[80vh] md:max-h-[80vh]
        flex flex-col overflow-auto animate-zoomSlideIn no-scrollbar`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex px-3  items-center justify-between sticky top-0 bg-[#039A63] border-b shadow-sm py-3">
          <h1 className="font-medium text-white text-xl  mx-auto">{title}</h1>
          {/* <button
            className="text-black bg-gray-200 p-1 rounded-full duration-200 cursor-pointer hover:bg-red-600 hover:text-white"
            onClick={onClose}
          >
            <HiXMark size={20} />
          </button> */}
        </div>

        {/* Body */}
        <div className="p-3">{children}</div>
      </div>

      {/* Combined zoom + slide animation */}
      <style jsx>{`
        @keyframes zoomSlideIn {
          0% {
            transform: translate(200px, -200px) scale(0.6); /* further top-right */
            opacity: 0;
          }
          60% {
            transform: translate(-10px, 10px) scale(1.03); /* slight overshoot */
            opacity: 1;
          }
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
        }

        .animate-zoomSlideIn {
          animation: zoomSlideIn 0.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default CustomReportModal;
