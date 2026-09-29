import { TApprovalStatus } from "./approval";

export type TDriver = {
  id: string;
  name: string;
  PhoneNumber: string;
  salary: number;
  vataId: string;
  createdAt: string;
  updatedAt: string;

  deleteStatus: TApprovalStatus;
  updateStatus: TApprovalStatus;
};
