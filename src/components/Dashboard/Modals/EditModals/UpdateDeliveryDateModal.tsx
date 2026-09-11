"use client";
import { Dispatch, SetStateAction, useState } from "react";
import CustomModal from "@/components/Reusable/CustomModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import UpdateItemDate from "@/components/UpdateDeliveryDate/UpdateItemDate";
import UpdateInvoiceDate from "@/components/UpdateDeliveryDate/UpdateInvoiceDate";
type TCustomModal = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  itemIds: string[];
  setItemIds: Dispatch<SetStateAction<string[]>>;
};

const UpdateDeliveryDateModal = ({
  isOpen,
  onClose,
  id,
  itemIds,
  setItemIds,
}: TCustomModal) => {
  const isLoading = false;
  const [option, setOption] = useState<string>("class");

  const handleOptionChange = (value: string) => {
    setOption(value);
    console.log("Selected option:", value);
  };

  const options = [
    { label: "শ্রেণি অনুযায়ী", value: "class" },
    { label: "পুরো চালান", value: "full" },
  ];

  const handleCloseModal = () => {
    setItemIds([]);
    onClose();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCloseModal}
      title={`চালান নং - ${id}`}
      width="sm"
    >
      {isLoading ? (
        <CustomLoader cls="h-[10vh]" />
      ) : (
        <div>
          <div>
            <h1 className="text-gray-600 text-sm font-medium pt-3">অপশন নির্বাচন</h1>
            <div className="flex items-center gap-6 pt-5">
              {options.map((opt) => (
                <label
                  key={opt.value}
                  className="flex text-sm items-center gap-2 cursor-pointer"
                >
                  {/* Hidden native radio */}
                  <input
                    type="radio"
                    name="deliveryOption"
                    value={opt.value}
                    checked={option === opt.value}
                    onChange={() => handleOptionChange(opt.value)}
                    className="hidden"
                  />

                  {/* Custom radio */}
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      option === opt.value
                        ? "border-green-600 bg-green-600"
                        : "border-gray-400"
                    }`}
                  >
                    {option === opt.value && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </span>

                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-5 pb-4">
            {option === "class" ? (
              <UpdateItemDate invoiceId={id} itemIds={itemIds} handleCloseModal={handleCloseModal}/>
            ) : (
              <UpdateInvoiceDate invoiceId={id} handleCloseModal={handleCloseModal} />
            )}
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default UpdateDeliveryDateModal;
