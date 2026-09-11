export interface IReceivablePayable {
  id: string;
  transactionType: "GIVEN" | "TAKEN";
  amount: string;
  currentAmount: string;
  name: string;
  phone: string;
  address: string;
  transactionDate: string;
  paymentDate: string;
  witnessOne: string;
  witnessTwo: string;
  description: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}