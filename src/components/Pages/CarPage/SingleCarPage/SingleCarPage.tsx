"use client"

import CarIncomeTabs from "./CarIncomeTabs"

export default function SingleCarPage({id}:{id:string}) {
  return (
    <div className="bg-white min-h-[90vh] p-5 rounded">
        <CarIncomeTabs id={id}/>
    </div>
  )
}
