import { clearStorage } from "../../../common/constant/constant";
import { apiSlice } from "../../slice/apiSlice";
import { setToast } from "../../slice/toastSlice";

export const SettingServicesSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    googleAuthEnableDisable: builder.mutation({
      query: (params) => ({
        url: "auth/googleAuthEnabledisable",
        method: "POST",
        body: params,
      }),

    }),
    getGoogleAuthSecretKey: builder.query({
      query: () => ({
        url: "auth/googleAuthSecretkey",
        method: "GET",
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

    changePassword: builder.mutation({
      query: (params) => ({
        url: "auth/changePassword",
        method: "POST",
        body: params,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
        } catch (error) {
          if (error?.error?.status == 408) {
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
    verify2fa: builder.mutation({
      query: (params) => ({
        url: "auth/google2faVerify",
        method: "POST",
        body: params,
      }),
    }),

    appMaintenance: builder.query({
      query: (params) => ({
        url: "wallet/get_app_maintenance_list",
        method: "GET",
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

    enableDisableMaintanance: builder.mutation({
      query: (payload) => ({
        url: "wallet/update_app_maintenance",
        method: "POST",
        body: payload,
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

    //         url: '/request_list',
    //         method: 'POST',
    //         body: params,

    //         url: '/allow_swap',
    //         method: 'POST',

  }),
});

export const {
  useGoogleAuthEnableDisableMutation,
  useGetGoogleAuthSecretKeyQuery,
  useChangePasswordMutation,
  useVerify2faMutation,
  useLazyAppMaintenanceQuery,
  useEnableDisableMaintananceMutation,
} = SettingServicesSlice;
