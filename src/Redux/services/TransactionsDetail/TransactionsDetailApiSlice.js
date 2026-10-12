import { clearStorage } from "../../../common/constant/constant";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";

export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsData: builder.mutation({
      query: (params) => ({
        url: "wallet/transactionHistory",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    getTransactionListData: builder.mutation({
      query: (params) => ({
        url: "wallet/transactionHistory",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    getTransactionsRequest: builder.mutation({
      query: (params) => ({
        url: "wallet/get_allow_swap_coin_requests",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    getSwapRequestCount: builder.mutation({
      query: (params) => ({
        url: "wallet/allow_swap_coin_requests_count",
        method: "get",
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    swapAction: builder.mutation({
      query: (params) => ({
        url: "token/toogleSwap",
        method: "PUT",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    tokenShortlist: builder.mutation({
      query: (params) => ({
        url: "wallet/token_shortlist",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    ActionEnableDisable: builder.mutation({
      query: (params) => ({
        url: "token/toogleStatus",
        method: "PUT",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    MakeRemoveDefaultToken: builder.mutation({
      query: (params) => ({
        url: "wallet/set_default_token",
        method: "POST",
        body: params,
      }),
    }),
    getDefaultTokenList: builder.mutation({
      query: (params) => ({
        url: "wallet/list_default_token",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
    saveTokenReferralAccount: builder.mutation({
      query: (params) => ({
        url: "wallet/jupiter_fee_address",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    actionGetSolToken: builder.query({
      query: (params) => ({
        url: "wallet/sol_token_list",
        method: "GET",
      }),
    }),

    savedTokenListReferralAccount: builder.mutation({
      query: (params) => ({
        url: "wallet/get_jupiter_fee_address_list",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),

    referralFeeSetTokenList: builder.mutation({
      query: (params) => ({
        url: "wallet/jupiter_fee_sol_token_list",
        method: "GET"
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error.error.status == 408) {
            dispatch(
              setToast({
                message: "Session timeout , please login again",
                status: false,
              })
            );
            setTimeout(() => {
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
  useGetTransactionsDataMutation,
  useGetTransactionListDataMutation,
  useGetTransactionsRequestMutation,
  useSwapActionMutation,
  useActionEnableDisableMutation,
  useGetSwapRequestCountMutation,
  useTokenShortlistMutation,
  useMakeRemoveDefaultTokenMutation,
  useGetDefaultTokenListMutation,
  useSaveTokenReferralAccountMutation,
  useLazyActionGetSolTokenQuery,
  useSavedTokenListReferralAccountMutation,
  useReferralFeeSetTokenListMutation
} = transactionApiSlice;
