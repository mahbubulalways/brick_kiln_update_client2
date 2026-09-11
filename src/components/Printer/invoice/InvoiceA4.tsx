"use client";

interface InvoiceA4Props {
    data: any;
}

export default function InvoiceA4({
    data,
}: InvoiceA4Props) {
    return (
        <div className="invoice-a4 bg-white p-8 text-black">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold">
                    IT VATA
                </h1>

                <p className="text-sm">
                    Invoice
                </p>
            </div>

            <div className="mb-4">
                <p>
                    Invoice No: {data?.invoiceNo}
                </p>

                <p>
                    Customer: {data?.customerName}
                </p>

                <p>
                    Date: {data?.date}
                </p>
            </div>

            {/* তোমার invoice table এখানে */}

            <div className="mt-8 text-right">
                <strong>
                    Total: {data?.total}
                </strong>
            </div>
        </div>
    );
}