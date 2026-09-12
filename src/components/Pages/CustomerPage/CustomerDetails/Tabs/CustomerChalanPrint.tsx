import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { TCustomer } from "@/interface/customer";
import { TVataInformation } from "@/interface/vata";
import { IChallanForDataShow } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

const CustomerChalanPrint = ({
    invoiceInfo,
    customerInfo,
    vataInformation
}: {
    invoiceInfo: IChallanForDataShow[] | undefined;
    customerInfo: TCustomer;
    vataInformation: TVataInformation
}) => {
    const summaryData = [
        {
            label: "মোট ক্রয়",
            value: customerInfo.totalPurchasedQuantity,
        },
        {
            label: "মোট ডেলিভারি",
            value: customerInfo.totalDeliveredQuantity,
        },
        {
            label: "ইট ডেলিভারি বাকি",
            value: customerInfo.totalRemainingQuantity,
        },
        {
            label: "মোট টাকা",
            value: customerInfo.totalAmount,
            money: true,
        },
        {
            label: "মোট জমা",
            value: customerInfo.totalPaid,
            money: true,
        },
        {
            label: "মোট বকেয়া",
            value: customerInfo.totalDue,
            money: true,
        },
    ];

    const tableHeaders = [
        "#",
        "তারিখ",
        "চালান",
        "শ্রেণি",
        "পরিমাণ",
        "রেট",
        "দাম",
        "ছাড়",
        "ভাড়া",
        "সর্বমোট",
        "নগদ",
        "বাকি",
        "মন্তব্য",
    ];

    return (
        <div className="w-full bg-white text-black">
            <div
                className="
                    mx-auto
                    min-h-[297mm]
                    w-full
                    max-w-[210mm]
                    bg-white
                    px-[7mm]
                    py-[6mm]
                    text-black
                "
            >
                {/* Watermark */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
                >
                    <span
                        className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
                        style={{
                            fontSize: "170px",
                        }}
                    >
                        {vataInformation?.shortForm
                            ?.split("")
                            .join(".")}
                    </span>
                </div>

                {/* Main Content */}
                <div className="relative z-10 text-black">
                    <div className="flex items-center justify-between border-b-2 border-black pb-2">
                        {/* Short Form */}
                        <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
                            {vataInformation?.shortForm
                                ?.split("")
                                .join(".")}
                        </div>

                        {/* Owner Information */}
                        <div className="min-w-[150px] text-right leading-tight">
                            {vataInformation?.ownerName && (
                                <p className="text-[13px] font-bold">
                                    প্রোঃ {vataInformation.ownerName}
                                </p>
                            )}

                            {vataInformation?.ownerPhoneNumber && (
                                <p className="mt-0.5 text-[14px] font-bold">
                                    {vataInformation.ownerPhoneNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Vata Name */}
                    <div className="mt-3 text-center">
                        <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
                            {vataInformation?.nameBangla}
                        </h1>

                        {vataInformation?.shortDescription && (
                            <p className="mt-1 text-[12px] font-semibold">
                                {vataInformation.shortDescription}
                            </p>
                        )}
                    </div>

                    {/* Address */}
                    {(vataInformation?.additionalAddress ||
                        vataInformation?.address) && (
                            <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
                                {vataInformation?.additionalAddress}

                                {vataInformation?.additionalAddress &&
                                    vataInformation?.address
                                    ? " • "
                                    : ""}

                                {vataInformation?.address}
                            </div>
                        )}

                    {/* Contact Information */}
                    {(vataInformation?.challanPersonOneName ||
                        vataInformation?.challanPersonTwoName ||
                        vataInformation?.challanManagerPhoneNumber) && (
                            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
                                {vataInformation?.challanPersonOneName && (
                                    <span>
                                        <span className="font-bold">
                                            {vataInformation.challanPersonOneName}
                                        </span>
                                        :{" "}
                                        {vataInformation.challanPersonOnePhoneNumber}
                                    </span>
                                )}

                                {vataInformation?.challanPersonTwoName && (
                                    <span>
                                        <span className="font-bold">
                                            {vataInformation.challanPersonTwoName}
                                        </span>
                                        :{" "}
                                        {vataInformation.challanPersonTwoPhoneNumber}
                                    </span>
                                )}

                                {vataInformation?.challanManagerPhoneNumber && (
                                    <span>
                                        <span className="font-bold">
                                            ম্যানেজার
                                        </span>
                                        : {vataInformation.challanManagerPhoneNumber}
                                    </span>
                                )}
                            </div>
                        )}
                </div>

                <div
                    className="
                        mt-3
                        rounded-[4px]
                        bg-gray-200
                        px-2
                        py-[7px]
                        text-center
                        text-[17px]
                        font-bold
                    "
                >
                    কাস্টমার স্টেটমেন্ট (সেব তথ্য)
                </div>

                <div
                    className="
                        mt-3
                        flex
                        items-start
                        justify-between
                        border-l-[4px]
                        border-gray-700
                        px-3
                        py-2
                    "
                >
                    <div className="leading-tight">
                        <h2 className="text-[17px] font-bold">
                            {customerInfo.name}
                        </h2>

                        <p className="mt-1 text-[11px]">
                            মোবাইল: {customerInfo.phoneNumber}
                        </p>

                        <p className="text-[11px]">
                            ঠিকানা: {customerInfo.address}
                        </p>
                    </div>

                    <div className="text-right text-[11px] leading-tight">
                        <p>
                            <span className="font-semibold">
                                সিজন:{invoiceInfo?.[0]?.season?.name}
                            </span>
                        </p>

                        <p className="mt-0.5">
                            <span className="font-semibold">
                                প্রিন্ট তারিখ:
                            </span>{" "}
                            {formatBanglaDate({
                                date: new Date(),
                                showTime: false,
                            })}
                        </p>

                        <p className="mt-0.5">
                            <span className="font-semibold">
                                সময়:
                            </span>{" "}
                            {formatBanglaDate({
                                date: new Date(),
                                showDate: false,
                                showTime: true,
                            })}
                        </p>
                    </div>
                </div>

                <div className="mt-3 overflow-hidden rounded-[5px] border border-gray-300">
                    <div className="grid grid-cols-3">
                        {summaryData.map((item, index) => (
                            <div
                                key={index}
                                className={`
                                    flex
                                    min-h-[52px]
                                    flex-col
                                    items-center
                                    justify-center
                                    border-gray-300
                                    px-2
                                    py-2
                                    text-center
                                    leading-tight
                                    ${index < 3 ? "border-b" : ""}
                                    ${index % 3 !== 2 ? "border-r" : ""}
                                `}
                            >
                                <span className="text-[11px] text-gray-500">
                                    {item.label}
                                </span>

                                <span className="mt-1 text-[15px] font-bold">
                                    {item.money && "৳ "}
                                    {toBanglaNumber(item.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2">
                    <span
                        className="
                            flex
                            h-[22px]
                            w-[22px]
                            items-center
                            justify-center
                            rounded-[3px]
                            bg-black
                            text-[13px]
                            font-bold
                            text-white
                        "
                    >
                        ↳
                    </span>

                    <h3 className="text-[17px] font-bold">
                        চালান / ইনভয়েস তালিকা
                    </h3>
                </div>

                <div className="mt-2 w-full">
                    <table className="w-full border-collapse text-[10px] leading-tight">
                        <thead>
                            <tr
                                className="
                                    border
                                    border-gray-400
                                    bg-gray-100
                                    text-center
                                    font-bold
                                    text-gray-900
                                "
                            >
                                {tableHeaders.map((header, index) => (
                                    <TableHead
                                        key={index}
                                        th={header}
                                        cls="
                                            whitespace-nowrap
                                            border
                                            border-gray-300
                                            px-[5px]
                                            py-[6px]
                                            text-[10px]
                                            font-bold
                                        "
                                    />
                                ))}
                            </tr>
                        </thead>

                        <tbody className="text-center">
                            {invoiceInfo?.map(
                                (
                                    row: IChallanForDataShow,
                                    index: number
                                ) => {
                                    const items = row?.items ?? [];

                                    return items.map(
                                        (
                                            item: any,
                                            itemIndex: number
                                        ) => (
                                            <tr
                                                key={`${row.id}-${item.id}`}
                                                className="
                                                    border-b
                                                    border-gray-300
                                                "
                                            >
                                                {itemIndex === 0 && (
                                                    <TableData
                                                        td={
                                                            row.serial ??
                                                            index + 1
                                                        }
                                                        rowSpan={items.length}
                                                        cls="
                                                            border
                                                            border-gray-300
                                                            px-[5px]
                                                            py-[6px]
                                                            text-[10px]
                                                        "
                                                    />
                                                )}

                                                <TableData
                                                    td={formatBanglaDate({
                                                        date: row.challanDate,
                                                    })}
                                                    cls="
                                                        whitespace-nowrap
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                <TableData
                                                    td={
                                                        row?.serial ??
                                                        index + 1
                                                    }
                                                    cls="
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                <TableData
                                                    td={item.class ?? "-"}
                                                    cls="
                                                        whitespace-nowrap
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        item.quantity
                                                    )}
                                                    cls="
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                <TableData
                                                    td={toBanglaNumber(
                                                        item.rate
                                                    )}
                                                    cls="
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                <TableData
                                                    td={`৳ ${toBanglaNumber(
                                                        item.price
                                                    )}`}
                                                    cls="
                                                        whitespace-nowrap
                                                        border
                                                        border-gray-300
                                                        px-[5px]
                                                        py-[6px]
                                                        text-[10px]
                                                    "
                                                />

                                                {itemIndex === 0 && (
                                                    <>
                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row.discount
                                                            )}`}
                                                            rowSpan={items.length}
                                                            cls="
                                                                whitespace-nowrap
                                                                border
                                                                border-gray-300
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                            "
                                                        />

                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row.carRent
                                                            )}`}
                                                            rowSpan={items.length}
                                                            cls="
                                                                whitespace-nowrap
                                                                border
                                                                border-gray-300
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                            "
                                                        />

                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row.totalPrice
                                                            )}`}
                                                            rowSpan={items.length}
                                                            cls="
                                                                whitespace-nowrap
                                                                border
                                                                border-gray-300
                                                                bg-gray-50
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                                font-bold
                                                            "
                                                        />

                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row.cash
                                                            )}`}
                                                            rowSpan={items.length}
                                                            cls="
                                                                whitespace-nowrap
                                                                border
                                                                border-gray-300
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                            "
                                                        />

                                                        <TableData
                                                            td={`৳ ${toBanglaNumber(
                                                                row.due
                                                            )}`}
                                                            rowSpan={items.length}
                                                            cls="
                                                                whitespace-nowrap
                                                                border
                                                                border-gray-300
                                                                bg-gray-50
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                                font-bold
                                                            "
                                                        />

                                                        <TableData
                                                            td={
                                                                row?.note ??
                                                                "-"
                                                            }
                                                            rowSpan={items.length}
                                                            cls="
                                                                border
                                                                border-gray-300
                                                                px-[5px]
                                                                py-[6px]
                                                                text-[10px]
                                                            "
                                                        />
                                                    </>
                                                )}
                                            </tr>
                                        )
                                    );
                                }
                            )}
                        </tbody>
                    </table>
                </div>

                <div
                    className="
                        mt-[22mm]
                        grid
                        grid-cols-2
                        gap-[45mm]
                        px-[12mm]
                    "
                >
                    <div className="text-center">
                        <div className="border-t-2 border-black" />

                        <p className="mt-1 text-[13px] font-bold">
                            কাস্টমার স্বাক্ষর
                        </p>
                    </div>

                    <div className="text-center">
                        <div className="border-t-2 border-black" />

                        <p className="mt-1 text-[13px] font-bold">
                            মালিকের / কর্তৃপক্ষ
                        </p>
                    </div>
                </div>

                {/* <div
                    className="
                        mt-2
                        border-t
                        border-gray-200
                        pt-1
                        text-center
                        text-[8px]
                        text-gray-400
                    "
                >
                    প্রিন্ট তারিখ:{" "}
                    {formatBanglaDate({
                        date: new Date().toISOString(),
                        showTime: true,
                    })}
                    {" | "}
                    Software by Payrtech.com
                </div> */}
            </div>
        </div>
    );
};

export default CustomerChalanPrint;