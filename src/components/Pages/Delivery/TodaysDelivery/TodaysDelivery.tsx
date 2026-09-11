"use client";

import { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Truck, User } from "lucide-react";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import TableHead from "@/components/Reusable/TableHead";
import { useGetTodaysDeliveryQuery } from "@/redux/features/delivery.features";
import moment from "moment";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import DeliveryReportModal, {
  TItems,
} from "@/components/Dashboard/Modals/ReportModal/DeliveryReportModal";
import { groupAndSumByClass } from "@/utils/getDeliveryReportData";
import DeliveryPrintModal from "@/components/Dashboard/PrintModal/DeliveryPrint/DeliveryPrintModal";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { TQuery } from "@/interface/query";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import DeliveryDetailsModal from "@/components/Dashboard/Modals/DeliveryDetailsModal";
import { TDeliveryResponse } from "@/interface/delivery";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import NewDeliveryModalForInput from "@/components/Dashboard/Modals/NewDeliveryModalForInput";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import Link from "next/link";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import DeliveryPrint from "@/components/PrintComponent/DeliveryPrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";
const TodaysDeliveryPage = ({ limit, page, }: TQuery) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDeliveryReport, setOpenDeliveryReport] = useState<boolean>(false);
  const [openDeliveryDetailsModal, setOpenDeliveryDetailsModal] = useState<boolean>(false);
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [deliveryId, setDeliveryId] = useState<number | undefined>();
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

  const { data, isFetching, isError } = useGetTodaysDeliveryQuery({
    date: formatDate, limit, page
  }, {
    refetchOnMountOrArgChange: true,
  });

  const printRef = useRef<TCommonPrintRef>(null);
  // VATA INFORMATIONS
  const { data: vata } = useGetVataInfoQuery(undefined)
  const deliveries = data?.data?.data || [];
  const meta = data?.data?.meta as TMetaConfig;
  const items = deliveries?.map((delivery: TDeliveryResponse) => {
    return {
      class: delivery?.class,
      delivered: delivery?.deliveryReceived,
    };
  });


  console.log(deliveries)

  const result: TItems[] = groupAndSumByClass(items);
  return (
    <div className="bg-white rounded-md shadow border">
      <div className="flex justify-between items-center p-2  gap-5">
        <CustomNewButton title="নতুন ডেলিভারি" onClick={() => setIsOpen(!isOpen)} />
        <div className="flex items-center gap-2 ">
          <div className="flex-1">
            <CustomDateFilter
              value={filterDate}
              onChange={setDateFiter}
              placeholder="তারিখ ফিল্টার করুন"
              className=""
            />
          </div>
          <CustomPrintButton
            onClick={() => printRef.current?.print()}
          />
          <CustomReportButton onClick={() => setOpenDeliveryReport(true)} />
        </div>
      </div>


      <div>
        <div className="overflow-x-auto pt-3">
          <table className="min-w-full   text-center border-t">
            <thead className="bg-[#039A63] text-white">
              <tr>

                <TableHead th={"চালান নং"} />
                <TableHead th={"কাস্টমার"} />
                <TableHead th={"ঠিকানা"} cls="hidden lg:table-cell" />
                <TableHead th={"শ্রেণি"} />
                <TableHead th={"ক্রয়"} cls="hidden lg:table-cell" />
                <TableHead th={"পূর্ববর্তী ডে."} cls="hidden lg:table-cell" />
                <TableHead th={"ডেলিভারি"} />
                <TableHead th={"ডে.বাকি"} cls="hidden lg:table-cell" />
                <TableHead th={"ড্রাইভার"} cls="hidden lg:table-cell" />
                <TableHead th={"মোট ডেলিভারি"} />
                <TableHead th={"তারিখ ও সময়"} cls="hidden lg:table-cell" />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <TableLazyLoading
                  smallColumns={6}
                  largeColumns={12}
                  rows={6}
                />
              ) : isError ? <tr>
                <td colSpan={12}>
                  <CustomStatus
                    type="error"
                    description={SERVER_ERROR_MESSAGE}
                  />
                </td>
              </tr>
                : !deliveries?.length ? (
                  <tr>
                    <td colSpan={12} className="py-8 text-gray-600">
                      <CustomStatus
                        type="empty"
                        description="আজকের কোনো ডেলিভারি পাওয়া যায়নি"
                      />
                    </td>
                  </tr>
                ) : (
                  deliveries?.map((row: TDeliveryResponse) => (
                    <tr key={row.id} className="hover:bg-gray-50">

                      <TableData td={row?.invoice.serial} />
                      <TableData td={row?.invoice?.customer?.name} />
                      <TableData
                        td={row?.invoice?.customer?.address}
                        cls="hidden lg:table-cell"
                      />
                      <TableData td={row?.class} />
                      <TableData td={toBanglaNumber(row?.quantity)} cls="hidden lg:table-cell" />
                      <TableData td={toBanglaNumber(row?.lastDelivered ?? 0)} cls="hidden lg:table-cell" />
                      <TableData td={toBanglaNumber(row?.deliveryReceived)} />
                      <TableData
                        td={toBanglaNumber(row?.deliveryRemaining)}
                        cls="hidden lg:table-cell"
                      />
                      <TableData td={row?.driver?.name || "-"} cls="hidden lg:table-cell" />
                      <TableData td={toBanglaNumber(row?.deliveryReceived)} />
                      <TableData
                        cls="hidden lg:table-cell"
                        td={`${moment(row?.deliveryDate).format(
                          "DD-MM-YYYY"
                        )} `}
                      />

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
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenPrintModal(true);
                                setDeliveryId(row?.id);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={Calendar}
                                title="প্রিন্ট ডেলিভারি"
                              />
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={() => {
                              setOpenDeliveryDetailsModal(true),
                                setDeliveryId(row?.id);
                            }}>
                              <CustomDropDownMenuItem
                                Icon={Truck}
                                title="ডেলিভারি বিস্তারিত"
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Link href={`/dashboard/customer/profile/${row.invoice.customer.customerCode}`}><CustomDropDownMenuItem
                                Icon={User}
                                title="প্রোফাইলে যান"
                              /></Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <CustomDropDownMenuItem
                                Icon={User}
                                title="ডিলিট করুন"
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
            </tbody>
          </table>


        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={deliveries?.length}
          title="ডেলিভারি"
        />
      </div>

      {isOpen && (
        <NewDeliveryModalForInput isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      {openDeliveryReport && (
        <DeliveryReportModal
          isOpen={openDeliveryReport}
          items={result}
          onClose={() => setOpenDeliveryReport(false)}
          title="আজকের ডেলিভারি রিপোর্ট"
        />
      )}

      {openPrintModal && (
        <DeliveryPrintModal
          isOpen={openPrintModal}
          onClose={() => setOpenPrintModal(false)}
          deliveryId={deliveryId}
          setDeliveryId={setDeliveryId}
        />
      )}

      {openDeliveryDetailsModal &&
        <DeliveryDetailsModal
          isOpen={openDeliveryDetailsModal}
          onClose={() => setOpenDeliveryDetailsModal(false)}
          deliveryId={deliveryId}
          setDeliveryId={setDeliveryId} />
      }

      <CommonPrint
        ref={printRef}
        title="deliveries"
      >
        <DeliveryPrint
          deliveries={deliveries}
          vataInformation={vata?.data}
        />
      </CommonPrint>

    </div>
  );
};

export default TodaysDeliveryPage;
