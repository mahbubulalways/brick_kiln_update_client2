"use client";
import SelectLedgerModal from "@/components/Dashboard/Modals/SelectLedgerModal";
import CustomInputClickable from "@/components/Reusable/CustomInputClickable";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import CustomSelect from "@/components/Reusable/CustomSelect";
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

const NewPaymentSection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [ledger, setLedger] = useState<string>("");
  const { register, handleSubmit, control } = useForm<TPaymentRecord>({
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<TPaymentRecord> = async (data) => {
    console.log(data);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-end gap-2 w-full"
      >
        <div onClick={() => setIsOpen(true)} className="min-w-[200px]">
          <CustomInputClickable
            name="ledger"
            label="খতিয়ান"
            placeholder=""
            register={register}
            type="text"
            value={ledger}
          />
        </div>
        <CustomInputLabel
          name="paymentDetails"
          label="পেমেন্টের বিবরণ"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomSelect
          name="paymentType"
          label="পেমেন্টের ধরণ"
          placeholder=""
          control={control}
          options={[]}
        />
        <CustomInputLabel
          name="amount"
          label="পরিমান"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomInputLabel
          name="totalBill"
          label="মোট বিল"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomInputLabel
          name="deduction"
          label="কর্তন"
          placeholder=""
          register={register}
          type="text"
        />
        <CustomInputLabel
          name="payment"
          label="পেমেন্ট"
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

export default NewPaymentSection;
