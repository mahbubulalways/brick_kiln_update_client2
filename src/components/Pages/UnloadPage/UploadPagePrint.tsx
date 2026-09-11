import { TUnloadResponse } from "@/interface/unload";
import { TVataInformation } from "@/interface/vata";
import { TClassAndRate } from "@/types/types";
import { formatBanglaDate } from "@/utils/formatBanglaDate";
import { toBanglaNumber } from "@/utils/toBanglaNumber";

type TUnloadPagePrintProps = {
  unloadData: TUnloadResponse[];
  date?: Date;
  classes: TClassAndRate[];
  vataInfo: TVataInformation
};

const UnloadPagePrint = ({
  unloadData = [],
  date = new Date(),
  classes = [],
  vataInfo
}: TUnloadPagePrintProps) => {
  // =====================================================
  // GET ROW TOTAL
  // =====================================================

  const getRowTotal = (row: TUnloadResponse) => {
    return (
      row.items?.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      ) || 0
    );
  };

  // =====================================================
  // GET SPECIFIC CLASS QUANTITY
  // =====================================================

  const getClassQuantity = (
    row: TUnloadResponse,
    classId: number
  ) => {
    const item = row.items?.find(
      (item) => item.classId === classId
    );

    return Number(item?.quantity || 0);
  };

  // =====================================================
  // TOTAL UNLOAD
  // =====================================================

  const totalUnload = unloadData.reduce(
    (total, row) => total + getRowTotal(row),
    0
  );

  return (
    <div
      id="unload-page-print"
      className="w-full bg-white text-black"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="text-center">
        <h1 className="text-[24px] font-bold leading-tight">
          {vataInfo?.nameBangla}
        </h1>

        <p className="text-[14px] font-medium mt-1">
          {vataInfo?.address}
        </p>

        <p className="text-[13px] mt-1">
          {vataInfo?.challanManagerPhoneNumber}
        </p>

        <p className="text-[13px]">
          {vataInfo?.ownerName}
        </p>
      </div>

      {/* =================================================
          DATE + TITLE + TOTAL
      ================================================= */}

      <div className="flex items-center justify-between mt-4">
        {/* DATE */}

        <p className="text-[12px] font-semibold">
          তারিখঃ{" "}
          {formatBanglaDate({
            date,
          })}
        </p>

        {/* TITLE */}

        <div className="bg-[#E5E7EB] rounded-full px-12 py-1">
          <p className="text-[15px] font-bold">
            আনলোড রিপোর্ট
          </p>
        </div>

        {/* TOTAL */}

        <p className="text-[12px] font-bold">
          সর্বমোট আনলোডঃ{" "}
          {toBanglaNumber(
            totalUnload.toLocaleString()
          )}
        </p>
      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <table className="w-full border-collapse mt-2 text-[10px]">
        <thead>
          <tr className="bg-[#F1F2F3]">
            {/* SERIAL */}

            <th className="border border-gray-300 py-1 px-1">
              নং
            </th>

            {/* DATE */}

            <th className="border border-gray-300 py-1 px-1">
              তারিখ
            </th>

            {/* ROUND */}

            <th className="border border-gray-300 py-1 px-1">
              রাউন্ড
            </th>

            {/* CLASS COLUMNS */}

            {classes.map((classItem) => (
              <th
                key={classItem.id}
                className="
                  border
                  border-gray-300
                  py-1
                  px-1
                  whitespace-nowrap
                "
              >
                {classItem.className}
              </th>
            ))}

            {/* TOTAL */}

            <th
              className="
                border
                border-gray-300
                py-1
                px-1
                whitespace-nowrap
              "
            >
              মোট ইট
            </th>
          </tr>
        </thead>

        <tbody>
          {unloadData.length > 0 ? (
            unloadData.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50"
              >
                {/* =====================================
                    SERIAL
                ===================================== */}

                <td className="border border-gray-300 py-1 px-1 text-center">
                  {toBanglaNumber(index + 1)}
                </td>

                {/* =====================================
                    DATE
                ===================================== */}

                <td className="border border-gray-300 py-1 px-1 text-center whitespace-nowrap">
                  {formatBanglaDate({
                    date: row.date,
                  })}
                </td>

                {/* =====================================
                    ROUND
                ===================================== */}

                <td className="border border-gray-300 py-1 px-1 text-center">
                  {toBanglaNumber(
                    row.round?.name || "-"
                  )}
                </td>

                {/* =====================================
                    CLASS QUANTITIES
                ===================================== */}

                {classes.map(
                  (classItem: TClassAndRate) => {
                    const quantity =
                      getClassQuantity(
                        row,
                        classItem?.id!
                      );

                    return (
                      <td
                        key={classItem.id}
                        className="
                          border
                          border-gray-300
                          py-1
                          px-1
                          text-center
                        "
                      >
                        {quantity > 0
                          ? toBanglaNumber(
                            quantity.toLocaleString()
                          )
                          : "-"}
                      </td>
                    );
                  }
                )}

                {/* =====================================
                    ROW TOTAL
                ===================================== */}

                <td
                  className="
                    border
                    border-gray-300
                    py-1
                    px-1
                    text-center
                    font-semibold
                  "
                >
                  {toBanglaNumber(
                    getRowTotal(row).toLocaleString()
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={classes.length + 4}
                className="
                  border
                  border-gray-300
                  py-3
                  text-center
                "
              >
                কোনো তথ্য পাওয়া যায়নি
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* =================================================
          SIGNATURE
      ================================================= */}

      <div className="grid grid-cols-2 mt-14">
        {/* MANAGER */}

        <div className="text-center">
          <div className="border-t border-black w-[85px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            ম্যানেজার
          </p>
        </div>

        {/* OWNER */}

        <div className="text-center">
          <div className="border-t border-black w-[85px] mx-auto" />

          <p className="text-[11px] font-semibold mt-1">
            মালিক
          </p>
        </div>
      </div>

      {/* =================================================
          FOOTER
      ================================================= */}

      {/* <div className="border-t border-gray-300 mt-7 pt-2 text-center">
        <p className="text-[7px] text-gray-400">
          রিপোর্ট প্রিন্টঃ{" "}
          {formatBanglaDate({
            date: new Date(),
          })}{" "}
          | Software by: Payratech.com
        </p>
      </div> */}
    </div>
  );
};

export default UnloadPagePrint;