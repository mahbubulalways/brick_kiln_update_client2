"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MessageSquare, MoreVertical, Pencil, User, Wallet2Icon } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import TableHead from "@/components/Reusable/TableHead";
import CustomButtonFixed from "@/components/Reusable/CustomButtonFixed";
import TableData from "@/components/Reusable/TableData";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import { useGetAllDueListQuery } from "@/redux/features/dueCollection.features";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TQuery } from "@/interface/query";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { TMetaConfig } from "@/interface/meta";
import CustomDateRangePicker from "@/components/Reusable/CustomDateRangePicker";
import SearchBar from "@/components/Reusable/SearchBar";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import UpdateDueCollectionDateModal from "@/components/Dashboard/Modals/EditModals/UpdateDueCollectionDateModal";
import NewDueCollectionModalId from "@/components/Dashboard/Modals/NewDueCollectionModalId";
import Link from "next/link";
import TodayWillPayPrintModal from "@/components/Dashboard/PrintModal/TodayWillPayPrint/TodayWillPayPrintModal";
import AllDuePrintModal from "@/components/Dashboard/PrintModal/TodayWillPayPrint/AllDuePrintModal";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { formatDateRange } from "@/utils/formatDateRange";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomStatus from "@/components/Reusable/CustomStatus";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

export interface IGetAllDueList {
  id: string;
  customerCode: string;
  name: string;
  address: string;
  phoneNumber: string;
  totalDue: number;
  totalCollect: number;
  remainingDue: number;
  due: number;
  collect: number;
  newDue: number;
  nextDate: string | null;
  remainingDelivery: number;
  totalQuantity: number;
  totalDelivered: number;
  season: string;
  note: string;
}

const AllDueListPage = ({ limit, page, search }: TQuery) => {
  const [searchItem, setSearchItem] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [customerId, setCustomerId] = useState<string | undefined>(undefined)
  const [openDueModal, setOpenDueModal] = useState<boolean>(false);
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  const [openDueCollectionModal, setOpenDueCollectionModal] = useState<boolean>(false);
  const [filterDate, setDateFiter] = useState<{
    startDate: Date | null,
    endDate: Date | null,
  }>({
    startDate: null,
    endDate: null,
  });
  const formatDate = formatDateRange({
    start: filterDate.startDate,
    end: filterDate.endDate
  })
  const { data, isLoading, isError } = useGetAllDueListQuery({
    date: formatDate, limit, page, search
  }, {
    refetchOnMountOrArgChange: true,
  });
  const dues = data?.data?.data as IGetAllDueList[]
  const meta = data?.data?.meta as TMetaConfig;
  const totalCredit = dues?.reduce(
    (sum: number, r: IGetAllDueList) => sum + r?.remainingDue,
    0,
  );


  return (
    <div className="bg-white rounded-md shadow border ">
      <div className="flex w-full p-2 flex-col gap-3 lg:flex-row lg:items-center 
      lg:justify-between">

        {/* Left */}
        <div className="flex w-full items-center justify-between gap-2 lg:w-auto lg:justify-start">
          <button type="button">
            <CustomButtonFixed title="বর্তমান সিজন" />
          </button>

          <button
            type="button"
            className="w-full sm:w-auto md:hidden block"
          >
            <CustomButtonFixed title="প্রিন্ট করুন" />
          </button>

          <div>
            <span className="whitespace-nowrap rounded-md border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600">
              মোট বাকি: {toBanglaNumber(totalCredit || "00")} টাকা
            </span>
          </div>
        </div>



        {/* Right */}
        <div className="flex w-full gap-2 flex-row sm:items-center lg:w-auto">
          <div className="w-full sm:w-auto sm:min-w-[220px]">
            <SearchBar
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              onClear={() => setSearchItem("")}
            />
          </div>

          <div className="w-full sm:w-auto">
            <CustomDateFilter
              value={filterDate}
              onChange={setDateFiter}
              placeholder="তারিখ ফিল্টার করুন"
              className=""
            />
          </div>

          <button onClick={() => setOpenPrintModal(true)}>
            <CustomButtonFixed title="প্রিন্ট করুন" />
          </button>
        </div>
      </div>


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
                <TableHead th={"পরিশোধের তারিখ"} />
                <TableHead th={"ফোন নম্বর	"} />
                <TableHead th={"নোট"} />
                <TableHead th={"সিজন"} />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <TableLazyLoading
                  smallColumns={10}
                  largeColumns={10}
                  rows={6}
                />
              ) : isError ? <tr>
                <td colSpan={10}>
                  <CustomStatus
                    type="error"
                    description={SERVER_ERROR_MESSAGE}
                  />
                </td>
              </tr>
                : !dues?.length ? (
                  <tr>
                    <td colSpan={10} >
                      <CustomStatus
                        type="empty"
                        description="কোনো বাকি পাওয়া যায়নি"
                      />
                    </td>
                  </tr>
                ) : (
                  <>
                    {dues?.map((row: IGetAllDueList) => (
                      <tr key={row?.id} className="hover:bg-gray-50">
                        <TableData td={row?.customerCode} />
                        <TableData td={row?.name} />
                        <TableData td={row?.address} />
                        <TableData
                          td={toBanglaNumber(row?.remainingDelivery)}
                          cls="text-orange-500"
                        />
                        <TableData td={toBanglaNumber(row?.remainingDue)} />
                        <TableData
                          td={row?.nextDate ? formatBanglaDate({ date: row?.nextDate }) : "-"}
                        />

                        <TableData td={toBanglaNumber(row?.phoneNumber)} />
                        <TableData td={row?.note ?? "-"} />
                        <TableData td={row?.season} />

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
                                <Link
                                  href={`/dashboard/customer/profile/${row.customerCode}`}
                                >
                                  <CustomDropDownMenuItem
                                    Icon={User}
                                    title="প্রোফাইলে যান"
                                  />
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </>
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

      {/* {openPrintModal &&
        <AllDuePrintModal
          isOpen={openPrintModal}
          onClose={() => setOpenPrintModal(false)}
          dues={dues}
        />
      } */}
    </div>
  );
};

export default AllDueListPage;
