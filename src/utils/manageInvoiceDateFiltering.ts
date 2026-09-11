type TInvoiceFiltering = {
  start: Date;
  end?: Date;
};

const manageInvoiceDateFiltering = <T extends { challanDate: string | Date }>(
  data: T[] = [],
  date: TInvoiceFiltering
): T[] => {
  if (!date?.start) return data;

  const startDate = new Date(date.start);
  const endDate = date.end ? new Date(date.end) : undefined;

  // Normalize time to avoid time issues
  startDate.setHours(0, 0, 0, 0);
  if (endDate) endDate.setHours(23, 59, 59, 999);

  return data.filter((item) => {
    const challanDate = new Date(item.challanDate);

    if (!endDate) {
      // Only start date: exact match
      return (
        challanDate.getDate() === startDate.getDate() &&
        challanDate.getMonth() === startDate.getMonth() &&
        challanDate.getFullYear() === startDate.getFullYear()
      );
    } else {
      // Start and end date: inclusive range
      return challanDate >= startDate && challanDate <= endDate;
    }
  });
};

export default manageInvoiceDateFiltering;
