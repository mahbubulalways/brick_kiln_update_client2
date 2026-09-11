import CustomModal from "@/components/Reusable/CustomModal";

export type TItems = {
  class: string;
  delivered: number;
};

type TDeliveryReport = {
  items: TItems[];
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

const DeliveryReportModal = ({
  isOpen,
  items,
  onClose,
  title,
}: TDeliveryReport) => {
  // Group and sum delivery by class
  const groupedItems = items.reduce<TItems[]>((acc, item) => {
    const existingItem = acc.find(
      (currentItem) => currentItem.class === item.class,
    );

    if (existingItem) {
      existingItem.delivered += item.delivered;
    } else {
      acc.push({
        class: item.class,
        delivered: item.delivered,
      });
    }

    return acc;
  }, []);

  // Total delivery
  const totalDelivery = groupedItems.reduce(
    (total, item) => total + (item.delivered || 0),
    0,
  );

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      width="md"
    >
      {!items?.length ? (
        <div className="flex min-h-[260px] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <span className="text-xl text-gray-400">—</span>
            </div>

            <p className="text-sm font-medium text-gray-600">
              কোনো ডেলিভারি রিপোর্ট পাওয়া যায় নি
            </p>

            <p className="mt-1 text-xs text-gray-400">
              নির্বাচিত সময়ের মধ্যে কোনো ডেলিভারি নেই
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Summary */}
          <div className="flex items-center justify-between rounded-xl border border-[#DCE5ED] bg-[#F8FAFC] px-4 py-3">
            <div>
              <p className="text-xs font-medium text-gray-500">
                মোট শ্রেণি
              </p>

              <p className="mt-0.5 text-lg font-bold text-gray-800">
                {groupedItems.length.toLocaleString()}
              </p>
            </div>

            <div className="h-9 w-px bg-gray-200" />

            <div className="text-right">
              <p className="text-xs font-medium text-gray-500">
                মোট ডেলিভারি
              </p>

              <p className="mt-0.5 text-lg font-bold text-[#006A4E]">
                {totalDelivery.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Report Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_140px] items-center bg-gray-50 px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                শ্রেণি
              </span>

              <span className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                ডেলিভারি
              </span>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {groupedItems.map((item, index) => (
                <div
                  key={`${item.class}-${index}`}
                  className="grid grid-cols-[1fr_140px] items-center px-4 py-3 transition-colors hover:bg-gray-50"
                >
                  {/* Class */}
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#E8F5F0] text-xs font-semibold text-[#006A4E]">
                      {index + 1}
                    </span>

                    <span className="text-sm font-medium text-gray-700">
                      {item.class}
                    </span>
                  </div>

                  {/* Delivery */}
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-800">
                      {item.delivered.toLocaleString()}
                    </span>

                    <span className="ml-1 text-xs text-gray-400">
                      টি
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="grid grid-cols-[1fr_140px] items-center border-t border-gray-200 bg-[#F0F9F6] px-4 py-3.5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006A4E]" />

                <span className="text-sm font-bold text-[#006A4E]">
                  সর্বমোট
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-bold text-[#006A4E]">
                  {totalDelivery.toLocaleString()}
                </span>

                <span className="ml-1 text-xs font-medium text-[#006A4E]/70">
                  টি
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </CustomModal>
  );
};

export default DeliveryReportModal;