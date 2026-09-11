"use client";

import { useState, useMemo, Dispatch, SetStateAction } from "react";
import CustomModalBottom from "@/components/Reusable/CustomModalBottom";
import CustomSearchInput from "@/components/Reusable/CustomSearchInput";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import KhotiyanModal from "./KhatiyanModal";
import { useGetAllLedgerQuery } from "@/redux/features/ledger.features";
import { TLedger } from "@/interface/ledger";
import { FiFileText } from "react-icons/fi";
import CustomStatus from "@/components/Reusable/CustomStatus";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  ledger: string;
  setLedger: Dispatch<SetStateAction<string>>;
};

const SelectLedgerModal = ({ isOpen, onClose, setLedger }: TCustomModal) => {
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openNewModal, setOpenNewModal] = useState<boolean>(false);
  const { data, isLoading, isError } = useGetAllLedgerQuery(undefined);
  const ledgers = data?.data as TLedger[];

  const filteredData = useMemo(() => {
    return ledgers ?? [];
  }, [ledgers]);

  return (
    <CustomModalBottom
      isOpen={isOpen}
      onClose={onClose}
      title="খতিয়ান নির্বাচণ করুন"
      width="xl"
    >{
        isLoading ? <CustomStatus type="loading" /> : isError ? <CustomStatus type="error" /> : <>
          <div className="px-3 pb-3">
            <CustomSearchInput search={search} setSearch={setSearch} />
          </div>

          <ScrollArea className="px-3 pb-5">
            <div className="flex flex-wrap items-center gap-3">
              {filteredData?.map((ledger: TLedger) => {
                const hasChildren = (ledger?.children?.length as number) > 0;

                return (
                  <Popover key={ledger.id}>
                    <PopoverTrigger asChild>
                      <Card
                        onClick={() => {
                          if (!hasChildren) {
                            setLedger(ledger.name);
                            onClose();
                          }
                        }}
                        className="cursor-pointer rounded-lg py-1 px-2 bg-gray-50 shadow-none text-gray-800 text-gray-700 text-[14px] text-center "
                      >
                        <div className="flex flex-row items-center gap-1">
                          <FiFileText className="h-4 w-4" /> {ledger.name}
                        </div>
                      </Card>
                    </PopoverTrigger>

                    {hasChildren && (
                      <PopoverContent className="max-w-44  p-1">
                        {ledger?.children?.map((child: TLedger) => (
                          <div
                            key={child.id}
                            onClick={() => {
                              setLedger(child.name);
                              onClose();
                            }}
                            className="cursor-pointer rounded-md p-1 hover:bg-gray-100"
                          ><div className="flex flex-row items-center gap-1 text-gray-700 text-[14px]">
                              <FiFileText className="h-4 w-4" /> {child.name}
                            </div>

                          </div>
                        ))}
                      </PopoverContent>
                    )}
                  </Popover>
                );
              })}
            </div>
          </ScrollArea>
         
            <CustomNewButton title="+ নতুন খতিয়ান অ্যাড" onClick={() => setOpenNewModal(true)}/>
        

          {openNewModal && (
            <KhotiyanModal
            showRateQuantity={false}
              isOpen={openNewModal}
              onClose={() => setOpenNewModal(false)}
            />
          )}</>
      }

    </CustomModalBottom>
  );
};

export default SelectLedgerModal;
