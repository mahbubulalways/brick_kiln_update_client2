import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

type TNavigationItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: {
    label: string;
    href: string;
  }[];
};
export const navigationItems: TNavigationItem[] = [
  {
    label: "ড্যাশবোর্ড",
    href: "/system",
    icon: LayoutDashboard,
  },

  {
    label: "ভাটা ম্যানেজমেন্ট",
    icon: Building2,
    children: [
      {
        label: "সকল ভাটা",
        href: "/system/bricks",
      },
      {
        label: "নতুন ভাটা",
        href: "/system/bricks/create",
      },
      {
        label: "নিষ্ক্রিয় ভাটা",
        href: "/system/bricks/inactive",
      },
    ],
  },

  {
    label: "অ্যাডমিন ম্যানেজমেন্ট",
    icon: ShieldCheck,
    children: [
      {
        label: "সকল অ্যাডমিন",
        href: "/system/admins",
      },
      {
        label: "নতুন অ্যাডমিন",
        href: "/system/admins/create",
      },
    ],
  },

  {
    label: "সাবস্ক্রিপশন",
    icon: CreditCard,
    children: [
      {
        label: "সকল প্ল্যান",
        href: "/system/subscriptions/plans",
      },
      {
        label: "নতুন প্ল্যান",
        href: "/system/subscriptions/plans/create",
      },
    ],
  },

  {
    label: "পেমেন্ট",
    icon: CreditCard,
    children: [
      {
        label: "নতুন পেমেন্ট",
        href: "/system/payments",
      },
      {
        label: "পেমেন্ট হিস্টোরি",
        href: "/system/payments/history",
      },
      // {
      //     label: "পেন্ডিং পেমেন্ট",
      //     href: "/system/payments/pending",
      // },
    ],
  },

  {
    label: "SMS ম্যানেজমেন্ট",
    icon: MessageSquare,
    children: [
      {
        label: "SMS রেট",
        href: "/system/sms",
      },
      {
        label: "SMS ক্রয় রিকোয়েস্ট",
        href: "/system/sms/request",
      },
      {
        label: "SMS হিস্টোরি",
        href: "/system/sms/history",
      },
    ],
  },
  {
    label: "নোট",
    icon: CreditCard,
    href: "/system/note",
  },

  // {
  //     label: "প্ল্যাটফর্ম রিপোর্ট",
  //     icon: BarChart3,
  //     children: [
  //         {
  //             label: "ব্যবহার রিপোর্ট",
  //             href: "/system/reports/usage",
  //         },
  //         {
  //             label: "রেভিনিউ রিপোর্ট",
  //             href: "/system/reports/revenue",
  //         },
  //         {
  //             label: "ভাটা রিপোর্ট",
  //             href: "/system/reports/vata",
  //         },
  //         {
  //             label: "ইউজার রিপোর্ট",
  //             href: "/system/reports/users",
  //         },
  //     ],
  // },

  // {
  //     label: "সিস্টেম মনিটরিং",
  //     icon: Activity,
  //     children: [
  //         {
  //             label: "সিস্টেম স্ট্যাটাস",
  //             href: "/system/monitoring",
  //         },
  //         {
  //             label: "অ্যাক্টিভিটি লগ",
  //             href: "/system/activity-logs",
  //         },
  //         {
  //             label: "এরর লগ",
  //             href: "/system/error-logs",
  //         },
  //     ],
  // },

  // {
  //     label: "সাপোর্ট",
  //     icon: LifeBuoy,
  //     children: [
  //         {
  //             label: "সাপোর্ট টিকিট",
  //             href: "/system/support",
  //         },
  //         {
  //             label: "অভিযোগ",
  //             href: "/system/support/complaints",
  //         },
  //     ],
  // },

  // {
  //     label: "সিস্টেম সেটিংস",
  //     icon: Settings,
  //     children: [
  //         {
  //             label: "সাধারণ সেটিংস",
  //             href: "/system/settings",
  //         },
  //         {
  //             label: "নোটিফিকেশন",
  //             href: "/system/settings/notifications",
  //         },
  //         {
  //             label: "সিকিউরিটি",
  //             href: "/system/settings/security",
  //         },
  //     ],
  // },
];
