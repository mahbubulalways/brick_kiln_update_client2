import { TDashboardItem } from "@/types/project";

import { BsCash } from "react-icons/bs";
import { CiMobile4 } from "react-icons/ci";
import {
    FaBalanceScale,
    FaSms,
    FaTasks,
    FaMoneyBillWave,
    FaVideo,
} from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { HiDocumentReport } from "react-icons/hi";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import {
    MdKeyboardArrowRight,
    MdOutlineEmojiTransportation,
    MdLocalShipping,
    MdInventory,
    MdFolder,
    MdOutlinePayments,
    MdSettings,
    MdHelpOutline,
    MdLogin,
    MdHistory,
} from "react-icons/md";
import {
    PiTrolleyFill,
    PiTruckBold,
    PiUserListFill,
    PiBooks,
    PiReceipt,
} from "react-icons/pi";
import { RiStockFill } from "react-icons/ri";
import { TiWeatherCloudy } from "react-icons/ti";

export const dashboardItemsForMobile1: TDashboardItem[] = [
    {
        id: "1",
        title: "ড্যাশবোর্ড",
        icon: GrDashboard,
        iconColor: "#039A63",
        path: "/dashboard",
        feature: "DASHBOARD",
    },

    // চালান
    {
        id: "2",
        title: "চালান",
        icon: PiReceipt,
        iconColor: "#2563EB",
        feature: "INVOICE",
        children: [
            {
                id: "2-1",
                title: "আজকের চালান",
                path: "/dashboard/invoice",
                icon: MdKeyboardArrowRight,
                iconColor: "#2563EB",
                feature: "INVOICE",
            },
            {
                id: "2-2",
                title: "অগ্রিম চালান",
                path: "/dashboard/advance-invoice",
                icon: MdKeyboardArrowRight,
                iconColor: "#7C3AED",
                feature: "INVOICE",
            },
            {
                id: "2-3",
                title: "সব চালান",
                path: "/dashboard/all-invoice",
                icon: MdKeyboardArrowRight,
                iconColor: "#0891B2",
                feature: "INVOICE",
            },
        ],
    },

    // ডেলিভারি
    {
        id: "4",
        title: "ডেলিভারি",
        icon: MdLocalShipping,
        iconColor: "#EA580C",
        feature: "DELIVERY",
        children: [
            {
                id: "4-1",
                title: "আজকের ডেলিভারি",
                path: "/dashboard/todays-delivery",
                icon: MdKeyboardArrowRight,
                iconColor: "#EA580C",
                feature: "DELIVERY",
            },
            {
                id: "4-2",
                title: "আজ ডেলিভারি যাবে",
                path: "/dashboard/delivery-today",
                icon: MdKeyboardArrowRight,
                iconColor: "#F59E0B",
                feature: "DELIVERY",
            },
            {
                id: "4-3",
                title: "বাকি ডেলিভারি লিস্ট",
                path: "/dashboard/all-deliveries",
                icon: MdKeyboardArrowRight,
                iconColor: "#DC2626",
                feature: "DELIVERY",
            },
        ],
    },

    // বাকি খাতা
    {
        id: "5",
        title: "বাকি খাতা",
        icon: FaBalanceScale,
        iconColor: "#DC2626",
        feature: "DUE",
        children: [
            {
                id: "5-1",
                title: "আজকের জমা",
                path: "/dashboard/due-collection",
                icon: MdKeyboardArrowRight,
                iconColor: "#16A34A",
                feature: "DUE",
            },
            {
                id: "5-2",
                title: "আজ জমা দেবে",
                path: "/dashboard/today-will-pay",
                icon: MdKeyboardArrowRight,
                iconColor: "#F59E0B",
                feature: "DUE",
            },
            {
                id: "5-3",
                title: "সব বাকি লিস্ট",
                path: "/dashboard/all-due-list",
                icon: MdKeyboardArrowRight,
                iconColor: "#DC2626",
                feature: "DUE",
            },
        ],
    },

    // পেমেন্ট
    {
        id: "3",
        title: "পেমেন্ট খাতা",
        icon: MdOutlinePayments,
        iconColor: "#16A34A",
        path: "/dashboard/payment",
        feature: "PAYMENT",
    },

    // ক্যাশ
    {
        id: "6",
        title: "ক্যাশ খাতা",
        path: "/dashboard/cash",
        icon: BsCash,
        iconColor: "#059669",
        feature: "CASH",
    },

    // লোড
    {
        id: "7",
        title: "লোড খাতা",
        path: "/dashboard/load",
        icon: PiTrolleyFill,
        iconColor: "#CA8A04",
        feature: "LOAD",
    },

    // আনলোড
    {
        id: "8",
        title: "আনলোড",
        path: "/dashboard/unload",
        icon: LiaTruckLoadingSolid,
        iconColor: "#EA580C",
        feature: "UNLOAD",
    },

    // স্টক
    {
        id: "9",
        title: "স্টক খাতা",
        path: "/dashboard/stock-book",
        icon: RiStockFill,
        iconColor: "#7C3AED",
        feature: "STOCK",
    },

    // বিক্রি রিপোর্ট
    {
        id: "12",
        title: "বিক্রি রিপোর্ট",
        path: "/dashboard/sell-report",
        icon: HiDocumentReport,
        iconColor: "#2563EB",
        feature: "SELL_REPORT",
    },

    // খতিয়ান
    {
        id: "10",
        title: "খতিয়ান",
        path: "/dashboard/ledger",
        icon: PiBooks,
        iconColor: "#0891B2",
        feature: "LEDGER",
    },

    // কাস্টমার
    {
        id: "11",
        title: "কাস্টমার",
        path: "/dashboard/customer",
        icon: PiUserListFill,
        iconColor: "#DB2777",
        feature: "CUSTOMER",
    },

    // দেনা-পাওনা
    {
        id: "1111",
        title: "দেনা-পাওনা",
        path: "/dashboard/loan",
        icon: FaMoneyBillWave,
        iconColor: "#DC2626",
        feature: "LOAN",
    },

    // ডকুমেন্ট
    {
        id: "20",
        title: "ডকুমেন্টস",
        path: "/dashboard/documents",
        icon: MdFolder,
        iconColor: "#F59E0B",
        feature: "DOCUMENTS",
    },

    // মালামাল
    {
        id: "21",
        title: "মালামাল স্টক",
        path: "/dashboard/assests",
        icon: MdInventory,
        iconColor: "#9333EA",
        feature: "ASSETS",
    },
];

export const dashboardItemsForMobile2: TDashboardItem[] = [
    // আবহাওয়া
    {
        id: "17",
        title: "আবহাওয়া",
        path: "/dashboard/weather",
        icon: TiWeatherCloudy,
        iconColor: "#0284C7",
        feature: "WEATHER",
    },

    // টাস্ক ম্যানেজার
    {
        id: "13",
        title: "টাস্ক ম্যানেজার",
        path: "/dashboard/task-manager",
        icon: FaTasks,
        iconColor: "#7C3AED",
        feature: "TASK_MANAGER",
    },

    // গাড়ির হিসাব
    {
        id: "14",
        title: "গাড়ির হিসাব",
        path: "/dashboard/vehicle",
        icon: PiTruckBold,
        iconColor: "#475569",
        feature: "VEHICLE",
    },

    // গাড়ির ভাড়া
    {
        id: "15",
        title: "গাড়ির ভাড়া",
        path: "/dashboard/car-rental",
        icon: MdOutlineEmojiTransportation,
        iconColor: "#EA580C",
        feature: "CAR_RENTAL",
    },

    // ফোন নম্বর
    {
        id: "19",
        title: "ফোন নম্বর",
        path: "/dashboard/contact",
        icon: CiMobile4,
        iconColor: "#0891B2",
        feature: "CONTACT",
    },

    // ভিডিও
    {
        id: "18",
        title: "ভিডিও দেখুন",
        path: "/dashboard/video",
        icon: FaVideo,
        iconColor: "#E11D48",
        feature: "VIDEO",
    },

    // হিস্ট্রি
    {
        id: "191",
        title: "আপ. হিস্ট্রি",
        path: "/dashboard/history",
        icon: MdHistory,
        iconColor: "#6366F1",
        feature: "HISTORY",
    },

    // লগইন রেকর্ড
    {
        id: "1921321",
        title: "লগইন রেকর্ড",
        path: "/dashboard/login-record",
        icon: MdLogin,
        iconColor: "#14B8A6",
        feature: "LOGIN_RECORD",
    },

    // SMS
    {
        id: "1321328",
        title: "এসএমএস",
        path: "/dashboard/sms",
        icon: FaSms,
        iconColor: "#E11D48",
        feature: "SMS",
    },

    // হেল্প লাইন
    {
        id: "1321342148",
        title: "হেল্প লাইন",
        path: "/dashboard/help-line",
        icon: MdHelpOutline,
        iconColor: "#16A34A",
        feature: "HELP_LINE",
    },

    // ফী পেমেন্ট
    {
        id: "0879718",
        title: "ফী পেমেন্ট",
        path: "/dashboard/software-payment",
        icon: FaMoneyBillWave,
        iconColor: "#CA8A04",
        feature: "SOFTWARE_PAYMENT",
    },

    // সেটিংস
    {
        id: "1678768",
        title: "সেটিংস",
        path: "/dashboard/settings",
        icon: MdSettings,
        iconColor: "#64748B",
        feature: "SETTINGS",
    },
];