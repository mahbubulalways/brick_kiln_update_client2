"use client";

type CustomWarrantyCheckboxProps = {
    value: boolean;
    onChange: (value: boolean) => void;
    label?: string;
    disabled?: boolean;
};

const CustomWarrantyCheckbox = ({
    value,
    onChange,
    label = "ওয়ারেন্টি আছে?",
    disabled = false,
}: CustomWarrantyCheckboxProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;

        onChange(checked);

        console.log("Warranty:", checked);
    };

    return (
        <label
            className={`flex w-full items-center gap-3 rounded-xl border border-[#d8e5f5] bg-[#f1f6fe] px-4 py-3 ${
                disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
            }`}
        >
            <input
                type="checkbox"
                checked={value}
                onChange={handleChange}
                disabled={disabled}
                className="h-5 w-5 cursor-pointer appearance-none rounded-md border border-[#cfd4dc] bg-white transition checked:border-[#00a474] checked:bg-[#00a474] disabled:cursor-not-allowed"
            />

            <span className="text-[16px] font-medium text-[#374151]">
                {label}
            </span>
        </label>
    );
};

export default CustomWarrantyCheckbox;