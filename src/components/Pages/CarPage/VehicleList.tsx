"use client";

import CreateNewCarModal from "@/components/Dashboard/Modals/CreateNewCarModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { IVataCar } from "@/interface/car";
import { useGetAllCarQuery } from "@/redux/features/car.features";
import { toBanglaNumber } from "@/utils/toBanglaNumber";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const VehicleList = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { isError, isLoading, data } = useGetAllCarQuery(undefined);

  const handleAddVehicle = () => {
    setIsOpen(true);
  };

  const vehicles = (data?.data as IVataCar[]) || [];

  return (
    <div className="h-full rounded-lg bg-white p-4 shadow-sm">
      <h2 className="mb-4 text-base font-semibold text-gray-700">
        গাড়ির তালিকা
      </h2>

      {isLoading ? (
        <CustomLoader cls="h-[40vh]" />
      ) : isError ? (
        <CustomStatus type="error" />
      ) : (
        <div className="flex flex-wrap gap-4">
          {vehicles?.map((vehicle) => (
            <Link
            href={`/dashboard/vehicle/${vehicle?.id}`}
              key={vehicle.id}
              className="group flex h-[150px] w-[180px] flex-col items-center justify-center rounded-lg border border-emerald-400 bg-emerald-50 transition hover:bg-emerald-100"
            >
              <div className="mb-2 text-5xl">🚜</div>

              <span className="text-base font-medium text-gray-700">
                গাড়ি-{toBanglaNumber(vehicle.carNo)}
              </span>
            </Link>
          ))}

          <button
            onClick={handleAddVehicle}
            className="flex h-[150px] w-[180px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600"
          >
            <Plus className="mb-2 h-9 w-9" />

            <span className="text-base font-medium">
              অ্যাড গাড়ি
            </span>
          </button>

          {vehicles.length === 0 && (
            <div className="w-full py-4 text-center text-sm text-gray-500">
              কোনো গাড়ি পাওয়া যায়নি।
            </div>
          )}
        </div>
      )}

      <CreateNewCarModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default VehicleList;