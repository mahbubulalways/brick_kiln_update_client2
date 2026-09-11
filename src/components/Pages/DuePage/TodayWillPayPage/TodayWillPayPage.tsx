"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MessageSquare, MoreVertical, Pencil, Trash2, User, Wallet2Icon } from "lucide-react";
import NewPaymentModal from "@/components/Dashboard/Modals/NewPaymentModal";
import TableHead from "@/components/Reusable/TableHead";
import CustomButtonFixed from "@/components/Reusable/CustomButtonFixed";
import TableData from "@/components/Reusable/TableData";
import { useGetTodayHaveDueQuery } from "@/redux/features/dueCollection.features";
import { IChallanForDataShow, ICustomer } from "@/types/types";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TQuery } from "@/interface/query";
import SearchBar from "@/components/Reusable/SearchBar";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import { TMetaConfig } from "@/interface/meta";
import { TablePagination } from "@/components/Reusable/TablePagination";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import UpdateDueCollectionDateModal from "@/components/Dashboard/Modals/EditModals/UpdateDueCollectionDateModal";
import NewDueCollectionModalId from "@/components/Dashboard/Modals/NewDueCollectionModalId";
import Link from "next/link";
import TodayWillPayPrintModal from "@/components/Dashboard/PrintModal/TodayWillPayPrint/TodayWillPayPrintModal";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

type PaymentRow = {
  challans: IChallanForDataShow[];
  remainingDue: number
} & ICustomer;

const TodayWillPayPage = ({ limit, page, search }: TQuery) => {
  const [searchItem, setSearchItem] = useState("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string | undefined>(undefined)
  const [openDueModal, setOpenDueModal] = useState<boolean>(false);
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [openDueCollectionModal, setOpenDueCollectionModal] = useState<boolean>(false);
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
  const { data, isLoading, isError, } = useGetTodayHaveDueQuery({
    date: formatDate, limit, page, search
  }, {
    refetchOnMountOrArgChange: true,
  });



  const dues = data?.data?.data as PaymentRow[]
  const meta = data?.data?.meta as TMetaConfig;
  const totalCredit =
    dues?.reduce(
      (sum: number, r: PaymentRow) =>
        sum +

        Number(r?.remainingDue || 0),
      0
    ) || 0;

  return (
    <div className="bg-white rounded-md shadow border ">
      <div className="flex justify-between items-center p-2 gap-5">
        <div className="flex items-center gap-2 w-auto lg:w-full">
          <span className=" text-orange-500 px-3 py-1 rounded   border border-orange-300 font-medium hidden lg:block">
            মোট জমা দেবেঃ {toBanglaNumber(totalCredit)} টাকা
          </span>
        </div>

        <div className="flex items-center lg:justify-end gap-2 w-full">
          <SearchBar
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            onClear={() => setSearchItem("")}
          />
          <CustomDateFilter
            value={filterDate}
            onChange={setDateFiter}
            placeholder="তারিখ ফিল্টার করুন"
            className=""
          />
          <button onClick={() => setOpenPrintModal(true)}>
            <CustomButtonFixed title="প্রিন্ট করুন" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div >
        <div className="overflow-x-auto mt-2  ">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr className="bg-[#039A63] text-white text-center">
                <TableHead th={"কা.আইডি"} />
                <TableHead th={"নাম"} />
                <TableHead th={"ঠিকানা"} />
                <TableHead th={"ডেলিভারি বাকি"} />
                <TableHead th={"টাকা বাকি"} />
                <TableHead th={"ফোন নম্বর	"} />
                <TableHead th={"নোট"} />
                <TableHead th={"সিজন"} />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableLazyLoading
                  smallColumns={9}
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
                  dues?.map((row: PaymentRow) => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      <TableData td={row?.customerCode} />
                      <TableData td={row?.name} />
                      <TableData td={row?.address} />
                      <TableData
                        td={toBanglaNumber(row?.challans?.reduce((accChallan, challan) => {
                          const itemsSum =
                            challan.items?.reduce(
                              (accItem, curr) =>
                                accItem +
                                ((curr.quantity ?? 0) - (curr.delivered ?? 0)),
                              0,
                            ) ?? 0;
                          return accChallan + itemsSum;
                        }, 0))}
                      />

                      <TableData td={toBanglaNumber(row?.remainingDue)} />
                      <TableData td={toBanglaNumber(row?.phoneNumber)} />
                      <TableData td={row?.challans[0]?.note || "-"} />

                      <TableData td={row?.challans[0]?.season.name} />

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
                              setCustomerId(row?.customerCode)
                              setOpenDueModal(true)
                            }}>
                              <CustomDropDownMenuItem
                                Icon={Pencil}
                                title="তারিখ আপডেট করুন"
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              setCustomerId(row?.customerCode)
                              setOpenDueCollectionModal(true)
                            }}>
                              <CustomDropDownMenuItem
                                Icon={Wallet2Icon}
                                title="জমা করুন"
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem

                            >
                              <CustomDropDownMenuItem
                                Icon={MessageSquare}
                                title="মেসেজ করুন"
                              />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                            >
                              <Link href={`/dashboard/customer/profile/${row.customerCode}`}>
                                <CustomDropDownMenuItem
                                  Icon={User}
                                  title="প্রোফাইলে যান"
                                /></Link>
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
          dataLength={dues?.length}
          title="বাকি"
        />
      </div>

      {isOpen && (
        <NewPaymentModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      {
        <UpdateDueCollectionDateModal
          id={customerId}
          isOpen={openDueModal}
          onClose={() => setOpenDueModal(false)}
          setId={setCustomerId} />
      }
      {openDueCollectionModal &&
        <NewDueCollectionModalId
          id={customerId}
          isOpen={openDueCollectionModal}
          onClose={() => setOpenDueCollectionModal(false)}
        />
      }

      {openPrintModal &&
        <TodayWillPayPrintModal
          isOpen={openPrintModal}
          onClose={() => setOpenPrintModal(false)}
          dues={dues}
        />
      }
    </div>
  );
};

export default TodayWillPayPage;
