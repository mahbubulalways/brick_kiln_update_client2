
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Lock,
    Mail,
    RefreshCw,
    UserRound,
    AlertCircle,
} from "lucide-react";

import {
    useForgotPasswordMutation,
    useResendCodeMutation,
    useResetPasswordMutation,
    useVerifyCodeMutation,
} from "@/redux/features/auth.features";

type TStep = "email" | "otp" | "password" | "success";

type TErrorField =
    | "identifier"
    | "otp"
    | "password"
    | "confirmPassword"
    | "";

const STATE_KEY = "itvata_forgot_password_state";
const TIMER_KEY = "itvata_forgot_password_expiry";
const COOLDOWN = 120;

const inputClass =
    "h-12 w-full rounded-xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#006A4E] focus:bg-white focus:ring-4 focus:ring-[#006A4E]/10";

const primaryBtn =
    "group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#006A4E] px-4 font-semibold text-white shadow-lg shadow-green-900/10 transition hover:bg-[#00563F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50";

const getApiErrorMessage = (error: unknown): string => {
    const apiError = error as {
        data?: {
            message?: string;
            errorMessages?: { message?: string }[];
        };
        message?: string;
    };

    return (
        apiError?.data?.message ||
        apiError?.data?.errorMessages?.[0]?.message ||
        apiError?.message ||
        "দুঃখিত, একটি সমস্যা হয়েছে। আবার চেষ্টা করুন।"
    );
};

export default function ForgotPasswordPage() {
    const [ready, setReady] = useState(false);
    const [step, setStep] = useState<TStep>("email");

    const [identifier, setIdentifier] = useState("");
    const [otp, setOtp] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [errorField, setErrorField] = useState<TErrorField>("");
    const [remaining, setRemaining] = useState(0);

    const identifierRef = useRef<HTMLInputElement>(null);
    const otpRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);

    const [userInfoAsync, { isLoading: forgotLoading }] =
        useForgotPasswordMutation();

    const [resendCodeAsync, { isLoading: resendLoading }] =
        useResendCodeMutation();

    const [verifyCodeAsync, { isLoading: verifyLoading }] =
        useVerifyCodeMutation();
    const [resetPasswordAsync, { isLoading: resetLoading }] =
        useResetPasswordMutation();

    const clearError = () => {
        setError("");
        setErrorField("");
    };

    const showFieldError = (
        message: string,
        field: TErrorField,
    ) => {
        setError(message);
        setErrorField(field);

        requestAnimationFrame(() => {
            const refs = {
                identifier: identifierRef,
                otp: otpRef,
                password: passwordRef,
                confirmPassword: confirmPasswordRef,
            };

            if (field) {
                refs[field].current?.focus();
            }
        });
    };

    const getInputClass = (field: TErrorField) =>
        `${inputClass} ${error && errorField === field
            ? "border-red-500 bg-red-50/70 focus:border-red-500 focus:ring-red-500/10"
            : ""
        }`;

    const ErrorMessage = () =>
        error ? (
            <p
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-600"
            >
                <AlertCircle
                    size={17}
                    className="mt-0.5 shrink-0"
                />
                <span>{error}</span>
            </p>
        ) : null;

    // Restore state after reload.
    useEffect(() => {
        try {
            const saved = JSON.parse(
                localStorage.getItem(STATE_KEY) || "null",
            );

            if (
                saved &&
                (saved.step === "otp" ||
                    saved.step === "password") &&
                typeof saved.identifier === "string" &&
                saved.identifier
            ) {
                setStep(saved.step);
                setIdentifier(saved.identifier);
            }
        } catch {
            localStorage.removeItem(STATE_KEY);
        }

        setReady(true);
    }, []);

    // Persist current step and identifier.
    useEffect(() => {
        if (!ready) return;

        if (step === "otp" || step === "password") {
            localStorage.setItem(
                STATE_KEY,
                JSON.stringify({ step, identifier }),
            );
        } else {
            localStorage.removeItem(STATE_KEY);
        }
    }, [ready, step, identifier]);

    // Persistent resend countdown.
    useEffect(() => {
        const tick = () => {
            const expiry = Number(
                localStorage.getItem(TIMER_KEY) || 0,
            );

            const seconds = Math.max(
                0,
                Math.ceil((expiry - Date.now()) / 1000),
            );

            setRemaining(seconds);

            if (!seconds) {
                localStorage.removeItem(TIMER_KEY);
            }
        };

        tick();

        const interval = window.setInterval(tick, 1000);

        return () => window.clearInterval(interval);
    }, []);

    const startTimer = () => {
        localStorage.setItem(
            TIMER_KEY,
            String(Date.now() + COOLDOWN * 1000),
        );

        setRemaining(COOLDOWN);
    };

    // Step 1: Send recovery code.
    const handleSendCode = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        clearError();

        const value = identifier.trim();

        if (!value) {
            showFieldError(
                "ইমেইল লিখুন।",
                "identifier",
            );
            return;
        }

        try {
            await userInfoAsync({
                email: value,
            }).unwrap();

            setOtp("");
            setStep("otp");
            startTimer();
        } catch (err) {
            showFieldError(
                getApiErrorMessage(err),
                "identifier",
            );
        }
    };

    // Step 2: Resend recovery code.
    const handleResend = async () => {
        if (remaining > 0 || resendLoading) return;

        clearError();

        try {
            await resendCodeAsync({
                email: identifier.trim(),
            }).unwrap();

            setOtp("");
            startTimer();

            requestAnimationFrame(() => otpRef.current?.focus());
        } catch (err) {
            showFieldError(
                getApiErrorMessage(err),
                "otp",
            );
        }
    };

    // Step 3: Verify recovery code.
    const handleVerify = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        clearError();

        if (otp.length !== 6) {
            showFieldError(
                "৬ সংখ্যার সঠিক কোড লিখুন।",
                "otp",
            );
            return;
        }

        try {
            await verifyCodeAsync({
                email: identifier.trim(),
                recoveryCode: otp,
            }).unwrap();

            localStorage.removeItem(TIMER_KEY);
            setRemaining(0);
            setStep("password");
        } catch (err) {
            showFieldError(
                getApiErrorMessage(err),
                "otp",
            );
        }
    };

    // Step 4: Local validation only.
    // Connect your reset-password API here before showing success.
    const handleReset = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();
        clearError();

        if (password.length < 8) {
            showFieldError(
                "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।",
                "password",
            );
            return;
        }

        if (password !== confirmPassword) {
            showFieldError(
                "দুটি পাসওয়ার্ড মিলছে না।",
                "confirmPassword",
            );
            return;
        }

        try {
            await resetPasswordAsync({
                email: identifier.trim(),
                newPassword: password,
                confirmPassword,
            }).unwrap();

            localStorage.removeItem(TIMER_KEY);
            localStorage.removeItem("itvata_forgot_password_state");

            setRemaining(0);
            setStep("success");
        } catch (err) {
            showFieldError(
                getApiErrorMessage(err),
                "password",
            );
        }
    };
    const goBackToEmail = () => {
        setStep("email");
        setOtp("");
        setPassword("");
        setConfirmPassword("");
        clearError();
    };

    const handleBack = () => {
        clearError();

        if (step === "otp") {
            goBackToEmail();
        } else if (step === "password") {
            setPassword("");
            setConfirmPassword("");
            setStep("otp");
        }
    };

    const formatTime = (seconds: number) =>
        `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(
            seconds % 60,
        ).padStart(2, "0")}`;

    const stepIndex =
        step === "email" ? 0 : step === "otp" ? 1 : 2;

    if (!ready) {
        return (
            <main className="min-h-screen bg-[#F4F8F5]" />
        );
    }

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F4F8F5] px-4 py-8">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />

            <div className="relative w-full max-w-md">
                <div className="rounded-[28px] border border-white bg-white p-6 shadow-2xl shadow-green-950/10 sm:p-8">
                    {step !== "success" && (
                        <div className="mb-4">
                            {step === "email" ? (
                                <Link
                                    href="/login"
                                    aria-label="লগইন পেজে ফিরে যান"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-emerald-50 hover:text-[#006A4E]"
                                >
                                    <ArrowLeft size={20} />
                                </Link>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleBack}
                                    aria-label="পূর্বের ধাপে ফিরে যান"
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-emerald-50 hover:text-[#006A4E]"
                                >
                                    <ArrowLeft size={20} />
                                </button>
                            )}
                        </div>
                    )}

                    {step !== "success" && (
                        <div className="mb-6 flex items-center gap-2">
                            {[0, 1, 2].map((index) => (
                                <div
                                    key={index}
                                    className={`h-1.5 flex-1 rounded-full transition-colors ${index <= stepIndex
                                        ? "bg-[#006A4E]"
                                        : "bg-gray-100"
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {/* Step 1 */}
                    {step === "email" && (
                        <>
                            <div className="mb-5">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#006A4E]">
                                    <KeyRound size={27} />
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                    পাসওয়ার্ড ভুলে গেছেন?
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    আপনার ইমেইল দিন।
                                    আমরা একটি যাচাইকরণ কোড পাঠাব।
                                </p>
                            </div>

                            <form
                                onSubmit={handleSendCode}
                                className="space-y-4"
                                noValidate
                            >
                                <ErrorMessage />

                                <div className="group relative">
                                    <UserRound
                                        size={19}
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errorField === "identifier" && error
                                            ? "text-red-500"
                                            : "text-gray-400 group-focus-within:text-[#006A4E]"
                                            }`}
                                    />

                                    <input
                                        ref={identifierRef}
                                        type="text"
                                        value={identifier}
                                        onChange={(event) => {
                                            setIdentifier(event.target.value);
                                            clearError();
                                        }}
                                        placeholder="ইমেইল বা ইউজারনেম"
                                        autoComplete="username"
                                        aria-invalid={
                                            !!error &&
                                            errorField === "identifier"
                                        }
                                        className={getInputClass("identifier")}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={forgotLoading}
                                    className={primaryBtn}
                                >
                                    {forgotLoading
                                        ? "কোড পাঠানো হচ্ছে..."
                                        : "কোড পাঠান"}

                                    {!forgotLoading && (
                                        <ArrowRight
                                            size={18}
                                            className="transition group-hover:translate-x-1"
                                        />
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    {/* Step 2 */}
                    {step === "otp" && (
                        <>
                            <div className="mb-5">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#006A4E]">
                                    <Mail size={27} />
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                    কোড লিখুন
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    আপনার ইমেইলে পাঠানো ৬ সংখ্যার
                                    কোডটি লিখুন।
                                </p>

                                <div className="mt-4 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                                    <p className="min-w-0 flex-1 break-all text-sm font-medium text-gray-700">
                                        {identifier}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={goBackToEmail}
                                        className="shrink-0 text-xs font-semibold text-[#006A4E] hover:underline"
                                    >
                                        পরিবর্তন
                                    </button>
                                </div>
                            </div>

                            <form
                                onSubmit={handleVerify}
                                className="space-y-4"
                                noValidate
                            >
                                <ErrorMessage />

                                <input
                                    ref={otpRef}
                                    type="text"
                                    inputMode="numeric"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(event) => {
                                        setOtp(
                                            event.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6),
                                        );
                                        clearError();
                                    }}
                                    placeholder="000000"
                                    aria-invalid={
                                        !!error && errorField === "otp"
                                    }
                                    className={`h-16 w-full rounded-xl border bg-gray-50 text-center text-3xl font-bold tracking-[0.45em] outline-none transition placeholder:text-gray-300 focus:bg-white focus:ring-4 ${error && errorField === "otp"
                                        ? "border-red-500 bg-red-50/70 text-red-600 focus:border-red-500 focus:ring-red-500/10"
                                        : "border-gray-200 text-[#006A4E] focus:border-[#006A4E] focus:ring-[#006A4E]/10"
                                        }`}
                                />

                                <button
                                    type="submit"
                                    disabled={
                                        otp.length !== 6 || verifyLoading
                                    }
                                    className={primaryBtn}
                                >
                                    {verifyLoading
                                        ? "যাচাই হচ্ছে..."
                                        : "যাচাই করুন"}

                                    {!verifyLoading && (
                                        <ArrowRight
                                            size={18}
                                            className="transition group-hover:translate-x-1"
                                        />
                                    )}
                                </button>
                            </form>

                            <div className="mt-4 flex min-h-10 items-center justify-center">
                                {remaining > 0 ? (
                                    <p className="text-center text-sm text-gray-500">
                                        নতুন কোড পাঠানো যাবে{" "}
                                        <span className="rounded-lg bg-emerald-50 px-2 py-1 font-bold tabular-nums text-[#006A4E]">
                                            {formatTime(remaining)}
                                        </span>{" "}
                                        পরে
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={resendLoading}
                                        onClick={handleResend}
                                        className="flex items-center gap-2 text-sm font-semibold text-[#006A4E] transition hover:underline disabled:opacity-50"
                                    >
                                        <RefreshCw
                                            size={16}
                                            className={
                                                resendLoading
                                                    ? "animate-spin"
                                                    : ""
                                            }
                                        />

                                        {resendLoading
                                            ? "নতুন কোড পাঠানো হচ্ছে..."
                                            : "কোড পাননি? আবার পাঠান"}
                                    </button>
                                )}
                            </div>
                        </>
                    )}

                    {/* Step 3 */}
                    {step === "password" && (
                        <>
                            <div className="mb-5">
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#006A4E]">
                                    <Lock size={27} />
                                </div>

                                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                                    নতুন পাসওয়ার্ড দিন
                                </h1>

                                <p className="mt-2 text-sm leading-6 text-gray-500">
                                    কমপক্ষে ৮ অক্ষরের একটি শক্তিশালী
                                    পাসওয়ার্ড বেছে নিন।
                                </p>
                            </div>

                            <form
                                onSubmit={handleReset}
                                className="space-y-4"
                                noValidate
                            >
                                <ErrorMessage />

                                <div className="group relative">
                                    <Lock
                                        size={19}
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errorField === "password" && error
                                            ? "text-red-500"
                                            : "text-gray-400 group-focus-within:text-[#006A4E]"
                                            }`}
                                    />

                                    <input
                                        ref={passwordRef}
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(event) => {
                                            setPassword(event.target.value);
                                            clearError();
                                        }}
                                        placeholder="নতুন পাসওয়ার্ড"
                                        autoComplete="new-password"
                                        aria-invalid={
                                            !!error &&
                                            errorField === "password"
                                        }
                                        className={`${getInputClass("password")} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((value) => !value)
                                        }
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#006A4E]"
                                        aria-label="Toggle password visibility"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>
                                </div>

                                <div className="group relative">
                                    <Lock
                                        size={19}
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 transition ${errorField === "confirmPassword" &&
                                            error
                                            ? "text-red-500"
                                            : "text-gray-400 group-focus-within:text-[#006A4E]"
                                            }`}
                                    />

                                    <input
                                        ref={confirmPasswordRef}
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={confirmPassword}
                                        onChange={(event) => {
                                            setConfirmPassword(
                                                event.target.value,
                                            );
                                            clearError();
                                        }}
                                        placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                                        autoComplete="new-password"
                                        aria-invalid={
                                            !!error &&
                                            errorField === "confirmPassword"
                                        }
                                        className={getInputClass(
                                            "confirmPassword",
                                        )}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className={primaryBtn}
                                >
                                    পাসওয়ার্ড পরিবর্তন করুন
                                    <ArrowRight
                                        size={18}
                                        className="transition group-hover:translate-x-1"
                                    />
                                </button>
                            </form>
                        </>
                    )}

                    {/* Success */}
                    {step === "success" && (
                        <div className="py-2 text-center">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-[#006A4E]">
                                <CheckCircle2 size={44} />
                            </div>

                            <h1 className="text-2xl font-extrabold text-gray-900">
                                পাসওয়ার্ড পরিবর্তন সম্পন্ন!
                            </h1>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                এখন নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারবেন।
                            </p>

                            <Link
                                href="/login"
                                className={`${primaryBtn} mt-5`}
                            >
                                লগইন করুন
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    {step !== "success" && (
                        <div className="mt-5 border-t border-gray-100 pt-4">
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-[#006A4E]"
                            >
                                <ArrowLeft size={16} />
                                লগইন পেজে ফিরে যান
                            </Link>
                        </div>
                    )}
                </div>

                <p className="mt-6 text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} IT Vata · All rights reserved
                </p>
            </div>
        </main>
    );
}
