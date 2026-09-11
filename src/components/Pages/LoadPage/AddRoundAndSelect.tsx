"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type TAddRoundAndSelectProps = {
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onAdd?: (newValue: string) => void;
};

const AddRoundAndSelect: React.FC<TAddRoundAndSelectProps> = ({
  options,
  placeholder = "রাউন্ড নম্বর",
  defaultValue,
  disabled = false,
  className = "",
  onChange,
  onAdd,
}) => {
  const [inputValue, setInputValue] = React.useState("");

  return (
    <Select
      defaultValue={defaultValue}
      disabled={disabled}
      onValueChange={(value) => onChange && onChange(value)}
    >
      <SelectTrigger
        className={`w-56 border border-gray-300 rounded-md cursor-pointer text-sm ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent className="p-1" align="start">
        {options.map((option) => (
          <SelectItem key={option} value={option} className="cursor-pointer">
            {option}
          </SelectItem>
        ))}

        {/* Input + Add inside dropdown */}
        <div className="flex items-center gap-2 px-2 pb-2 mt-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="রাউন্ড নম্বর"
            className="h-8 text-sm"
          />
          <Button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                onAdd?.(inputValue.trim());
                setInputValue("");
              }
            }}
            className="h-8 px-3 text-sm font-medium"
          >
            + অ্যাড
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
};

export default AddRoundAndSelect;
