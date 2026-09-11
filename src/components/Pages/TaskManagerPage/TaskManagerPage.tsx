"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

import IncompleteTasks from "./IncompleteTasks";
import CompletedTasks from "./CompletedTasks";
import NewTaskModal from "@/components/Dashboard/Modals/NewTaskModal";
import { getDateRange } from "./task.utils";

export default function TaskManagerPage() {
    const [modalOpen, setModalOpen] = useState(false);

    const [dateRange, setDateRange] = useState(
        getDateRange("week")
    );

    const days = useMemo(() => {
        const dates: {
            day: string;
            fullDate: string;
        }[] = [];

        const today = new Date();

        today.setDate(today.getDate() + 1);

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);

            date.setDate(today.getDate() + i);

            const year = date.getFullYear();
            const month = String(
                date.getMonth() + 1
            ).padStart(2, "0");
            const day = String(
                date.getDate()
            ).padStart(2, "0");

            dates.push({
                day,
                fullDate: `${year}-${month}-${day}`,
            });
        }

        return dates;
    }, []);

    const handleDateRange = (
        type: "today" | "week" | "month" | "all"
    ) => {
        const range = getDateRange(type);
        setDateRange(range);
    };

    const handleSpecificDate = (date: string) => {
        const selectedDate = new Date(
            `${date}T00:00:00.000Z`
        );
        const range = selectedDate.toISOString();
        setDateRange(range);
    };

    return (
        <>
            <div className="min-h-full rounded-lg bg-white p-2 sm:p-3">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <button
                        type="button"
                        onClick={() => setModalOpen(true)}
                        className="flex w-fit items-center gap-1.5 rounded-md bg-[#039a63] px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#028756]"
                    >
                        <Plus size={18} />
                        অ্যাড কাজ
                    </button>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        <button
                            type="button"
                            onClick={() =>
                                handleDateRange("today")
                            }
                            className={`rounded-md border px-4 py-2 text-sm transition ${dateRange ===
                                getDateRange("today")
                                ? "border-[#039a63] bg-[#039a63] text-white"
                                : "border-gray-300 bg-white text-gray-800 hover:border-[#039a63] hover:text-[#039a63]"
                                }`}
                        >
                            আজ
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleDateRange("week")
                            }
                            className={`rounded-md border px-4 py-2 text-sm transition ${dateRange ===
                                getDateRange("week")
                                ? "border-[#039a63] bg-[#039a63] text-white"
                                : "border-gray-300 bg-white text-gray-800 hover:border-[#039a63] hover:text-[#039a63]"
                                }`}
                        >
                            এই সপ্তাহ
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleDateRange("month")
                            }
                            className={`rounded-md border px-4 py-2 text-sm transition ${dateRange ===
                                getDateRange("month")
                                ? "border-[#039a63] bg-[#039a63] text-white"
                                : "border-gray-300 bg-white text-gray-800 hover:border-[#039a63] hover:text-[#039a63]"
                                }`}
                        >
                            এই মাস
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                handleDateRange("all")
                            }
                            className={`rounded-md border px-4 py-2 text-sm transition ${dateRange ===
                                getDateRange("all")
                                ? "border-[#039a63] bg-[#039a63] text-white"
                                : "border-gray-300 bg-white text-gray-800 hover:border-[#039a63] hover:text-[#039a63]"
                                }`}
                        >
                            সব কাজ
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-1.5">
                        {days.map((item) => {
                            const specificDate = new Date(
                                `${item.fullDate}T00:00:00.000Z`
                            ).toISOString();

                            return (
                                <button
                                    key={item.fullDate}
                                    type="button"
                                    onClick={() =>
                                        handleSpecificDate(
                                            item.fullDate
                                        )
                                    }
                                    className={`flex h-9 min-w-[42px] items-center justify-center rounded-md border px-3 text-sm transition ${dateRange ===
                                        specificDate
                                        ? "border-[#039a63] bg-[#039a63] text-white"
                                        : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50"
                                        }`}
                                >
                                    {item.day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-5">
                    <IncompleteTasks
                        date={dateRange}
                    />
                </div>

                <CompletedTasks
                    date={dateRange}
                />
            </div>

            <NewTaskModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </>
    );
}