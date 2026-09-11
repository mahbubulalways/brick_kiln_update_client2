"use client";

import { TChallanSummary } from "@/interface/dashboard";

const ChalanDownPart = ({summary}:{summary:TChallanSummary}) => {
  return (
    <div className=" grid grid-cols-2 gap-0.5 pt-1 ">
      <h1 className="text-[#066a20] bg-[#C0F7D3] p-1 pl-3 rounded-tl-sm ">
        মোট বিক্রির মূল্য
      </h1>
      <h1 className="font-normal bg-[#C0F7D3] p-1 pl-3  rounded-tr-sm">
        ৳ {summary?.totalSale}
      </h1>

      <h1 className="text-orange-500 bg-[#CAF8DA] p-1 pl-3">ছাড় (-)</h1>
      <h1 className="text-orange-500  bg-[#CAF8DA] p-1 pl-3">৳ {summary?.discount}</h1>

      <h1 className="text-blue-600 bg-[#D3FAE1] p-1 pl-3">গাড়ি ভাড়া (+)</h1>
      <h1 className="text-blue-600 bg-[#D3FAE1] p-1 pl-3">৳ {summary?.carRent}</h1>

      <h1 className="text-[#066a20] bg-[#DEFBE8] p-1 pl-3">
        মোট বিক্রি (ভাড়া সহ)
      </h1>
      <h1 className="bg-[#DEFBE8] p-1 pl-3">৳ {summary?.totalSaleWithRent}</h1>

      <h1 className="text-[#066a20] bg-[#E9FDEF] p-1 pl-3">নগদ</h1>
      <h1 className="font-normal bg-[#E9FDEF] p-1 pl-3">৳ {summary?.cash}</h1>

      {/*  */}
      <h1 className="text-red-600  bg-[#E2FBEA] p-1 pl-3">বাকি</h1>
      <h1 className="text-red-600  bg-[#E2FBEA] p-1 pl-3">৳ {summary?.due}</h1>
    </div>
  );
};

export default ChalanDownPart;
