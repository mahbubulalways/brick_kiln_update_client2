"use client";

import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  XCircle,
} from "lucide-react";

import { useGetAllSendSmsQuery } from "@/redux/features/send.sms.features";

export default function SmsHistory() {
  const { data, isLoading, isError } = useGetAllSendSmsQuery(undefined);

  const smsList = data?.data ?? [];

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(date));

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-pink-500" />
            <p className="text-sm text-gray-500">SMS History লোড হচ্ছে...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <XCircle className="mx-auto mb-3 h-10 w-10 text-red-500" />
        <h3 className="font-semibold text-red-700">
          SMS History লোড করা যায়নি
        </h3>
        <p className="mt-1 text-sm text-red-500">
          কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            SMS History
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            আপনার পাঠানো SMS এর তালিকা
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-pink-50 px-4 py-2">
          <MessageSquareText className="h-5 w-5 text-pink-500" />
          <span className="text-sm font-medium text-pink-600">
            মোট {smsList.length} টি
          </span>
        </div>
      </div>

      {/* Empty */}
      {!smsList.length ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center">
          <MessageSquareText className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h3 className="font-medium text-gray-700">
            কোনো SMS পাওয়া যায়নি
          </h3>
          <p className="mt-1 text-sm text-gray-400">
            এখনো কোনো SMS পাঠানো হয়নি।
          </p>
        </div>
      ) : (
        /* Table */
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead className="border-b bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    #
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Phone Number
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Message
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Sent By
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Cost
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Status
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase text-gray-500">
                    Sent At
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {smsList.map((sms: any, index: number) => (
                  <tr
                    key={sms.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-700">
                        {sms.phoneNumber}
                      </span>
                    </td>

                    <td className="max-w-[350px] px-5 py-4">
                      <p className="whitespace-pre-line text-sm leading-6 text-gray-600">
                        {sms.message.trim()}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                        {sms.sendBy}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-gray-700">
                        ৳{Number(sms.cost).toFixed(2)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {sms.status === "SENT" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-600">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Sent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-50 px-3 py-1.5 text-xs font-medium text-yellow-600">
                          <Clock3 className="h-3.5 w-3.5" />
                          {sms.status}
                        </span>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-gray-500">
                      {formatDate(sms.sentAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}