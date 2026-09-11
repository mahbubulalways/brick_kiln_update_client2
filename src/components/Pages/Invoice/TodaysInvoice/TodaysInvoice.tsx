"use client";
import ChalanDetailsModal from "@/components/Dashboard/Modals/ChalanDetailsModal";
import NewChalanModal from "@/components/Dashboard/Modals/NewChalanModal";
import NewDeliveryModal from "@/components/Dashboard/Modals/NewDeliveryModal";
import SellingModal from "@/components/Dashboard/Modals/SellingModal";
import UpdateChalanModal from "@/components/Dashboard/Modals/UpdateChalanModal";
import ChalanPrintModal from "@/components/Dashboard/PrintModal/ChalanPrint/ChalanPrintModal";
import PrintThermalInvoice from "@/components/Dashboard/PrintModal/PrintThermalInvoice";
import CommonPrint, { TCommonPrintRef } from "@/components/Reusable/CommonPrint";
import CustomDatePickerState from "@/components/Reusable/CustomDatePickerState";
import CustomDropDownMenuItem from "@/components/Reusable/CustomDropDownMenuItem";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomNewButton from "@/components/Reusable/CustomNewButton";
import CustomPrintButton from "@/components/Reusable/CustomPrintButton";
import CustomReportButton from "@/components/Reusable/CustomReportButton";
import SearchBar from "@/components/Reusable/SearchBar";
import TableData from "@/components/Reusable/TableData";
import TableHead from "@/components/Reusable/TableHead";
import { TablePagination } from "@/components/Reusable/TablePagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TMetaConfig } from "@/interface/meta";
import { TQuery } from "@/interface/query";
import {
  useDeleteInvoiceMutation,
  useGetAllInvoicesQuery,
} from "@/redux/features/invoice.features";
import { IChallanForDataShow, IChallanItem } from "@/types/types";
import {
  MoreVertical,
  Printer,
  Truck,
  Notebook,
  User,
  Trash,
  MessageSquare,
  HandCoins,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { BsPencilSquare } from "react-icons/bs";
import Swal from "sweetalert2";
import UnloadPagePrint from "../../UnloadPage/UploadPagePrint";
import DailyChallanPrint from "@/components/PrintComponent/DailyChallanPrint";
import { useGetVataInfoQuery } from "@/redux/features/vata.features";
import NewDueCollectionModalId from "@/components/Dashboard/Modals/NewDueCollectionModalId";
import SendCustomerSmsModal from "@/components/Dashboard/Modals/SendCustomerSmsModal";
import { formatDateRange } from "@/utils/formatDateRange";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import CustomStatus from "@/components/Reusable/CustomStatus";
import TableLazyLoading from "@/components/Dashboard/common/TableLazyLoading";
import CustomDateFilter from "@/components/Reusable/CustomDateFilter";

const TodaysInVoicePage = ({ limit, page, search }: TQuery) => {
  const [searchItems, setSearchItem] = useState("");
  const [filterDate, setDateFiter] = useState<{
    startDate: Date | null,
    endDate: Date | null,
  }>({
    startDate: new Date(),
    endDate: null,
  });

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [openReportModal, setOpenReportModal] = useState<boolean>(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] =
    useState<boolean>(false);
  const [openPrintModal, setOpenPrintModal] = useState<boolean>(false);
  // const [openAllPrintModal, setOpenAllPrintModal] = useState<boolean>(false);
  const [openUpdateModal, setOpenUpdateModal] = useState<boolean>(false);
  const [openThermalModal, setOpenThermalModal] = useState<boolean>(false);
  const [invoiceId, setInvoiceId] = useState<number | undefined>(undefined);
  const [openChalanDetailsModal, setOpenChalanDetailsModal] =
    useState<boolean>(false);
  const [openDueModal, setOpenDeuModal] = useState<boolean>(false);
  const [openSmsModal, setOpenSmsModal] = useState<boolean>(false);
  const [customerId, setCustomerId] = useState<string>();
  // VATA INFORMATIONS
  const { data: vata } = useGetVataInfoQuery(undefined)
  // FETCH ALL INVOICES

  const formatDate = formatDateRange({
    start: filterDate.startDate,
    end: filterDate.endDate
  })

  const { isFetching: fetchInvoiceLoading, data: invoices } =
    useGetAllInvoicesQuery(
      { limit, page, search, date: formatDate }
      , { refetchOnMountOrArgChange: true });


  //  CALL DELETE INVOICE HOOK
  const [deleteInvoice] = useDeleteInvoiceMutation();
  const printRef = useRef<TCommonPrintRef>(null);
  const totalInvoices = invoices?.data?.data as IChallanForDataShow[] || [];
  const meta = invoices?.data?.meta as TMetaConfig;

  //  DELETE INVOICE PART
  const handleDeleteInvoice = async (invoiceId: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "একবার মুছে ফেলা হলে এটি আর ফিরিয়ে আনা যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল করুন",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const result = await deleteInvoice(invoiceId).unwrap();
          if (result?.success) {
            Swal.fire({
              title: "মুছে ফেলা হয়েছে!",
              text: "আপনার চালান সফলভাবে মুছে ফেলা হয়েছে।",
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
              "দুঃখিত! সার্ভারে ত্রুটি ঘটেছে। কিছুক্ষণ পর চেষ্টা করুন।",
            icon: "error",
            confirmButtonText: "ঠিক আছে",
          });
        }
      }
    });
  };

  const handleDueCollection = (id: string) => {
    setCustomerId(id)
    setOpenDeuModal(true)
  }

  const handleSendSms = (id: string) => {
    setCustomerId(id)
    setOpenSmsModal(true)
  }


  return (
    <div className="bg-white rounded-md shadow border ">
      <div className="flex w-full flex-col gap-3 border-b bg-gray-50 p-3 md:flex-row md:items-center md:justify-between">

        <div className="flex w-full min-w-0 items-center gap-2 md:flex-1">
          <CustomNewButton
            title="নতুন চালান"
            className="w-full flex-1 md:w-auto md:flex-none"
            onClick={() => setIsOpen(true)}
          />

          {/* <div className="w-full hidden md:block flex-1">
            <CustomPrintButton
              className="w-full md:w-auto md:flex-none"
              onClick={() => setOpenReportModal(true)}
            />
          </div> */}
          <div className="w-full block md:hidden flex-1">
            <CustomReportButton
              className="w-full md:w-auto md:flex-none"
              onClick={() => setOpenReportModal(true)}
            />
          </div>

          <div className="min-w-0 flex-1 hidden md:block">
            <SearchBar
              value={searchItems}
              onChange={(e) => setSearchItem(e.target.value)}
              onClear={() => setSearchItem("")}
            />
          </div>
        </div>

        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="flex-1 md:flex-none">
            <CustomDateFilter
              value={filterDate}
              onChange={setDateFiter}
              placeholder="তারিখ ফিল্টার করুন"
              className=""
            />
          </div>

          <div className="min-w-0 flex-1 md:hidden block">
            <SearchBar
              value={searchItems}
              onChange={(e) => setSearchItem(e.target.value)}
              onClear={() => setSearchItem("")}
            />
          </div>
          {/* Report */}
          <div className="w-full hidden md:block flex-1">
            <CustomPrintButton
              className="w-full md:w-auto md:flex-none"
              onClick={() => printRef.current?.print()}
            />
          </div>
          <div className="w-full hidden md:block flex-1">
            <CustomReportButton
              className="w-full md:w-auto md:flex-none"
              onClick={() => setOpenReportModal(true)}
            />
          </div>
        </div>

      </div>


      <div >
        <div className="overflow-x-auto mt-2  ">
          <table className="min-w-full border-collapse ">
            <thead>
              <tr className="bg-[#039A63] text-white text-center">
                <TableHead th={"#"} />
                <TableHead th={"কাস্টমার"} />
                <TableHead th={"ঠিকানা"} cls="hidden lg:table-cell" />
                <TableHead th={"শ্রেণি"} />
                <TableHead th={"পরিমাণ"} />
                <TableHead th={"রেট"} cls="hidden lg:table-cell" />
                <TableHead th={"মূল্য"} cls="hidden lg:table-cell" />
                <TableHead th={"মোট মূল্য"} cls="hidden lg:table-cell" />
                <TableHead th={"ছাড়"} cls="hidden lg:table-cell" />
                <TableHead th={"ভাড়া"} cls="hidden lg:table-cell" />
                <TableHead th={"সর্বমোট"} />
                <TableHead th={"নগদ"} cls="hidden lg:table-cell" />
                <TableHead th={"বাকি"} cls="hidden lg:table-cell" />
                <TableHead th={"বাটন"} />
              </tr>
            </thead>
            <tbody className="text-center">
              {fetchInvoiceLoading ? (
                <TableLazyLoading
                  smallColumns={6}
                  largeColumns={14}
                  rows={6}
                />
              ) : !totalInvoices?.length ? (
                <tr>
                  <td colSpan={14}>
                    <CustomStatus
                      type="empty"
                      description="আজকের কোনো চালান পাওয়া যায়নি"
                    />
                  </td>
                </tr>
              ) : (
                totalInvoices?.map((row: IChallanForDataShow, idx: number) =>
                  row?.items?.length > 1 ? (
                    row?.items?.map((item: IChallanItem, index: number) => (
                      <tr
                        key={`${row?.id}-${item?.id}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {index === 0 && (
                          <>
                            <TableData
                              td={row?.serial}
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={row?.customer?.name}
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={row?.customer?.address}
                              cls="hidden lg:table-cell"
                              rowSpan={row?.items?.length}
                            />
                          </>
                        )}

                        <TableData td={item?.class} />
                        <TableData td={toBanglaNumber(item?.quantity)} />
                        <TableData td={toBanglaNumber(item?.rate)} cls="hidden lg:table-cell" />
                        <TableData
                          td={`৳ ${toBanglaNumber(item?.price)}`}
                          cls="hidden lg:table-cell"
                        />

                        {index === 0 && (
                          <>
                            <TableData
                              td={`৳ ${toBanglaNumber(row?.productPrice)}`}
                              cls="text-green-600 hidden lg:table-cell"
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={`৳ ${toBanglaNumber(row?.discount)}`}
                              cls="text-orange-500 hidden lg:table-cell"
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={`৳ ${toBanglaNumber(row?.carRent)}`}
                              cls="text-blue-600 hidden lg:table-cell"
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={`৳ ${toBanglaNumber(row?.totalPrice)}`}
                              rowSpan={row?.items?.length}
                            />

                            <TableData
                              td={`৳ ${toBanglaNumber(row?.cash)}`}
                              cls="text-green-600 hidden lg:table-cell"
                              rowSpan={row?.items?.length}
                            />
                            <TableData
                              td={`৳ ${toBanglaNumber(row?.due)}`}
                              cls={`border p-2 ${row?.due > 0 ? "text-red-500" : "text-green-600"
                                } hidden lg:table-cell`}
                              rowSpan={row?.items?.length}
                            />
                            <td
                              className="border p-2"
                              rowSpan={row?.items?.length}
                            >
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
                                      setOpenUpdateModal(true);
                                      setInvoiceId(row?.serial);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={BsPencilSquare}
                                      title="আপডেট করুন"
                                    />
                                  </DropdownMenuItem>

                                  {/* for lg desktop */}
                                  <DropdownMenuItem
                                    className="hidden lg:block"
                                    onClick={() => {
                                      setOpenPrintModal(true);
                                      setInvoiceId(row?.serial);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Printer}
                                      title="প্রিন্ট চালান"
                                    />
                                  </DropdownMenuItem>

                                  {/* for mobile */}
                                  <DropdownMenuItem
                                    className="lg:hidden block"
                                    onClick={() => {
                                      setOpenThermalModal(true);
                                      setInvoiceId(row?.serial);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Printer}
                                      title="প্রিন্ট চালান"
                                    />
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => {
                                      setIsDeliveryModalOpen(true);
                                      setInvoiceId(row?.serial);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Truck}
                                      title="ডেলিভারি দিন"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setInvoiceId(row?.serial);
                                      setOpenChalanDetailsModal(true);
                                    }}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Notebook}
                                      title="চালান বিস্তারিত"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleSendSms(row?.customer?.customerCode)}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={MessageSquare}
                                      title="এসএমএস দিন"
                                    />
                                  </DropdownMenuItem>

                                  <DropdownMenuItem
                                    onClick={() => handleDueCollection(row?.customer?.customerCode)}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={HandCoins}
                                      title="বাকি জমা করুন"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <CustomDropDownMenuItem
                                      Icon={User}
                                      title="প্রোফাইলে যান"
                                    />
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteInvoice(row?.id)}
                                  >
                                    <CustomDropDownMenuItem
                                      Icon={Trash}
                                      title="ডিলিট করুন"
                                    />
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </>
                        )}
                      </tr>
                    ))
                  ) : (
                    <tr
                      key={row?.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableData
                        td={toBanglaNumber(row.serial)}
                      />

                      <TableData
                        td={row?.customer?.name}
                      />

                      <TableData
                        td={row?.customer?.address}
                        cls="hidden lg:table-cell"
                      />

                      <TableData
                        td={row.items[0]?.class}
                      />

                      <TableData
                        td={toBanglaNumber(
                          row.items[0]?.quantity?.toLocaleString(),
                        )}
                      />

                      <TableData
                        td={toBanglaNumber(row.items[0]?.rate)}
                        cls="hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(
                          row.items[0]?.price?.toLocaleString(),
                        )}`}
                        cls="hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.productPrice)}`}
                        cls="text-green-600 hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.discount)}`}
                        cls="text-orange-500 hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.carRent)}`}
                        cls="text-blue-600 hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.totalPrice)}`}
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.cash)}`}
                        cls="text-green-600 hidden lg:table-cell"
                      />

                      <TableData
                        td={`৳ ${toBanglaNumber(row?.due)}`}
                        cls={`border p-2 ${row.due > 0
                          ? "text-red-500"
                          : "text-green-600"
                          } hidden lg:table-cell`}
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
                                setOpenUpdateModal(true);
                                setInvoiceId(row?.serial);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={BsPencilSquare}
                                title="আপডেট করুন"
                              />
                            </DropdownMenuItem>

                            {/* for lg desktop */}
                            <DropdownMenuItem
                              className="hidden lg:block"
                              onClick={() => {
                                setOpenPrintModal(true);
                                setInvoiceId(row?.serial);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={Printer}
                                title="প্রিন্ট চালান"
                              />
                            </DropdownMenuItem>

                            {/* for mobile */}
                            <DropdownMenuItem
                              className="lg:hidden block"
                              onClick={() => {
                                setOpenThermalModal(true);
                                setInvoiceId(row?.serial);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={Printer}
                                title="প্রিন্ট চালান"
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setIsDeliveryModalOpen(true);
                                setInvoiceId(row?.serial);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={Truck}
                                title="ডেলিভারি দিন"
                              />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setOpenChalanDetailsModal(true);
                                setInvoiceId(row?.serial);
                              }}
                            >
                              <CustomDropDownMenuItem
                                Icon={Notebook}
                                title="চালান বিস্তারিত"
                              />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleSendSms(row?.customer?.customerCode)}
                            >
                              <CustomDropDownMenuItem
                                Icon={MessageSquare}
                                title="এসএমএস দিন"
                              />
                            </DropdownMenuItem>

                            <DropdownMenuItem
                              onClick={() => handleDueCollection(row?.customer?.customerCode)}
                            >
                              <CustomDropDownMenuItem
                                Icon={HandCoins}
                                title="বাকি জমা করুন"
                              />
                            </DropdownMenuItem>


                            <DropdownMenuItem>
                              <Link href={`/dashboard/customer/profile/${row?.customer?.customerCode}`}><CustomDropDownMenuItem
                                Icon={User}
                                title="প্রোফাইলে যান"
                              />
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteInvoice(row?.id)}
                            >
                              <CustomDropDownMenuItem
                                Icon={Trash}
                                title="ডিলিট করুন"
                              />
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ),
                )
              )}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={meta?.page ?? 1}
          totalPages={meta?.totalPages ?? 1}
          dataLength={totalInvoices?.length}
          title="চালান"
        />
      </div>

      {isOpen && (
        <NewChalanModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}

      {openReportModal && (
        <SellingModal
          isOpen={openReportModal}
          onClose={() => setOpenReportModal(false)}
          date={formatDate}
          challanType="DAILY"
        />
      )}

      {openUpdateModal && (
        <UpdateChalanModal
          isOpen={openUpdateModal}
          onClose={() => setOpenUpdateModal(false)}
          invoiceId={invoiceId!}
          setInvoiceId={setInvoiceId!}
        />
      )}
      {openPrintModal && (
        <ChalanPrintModal
          isOpen={openPrintModal}
          onClose={() => setOpenPrintModal(false)}
          invoiceId={invoiceId!}
          setInvoiceId={setInvoiceId}
          vataInformation={vata?.data}
        />
      )}
      {openChalanDetailsModal && (
        <ChalanDetailsModal
          invoiceId={invoiceId!}
          setInvoiceId={setInvoiceId}
          isOpen={openChalanDetailsModal}
          onClose={() => setOpenChalanDetailsModal(false)}
        />
      )}
      {openThermalModal && (
        <PrintThermalInvoice
          invoiceId={invoiceId!}
          setInvoiceId={setInvoiceId}
          isOpen={openThermalModal}
          onClose={() => setOpenThermalModal(false)}
        />
      )}

      {isDeliveryModalOpen && (
        <NewDeliveryModal
          isOpen={isDeliveryModalOpen}
          onClose={() => setIsDeliveryModalOpen(false)}
          invoiceId={invoiceId!}
        />
      )}


      <CommonPrint
        ref={printRef}
        title="daily_invoices"
      >
        <DailyChallanPrint
          invoices={totalInvoices}
          vataInformation={vata?.data}
        />
      </CommonPrint>

      {openDueModal &&
        <NewDueCollectionModalId
          onClose={() => setOpenDeuModal(false)}
          isOpen={openDueModal}
          id={customerId}
        />
      }

      {openSmsModal &&
        <SendCustomerSmsModal
          onClose={() => setOpenSmsModal(false)}
          isOpen={openSmsModal}
          customerId={customerId}
        />
      }
    </div>
  );
};

export default TodaysInVoicePage;
