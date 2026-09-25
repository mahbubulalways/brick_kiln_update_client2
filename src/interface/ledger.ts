export type TLedger = {
  id: number;
  name: string;
  rate?: number;
  quantity?: number;
  salary?: number;
  weeklyFood?: number;
  openingBalance?: number;
  openingBalanceType?: string;

  serial: number;
  phoneNumber: string;
  startDate: string;

  children?: TLedger[];
};
