import { TSeason } from "@/components/Dashboard/Modals/SeasonModal";
import { IChallanForDataShow } from "@/types/types";

export interface TCustomer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  totalPurchasedQuantity: number;
  totalDeliveredQuantity: number;
  totalRemainingQuantity: number;
  totalAmount: number;
  totalPaid: number;
  totalDue: number;
  note: string;
  customerCode: string;
  nextPaymentDate: string;
  customerDues: ICustomerDue[]
  currentSeasonDue: number,
  previousDue: number
  createdAt:string
}

export interface ICustomerDue {
  id: string;
  customerId: string;
  seasonId: string;
  challanId: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  nextPaymentDate: string | null;
  createdAt: string;
  updatedAt: string;
  customer: TCustomer

  season: TSeason;

  challan?: IChallanForDataShow;
}