"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface SmsSwitchProps {
  showLabel?: boolean;
  showBorder?: boolean;
  title?: string;
  sendSms: boolean;
  setSendSms: Dispatch<SetStateAction<boolean>>;
}

const SmsSwitch = ({
  showLabel,
  showBorder,
  title = "SMS",
  sendSms = false,
  setSendSms,
}: SmsSwitchProps) => {
  const [enabled, setEnabled] = useState(sendSms);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    setSendSms(value);
  };

  return (
    <div className="flex flex-col">
      {showLabel && <p className="text-gray-600 text-xs font-medium">এসএমএস</p>}

      <div
        className={`${
          showBorder ? "border" : ""
        } border-gray-300 rounded px-4 py-1.5 flex items-center justify-center gap-3 bg-white w-full`}
      >
        <span
          className={`${
            enabled ? "text-green-600" : "text-gray-600"
          } text-[14px]`}
        >
          {title}
        </span>

        <Switch
          checked={enabled}
          onCheckedChange={handleToggle}
          className="cursor-pointer data-[state=checked]:bg-green-600"
        />
      </div>
    </div>
  );
};

export default SmsSwitch;
