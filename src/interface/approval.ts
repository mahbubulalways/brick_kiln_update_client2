import { IUser } from "./user";

export type TActivityAction = "CREATE" | "UPDATE" | "DELETE";

export type TApprovalAction = "UPDATE" | "DELETE";

export type TApprovalStatus = "DEFAULT" | "PENDING" | "APPROVED" | "CANCELLED";

export type TModuleType =
  | "CHALLAN"
  | "DELIVERY"
  | "CUSTOMER"
  | "PAYMENT"
  | "STOCK"
  | "LEDGER"
  | "DUE"
  | "CASH"
  | "INVOICE"
  | "CLASS_RATE"
  | "TASK"
  | "DRIVER";

export interface IApprovalRequest {
  id: string;
  vataId: string;
  requestedById: string;
  action: TApprovalAction;
  module: TModuleType;
  targetId: string;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  status: TApprovalStatus;
  isDeleted: boolean;
  reviewedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  requestedBy: IUser;
}
