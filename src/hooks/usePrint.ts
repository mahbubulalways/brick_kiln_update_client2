"use client";

import { useCallback, useRef } from "react";
import { useReactToPrint } from "react-to-print";

type PrintRef = React.RefObject<HTMLElement | null>;

export const usePrint = () => {
  const a4Ref = useRef<HTMLElement | null>(null);
  const pos80Ref = useRef<HTMLElement | null>(null);
  const pos58Ref = useRef<HTMLElement | null>(null);

  // =========================================================
  // A4 PRINT
  // Canon 6030 / Epson L3250
  // =========================================================
  const printA4Handler = useReactToPrint({
    contentRef: a4Ref,
    documentTitle: "Invoice-A4",

    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 8mm;
      }

      @media print {
        html,
        body {
          width: 100%;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  // =========================================================
  // POS 80MM PRINT
  // Xprinter XP-350
  // =========================================================
  const printPOS80Handler = useReactToPrint({
    contentRef: pos80Ref,
    documentTitle: "Invoice-POS-80mm",

    pageStyle: `
      @page {
        size: 80mm auto;
        margin: 0;
      }

      @media print {
        html,
        body {
          width: 80mm !important;
          min-width: 80mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  // =========================================================
  // POS 58MM PRINT
  // Xprinter 58mm
  // =========================================================
  const printPOS58Handler = useReactToPrint({
    contentRef: pos58Ref,
    documentTitle: "Invoice-POS-58mm",

    pageStyle: `
      @page {
        size: 58mm auto;
        margin: 0;
      }

      @media print {
        html,
        body {
          width: 58mm !important;
          min-width: 58mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: #fff !important;
        }

        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `,
  });

  // =========================================================
  // PUBLIC FUNCTIONS
  // =========================================================

  const printA4 = useCallback(
    (ref?: PrintRef) => {
      if (ref) {
        // External ref support
        const original = a4Ref.current;

        try {
          a4Ref.current = ref.current;
          printA4Handler();
        } finally {
          a4Ref.current = original;
        }

        return;
      }

      printA4Handler();
    },
    [printA4Handler],
  );

  const printPOS80 = useCallback(
    (ref?: PrintRef) => {
      if (ref) {
        const original = pos80Ref.current;

        try {
          pos80Ref.current = ref.current;
          printPOS80Handler();
        } finally {
          pos80Ref.current = original;
        }

        return;
      }

      printPOS80Handler();
    },
    [printPOS80Handler],
  );

  const printPOS58 = useCallback(
    (ref?: PrintRef) => {
      if (ref) {
        const original = pos58Ref.current;

        try {
          pos58Ref.current = ref.current;
          printPOS58Handler();
        } finally {
          pos58Ref.current = original;
        }

        return;
      }

      printPOS58Handler();
    },
    [printPOS58Handler],
  );

  return {
    // Refs
    a4Ref,
    pos80Ref,
    pos58Ref,

    // Print functions
    printA4,
    printPOS80,
    printPOS58,
  };
};
