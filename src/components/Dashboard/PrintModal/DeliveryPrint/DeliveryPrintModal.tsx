"use client";

import { useEffect, useState } from "react";
import { FileText, ReceiptText } from "lucide-react";
import CustomStatus from "@/components/Reusable/CustomStatus";
import A4Print from "@/components/Printer/PrintManager/A4Print";
import POSPrint from "@/components/Printer/PrintManager/PosPrint";
import A4DeliveryPrint from "./A4DeliveryPrint";
import POS80DeliveryPrint from "./POS80DeliveryPrint";
import { TDeliveryResponse } from "@/interface/delivery";
import { TVataInformation } from "@/interface/vata";
import { useGetSingleDeliveryQuery } from "@/redux/features/delivery.features";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";

import { Dispatch, SetStateAction } from "react";
import CustomPrintModal from "@/components/Reusable/CustomPrintModal";

export type TDeliveryPrintModal = {
  isOpen: boolean;
  onClose: () => void;
  setDeliveryId: Dispatch<SetStateAction<number | undefined>>;
  deliveryId: number | undefined;
};

type PrintFormat =
  | "a4-customer"
  | "a4-customer-office"
  | "pos80-customer"
  | "pos80-customer-office";

const DeliveryPrintModal = ({
  isOpen,
  onClose,
  deliveryId,
  setDeliveryId,
}: TDeliveryPrintModal) => {
  const [selectedFormat, setSelectedFormat] =
    useState<PrintFormat>("a4-customer");

  const {
    data,
    isLoading,
    isError,
  } = useGetSingleDeliveryQuery(deliveryId!, {
    skip: !deliveryId,
    refetchOnMountOrArgChange: true,
  });

  const {
    data: vataInfo,
    isLoading: vataLoading,
    isError: vataError,
  } = useGetVataInfoQuery(undefined);

  const delivery: TDeliveryResponse =
    data?.data || ({} as TDeliveryResponse);

  const vataInformation =
    vataInfo?.data as TVataInformation;

  useEffect(() => {
    if (isOpen) {
      setSelectedFormat("a4-customer");
    }
  }, [isOpen]);

  const handleClose = () => {
    setSelectedFormat("a4-customer");
    setDeliveryId(undefined);
    onClose();
  };

  const renderSelectedDesign = () => {
    switch (selectedFormat) {
      case "a4-customer":
        return (
          <A4DeliveryPrint
            delivery={delivery}
            vataInformation={vataInformation}
            copyType="customer"
          />
        );

      case "a4-customer-office":
        return (
          <div className=" w-full bg-white grid grid-cols-2 gap-4">
            <A4DeliveryPrint
              delivery={delivery}
              vataInformation={vataInformation}
              copyType="office"
              compact
            />
            <A4DeliveryPrint
              delivery={delivery}
              vataInformation={vataInformation}
              copyType="office"
              compact
            />
          </div>

        );

      case "pos80-customer":
        return (
          <POS80DeliveryPrint
            delivery={delivery}
            vataInformation={vataInformation}
            copyType="customer"
          />
        );

      case "pos80-customer-office":
        return (
          <div className="pos-combined-print w-full bg-white">
            <POS80DeliveryPrint
              delivery={delivery}
              vataInformation={vataInformation}
              copyType="office"
            />

            <div className="my-2 border-t border-dashed border-slate-400" />

            <POS80DeliveryPrint
              delivery={delivery}
              vataInformation={vataInformation}
              copyType="customer"
            />
          </div>
        );

      default:
        return null;
    }
  };

  const printOptions = [
    {
      key: "a4-customer" as PrintFormat,
      label: "A4 কাস্টমার",
      type: "a4",
      icon: FileText,
    },
    {
      key: "a4-customer-office" as PrintFormat,
      label: "A4 কাস্টমার + অফিস",
      type: "a4",
      icon: FileText,
    },
    {
      key: "pos80-customer" as PrintFormat,
      label: "POS কাস্টমার",
      type: "pos",
      icon: ReceiptText,
    },
    {
      key: "pos80-customer-office" as PrintFormat,
      label: "POS কাস্টমার + অফিস",
      type: "pos",
      icon: ReceiptText,
    },
  ];

  const isA4 = selectedFormat.startsWith("a4");
  const copyType = selectedFormat === "a4-customer" ? "single" : "double";
  return (
    <CustomPrintModal
      isOpen={isOpen}
      onClose={handleClose}
      width="xxxl"
      title="ডেলিভারি প্রিন্ট"
    >
      {isLoading || vataLoading ? (
        <CustomStatus type="loading" />
      ) : isError || vataError ? (
        <CustomStatus type="error" />
      ) : !data?.data || !vataInfo?.data ? (
        <CustomStatus type="error" />
      ) : (
        <div
          className="w-full"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-4">
              {printOptions.map((option) => {
                const Icon = option.icon;

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

            <div>
              {isA4 ? (
                <A4Print documentTitle="delivery" copyType={copyType}>
                  {renderSelectedDesign()}
                </A4Print>
              ) : (
                <POSPrint documentTitle="delivery">
                  {renderSelectedDesign()}
                </POSPrint>
              )}
            </div>
          </div>
        </div>
      )}
    </CustomPrintModal>
  );
};

export default DeliveryPrintModal;