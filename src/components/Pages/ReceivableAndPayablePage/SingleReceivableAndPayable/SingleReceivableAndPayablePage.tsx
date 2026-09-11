"use client";

import { useGetSingleDueMateQuery } from "@/redux/features/due_mate.features";

import CustomLoader from "@/components/Reusable/CustomLoader";
import PersonalInfoCard from "./PersonalInfoCard";
import DueDetailsCard from "./DueDetailsCard";
import TransactionHistoryCard from "./TransactionHistoryCard";
import QuickActionsCard from "./QuickActionsCard";
import FinancialSummaryCard from "./FinancialSummaryCard";
import { useState } from "react";
import NewTransactionGivenModal from "./Modal/NewTransactionGivenModal";
import PayLoanGivenModal from "./Modal/PayLoanGivenModal";
import NewTransactionTakenModal from "./Modal/NewTransactionTakenModal";
import PayLoanTakenModal from "./Modal/PayLoadnTakenModal";
import CustomStatus from "@/components/Reusable/CustomStatus";



export default function SingleReceivableAndPayablePage({
    id,
}: {
    id: string;
}) {

    const [openNewTransactionGiven, setOpenNewTransactionGiven] = useState<boolean>(false)
    const [openNewTransactionTaken, setOpenNewTransactionTaken] = useState<boolean>(false)
    const [openPayLoanGiven, setOpenPayLoadnGiven] = useState<boolean>(false)
    const [openPayLoanTaken, setOpenPayLoadnTaken] = useState<boolean>(false)
    const {
        data,
        isLoading,
        isError,
        refetch,
    } = useGetSingleDueMateQuery(id, {
        refetchOnMountOrArgChange: true,
    });

    if (isLoading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center rounded-2xl bg-[#f4f7fa]">
                <CustomLoader cls="h-[30vh]" />
            </div>
        );
    }



    if (isError || !data?.data) {
        return (
            <CustomStatus type="error" />
        );
    }

    const due = data?.data || {};

    return (
        <div className="bg-[#F1F5F9] p-2 lg:p-5 rounded-xl">
            {/* Page Title */}
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#172b4d]">
                    {due.name}
                </h1>

                <div className="rounded-full bg-[#edffbd] px-5 py-2 text-sm font-semibold text-[#5b8700]">
                    {due.transactionType === "GIVEN"
                        ? "আমার দেওয়া ঋণ"
                        : "আমার নেয়া ঋণ"}
                </div>
            </div>

            <div className="grid mb-5 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(350px,1fr)]">
                {/* LEFT */}
                <div className="space-y-5">
                    <PersonalInfoCard
                        id={due.id}
                        name={due.name}
                        phone={due.phone}
                        address={due.address}
                        description={due.description}
                    />

                    <DueDetailsCard
                        transactionDate={due.transactionDate}
                        paymentDate={due.paymentDate}
                        witnessOne={due.witnessOne}
                        witnessTwo={due.witnessTwo}
                    />


                </div>

                {/* RIGHT */}
                {
                    due.transactionType === "GIVEN" ?
                        <div className="space-y-5">
                            <QuickActionsCard
                                onNewTransaction={() => {
                                    setOpenNewTransactionGiven(true)
                                }}
                                onPayment={() => {
                                    setOpenPayLoadnGiven(true)
                                }}
                            />

                            <FinancialSummaryCard
                                amount={due.amount}
                                currentAmount={due.currentAmount}
                            />
                        </div>
                        : <div className="space-y-5">
                            <QuickActionsCard
                                onNewTransaction={() => {
                                    setOpenNewTransactionTaken(true)
                                }}
                                onPayment={() => {
                                    setOpenPayLoadnTaken(true)
                                }}
                            />

                            <FinancialSummaryCard
                                amount={due.amount}
                                currentAmount={due.currentAmount}
                            />
                        </div>
                }
            </div>

            <TransactionHistoryCard
                transactions={due.transactions || []}
            />

            {
                openNewTransactionGiven &&
                <NewTransactionGivenModal
                    isOpen={openNewTransactionGiven}
                    onClose={() => setOpenNewTransactionGiven(false)}
                    id={id ?? ""}

                />
            }
            {
                openNewTransactionTaken &&
                <NewTransactionTakenModal
                    isOpen={openNewTransactionTaken}
                    onClose={() => setOpenNewTransactionTaken(false)}
                    id={id ?? ""}

                />
            }
            {
                openPayLoanGiven &&
                <PayLoanGivenModal
                    isOpen={openPayLoanGiven}
                    onClose={() => setOpenPayLoadnGiven(false)}
                    id={id ?? ""}

                />
            }
            {
                openPayLoanTaken &&
                <PayLoanTakenModal
                    isOpen={openPayLoanTaken}
                    onClose={() => setOpenPayLoadnTaken(false)}
                    id={id ?? ""}

                />
            }
        </div>
    );
}