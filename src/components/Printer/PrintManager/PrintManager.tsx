"use client";

import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { PrintDocumentType, PrintPaperSize } from "../types";
import { defaultPrintConfig } from "../print-config";
import PrintPreview from "../PrintPreview/PrintPreview";



interface PrintManagerProps {
    documentType: PrintDocumentType;
    data: any;
    onClose?: () => void;
}

export default function PrintManager({
    documentType,
    data,
    onClose,
}: PrintManagerProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const defaultDocument =
        defaultPrintConfig.documents[
        documentType
        ];

    const [paperSize, setPaperSize] =
        useState<PrintPaperSize>(
            defaultDocument?.paperSize ??
            defaultPrintConfig.defaultPaperSize
        );

    const [copies, setCopies] =
        useState(
            //   defaultDocument?.copies ??
            defaultPrintConfig.defaultCopies
        );

    const handlePrint = useReactToPrint({
        contentRef: printRef,

        documentTitle: `${documentType}-${Date.now()}`,

        onAfterPrint: () => {
            onClose?.();
        },

        pageStyle: `
      @page {
        size: ${paperSize === "A4"
                ? "A4"
                : "80mm auto"
            };

        margin: ${paperSize === "A4"
                ? "10mm"
                : "0"
            };
      }

      @media print {
        html,
        body {
          margin: 0 !important;
          padding: 0 !important;
        }

        .print-container {
          width: ${paperSize === "A4"
                ? "210mm"
                : "80mm"
            };

          margin: 0 auto;
        }

        .no-print {
          display: none !important;
        }
      }
    `,
    });

    const handlePrintClick = () => {
        if (!printRef.current) {
            return;
        }

        for (let i = 0; i < copies; i++) {
            handlePrint();
        }
    };

    return (
        <>
            {/* Print Settings Modal */}

            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">

                    <h2 className="mb-5 text-xl font-bold">
                        Print Settings
                    </h2>

                    {/* Paper Size */}

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium">
                            Paper Size
                        </label>

                        <div className="grid grid-cols-2 gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setPaperSize("A4")
                                }
                                className={`rounded-lg border p-3 ${paperSize === "A4"
                                    ? "border-green-600 bg-green-50 text-green-700"
                                    : "border-gray-200"
                                    }`}
                            >
                                A4
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setPaperSize("POS_80")
                                }
                                className={`rounded-lg border p-3 ${paperSize === "POS_80"
                                    ? "border-green-600 bg-green-50 text-green-700"
                                    : "border-gray-200"
                                    }`}
                            >
                                POS 80mm
                            </button>

                        </div>
                    </div>

                    {/* Copies */}

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium">
                            Copies
                        </label>

                        <div className="flex items-center gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setCopies((prev) =>
                                        Math.max(1, prev - 1)
                                    )
                                }
                                className="h-10 w-10 rounded-lg border"
                            >
                                -
                            </button>

                            <div className="flex h-10 w-16 items-center justify-center rounded-lg border">
                                {copies}
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setCopies((prev) =>
                                        Math.min(10, prev + 1)
                                    )
                                }
                                className="h-10 w-10 rounded-lg border"
                            >
                                +
                            </button>

                        </div>
                    </div>


                    <div className="flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border px-5 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handlePrintClick}
                            className="rounded-lg bg-green-600 px-5 py-2 text-white"
                        >
                            Print
                        </button>

                    </div>
                </div>
            </div>


            <div className="fixed left-[-99999px] top-0">
                <PrintPreview
                    ref={printRef}
                    documentType={documentType}
                    paperSize={paperSize}
                    data={data}
                />
            </div>
        </>
    );
}