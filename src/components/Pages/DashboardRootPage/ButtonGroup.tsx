"use client";
import CustomButton from "@/components/Dashboard/common/CustomButton";
import { DatePicker } from "@/components/Others/DatePicker";
import { MonthPicker } from "@/components/Others/MonthPicker";
import { useState } from "react";
const ButtonGroup = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [activeLabel, setActiveLabel] = useState("");

  const buttons = [
    { label: "আজকের হিসাব", color: "#007BBD" },
    { label: "গত ৭ দিনের হিসাব", color: "#16A34A" },
    { label: "গত ১৫ দিনের হিসাব", color: "#0284C7" },
    { label: "সিজনের হিসাব", color: "#16A34A" },
    { label: "লাভ লসের হিসাব", color: "#6366F1" },
  ];
  const buttons2 = [
    { label: "৭ দিন ", color: "#16A34A" },
    { label: "১৫ দিন", color: "#0284C7" },
    { label: "সিজন", color: "#16A34A" },
    { label: "লাভ লস", color: "#6366F1" },
  ];

  return (
    <div className="flex items-center flex-col-reverse lg:flex-row justify-between">
      <div className=" lg:block hidden w-full">
        <div className="flex gap-2 pt-3 w-full">
          {buttons.map((btn) => (
            <CustomButton
              key={btn.label}
              label={btn.label}
              color={btn.color}
              activeLabel={activeLabel}
              setActiveLabel={setActiveLabel}
            />
          ))}
        </div>
      </div>
      <div className="block lg:hidden w-full">
        <div className="flex gap-2 pt-3">
          {buttons2.map((btn) => (
            <CustomButton
              key={btn.label}
              label={btn.label}
              color={btn.color}
              activeLabel={activeLabel}
              setActiveLabel={setActiveLabel}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-5 w-full lg:w-auto">
        <MonthPicker />
        <DatePicker setDate={setDate} date={date} />
      </div>
    </div>
  );
};

export default ButtonGroup;
