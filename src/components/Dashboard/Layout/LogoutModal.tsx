"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { MdLogout } from "react-icons/md";

type TLogoutModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfrqam: () => void;
  isLoading: boolean;
};

const LogoutModal = ({
  isOpen,
  onClose,
  onConfrqam,
  isLoading,
}: TLogoutModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-white" />

          <p className="mt-4 text-sm font-medium text-white">
            লগআউট হচ্ছে...
          </p>
        </div>
      ) : (
        <div className="mx-5 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50">
                <MdLogout className="h-5 w-5 text-red-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-800">
                লগআউট
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-7 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
              <MdLogout className="h-10 w-10 text-red-600" />
            </div>

            <h3 className="mt-5 text-xl font-semibold text-gray-800">
              আপনি কি লগআউট করতে চান?
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              লগআউট করলে আপনার বর্তমান সেশন শেষ হয়ে যাবে।
              <br />
              পরবর্তীতে আবার লগইন করতে হবে।
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
            >
              বাতিল
            </button>

            <button
              type="button"
              onClick={onConfrqam}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              <MdLogout className="h-5 w-5" />
              লগআউট
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default LogoutModal;