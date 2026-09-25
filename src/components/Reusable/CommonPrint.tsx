"use client";

import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";
import { useReactToPrint } from "react-to-print";

export type TCommonPrintRef = {
  print: () => void;
};

type TCommonPrintProps = {
  children: React.ReactNode;
  title?: string;
  onAfterPrint?: () => void;
};

const CommonPrint = forwardRef<TCommonPrintRef, TCommonPrintProps>(
  ({ children, title = "Print", onAfterPrint }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      contentRef: printRef,
      documentTitle: title,
      pageStyle: `
                @font-face {
                    font-family: "Hind Siliguri";
                    src: url("/fonts/HindSiliguri-Regular.woff2") format("woff2");
                    font-weight: 400;
                    font-style: normal;
                    font-display: swap;
                }

                @font-face {
                    font-family: "Hind Siliguri";
                    src: url("/fonts/HindSiliguri-Bold.woff2") format("woff2");
                    font-weight: 700;
                    font-style: normal;
                    font-display: swap;
                }

                @page {
                    size: A4 portrait;
                    margin: 0;
                }

                html,
                body {
                    margin: 0 !important;
                    padding: 0 !important;
                    width: 210mm !important;
                    min-width: 210mm !important;
                }

                body {
                    font-family:
                        "Hind Siliguri",
                        "Noto Sans Bengali",
                        sans-serif !important;

                    overflow: visible !important;

                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                * {
                    box-sizing: border-box;
                }
            `,
      onAfterPrint,
    });

    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    return (
      <div
        style={{
          position: "absolute",
          left: "-100000px",
          top: 0,
          width: "210mm",
          overflow: "hidden",
        }}
      >
        <div
          ref={printRef}
          style={{
            width: "210mm",
            minHeight: "297mm",
            margin: 0,
            padding: "6mm",
            boxSizing: "border-box",
            fontFamily:
              '"Hind Siliguri", "Noto Sans Bengali", sans-serif',
          }}
        >
          {children}
        </div>
      </div>
    );
  }
);

CommonPrint.displayName = "CommonPrint";

export default CommonPrint;