type TLabelValuePair<T> = {
  data: T[];
  label: keyof T;
  value: keyof T;
  extra?: keyof T;
};

const formatLabelValuePair = <T>({
  data,
  label,
  value,
  extra,
}: TLabelValuePair<T>) => {
  if (!data?.length) {
    return [];
  }
  return data.map((dt) => ({
    label: String(`${dt[label]}${dt[extra!] ? `-${dt[extra!]}` : ""}`),
    value: String(dt[value]),
  }));
};

export default formatLabelValuePair;
