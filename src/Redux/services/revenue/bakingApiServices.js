import { clearStorage } from "../../../common/constant/constant";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";
import { setUser } from "../../slice/userSlice";

export const BankingApiService = apiSlice.injectEndpoints({
  tagTypes: ["banking"],
  endpoints: (builder) => ({
    getBankingData: builder.mutation({
      query: (params) => ({
        url: "revenue/swap",
        method: "POST",
        body: { ...params },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              //   window.location.reload();
              dispatch(setUser(null));
            }, 1000);
          }
        }
      },
    }),

    getTotalVolumeData: builder.mutation({
      query: (params) => ({
        url: "revenue/swap",
        method: "POST",
        body: { ...params },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              //   window.location.reload();
              dispatch(setUser(null));
            }, 1000);
          }
        }
      },
    }),

    getRevenueTransactionsData: builder.mutation({
      query: (params) => ({
        url: "revenue/trnx_history",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
           await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    getSpritzVolume: builder.mutation({
      query: (params) => ({
        url: "revenue/spritz",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
         await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    getVolumeEarning: builder.mutation({
      query: (params) => ({
        url: "revenue/volume_earning",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          if (error.error.status === 408) {
            // alert("Session timeout , please login again");
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              // localStorage.clear();
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
  }),
});

export const {
  useGetBankingDataMutation,
  useGetTotalVolumeDataMutation,
  useGetRevenueTransactionsDataMutation,
  useGetSpritzVolumeMutation,
  useGetVolumeEarningMutation,
} = BankingApiService;
