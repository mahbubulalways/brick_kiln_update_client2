import { TDashboardItem } from "@/types/project";

import { BsCash } from "react-icons/bs";
import { CiMobile4 } from "react-icons/ci";
import { FaBalanceScale, FaSms, FaTasks } from "react-icons/fa";
import { GrDashboard } from "react-icons/gr";
import { HiDocumentReport } from "react-icons/hi";
import { LiaTruckLoadingSolid } from "react-icons/lia";
import {
  MdCameraRoll,
  MdKeyboardArrowRight,
  MdOutlineEmojiTransportation,
  MdPayment,
} from "react-icons/md";
import { PiTrolleyFill, PiTruckBold, PiUserListFill } from "react-icons/pi";
import { RiStockFill } from "react-icons/ri";
import { TiWeatherCloudy } from "react-icons/ti";

export const dashboardItems1: TDashboardItem[] = [
  {
    id: "1",
    title: "ড্যাশবোর্ড",
    icon: GrDashboard,
    path: "/dashboard",
    feature: "DASHBOARD",
  },

  {
    id: "2",
    title: "চালান",
    icon: GrDashboard,
    feature: "INVOICE",
    children: [
      {
        id: "2-1",
        title: "আজকের চালান",
        path: "/dashboard/invoice",
        icon: MdKeyboardArrowRight,
        feature: "INVOICE",
      },
      {
        id: "2-2",
        title: "অগ্রিম চালান",
        path: "/dashboard/advance-invoice",
        icon: MdKeyboardArrowRight,
        feature: "INVOICE",
      },
      {
        id: "2-3",
        title: "সব চালান",
        path: "/dashboard/all-invoice",
        icon: MdKeyboardArrowRight,
        feature: "INVOICE",
      },
    ],
  },

  {
    id: "3",
    title: "পেমেন্ট খাতা",
    icon: MdPayment,
    path: "/dashboard/payment",
    feature: "PAYMENT",
  },

  {
    id: "4",
    title: "ডেলিভারি",
    icon: MdPayment,
    feature: "DELIVERY",
    children: [
      {
        id: "4-1",
        title: "আজকের ডেলিভারি",
        path: "/dashboard/todays-delivery",
        icon: MdKeyboardArrowRight,
        feature: "DELIVERY",
      },
      {
        id: "4-2",
        title: "আজ ডেলিভারি যাবে",
        path: "/dashboard/delivery-today",
        icon: MdKeyboardArrowRight,
        feature: "DELIVERY",
      },
      {
        id: "4-3",
        title: "বাকি ডেলিভারি লিস্ট",
        path: "/dashboard/all-deliveries",
        icon: MdKeyboardArrowRight,
        feature: "DELIVERY",
      },
    ],
  },

  {
    id: "5",
    title: "বাকি খাতা",
    icon: MdPayment,
    feature: "DUE",
    children: [
      {
        id: "5-1",
        title: "আজকের জমা",
        path: "/dashboard/due-collection",
        icon: MdKeyboardArrowRight,
        feature: "DUE",
      },
      {
        id: "5-2",
        title: "আজ জমা দেবে",
        path: "/dashboard/today-will-pay",
        icon: MdKeyboardArrowRight,
        feature: "DUE",
      },
      {
        id: "5-3",
        title: "সব বাকি লিস্ট",
        path: "/dashboard/all-due-list",
        icon: MdKeyboardArrowRight,
        feature: "DUE",
      },
    ],
  },

  {
    id: "6",
    title: "ক্যাশ খাতা",
    path: "/dashboard/cash",
    icon: BsCash,
    feature: "CASH",
  },

  {
    id: "7",
    title: "লোড খাতা",
    path: "/dashboard/load",
    icon: PiTrolleyFill,
    feature: "LOAD",
  },

  {
    id: "8",
    title: "আনলোড",
    path: "/dashboard/unload",
    icon: LiaTruckLoadingSolid,
    feature: "UNLOAD",
  },

  {
    id: "9",
    title: "স্টক খাতা",
    icon: RiStockFill,
    feature: "STOCK",
    path: "/dashboard/stock-book",
  },

  {
    id: "10",
    title: "খতিয়ান",
    path: "/dashboard/ledger",
    icon: MdCameraRoll,
    feature: "LEDGER",
  },

  {
    id: "11",
    title: "কাস্টমার",
    path: "/dashboard/customer",
    icon: PiUserListFill,
    feature: "CUSTOMER",
  },

  {
    id: "12",
    title: "বিক্রি রিপোর্ট",
    path: "/dashboard/sell-report",
    icon: HiDocumentReport,
    feature: "SELL_REPORT",
  },

  {
    id: "20",
    title: "ডকুমেন্টস",
    path: "/dashboard/documents",
    icon: HiDocumentReport,
    feature: "DOCUMENTS",
  },

  {
    id: "21",
    title: "মালামাল স্টক",
    icon: HiDocumentReport,
    feature: "ASSETS",
    children: [
      {
        id: "21-1",
        title: "মালামালের ক্যাটাগরি",
        path: "/dashboard/assests/category",
        icon: MdKeyboardArrowRight,
        feature: "ASSETS",
      },
      {
        id: "21-2",
        title: "মালামালের স্টক",
        path: "/dashboard/assests",
        icon: MdKeyboardArrowRight,
        feature: "ASSETS",
      },
    ],
  },
];

export const dashboardItems2: TDashboardItem[] = [
  {
    id: "13",
    title: "টাস্ক ম্যানেজার",
    path: "/dashboard/task-manager",
    icon: FaTasks,
    feature: "TASK_MANAGER",
  },

  {
    id: "14",
    title: "গাড়ির হিসাব",
    path: "/dashboard/vehicle",
    icon: PiTruckBold,
    feature: "VEHICLE",
  },

  {
    id: "15",
    title: "গাড়ির ভাড়া",
    path: "/dashboard/car-rental",
    icon: MdOutlineEmojiTransportation,
    feature: "CAR_RENTAL",
  },
  {
    id: "115",
    title: "ড্রাইভার",
    path: "/dashboard/driver",
    icon: MdOutlineEmojiTransportation,
    feature: "DRIVER",
  },

  {
    id: "16",
    title: "দেনা পাওনা",
    path: "/dashboard/loan",
    icon: FaBalanceScale,
    feature: "LOAN",
  },

  {
    id: "17",
    title: "আবহাওয়া",
    path: "/dashboard/weather",
    icon: TiWeatherCloudy,
    feature: "WEATHER",
  },

  {
    id: "18",
    title: "এসএমএস",
    path: "/dashboard/sms",
    icon: FaSms,
    feature: "SMS",
  },

  {
    id: "19",
    title: "ফোন নম্বর",
    path: "/dashboard/contact",
    icon: CiMobile4,
    feature: "CONTACT",
  },
];
