import { TItems } from "@/components/Dashboard/Modals/ReportModal/DeliveryReportModal";

export const groupAndSumByClass = (items: TItems[]): TItems[] => {
  return Object?.values(
    items?.reduce((acc: Record<string, TItems>, item) => {
      if (!acc[item.class]) {
        acc[item.class] = { class: item.class, delivered: 0 };
      }
      acc[item.class].delivered += item.delivered;
      return acc;
    }, {})
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const remainingAllDelivery = (challans: any[]): TItems[] => {
  const allItems = challans?.flatMap((challan) => challan?.items || []);
  return Object?.values(
    allItems?.reduce((acc: Record<string, TItems>, item) => {
      const remaining = (item?.quantity ?? 0) - (item?.delivered ?? 0);
      if (!acc[item?.class]) {
        acc[item.class] = { class: item.class, delivered: 0 };
      }
      acc[item.class].delivered += remaining;
      return acc;
    }, {})
  );
};
