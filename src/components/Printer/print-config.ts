import { PrintDocumentType, PrintPaperSize } from "./types";

export interface DocumentPrintConfig {
  paperSize: PrintPaperSize;
  autoPrint: boolean;
}

export interface PrintConfig {
  defaultPaperSize: PrintPaperSize;
  defaultCopies: number;

  documents: Record<PrintDocumentType, DocumentPrintConfig>;
}

export const defaultPrintConfig: PrintConfig = {
  defaultPaperSize: "A4",
  defaultCopies: 1,

  documents: {
    invoice: {
      paperSize: "A4",
      autoPrint: false,
    },

    ledger: {
      paperSize: "A4",
      autoPrint: false,
    },

    delivery: {
      paperSize: "POS_80",
      autoPrint: false,
    },

    challan: {
      paperSize: "A4",
      autoPrint: false,
    },

    payment: {
      paperSize: "POS_80",
      autoPrint: false,
    },

    due: {
      paperSize: "A4",
      autoPrint: false,
    },

    report: {
      paperSize: "A4",
      autoPrint: false,
    },

    cash: {
      paperSize: "A4",
      autoPrint: false,
    },
  },
};
