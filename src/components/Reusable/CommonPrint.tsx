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
};

const CommonPrint = forwardRef<TCommonPrintRef, TCommonPrintProps>(
  ({ children, title = "Print" }, ref) => {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
      contentRef: printRef,
      documentTitle: title,
      pageStyle: `
        @page {
          size: A4 portrait;
          margin: 0;
        }

        @media print {
          html,
          body {
            margin: 0 !important;
            padding: 0 !important;
          }

          body {
            overflow: visible !important;
          }
        }
      `,
    });

    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    return (
      <>
        <style>
          {`
            @font-face {
              font-family: "Hind Siliguri";
              src: url("/fonts/HindSiliguri-Regular.woff2") format("woff2");
              font-weight: 400;
              font-style: normal;
              font-display: block;
            }

            @font-face {
              font-family: "Hind Siliguri";
              src: url("/fonts/HindSiliguri-SemiBold.woff2") format("woff2");
              font-weight: 600;
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

            @media print {
              html,
              body {
                margin: 0 !important;
                padding: 0 !important;
              }
            }
          `}
        </style>

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
              margin: 0,
              padding: 0,
              fontFamily: '"Hind Siliguri", sans-serif',
            }}
          >
            {children}
          </div>
        </div>
      </>
    );
  }
);

CommonPrint.displayName = "CommonPrint";

export default CommonPrint;