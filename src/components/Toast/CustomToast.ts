// utils/showToast.ts
import { toast } from "sonner";
import { ReactElement, ReactNode } from "react";

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

export const showToast = ({ title, type, options = {} }: TToast) => {
  toast(title, {
    description: options.description,
    icon: options.icon as ReactNode,
    duration: options.duration || 4000,
    position: "top-center",
    style: {
      backgroundColor:
        type === "success"
          ? "#039A63"
          : type === "error"
            ? "#ef4444"
            : "#DA851D",
      color: "white",
      padding: "14px 20px",
      borderRadius: "12px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      textAlign: "center",
      lineHeight: "1.4",
      fontSize: "14px",
      fontWeight: "bold",
    },
  });
};
