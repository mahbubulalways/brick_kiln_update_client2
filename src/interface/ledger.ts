export type TLedger = {
  id: number;
  name: string;
  children?: {
    id: number;
    name: string;
  }[];
};
