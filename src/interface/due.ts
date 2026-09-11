import { TSeason } from "@/components/Dashboard/Modals/SeasonModal";

export interface ICustomer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  totalPurchased: number;
  totalPaid: number;
  nextPaymentDate: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customerCode:string
   note: string | null;
}

export interface IDueResponse {
  id: string;
  customerId: number;
  customer: ICustomer;
  collect: number;
  due: number;
  newDue: number;
  nextDate: string;
  season: TSeason;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}



export interface TDueData {
  id: number;
  due: number;
  collect: number;
  newDue: number;
  nextDate: string;
  customerId: number;
  season: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  customer: ICustomer;
}



// FORM ER DATA
export type TDueCollection = {
  customerId?: string;
  name: string;
  address: string;
  due: number | string;
  collect?: number | string;
  newDue?: number;
  nextDate?: Date;
  season:string
};