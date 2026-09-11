// utils/formatBengaliDate.ts
export function formatBengaliTime(
  dateInput?: string | Date,
  includeDate: boolean = false
): string {
  if (!dateInput) return "";

  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;

  // Time formatting
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  let period = "";

  if (hours === 0) {
    period = "রাত";
    hours = 12;
  } else if (hours < 12) {
    period = "সকাল";
  } else if (hours === 12) {
    period = "দুপুর";
  } else if (hours > 12 && hours < 18) {
    period = "দুপুর";
    hours -= 12;
  } else {
    period = "সন্ধ্যা";
    hours -= 12;
  }

  const timeStr = `${period} ${hours}:${minutes}`;

  if (!includeDate) return timeStr;

  // Date formatting DD/MM/YYYY
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year} ${timeStr}`;
}
