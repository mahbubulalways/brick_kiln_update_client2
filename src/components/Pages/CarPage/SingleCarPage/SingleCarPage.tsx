"use client"

import CarIncome from "./Tabs/CarIncome"

export default function SingleCarPage({ id }: { id: string }) {
  return (
    <div className="bg-white min-h-[90vh] p-5 rounded">
      {/* <CarIncomeTabs id={id}/> */}
      <CarIncome id={id} />
    </div>
  )
}
