"use client";

import { useEffect, useState } from "react";

import CustomPrintModal from "@/components/Reusable/CustomPrintModal";
import A4Print from "@/components/Printer/PrintManager/A4Print";
import POSPrint from "@/components/Printer/PrintManager/PosPrint";

import { TPaymentResponse } from "@/interface/payment";
import { TVataInformation } from "@/interface/vata";

import { useGetSinglePaymentReportQuery } from "@/redux/features/payment.features";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";

import A4LedgerPrint from "./A4LedgerPrint";
import POS80LedgerPrint from "./POS80LedgerPrint";

type PrintFormat =
    | "a4-customer"
    | "a4-customer-office"
    | "pos80-customer"
    | "pos80-customer-office";

type TLedgerModal = {
    ledgerId: string;
    isOpen: boolean;
    onClose: () => void;
};

export default function LedgerPrintModal({
    isOpen,
    onClose,
    ledgerId,
}: TLedgerModal) {
    const [selectedFormat, setSelectedFormat] =
        useState<PrintFormat>("a4-customer");

    const {
        data: vataInfo,
        isLoading: vataLoading,
    } = useGetVataInfoQuery(undefined);

    const {
        data,
        isLoading: ledgerLoading,
    } = useGetSinglePaymentReportQuery(ledgerId, {
        skip: !ledgerId,
        refetchOnMountOrArgChange: true,
    });

    const vataInformation = vataInfo?.data as TVataInformation;
    const ledger = data?.data as TPaymentResponse;

    const isA4 =
        selectedFormat === "a4-customer" ||
        selectedFormat === "a4-customer-office";
    const copyType = selectedFormat === "a4-customer" ? "single" : "double";
    const isLoading = ledgerLoading || vataLoading;

    useEffect(() => {
        if (isOpen) {
            setSelectedFormat("a4-customer");
        }
    }, [isOpen]);

    const handleClose = () => {
        setSelectedFormat("a4-customer");
        onClose();
    };

    const renderSelectedDesign = () => {
        if (!ledger) {
            return null;
        }

        switch (selectedFormat) {
            case "a4-customer":
                return (
                    <A4LedgerPrint
                        ledger={ledger}
                        vataInformation={vataInformation}
                        copyType="customer"
                    />
                );

            case "a4-customer-office":
                return (
                    <div className="a4-combined-print w-full bg-white">
                        <A4LedgerPrint
                            ledger={ledger}
                            vataInformation={vataInformation}
                            copyType="customer"
                        />

                        <div className="my-3 border-t border-dashed border-slate-400" />

                        <A4LedgerPrint
                            ledger={ledger}
                            vataInformation={vataInformation}
                            copyType="office"
                        />

                    </div>
                );

            case "pos80-customer":
                return (
                    <div
                        className="pos-combined-print w-full bg-white"

                    >
                        <div className="w-full">
                            <POS80LedgerPrint
                                ledger={ledger}
                                vataInformation={vataInformation}
                                copyType="office"
                            />
                        </div>
                    </div>
                );

            case "pos80-customer-office":
                return (
                    <div
                        className="pos-combined-print w-full bg-white"

                    >
                        <div className="w-full">
                            <POS80LedgerPrint
                                ledger={ledger}
                                vataInformation={vataInformation}
                                copyType="office"
                            />
                        </div>

                        <div className="my-2 border-t border-dashed border-slate-400" />

                        <div className="w-full">
                            <POS80LedgerPrint
                                ledger={ledger}
                                vataInformation={vataInformation}
                                copyType="office"
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const printOptions: {
        key: PrintFormat;
        label: string;
        type: "a4" | "pos";
    }[] = [
            {
                key: "a4-customer",
                label: "A4 কাস্টমার",
                type: "a4",
            },
            {
                key: "a4-customer-office",
                label: "A4 কাস্টমার + অফিস",
                type: "a4",
            },
            {
                key: "pos80-customer",
                label: "POS কাস্টমার",
                type: "pos",
            },
            {
                key: "pos80-customer-office",
                label: "POS কাস্টমার + অফিস",
                type: "pos",
            },
        ];

    return (
        <CustomPrintModal
            isOpen={isOpen}
            onClose={handleClose}
            title="খতিয়ান প্রিন্ট"
            width="xxl"
        >
            <div
                className="w-full min-w-0"
                style={{
                    fontFamily: '"Hind Siliguri", sans-serif',
                }}
            >
                <div className="mb-4 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
                        {printOptions.map((option) => {
                            const selected =
                                selectedFormat === option.key;

                            const isA4Option =
                                option.type === "a4";

                            return (
                                <button
                                    key={option.key}
                                    type="button"
                                    onClick={() =>
                                        setSelectedFormat(option.key)
                                    }
                                    className={[
                                        "h-9 rounded-lg border px-2.5 text-center text-[11px] font-semibold leading-none transition-all duration-150",
                                        "sm:h-10 sm:text-xs",
                                        "focus:outline-none focus:ring-2 focus:ring-offset-1",
                                        selected
                                            ? isA4Option
                                                ? "border-sky-600 bg-sky-600 text-white shadow-sm focus:ring-sky-300"
                                                : "border-purple-600 bg-purple-600 text-white shadow-sm focus:ring-purple-300"
                                            : isA4Option
                                                ? "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100 focus:ring-sky-200"
                                                : "border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-300 hover:bg-purple-100 focus:ring-purple-200",
                                    ].join(" ")}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex min-h-[450px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#039A63]" />

                            <p className="text-sm font-medium text-slate-500">
                                খতিয়ানের তথ্য লোড হচ্ছে...
                            </p>
                        </div>
                    </div>
                ) : ledger ? (
                    <div>
                        {isA4 ? (
                            <A4Print documentTitle="ledger" copyType={copyType}>
                                {renderSelectedDesign()}
                            </A4Print>
                        ) : (
                            <POSPrint documentTitle="ledger">
                                {renderSelectedDesign()}
                            </POSPrint>
                        )}
                    </div>
                ) : (
                    <div className="flex min-h-[450px] items-center justify-center rounded-xl border border-slate-200 bg-white">
                        <p className="text-sm font-medium text-slate-500">
                            খতিয়ানের তথ্য পাওয়া যায়নি।
                        </p>
                    </div>
                )}
            </div>
        </CustomPrintModal>
    );
}