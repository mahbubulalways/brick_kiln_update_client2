"use client";

import { useState } from "react";

import SeasonModal from "../Modals/SeasonModal";
import { useGetActiveSeasonQuery } from "@/redux/features/season.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

const Seasons = () => {
  const { data, isLoading } = useGetActiveSeasonQuery(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const activeSeason = data?.data;

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="border-2 cursor-pointer border-gray-300 text-gray-600 px-2 py-1 rounded-md"
      >
        সিজনঃ{" "}
        {isLoading
          ? "লোড হচ্ছে..."
          : toBanglaNumber(activeSeason?.name)  || "সিজন পাওয়া যায়নি"}
      </button>

      {isOpen && (
        <SeasonModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}
    </div>
  );
};

export default Seasons;