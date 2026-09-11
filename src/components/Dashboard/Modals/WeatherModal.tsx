"use client";

import { FaCircleCheck } from "react-icons/fa6";
import CustomModal from "@/components/Reusable/CustomModal";
import { showToast } from "@/components/Toast/CustomToast";
import { SubmitHandler, useForm } from "react-hook-form";
import { MdOutlineError } from "react-icons/md";
import CustomInput from "@/components/Reusable/CustomInput";
import {
    useCreateWeatherApiMutation,
    useGetWeatherQuery,
} from "@/redux/features/weather.features";
import { useEffect } from "react";
import CustomLoader from "@/components/Reusable/CustomLoader";
import CustomStatus from "@/components/Reusable/CustomStatus";
import { TWeatherResponse } from "@/interface/weather";

type TCustomModal = {
    isOpen: boolean;
    onClose: () => void;
};

type TWeather = {
    linkOne: string;
    linkTwo: string;
};

const WeatherModal = ({ isOpen, onClose }: TCustomModal) => {
    const {
        data: weatherData,
        isLoading: isWeatherLoading,
        isError: isWeatherError,
    } = useGetWeatherQuery(undefined);

    const [mutateAsync, { isLoading: isCreateLoading }] =
        useCreateWeatherApiMutation();

    const { register, handleSubmit, reset } = useForm<TWeather>({
        defaultValues: {
            linkOne: "",
            linkTwo: "",
        },
    });

    const weatherInfo = weatherData.data[0] as TWeatherResponse
    useEffect(() => {
        if (weatherInfo) {
            reset({
                linkOne: weatherInfo.linkOne || "",
                linkTwo: weatherInfo.linkTwo || "",
            });
        }
    }, [weatherInfo, reset]);

    const onSubmit: SubmitHandler<TWeather> = async (data) => {
        try {
            const result = await mutateAsync(data).unwrap();

            if (result?.success) {
                onClose();

                return showToast({
                    title: result?.message,
                    type: "success",
                    options: {
                        duration: 4000,
                        icon: <FaCircleCheck className="h-5 w-5" />,
                    },
                });
            }
        } catch (error: any) {
            console.log(error);

            return showToast({
                title:
                    error?.data?.message ||
                    "দুঃখিত! সার্ভারে ত্রুটি হয়েছে, পরে চেষ্টা করুন",
                type: "error",
                options: {
                    duration: 4000,
                    icon: <MdOutlineError className="h-5 w-5" />,
                },
            });
        }
    };

    return (
        <CustomModal
            isOpen={isOpen}
            onClose={onClose}
            title="আবহাওয়ার লিঙ্ক অ্যাড করুন"
            width="sm"
        >
            {
                isWeatherLoading ?
                    <CustomLoader cls="h-[30vh]" />
                    : isWeatherError ?
                        <CustomStatus type="error" /> :
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex flex-col gap-2">
                                <CustomInput
                                    name="linkOne"
                                    label="আবহাওয়া ১ লিংক"
                                    placeholder="আবহাওয়া ১ লিংক"
                                    register={register}
                                    type="text"
                                />

                                <CustomInput
                                    name="linkTwo"
                                    label="আবহাওয়া ২ লিংক"
                                    placeholder="আবহাওয়া ২ লিংক"
                                    register={register}
                                    type="text"
                                />
                            </div>

                            <div className="flex items-center justify-between pt-5">
                                <div
                                    onClick={onClose}
                                    className="text-[14px] border border-gray-300 bg-white hover:border-[#039A63] px-10 py-1.5 text-gray-500 duration-500 hover:text-[#039A63] font-medium rounded cursor-pointer"
                                >
                                    বাতিল
                                </div>

                                <button
                                    type="submit"
                                    className="text-[14px] bg-[#039A63] px-8 py-1.5 text-gray-100 font-medium rounded cursor-pointer"
                                    disabled={isCreateLoading || isWeatherLoading}
                                >
                                    {isCreateLoading ? "অ্যাড হচ্ছে..." : "অ্যাড করুন"}
                                </button>
                            </div>
                        </form>
            }
        </CustomModal>
    );
};

export default WeatherModal;