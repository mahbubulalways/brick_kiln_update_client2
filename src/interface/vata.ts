export type TVataInformation = {
  id: string;
  vataId: string;
  nameEnglish: string;
  nameBangla: string;
  address: string;
  subdomain: string;
  ownerName: string;
  ownerPhoneNumber: string;
  smsRate: number | null;
  softwareFee: number;
  nextPaymentDate: string | null;
  createdAt: string;
  shortDescription: string;
  additionalAddress: string;
  challanManagerPhoneNumber: string | null;

  challanPersonOneName: string | null;
  challanPersonOnePhoneNumber: string | null;

  challanPersonTwoName: string | null;
  challanPersonTwoPhoneNumber: string | null;
  shortForm: string | null;

  updatedAt: string;
};

// FOR ADMIN
export type TSubscriptionStatus =
  | "PENDING"
  | "ACTIVE"
  | "EXPIRED"
  | "CANCELLED";

export type TSubscription = {
  id: string;
  vataId: string;
  startDate: string | null;
  endDate: string | null;
  amount: string;
  status: TSubscriptionStatus;
  paidAt: string;
  paymentMethod: string;
  transactionId: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type TVataResponse = {
  id: string;
  vataId: string;

  nameBangla: string;
  nameEnglish: string;

  address: string;
  additionalAddress: string | null;

  ownerName: string;
  ownerPhoneNumber: string;

  challansPhoneNumber: string;
  challanManagerPhoneNumber: string | null;

  challanPersonOneName: string | null;
  challanPersonOnePhoneNumber: string | null;

  challanPersonTwoName: string | null;
  challanPersonTwoPhoneNumber: string | null;

  shortDescription: string | null;
  shortForm: string | null;

  nextPaymentDate: string | Date | null;

  createdAt: string | Date;

  subscriptionStart: string | Date | null;
  subscriptionEnd: string | Date | null;

  subdomain: string;

  subscriptionPlan: {
    name: string;
    price: number | string;
    billingCycle: "MONTHLY" | "YEARLY";
  };

  subscriptionPayments: TSubscription[];
};
