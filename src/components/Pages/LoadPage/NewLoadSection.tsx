"use client";
import SelectLedgerModal from "@/components/Dashboard/Modals/SelectLedgerModal";
import CustomInputClickable from "@/components/Reusable/CustomInputClickable";
import CustomInputLabel from "@/components/Reusable/CustomInputLabel";
import CustomSelect from "@/components/Reusable/CustomSelect";
import CustomSelect2 from "@/components/Reusable/CustomSelect2";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import AddRoundAndSelect from "./AddRoundAndSelect";

export type TPaymentRecord = {
  ledger: string;
  paymentDetails: string;
  paymentType: string;
  amount: number;
  totalBill: number;
  deduction: number;
  payment: number;
};

const NewLoadSection = () => {
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
        <div>
          <label className="pb-1 lg:pb-0.5 flex items-center text-sm font-medium text-gray-600">
            {"রাউন্ড"}
          </label>
          <AddRoundAndSelect
            options={["1 নম্বর রাউন্ড", "2 নম্বর রাউন্ড", "3 নম্বর রাউন্ড"]}
            placeholder=" "
          />
        </div>

        <CustomSelect
          name="paymentType"
          label="লোডের ধরণ"
          placeholder=""
          control={control}
          options={[
            {
              label: "মাঠ থেকে লোড হয়েছে",
              value: "মাঠ থেকে লোড হয়েছে",
            },
            {
              label: "স্টক থেকে লোড হয়েছে",
              value: "স্টক থেকে লোড হয়েছে",
            },
            {
              label: "পাকা ইট লোড হয়েছে",
              value: "পাকা ইট লোড হয়েছে",
            },
            {
              label: "স্টক লোড হয়েছে",
              value: "স্টক লোড হয়েছে",
            },
          ]}
        />
        <CustomInputLabel
          name="totalBill"
          label="পরিমান"
          placeholder=""
          register={register}
          type="text"
        />
        {/* ✅ Fixed button spacing and shrinking issue */}
        <button
          type="submit"
          className=" bg-[#039A63] px-4 py-1.5 text-white font-medium rounded whitespace-nowrap shrink-0 cursor-pointer"
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

export default NewLoadSection;
