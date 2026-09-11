"use client";

import { HiXMark } from "react-icons/hi2";
import { createPortal } from "react-dom";
import { Dispatch, SetStateAction } from "react";
import Image from "next/image";

import seasonImage from "@/assets/season.png";
import { useChangeActiveSeasonMutation, useGetAllSeasonsQuery } from "@/redux/features/season.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { showToast } from "@/components/Toast/CustomToast";

export type TSeason = {
  id: string;
  name: string;
};
type TSeasonModal = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export default function SeasonModal({
  isOpen,
  setIsOpen,
}: TSeasonModal) {
  const { data, isLoading } = useGetAllSeasonsQuery(undefined, {
    skip: !isOpen,
  });

  const [changeActiveSeason, { isLoading: changeLoading }] =
    useChangeActiveSeasonMutation();

  const changeSeason = async (id: string) => {
    try {
      const result = await changeActiveSeason(id).unwrap();
      if (result?.success) {
        setIsOpen(false);
      }

    } catch (error) {
      showToast({ title: "সিজন সফলভাবে পরিবর্তন করা যায়নি", type: "error" })
    }
  };

  const seasons = data?.data as TSeason[] || [];

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white w-full h-full p-6 overflow-y-auto relative no-scrollbar">
        {/* Close Button */}
        <button
          disabled={changeLoading}
          className="absolute top-4 left-4 p-2 cursor-pointer bg-red-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setIsOpen(false)}
        >
          <HiXMark size={24} />
        </button>

        {/* Title */}
        <h2 className="text-2xl text-center font-semibold mb-6 text-red-500">
          সিজন নির্বাচন করুন
        </h2>

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">সিজন লোড হচ্ছে...</p>
          </div>
        ) : seasons?.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">কোনো সিজন পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {seasons.map((season) => (
              <div
                aria-disabled={changeLoading}
                key={season.id}
                onClick={() => {
                  if (!changeLoading) {
                    changeSeason(season.id);
                  }
                }}
                className={`flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg transition ${changeLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:bg-red-100"
                  }`}
              >
                <div className="w-10 h-10 lg:w-20 lg:h-20 rounded-md flex items-center justify-center text-white font-bold mb-2">
                  <Image
                    src={seasonImage}
                    alt="season"
                    height={400}
                    width={400}
                  />
                </div>

                <span className="text-center">
                  {toBanglaNumber(season.name)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Change Season Loading Overlay */}
        {changeLoading && (
          <div className="absolute inset-0 z-50 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-white/40 border-t-red-500 rounded-full animate-spin" />

            <p className="mt-4 text-white font-semibold text-lg">
              সিজন পরিবর্তন হচ্ছে...
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}