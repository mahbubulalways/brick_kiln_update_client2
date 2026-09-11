"use client";

interface InvoicePOS80Props {
    data: any;
}

export default function InvoicePOS80({
    data,
}: InvoicePOS80Props) {
    return (
        <div className="invoice-pos80 bg-white p-2 text-black">
            <div className="text-center">
                <h1 className="text-lg font-bold">
                    IT VATA
                </h1>

                <p className="text-xs">
                    Invoice
                </p>
            </div>

            <div className="mt-3 text-xs">
                <p>
                    Invoice: {data?.invoiceNo}
                </p>

                <p>
                    Customer: {data?.customerName}
                </p>

                <p>
                    Date: {data?.date}
                </p>
            </div>

            {/* POS invoice table */}

            <div className="mt-4 text-right text-xs">
                <strong>
                    Total: {data?.total}
                </strong>
            </div>
        </div>
    );
}