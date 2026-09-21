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

      fonts: [
        {
          family: "Hind Siliguri",
          source: "/fonts/HindSiliguri-Regular.woff2",
          weight: "400",
          style: "normal",
        },
        {
          family: "Hind Siliguri",
          source: "/fonts/HindSiliguri-SemiBold.woff2",
          weight: "600",
          style: "normal",
        },
        {
          family: "Hind Siliguri",
          source: "/fonts/HindSiliguri-Bold.woff2",
          weight: "700",
          style: "normal",
        },
      ],

      pageStyle: `
        @page {
          size: A4 portrait;
          margin: 0;
        }

        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
        }

        body {
          overflow: visible !important;
          font-family: "Hind Siliguri", sans-serif !important;
        }

        * {
          box-sizing: border-box;
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
              font-display: swap;
            }

            @font-face {
              font-family: "Hind Siliguri";
              src: url("/fonts/HindSiliguri-SemiBold.woff2") format("woff2");
              font-weight: 600;
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
              padding: "8mm",
              boxSizing: "border-box",
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