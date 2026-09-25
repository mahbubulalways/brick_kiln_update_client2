import { ReactElement, ReactNode } from "react";
import { toast } from "sonner";
import { CheckCircle2, Info, XCircle } from "lucide-react";

type ToastType = "success" | "error" | "info";

type ToastOptions = {
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: ReactElement<any, any>;
  duration?: number;
};

type TToast = {
  title: string;
  type: ToastType;
  options?: ToastOptions;
};

export const showToast = ({
  title,
  type,
  options = {},
}: TToast) => {
  const defaultIcon =
    type === "success" ? (
      <CheckCircle2 className="h-5 w-5" />
    ) : type === "error" ? (
      <XCircle className="h-5 w-5" />
    ) : (
      <Info className="h-5 w-5" />
    );

  toast(title, {
    description: options.description,
    icon: options.icon || defaultIcon,
    duration: options.duration || 2000,
    position: "top-center",
    style: {
      backgroundColor:
        type === "success"
          ? "#039A63"
          : type === "error"
            ? "#ef4444"
            : "#DA851D",
      color: "white",
      fontWeight: "bold",
      border: "none",
    },
  });
};