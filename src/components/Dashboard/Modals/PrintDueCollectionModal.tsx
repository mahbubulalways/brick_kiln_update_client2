"use client";

import CustomNormalModal from "@/components/Reusable/CustomNormalModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { IDueResponse } from "@/interface/due";
import { useGetSingleDueQuery } from "@/redux/features/dueCollection.features";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useReactToPrint } from "react-to-print";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: string | undefined;
  setDueId: Dispatch<SetStateAction<string | undefined>>;
};

const PrintDueCollectionModal = ({
  isOpen,
  onClose,
  id,
  setDueId,
}: TCustomModal) => {

  const { isError, isLoading, data, refetch } = useGetSingleDueQuery(id, {
    refetchOnMountOrArgChange: true,
  });

  const [isBothPrint, setIsBothPrint] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      setIsBothPrint(false);

      const secondDiv = document.getElementById("dueCollection2");

      if (secondDiv) {
        secondDiv.innerHTML = "";
      }
    },
  });

  const handleBothPrint = () => {
    const double = document.getElementById("dueCollection");
    const secondDiv = document.getElementById("dueCollection2");

    if (double && secondDiv) {
      const clone = double.cloneNode(true) as HTMLElement;

      // Duplicate ID remove
      clone.removeAttribute("id");

      // Office copy text change
      const receiptCopy = clone.querySelector(
        ".receipt-copy"
      ) as HTMLElement | null;

      if (receiptCopy) {
        receiptCopy.textContent = "অফিস কপি";
      }

      secondDiv.innerHTML = "";
      secondDiv.appendChild(clone);

      setIsBothPrint(true);

      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  };

  const dueInfo = data?.data as IDueResponse;

  const handleClose = () => {
    onClose();
    setDueId(undefined);
    setIsBothPrint(false);
  };

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id, refetch]);


  
  return (
    <CustomNormalModal
      isOpen={isOpen}
      onClose={handleClose}
      width="xxl"

    >
      {isLoading ? (

        <CustomStatus type="loading" />

      ) : isError || !dueInfo ? (

        <CustomStatus type="error" />

      ) : (
        <div className="w-full">
          {/* PRINT OPTIONS */}
          <div className="px-5 pt-5">
            <h2 className="mb-4 text-center text-lg">
              প্রিন্ট অপশন সিলেক্ট করুন
            </h2>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {/* A4 CUSTOMER */}
              <button
                onClick={handlePrint}
                className="cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white transition hover:bg-emerald-700"
              >
                🧾 A4 (কাস্টমার)
              </button>

              {/* A4 CUSTOMER + OFFICE */}
              <button
                onClick={handleBothPrint}
                className="cursor-pointer rounded-lg bg-emerald-600 px-3 py-1.5 text-xs text-white transition hover:bg-emerald-700"
              >
                🧾 A4 (কাস্টমার+অফিস)
              </button>

              <div className="mx-2 hidden h-8 w-px bg-gray-300 sm:block" />

              {/* POS CUSTOMER */}
              <button
                onClick={handlePrint}
                className="cursor-pointer rounded-lg bg-orange-600 px-3 py-1.5 text-xs text-white transition hover:bg-orange-700"
              >
                🧾 POS (কাস্টমার)
              </button>

              {/* POS CUSTOMER + OFFICE */}
              <button
                onClick={handleBothPrint}
                className="cursor-pointer rounded-lg bg-orange-600 px-3 py-1.5 text-xs text-white transition hover:bg-orange-700"
              >
                🧾 POS (কাস্টমার+অফিস)
              </button>
            </div>
          </div>

          {/* PRINT CONTENT */}
          <div
            ref={contentRef}
            className={`grid ${isBothPrint ? "grid-cols-2" : "grid-cols-1"
              } w-full gap-2 px-5 pt-5`}
          >
            {/* CUSTOMER COPY */}
            <div
              id="dueCollection"
              className="
                mx-auto
                w-full
                rounded-lg
                border
                border-gray-200
                bg-white
                px-5
                py-5
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  

                  <div className="pt-1">
                    <h1 className="text-xl font-extrabold leading-none">
                      জমা রশিদ
                    </h1>

                    <p className="mt-1 text-xs leading-5">
                      হিলিপাড়া, কাটাবাড়ি, গাইবান্ধা
                    </p>

                    <p className="text-[12px] leading-5">
                      ০১৯১০৩৪৯১৯১, ০১৯১০৩৪৯১৯৩
                    </p>

                    <p className="text-[12px] leading-5">
                      <span>প্রোপ্রাইটরঃ  মোঃ মানিক মিয়া</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <h2 className="text-xl font-black leading-none ">
                    RECEIPT
                  </h2>

                  <p className="receipt-copy mt-1 text-xs ">
                    গ্রাহক কপি
                  </p>

                  <p className="mt-1 text-xs">
                    প্রিন্টঃ{" "}
                    <span>
                      {formatBanglaDate({
                        date: new Date(),
                        showTime: true,
                      })}
                    </span>
                  </p>
                </div>
              </div>

              <div className="my-4 border-t border-gray-300" />

              {/* CUSTOMER INFO */}
              <div className="flex items-start justify-between">
                <div className="space-y-1 text-xs">
                  <p>
                    কাস্টমার আইডিঃ{" "}
                    <span>
                      {toBanglaNumber(dueInfo?.customer.customerCode)}
                    </span>
                  </p>

                  <p>
                    জমা তারিখঃ{" "}
                    <span>
                      {formatBanglaDate({
                        date: dueInfo?.createdAt,
                        showTime: false,
                      })}
                    </span>
                  </p>

                  <p>
                    সময়ঃ{" "}
                    <span>
                      {formatBanglaDate({
                        date: dueInfo.createdAt,
                        showTime: true,
                        showDate: false,
                      })}
                    </span>
                  </p>
                </div>

                <div className="text-right text-xs">
                  <p >
                    {dueInfo?.customer?.name }
                  </p>

                  <p>
                    {dueInfo?.customer?.address }
                  </p>

                  <p className="mt-1">
                    {toBanglaNumber(
                      dueInfo?.customer?.phoneNumber
                    )}
                  </p>
                </div>
              </div>

              {/* PAYMENT BOX */}
              <div className="mt-3 rounded-lg border border-gray-200 p-4">
                <div className="grid grid-cols-1 gap-5">
                  {/* LEFT */}
                  <div className="flex-1">
                    <h3 className="text-xs  underline underline-offset-4">
                      বিশেষ দ্রষ্টব্যঃ
                    </h3>

                    <div className="mt-2 space-y-2 text-xs leading-6 text-gray-900">
                      <p>
                        ১। চালান অথবা রশিদ ছাড়া কোনো লেনদেন করবেন না।
                      </p>

                      <p>
                        ২। স্বাক্ষর করার পূর্বে টাকার পরিমাণ ও তারিখ
                        দেখে নিন।
                      </p>
                    </div>

                    {/* PAYMENT DATE */}
                    <div className="mt-2 rounded-xl border border-red-500 px-4 py-4 text-center">
                      <p className="text-xs text-red-500">
                        পরিশোধের তারিখঃ
                      </p>

                      <p className="mt-1 text-xs text-red-500">
                        {formatBanglaDate({
                          date: dueInfo?.createdAt,
                          showTime: false,
                        })}
                      </p>
                    </div>
                  </div>

                  {/* RIGHT BALANCE */}
                  <div>
                    <div className="rounded-xl bg-gray-100 px-4 py-3">
                      <div className="flex items-center justify-between py-1.5 text-xs">
                        <span>মোট বাকি ছিল</span>

                        <span>
                          ৳{" "}
                          {toBanglaNumber(
                            Number(dueInfo?.due ?? 0)
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1.5 text-xs">
                        <span>জমা দেওয়া</span>

                        <span>
                          ৳{" "}
                          {toBanglaNumber(
                            Number(
                              dueInfo?.collect ?? 0
                            ).toLocaleString("en-IN")
                          )}
                        </span>
                      </div>

                      <div className="my-2 border-t border-gray-300" />

                      <div className="flex items-center text-xs justify-between py-1 font-black">
                        <span>বর্তমান বাকি</span>

                        <span>
                          ৳{" "}
                          {toBanglaNumber(
                            dueInfo?.due - dueInfo?.collect
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SIGNATURE */}
              <div className="mt-12 flex items-end justify-between px-10">
                <div className="w-[165px] text-center">
                  <div className="border-t border-gray-700" />

                  <p className="mt-1 text-xs">
                    গ্রাহকের স্বাক্ষর
                  </p>
                </div>

                <div className="w-[185px] text-center">
                  <div className="border-t border-gray-700" />

                  <p className="mt-1 text-xs">
                    ম্যানেজারের স্বাক্ষর
                  </p>
                </div>
              </div>
            </div>

            {/* OFFICE COPY */}
            <div id="dueCollection2" />
          </div>
        </div>
      )}
    </CustomNormalModal>
  );
};

export default PrintDueCollectionModal;