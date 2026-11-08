"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";

import MarqueeOneLine from "@/components/Marquee/Marguee";
import CustomInput from "@/components/Reusable/CustomInput";

import { userLogin } from "@/service/actions/userLogin";
import { storeUserInLocalStorage } from "@/service/auth.services";
import { getDeviceInfo } from "@/utils/getClientInfo";
import { getClientIp } from "@/utils/getClientIp";
import { SERVER_ERROR_MESSAGE } from "@/constant";

import logo from "@/assets/login.svg";
import Link from "next/link";

type TLogin = {
  username: string;
  password: string;
  extra?: {
    device: string;
    browser: string;
  };
  ip?: string;
  recaptchaToken?: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [captchaKey, setCaptchaKey] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>();

  const refreshCaptcha = () => {
    setCaptchaToken(null);
    setCaptchaKey((prev) => prev + 1);
  };

  const onSubmit: SubmitHandler<TLogin> = async (data) => {
    setErrorMsg("");

    if (!captchaToken) {
      setErrorMsg("অনুগ্রহ করে Google CAPTCHA যাচাই করুন।");
      return;
    }

    setIsLoading(true);

    try {
      const extraInfo = getDeviceInfo();
      const ip = await getClientIp();

      const loginData: TLogin = {
        ...data,
        extra: extraInfo,
        ip,
        recaptchaToken: captchaToken,
      };

      const result = await userLogin(loginData);

      if (result?.success && result?.redirectPath) {
        storeUserInLocalStorage(result?.data?.token);
        router.push(result.redirectPath);
      } else {
        setErrorMsg(result?.message || SERVER_ERROR_MESSAGE);
        refreshCaptcha();
      }
    } catch (error: unknown) {
      const message = (
        error as { data?: { message?: string } }
      )?.data?.message;

      setErrorMsg(message || SERVER_ERROR_MESSAGE);
      refreshCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#006A4E]">
      <div className="z-10 w-[90%] max-w-[700px]">
        <div className="px-4 sm:px-16">
          <MarqueeOneLine />
        </div>

        <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/90 p-4 shadow-lg md:flex-row md:gap-4 md:p-3">
          {/* Left Image */}
          <div className="flex w-full items-center justify-center md:w-1/2">
            <Image
              src={logo}
              alt="Login illustration"
              width={350}
              height={350}
              priority
              className="h-[200px] w-auto rounded-xl md:h-auto md:max-h-[400px] md:w-full"
            />
          </div>

          {/* Right Form */}
          <div className="w-full md:w-1/2 md:pr-5">
            <h2 className="mb-2 text-center text-2xl font-bold text-[#006A4E] md:text-3xl">
              আপনাকে স্বাগতম!
            </h2>

            <p className="mb-4 text-center text-gray-600">
              আপনার ব্যবসা পরিচালনার জন্য লগইন করুন
            </p>

            <form
              className="space-y-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              {errorMsg && (
                <p
                  role="alert"
                  className="px-2 text-center text-sm text-red-500"
                >
                  {errorMsg}
                </p>
              )}

              <CustomInput
                type="text"
                label="ইউজারনেম"
                name="username"
                placeholder="ইউজারনেম লিখুন"
                register={register}
                rules={{
                  required: "ইউজারনেম আবশ্যক।",
                }}
                error={errors.username}
              />

              <CustomInput
                label="পাসওয়ার্ড"
                name="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড লিখুন"
                register={register}
                rules={{
                  required: "পাসওয়ার্ড আবশ্যক।",
                }}
                error={errors.password}
              />
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-[#006A4E] hover:underline"
                >
                  পাসওয়ার্ড ভুলে গেছেন?
                </Link>
              </div>

              {/* Google reCAPTCHA */}
              <div className="flex justify-center overflow-hidden py-1">
                <ReCAPTCHA
                  key={captchaKey}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={(token) => {
                    setCaptchaToken(token);
                    setErrorMsg("");
                  }}
                  onExpired={() => setCaptchaToken(null)}
                  onErrored={() => {
                    setCaptchaToken(null);
                    setErrorMsg("CAPTCHA লোড হয়নি। আবার চেষ্টা করুন।");
                  }}
                  hl="en"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full cursor-pointer rounded-md bg-[#006A4E] py-2 font-semibold text-white transition hover:bg-[#006A4E]/90 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
