import moment from "moment";
import { toBanglaNumber } from "./toBanglaNumber";

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export const formatBanglaDate = ({
  date,
  showTime = false,
  showDate = true,
}: {
  date: Date | string;
  showTime?: boolean;
  showDate?: boolean;
}) => {
  const momentDate = moment(date);

  if (!momentDate.isValid()) return "";

  // Date
  const day = toBanglaNumber(momentDate.format("D"));
  const month = banglaMonths[momentDate.month()];
  const year = toBanglaNumber(momentDate.format("YYYY"));

  const datePart = `${day} ${month}, ${year}`;

  // শুধু date
  if (!showTime) {
    return showDate ? datePart : "";
  }

  // Period
  const hour = momentDate.hour();

  let period = "";

  if (hour >= 5 && hour < 12) {
    period = "সকাল";
  } else if (hour >= 12 && hour < 15) {
    period = "দুপুর";
  } else if (hour >= 15 && hour < 18) {
    period = "বিকাল";
  } else {
    period = "রাত";
  }

  // 12-hour time
  const timePart = momentDate.format("hh:mm");
  const banglaTime = `${period} ${toBanglaNumber(timePart)}`;

  // শুধু time
  if (!showDate) {
    return banglaTime;
  }

  // Date + time
  return `${datePart} ${banglaTime}`;
};