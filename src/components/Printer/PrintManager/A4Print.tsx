"use client";

import { ReactNode, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

interface A4PrintProps {
  children: ReactNode;
  documentTitle?: string;
  copyType?: "single" | "double";
}

const PAGE_MARGIN_MM = 6;

const PRINT_CONFIG = {
  single: {
    pageSize: "A4 portrait",
    width: 210,
    height: 297,
    contentScale: 0.96,
  },
  double: {
    pageSize: "B5 portrait",
    width: 176,
    height: 250,
    contentScale: 1,
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

  const contentWidth = config.width - PAGE_MARGIN_MM * 2;

  const PREVIEW_SCALE = 0.8;

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
        size: ${config.width}mm ${config.height}mm;
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

      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        width: ${config.width}mm !important;
        height: ${config.height}mm !important;
        overflow: hidden !important;
        font-family: "HindSiliguri", sans-serif !important;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-adjust: exact !important;
      }

      .print-wrapper {
        position: relative !important;
        width: ${config.width}mm !important;
        height: ${config.height}mm !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
      }

      .print-content {
        position: absolute !important;

        top: ${PAGE_MARGIN_MM}mm !important;

        left: 50% !important;

        width: ${contentWidth}mm !important;
        max-width: ${contentWidth}mm !important;

        transform:
          translateX(-50%)
          scale(${config.contentScale}) !important;

        transform-origin: top center !important;

        margin: 0 !important;

        page-break-before: avoid !important;
        page-break-after: avoid !important;
        break-before: avoid !important;
        break-after: avoid !important;
      }

      .print-button {
        display: none !important;
      }

      .print-page-break {
        display: none !important;
      }
    `,
  });

  const handlePrintClick = () => {
    if (isPrinting) return;

    handlePrint();
  };

  return (
    <div className="flex w-full flex-col items-center">
      {/* Preview */}
      <div className="flex w-full justify-center overflow-auto">
        <div
          style={{
            width: `${config.width * PREVIEW_SCALE}mm`,
            height: `${config.height * PREVIEW_SCALE}mm`,
            flex: "0 0 auto",
          }}
        >
          <div
            ref={printRef}
            className="print-wrapper bg-white"
            style={{
              position: "relative",
              width: `${config.width}mm`,
              height: `${config.height}mm`,

              transform: `scale(${PREVIEW_SCALE})`,
              transformOrigin: "top left",

              margin: 0,
              padding: 0,

              boxSizing: "border-box",
              overflow: "hidden",

              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <div
              className="print-content"
              style={{
                position: "absolute",

                top: `${PAGE_MARGIN_MM}mm`,
                display: "flex",
                justifyContent: "center",
                left: "50%",

                width: `${contentWidth}mm`,
                maxWidth: `${contentWidth}mm`,

                transform: `
                  translateX(-50%)
                  scale(${config.contentScale})
                `,

                transformOrigin: "top center",

                margin: 0,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
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