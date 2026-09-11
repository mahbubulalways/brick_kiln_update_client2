export type PrintDocumentType =
  | "invoice"
  | "ledger"
  | "delivery"
  | "challan"
  | "payment"
  | "due"
  | "report"
  | "cash";

export type PrintPaperSize = "A4" | "POS_80";

export interface PrintOptions {
  documentType: PrintDocumentType;
  paperSize: PrintPaperSize;
  autoPrint?: boolean;
}

export interface PrintRequest<T = unknown> {
  documentType: PrintDocumentType;
  data: T;
  options?: Partial<PrintOptions>;
}
