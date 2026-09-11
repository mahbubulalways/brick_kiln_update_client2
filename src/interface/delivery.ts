import { IChallanForDataShow } from "@/types/types";
import { IUser } from "./user";
import { TCustomer } from "./customer";
import { TDriver } from "./driver";

export type TInvoiceCustomer = {
  id: number;
  name: string;
  phoneNumber: string;
  address: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
};

export type TDeliveryInvoice = {
  id: string;
  customer: TCustomer;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  serial: number;
  challanDate: string;
  deliveryDate: string;
};

export type TDeliveryResponse = {
  id: number;
  carNo: string;
  class: string;
  deliveryDate: string;
  nextDeliveryDate: string;
  deliveryNo: number;
  quantity: number;
  deliveryReceived: number;
  deliveryRemaining: number;
  driver: TDriver;
  invoiceId: string;
  invoice: IChallanForDataShow;
  isDeleted: boolean;
  createdAt: string;
  deliveryBy: IUser;
  lastDelivered: number;
};

export type TDeliveryWithCustomer = {
  id: number;
  deliveryDate: string;
  deliveryNo: number;
  nextDeliveryDate: string;
  quantity: number;
  deliveryReceived: number;
  class: string;
  deliveryRemaining: number;
  driverName: string;
  driverPhoneNumber: string;
  carNo: string;
  carRent: number;
  invoiceId: number;
  isDeleted: boolean;
  createdAt: string;
  invoice: IChallanForDataShow;
};
