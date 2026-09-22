"use client";

import { ReactNode, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface POSPrintProps {
  children: ReactNode;
  documentTitle?: string;
}

export default function POSPrint({
  children,
  documentTitle = "document",
}: POSPrintProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const printingLock = useRef(false);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${documentTitle}-${Date.now()}`,

    onBeforePrint: async () => {
      printingLock.current = true;
      setIsPrinting(true);
    },

    onAfterPrint: () => {
      printingLock.current = false;
      setIsPrinting(false);
    },

    onPrintError: () => {
      printingLock.current = false;
      setIsPrinting(false);
    },

    pageStyle: `
            @font-face {
                font-family: "HindSiliguri";
                src: url("/fonts/HindSiliguri-Regular.woff2") format("woff2");
                font-weight: 400;
                font-style: normal;
            }

            @font-face {
                font-family: "HindSiliguri";
                src: url("/fonts/HindSiliguri-SemiBold.woff2") format("woff2");
                font-weight: 600;
                font-style: normal;
            }

            @font-face {
                font-family: "HindSiliguri";
                src: url("/fonts/HindSiliguri-Bold.woff2") format("woff2");
                font-weight: 700;
                font-style: normal;
            }

            @page {
                size: 80mm auto;
                margin: 0 !important;
            }

            html,
            body {
                margin: 0 !important;
                padding: 0 !important;
                width: 80mm !important;
                min-width: 80mm !important;
                max-width: 80mm !important;
                background: white !important;
                color: #000 !important;
                font-family: "HindSiliguri", sans-serif;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            *,
            *::before,
            *::after {
                box-sizing: border-box !important;
            }

            .pos-print-wrapper {
                width: 80mm !important;
                min-width: 80mm !important;
                max-width: 80mm !important;
                margin: 0 auto !important;
                padding: 4mm !important;
                background: white !important;
                color: #000 !important;
                font-family: "HindSiliguri", sans-serif !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .pos-print-container {
                width: 100% !important;
                min-width: 0 !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                color: #000 !important;
                font-family: "HindSiliguri", sans-serif !important;
                visibility: visible !important;
                opacity: 1 !important;
            }

            .pos-print-container * {
                font-family: "HindSiliguri", sans-serif !important;
            }

            .pos-print-container svg {
                font-family: inherit !important;
            }

            .pos-print-button {
                display: none !important;
            }

            .print-page-break {
                page-break-before: always !important;
                break-before: page !important;
            }

            @media print {
                html,
                body {
                    width: 80mm !important;
                    min-width: 80mm !important;
                    max-width: 80mm !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    background: white !important;
                    color: #000 !important;
                }

                .pos-print-wrapper {
                    width: 80mm !important;
                    min-width: 80mm !important;
                    max-width: 80mm !important;
                    margin: 0 auto !important;
                    padding: 4mm !important;
                    overflow: visible !important;
                    background: white !important;
                    color: #000 !important;
                }

                .pos-print-container {
                    width: 100% !important;
                    min-width: 0 !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                    background: white !important;
                    color: #000 !important;
                }

                .pos-print-container * {
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                .pos-print-button {
                    display: none !important;
                }
            }
        `,
  });

  const handlePrintClick = () => {
    if (printingLock.current) {
      return;
    }

    printingLock.current = true;
    setIsPrinting(true);
    handlePrint();
  };

  return (
    <div className="flex w-full min-w-0 flex-col items-center">
      <div className="flex w-full min-w-0 justify-center overflow-x-auto overflow-y-visible">
        <div className="flex min-w-fit items-start justify-center gap-4">
          <div
            ref={printRef}
            className="pos-print-wrapper w-[80mm] min-w-[80mm] max-w-[80mm] shrink-0"
          >
            <div className="pos-print-container w-full min-w-0 max-w-full">
              {children}
            </div>
          </div>
        </div>
      </div>

      <div className="pos-print-button mt-3 flex w-full justify-center">
        <button
          type="button"
          onClick={handlePrintClick}
          disabled={isPrinting}
          className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition ${isPrinting
              ? "cursor-not-allowed bg-gray-400"
              : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isPrinting ? "প্রিন্ট হচ্ছে..." : "প্রিন্ট করুন"}
        </button>
      </div>
    </div>
  );
}