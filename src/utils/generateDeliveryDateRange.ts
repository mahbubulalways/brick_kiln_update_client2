export const generateDeliveryDateRange = (
  deliverySeason: string,
  isAdvanceChalan: boolean = false,
) => {
  if (!isAdvanceChalan || !deliverySeason) {
    return {
      minDate: undefined,
      maxDate: undefined,
    };
  }

  const [startYear, endYear] = deliverySeason.split("-").map(Number);

  if (!startYear || !endYear) {
    return {
      minDate: undefined,
      maxDate: undefined,
    };
  }

  return {
    minDate: new Date(startYear, 0, 1),
    maxDate: new Date(endYear, 11, 31),
  };
};
