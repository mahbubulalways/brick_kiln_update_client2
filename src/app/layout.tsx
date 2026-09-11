import type { Metadata } from "next";
import "./globals.css";

import { Anek_Bangla, Hind_Siliguri } from "next/font/google";
import Providers from "@/components/Providers/Providers";
import { Toaster } from "sonner";
import NetworkStatusProvider from "@/components/Dashboard/common/NetworkStatusProvider";
import LayoutGuard from "@/components/LayoutGuard/LayoutGuard";

const anekBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ইট ভাটা সফটওয়্যার",
  description:
    "ইট ভাটা সফটওয়্যার - ইট ভাটার সকল কার্যক্রম পরিচালনার জন্য একটি সফটওয়্যার।",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body
        cz-shortcut-listen="true"
        className={`${anekBangla.className} antialiased no-scrollbar`}
      ><LayoutGuard>
          <Providers>
            {/* <NetworkStatusProvider> */}
            {children}
            {/* </NetworkStatusProvider> */}
            <Toaster />
          </Providers>
        </LayoutGuard>
      </body>
    </html>
  );
}