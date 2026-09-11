"use client";
import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Printer, Trash, User } from "lucide-react";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import TableHead from "@/components/Reusable/TableHead";
import NewDueCollectionModal from "@/components/Dashboard/Modals/NewDueCollectionModal";
import TableData from "@/components/Reusable/TableData";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import PrintDueCollectionModal from "@/components/Dashboard/Modals/PrintDueCollectionModal";
import UpdateDueCollection from "@/components/Dashboard/Modals/UpdateDueCollectionModal";
import ThermalDueCollectionPrintModal from "@/components/Dashboard/Modals/ThermalDueCollectionPrintModal";
import CustomButtonFixed from "@/components/Reusable/CustomButtonFixed";
import { BsPencilSquare } from "react-icons/bs";
import { useGetTodayPaidQuery } from "@/redux/features/dueCollection.features";
import moment from "moment";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TQuery } from "@/interface/query";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { IDueResponse } from "@/interface/due";
import Link from "next/link";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import CollectionDeuPrint from "@/components/PrintComponent/CollectionDeuPrint";
import NewDueCollectionModalId from "@/components/Dashboard/Modals/NewDueCollectionModalId";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";




const DueCollectionPage = ({ limit, page }: TQuery) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [isOpenThermalPrintModal, setOpenThermalPrintModal] =
    useState<boolean>(false);
  const [isOpenUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string>();
  const [deuId, setDeuId] = useState<string>();

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

  const { data, isLoading, isError } = useGetTodayPaidQuery({
    date: formatDate, limit, page
  }, {
    refetchOnMountOrArgChange: true,
  });
  const printRef = useRef<TCommonPrintRef>(null);
  // VATA INFORMATIONS
  const { data: vata } = useGetVataInfoQuery(undefined)
  const dues = data?.data?.data as IDueResponse[] || []
  const meta = data?.data?.meta as TMetaConfig;
  const totalCredit = dues?.reduce(
    (sum: number, r: IDueResponse) => sum + r?.collect,
    0,
  );
  const toggleRow = (id: string) => {
    setExpandedRow((prev) => (prev === id ? null : id));
  };


  return (
    <div className="bg-white rounded-md shadow border ">
      <div className="p-2">
        <span className="bg-green-100 text-center text-green-800 px-3 rounded text-sm border border-green-300 font-medium lg:hidden block">
          মোট জমাঃ: {totalCredit?.toLocaleString()} টাকা
        </span>
        <div className="flex flex-col gap-3 pt-2 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:pt-0">
          {/* Left Section */}
          <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start">
            <CustomNewButton
              title="নতুন বাকি জমা"
              onClick={() => setIsOpen(true)}
            />

            <span className="rounded border border-green-300 bg-green-100 px-3 py-1 text-sm font-medium text-green-800 lg:block">
              মোট জমাঃ {totalCredit?.toLocaleString()} টাকা
            </span>
          </div>

          {/* Right Section */}
          <div className="flex w-full items-center gap-2 lg:w-auto">
            <div className="min-w-0 flex-1 lg:flex-none">
              <CustomDateFilter
                value={filterDate}
                onChange={setDateFiter}
                placeholder="তারিখ ফিল্টার করুন"
                className="w-full lg:w-auto"
              />
            </div>

            <CustomPrintButton
              onClick={() => printRef.current?.print()}
              className="w-max shrink-0"
            />
          </div>
        </div>
      </div>

      <div >
        <div className="overflow-x-auto mt-2  ">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr className="bg-[#039A63] text-white text-center">
                <TableHead th="নং" cls="hidden lg:table-cell" />
                <TableHead th="নাম" />
                <TableHead th="ঠিকানা" />
                <TableHead th="বাকি ছিল" cls="hidden lg:table-cell" />
                <TableHead th="জমা" />
                <TableHead th="বাকি রইল" />
                <TableHead th="নতুন তারিখ" cls="hidden lg:table-cell" />
                <TableHead th="সিজন" cls="hidden lg:table-cell" />
                <TableHead th="বাটন" cls="" />
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <TableLazyLoading
                  smallColumns={5}
                  largeColumns={9}
                  rows={6}
                />
              ) : isError ? <tr>
                <td colSpan={9}>
                  <CustomStatus
                    type="error"
                    description={SERVER_ERROR_MESSAGE}
                  />
                </td>
              </tr>
                : !dues?.length ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-gray-600">
                      <CustomStatus
                        type="empty"
                        description="আজকের কোনো জমা পাওয়া যায়নি"
                      />
                    </td>
                  </tr>
                ) : (
                  dues?.map((row: IDueResponse) => (
                    <React.Fragment key={row?.id}>
                      <tr
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => toggleRow(row?.customer.customerCode)}
                      >
                        <TableData td={row?.customer.customerCode} cls="hidden lg:table-cell" />
                        <TableData td={row.customer?.name} />
                        <TableData td={row.customer?.address} />
                        <TableData
                          td={row?.due}
                          cls="hidden lg:table-cell bg-yellow-100"
                        />
                        <TableData td={row?.collect} cls="bg-green-100" />
                        <TableData td={row?.newDue} cls=" bg-red-100" />
                        <TableData
                          td={
                            row?.nextDate
                              ? moment(row?.nextDate).format("DD-MM-YYYY")
                              : "পরিশোধিত"
                          }
                          cls="hidden lg:table-cell"
                        />
                        <TableData td={row?.season?.name} cls="hidden lg:table-cell" />

                        <td className="border p-2 ">
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
                              <DropdownMenuItem
                                onClick={() => {
                                  setDeuId(row?.id);
                                  setOpenUpdateModal(true);
                                }}
                              >
                                <CustomDropDownMenuItem
                                  Icon={Pencil}
                                  title="আপডেট জমা"
                                />
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() => {
                                  setOpenPrintModal(true),
                                    setDeuId(row?.id);
                                }}
                              >
                                <CustomDropDownMenuItem
                                  Icon={Printer}
                                  title="প্রিন্ট করুন"
                                />
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  href={`/dashboard/customer/profile/${row.customer.customerCode}`}
                                >
                                  <CustomDropDownMenuItem
                                    Icon={User}
                                    title="প্রোফাইলে যান"
                                  />
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <CustomDropDownMenuItem
                                  Icon={Trash}
                                  title="ডিলেট"
                                />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>

                      {expandedRow === String(row?.id) && (
                        <tr className="lg:hidden">
                          <td
                            colSpan={100}
                            className="border bg-gray-50 text-left p-3 "
                          >
                            <div className="grid grid-cols-2 ">
                              <div className="grid grid-cols-2 gap-1 text-sm text-gray-500">
                                <p className="font-semibold text-xs">কা.আইডি</p>
                                <p> {row?.customerId}</p>
                                <p className="font-semibold text-xs">নাম </p>
                                <p>{row?.customer?.name}</p>
                                <p className="font-semibold text-xs">ঠিকানা</p>
                                <p> {row?.customer?.address}</p>
                                <p className="font-semibold text-xs">ফোন</p>
                                <p> {row?.customer?.phoneNumber}</p>
                                <p className="font-semibold text-xs">জমা তারিখ</p>
                                <p>{moment(row?.createdAt).format("DD-MM-YYYY")}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-1 text-sm ">
                                <p className="font-semibold text-xs">মোট বাকি</p>
                                <p> {row?.due}</p>
                                <p className="font-semibold text-xs text-green-600">
                                  জমা{" "}
                                </p>
                                <p className="text-green-600">{row?.collect}</p>
                                <p className="font-semibold text-xs text-orange-600">
                                  বাকি রইল
                                </p>
                                <p className="text-orange-600">{row?.newDue}</p>
                                <p className="font-semibold text-xs text-gray-500">
                                  নতুন তারিখ
                                </p>
                                <p className="text-gray-500">
                                  {moment(row?.nextDate).format("DD-MM-YYYY")}
                                </p>
                                <p className="font-semibold text-xs text-gray-500">
                                  সিজন
                                </p>
                                <p className="text-gray-500">{row?.season?.name}</p>
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-between pt-3">
                              <button onClick={() => setOpenUpdateModal(true)}>
                                <CustomButtonFixed
                                  title="এডিট"
                                  cls="bg-green-200 text-green-700 px-2"
                                  Icon={BsPencilSquare}
                                />
                              </button>
                              <button
                                onClick={() => setOpenThermalPrintModal(true)}
                              >
                                <CustomButtonFixed
                                  title="প্রিন্ট"
                                  cls="bg-green-200 text-green-700 px-2"
                                  Icon={Printer}
                                />
                              </button>
                              <button>
                                <CustomButtonFixed
                                  title="প্রোফাইল"
                                  cls="bg-orange-200 text-orange-700 px-2"
                                  Icon={User}
                                />
                              </button>
                              <button>
                                <CustomButtonFixed
                                  title=""
                                  cls="bg-red-200 text-red-700 px-1"
                                  Icon={Trash}
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                )}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={dues?.length}
          title="বাকি"
        />
      </div>

      {isOpen && (
        <NewDueCollectionModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
        />
      )}

      {isOpenPrintModal && (
        <PrintDueCollectionModal
          isOpen={isOpenPrintModal}
          onClose={() => setOpenPrintModal(false)}
          id={deuId}
          setDueId={setDeuId}
        />
      )}

      {isOpenUpdateModal && (
        <UpdateDueCollection
          isOpen={isOpenUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          id={deuId!}
        />
      )}

      {isOpenThermalPrintModal && (
        <ThermalDueCollectionPrintModal
          isOpen={isOpenThermalPrintModal}
          onClose={() => setOpenThermalPrintModal(false)}
        />
      )}

      <CommonPrint
        ref={printRef}
        title="dues"
      >
        <CollectionDeuPrint
          dues={dues}
          vataInformation={vata?.data}
        />
      </CommonPrint>
    </div>
  );
};

export default DueCollectionPage;
