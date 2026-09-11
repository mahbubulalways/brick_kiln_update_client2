"use client";

import { ChevronDown, X } from "lucide-react";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { FaSpinner } from "react-icons/fa6";

export type TSelectOption = {
  label: string;
  value: string | number;
};

type TCustomSelect2Props = {
  label?: string;
  placeholder?: string;
  options: TSelectOption[];

  value?: string | number;
  onChange?: (value: any) => void;

  isLoading?: boolean;
  isError?: boolean;

  searchable?: boolean;
  clearable?: boolean;
  border?: boolean;
  disabled?: boolean;
  className?: string;
};

const CustomSelect2 = ({
  label,
  placeholder = "Select an option",
  options,
  value,
  onChange,
  isLoading = false,
  isError = false,
  searchable = false,
  clearable = false,
  border = true,
  disabled = false,
  className = "",
}: TCustomSelect2Props) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Internal selected value
  const [internalValue, setInternalValue] = useState<
    string | number | undefined
  >(value);

  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /*
   * যদি parent থেকে value দেওয়া হয়,
   * তাহলে সেটা internal value-এর সাথে sync হবে
   */
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  // Final selected value
  const selectedValue = value !== undefined ? value : internalValue;

  // Selected option
  const selectedOption = options.find(
    (item) => item.value === selectedValue
  );

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      const clickedInsideBox =
        wrapperRef.current?.contains(target);

      const clickedInsideDropdown = document
        .getElementById("custom-select2-dropdown")
        ?.contains(target);

      if (!clickedInsideBox && !clickedInsideDropdown) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  // Dropdown position
  const updatePosition = () => {
    if (!boxRef.current) return;

    const rect = boxRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      width: rect.width,
    });
  };

  useLayoutEffect(() => {
    if (open) {
      updatePosition();
    }
  }, [open]);

  // Update position on scroll / resize
  useEffect(() => {
    if (!open) return;

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener(
        "scroll",
        updatePosition,
        true
      );

      window.removeEventListener(
        "resize",
        updatePosition
      );
    };
  }, [open]);

  // Focus input
  useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    }
  }, [open, searchable]);

  // Filter options
  const filteredOptions = searchable
    ? options.filter((item) =>
        item.label
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : options;

  // Select option
  const selectOption = (option: TSelectOption) => {
    // Internal state update
    setInternalValue(option.value);

    // Parent callback
    onChange?.(option.value);

    // Close dropdown
    setOpen(false);

    // Clear search
    setSearch("");
  };

  // Clear selection
  const clearSelection = (e: React.MouseEvent) => {
    e.stopPropagation();

    setInternalValue(undefined);
    onChange?.(undefined);

    setSearch("");
    setOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`flex flex-col gap-1 ${className}`}
    >
      {/* Label */}
      {label && (
        <label className="font-medium text-gray-600 text-[14px]">
          {label}
        </label>
      )}

      <div className="relative">
        {/* Select Box */}
        <div
          ref={boxRef}
          onClick={() => {
            if (disabled) return;

            setOpen((prev) => !prev);
          }}
          className={`
  flex
  h-9
  w-full
  cursor-pointer
  items-center
  gap-2
  rounded-lg
  border
  border-gray-300
  px-3
  py-3
  bg-white
  transition
  ${disabled ? "cursor-not-allowed bg-gray-100 opacity-60" : ""}
  ${
    open
      ? "border-gray-300 focus-within:ring-2 focus-within:ring-[#00664A]"
      : ""
  }
`}
        >
          {/* Searchable */}
          {searchable ? (
            <input
              ref={inputRef}
              value={
                open
                  ? search
                  : selectedOption?.label ?? ""
              }
              onChange={(e) => {
                setSearch(e.target.value);
                setOpen(true);
              }}
              onFocus={() => {
                setOpen(true);

                /*
                 * এখানে search clear করছি না।
                 * তাই selected value হারাবে না।
                 */
                setSearch("");
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              placeholder={
                selectedOption?.label ?? placeholder
              }
              disabled={disabled}
              className="
                min-w-0
                flex-1
                border-none
                bg-transparent
                outline-none
                text-[14px]
              "
            />
          ) : (
            <span
              className={`
                flex-1
                truncate
                ${
                  selectedOption
                    ? "text-gray-900"
                    : "text-gray-400 text-[14px]"
                }
              `}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          )}

          {/* Clear */}
          {clearable && selectedOption && (
            <button
              type="button"
              onClick={clearSelection}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          )}

          {/* Chevron */}
          {border && (
            <ChevronDown
              size={18}
              className={`
                text-gray-500
                transition-transform
                ${open ? "rotate-180" : ""}
              `}
            />
          )}
        </div>

        {/* Dropdown */}
        {open &&
          typeof document !== "undefined" &&
          createPortal(
            <div
              id="custom-select2-dropdown"
              style={{
                position: "absolute",
                top: position.top,
                left: position.left,
                width: position.width,
                zIndex: 9999,
              }}
              className="
                max-h-60
                overflow-y-auto
                rounded-lg
                border
                border-gray-200
                bg-white
                shadow-lg
              "
            >
              {/* Error */}
              {isError ? (
                <p className="flex h-20 items-center justify-center text-red-600">
                  Failed to load options
                </p>
              ) : isLoading ? (
                /* Loading */
                <div className="flex h-20 items-center justify-center">
                  <FaSpinner className="h-7 w-7 animate-spin" />
                </div>
              ) : filteredOptions.length ? (
                /* Options */
                filteredOptions.map((item) => (
                  <button
                    key={`${String(item.value)}-${item.label}`}
                    type="button"
                    onClick={() => selectOption(item)}
                    className={`
                      block
                      w-full
                      px-4
                      py-2
                      text-[14px]
                      cursor-pointer
                      text-left
                      transition-colors
                      hover:bg-gray-100
                      ${
                        item.value === selectedValue
                          ? "bg-[#00664A]/10 text-[#00664A]"
                          : ""
                      }
                    `}
                  >
                    {item.label}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No options found
                </div>
              )}
            </div>,
            document.body
          )}
      </div>
    </div>
  );
};

export default CustomSelect2;