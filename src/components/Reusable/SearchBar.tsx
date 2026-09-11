"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { InputHTMLAttributes } from "react";

interface SearchBarProps extends InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onClear?: () => void;
}

const SearchBar = ({
  value,
  onClear,
  className = "",
  ...props
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = (search: string) => {
    const params = new URLSearchParams(searchParams.toString());

    const searchValue = search.trim();

    if (searchValue) {
      params.set("search", searchValue);
    } else {
      params.delete("search");
    }

    const query = params.toString();

    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const removeSearchParam = () => {
    updateParams("");
    onClear?.();
  };

  return (
    <div
      className={`
        flex
        h-9
        w-full
        min-w-[120]
        max-w-[250px]
        items-center
        overflow-hidden
        rounded-md
        border
        border-[#d9d9d9]
        bg-white
        ${className}
      `}
    >
      {/* Input */}
      <input
        {...props}
        value={value}
        placeholder={props.placeholder ?? "সার্চ করুন"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            updateParams(value);
          }
        }}
        className="
          h-full
          min-w-0
          flex-1
          bg-transparent
          px-2.5
          text-[12px]
          font-normal
          text-gray-700
          outline-none
          placeholder:text-[#a5a5a5]
        "
      />

      {/* Clear */}
      {value && onClear && (
        <button
          type="button"
          onClick={removeSearchParam}
          className="
            flex
            h-full
            w-7
            shrink-0
            items-center
            justify-center
            text-gray-400
            hover:text-red-500
          "
        >
          <X size={13} />
        </button>
      )}

      {/* Search Button */}
      <button
        type="button"
        onClick={() => updateParams(value)}
        className="
          flex
          h-full
          w-8
          shrink-0
          items-center
          justify-center
          border-l
          border-[#d9d9d9]
          bg-[#fafafa]
          text-gray-500
          transition-colors
          hover:bg-gray-100
          hover:text-gray-700
        "
      >
        <Search size={16} strokeWidth={2} />
      </button>
    </div>
  );
};

export default SearchBar;
