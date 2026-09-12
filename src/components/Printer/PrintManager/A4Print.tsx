"use client";

import { ReactNode, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface B5PrintProps {
    children: ReactNode;
    documentTitle?: string;
}

const B5_PADDING = {
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
};

export default function B5Print({
    children,
    documentTitle = "document",
}: B5PrintProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = useReactToPrint({
        contentRef: printRef,

        documentTitle: `${documentTitle}-${Date.now()}`,

        onBeforePrint: async () => {
            setIsPrinting(true);
        },

        onAfterPrint: () => {
            setIsPrinting(false);
        },

        onPrintError: () => {
            setIsPrinting(false);
        },

        pageStyle: `
      @font-face {
        font-family: "Hind Siliguri";
        src: url("/fonts/HindSiliguri-Regular.woff2") format("woff2");
        font-weight: 400;
        font-style: normal;
        font-display: block;
      }

      @font-face {
        font-family: "Hind Siliguri";
        src: url("/fonts/HindSiliguri-Bold.woff2") format("woff2");
        font-weight: 700;
        font-style: normal;
        font-display: block;
      }

      @page {
        size: B5 portrait;
        margin: 0;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: 176mm !important;
        min-width: 176mm !important;
        max-width: 176mm !important;
        background: #ffffff !important;
        font-family: "Hind Siliguri", sans-serif !important;
      }

      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box !important;
        font-family: "Hind Siliguri", sans-serif !important;
      }

      .b5-print-wrapper {
        width: 176mm !important;
        min-width: 176mm !important;
        max-width: 176mm !important;

        margin: 0 !important;

        padding-top: ${B5_PADDING.top}mm !important;
        padding-bottom: ${B5_PADDING.bottom}mm !important;
        padding-left: ${B5_PADDING.left}mm !important;
        padding-right: ${B5_PADDING.right}mm !important;

        background: #ffffff !important;
        overflow: visible !important;
      }

      .b5-print-container {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #ffffff !important;
      }

      .b5-invoice {
        width: 100% !important;
        min-width: 0 !important;
        max-width: 100% !important;

        min-height: auto !important;
        height: auto !important;

        margin: 0 !important;
        padding: 0 !important;

        background: #ffffff !important;
        overflow: visible !important;
      }

      .b5-invoice-preview,
      .b5-invoice,
      .b5-combined-print {
        font-family: "Hind Siliguri", sans-serif !important;
      }

      .b5-invoice-preview *,
      .b5-invoice *,
      .b5-combined-print * {
        font-family: "Hind Siliguri", sans-serif !important;
      }

      .print-page-break {
        display: none !important;
      }

      .b5-print-button {
        display: none !important;
      }

      @media print {
        html,
        body {
          width: 176mm !important;
          min-width: 176mm !important;
          max-width: 176mm !important;
          margin: 0 !important;
          padding: 0 !important;
          overflow: visible !important;
        }

        .b5-print-wrapper,
        .b5-print-container {
          overflow: visible !important;
        }
      }
    `,
    });

    const handlePrintClick = () => {
        if (isPrinting) return;

        setIsPrinting(true);
        handlePrint();
    };

    return (
        <div className="flex w-full min-w-0 flex-col items-center">
            <div className="w-full min-w-0 overflow-x-auto overflow-y-visible">
                <div
                    ref={printRef}
                    className="b5-print-wrapper mx-auto w-full max-w-[667px] min-w-0 bg-white"
                >
                    <div className="b5-print-container w-full bg-white">
                        {children}
                    </div>
                </div>
            </div>

            <div className="b5-print-button mt-3 flex w-full justify-end">
                <button
                    type="button"
                    onClick={handlePrintClick}
                    disabled={isPrinting}
                    className={`rounded-md px-4 py-2 text-xs font-semibold text-white transition ${isPrinting
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-pink-800 hover:bg-pink-900"
                        }`}
                >
                    {isPrinting ? "প্রিন্ট হচ্ছে..." : "প্রিন্ট করুন"}
                </button>
            </div>
        </div>
    );
}