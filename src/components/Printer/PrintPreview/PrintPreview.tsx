"use client";

import { forwardRef } from "react";
import { PrintDocumentType, PrintPaperSize } from "../types";
import InvoiceA4 from "../invoice/InvoiceA4";
import InvoicePOS80 from "../invoice/InvoicePOS80";



interface PrintPreviewProps {
    documentType: PrintDocumentType;
    paperSize: PrintPaperSize;
    data: any;
}

const PrintPreview = forwardRef<
    HTMLDivElement,
    PrintPreviewProps
>(function PrintPreview(
    {
        documentType,
        paperSize,
        data,
    },
    ref
) {
    const renderDocument = () => {
        switch (documentType) {
            case "invoice":
                if (paperSize === "A4") {
                    return <InvoiceA4 data={data} />;
                }

                return <InvoicePOS80 data={data} />;

            //   case "ledger":
            //     if (paperSize === "A4") {
            //       return <LedgerA4 data={data} />;
            //     }

            //     return <LedgerPOS80 data={data} />;

            //   case "delivery":
            //     if (paperSize === "A4") {
            //       return <DeliveryA4 data={data} />;
            //     }

            //     return <DeliveryPOS80 data={data} />;

            //   case "report":
            //     return <ReportA4 data={data} />;

            default:
                return (
                    <div className="p-10 text-center">
                        Print template not found.
                    </div>
                );
        }
    };

    return (
        <div
            ref={ref}
            className="print-container"
        >
            {renderDocument()}
        </div>
    );
});

export default PrintPreview;