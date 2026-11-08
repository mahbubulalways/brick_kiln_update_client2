import { TApprovalStatus } from "./approval";

export interface IUser {
  id: string;
  name: string;
  username: string;
  role: "OWNER" | "ADMIN" | "MANAGER" | "OPERATOR";
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deleteStatus: TApprovalStatus;
  updateStatus: TApprovalStatus;
  email: string;
  loginLimits: {
    status: boolean;
    blockTime: Date;
    totalTry: number;
    id: string;
  };
}

export interface IUserActivity {
  id: string;
  type: string;
  device: string;
  browser: string;
  ipAddress: string;
  userId: string;
  createdAt: string;
  user: IUser;
  status: boolean;
}
