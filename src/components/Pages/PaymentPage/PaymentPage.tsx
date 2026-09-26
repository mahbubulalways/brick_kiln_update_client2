"use client";

import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Printer, Trash } from "lucide-react";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import NewPaymentModal from "@/components/Dashboard/Modals/NewPaymentModal";
import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import { GrDocument } from "react-icons/gr";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { TQuery } from "@/interface/query";
import { useDeletePaymentMutation, useGetPaymentQuery } from "@/redux/features/payment.features";
import { TPaymentResponse } from "@/interface/payment";
import { SERVER_ERROR_MESSAGE, } from "@/constant";
import CustomStatus from "@/components/Reusable/CustomStatus";
import moment from "moment";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import { IoDocumentTextOutline } from "react-icons/io5";
import Link from "next/link";
import SearchBar from "@/components/Reusable/SearchBar";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import PaymentReportModal from "@/components/Dashboard/Modals/PaymentReportModal";
import UpdatePaymentModal from "@/components/Dashboard/Modals/EditModals/UpdatePaymentModal";
import Swal from "sweetalert2";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import PaymentPrint from "@/components/PrintComponent/PaymentPrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
import LedgerPrintModal from "@/components/Dashboard/PrintModal/LedgerPrint/LedgerPrintModal";

const PaymentPage = ({ limit, page, search }: TQuery) => {
  const [searchItems, setSearchItem] = useState("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
  const [openLedgerPrint, setOpeLedgerPrint] = useState<boolean>(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
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
  const { data, isError, isLoading, isFetching } = useGetPaymentQuery(
    {
      limit,
      page,
      search,
      date: formatDate
    },
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const printRef = useRef<TCommonPrintRef>(null);
  const [deletePaymentAsync, { isLoading: deleteLoading }] = useDeletePaymentMutation()
  // VATA INFORMATIONS
  const { data: vata } = useGetVataInfoQuery(undefined)
  const payments = data?.data?.data as TPaymentResponse[];
  const meta = data?.data?.meta as TMetaConfig;

  const totalCredit = payments?.reduce(
    (sum, r: TPaymentResponse) => sum + r.payment,
    0,
  );
  const toggleRow = (id: number) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };



  // DELETE FUNCTION
  const handleDeletePayment = async (id: number) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার মুছে ফেলা হলে এটি আর ফিরিয়ে আনা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#039A63",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল করুন",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await deletePaymentAsync(String(id)).unwrap();
          if (result?.success) {
            Swal.fire({
              title: "মুছে ফেলা হয়েছে!",
              text: result?.message || "পেমেন্ট সফলভাবে মুছে ফেলা হয়েছে।",
              icon: "success",
              confirmButtonText: "ঠিক আছে",
            });
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          Swal.fire({
            title: "মুছে ফেলা হয়েছে!",
            text:
              error?.data?.message ||
              SERVER_ERROR_MESSAGE,
            icon: "error",
            confirmButtonText: "ঠিক আছে",
          });
        }
      }
    });
  }


  return (
    <div className="bg-white rounded-md shadow border ">
      <div className="p-2">
        <span className="bg-green-100 text-center text-green-800 px-3 py-1 rounded   border border-green-300 font-medium lg:hidden block">
          মোট পেমেন্ট: {totalCredit} টাকা
        </span>
        <div className="flex w-full flex-col gap-2 pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:pt-0">

          <div className="flex w-full items-center gap-2 lg:w-auto">
            <CustomNewButton
              title="নতুন পেমেন্ট"
              onClick={() => setIsModalOpen(true)}
              className="flex-1 lg:flex-none"
            />


            <span className="hidden whitespace-nowrap rounded border border-green-300 bg-green-100 px-3 py-1 font-medium text-green-800 lg:block">
              মোট পেমেন্ট: {totalCredit} টাকা
            </span>
          </div>

          <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-full sm:items-center sm:justify-end">
            {/* Date Filter */}
            <div className="min-w-0 sm:w-auto">
              <CustomDateFilter
                value={filterDate}
                onChange={setDateFiter}
                placeholder="তারিখ ফিল্টার করুন"
                className="w-full sm:w-auto"
              />
            </div>

            {/* Search */}
            <div className="col-span-2 min-w-0 sm:min-w-0 sm:flex-1 lg:flex-none">
              <SearchBar
                value={searchItems}
                onChange={(e) => setSearchItem(e.target.value)}
                onClear={() => setSearchItem("")}
              />
            </div>

            {/* Print */}
            <div className="min-w-0">
              <CustomPrintButton
                onClick={() => printRef.current?.print()}
              />
            </div>

            {/* Report */}
            <div className="min-w-0">
              <CustomReportButton
                onClick={() => setReportModalOpen(true)}
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
                <TableHead th="#" cls="hidden lg:table-cell" />
                <TableHead th="খতিয়ান" cls="hidden lg:table-cell" />
                <TableHead th="ঠিকানা" cls="hidden lg:table-cell" />
                <TableHead th="পেমেন্টের বিবরণ" />
                <TableHead th="পরিমাণ" />
                <TableHead th="মোট বিল" cls="hidden lg:table-cell" />
                <TableHead th="অগ্রিম" cls="hidden lg:table-cell" />
                <TableHead th="কর্তন" cls="hidden lg:table-cell" />
                <TableHead th="পেমেন্ট" />
                <TableHead th="কম/বেশি" cls="hidden lg:table-cell" />
                <TableHead th="ডক" cls="hidden lg:table-cell" />
                <TableHead th="বাটন" />
              </tr>
            </thead>
            <tbody>

              {isLoading || isFetching ? (
                <TableLazyLoading
                  smallColumns={4}
                  largeColumns={11}
                  rows={10}
                />
              ) : isError ? (
                <tr>
                  <td colSpan={11}>
                    <CustomStatus
                      type="error"
                      description={SERVER_ERROR_MESSAGE}
                    />
                  </td>
                </tr>
              ) : !payments?.length ? (
                <tr>
                  <td colSpan={11}>
                    <CustomStatus
                      type="empty"
                      description="কোনো পেমেন্ট পাওয়া যায়নি"
                    />
                  </td>
                </tr>
              ) : (payments?.map((row, index) => (
                <React.Fragment key={row.id}>
                  <tr
                    className="hover:bg-gray-50"
                    onClick={() => toggleRow(row.id)}
                  >
                    <TableData td={index + 1} cls="hidden lg:table-cell" />
                    <TableData
                      td={row?.ledger?.name}
                      cls="hidden lg:table-cell"
                    />
                    <TableData
                      td={row?.address || "-"}
                      cls="hidden lg:table-cell"
                    />
                    <TableData
                      td={row?.paymentDetails as string}
                      cls="hidden lg:table-cell"
                    />
                    <TableData
                      td={
                        (row?.paymentDetails?.substring(0, 20) +
                          "...") as string
                      }
                      cls="lg:hidden table-cell"
                    />
                    <TableData td={row?.quantity} />
                    <TableData
                      td={`৳ ${row?.totalBill}`}
                      cls="hidden lg:table-cell"
                    />
                    <TableData
                      td={
                        row?.paymentType === "অগ্রিম পেমেন্ট"
                          ? `৳ ${row?.payment}`
                          : "৳ 0"
                      }
                      cls="border p-2 text-red-500 hidden lg:table-cell"
                    />
                    <TableData
                      cls="border p-2 text-green-600 hidden lg:table-cell"
                      td={`৳ ${row?.cutting}`}
                    />
                    <TableData
                      cls="border p-2 text-green-600"
                      td={`৳ ${row?.payment}`}
                    />
                    <TableData
                      cls={`border hidden lg:table-cell p-2 ${row?.paymentDifference < 0
                        ? "text-red-500"
                        : row?.paymentDifference > 0
                          ? "text-green-600"
                          : "text-gray-600 "
                        }`}
                      td={`৳ ${row?.paymentDifference}`}
                    />

                    <td className="border p-2 text-center align-middle">
                      {row?.document ? (
                        <Link
                          href={`${process.env.NEXT_PUBLIC_BACKEND_API}/uploads/${row?.document}`}
                          target="_blank"
                          className="inline-flex items-center justify-center text-green-600 hover:text-green-700"
                        >
                          <IoDocumentTextOutline size={18} />
                        </Link>
                      ) : (
                        "-"
                      )}
                    </td>

                    <td className="border p-2 text-center">
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
                            setIsUpdateModalOpen(true);
                            setSelectedPaymentId(row?.id);
                          }}>
                            <CustomDropDownMenuItem
                              Icon={Pencil}
                              title="আপডেট"
                            />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setOpeLedgerPrint(true);
                              setSelectedPaymentId(row?.id);
                            }}
                          >
                            <CustomDropDownMenuItem
                              Icon={Printer}
                              title="প্রিন্ট খতিয়ান"
                            />
                          </DropdownMenuItem>

                          <DropdownMenuItem
                          >
                            <Link href={`/dashboard/ledger/details/${row?.ledger?.id}`}>
                              <CustomDropDownMenuItem
                                Icon={GrDocument}
                                title="খতিয়ান"
                              />
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={deleteLoading}
                            onClick={() => handleDeletePayment(row?.id)}
                          >
                            <CustomDropDownMenuItem
                              Icon={Trash}
                              title="ডিলেট"
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                  {expandedRow === row?.id && (
                    <tr className="lg:hidden">
                      <td
                        colSpan={100}
                        className="border bg-gray-50 text-left p-3 "
                      >
                        <div className="grid grid-cols-2 ">
                          <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
                            <p className="font-semibold">নং</p>
                            <p> {row?.id}</p>
                            <p className="font-semibold">খতিয়ান </p>
                            <p>{row?.ledger.name}</p>
                            <p className="font-semibold">পে.ধরন </p>
                            <p> {row?.paymentType}</p>
                            <p className="font-semibold">তারিখ</p>
                            <p> {moment(row?.createdAt).format("l")}</p>
                            <p className="font-semibold">সময়</p>
                            <p>{row?.paymentDetails}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-1 text-sm ">
                            <p className="font-semibold">পরিমাণ</p>
                            <p> {row?.quantity}</p>
                            <p className="font-semibold text-green-600">
                              মোট বিল
                            </p>
                            <p className="text-green-600">{row?.totalBill}</p>
                            <p className="font-semibold text-orange-600">
                              কর্তন
                            </p>
                            <p className="text-orange-600">{row?.cutting}</p>
                            <p className="font-semibold text-gray-500">
                              পেমেন্ট
                            </p>
                            <p className="text-gray-500">{row?.payment}</p>
                            <p className="font-semibold text-gray-500">
                              বেশি পেমেন্ট
                            </p>
                            <p className="text-gray-500">
                              {row?.paymentDifference}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )))}

            </tbody>
          </table>
        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={payments?.length}
          title="পেমেন্ট"
        />
      </div>
      {isModalOpen && (
        <NewPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isReportModalOpen && (
        <PaymentReportModal
          isOpen={isReportModalOpen}
          onClose={() => setReportModalOpen(false)}
        />
      )}

      {isUpdateModalOpen &&
        <UpdatePaymentModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          id={selectedPaymentId}
          setId={setSelectedPaymentId} />
      }


      <CommonPrint
        ref={printRef}
        title="payments"
      >
        <PaymentPrint
          payments={payments}
          vataInformation={vata?.data}
        />
      </CommonPrint>
      {

      }{
        openLedgerPrint &&
        <LedgerPrintModal
          ledgerId={String(selectedPaymentId)}
          isOpen={openLedgerPrint}
          onClose={() => setOpeLedgerPrint(false)} />
      }

    </div>
  );
};

export default PaymentPage;
