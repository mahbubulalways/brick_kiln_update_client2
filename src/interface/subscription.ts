export type TSubscriptionType =
    | "FREE"
    | "BASIC"
    | "STANDARD"
    | "PREMIUM"
    | "ENTERPRISE";

export type TBillingCycle =
    | "MONTHLY"
    | "YEARLY";

export type TSubscriptionPlan = {
    id: string
    name: string;
    type: TSubscriptionType;
    billingCycle: TBillingCycle;
    description: string;
    price: number;
    features: string[];
    maxInvoices: number;
    maxSms: number;
    maxStorage: number;
    maxTasks: number;
    maxUsers: number;
    isActive: boolean;
    _count: {
        vatas: number
    }
};