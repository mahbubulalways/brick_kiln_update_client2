"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import CustomModal from "@/components/Reusable/CustomModal";
import { useLazyGetOldCustomerQuery } from "@/redux/features/customer.features";

export type TCustomer = {
  id: string;
  customerCode: string;
  name: string;
  phoneNumber: string;
  address?: string;
};

type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  setCustomer: (customer: TCustomer) => void;
};

const OldCustomerModal = ({
  isOpen,
  onClose,
  setCustomer,
}: TCustomModal) => {
  const [searchTerm, setSearchTerm] = useState("");

  const [getOldCustomer, { data, isLoading, isFetching, isError }] =
    useLazyGetOldCustomerQuery();

  const customers: TCustomer[] = data?.data ?? [];
  console.log(customers)
  // Modal close হলে search field clear হবে
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
    }
  }, [isOpen]);

  const handleSearch = async () => {
    const search = searchTerm.trim();

    if (!search) return;

    try {
      await getOldCustomer(search).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // পুরাতন customer select
  const handleAddCustomer = (customer: TCustomer) => {
    setCustomer(customer);
    onClose();
  };

  const isSearching = isLoading || isFetching;

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="পুরাতন কাস্টমার"
      width="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="নাম, মোবাইল নম্বর বা ঠিকানা দিয়ে খুঁজুন..."
              className="
                h-10 w-full
                rounded-md
                border border-gray-300
                px-4 pr-10
                text-sm
                outline-none
                focus:border-[#009b6b]
                focus:ring-1
                focus:ring-[#009b6b]
              "
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={!searchTerm.trim() || isSearching}
              className="
                absolute right-0 top-0
                flex h-10 w-10
                items-center justify-center
                text-gray-500
                disabled:opacity-50
              "
            >
              <Search size={18} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={!searchTerm.trim() || isSearching}
            className="
              h-10
              min-w-[90px]
              rounded-md
              bg-[#009b6b]
              px-5
              text-sm
              font-medium
              text-white
              hover:bg-[#00875e]
              disabled:opacity-50
            "
          >
            {isSearching ? "খুঁজছে..." : "খুঁজুন"}
          </button>
        </div>

        {/* Initial State */}
        {!isSearching &&
          !isError &&
          customers.length === 0 &&
          !searchTerm && (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Search size={22} className="text-gray-500" />
                </div>

                <p className="text-sm font-medium text-gray-600">
                  কাস্টমার খুঁজুন
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  নাম, মোবাইল নম্বর বা ঠিকানা দিয়ে কাস্টমার খুঁজুন
                </p>
              </div>
            </div>
          )}

        {/* Loading */}
        {isSearching && (
          <div className="flex min-h-[220px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#009b6b]" />

              <p className="mt-3 text-sm text-gray-500">
                কাস্টমার খোঁজা হচ্ছে...
              </p>
            </div>
          </div>
        )}

        {/* Not Found */}
        {!isSearching &&
          (isError ||
            (searchTerm.trim() && customers.length === 0)) && (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <Search size={22} className="text-gray-400" />
                </div>

                <p className="text-sm font-medium text-gray-600">
                  কোনো কাস্টমার পাওয়া যায়নি
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  অন্য নাম, মোবাইল নম্বর বা ঠিকানা দিয়ে চেষ্টা করুন
                </p>
              </div>
            </div>
          )}

        {/* Customer List */}
        {!isSearching && customers.length > 0 && (
          <div className="max-h-[350px] space-y-2 overflow-y-auto">
            {customers.map((customer) => (
              <div
                key={customer.id}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  rounded-md
                  border border-gray-200
                  p-3
                  hover:bg-gray-50
                "
              >
                {/* Customer Info */}
                <div className="flex min-w-0 items-center gap-3">
                  {/* Customer Code */}
                  <span
                    className="
                      shrink-0
                      rounded-md
                      bg-red-500
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-white
                    "
                  >
                    {customer.customerCode}
                  </span>

                  {/* Name, Phone & Address */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">
                      {customer.name}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500">
                      <span>
                        {customer.phoneNumber || "-"}
                      </span>

                      <span>•</span>

                      <span className="truncate">
                        {customer.address || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add Button */}
                <button
                  type="button"
                  onClick={() => handleAddCustomer(customer)}
                  className="
                    shrink-0
                    rounded-md
                    bg-[#009b6b]
                    px-3
                    py-1.5
                    text-xs
                    font-medium
                    text-white
                    hover:bg-[#00875e]
                    cursor-pointer
                  "
                >
                  যোগ করুন
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Result Count */}
        {!isSearching && customers.length > 0 && (
          <p className="border-t pt-2 text-xs text-gray-400">
            মোট {customers.length} জন কাস্টমার পাওয়া গেছে
          </p>
        )}
      </div>
    </CustomModal>
  );
};

export default OldCustomerModal;