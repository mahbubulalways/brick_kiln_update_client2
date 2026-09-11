"use client";

import {
    Building2,
    CreditCard,
    ShieldCheck,
    UserRound,
} from "lucide-react";

import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import CustomDatePicker from "@/components/Reusable/CustomDatePicker";
import CustomInput from "@/components/Reusable/CustomInput";
import CustomSelect from "@/components/Reusable/CustomSelect";

import { useCreateNewVataMutation } from "@/redux/system.features/system.vata.features";
import { useGetSubscriptionOptionsQuery } from "@/redux/system.features/system.subscription.featurs";

import formatLabelValuePair from "@/utils/formatLabelValuePair";
import { handleApiError } from "@/utils/handleApiError";

export type TVata = {
    vata: {
        vataId: string;
        nameEnglish: string;
        nameBangla: string;
        address: string;
        subdomain: string;
        ownerName: string;
        ownerPhoneNumber: string;
        shortForm: string;
        challanManagerPhoneNumber: string;

        challanPersonOneName: string;
        challanPersonOnePhoneNumber: string;

        challanPersonTwoName: string;
        challanPersonTwoPhoneNumber: string;

        subscriptionPlanId: string;
        nextPaymentDate: string;
        shortDescription: string;
        additionalAddress: string;
    };

    owner: {
        name: string;
        username: string;
        password: string;
    };
};

const CreateBrickPage = () => {
    const [createNewVata, { isLoading }] = useCreateNewVataMutation();

    const {
        isLoading: optionsLoading,
        data,
        error,
    } = useGetSubscriptionOptionsQuery(undefined);

    const subscriptionOptions = formatLabelValuePair({
        data: data?.data,
        label: "name",
        value: "id",
    });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<TVata>({
        defaultValues: {
            vata: {
                vataId: "V001",
                nameEnglish: "মেসার্স সুভাষ ব্রিকস ম্যানুফ্যাকচারিং",
                nameBangla: "M/s. Subhash Bricks Manufacturing",
                address: "আমান উল্যাহ,  সুবর্ণচর, নোয়াখালী",
                subdomain: "suvasbricks",
                ownerName: "সুভাষ বাবু ",
                ownerPhoneNumber: "01407128177",
                shortForm: "SBM",
                challanManagerPhoneNumber: "01407128178",

                challanPersonOneName: "বিহার",
                challanPersonOnePhoneNumber: "01407128179",

                challanPersonTwoName: "বাবলু",
                challanPersonTwoPhoneNumber: "01407128180",

                subscriptionPlanId: "",
                nextPaymentDate: "",
                shortDescription: "এখানে অটো মন্ডিং মেশিনে উন্নত মানের ঈদ উৎপাদন ও সরবরাহ করা হয়",
                additionalAddress: "কচ্চব মার্কেট হইতে ৫০০ গজ পূর্বে রাস্তার উত্তর পার্শ্বে",
            },

            owner: {
                name: "Suvash Babu",
                username: "suvash",
                password: "12345678",
            },
        },
    });

    const onSubmit: SubmitHandler<TVata> = async (data) => {
        try {
            const res = await createNewVata(data).unwrap();

            if (res?.success) {
                toast.success("ভাটা সফলভাবে তৈরি হয়েছে");
            } else {
                toast.error(
                    res?.message || "ভাটা তৈরি করা যায়নি"
                );
            }
        } catch (error: any) {
            handleApiError({ error });
        }
    };

    return (
        <div className="min-h-full w-full bg-[#f8fafc]">
            <div className="mx-auto w-full max-w-7xl">
                <div className="mb-6 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#039A63]/10">
                                    <Building2
                                        size={19}
                                        className="text-[#039A63]"
                                        strokeWidth={2}
                                    />
                                </div>

                                <h1 className="text-lg font-semibold text-[#34495e] md:text-xl">
                                    নতুন ভাটা তৈরি করুন
                                </h1>
                            </div>

                            <p className="mt-1.5 text-sm text-gray-500">
                                নতুন ভাটা, সাবস্ক্রিপশন এবং অ্যাডমিন
                                অ্যাকাউন্ট তৈরি করুন।
                            </p>
                        </div>

                        <div className="hidden rounded-lg bg-[#039A63]/5 px-3 py-2 sm:block">
                            <span className="text-xs font-medium text-[#039A63]">
                                নতুন ভাটা
                            </span>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10">
                                    <Building2
                                        size={20}
                                        className="text-[#039A63]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-[#34495e]">
                                        ভাটার তথ্য
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        ভাটার পরিচয়, নাম, ঠিকানা ও যোগাযোগের তথ্য
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                                <CustomInput
                                    label="ভাটার আইডি"
                                    placeholder="VATA-001"
                                    type="text"
                                    error={errors.vata?.vataId}
                                    register={register}
                                    name="vata.vataId"
                                    rules={{
                                        required: "ভাটার আইডি দিন",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "ভাটার আইডি কমপক্ষে ৩ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message:
                                                "ভাটার আইডি সর্বোচ্চ ৫০ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="সাবডোমেইন"
                                    placeholder="royal-bricks"
                                    type="text"
                                    error={errors.vata?.subdomain}
                                    register={register}
                                    name="vata.subdomain"
                                    rules={{
                                        required: "সাবডোমেইন দিন",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "সাবডোমেইন কমপক্ষে ৩ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message:
                                                "সাবডোমেইন সর্বোচ্চ ৫০ অক্ষরের হতে পারে",
                                        },
                                        pattern: {
                                            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                            message:
                                                "সাবডোমেইনে শুধু ছোট হাতের ইংরেজি অক্ষর, সংখ্যা ও হাইফেন (-) ব্যবহার করুন",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="ভাটার নাম (ইংরেজি)"
                                    placeholder="Royal Bricks"
                                    type="text"
                                    error={errors.vata?.nameEnglish}
                                    register={register}
                                    name="vata.nameEnglish"
                                    rules={{
                                        required:
                                            "ভাটার ইংরেজি নাম দিন",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "ভাটার নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message:
                                                "ভাটার নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="ভাটার নাম (বাংলায়)"
                                    placeholder="রয়্যাল ব্রিকস"
                                    type="text"
                                    error={errors.vata?.nameBangla}
                                    register={register}
                                    name="vata.nameBangla"
                                    rules={{
                                        required:
                                            "ভাটার বাংলা নাম দিন",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "ভাটার নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message:
                                                "ভাটার নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="ভাটার সংক্ষিপ্ত নাম"
                                    placeholder="যেমন: SBM"
                                    type="text"
                                    error={errors.vata?.shortForm}
                                    register={register}
                                    name="vata.shortForm"
                                    rules={{
                                        required: "ভাটার সংক্ষিপ্ত নাম দিন",
                                        minLength: {
                                            value: 2,
                                            message: "সংক্ষিপ্ত নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 5,
                                            message: "সংক্ষিপ্ত নাম সর্বোচ্চ ৫ অক্ষরের হতে পারে",
                                        },
                                        pattern: {
                                            value: /^[A-Za-z]+$/,
                                            message: "শুধু ইংরেজি অক্ষর ব্যবহার করুন",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="ভাটার ঠিকানা"
                                    placeholder="ধামরাই, ঢাকা"
                                    type="text"
                                    error={errors.vata?.address}
                                    register={register}
                                    name="vata.address"
                                    rules={{
                                        required:
                                            "ভাটার ঠিকানা দিন",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "ঠিকানা কমপক্ষে ৩ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 255,
                                            message:
                                                "ঠিকানা সর্বোচ্চ ২৫৫ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="অতিরিক্ত ঠিকানা"
                                    placeholder="অতিরিক্ত ঠিকানা"
                                    type="text"
                                    error={
                                        errors.vata?.additionalAddress
                                    }
                                    register={register}
                                    name="vata.additionalAddress"
                                />

                                <CustomInput
                                    label="সংক্ষিপ্ত বিবরণ"
                                    placeholder="সংক্ষিপ্ত বিবরণ"
                                    type="text"
                                    error={
                                        errors.vata?.shortDescription
                                    }
                                    register={register}
                                    name="vata.shortDescription"
                                />

                                <CustomInput
                                    label="মালিকের নাম"
                                    placeholder="সোহেল মিয়া"
                                    type="text"
                                    error={errors.vata?.ownerName}
                                    register={register}
                                    name="vata.ownerName"
                                    rules={{
                                        required:
                                            "মালিকের নাম দিন",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "মালিকের নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 100,
                                            message:
                                                "মালিকের নাম সর্বোচ্চ ১০০ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="মালিকের ফোন নম্বর"
                                    placeholder="019XXXXXXXX"
                                    type="text"
                                    error={
                                        errors.vata?.ownerPhoneNumber
                                    }
                                    register={register}
                                    name="vata.ownerPhoneNumber"
                                    rules={{
                                        required:
                                            "মালিকের ফোন নম্বর দিন",
                                        pattern: {
                                            value: /^01[3-9]\d{8}$/,
                                            message:
                                                "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন",
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10">
                                    <CreditCard
                                        size={20}
                                        className="text-[#039A63]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-[#34495e]">
                                        চালান প্রিন্টের যোগাযোগ
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        চালান ও অন্যান্য প্রিন্টে প্রদর্শনের জন্য যোগাযোগের তথ্য
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
                                <CustomInput
                                    label="ম্যানেজারের ফোন নম্বর"
                                    placeholder="016XXXXXXXX"
                                    type="text"
                                    error={
                                        errors.vata
                                            ?.challanManagerPhoneNumber
                                    }
                                    register={register}
                                    name="vata.challanManagerPhoneNumber"
                                    rules={{
                                        pattern: {
                                            value: /^01[3-9]\d{8}$/,
                                            message:
                                                "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন",
                                        },
                                    }}
                                />

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                                    <CustomInput
                                        label="ব্যক্তি ১ নাম"
                                        placeholder="নাম লিখুন"
                                        type="text"
                                        error={
                                            errors.vata
                                                ?.challanPersonOneName
                                        }
                                        register={register}
                                        name="vata.challanPersonOneName"
                                    />

                                    <CustomInput
                                        label="ব্যক্তি ১ ফোন নম্বর"
                                        placeholder="017XXXXXXXX"
                                        type="text"
                                        error={
                                            errors.vata
                                                ?.challanPersonOnePhoneNumber
                                        }
                                        register={register}
                                        name="vata.challanPersonOnePhoneNumber"
                                        rules={{
                                            pattern: {
                                                value: /^01[3-9]\d{8}$/,
                                                message:
                                                    "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন",
                                            },
                                        }}
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-1">
                                    <CustomInput
                                        label="ব্যক্তি ২ নাম"
                                        placeholder="নাম লিখুন"
                                        type="text"
                                        error={
                                            errors.vata
                                                ?.challanPersonTwoName
                                        }
                                        register={register}
                                        name="vata.challanPersonTwoName"
                                    />

                                    <CustomInput
                                        label="ব্যক্তি ২ ফোন নম্বর"
                                        placeholder="018XXXXXXXX"
                                        type="text"
                                        error={
                                            errors.vata
                                                ?.challanPersonTwoPhoneNumber
                                        }
                                        register={register}
                                        name="vata.challanPersonTwoPhoneNumber"
                                        rules={{
                                            pattern: {
                                                value: /^01[3-9]\d{8}$/,
                                                message:
                                                    "সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন",
                                            },
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10">
                                    <CreditCard
                                        size={20}
                                        className="text-[#039A63]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-[#34495e]">
                                        সাবস্ক্রিপশন ও পেমেন্ট
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        সাবস্ক্রিপশন প্ল্যান এবং পরবর্তী
                                        পেমেন্টের তথ্য নির্বাচন করুন
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-2">
                                <CustomSelect
                                    label="সাবস্ক্রিপশন প্ল্যান"
                                    placeholder={
                                        optionsLoading
                                            ? "প্ল্যান লোড হচ্ছে..."
                                            : "সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন"
                                    }
                                    options={
                                        subscriptionOptions || []
                                    }
                                    control={control}
                                    name="vata.subscriptionPlanId"
                                    error={
                                        errors.vata
                                            ?.subscriptionPlanId
                                    }
                                    rules={{
                                        required:
                                            "সাবস্ক্রিপশন প্ল্যান নির্বাচন করুন",
                                    }}
                                />

                                <CustomDatePicker
                                    label="পরবর্তী পেমেন্টের তারিখ"
                                    error={
                                        errors.vata
                                            ?.nextPaymentDate
                                    }
                                    control={control}
                                    name="vata.nextPaymentDate"
                                    rules={{
                                        required:
                                            "পরবর্তী পেমেন্টের তারিখ দিন",
                                    }}
                                />
                            </div>
                        </div>
                    </section>

                    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                        <div className="border-b border-gray-100 bg-gradient-to-r from-[#039A63]/5 to-transparent px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#039A63]/10">
                                    <UserRound
                                        size={20}
                                        className="text-[#039A63]"
                                        strokeWidth={1.8}
                                    />
                                </div>

                                <div>
                                    <h2 className="text-base font-semibold text-[#34495e]">
                                        অ্যাডমিন ইউজারের তথ্য
                                    </h2>

                                    <p className="mt-0.5 text-xs text-gray-500">
                                        ভাটার জন্য অ্যাডমিন লগইন অ্যাকাউন্ট তৈরি করুন
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-5">
                            <div className="grid grid-cols-1 gap-x-5 gap-y-4 md:grid-cols-3">
                                <CustomInput
                                    label="ইউজারের নাম"
                                    placeholder="সোহেল মিয়া"
                                    type="text"
                                    error={errors.owner?.name}
                                    register={register}
                                    name="owner.name"
                                    rules={{
                                        required:
                                            "ইউজারের নাম দিন",
                                        minLength: {
                                            value: 2,
                                            message:
                                                "ইউজারের নাম কমপক্ষে ২ অক্ষরের হতে হবে",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="ইউজারনেম"
                                    placeholder="sohel"
                                    type="text"
                                    error={errors.owner?.username}
                                    register={register}
                                    name="owner.username"
                                    rules={{
                                        required:
                                            "ইউজারনেম দিন",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "ইউজারনেম কমপক্ষে ৩ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 30,
                                            message:
                                                "ইউজারনেম সর্বোচ্চ ৩০ অক্ষরের হতে পারে",
                                        },
                                        pattern: {
                                            value: /^[a-zA-Z0-9_]+$/,
                                            message:
                                                "ইউজারনেমে শুধু ইংরেজি অক্ষর, সংখ্যা এবং (_) ব্যবহার করুন",
                                        },
                                    }}
                                />

                                <CustomInput
                                    label="পাসওয়ার্ড"
                                    placeholder="••••••••"
                                    type="password"
                                    error={errors.owner?.password}
                                    register={register}
                                    name="owner.password"
                                    rules={{
                                        required:
                                            "পাসওয়ার্ড দিন",
                                        minLength: {
                                            value: 6,
                                            message:
                                                "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
                                        },
                                        maxLength: {
                                            value: 50,
                                            message:
                                                "পাসওয়ার্ড সর্বোচ্চ ৫০ অক্ষরের হতে পারে",
                                        },
                                    }}
                                />
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-lg border border-[#039A63]/10 bg-[#039A63]/5 p-3">
                                <ShieldCheck
                                    size={18}
                                    className="mt-0.5 shrink-0 text-[#039A63]"
                                />

                                <div>
                                    <p className="text-xs font-medium text-[#34495e]">
                                        নিরাপত্তা নির্দেশনা
                                    </p>

                                    <p className="mt-0.5 text-xs leading-5 text-gray-500">
                                        অ্যাডমিনের ইউজারনেম ও পাসওয়ার্ড
                                        নিরাপদে সংরক্ষণ করুন।
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-col-reverse gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-gray-500">
                            সব তথ্য সঠিকভাবে পূরণ করে ভাটা তৈরি করুন।
                        </p>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-[#039A63] px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#028653] hover:shadow-md active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                        >
                            {isLoading
                                ? "ভাটা তৈরি হচ্ছে..."
                                : "ভাটা তৈরি করুন"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateBrickPage;