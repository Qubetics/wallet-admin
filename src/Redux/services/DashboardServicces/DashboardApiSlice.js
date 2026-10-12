import { clearStorage } from "../../../common/constant/constant";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";

export const DashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNeWlyAddToken: builder.query({
      query: (params) => ({
        url: "wallet/newly_added_token",
        method: "GET",
        body: params,
      }),
    }),
    getDeviceUserData: builder.query({
      query: (params) => ({
        url: "wallet/dashboard",
        method: "GET",
        body: params,
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
              clearStorage();
              window.location.reload();
            }, 1000);
          }
        }
      },
    }),
  }),
});

export const { useGetNeWlyAddTokenQuery, useGetDeviceUserDataQuery } =
  DashboardApiSlice;
