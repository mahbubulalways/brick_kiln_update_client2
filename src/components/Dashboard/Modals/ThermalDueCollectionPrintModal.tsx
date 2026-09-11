"use client";
import CustomNormalModal from "@/components/Reusable/CustomNormalModal";
import { Printer, X } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
};

const ThermalDueCollectionPrintModal = ({ isOpen, onClose }: TCustomModal) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <CustomNormalModal isOpen={isOpen} onClose={onClose} width="xxl">
      <div className="w-[400px] mx-auto my-5 bg-white text-center  text-gray-800">
        {/* Header */}
        <h2 className="  font-medium border-b border-dotted pb-1">
          বাকি জমা রশিদ
        </h2>
        <h1 className="text-xl font-extrabold mt-2">এম.এস.বি ব্রিকস</h1>
        <p className="  leading-4">
          হিলালিপাড়া, কাটাবাড়ি, গোবিন্দগঞ্জ <br />
          ০১৯১০৩৪৯১৯১, ০১৯১৩৯৪৯১৯১ <br />
          প্রোপাইটরঃ মোঃ মানিক মিয়া
        </p>

        {/* Info Table */}
        <div className="mt-3   border-t border-dotted border-gray-400 pt-1">
          <div className="flex justify-between text-left mt-3  ">
            <div>
              <p>কাস্টমার আইডিঃ ১</p>
              <p>তারিখঃ ০৮-১১-২০২৫</p>
              <p>সময়ঃ রাত ০৩ঃ০৪</p>
            </div>
            <div className="text-right">
              <p>কাস্টমারঃ মানিক</p>
              <p>ঠিকানাঃ রংপুর</p>
              <p>মোবাইলঃ ০১৯১৩৯৪৯১৯১</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mt-2   border-collapse border-t border-b border-dotted border-gray-400">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-1">নং</th>
              <th className="py-1">মোট বাকি</th>
              <th className="py-1">জমা</th>
              <th className="py-1">অবশিষ্ট</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-1">১৩</td>
              <td className="py-1">১,২১,000</td>
              <td className="py-1">২১,000</td>
              <td className="py-1">১,00,000</td>
            </tr>
          </tbody>
        </table>

        {/* Remaining */}
        <div className="mt-3 border border-dotted border-gray-400 p-2 rounded text-center">
          <p className="font-bold ">বাকি রইলঃ ১,00,000 টাকা</p>
          <p className="  mt-1">পরিশোধের তারিখঃ —</p>
        </div>

        {/* Footer */}
        <div className="mt-3 border-t border-dotted pt-2 text-xs text-gray-600 leading-4">
          <p>চালান/রশিদ ছাড়া লেনদেন করবেন না</p>
          <p>
            Powered By{" "}
            <span className="font-semibold text-gray-700">PAYRA TECH</span> -
            ০১৯১৯৮০৮০৭০
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-4 print:hidden">
          <button className="flex items-center gap-2 px-2 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md  ">
            <X className="w-4 h-4" /> বাতিল
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-2 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-md  "
          >
            <Printer className="w-4 h-4" /> প্রিন্ট (খালি)
          </button>
        </div>
      </div>
    </CustomNormalModal>
  );
};

export default ThermalDueCollectionPrintModal;
