"use client";

import { useMemo, useState } from "react";
import { useGetSingleCarIncomeQuery } from "@/redux/features/car.features";

import TableHead from "@/components/Reusable/TableHead";
import TableData from "@/components/Reusable/TableData";
import CustomLoader from "@/components/Reusable/CustomLoader";
import { TablePagination } from "@/components/Reusable/TablePagination";
import { formatBanglaDate } from "@/utils/formatBanglaDate";

interface ICarIncomeDelivery {
    amount: number | string;
    createdAt: string;
    delivery: {
        deliveryNo: string;
    } | null;
    driver: {
        name: string;
    } | null;
}



interface IProps {
    id: string;
}

const CarIncome = ({ id }: IProps) => {
    const {
        data,
        isLoading,
        isFetching,
    } = useGetSingleCarIncomeQuery(id, {
        refetchOnMountOrArgChange: true,
    });


    console.log(data)


    const [page, setPage] = useState(1);

    const limit = 10;

    const carIncomeData: ICarIncomeDelivery[] =
        data?.data?.carIncomeDeliveries ?? [];

    const totalPages = Math.ceil(
        carIncomeData.length / limit
    );

    const paginatedData = useMemo(() => {
        const startIndex = (page - 1) * limit;

        return carIncomeData.slice(
            startIndex,
            startIndex + limit
        );
    }, [carIncomeData, page]);


    return (
        <div className="overflow-x-auto rounded-t-md border border-gray-200">

            <table className="min-w-full border-collapse">

                {/* Table Header */}
                <thead>
                    <tr className="bg-[#039A63] text-center text-white">

                        <TableHead th="#" />

                        <TableHead th="ডেলিভারি নং" />

                        <TableHead th="ড্রাইভার" />

                        <TableHead th="আয়ের পরিমাণ" />

                        <TableHead th="তারিখ" />

                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-center">

                    {(isLoading || isFetching) ? (

                        <tr>
                            <td colSpan={5}>
                                <CustomLoader cls="h-[30vh]" />
                            </td>
                        </tr>

                    ) : !carIncomeData?.length ? (

                        <tr>
                            <td
                                colSpan={5}
                                className="py-10 text-gray-500"
                            >
                                কোনো ডাটা পাওয়া যায়নি
                            </td>
                        </tr>

                    ) : (

                        paginatedData.map(
                            (
                                row: ICarIncomeDelivery,
                                index: number
                            ) => (

                                <tr
                                    key={`${row.delivery?.deliveryNo}-${index}`}
                                    className="h-[56px] border-b border-gray-200 transition-colors hover:bg-gray-50"
                                >

                                    <TableData
                                        td={
                                            (page - 1) *
                                            limit +
                                            index +
                                            1
                                        }
                                    />

                                    <TableData
                                        td={
                                            row?.delivery
                                                ?.deliveryNo ??
                                            "-"
                                        }
                                    />

                                    <TableData
                                        td={
                                            row?.driver?.name ??
                                            "-"
                                        }
                                    />

                                    <TableData
                                        td={
                                            row?.amount
                                                ? `৳ ${Number(
                                                    row.amount
                                                ).toLocaleString(
                                                    "en-BD"
                                                )}`
                                                : "৳ ০"
                                        }
                                    />

                                    {/* Date */}
                                    <TableData
                                        td={
                                            row?.createdAt
                                                ? formatBanglaDate(
                                                    {
                                                        date: row.createdAt
                                                    }
                                                )
                                                : "-"
                                        }
                                    />

                                </tr>
                            )
                        )

                    )}

                </tbody>

            </table>

            <TablePagination
                page={page}
                totalPages={totalPages || 1}
                dataLength={carIncomeData?.length}
                title="আয়"
            />

        </div>
    );
};

export default CarIncome;