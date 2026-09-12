import { TLoadResponse } from "@/interface/load";
import { TVataInformation } from "@/interface/vata";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TLoadPagePrintProps = {
  loadData: TLoadResponse[];
  date?: Date;
  vataInformation: TVataInformation
};

const LoadPagePrint = ({
  loadData = [],
  date = new Date(),
  vataInformation
}: TLoadPagePrintProps) => {
  // ================= TOTAL LOAD =================
  const totalLoad = loadData.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  return (
    <div
      id="load-page-print"
      className="w-full bg-white text-black"
    >
      {/* ================= HEADER ================= */}
      {/* Watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center select-none"
      >
        <span
          className="rotate-[-18deg] whitespace-nowrap font-extrabold text-black opacity-[0.04]"
          style={{
            fontSize: "170px",
          }}
        >
          {vataInformation?.shortForm
            ?.split("")
            .join(".")}
        </span>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-black">
        <div className="flex items-center justify-between border-b-2 border-black pb-2">
          {/* Short Form */}
          <div className="flex h-11 w-[85px] items-center justify-center rounded border-2 border-black bg-white text-[22px] font-extrabold leading-none tracking-wide">
            {vataInformation?.shortForm
              ?.split("")
              .join(".")}
          </div>

          {/* Owner Information */}
          <div className="min-w-[150px] text-right leading-tight">
            {vataInformation?.ownerName && (
              <p className="text-[13px] font-bold">
                প্রোঃ {vataInformation.ownerName}
              </p>
            )}

            {vataInformation?.ownerPhoneNumber && (
              <p className="mt-0.5 text-[14px] font-bold">
                {vataInformation.ownerPhoneNumber}
              </p>
            )}
          </div>
        </div>

        {/* Vata Name */}
        <div className="mt-3 text-center">
          <h1 className="text-[32px] font-extrabold leading-tight tracking-tight">
            {vataInformation?.nameBangla}
          </h1>

          {vataInformation?.shortDescription && (
            <p className="mt-1 text-[12px] font-semibold">
              {vataInformation.shortDescription}
            </p>
          )}
        </div>

        {/* Address */}
        {(vataInformation?.additionalAddress ||
          vataInformation?.address) && (
            <div className="mt-2 border-y border-black py-1.5 text-center text-[12px] font-semibold leading-tight">
              {vataInformation?.additionalAddress}

              {vataInformation?.additionalAddress &&
                vataInformation?.address
                ? " • "
                : ""}

              {vataInformation?.address}
            </div>
          )}

        {/* Contact Information */}
        {(vataInformation?.challanPersonOneName ||
          vataInformation?.challanPersonTwoName ||
          vataInformation?.challanManagerPhoneNumber) && (
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-center text-[11px] font-semibold">
              {vataInformation?.challanPersonOneName && (
                <span>
                  <span className="font-bold">
                    {vataInformation.challanPersonOneName}
                  </span>
                  :{" "}
                  {vataInformation.challanPersonOnePhoneNumber}
                </span>
              )}

              {vataInformation?.challanPersonTwoName && (
                <span>
                  <span className="font-bold">
                    {vataInformation.challanPersonTwoName}
                  </span>
                  :{" "}
                  {vataInformation.challanPersonTwoPhoneNumber}
                </span>
              )}

              {vataInformation?.challanManagerPhoneNumber && (
                <span>
                  <span className="font-bold">
                    ম্যানেজার
                  </span>
                  : {vataInformation.challanManagerPhoneNumber}
                </span>
              )}
            </div>
          )}
      </div>

      {/* ================= DATE + TITLE + TOTAL ================= */}
      <div className="flex items-center justify-between mt-4">
        {/* Date */}
        <p className="text-[12px] font-semibold">
          তারিখঃ{" "}
          {formatBanglaDate({
            date,
          })}
        </p>

        {/* Title */}
        <div className="bg-[#E5E7EB] rounded-full px-12 py-1">
          <p className="text-[15px] font-bold">
            লোডের রিপোর্ট
          </p>
        </div>

        {/* Total Load */}
        <p className="text-[12px] font-bold">
          মোট লোডঃ{" "}
          {toBanglaNumber(totalLoad.toLocaleString())}
        </p>
      </div>

      {/* ================= TABLE ================= */}
      <table className="w-full border-collapse mt-2 text-[11px]">
        <thead>
          <tr className="bg-[#F1F2F3]">
            {/* Serial */}
            <th className="border border-gray-300 py-1 px-2 w-[8%]">
              নং
            </th>

            {/* Date */}
            <th className="border border-gray-300 py-1 px-2 w-[18%]">
              তারিখ
            </th>

            {/* Round */}
            <th className="border border-gray-300 py-1 px-2 w-[15%]">
              রাউন্ড
            </th>

            {/* Description */}
            <th className="border border-gray-300 py-1 px-2 w-[39%]">
              লোডের বিবরণ
            </th>

            {/* Quantity */}
            <th className="border border-gray-300 py-1 px-2 w-[20%]">
              পরিমাণ
            </th>
          </tr>
        </thead>

        <tbody>
          {loadData.length > 0 ? (
            loadData.map((row, index) => (
              <tr key={row.id}>
                {/* Serial */}
                <td className="border border-gray-300 py-1 px-2 text-center">
                  {toBanglaNumber(index + 1)}
                </td>

                {/* Date */}
                <td className="border border-gray-300 py-1 px-2 text-center">
                  {formatBanglaDate({
                    date: row.date,
                  })}
                </td>

                {/* Round */}
                <td className="border border-gray-300 py-1 px-2 text-center">
                  {toBanglaNumber(row.round?.name) || "-"}
                </td>

                {/* Load Type */}
                <td className="border border-gray-300 py-1 px-2">
                  {row.loadType || "-"}
                </td>

                {/* Quantity */}
                <td className="border border-gray-300 py-1 px-2 text-center">
                  {toBanglaNumber(
                    Number(row.quantity || 0).toLocaleString()
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="border border-gray-300 py-3 text-center"
              >
                কোনো তথ্য পাওয়া যায়নি
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= SIGNATURE ================= */}
      <div className="grid grid-cols-2 mt-14">
        {/* Manager */}
        <div className="text-center">
          <div className="border-t border-black w-[85px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            ম্যানেজার
          </p>
        </div>

        {/* Owner */}
        <div className="text-center">
          <div className="border-t border-black w-[85px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            মালিক
          </p>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-gray-300 mt-7 pt-2 text-center">
        <p className="text-[7px] text-gray-400">
          রিপোর্ট প্রিন্টঃ{" "}
          {formatBanglaDate({
            date: new Date(),
          })}{" "}
          | Software by: Payratech.com
        </p>
      </div>
    </div>
  );
};

export default LoadPagePrint;