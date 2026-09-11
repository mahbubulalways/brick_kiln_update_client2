export type TFeatureKey =
    | "DASHBOARD"
    | "INVOICE"
    | "PAYMENT"
    | "DELIVERY"
    | "DUE"
    | "CASH"
    | "LOAD"
    | "UNLOAD"
    | "STOCK"
    | "LEDGER"
    | "CUSTOMER"
    | "SELL_REPORT"
    | "DOCUMENTS"
    | "ASSETS"
    | "TASK_MANAGER"
    | "VEHICLE"
    | "CAR_RENTAL"
    | "LOAN"
    | "WEATHER"
    | "SMS"
    | "DRIVER"
    | "CONTACT";


export const features: {
    key: TFeatureKey;
    label: string;
}[] = [
        {
            key: "DASHBOARD",
            label: "ড্যাশবোর্ড",
        },
        {
            key: "INVOICE",
            label: "চালান",
        },
        {
            key: "PAYMENT",
            label: "পেমেন্ট খাতা",
        },
        {
            key: "DELIVERY",
            label: "ডেলিভারি",
        },
        {
            key: "DUE",
            label: "বাকি খাতা",
        },
        {
            key: "CASH",
            label: "ক্যাশ খাতা",
        },
        {
            key: "LOAD",
            label: "লোড খাতা",
        },
        {
            key: "UNLOAD",
            label: "আনলোড",
        },
        {
            key: "STOCK",
            label: "স্টক খাতা",
        },
        {
            key: "LEDGER",
            label: "খতিয়ান",
        },
        {
            key: "CUSTOMER",
            label: "কাস্টমার",
        },
        {
            key: "SELL_REPORT",
            label: "বিক্রি রিপোর্ট",
        },
        {
            key: "DOCUMENTS",
            label: "ডকুমেন্টস",
        },
        {
            key: "ASSETS",
            label: "মালামাল স্টক",
        },
        {
            key: "TASK_MANAGER",
            label: "টাস্ক ম্যানেজার",
        },
        {
            key: "VEHICLE",
            label: "গাড়ির হিসাব",
        },
        {
            key: "DRIVER",
            label: "ড্রাইভার",
        },
        {
            key: "CAR_RENTAL",
            label: "গাড়ির ভাড়া",
        },
        {
            key: "LOAN",
            label: "দেনা পাওনা",
        },
        {
            key: "WEATHER",
            label: "আবহাওয়া",
        },
        {
            key: "SMS",
            label: "এসএমএস",
        },
        {
            key: "CONTACT",
            label: "ফোন নম্বর",
        },
    ];



export const planTypeOptions = [
    {
        label: "Free",
        value: "FREE",
    },
    {
        label: "Basic",
        value: "BASIC",
    },
    {
        label: "Professional",
        value: "PROFESSIONAL",
    },
    {
        label: "Enterprise",
        value: "ENTERPRISE",
    },
];



export const billingCycleOptions = [
    {
        label: "মাসিক",
        value: "MONTHLY",
    },
    {
        label: "বাৎসরিক",
        value: "YEARLY",
    },
];
