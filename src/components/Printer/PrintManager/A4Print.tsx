"use client";

import { ReactNode, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface A4PrintProps {
  children: ReactNode;
  documentTitle?: string;
  copyType?: "single" | "double";
}

const PRINT_CONFIG = {
  single: {
    width: 210,
    height: 297,
    margin: 6,
  },
  double: {
    width: 250,
    height: 176,
    margin: 0,
  },
} as const;

export default function A4Print({
  children,
  documentTitle = "document",
  copyType = "single",
}: A4PrintProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const config = PRINT_CONFIG[copyType];

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
      @page {
        size: ${copyType === "single"
        ? "A4 portrait"
        : `${config.width}mm ${config.height}mm`
      };

        margin: 0 !important;
      }

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

      *,
      *::before,
      *::after {
        box-sizing: border-box !important;

        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;

        font-family: "HindSiliguri", sans-serif !important;

        ${copyType === "single"
        ? `
              width: 210mm !important;
              min-width: 210mm !important;
              max-width: 210mm !important;

              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;

              overflow: hidden !important;
            `
        : `
              width: ${config.width}mm !important;
              height: ${config.height}mm !important;
              overflow: hidden !important;
            `
      }
      }

      /* =========================
         SINGLE A4
      ========================== */

      ${copyType === "single"
        ? `
            .print-wrapper {
              position: relative !important;

              width: 210mm !important;
              min-width: 210mm !important;
              max-width: 210mm !important;

              height: 297mm !important;
              min-height: 297mm !important;
              max-height: 297mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }

            .print-content {
              position: absolute !important;

              top: 6mm !important;
              left: 6mm !important;

              width: 198mm !important;
              max-width: 198mm !important;

              height: 285mm !important;
              max-height: 285mm !important;

              margin: 0 !important;
              padding: 0 !important;

              transform: none !important;
              transform-origin: unset !important;

              overflow: hidden !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }

            .print-content > * {
              width: 100% !important;
              max-width: 100% !important;

              max-height: 285mm !important;

              margin-left: auto !important;
              margin-right: auto !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }
          `
        : ""
      }

      /* =========================
         DOUBLE
      ========================== */

      ${copyType === "double"
        ? `
            .print-wrapper {
              position: relative !important;

              width: 250mm !important;
              max-width: 250mm !important;

              height: 176mm !important;
              max-height: 176mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }

            .print-content {
              position: absolute !important;

              top: 0 !important;
              left: 0 !important;

              width: 250mm !important;
              max-width: 250mm !important;

              height: 176mm !important;
              max-height: 176mm !important;

              margin: 0 !important;
              padding: 0 !important;

              transform: none !important;

              overflow: hidden !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }

            .a4-combined-print {
              width: 250mm !important;
              max-width: 250mm !important;

              height: 176mm !important;
              max-height: 176mm !important;

              display: grid !important;

              grid-template-columns: 125mm 125mm !important;

              gap: 0 !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              page-break-before: avoid !important;
              page-break-after: avoid !important;
              page-break-inside: avoid !important;

              break-before: avoid !important;
              break-after: avoid !important;
              break-inside: avoid !important;
            }

            .a4-combined-print > * {
              width: 125mm !important;
              min-width: 125mm !important;
              max-width: 125mm !important;

              height: 176mm !important;
              max-height: 176mm !important;

              margin: 0 !important;
              padding: 0 !important;

              overflow: hidden !important;

              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          `
        : ""
      }

      /* Hide print button */

      .print-button {
        display: none !important;
      }

      .print-page-break {
        display: none !important;
      }

      /* Prevent common elements from creating extra pages */

      table {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      tr,
      td,
      th {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }

      img {
        max-width: 100% !important;
      }
    `,
  });

  const handlePrintClick = () => {
    if (isPrinting) return;

    handlePrint();
  };

  return (
    <div
      ref={printRef}
      className="print-wrapper w-full"
    >
      <div className="print-content">
        {children}
      </div>

      <div className="print-button mt-3 flex w-full justify-end">
        <button
          type="button"
          onClick={handlePrintClick}
          disabled={isPrinting}
          className="rounded-md bg-[#039A63] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#027d50] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPrinting ? "প্রিন্ট হচ্ছে..." : "প্রিন্ট করুন"}
        </button>
      </div>
    </div>
  );
}