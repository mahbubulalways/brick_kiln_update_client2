import { TQuery } from "@/interface/query";
import { baseApi } from "../baseApi";

const reportAPi = baseApi.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    //   GET SELL REPORT
    getSellReport: builder.query({
      query: () => ({
        url: "report/area",
      }),
    }),

    // DASHBOARD REPORT
    dashboardReport: builder.query({
      query: (query: TQuery) => ({
        url: `report/dashboard?date=${query.date}`,
      }),
    }),

    // LOAD UNLOAD
    loadUnloadReport: builder.query({
      query: () => ({
        url: "report/load-unload",
      }),
    }),
  }),
});

export const {
  useGetSellReportQuery,
  useDashboardReportQuery,
  useLoadUnloadReportQuery,
} = reportAPi;
