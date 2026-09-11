import { TDeliveryResponse } from "./delivery";
import { TDriver } from "./driver";

export interface IVataCar {
    id: string;
    vataId: string;
    carNo: string;
    createdAt: Date;
    updatedAt: Date;

    carIncomeDeliveries: ICarIncomeDelivery[];
}

export interface ICarIncomeDelivery {
    id: string;
    amount: number;
    driverId: string;
    driver: TDriver
    deliveryId: string;
    delivery: TDeliveryResponse
    carId: string;
    car:IVataCar
    createdAt: Date;
    updatedAt: Date;
}