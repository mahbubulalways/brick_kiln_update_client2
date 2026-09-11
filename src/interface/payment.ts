export type TLedger = {
  id: number;
  name: string;
  serial: number;
  parentId: number;
  createdAt: string;
  updatedAt: string;
};

export type TPaymentResponse = {
  id: number;
  ledgerId: number;
  paymentType: string;
  paymentDetails: string | null;
  quantity: number;
  rate: number;
  totalBill: number;
  cutting: number;
  payment: number;
  paymentDifference: number;
  document: string | null;
  createdAt: string;
  updatedAt: string;
  ledger: TLedger;
  paymentDate: string;
  address: string;
  serial: number;
};

export type TPaymentReportResponse = {
  ledgerId: number;
  ledger: string;
  quantity: number;
  totalBill: number;
  advancePayment: number;
  cutting: number;
  payment: number;
  paymentDifference: number;
};
