"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiHelpCircle,
  FiMessageCircle,
} from "react-icons/fi";

import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";

import { useGetFaqQuery } from "@/redux/system.features/system.faq.features";

export interface TFaq {
  id: string;
  title: string;
  description: string;
}

const FaqPage = () => {
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const { data: faqData, isLoading } = useGetFaqQuery(undefined);

  const faqs: TFaq[] = faqData?.data || [];

  const handleToggle = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <CustomLoader cls="h-[30vh]" />
      </div>
    );
  }

  return (
    <section className="min-h-screen w-full bg-[#F8FAF9]">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-[#039A63] px-6 py-10 text-center shadow-lg sm:px-10 md:py-12">
          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />

          <div className="absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-white/10" />

          <div className="relative z-10 mx-auto max-w-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white shadow-sm backdrop-blur-sm">
              <FiHelpCircle className="text-3xl" />
            </div>

            <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              সচরাচর জিজ্ঞাসিত প্রশ্ন
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/85 sm:text-base">
              IT Vata সফটওয়্যার সম্পর্কে সাধারণ প্রশ্নগুলোর উত্তর এখানে
              সহজভাবে দেওয়া হয়েছে।
            </p>

            {faqs.length > 0 && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                <FiMessageCircle className="text-base" />

                <span>{faqs.length} টি প্রশ্ন ও উত্তর</span>
              </div>
            )}
          </div>
        </div>

        {faqs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-5 py-14 text-center shadow-sm">
            <CustomStatus
              type="empty"
              description="কোনো FAQ পাওয়া যায়নি"
            />
          </div>
        ) : (
          <div className="mx-auto max-w-4xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
                  আপনার প্রশ্নের উত্তর খুঁজুন
                </h2>

                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  প্রশ্নের উপর ক্লিক করলে বিস্তারিত উত্তর দেখতে পারবেন।
                </p>
              </div>

              <div className="hidden rounded-full bg-[#039A63]/10 px-3 py-1.5 text-xs font-semibold text-[#039A63] sm:block">
                {faqs.length} FAQ
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaqId === faq.id;

                return (
                  <div
                    key={faq.id}
                    className={`group overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${isOpen
                      ? "border-[#039A63]/30 shadow-lg shadow-[#039A63]/5"
                      : "border-gray-200 shadow-sm hover:border-[#039A63]/25 hover:shadow-md"
                      }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggle(faq.id)}
                      aria-expanded={isOpen}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-5"
                    >
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300 sm:h-10 sm:w-10 sm:text-sm ${isOpen
                          ? "bg-[#039A63] text-white shadow-md shadow-[#039A63]/20"
                          : "bg-[#039A63]/10 text-[#039A63] group-hover:bg-[#039A63]/15"
                          }`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span
                        className={`flex-1 pr-2 text-sm font-semibold leading-6 transition-colors duration-300 sm:text-base ${isOpen
                          ? "text-[#039A63]"
                          : "text-gray-800 group-hover:text-[#039A63]"
                          }`}
                      >
                        {faq.title}
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${isOpen
                          ? "bg-[#039A63]/10 text-[#039A63]"
                          : "bg-gray-50 text-gray-400 group-hover:bg-[#039A63]/10 group-hover:text-[#039A63]"
                          }`}
                      >
                        <FiChevronDown
                          className={`text-lg transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"
                            }`}
                        />
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-300 ease-in-out ${isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className="px-4 pb-5 sm:px-5 sm:pb-6">
                          <div className="ml-12 border-l-2 border-[#039A63]/20 pl-4 sm:ml-14 sm:pl-5">
                            <div className="rounded-xl bg-[#F8FAF9] px-4 py-4 sm:px-5">
                              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">
                                {faq.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FaqPage;