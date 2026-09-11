import React from "react";
import IncomeSummary from "./IncomeSummary";
import VehicleList from "./VehicleList";
import IncomeReport from "./IncomeReport";

export default function CarPage() {
  const vehicles = [
    {
      id: "1",
      name: "car-1",
    },
  ];

  const reportData = [
    {
      id: "1",
      vehicleName: "car-1",
      income: 0,
      expense: 0,
      netIncome: 80,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-200 p-2">
      {/* হিসাব */}
      <IncomeSummary
        totalIncome={80}
        totalExpense={0}
        totalCash={0}
        currentGiven={0}
        currentDue={8100}
        cashBalance={8100}
      />

      {/* গাড়ি + রিপোর্ট */}
      <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <VehicleList />
        </div>

        <div className="lg:col-span-6">
          <IncomeReport data={reportData} />
        </div>
      </div>
    </div>
  );
}