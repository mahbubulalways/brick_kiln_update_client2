import { IUser } from "./user";

export type TStockBook = {
    id: string;
    class: string;
    stockIn: number;
    stockOut: number;
    description: string;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    createdById: string;
    createdBy: IUser
    seasonId: string;
    vataId: string;
};



export type TMainStock = {
  className: string;
  rate: number;
  totalStock: number;
  deliveryPending: number;
  delivered:number;
  mainStock: number;
  stockValue: number;
};

export type TMainStockTotal = {
  totalStock: number;
  deliveryPending: number;
  mainStock: number;
  delivered:number;
  stockValue: number;
};

