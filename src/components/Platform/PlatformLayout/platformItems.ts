import {
  Activity,
  BarChart3,
  Building2,
  CreditCard,
  DatabaseBackup,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LifeBuoy,
  MessageSquare,
  PlayCircle,
  Settings,
  ShieldCheck,
  Users,
  WalletCards,
  Info,
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
    label: "ভাটা ব্যবস্থাপনা",
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
    label: "অ্যাডমিন ব্যবস্থাপনা",
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
    label: "সাবস্ক্রিপশন ব্যবস্থাপনা",
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
    label: "পেমেন্ট ব্যবস্থাপনা",
    icon: WalletCards,
    children: [
      {
        label: "নতুন পেমেন্ট",
        href: "/system/payments",
      },
      {
        label: "পেমেন্টের ইতিহাস",
        href: "/system/payments/history",
      },
    ],
  },

  {
    label: "এসএমএস ব্যবস্থাপনা",
    icon: MessageSquare,
    children: [
      {
        label: "এসএমএস রেট",
        href: "/system/sms",
      },
      {
        label: "এসএমএস ক্রয় অনুরোধ",
        href: "/system/sms/request",
      },
      {
        label: "এসএমএসের ইতিহাস",
        href: "/system/sms/history",
      },
    ],
  },

  {
    label: "নোট",
    icon: FileText,
    href: "/system/note",
  },

  {
    label: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    icon: HelpCircle,
    href: "/system/faq",
  },

  {
    label: "আমাদের সম্পর্কে",
    icon: Info,
    href: "/system/about",
  },

  {
    label: "সহায়তা",
    icon: LifeBuoy,
    href: "/system/helpline",
  },

  {
    label: "ভিডিও লিংক",
    icon: PlayCircle,
    href: "/system/video",
  },

  {
    label: "ডেটাবেজ ব্যাকআপ",
    icon: DatabaseBackup,
    href: "/system/backup",
  },

  // {
  //     label: "প্ল্যাটফর্ম রিপোর্ট",
  //     icon: BarChart3,
  //     children: [
  //         {
  //             label: "ব্যবহার প্রতিবেদন",
  //             href: "/system/reports/usage",
  //         },
  //         {
  //             label: "রাজস্ব প্রতিবেদন",
  //             href: "/system/reports/revenue",
  //         },
  //         {
  //             label: "ভাটা প্রতিবেদন",
  //             href: "/system/reports/vata",
  //         },
  //         {
  //             label: "ইউজার প্রতিবেদন",
  //             href: "/system/reports/users",
  //         },
  //     ],
  // },

  // {
  //     label: "সিস্টেম পর্যবেক্ষণ",
  //     icon: Activity,
  //     children: [
  //         {
  //             label: "সিস্টেমের অবস্থা",
  //             href: "/system/monitoring",
  //         },
  //         {
  //             label: "কার্যক্রমের লগ",
  //             href: "/system/activity-logs",
  //         },
  //         {
  //             label: "ত্রুটির লগ",
  //             href: "/system/error-logs",
  //         },
  //     ],
  // },

  // {
  //     label: "সহায়তা কেন্দ্র",
  //     icon: LifeBuoy,
  //     children: [
  //         {
  //             label: "সহায়তা টিকিট",
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
  //             label: "নিরাপত্তা",
  //             href: "/system/settings/security",
  //         },
  //     ],
  // },
];
