import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomNormalModal from "@/components/Reusable/CustomNormalModal";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { useGetSingleInvoiceQuery } from "@/redux/features/invoice.features";
import { IChallanForDataShow, TCustomInvoiceModal } from "@/types/types";
import moment from "moment";
const PrintThermalInvoice = ({
  isOpen,
  onClose,
  invoiceId,
  setInvoiceId,
}: TCustomInvoiceModal) => {
  const { data, isLoading, isError } = useGetSingleInvoiceQuery(invoiceId, {
    refetchOnMountOrArgChange: true,
  });
  const invoice: IChallanForDataShow = data?.data || {};
  const handleClose = () => {
    setInvoiceId(0);
    onClose();
  };
  return (
    <CustomNormalModal isOpen={isOpen} onClose={handleClose} width="xxl">
      {isLoading ? (
        <CustomStatus type="loading" />
      ) : isError ?
        <CustomStatus type="error" />
        : !invoice ?
          <CustomStatus type="empty" /> : (
            <div>
              <div className="max-w-xs mx-auto ">
                {/* Header */}
                <div className="text-center mb-3">
                  <p className="text-sm">চালান রশিদ</p>
                  <p className="font-bold text-lg">এম.এস.বি বিকস</p>
                  <p className="text-xs">
                    হিলালিপাড়া, কাঁটাবাড়ি, গাবিনগর
                    <br />
                    ০১৯১৮৯০৮০৭০
                  </p>
                  <p className="text-xs">প্রাপকেরঃ মোঃ মানিক মিয়া</p>
                  <hr className="border-t border-gray-300 my-2" />
                </div>

                {/* Info */}
                <div className="flex justify-between text-sm mb-2">
                  <div>
                    <p>চালান: {invoice?.id}</p>
                    <p>তারিখ: {moment(invoice?.challanDate).format("L")}</p>
                    <p>সময়: {moment(invoice?.challanDate).format("LT")}</p>
                  </div>
                  <div className="text-right">
                    <p>কাস্টমার: {invoice?.customer?.name}</p>
                    <p>ঠিকানা: {invoice?.customer?.address}</p>
                    <p>মোবাইল: {invoice?.customer?.phoneNumber}</p>
                  </div>
                </div>

                {/* Table */}
                <table className="w-full text-sm border-t border-b border-gray-300 mb-2">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-center p-1">শ্রেণি</th>
                      <th className="text-center p-1">পরিমাণ</th>
                      <th className="text-center p-1">দর</th>
                      <th className="text-center p-1">মূল্য</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice?.items?.map((item) => (
                      <tr key={item?.id}>
                        <td className="p-1 text-center">{item?.class}</td>
                        <td className="p-1 text-center">{item?.quantity}</td>
                        <td className="p-1 text-center">৳ {item?.rate}</td>
                        <td className="p-1 text-center">৳ {item?.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Summary */}
                <div className="mb-2 text-sm">
                  <p className="flex justify-between">
                    মোট মূল্য: <span>{invoice?.productPrice}</span>
                  </p>
                  <p className="flex justify-between">
                    ছাড়: <span> {invoice?.due}</span>
                  </p>
                  <p className="flex justify-between">
                    গাড়ি ভাড়া: <span>{invoice?.carRent}</span>
                  </p>
                  <p className="flex justify-between">
                    সর্বমোট: <span>{invoice?.totalPrice}</span>
                  </p>
                  <p className="flex justify-between">
                    জমা: <span>{invoice?.cash}</span>
                  </p>
                  <p className="flex justify-between">
                    বাকি: <span>{invoice?.due || 0}</span>
                  </p>
                </div>

                <hr className="border-t border-gray-300 my-2" />

                {/* Signatures */}
                <div className="flex justify-between text-xs mt-4">
                  <p>গ্রাহকের সাক্ষর</p>
                  <p>ম্যানেজারের সাক্ষর</p>
                </div>

                <p className="text-center text-xs mt-4">
                  চালান/রশিদ ছাড়া লেনদেন করবেন না
                  <br />
                  Powered By PAYRA TECH - 01918908070
                </p>

                {/* Buttons */}
              </div>{" "}
              <div className="flex justify-center gap-2 mt-3 te">
                <button
                  className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                  onClick={handleClose}
                >
                  বাতিল
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded">
                  গ্রাহক কপি
                </button>
                <button className="px-3 py-1 bg-green-600 text-white rounded">
                  গ্রাহক + অফিস কপি
                </button>
              </div>
            </div>
          )}
    </CustomNormalModal>
  );
};

export default PrintThermalInvoice;
