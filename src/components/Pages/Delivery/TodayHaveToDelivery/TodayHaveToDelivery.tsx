"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar, MoreVertical, Truck, User } from "lucide-react";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import TableHead from "@/components/Reusable/TableHead";
import NewDeliveryModal from "@/components/Dashboard/Modals/NewDeliveryModal";
import TableData from "@/components/Reusable/TableData";
import { useGetDeliveryHaveTodayQuery } from "@/redux/features/delivery.features";
import { IChallanItem, TTodaySDelivery } from "@/types/types";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import UpdateDeliveryDateModal from "@/components/Dashboard/Modals/EditModals/UpdateDeliveryDateModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import DeliveryReportModal from "@/components/Dashboard/Modals/ReportModal/DeliveryReportModal";
import { remainingAllDelivery } from "@/utils/getDeliveryReportData";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { TQuery } from "@/interface/query";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import SearchBar from "@/components/Reusable/SearchBar";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import Link from "next/link";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

const TodaysHaveToDelivery = ({ limit, page, search }: TQuery) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openDateChangeModal, setIsOpenDateChangeModal] =
    useState<boolean>(false);
  const [searchItem, setSearchItem] = useState<string>("");
  const [InvoiceId, setInvoiceId] = useState<number>();
  const [InvoiceIdDelivery, setInvoiceIDelivery] = useState<number>();
  const [itemIds, setItemIds] = useState<string[]>([]);
  const [filterDate, setDateFiter] = useState<{
    startDate: Date | null,
    endDate: Date | null,
  }>({
    startDate: new Date(),
    endDate: null,
  });

  const [openDeliveryReport, setOpenDeliveryReport] = useState<boolean>(false);
  const formatDate = formatDateRange({
    start: filterDate.startDate,
    end: filterDate.endDate
  })
  const { data, isLoading, isError } = useGetDeliveryHaveTodayQuery({
    date: formatDate, limit, page, search
  }, {
    refetchOnMountOrArgChange: true,
  });
  const todaysDelivery = data?.data?.data || [];
  const meta = data?.data?.meta as TMetaConfig;
  const reportItems = remainingAllDelivery(todaysDelivery || []);
  return (
    <div className="bg-white rounded-md shadow border ">

      <div className="flex justify-between items-center p-2  gap-5">
        <SearchBar
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
          onClear={() => setSearchItem("")}
        />

        <div className="flex items-center gap-2 ">
          <CustomDateFilter
            value={filterDate}
            onChange={setDateFiter}
            placeholder="তারিখ ফিল্টার করুন"
            className=""
          />

          <CustomReportButton onClick={() => setOpenDeliveryReport(true)} />
        </div>
      </div>

      <div >
        <div className="overflow-x-auto mt-2  ">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr className="bg-[#039A63] text-white text-center">
                <TableHead th={"চালান নং"} />
                <TableHead th={"কাস্টমার"} />
                <TableHead th={"ঠিকানা"} cls="hidden lg:table-cell" />
                <TableHead th={"শ্রেণি"} />
                <TableHead th={"ক্রয়"} cls="hidden lg:table-cell" />
                <TableHead th={"ডেলিভারি"} cls="hidden lg:table-cell" />
                <TableHead th={"ডে.বাকি"} />
                <TableHead th={"মোট বাকি"} cls="hidden lg:table-cell" />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <TableLazyLoading
                  smallColumns={6}
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
                : !todaysDelivery?.length ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-gray-600">
                      <CustomStatus
                        type="empty"
                        description="আজকের কোনো ডেলিভারি পাওয়া যায়নি"
                      />
                    </td>
                  </tr>
                ) : (
                  <>
                    {todaysDelivery?.map((row: TTodaySDelivery) => {
                      const totalBaki = row.items.reduce(
                        (acc, item) => acc + (item.quantity - item.delivered),
                        0
                      );

                      return row.items.map((item: IChallanItem, index: number) => (
                        <tr
                          key={`${row.id}-${item.id}`}
                          className="hover:bg-gray-50"
                        >
                          {/* Top-level delivery info */}
                          {index === 0 && (
                            <>
                              <TableData td={row.serial} rowSpan={row.items.length} />
                              <TableData
                                td={row.customer?.name}
                                rowSpan={row.items.length}
                              />
                              <TableData
                                td={row.customer?.address}
                                rowSpan={row.items.length}
                                cls="hidden lg:table-cell"
                              />
                            </>
                          )}

                          {/* Item info */}
                          <TableData td={item.class} />
                          <TableData
                            td={toBanglaNumber(item.quantity)}
                            cls="hidden lg:table-cell"
                          />
                          <TableData
                            td={toBanglaNumber(item.delivered)}
                            cls="hidden lg:table-cell"
                          />
                          {/* Daily baki */}
                          <TableData td={toBanglaNumber(item.quantity - item.delivered)} />

                          {/* Total baki — only on first item row */}
                          {index === 0 && (
                            <TableData
                              td={toBanglaNumber(totalBaki)}
                              rowSpan={row.items.length}
                              cls="hidden lg:table-cell"
                            />
                          )}

                          {/* Actions column only once */}
                          {index === 0 && (
                            <td className="border p-2" rowSpan={row.items.length}>
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
                                      setIsOpenDateChangeModal(true);
                                      setInvoiceId(row?.serial);
                                      setItemIds(row.items.map((itm) => itm.id));
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Calendar}
                                      title="তারিখ পরিবর্তন"
                                    />
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsOpen(true);
                                      setInvoiceIDelivery(row?.serial);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Truck}
                                      title="ডেলিভারি দিন"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Link href={`/dashboard/customer/profile/${row.customer.customerCode}`}>
                                      <CustomDropDownMenuItem
                                        Icon={User}
                                        title="প্রোফাইলে যান"
                                      />
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          )}
                        </tr>
                      ));
                    })}
                  </>
                )}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={todaysDelivery?.length}
          title="ডেলিভারি"
        />
      </div>

      {isOpen && (
        <NewDeliveryModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          invoiceId={InvoiceIdDelivery!}
        />
      )}

      {openDateChangeModal && (
        <UpdateDeliveryDateModal
          isOpen={openDateChangeModal}
          onClose={() => setIsOpenDateChangeModal(false)}
          id={InvoiceId!}
          itemIds={itemIds}
          setItemIds={setItemIds}
        />
      )}

      {openDeliveryReport && (
        <DeliveryReportModal
          isOpen={openDeliveryReport}
          items={reportItems}
          onClose={() => setOpenDeliveryReport(false)}
          title="ডেলিভারি দিতে হবে"
        />
      )}
    </div>
  );
};

export default TodaysHaveToDelivery;
