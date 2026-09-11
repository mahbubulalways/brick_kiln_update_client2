"use client";

import { useEffect, useState } from "react";

import A4CustomerPrint from "./A4CustomerPrint";
import POS80CustomerPrint from "./POS80CustomerPrint";

import { TCustomInvoiceModal } from "@/types/types";
import { TVataInformation } from "@/interface/vata";

import { useGetSingleInvoiceQuery } from "@/redux/features/invoice.features";

import A4Print from "@/components/Printer/PrintManager/A4Print";
import POSPrint from "@/components/Printer/PrintManager/PosPrint";
import CustomPrintModal from "@/components/Reusable/CustomPrintModal";
import { useGetAllClassAndRateOptionsQuery } from "@/redux/features/classAndRate.features";

type PrintFormat =
  | "a4-customer"
  | "a4-customer-office"
  | "pos80-customer"
  | "pos80-customer-office";

const ChalanPrintModal = ({
  isOpen,
  onClose,
  invoiceId,
  setInvoiceId,
  vataInformation,
}: TCustomInvoiceModal & {
  vataInformation: TVataInformation;
}) => {
  const [selectedFormat, setSelectedFormat] =
    useState<PrintFormat>("a4-customer");

  const { data: invoiceData, isLoading } =
    useGetSingleInvoiceQuery(invoiceId, {
      skip: !invoiceId,
    });
  const { isLoading: classLoading, isError: classError, data: classes } = useGetAllClassAndRateOptionsQuery(undefined)

  useEffect(() => {
    if (isOpen) {
      setSelectedFormat("a4-customer");
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectedFormat("a4-customer");
    setInvoiceId(undefined);
    onClose();
  };

  const renderSelectedDesign = () => {
    if (!invoiceData?.data) {
      return null;
    }

    switch (selectedFormat) {
      case "a4-customer":
        return (
          <A4CustomerPrint
            invoice={invoiceData.data}
            vataInformation={vataInformation}
            classes={classes?.data}
            copyType="customer"
          />
        );

      case "a4-customer-office":
        return (
          <div className="a4-combined-print w-full bg-white">
            <A4CustomerPrint
              invoice={invoiceData.data}
              vataInformation={vataInformation}
              copyType="office"
              compact
              classes={classes?.data}
            />

            <div className="my-3 border-t-2 border-dashed border-slate-400" />

            <A4CustomerPrint
              invoice={invoiceData.data}
              vataInformation={vataInformation}
              copyType="customer"
              compact
              classes={classes?.data}
            />
          </div>
        );

      case "pos80-customer":
        return (
          <POS80CustomerPrint
            invoice={invoiceData.data}
            vataInformation={vataInformation}
          />
        );

      case "pos80-customer-office":
        return (
          <div className="pos-combined-print w-full">
            <POS80CustomerPrint
              invoice={invoiceData.data}
              vataInformation={vataInformation}
            />

            <div className="my-2 border-t border-dashed border-slate-400" />

            <POS80CustomerPrint
              invoice={invoiceData.data}
              vataInformation={vataInformation}

            />
          </div>
        );

      default:
        return null;
    }
  };

  const isA4 = selectedFormat.startsWith("a4");

  const printOptions = [
    {
      key: "a4-customer" as PrintFormat,
      label: "A4 কাস্টমার",
      type: "a4",
    },
    {
      key: "a4-customer-office" as PrintFormat,
      label: "A4 কাস্টমার + অফিস",
      type: "a4",
    },
    {
      key: "pos80-customer" as PrintFormat,
      label: "POS কাস্টমার",
      type: "pos",
    },
    {
      key: "pos80-customer-office" as PrintFormat,
      label: "POS কাস্টমার + অফিস",
      type: "pos",
    },
  ];

  return (
    <CustomPrintModal
      isOpen={isOpen}
      onClose={handleClose}
      title="চালান প্রিন্ট"
      width="xxl"
    >
      <div className="w-full min-w-0">
        <div className="mb-3 rounded-lg border border-slate-200 bg-white">
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
                  className={`
                                        h-7
                                        rounded
                                        border
                                        px-2
                                        text-center
                                        text-[10px]
                                        font-semibold
                                        transition-all
                                        duration-150
                                        sm:h-8
                                        sm:px-2.5
                                        sm:text-[11px]
                                        ${selected
                      ? isA4Option
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-purple-600 bg-purple-600 text-white"
                      : isA4Option
                        ? "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100"
                        : "border-purple-200 bg-purple-50 text-purple-700 hover:border-purple-300 hover:bg-purple-100"
                    }
                                    `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[450px] items-center justify-center rounded-md bg-white">
            <div className="flex flex-col items-center gap-2">
              <div className="h-7 w-7 animate-spin rounded-full border-[3px] border-slate-200 border-t-[#039A63]" />

              <p className="text-xs text-slate-500">
                চালানের তথ্য লোড হচ্ছে...
              </p>
            </div>
          </div>
        ) : invoiceData?.data ? (
          <>

            <div className="mt-2 w-full min-w-0">
              {isA4 ? (
                <A4Print documentTitle="chalan">
                  {renderSelectedDesign()}
                </A4Print>
              ) : (
                <POSPrint documentTitle="chalan">
                  {renderSelectedDesign()}
                </POSPrint>
              )}
            </div>
          </>
        ) : (
          <div className="flex min-h-[450px] items-center justify-center rounded-md bg-white">
            <p className="text-xs text-slate-500">
              চালানের তথ্য পাওয়া যায়নি।
            </p>
          </div>
        )}
      </div>
    </CustomPrintModal>
  );
};

export default ChalanPrintModal;