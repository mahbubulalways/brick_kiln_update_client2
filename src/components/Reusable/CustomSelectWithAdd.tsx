/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useGetAllRoundQuery } from "@/redux/features/round.features";
import { requiredSelect } from "@/utils/requiredSelect";
import { ChevronDown, Plus, X } from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
    Controller,
    FieldError,
    RegisterOptions,
} from "react-hook-form";

export type TSelectOption = {
    label: string;
    value: any;
};

type TCustomSelectAddProps = {
    label?: string;
    name: string;
    placeholder?: string;
    control: any;
    rules?: RegisterOptions;
    error?: FieldError;

    searchable?: boolean;
    clearable?: boolean;
    border?: boolean;

    // নতুন add করা label এর সাথে কি suffix জুড়বে (default: "রাউন্ড")
    addSuffix?: string;
};

type TRound = {
    name: string;
    id: number;
};

const CustomSelectAdd = ({
    label,
    name,
    placeholder = "সিলেক্ট করুন",
    control,
    rules,
    error,
    searchable = true,
    clearable = false,
    border = true,
    addSuffix = "রাউন্ড",
}: TCustomSelectAddProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { data, isError, isLoading } = useGetAllRoundQuery(undefined);

    // suffix ("রাউন্ড") normalize করার helper — একই লজিক API options
    // আর নতুন-add করা options দুই জায়গাতেই ব্যবহার হবে, যাতে ফরম্যাট
    // সবসময় একরকম থাকে ("1 রাউন্ড", "2 রাউন্ড" ...)
    const normalizeLabel = (raw: string) => {
        const suffixPattern = new RegExp(
            `\\s*${addSuffix}\\s*$`,
            "i",
        );

        const cleanValue = raw.trim().replace(suffixPattern, "");

        return `${cleanValue} ${addSuffix}`;
    };

    // API থেকে আসা rounds — useMemo দিয়ে stable reference রাখা হচ্ছে।
    // "data?.data ?? []" সরাসরি লিখলে প্রতি render-এ নতুন array
    // reference তৈরি হয়, যা নিচের useMemo/useEffect-কে বারবার
    // ট্রিগার করে infinite render loop তৈরি করছিল
    const rounds: TRound[] = useMemo(
        () => (data?.data ?? []) as TRound[],
        [data],
    );

    // API options — label-ই value হিসেবে ব্যবহার হবে, যাতে dropdown-এ
    // যা দেখা যায় সিলেক্ট করলে ঠিক সেটাই field-এ যায় (আগে item.id
    // চলে যেত, যেটা দেখানো label-এর সাথে মিলত না — এই বাগ এখানে ফিক্স হলো)
    const apiOptions: TSelectOption[] = useMemo(
        () =>
            rounds.map((item) => {
                const finalLabel = normalizeLabel(item.name);

                return {
                    label: finalLabel,
                    value: finalLabel,
                };
            }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [rounds, addSuffix],
    );

    // Locally add করা options (এখনো backend-এ save হয়নি)
    const [addedOptions, setAddedOptions] = useState<
        TSelectOption[]
    >([]);

    // API রিফ্রেশ হলে, একই label যদি API-তে চলে আসে তাহলে
    // ওই duplicate addedOptions থেকে সরিয়ে দাও (আসল id-টাই থাকুক)।
    // filtered.length === prev.length হলে prev-ই ফেরত দিচ্ছি, তাই
    // কিছু না বদলালে নতুন array বানিয়ে অকারণ re-render হবে না
    useEffect(() => {
        setAddedOptions((prev) => {
            const filtered = prev.filter(
                (item) =>
                    !apiOptions.some(
                        (opt) =>
                            opt.label.toLowerCase() ===
                            item.label.toLowerCase(),
                    ),
            );

            return filtered.length === prev.length
                ? prev
                : filtered;
        });
    }, [apiOptions]);

    // চূড়ান্ত options list — API + locally added (duplicate ছাড়া)
    const localOptions: TSelectOption[] = useMemo(
        () => [...apiOptions, ...addedOptions],
        [apiOptions, addedOptions],
    );

    const [position, setPosition] = useState({
        top: 0,
        left: 0,
        width: 0,
    });

    const wrapperRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as Node;

            const clickedInsideBox =
                wrapperRef.current?.contains(target);

            const clickedInsideDropdown = document
                .getElementById(`select-add-dropdown-${name}`)
                ?.contains(target);

            if (!clickedInsideBox && !clickedInsideDropdown) {
                setOpen(false);
                setSearch("");
            }
        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [name]);

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

    // Scroll + resize
    useEffect(() => {
        if (!open) return;

        window.addEventListener("scroll", updatePosition, true);
        window.addEventListener("resize", updatePosition);

        return () => {
            window.removeEventListener(
                "scroll",
                updatePosition,
                true,
            );

            window.removeEventListener(
                "resize",
                updatePosition,
            );
        };
    }, [open]);

    return (
        <Controller
            name={name}
            control={control}
            rules={requiredSelect(rules)}
            defaultValue={undefined}
            render={({ field }) => {
                const selectedValue = field.value;

                const selectedOption = localOptions.find(
                    (item) => item.value === selectedValue,
                );

                const filteredOptions = localOptions.filter((item) =>
                    item.label
                        .toLowerCase()
                        .includes(search.toLowerCase()),
                );

                // OPTION SELECT
                const selectOption = (option: TSelectOption) => {
                    field.onChange(option.value);

                    setSearch("");
                    setOpen(false);
                };

                // CLEAR
                const clearSelection = (
                    e: React.MouseEvent,
                ) => {
                    e.stopPropagation();

                    field.onChange(undefined);
                    setSearch("");
                };

                // ADD OPTION
                const handleAdd = () => {
                    const rawValue = search.trim();

                    if (!rawValue) return;

                    // একই normalizeLabel helper ব্যবহার হচ্ছে (উপরে API
                    // options-এও এটাই ব্যবহার হয়েছে), যাতে ফরম্যাট সবখানে একরকম থাকে
                    const finalLabel = normalizeLabel(rawValue);

                    // আগে থেকেই আছে কিনা (API + added — দুই জায়গাতেই চেক)
                    const existingOption = localOptions.find(
                        (item) =>
                            item.label.toLowerCase() ===
                            finalLabel.toLowerCase(),
                    );

                    if (existingOption) {
                        field.onChange(existingOption.value);

                        setSearch("");
                        setOpen(false);

                        return;
                    }

                    // নতুন option — label-ই value হিসেবে ব্যবহার হবে
                    const newOption: TSelectOption = {
                        label: finalLabel,
                        value: finalLabel,
                    };

                    setAddedOptions((prev) => [
                        ...prev,
                        newOption,
                    ]);

                    // hook form field-এ সাথে সাথেই set হয়ে যাবে
                    field.onChange(newOption.value);

                    setSearch("");
                    setOpen(false);
                };

                return (
                    <div
                        className="flex flex-col gap-1"
                        ref={wrapperRef}
                    >
                        {label && (
                            <label className="font-medium text-gray-600 text-[14px]">
                                {label}

                                {rules && (
                                    <span className="text-red-500">*</span>
                                )}
                            </label>
                        )}

                        <div className="relative">
                            {/* Select Box */}
                            <div
                                ref={boxRef}
                                onClick={() => {
                                    setOpen(true);

                                    if (searchable) {
                                        setTimeout(() => {
                                            inputRef.current?.focus();
                                        }, 0);
                                    }
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
                  px-3
                  bg-white
                  ${error
                                        ? "border-2 border-red-500"
                                        : "border-gray-300 focus-within:ring-2 focus-within:ring-[#00664A]"
                                    }
                `}
                            >
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        placeholder={
                                            selectedOption?.label ??
                                            placeholder
                                        }
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
                      text-[14px]
                      ${selectedOption
                                                ? "text-gray-900"
                                                : "text-gray-400"
                                            }
                    `}
                                    >
                                        {selectedOption?.label ??
                                            placeholder}
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

                                {border && (
                                    <ChevronDown
                                        size={18}
                                        className={`
                      text-gray-500
                      transition-transform
                      ${open
                                                ? "rotate-180"
                                                : ""
                                            }
                    `}
                                    />
                                )}
                            </div>

                            {/* Dropdown */}
                            {open &&
                                typeof document !== "undefined" &&
                                createPortal(
                                    <div
                                        id={`select-add-dropdown-${name}`}
                                        style={{
                                            position: "absolute",
                                            top: position.top,
                                            left: position.left,
                                            width: position.width,
                                            zIndex: 9999,
                                        }}
                                        className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-gray-200
                      bg-white
                      shadow-lg
                    "
                                    >
                                        {/* Options */}
                                        <div className="max-h-48 overflow-y-auto">
                                            {isLoading ? (
                                                <div className="flex h-24 items-center justify-center text-sm text-gray-400">
                                                    লোড হচ্ছে...
                                                </div>
                                            ) : isError ? (
                                                <div className="flex h-24 items-center justify-center text-sm text-red-500">
                                                    ডেটা লোড করতে সমস্যা হয়েছে
                                                </div>
                                            ) : filteredOptions.length ? (
                                                filteredOptions.map((item) => (
                                                    <button
                                                        key={`${String(
                                                            item.value,
                                                        )}-${item.label}`}
                                                        type="button"
                                                        onClick={() =>
                                                            selectOption(item)
                                                        }
                                                        className={`
                              block
                              w-full
                              px-4
                              py-2.5
                              text-left
                              text-[14px]
                              cursor-pointer
                              transition-colors
                              hover:bg-gray-100
                              ${item.value ===
                                                                selectedValue
                                                                ? "bg-[#00664A]/10 text-[#00664A]"
                                                                : ""
                                                            }
                            `}
                                                    >
                                                        {item.label}
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="
                          flex
                          h-24
                          items-center
                          justify-center
                          text-sm
                          text-gray-400
                        ">
                                                    No data
                                                </div>
                                            )}
                                        </div>

                                        {/* Add Section */}
                                        <div className="border-t border-gray-200 p-2">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    value={search}
                                                    onChange={(e) =>
                                                        setSearch(e.target.value)
                                                    }
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            handleAdd();
                                                        }
                                                    }}
                                                    placeholder="যেমন: 1"
                                                    className="
                            h-9
                            min-w-0
                            flex-1
                            rounded-lg
                            border
                            border-gray-300
                            px-3
                            text-sm
                            outline-none
                            focus:border-[#00664A]
                          "
                                                />

                                                <button
                                                    type="button"
                                                    onClick={handleAdd}
                                                    disabled={!search.trim()}
                                                    className="
                            h-9
                            shrink-0
                            rounded-lg
                            border
                            border-gray-300
                            bg-white
                            px-3
                            text-sm
                            font-medium
                            text-gray-700
                            transition
                            hover:bg-gray-50
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                            flex
                            items-center
                            gap-1
                          "
                                                >
                                                    <Plus size={16} />
                                                    অ্যাড
                                                </button>
                                            </div>
                                        </div>
                                    </div>,
                                    document.body,
                                )}

                        </div>

                        {error && (
                            <p className="text-sm text-red-600">
                                {error.message}
                            </p>
                        )}
                    </div>
                );
            }}
        />
    );
};

export default CustomSelectAdd;