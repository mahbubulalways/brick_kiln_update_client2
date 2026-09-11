"use client"
import WeatherModal from "@/components/Dashboard/Modals/WeatherModal";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { TWeatherResponse } from "@/interface/weather";
import { useGetWeatherQuery } from "@/redux/features/weather.features";
import Link from "next/link";
import { useState } from "react";


export default function WeatherPage() {
  const [openModal, setOpenModal] = useState<boolean>(false)
  const { data, isLoading, isError } = useGetWeatherQuery(undefined)

  if(isLoading){
    return <CustomLoader cls="h-[30vh]"/>
  }
  if(isError){
    return <CustomStatus type="error"/>
  }

  const weather = data?.data[0] as TWeatherResponse
  return (
    <div className="flex min-h-screen items-start justify-center bg-white pt-52">
      <div className="flex flex-col items-center">
        <h1 className="mb-5 text-2xl font-medium text-gray-900">
          আবহাওয়ার পূর্বাভাস
        </h1>

        <div className="flex w-64 flex-col gap-3">
          {
            weather?.linkOne ? <Link
              href={weather?.linkOne}
              target="_blank"
              className="rounded-lg bg-sky-500 py-2.5 text-center font-medium text-white shadow-sm transition hover:bg-sky-600"
            >
              আবহাওয়া ১
            </Link> : <button
              className="rounded-lg bg-sky-500 py-2.5 text-center font-medium text-white shadow-sm transition hover:bg-sky-600"
            >
              আবহাওয়া ১
            </button>
          }
          {
            weather?.linkTwo ?
              <Link
                href={weather?.linkTwo}
                className="rounded-lg bg-cyan-500 py-2.5 text-center font-medium text-white shadow-sm transition hover:bg-cyan-600"
              >
                আবহাওয়া ২
              </Link>
              : <button
                className="rounded-lg bg-sky-500 py-2.5 text-center font-medium text-white shadow-sm transition hover:bg-sky-600"
              >
                আবহাওয়া ২
              </button>
          }




          <button
            onClick={() => setOpenModal(true)}
            className="cursor-pointer rounded-lg bg-violet-600 py-2.5 text-center font-medium text-white shadow-sm transition hover:bg-violet-700"
          >
            সেটিংস
          </button>
        </div>
      </div>
      {
        openModal &&
        <WeatherModal
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
        />
      }
    </div>
  );
}