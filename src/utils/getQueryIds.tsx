// utils/getQueryIds.ts
export const getQueryIds = (ids: string[]): string => {
  if (!ids?.length) return "";
  return ids.join(",");
};
