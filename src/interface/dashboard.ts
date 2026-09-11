export type TChallanSummary = {
  totalSale: number;
  discount: number;
  carRent: number;
  totalSaleWithRent: number;
  cash: number;
  due: number;
};

export type TChallanItemReport = {
  class: string;
  totalChallan: number;
  totalQuantity: number;
  totalPrice: number;
};

export type TPaymentReport = {
  ledger: string;
  amount: number;
  paymentGiven: number;
};

export type TDashboardReport = {
  challan: {
    summary: TChallanSummary;
    items: TChallanItemReport[];
  };
  payment: {
    total: number;
    payments: TPaymentReport[];
  };
  cash: number;
  due: number;

  delivery: {
    class: string;
    quantity: number;
  }[];

  stockSummary: {
    id: string;
    vataId: string;
    rawBrick: number;
    fieldBrick: number;
    stockBrick: number;
    chulliBrick: number;
    createdAt: string;
    updatedAt: string;
  };

  sellGraph: {
    class: string;
    quantity: number;
  }[];

  deliveryGraph: {
    class: string;
    quantity: number;
  }[];
};
