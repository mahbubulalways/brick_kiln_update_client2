import { TVataResponse } from "./vata";

export type TSubscriptionPaymentStatus =
  | "PENDING"
  | "PAID"
  | "REJECTED";

export type TPaymentMethod =
  | "bkash"
  | "nagad"
  | "rocket"
  | string;

export type TSubscriptionPaymentPlan = {
  id: string;
  name: string;
  price: number | string;
};


export type TSubscriptionPayment = {
  id: string;

  amount: number | string;
  paymentMethod: TPaymentMethod;
  phoneNumber: string;
  transactionId: string;

  paidAt: string ;
  startDate: string | null;
  endDate: string | null;

  status: TSubscriptionPaymentStatus;

  createdAt: string;
  updatedAt: string;

  subscriptionPlanId: string;
  vataId: string;

  subscriptionPlan: TSubscriptionPaymentPlan | null;
  vata: TVataResponse ;
};