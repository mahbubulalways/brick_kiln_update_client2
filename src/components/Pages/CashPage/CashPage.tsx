"use client";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { useRef, useState } from "react";
import NewCashModal from "@/components/Dashboard/Modals/NewCashModal";
import { useDeleteCashMutation, useGetAllCashQuery } from "@/redux/features/cash.features";
import { TCash } from "@/interface/cash";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { TQuery } from "@/interface/query";
import SearchBar from "@/components/Reusable/SearchBar";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import UpdateCashModal from "@/components/Dashboard/Modals/EditModals/UpdateCashModal";
import Swal from "sweetalert2";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import CashPagePrint from "./CashPagePrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import CashReportModal from "@/components/Dashboard/Modals/ReportModal/CashReportModal";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

const CashPage = ({ limit, page, search }: TQuery) => {
  const [searchItem, setSearchItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const printRef = useRef<TCommonPrintRef>(null);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openCashModal, setOpenCashModal] = useState(false);
  const [cashId, setCashId] = useState<number | undefined>(undefined);
  const [filterDate, setDateFiter] = useState<{
    startDate: Date | null,
    endDate: Date | null,
  }>({
    startDate: new Date(),
    endDate: null,
  });
  const formatDate = formatDateRange({
    start: filterDate.startDate,
    end: filterDate.endDate
  })
  const {
    data: cashResponse,
    isLoading,
    isError,
  } = useGetAllCashQuery({
    page,
    limit,
    search: search || undefined,
    date: formatDate,
  });
  const [deleteCash, { isLoading: isDeleting }] =
    useDeleteCashMutation();
  const {
    data: vataInfo,
  } = useGetVataInfoQuery(undefined);


  const cashData = cashResponse?.data?.data as TCash[] || [];
  const meta = cashResponse?.data?.meta as TMetaConfig;

  // মোট INCOME
  const totalIncome = cashData
    .filter((item) => item.type === "INCOME")
    .reduce((total, item) => total + Number(item.amount), 0);

  // মোট EXPENSE
  const totalExpense = cashData
    .filter((item) => item.type === "EXPENSE")
    .reduce((total, item) => total + Number(item.amount), 0);


  // DELETE CASH

  const handleDeleteCash = async (id: number) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এই ক্যাশের হিসাবটি ডিলেট করা হবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "হ্যাঁ, ডিলেট করুন",
      cancelButtonText: "বাতিল",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteCash(id).unwrap();

      await Swal.fire({
        title: "সফল!",
        text:
          response?.message ||
          "ক্যাশের হিসাব সফলভাবে ডিলেট হয়েছে",
        icon: "success",
        confirmButtonText: "ঠিক আছে",
      });
    } catch (error: any) {
      Swal.fire({
        title: "ব্যর্থ!",
        text:
          error?.data?.message ||
          "ক্যাশ ডিলেট করতে সমস্যা হয়েছে",
        icon: "error",
        confirmButtonText: "ঠিক আছে",
      });
    }
  };


  return (
    <div className="bg-white rounded-md shadow border ">

      <div className="p-2">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          {/* New Button */}
          <div className="w-full lg:w-auto">
            <CustomNewButton
              title="নতুন হিসাব"
              className="w-full lg:w-auto text-nowrap"
              onClick={() => setIsModalOpen(true)}
            />
          </div>

          {/* Right Section */}
          <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
            {/* Total */}
            <div className="hidden items-center gap-2 lg:flex">
              <span className="text-nowrap rounded border border-green-300 px-3 py-1 text-[15px] font-medium text-green-500">
                আজকের ক্যাশঃ{" "}
                {toBanglaNumber(totalIncome.toLocaleString())} টাকা
              </span>

              <span className="text-nowrap rounded border border-orange-300 px-3 py-1 text-[15px] font-medium text-orange-500">
                ক্যাশ জেরঃ{" "}
                {toBanglaNumber(totalExpense.toLocaleString())} টাকা
              </span>
            </div>

            {/* Search + Date */}
            <div className="flex w-full items-center gap-2 lg:w-auto">
              <div className="min-w-0 flex-1 lg:w-[220px] lg:flex-none">
                <SearchBar
                  value={searchItem}
                  onChange={(e) => setSearchItem(e.target.value)}
                />
              </div>

              <div className="min-w-0 flex-1 lg:w-auto lg:flex-none">
                <CustomDateFilter
                  value={filterDate}
                  onChange={setDateFiter}
                  placeholder="তারিখ ফিল্টার করুন"
                  className="w-full lg:w-auto"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:w-auto lg:items-center">
              <CustomPrintButton
                className="w-full lg:w-auto"
                onClick={() => printRef.current?.print()}
              />

              <CustomReportButton
                className="w-full lg:w-auto"
                onClick={() => setOpenCashModal(true)}
              />
            </div>
          </div>
        </div>
      </div>



      <div >
        <div className="overflow-x-auto mt-2  ">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr className="bg-[#039A63] text-white text-center">
                <TableHead th={"#"} />
                <TableHead th={"উৎস"} />
                <TableHead th={"ক্যাশের বিবরণ"} />
                <TableHead th={"ক্যাশ ইন"} />
                <TableHead th={"ক্যাশ আউট"} />
                <TableHead th={"সময়"} />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>

            <tbody className="text-center">
              {
                isLoading ? (
                  <TableLazyLoading
                    smallColumns={7}
                    largeColumns={7}
                    rows={6}
                  />
                ) : isError ? <tr>
                  <td colSpan={7}>
                    <CustomStatus
                      type="error"
                      description={SERVER_ERROR_MESSAGE}
                    />
                  </td>
                </tr>
                  : !cashData?.length ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-gray-600">
                        <CustomStatus
                          type="empty"
                          description="কোনো ক্যাশ পাওয়া যায়নি"
                        />
                      </td>
                    </tr>
                  ) :
                    cashData?.map((row, idx) => (
                      <tr
                        key={idx + 1}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableData td={idx + 1} />

                        <TableData td={row.source} />
                        <TableData td={row.description} />
                        <TableData td={row.type === "INCOME" ? toBanglaNumber(row.amount) : "-"} />
                        <TableData td={row.type === "EXPENSE" ? row.amount : "-"} />
                        <TableData td={formatBanglaDate({ date: row.createdAt })} />


                        <td className="border p-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded hover:bg-gray-100 transition">
                                <MoreVertical className="w-4 h-4 text-gray-600 cursor-pointer" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="rounded-md border bg-white shadow-md"
                            >
                              <DropdownMenuItem onClick={() => {
                                setCashId(row?.id)
                                setOpenUpdateModal(true)
                              }}>
                                <CustomDropDownMenuItem
                                  Icon={Pencil}
                                  title="আপডেট"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem onClick={() => handleDeleteCash(row?.id)}>
                                <CustomDropDownMenuItem
                                  Icon={Trash}
                                  title="ডিলেট"
                                />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
              }
            </tbody>
          </table>
        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={cashData?.length}
          title="ক্যাশ"
        />
      </div>

      <CommonPrint
        ref={printRef}
        title="Daily_cash_report"
      >
        <CashPagePrint
          cashData={cashData}
          date={new Date()}
          vataInfo={vataInfo?.data}
        />
      </CommonPrint>

      {/* New Cash Modal */}
      {isModalOpen && (
        <NewCashModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {
        <UpdateCashModal id={cashId} setId={setCashId} isOpen={openUpdateModal} onClose={() => setOpenUpdateModal(false)} />
      }
      {
        openCashModal &&
        <CashReportModal
          isOpen={openCashModal}
          onClose={() => setOpenCashModal(false)}
          date={formatDate}
        />
      }
    </div>
  );
};

export default CashPage;