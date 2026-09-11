"use client";
import { useState } from "react";
import Image from "next/image";
import bgImage from "@/assets/login_bg.png";
import sideImage from "@/assets/login_side.png";
import MarqueeOneLine from "@/components/Marquee/Marguee";
import { FieldValues, useForm } from "react-hook-form";
import { userLogin } from "@/service/actions/userLogin";
import { storeUserInLocalStorage } from "@/service/auth.services";
import CustomInput from "@/components/Reusable/CustomInput";
import { useRouter } from "next/navigation";
import { getDeviceInfo } from "@/utils/getClientInfo";
import { SERVER_ERROR_MESSAGE } from "@/constant";
import { getSubdomain } from "@/utils/getSubdomain";
import { useVerifySubDomainMutation } from "@/redux/features/vata.features";
import logo from "@/assets/login.svg"
type TLogin = {
  username: string;
  password: string;
  extra: {
    device: string;
    browser: string
  }
};
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [errorMsg, setErrorMsg] = useState<string>("");
  // const subdomain = getSubdomain()
  //  const [verifyDomainAsync, {isLoading:verifyLoading, isError}]=useVerifySubDomainMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    defaultValues: {
      // username: "systemadmin",
      // password: "12345678",
      // username: "sohel",
      // password: "Sohel@123",
    },
  });

  const onSubmt = async (data: FieldValues) => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      const extraInfo = getDeviceInfo()
      data.extra = extraInfo
      const result = await userLogin(data);
      setIsLoading(false);
      if (result?.success && result?.redirectPath) {
        storeUserInLocalStorage(result?.data?.token);
        router.push(result.redirectPath);
      } else {
        setErrorMsg(result?.message || SERVER_ERROR_MESSAGE);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setErrorMsg(error?.data?.message || SERVER_ERROR_MESSAGE);
      setIsLoading(false);
    }
  };
  return (
    <div className="relative bg-[#006A4E]  w-full h-screen flex items-center 
    justify-center overflow-hidden">
      {/* Background */}
      {/* <div className="absolute inset-0">
        <Image
          src={bgImage}
          alt="background"
          fill
          className="object-cover brightness-95"
        />
      </div> */}

      {/* Content */}
      <div className="w-[90%] max-w-[700px] z-10">
        {/* Marquee */}
        <div className="px-16">
          <MarqueeOneLine />
        </div>

        {/* Login Box */}
        <div className="flex flex-col md:flex-row items-center bg-white/90 rounded-2xl shadow-lg p-4 md:p-3 gap-6">
          {/* Left Image */}
          <div className="w-full md:w-1/2 flex justify-center items-center">
            <Image
              src={logo}
              alt="illustration"
              width={350}
              height={350}
              className="rounded-xl  h-[200px] lg:h-full "
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 md:pr-5">
            <h2 className="text-2xl md:text-3xl font-bold text-[#006A4E] mb-2 text-center">
              আপনাকে স্বাগতম!
            </h2>
            <p className="text-gray-600 text-center mb-2">
              আপনার ব্যবসা পরিচালনার জন্য লগইন করুন
            </p>

            <form className="space-y-3" onSubmit={handleSubmit(onSubmt)}>
              {errorMsg && (
                <p className=" text-center text-red-500 text-sm">
                  {errorMsg}
                </p>
              )}
              <CustomInput
                type="text"
                label="ইউজারনেম"
                name="username"
                placeholder="ইউজারনেম লিখুন"
                register={register}
                rules={{ required: "ইউজারনেম আবশ্যক।" }}
                error={errors.username}

              />

              <CustomInput
                label="পাসওয়ার্ড"
                name="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                register={register}
                rules={{ required: "পাসওয়ার্ড আবশ্যক।" }}
                error={errors.password}
              />

              <button
                type="submit"
                className={`w-full bg-[#006A4E] text-white py-2 rounded-md font-semibold
                   hover:bg-[#006A4E]/90 transition cursor-pointer disabled:bg-gray-300`}
                disabled={isLoading}
              >
                লগইন করুন
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
