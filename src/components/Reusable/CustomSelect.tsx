/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { requiredSelect } from "@/utils/requiredSelect";
import { ChevronDown, X } from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Controller, FieldError, RegisterOptions } from "react-hook-form";
import { FaSpinner } from "react-icons/fa6";

export type TSelectOption = {
  label: string;
  value: any;
};

type TCustomSelectProps = {
  label?: string;
  name: string;
  placeholder?: string;
  options: TSelectOption[];
  control: any;
  rules?: RegisterOptions;
  error?: FieldError;
  isLoading?: boolean;
  isError?: boolean;
  /** true hole search input dekhabe, false hole normal select er moto hobe */
  searchable?: boolean;
  /** true hole selected value clear korar X button dekhabe */
  clearable?: boolean;
  border?: boolean;
};

const CustomSelect = ({
  label,
  name,
  placeholder,
  options,
  control,
  rules,
  error,
  isLoading,
  isError,
  searchable = false,
  clearable = false,
  border = true,
}: TCustomSelectProps) => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const clickedInsideBox = wrapperRef.current?.contains(target);
      const clickedInsideDropdown = document
        .getElementById(`select-dropdown-${name}`)
        ?.contains(target);

      if (!clickedInsideBox && !clickedInsideDropdown) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [name]);

  // calculate position of the input box (for the portal dropdown)
  const updatePosition = () => {
    if (boxRef.current) {
      const rect = boxRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY + 4, // small gap, like mt-2
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // keep dropdown attached to the input on scroll/resize (e.g. modal scroll)
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [open]);

  // searchable mode khulle input ta auto focus hobe
  useEffect(() => {
    if (open && searchable) {
      inputRef.current?.focus();
    }
  }, [open, searchable]);




  return (
    <Controller
      name={name}
      control={control}
      rules={requiredSelect(rules)}
      defaultValue={undefined}
      render={({ field }) => {
        const selectedValue = field.value;

        const selectedOption = options.find(
          (item) => item.value === selectedValue,
        );

        const filteredOptions = searchable
          ? options.filter((item) =>
              item.label.toLowerCase().includes(search.toLowerCase()),
            )
          : options;

        const selectOption = (option: TSelectOption) => {
          field.onChange(option.value);
          setSearch("");
          setOpen(false);
        };

        const clearSelection = (e: React.MouseEvent) => {
          e.stopPropagation();
          field.onChange(undefined);
          setSearch("");
        };

        return (
          <div className="flex flex-col gap-1 " ref={wrapperRef}>
            {label && (
              <label className="font-medium text-gray-600 text-[14px]">
                {label}
                {rules && <span className="text-red-500">*</span>}
              </label>
            )}

            <div className="relative">
              <div
                ref={boxRef}
                onClick={() => {
                  if (searchable) {
                    setOpen(true);
                  } else {
                    setOpen((prev) => !prev);
                  }
                }}
                className={`flex h-9 w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-3 bg-white ${
                  error
                    ? "border-2 border-red-500"
                    : "border-gray-300 focus-within:ring-2 focus-within:ring-[#00664A]"
                }`}
              >
                {searchable ? (
                  <input
                    ref={inputRef}
                    value={open ? search : (selectedOption?.label ?? "")}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setOpen(true);
                    }}
                    onFocus={() => {
                      setOpen(true);
                      setSearch("");
                    }}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 border-none bg-transparent outline-none text-[14px]"
                  />
                ) : (
                  <span
                    className={`flex-1 truncate ${
                      selectedOption ? "text-gray-900" : "text-gray-400 text-[14px]"
                    }`}
                  >
                    {selectedOption?.label ?? placeholder}
                  </span>
                )}

                {clearable && selectedOption && (
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
                {border ? (
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                ) : (
                  ""
                )}
              </div>

              {open &&
                typeof document !== "undefined" &&
                createPortal(
                  <div
                    id={`select-dropdown-${name}`}
                    style={{
                      position: "absolute",
                      top: position.top,
                      left: position.left,
                      width: position.width,
                      zIndex: 9999,
                    }}
                    className="max-h-60 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg"
                  >
                    {isError ? (
                      <p className="flex h-20 items-center justify-center text-red-600">
                        Failed to load options
                      </p>
                    ) : isLoading ? (
                      <div className="flex h-20 items-center justify-center">
                        <FaSpinner className="h-7 w-7 animate-spin" />
                      </div>
                    ) : filteredOptions.length ? (
                      filteredOptions.map((item,idx) => (
                        <button
                          key={`${idx}-${item.label}`}
                          type="button"
                          onClick={() => selectOption(item)}
                          className={`block w-full px-4 py-2 text-[14px] cursor-pointer text-left transition-colors hover:bg-gray-100 ${
                            item.value === selectedValue
                              ? "bg-[#00664A]/10 text-[#00664A]"
                              : ""
                          }`}
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
                  document.body,
                )}
            </div>

            {error && <p className="text-sm text-red-600">{error.message}</p>}
          </div>
        );
      }}
    />
  );
};

export default CustomSelect;
