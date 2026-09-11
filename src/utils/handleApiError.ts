import { showToast } from "@/components/Toast/CustomToast";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type HandleApiErrorOptions = {
  error: any;
  notFoundMessage?: string;
  defaultMessage?: string;
};

type ApiErrorData = {
  message?: string;
};

const isBangla = (text: string) => {
  return /[\u0980-\u09FF]/.test(text);
};

export const handleApiError = ({
  error,
  notFoundMessage = "তথ্য পাওয়া যায়নি",
  defaultMessage = "সার্ভারে সমস্যা হয়েছে",
}: HandleApiErrorOptions) => {
  const apiError = error as FetchBaseQueryError;

  // ==========================================
  // Internet / Server connection error
  // ==========================================
  if (apiError?.status === "FETCH_ERROR") {
    showToast({
      title: navigator.onLine
        ? "সার্ভারের সাথে সংযোগ করা যাচ্ছে না"
        : "ইন্টারনেট সংযোগ নেই",
      type: "error",
    });

    return;
  }

  // ==========================================
  // Backend error message
  // ==========================================
  if (apiError?.data && typeof apiError.data === "object") {
    const data = apiError.data as ApiErrorData;
    if (data.message && typeof data.message === "string") {
      // Backend থেকে Bangla message এলে সেটাই দেখাবে
      if (isBangla(data.message)) {
        showToast({
          title: data.message,
          type: "error",
        });

        return;
      }
    }
  }

  // ==========================================
  // 404
  // ==========================================
  if (apiError?.status === 404) {
    showToast({
      title: notFoundMessage,
      type: "error",
    });

    return;
  }

  // ==========================================
  // Other / Prisma / Database / Internal Error
  // ==========================================
  showToast({
    title: defaultMessage,
    type: "error",
  });
};