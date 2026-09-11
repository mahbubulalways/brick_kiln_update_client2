"use client";

import { useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import { MdOutlineError, MdSms } from "react-icons/md";
import { SubmitHandler, useForm } from "react-hook-form";

import CustomModal from "@/components/Reusable/CustomModal";
import CustomTextArea from "@/components/Reusable/CustomTextArea";
import { showToast } from "@/components/Toast/CustomToast";

type TSmsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  customerId?: string;
};

type TSmsForm = {
  message: string;
};

const SMS_TEMPLATES = [
  {
    label: "বাকি জমা",
    message:
      "প্রিয় কাস্টমার, আপনার বকেয়া টাকা পরিশোধ করার জন্য অনুরোধ করা যাচ্ছে। ধন্যবাদ।",
  },
  {
    label: "বাকি পরিশোধ",
    message:
      "প্রিয় কাস্টমার, আপনার বকেয়া টাকা পরিশোধের সময় হয়েছে। অনুগ্রহ করে দ্রুত পরিশোধ করুন। ধন্যবাদ।",
  },
  {
    label: "ডেলিভারি",
    message:
      "প্রিয় কাস্টমার, আপনার অর্ডারের ইট ডেলিভারির জন্য প্রস্তুত রয়েছে। প্রয়োজনীয় ব্যবস্থা গ্রহণ করুন। ধন্যবাদ।",
  },
  {
    label: "ডেলিভারি সম্পন্ন",
    message:
      "প্রিয় কাস্টমার, আপনার অর্ডারের ইট ডেলিভারি সম্পন্ন হয়েছে। ধন্যবাদ।",
  },
  {
    label: "পেমেন্ট রিমাইন্ডার",
    message:
      "প্রিয় কাস্টমার, আপনার বকেয়া পেমেন্টের কথা স্মরণ করিয়ে দেওয়া হচ্ছে। অনুগ্রহ করে পেমেন্ট সম্পন্ন করুন। ধন্যবাদ।",
  },
  {
    label: "ধন্যবাদ",
    message:
      "আমাদের সাথে থাকার জন্য আপনাকে আন্তরিক ধন্যবাদ। আপনার সহযোগিতা আমাদের জন্য অত্যন্ত গুরুত্বপূর্ণ।",
  },
];

const SendCustomerSmsModal = ({
  isOpen,
  onClose,
  customerId,
}: TSmsModalProps) => {
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TSmsForm>({
    defaultValues: {
      message: "",
    },
  });

  const message = watch("message") || "";

  const handleTemplateClick = (template: string) => {
    setValue("message", template, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit: SubmitHandler<TSmsForm> = async (data) => {
    if (!customerId) {
      return showToast({
        title: "কাস্টমার নির্বাচন করা হয়নি",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }

    if (data.message.trim().length > 160) {
      return showToast({
        title: "এসএমএস ১৬০ অক্ষরের মধ্যে রাখুন",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    }

    try {
      setIsSending(true);

      const payload = {
        customerId,
        message: data.message.trim(),
      };

      console.log(payload);

      showToast({
        title: "এসএমএস সফলভাবে পাঠানো হয়েছে",
        type: "success",
        options: {
          duration: 4000,
          icon: <FaCircleCheck className="h-5 w-5" />,
        },
      });

      handleClose();
    } catch (error) {
      console.log(error);

      showToast({
        title: "এসএমএস পাঠানো যায়নি",
        type: "error",
        options: {
          duration: 4000,
          icon: <MdOutlineError className="h-5 w-5" />,
        },
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleClose}
      title="কাস্টমারকে এসএমএস পাঠান"
      width="md"
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <MdSms size={21} />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  দ্রুত মেসেজ নির্বাচন করুন
                </h3>

                <p className="text-xs text-gray-500">
                  মেসেজে ক্লিক করলে সরাসরি নিচের ঘরে বসে যাবে
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {SMS_TEMPLATES.map((template) => (
                <button
                  key={template.label}
                  type="button"
                  onClick={() => handleTemplateClick(template.message)}
                  className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                    message === template.message
                      ? "border-[#039A63] bg-[#039A63] text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#039A63] hover:bg-green-50 hover:text-[#039A63]"
                  }`}
                >
                  {template.label}
                </button>
              ))}
            </div>
          </div>

          <CustomTextArea
            name="message"
            label="এসএমএস"
            placeholder="কাস্টমারকে যে মেসেজটি পাঠাতে চান তা লিখুন..."
            register={register}
            rules={{
              required: "এসএমএস লিখুন",
              maxLength: {
                value: 160,
                message: "এসএমএস ১৬০ অক্ষরের মধ্যে রাখুন",
              },
            }}
            error={errors.message}
            rows={6}
          />

          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <span className="text-xs text-gray-500">
              সর্বোচ্চ ১৬০ অক্ষরের মধ্যে রাখুন
            </span>

            <span
              className={`text-xs font-medium ${
                message.length > 160 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {message.length}/160
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="w-full rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-600 transition hover:border-[#039A63] hover:text-[#039A63]"
            >
              ক্লিয়ার
            </button>

            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#039A63] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#028a58] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <MdSms size={18} />
              {isSending ? "পাঠানো হচ্ছে..." : "এসএমএস পাঠান"}
            </button>
          </div>
        </div>
      </form>
    </CustomModal>
  );
};

export default SendCustomerSmsModal;