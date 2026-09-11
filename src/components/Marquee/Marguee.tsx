"use client";
import { useState, useEffect } from "react";

export default function MarqueeOneLine() {
  const messages = [
    "📢 সফটওয়্যারটি ব্যবহার করতে কোন সমস্যা হলে দ্রুত হেল্প লাইনে যোগাযোগ করুন। ধন্যবাদ।",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % messages.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div className="overflow-hidden whitespace-nowrap w-full h-8 relative ">
      <div
        key={current}
        className="absolute whitespace-nowrap animate-marquee text-white text-md"
      >
        {messages[current]}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-marquee {
          display: inline-block;
          animation: marquee 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
