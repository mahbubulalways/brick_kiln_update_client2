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
    });

    useImperativeHandle(ref, () => ({
      print: handlePrint,
    }));

    return (
      <div
        style={{
          position: "absolute",
          left: "-99999px",
          top: 0,
          width: "100%",
        }}
      >
        <div ref={printRef} className="p-6">
          {children}
        </div>
      </div>
    );
  }
);

CommonPrint.displayName = "CommonPrint";

export default CommonPrint;