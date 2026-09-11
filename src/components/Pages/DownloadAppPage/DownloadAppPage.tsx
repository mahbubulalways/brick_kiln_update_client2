"use client";

import { Download } from "lucide-react";
import { useEffect, useState } from "react";

export default function DownloadAppPage() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleInstalled = () => {
      setInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();

    const result = await installPrompt.userChoice;

    if (result.outcome === "accepted") {
      setInstalled(true);
    }

    setInstallPrompt(null);
  };

  if (installed || !installPrompt) {
    return null;
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <button
        type="button"
        onClick={installApp}
        className="group flex items-center gap-2.5 rounded bg-[#006A4E] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-[#00543E] hover:shadow-lg active:scale-[0.97]"
      >
        <span className="flex h-7 w-12 items-center justify-center rounded bg-white/15 transition-transform duration-200 group-hover:scale-105">
          <Download size={17} strokeWidth={2.2} />
        </span>

        <span>অ্যাপ ইনস্টল করুন</span>
      </button>
    </div>
  );
}