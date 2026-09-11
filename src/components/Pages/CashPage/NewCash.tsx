"use client";
import SelectLedgerModal from "@/components/Dashboard/Modals/SelectLedgerModal";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export type TPaymentRecord = {
  ledger: string;
  paymentDetails: string;
  paymentType: string;
  amount: number;
  totalBill: number;
  deduction: number;
  payment: number;
};

const NewCash = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ledger, setLedger] = useState<string>("");
  const { register, handleSubmit } = useForm<TPaymentRecord>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<TPaymentRecord> = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-end gap-2 w-full justify-between"
      >
        <CustomInputLabel
          name="paymentDetails"
          label="ক্যাশের বিবরণ"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomInputLabel
          name="totalBill"
          label="ক্যাশ ইন"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomInputLabel
          name="totalBill"
          label="ক্যাশ আউট"
          placeholder=""
          register={register}
          type="text"
        />

        {/* ✅ Fixed button spacing and shrinking issue */}
        <button
          type="submit"
          className="text-[14px] bg-[#039A63] px-4 py-1.5 text-white font-medium rounded whitespace-nowrap shrink-0 cursor-pointer"
        >
          সেভ করুন
        </button>
      </form>

      {isOpen && (
        <SelectLedgerModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          ledger={ledger}
          setLedger={setLedger}
        />
      )}
    </div>
  );
};

export default NewCash;
