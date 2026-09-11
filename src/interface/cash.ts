export type TCash = {
  id: number;
  type: "EXPENSE" | "INCOME";
  source: string;
  description: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};
