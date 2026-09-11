import { Dispatch, SetStateAction } from "react";
import { Search } from "lucide-react";

type TSearchInput = {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

const CustomSearchInput = ({ search, setSearch }: TSearchInput) => {
  return (
    <div className="relative w-52">
      <Search
        size={15}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="সার্চ করুন..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-8 w-full rounded-md border border-gray-200 bg-white pl-8
         pr-3 text-xs text-gray-700 outline-none transition-all
          placeholder:text-gray-400 hover:border-gray-300 focus:border-[#039A63]
           focus:ring-1 focus:ring-[#039A63]/20"
      />
    </div>
  );
};

export default CustomSearchInput;